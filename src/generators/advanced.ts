import type { WizardState } from '../types';
import { getAppById } from '../data/apps';

export function generateAdvanced(state: WizardState): string {
  const lines: string[] = [];

  lines.push('# Advanced Configuration');
  lines.push('');
  lines.push('This guide covers advanced topics for your media server stack.');
  lines.push('');

  // VPN
  lines.push('## VPN Setup');
  lines.push('');
  lines.push('Running your download clients through a VPN is **strongly recommended**.');
  lines.push('');
  if (state.includeVpnCompose) {
    lines.push('A `docker-compose.vpn.yml` file has been included. To use it:');
    lines.push('');
    lines.push('```bash');
    lines.push('# Start with VPN');
    lines.push('docker compose -f docker-compose.yml -f docker-compose.vpn.yml up -d');
    lines.push('```');
    lines.push('');
    lines.push('Edit the VPN environment variables in `docker-compose.vpn.yml` with your provider details.');
  } else {
    lines.push('To add VPN support later, use [gluetun](https://github.com/qdm12/gluetun):');
    lines.push('');
    lines.push('1. Add a gluetun service to your compose file');
    lines.push('2. Route download client traffic through it with `network_mode: "service:gluetun"`');
    lines.push('3. Move download client ports to the gluetun service');
  }
  lines.push('');

  // Custom networking
  lines.push('## Custom Networking');
  lines.push('');
  lines.push(`Your services use the \`${state.networkName}\` Docker network.`);
  lines.push('Services can reach each other by container name (e.g., `http://sonarr:8989`).');
  lines.push('');
  lines.push('To use an existing network instead:');
  lines.push('');
  lines.push('```yaml');
  lines.push('networks:');
  lines.push(`  ${state.networkName}:`);
  lines.push('    external: true');
  lines.push('```');
  lines.push('');

  // Port conflicts
  lines.push('## Port Conflicts');
  lines.push('');
  lines.push('If a port is already in use on your host, change the **host** port (left side) in your compose file:');
  lines.push('');
  lines.push('```yaml');
  lines.push('ports:');
  lines.push('  - "9090:8080"  # Changed host port from 8080 to 9090');
  lines.push('```');
  lines.push('');

  // TRaSH guide links per app
  const appsWithTrash = state.selectedApps
    .map(getAppById)
    .filter((a) => a?.trashUrl);

  if (appsWithTrash.length > 0) {
    lines.push('## TRaSH Guides');
    lines.push('');
    lines.push('Recommended reading for optimal configuration:');
    lines.push('');
    for (const app of appsWithTrash) {
      if (!app) continue;
      lines.push(`- [${app.name}](${app.trashUrl})`);
    }
    lines.push('');
  }

  // Hardware transcoding
  if (state.selectedApps.some((id) => ['plex', 'jellyfin', 'emby'].includes(id))) {
    lines.push('## Hardware Transcoding');
    lines.push('');
    lines.push('To enable hardware transcoding (Intel Quick Sync, NVIDIA, etc.):');
    lines.push('');
    lines.push('### Intel Quick Sync');
    lines.push('');
    lines.push('Add to your media server service:');
    lines.push('');
    lines.push('```yaml');
    lines.push('devices:');
    lines.push('  - /dev/dri:/dev/dri');
    lines.push('```');
    lines.push('');
    lines.push('### NVIDIA GPU');
    lines.push('');
    lines.push('1. Install [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)');
    lines.push('2. Add to your media server service:');
    lines.push('');
    lines.push('```yaml');
    lines.push('runtime: nvidia');
    lines.push('environment:');
    lines.push('  - NVIDIA_VISIBLE_DEVICES=all');
    lines.push('```');
    lines.push('');
  }

  // App-specific docs
  lines.push('## Documentation Links');
  lines.push('');
  for (const appId of state.selectedApps) {
    const app = getAppById(appId);
    if (!app) continue;
    lines.push(`- [${app.name}](${app.docUrl})`);
  }
  lines.push('');

  return lines.join('\n');
}
