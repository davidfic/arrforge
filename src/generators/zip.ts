import JSZip from 'jszip';
import type { WizardState } from '../types';
import { generateCompose } from './compose';
import { generateEnv } from './env';
import { generateReadme } from './readme';
import { generateAdvanced } from './advanced';
import { generateVpnCompose } from './vpn';
import { generatePerHost } from './multihost';
import { getRequiredDirs } from './folders';

function addDirsToZip(zip: JSZip, selectedApps: string[]) {
  for (const dir of getRequiredDirs(selectedApps)) {
    // JSZip creates directory entries when the path ends with /
    zip.folder(dir);
  }
}

export async function buildZipBlob(state: WizardState): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('media-stack')!;

  const isMultiHost = state.multiHost && state.hosts.length > 1;

  if (isMultiHost) {
    const perHost = generatePerHost(state);
    for (const host of perHost) {
      const hostFolder = folder.folder(host.hostName)!;
      hostFolder.file('docker-compose.yml', host.compose);
      hostFolder.file('.env', host.env);
      hostFolder.file('README.md', host.readme);
      if (host.vpn) {
        hostFolder.file('docker-compose.vpn.yml', host.vpn);
      }
      addDirsToZip(hostFolder, host.apps);
    }
    folder.file('ADVANCED.md', generateAdvanced(state));
  } else {
    folder.file('docker-compose.yml', generateCompose(state));
    folder.file('.env', generateEnv(state));
    folder.file('README.md', generateReadme(state));
    folder.file('ADVANCED.md', generateAdvanced(state));

    if (state.includeVpnCompose) {
      folder.file('docker-compose.vpn.yml', generateVpnCompose(state));
    }

    addDirsToZip(folder, state.selectedApps);
  }

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
}

export function buildComposeBlob(state: WizardState): Blob {
  const content = generateCompose(state);
  return new Blob([content], { type: 'application/x-yaml' });
}

// --- tar.gz generation (no extra dependencies) ---

function encodeUTF8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function tarHeader(name: string, size: number, isDir: boolean): Uint8Array {
  const header = new Uint8Array(512);

  // name (0-99)
  const nameBytes = encodeUTF8(name);
  header.set(nameBytes.subarray(0, 100), 0);

  // mode (100-107)
  const mode = encodeUTF8(isDir ? '0000755\0' : '0000644\0');
  header.set(mode, 100);

  // uid (108-115), gid (116-123)
  header.set(encodeUTF8('0001000\0'), 108);
  header.set(encodeUTF8('0001000\0'), 116);

  // size (124-135) — octal, 11 digits + null
  const sizeStr = size.toString(8).padStart(11, '0') + '\0';
  header.set(encodeUTF8(sizeStr), 124);

  // mtime (136-147) — current time
  const mtime = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0';
  header.set(encodeUTF8(mtime), 136);

  // typeflag (156)
  header[156] = isDir ? 53 : 48; // '5' for dir, '0' for file

  // magic (257-262) "ustar\0"
  header.set(encodeUTF8('ustar\0'), 257);

  // version (263-264) "00"
  header.set(encodeUTF8('00'), 263);

  // checksum (148-155) — compute over header with checksum field as spaces
  header.set(encodeUTF8('        '), 148);
  let checksum = 0;
  for (let i = 0; i < 512; i++) checksum += header[i];
  const chkStr = checksum.toString(8).padStart(6, '0') + '\0 ';
  header.set(encodeUTF8(chkStr), 148);

  return header;
}

function buildTarball(files: { name: string; content: string }[], dirs: string[]): Uint8Array {
  const parts: Uint8Array[] = [];

  // Add directories first
  for (const dir of dirs) {
    const dirName = dir.endsWith('/') ? dir : dir + '/';
    parts.push(tarHeader(dirName, 0, true));
  }

  // Add files
  for (const file of files) {
    const data = encodeUTF8(file.content);
    parts.push(tarHeader(file.name, data.length, false));
    parts.push(data);
    // Pad to 512-byte boundary
    const remainder = data.length % 512;
    if (remainder > 0) {
      parts.push(new Uint8Array(512 - remainder));
    }
  }

  // End-of-archive marker (two 512-byte zero blocks)
  parts.push(new Uint8Array(1024));

  const totalSize = parts.reduce((sum, p) => sum + p.length, 0);
  const tarball = new Uint8Array(totalSize);
  let offset = 0;
  for (const part of parts) {
    tarball.set(part, offset);
    offset += part.length;
  }
  return tarball;
}

export async function buildTgzBlob(state: WizardState): Promise<Blob> {
  const prefix = 'media-stack/';
  const files: { name: string; content: string }[] = [];
  const dirs: string[] = [];
  const isMultiHost = state.multiHost && state.hosts.length > 1;

  // Collect all unique parent directories for both files and required dirs
  const dirSet = new Set<string>();
  dirSet.add(prefix);

  const addDir = (path: string) => {
    // Ensure all parent directories are included
    const segments = path.split('/');
    for (let i = 1; i <= segments.length; i++) {
      dirSet.add(segments.slice(0, i).join('/') + '/');
    }
  };

  if (isMultiHost) {
    const perHost = generatePerHost(state);
    for (const host of perHost) {
      const hp = prefix + host.hostName + '/';
      addDir(hp);
      files.push({ name: hp + 'docker-compose.yml', content: host.compose });
      files.push({ name: hp + '.env', content: host.env });
      files.push({ name: hp + 'README.md', content: host.readme });
      if (host.vpn) {
        files.push({ name: hp + 'docker-compose.vpn.yml', content: host.vpn });
      }
      for (const d of getRequiredDirs(host.apps)) {
        addDir(hp + d + '/');
      }
    }
    files.push({ name: prefix + 'ADVANCED.md', content: generateAdvanced(state) });
  } else {
    files.push({ name: prefix + 'docker-compose.yml', content: generateCompose(state) });
    files.push({ name: prefix + '.env', content: generateEnv(state) });
    files.push({ name: prefix + 'README.md', content: generateReadme(state) });
    files.push({ name: prefix + 'ADVANCED.md', content: generateAdvanced(state) });

    if (state.includeVpnCompose) {
      files.push({ name: prefix + 'docker-compose.vpn.yml', content: generateVpnCompose(state) });
    }

    for (const d of getRequiredDirs(state.selectedApps)) {
      addDir(prefix + d + '/');
    }
  }

  // Sort dirs so parents come before children
  dirs.push(...[...dirSet].sort());

  const tarball = buildTarball(files, dirs);

  // gzip using CompressionStream API
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(tarball.buffer as ArrayBuffer);
  writer.close();

  const chunks: Uint8Array[] = [];
  const reader = cs.readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalSize = chunks.reduce((sum, c) => sum + c.length, 0);
  const gzipped = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    gzipped.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([gzipped], { type: 'application/gzip' });
}
