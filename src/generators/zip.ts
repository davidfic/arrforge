import JSZip from 'jszip';
import type { WizardState } from '../types';
import { generateCompose } from './compose';
import { generateEnv } from './env';
import { generateReadme } from './readme';
import { generateAdvanced } from './advanced';
import { generateVpnCompose } from './vpn';
import { generatePerHost } from './multihost';

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
  }

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
}

export function buildComposeBlob(state: WizardState): Blob {
  const content = generateCompose(state);
  return new Blob([content], { type: 'application/x-yaml' });
}
