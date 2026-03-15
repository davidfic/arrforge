export type ConnectionType = 'download-client' | 'indexer' | 'subtitle' | 'media-server' | 'request' | 'monitoring' | 'quality-profile';

export interface AppConnection {
  from: string;
  to: string;
  type: ConnectionType;
  label: string;
  setupInstructions: string;
  dependsOn?: boolean; // if true, generates depends_on in compose (most connections are setup-only)
}

export const connections: AppConnection[] = [
  // ── *arr → download clients ──
  { from: 'sonarr', to: 'qbittorrent', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Sonarr, go to Settings → Download Clients → + → qBittorrent. Host: `qbittorrent`, Port: `8080`.' },
  { from: 'sonarr', to: 'transmission', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Sonarr, go to Settings → Download Clients → + → Transmission. Host: `transmission`, Port: `9091`.' },
  { from: 'sonarr', to: 'sabnzbd', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Sonarr, go to Settings → Download Clients → + → SABnzbd. Host: `sabnzbd`, Port: `8080`. Add your API key.' },
  { from: 'sonarr', to: 'nzbget', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Sonarr, go to Settings → Download Clients → + → NZBGet. Host: `nzbget`, Port: `6789`.' },
  { from: 'sonarr', to: 'deluge', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Sonarr, go to Settings → Download Clients → + → Deluge. Host: `deluge`, Port: `8112`. Default password: `deluge`.' },

  { from: 'radarr', to: 'qbittorrent', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Radarr, go to Settings → Download Clients → + → qBittorrent. Host: `qbittorrent`, Port: `8080`.' },
  { from: 'radarr', to: 'transmission', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Radarr, go to Settings → Download Clients → + → Transmission. Host: `transmission`, Port: `9091`.' },
  { from: 'radarr', to: 'sabnzbd', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Radarr, go to Settings → Download Clients → + → SABnzbd. Host: `sabnzbd`, Port: `8080`. Add your API key.' },
  { from: 'radarr', to: 'nzbget', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Radarr, go to Settings → Download Clients → + → NZBGet. Host: `nzbget`, Port: `6789`.' },
  { from: 'radarr', to: 'deluge', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Radarr, go to Settings → Download Clients → + → Deluge. Host: `deluge`, Port: `8112`. Default password: `deluge`.' },

  { from: 'lidarr', to: 'qbittorrent', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Lidarr, go to Settings → Download Clients → + → qBittorrent. Host: `qbittorrent`, Port: `8080`.' },
  { from: 'lidarr', to: 'transmission', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Lidarr, go to Settings → Download Clients → + → Transmission. Host: `transmission`, Port: `9091`.' },
  { from: 'lidarr', to: 'sabnzbd', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Lidarr, go to Settings → Download Clients → + → SABnzbd. Host: `sabnzbd`, Port: `8080`. Add your API key.' },
  { from: 'lidarr', to: 'nzbget', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Lidarr, go to Settings → Download Clients → + → NZBGet. Host: `nzbget`, Port: `6789`.' },

  { from: 'readarr', to: 'qbittorrent', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Readarr, go to Settings → Download Clients → + → qBittorrent. Host: `qbittorrent`, Port: `8080`.' },
  { from: 'readarr', to: 'transmission', type: 'download-client', label: 'Download Client',
    setupInstructions: 'In Readarr, go to Settings → Download Clients → + → Transmission. Host: `transmission`, Port: `9091`.' },
  { from: 'readarr', to: 'sabnzbd', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Readarr, go to Settings → Download Clients → + → SABnzbd. Host: `sabnzbd`, Port: `8080`. Add your API key.' },
  { from: 'readarr', to: 'nzbget', type: 'download-client', label: 'Download Client (Usenet)',
    setupInstructions: 'In Readarr, go to Settings → Download Clients → + → NZBGet. Host: `nzbget`, Port: `6789`.' },

  // ── Prowlarr → *arr apps ──
  { from: 'prowlarr', to: 'sonarr', type: 'indexer', label: 'App Sync',
    setupInstructions: 'In Prowlarr, go to Settings → Apps → + → Sonarr. Prowlarr Server: `http://prowlarr:9696`, Sonarr Server: `http://sonarr:8989`. Add the Sonarr API key.' },
  { from: 'prowlarr', to: 'radarr', type: 'indexer', label: 'App Sync',
    setupInstructions: 'In Prowlarr, go to Settings → Apps → + → Radarr. Prowlarr Server: `http://prowlarr:9696`, Radarr Server: `http://radarr:7878`. Add the Radarr API key.' },
  { from: 'prowlarr', to: 'lidarr', type: 'indexer', label: 'App Sync',
    setupInstructions: 'In Prowlarr, go to Settings → Apps → + → Lidarr. Prowlarr Server: `http://prowlarr:9696`, Lidarr Server: `http://lidarr:8686`. Add the Lidarr API key.' },
  { from: 'prowlarr', to: 'readarr', type: 'indexer', label: 'App Sync',
    setupInstructions: 'In Prowlarr, go to Settings → Apps → + → Readarr. Prowlarr Server: `http://prowlarr:9696`, Readarr Server: `http://readarr:8787`. Add the Readarr API key.' },

  // ── Prowlarr → FlareSolverr ──
  { from: 'prowlarr', to: 'flaresolverr', type: 'indexer', label: 'Indexer Proxy',
    setupInstructions: 'In Prowlarr, go to Settings → Indexers → + (Indexer Proxies) → FlareSolverr. Host: `http://flaresolverr:8191`.' },

  // ── Bazarr → Sonarr/Radarr ──
  { from: 'bazarr', to: 'sonarr', type: 'subtitle', label: 'TV Subtitles',
    setupInstructions: 'In Bazarr, go to Settings → Sonarr. Address: `sonarr`, Port: `8989`. Add the Sonarr API key.' },
  { from: 'bazarr', to: 'radarr', type: 'subtitle', label: 'Movie Subtitles',
    setupInstructions: 'In Bazarr, go to Settings → Radarr. Address: `radarr`, Port: `7878`. Add the Radarr API key.' },

  // ── Overseerr → Plex/Sonarr/Radarr ──
  { from: 'overseerr', to: 'plex', type: 'media-server', label: 'Media Server',
    setupInstructions: 'In Overseerr setup wizard, sign in with your Plex account and select your Plex server.' },
  { from: 'overseerr', to: 'sonarr', type: 'request', label: 'TV Requests',
    setupInstructions: 'In Overseerr, go to Settings → Services → + → Sonarr. Hostname: `sonarr`, Port: `8989`. Add the Sonarr API key.' },
  { from: 'overseerr', to: 'radarr', type: 'request', label: 'Movie Requests',
    setupInstructions: 'In Overseerr, go to Settings → Services → + → Radarr. Hostname: `radarr`, Port: `7878`. Add the Radarr API key.' },

  // ── Tautulli → Plex ──
  { from: 'tautulli', to: 'plex', type: 'monitoring', label: 'Plex Monitoring',
    setupInstructions: 'In Tautulli setup wizard, enter your Plex IP and port `32400`. Sign in with your Plex account.' },

  // ── Recyclarr → Sonarr/Radarr ──
  { from: 'recyclarr', to: 'sonarr', type: 'quality-profile', label: 'Quality Profiles',
    setupInstructions: 'Edit `recyclarr.yml` to add your Sonarr instance. Base URL: `http://sonarr:8989`, add the Sonarr API key.' },
  { from: 'recyclarr', to: 'radarr', type: 'quality-profile', label: 'Quality Profiles',
    setupInstructions: 'Edit `recyclarr.yml` to add your Radarr instance. Base URL: `http://radarr:7878`, add the Radarr API key.' },
];

export function getActiveConnections(selectedApps: string[]): AppConnection[] {
  return connections.filter((c) => selectedApps.includes(c.from) && selectedApps.includes(c.to));
}

export function getConnectionsFrom(appId: string, selectedApps: string[]): AppConnection[] {
  return connections.filter((c) => c.from === appId && selectedApps.includes(c.to));
}
