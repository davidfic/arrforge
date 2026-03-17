import type { WizardState, AppConfig, AppDefinition } from '../types';
import { getAppById } from '../data/apps';
import { getConnectionsFrom } from '../data/connections';

function resolveImage(app: AppDefinition, config?: AppConfig): string {
  if (!config?.imageTag) return app.image;
  const base = app.image.split(':')[0];
  return `${base}:${config.imageTag}`;
}

function resolveContainerName(app: AppDefinition, config?: AppConfig): string {
  return config?.containerName || app.id;
}

// Port conflict pairs: if both selected, offset the second one
const PORT_CONFLICTS: { appA: string; appB: string; port: number; offset: number }[] = [
  { appA: 'qbittorrent', appB: 'sabnzbd', port: 8080, offset: 8081 },
  { appA: 'jellyfin', appB: 'emby', port: 8096, offset: 8097 },
];

function getPortOverrides(selectedApps: string[]): Record<string, { overrides: Record<number, number>; conflictWith: string }> {
  const result: Record<string, { overrides: Record<number, number>; conflictWith: string }> = {};
  for (const { appA, appB, port, offset } of PORT_CONFLICTS) {
    if (selectedApps.includes(appA) && selectedApps.includes(appB)) {
      if (!result[appB]) result[appB] = { overrides: {}, conflictWith: appA };
      result[appB].overrides[port] = offset;
    }
  }
  return result;
}

export function generateCompose(state: WizardState): string {
  const lines: string[] = [];
  const portOverrides = getPortOverrides(state.selectedApps);
  const networkApps: string[] = [];

  lines.push('services:');

  for (const appId of state.selectedApps) {
    const app = getAppById(appId);
    if (!app) continue;

    const config = state.appConfigs[appId];
    const containerName = resolveContainerName(app, config);
    const image = resolveImage(app, config);

    lines.push(`  ${containerName}:`);
    lines.push(`    image: ${image}`);
    lines.push(`    container_name: ${containerName}`);

    if (app.networkMode) {
      lines.push(`    network_mode: ${app.networkMode}`);
    } else {
      networkApps.push(containerName);
    }

    lines.push(`    restart: unless-stopped`);

    // Depends on (only connections explicitly marked as startup dependencies)
    const deps = getConnectionsFrom(appId, state.selectedApps).filter((c) => c.dependsOn);
    const depNames = [...new Set(deps.map((d) => {
      const depConfig = state.appConfigs[d.to];
      const depApp = getAppById(d.to);
      return depApp ? resolveContainerName(depApp, depConfig) : d.to;
    }))];

    if (depNames.length > 0) {
      lines.push(`    depends_on:`);
      for (const dep of depNames) {
        lines.push(`      - ${dep}`);
      }
    }

    // Environment
    const envLines: string[] = [];
    if (!app.env || !('PUID' in app.env)) {
      envLines.push(`      - PUID=\${PUID}`);
      envLines.push(`      - PGID=\${PGID}`);
      envLines.push(`      - TZ=\${TZ}`);
    }
    if (app.env) {
      for (const [key, val] of Object.entries(app.env)) {
        envLines.push(`      - ${key}=${val}`);
      }
    }
    // nginx-proxy-manager doesn't use PUID/PGID/TZ — skip for it
    if (app.id === 'nginx-proxy-manager') {
      envLines.length = 0;
    }
    // flaresolverr doesn't need PUID/PGID
    if (app.id === 'flaresolverr') {
      envLines.length = 0;
      envLines.push(`      - TZ=\${TZ}`);
    }

    // Append custom env vars from per-app config
    if (config?.customEnv) {
      for (const [key, val] of Object.entries(config.customEnv)) {
        envLines.push(`      - ${key}=${val}`);
      }
    }

    if (envLines.length > 0) {
      lines.push(`    environment:`);
      lines.push(...envLines);
    }

    // Volumes
    if (app.volumes.length > 0) {
      lines.push(`    volumes:`);
      for (const vol of app.volumes) {
        lines.push(`      - ${vol.host}:${vol.container}`);
      }
    }

    // Ports (skip if networkMode: host — Plex uses host networking)
    if (app.ports.length > 0 && !app.networkMode) {
      const entry = portOverrides[app.id];
      const appOverrides = entry?.overrides || {};
      const hasOverride = Object.keys(appOverrides).length > 0;

      if (hasOverride) {
        lines.push(`    # Port changed to avoid conflict with ${entry!.conflictWith}`);
      }

      lines.push(`    ports:`);
      for (const port of app.ports) {
        const hostPort = appOverrides[port.host] || port.host;
        const proto = port.protocol && port.protocol !== 'tcp' ? `/${port.protocol}` : '';
        lines.push(`      - "${hostPort}:${port.container}${proto}"`);
      }
    }

    lines.push('');
  }

  // Network
  if (networkApps.length > 0) {
    // Add networks to each service that uses it
    const withNetworks: string[] = [];
    for (const line of lines) {
      withNetworks.push(line);
      // After container_name line for non-host-network services, we'll handle via post-processing
    }

    // Build final output with networks section
    const finalLines: string[] = [];
    let currentService = '';
    let addedNetwork = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const serviceMatch = line.match(/^  (\w[\w-]*):/);
      if (serviceMatch) {
        currentService = serviceMatch[1];
        addedNetwork = false;
      }

      finalLines.push(line);

      // Add networks after restart line for services in the shared network
      if (line.includes('restart: unless-stopped') && networkApps.includes(currentService) && !addedNetwork) {
        finalLines.push(`    networks:`);
        finalLines.push(`      - ${state.networkName}`);
        addedNetwork = true;
      }
    }

    finalLines.push(`networks:`);
    finalLines.push(`  ${state.networkName}:`);
    finalLines.push(`    driver: bridge`);
    finalLines.push('');

    return finalLines.join('\n');
  }

  return lines.join('\n');
}
