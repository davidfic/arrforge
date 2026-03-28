export interface AppConflictRule {
  id: string;
  apps: string[];
  severity: 'warning' | 'info';
  message: string;
}

const conflictRules: AppConflictRule[] = [
  {
    id: 'movie-managers',
    apps: ['radarr', 'luminarr'],
    severity: 'warning',
    message: 'Radarr and Luminarr both manage movies. You probably only need one unless you\'re migrating.',
  },
  {
    id: 'media-servers-je',
    apps: ['jellyfin', 'emby'],
    severity: 'warning',
    message: 'Jellyfin and Emby share the same default port (8096). The port will be auto-adjusted, but you likely only need one.',
  },
  {
    id: 'torrent-clients',
    apps: ['qbittorrent', 'transmission', 'deluge'],
    severity: 'info',
    message: 'Multiple torrent clients selected. This is fine if intentional, but most setups need only one.',
  },
  {
    id: 'usenet-clients',
    apps: ['sabnzbd', 'nzbget'],
    severity: 'info',
    message: 'Multiple Usenet clients selected. Most setups need only one.',
  },
  {
    id: 'reverse-proxies',
    apps: ['nginx-proxy-manager', 'traefik'],
    severity: 'warning',
    message: 'Nginx Proxy Manager and Traefik both use ports 80/443. Pick one reverse proxy.',
  },
];

export function getActiveConflicts(selectedApps: string[]): AppConflictRule[] {
  return conflictRules.filter((rule) => {
    const matched = rule.apps.filter((id) => selectedApps.includes(id));
    return matched.length >= 2;
  });
}
