import type { WizardState } from '../types';
import { getAppById } from '../data/apps';

const TORRENT_CLIENTS = ['qbittorrent', 'transmission', 'deluge'];
const USENET_CLIENTS = ['sabnzbd', 'nzbget'];

interface MediaDir {
  name: string;
  label: string;
  apps: string[];
}

const MEDIA_DIRS: MediaDir[] = [
  { name: 'movies', label: 'Movie library', apps: ['radarr', 'luminarr'] },
  { name: 'tv', label: 'TV show library', apps: ['sonarr'] },
  { name: 'music', label: 'Music library', apps: ['lidarr'] },
  { name: 'books', label: 'Book library', apps: ['readarr'] },
];

/** Returns the list of directories that should be created based on selected apps. */
export function getRequiredDirs(selectedApps: string[]): string[] {
  const dirs: string[] = [];
  const hasTorrents = selectedApps.some((id) => TORRENT_CLIENTS.includes(id));
  const hasUsenet = selectedApps.some((id) => USENET_CLIENTS.includes(id));
  const activeMedia = MEDIA_DIRS.filter((d) => d.apps.some((a) => selectedApps.includes(a)));

  if (hasTorrents) dirs.push('torrents');
  if (hasUsenet) dirs.push('usenet');
  for (const dir of activeMedia) {
    dirs.push(`media/${dir.name}`);
  }

  const configApps = selectedApps.map((id) => getAppById(id)).filter(Boolean);
  for (const app of configApps) {
    dirs.push(`config/${app!.id}`);
  }

  return dirs;
}

export function generateFolderGuide(state: WizardState): string {
  const lines: string[] = [];
  const selected = state.selectedApps;
  const bp = state.basePath;

  const hasTorrents = selected.some((id) => TORRENT_CLIENTS.includes(id));
  const hasUsenet = selected.some((id) => USENET_CLIENTS.includes(id));
  const activeMedia = MEDIA_DIRS.filter((d) => d.apps.some((a) => selected.includes(a)));
  const hasMediaServer = selected.some((id) => ['plex', 'jellyfin', 'emby'].includes(id));

  // Header
  lines.push('# Folder Structure Guide');
  lines.push('');
  lines.push('Based on your selected apps, here is the recommended folder structure');
  lines.push('following [TRaSH Guides](https://trash-guides.info/Hardlinks/How-to-setup-for/Docker/).');
  lines.push('');

  // Tree diagram
  lines.push('```');
  lines.push(`${bp}/`);

  if (hasTorrents) {
    lines.push(`├── torrents/           # Torrent downloads`);
  }
  if (hasUsenet) {
    lines.push(`├── usenet/             # Usenet downloads`);
  }
  if (activeMedia.length > 0) {
    lines.push(`├── media/`);
    activeMedia.forEach((dir, i) => {
      const prefix = i === activeMedia.length - 1 ? '└' : '├';
      lines.push(`│   ${prefix}── ${dir.name}/${' '.repeat(Math.max(0, 13 - dir.name.length))}# ${dir.label}`);
    });
  }
  lines.push(`└── config/             # App configs (auto-created)`);
  lines.push('```');
  lines.push('');

  // mkdir command
  const mkdirParts: string[] = [];
  if (hasTorrents) mkdirParts.push('torrents');
  if (hasUsenet) mkdirParts.push('usenet');
  if (activeMedia.length > 0) {
    const mediaDirs = activeMedia.map((d) => d.name).join(',');
    mkdirParts.push(activeMedia.length === 1 ? `media/${activeMedia[0].name}` : `media/{${mediaDirs}}`);
  }
  mkdirParts.push('config');

  lines.push('## Create directories');
  lines.push('');
  lines.push('```bash');
  if (mkdirParts.length === 1) {
    lines.push(`mkdir -p ${bp}/${mkdirParts[0]}`);
  } else {
    lines.push(`mkdir -p ${bp}/{${mkdirParts.join(',')}}`);
  }
  lines.push('```');
  lines.push('');

  // Config directories per selected app
  const configApps = selected.map((id) => getAppById(id)).filter(Boolean);
  if (configApps.length > 0) {
    const configDirs = configApps.map((a) => a!.id).join(',');
    lines.push('App config directories (created automatically by Docker, but you can pre-create):');
    lines.push('');
    lines.push('```bash');
    lines.push(`mkdir -p ${bp}/config/{${configDirs}}`);
    lines.push('```');
    lines.push('');
  }

  // Hardlinks explanation
  if ((hasTorrents || hasUsenet) && activeMedia.length > 0) {
    lines.push('## Why this structure?');
    lines.push('');
    lines.push('Keeping downloads and media under the same parent path enables **hardlinks**');
    lines.push('and **atomic moves**:');
    lines.push('');
    lines.push('- No extra disk space used when files move from downloads to library');
    lines.push('- Instant file moves instead of slow copy + delete');
    lines.push('- Seeding continues after import (hardlinks share the same inode)');
    if (hasMediaServer) {
      lines.push('- Your media server sees the organized library, not raw downloads');
    }
    lines.push('');
    lines.push('> All volumes in your docker-compose.yml map to the same base path');
    lines.push(`> (\`${bp}\`) so containers can create hardlinks across directories.`);
    lines.push('');
  }

  return lines.join('\n');
}
