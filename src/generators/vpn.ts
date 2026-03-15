import type { WizardState } from '../types';
import { getAppById } from '../data/apps';

const DOWNLOAD_CLIENT_IDS = ['qbittorrent', 'transmission', 'sabnzbd', 'nzbget', 'deluge'];

export function generateVpnCompose(state: WizardState): string {
  const downloadClients = state.selectedApps.filter((id) =>
    DOWNLOAD_CLIENT_IDS.includes(id),
  );

  const lines: string[] = [];

  lines.push('# VPN Compose Override');
  lines.push('# Usage: docker compose -f docker-compose.yml -f docker-compose.vpn.yml up -d');
  lines.push('#');
  lines.push('# Configure your VPN provider below. See https://github.com/qdm12/gluetun/wiki');
  lines.push('');
  lines.push('services:');
  lines.push('  gluetun:');
  lines.push('    image: qmcgaw/gluetun:latest');
  lines.push('    container_name: gluetun');
  lines.push('    cap_add:');
  lines.push('      - NET_ADMIN');
  lines.push('    environment:');
  lines.push('      - VPN_SERVICE_PROVIDER=YOUR_PROVIDER  # e.g., mullvad, nordvpn, surfshark');
  lines.push('      - VPN_TYPE=wireguard                  # or openvpn');
  lines.push('      # Add your provider-specific credentials below:');
  lines.push('      # - WIREGUARD_PRIVATE_KEY=your_key');
  lines.push('      # - WIREGUARD_ADDRESSES=your_address');
  lines.push('      # - SERVER_COUNTRIES=your_country');

  // Collect all ports from download clients that will route through gluetun
  // Track used host ports to avoid duplicates (e.g., qbit+sabnzbd both use 8080)
  const usedHostPorts = new Set<string>();
  const allPorts: string[] = [];
  for (const clientId of downloadClients) {
    const app = getAppById(clientId);
    if (!app) continue;
    for (const port of app.ports) {
      const proto = port.protocol && port.protocol !== 'tcp' ? `/${port.protocol}` : '';
      const key = `${port.host}${proto}`;
      if (usedHostPorts.has(key)) continue;
      usedHostPorts.add(key);
      allPorts.push(`      - "${port.host}:${port.container}${proto}"`);
    }
  }

  if (allPorts.length > 0) {
    lines.push('    ports:');
    lines.push(`      # Ports for download clients routed through VPN`);
    lines.push(...allPorts);
  }

  lines.push('    restart: unless-stopped');
  lines.push('');

  // Override download clients to use gluetun's network
  for (const clientId of downloadClients) {
    const app = getAppById(clientId);
    if (!app) continue;

    lines.push(`  ${app.id}:`);
    lines.push(`    network_mode: "service:gluetun"`);
    lines.push(`    depends_on:`);
    lines.push(`      - gluetun`);
    // Remove ports since they're now on gluetun
    lines.push(`    # Ports moved to gluetun service above`);
    lines.push(`    ports: !reset []`);
    lines.push('');
  }

  return lines.join('\n');
}
