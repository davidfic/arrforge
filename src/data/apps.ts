import type { AppDefinition } from '../types';

export const apps: AppDefinition[] = [
  // ── Media Management ──
  {
    id: 'sonarr',
    name: 'Sonarr',
    description: 'TV show collection manager and downloader automation',
    category: 'media-management',
    image: 'lscr.io/linuxserver/sonarr:latest',
    ports: [{ host: 8989, container: 8989, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media', container: '/data', description: 'Media root' },
      { host: '${BASE_PATH}/config/sonarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/sonarr',
    trashUrl: 'https://trash-guides.info/Sonarr/',
    starter: true,
  },
  {
    id: 'radarr',
    name: 'Radarr',
    description: 'Movie collection manager and downloader automation',
    category: 'media-management',
    image: 'lscr.io/linuxserver/radarr:latest',
    ports: [{ host: 7878, container: 7878, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media', container: '/data', description: 'Media root' },
      { host: '${BASE_PATH}/config/radarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/radarr',
    trashUrl: 'https://trash-guides.info/Radarr/',
    starter: true,
  },
  {
    id: 'lidarr',
    name: 'Lidarr',
    description: 'Music collection manager and downloader automation',
    category: 'media-management',
    image: 'lscr.io/linuxserver/lidarr:latest',
    ports: [{ host: 8686, container: 8686, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media', container: '/data', description: 'Media root' },
      { host: '${BASE_PATH}/config/lidarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/lidarr',
    trashUrl: 'https://trash-guides.info/Lidarr/',
    starter: false,
  },
  {
    id: 'readarr',
    name: 'Readarr',
    description: 'Book and audiobook collection manager',
    category: 'media-management',
    image: 'lscr.io/linuxserver/readarr:develop',
    ports: [{ host: 8787, container: 8787, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media', container: '/data', description: 'Media root' },
      { host: '${BASE_PATH}/config/readarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/readarr',
    starter: false,
  },
  {
    id: 'bazarr',
    name: 'Bazarr',
    description: 'Subtitle manager for Sonarr and Radarr',
    category: 'media-management',
    image: 'lscr.io/linuxserver/bazarr:latest',
    ports: [{ host: 6767, container: 6767, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media', container: '/data', description: 'Media root' },
      { host: '${BASE_PATH}/config/bazarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/bazarr',
    starter: false,
  },

  // ── Download Clients ──
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    description: 'Lightweight and feature-rich torrent client',
    category: 'download-clients',
    image: 'lscr.io/linuxserver/qbittorrent:latest',
    ports: [
      { host: 8080, container: 8080, description: 'Web UI' },
      { host: 6881, container: 6881, protocol: 'tcp', description: 'Torrent traffic' },
      { host: 6881, container: 6881, protocol: 'udp', description: 'Torrent traffic (UDP)' },
    ],
    volumes: [
      { host: '${BASE_PATH}/torrents', container: '/data/torrents', description: 'Torrent downloads' },
      { host: '${BASE_PATH}/config/qbittorrent', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://github.com/qbittorrent/qBittorrent/wiki',
    trashUrl: 'https://trash-guides.info/Downloaders/qBittorrent/',
    starter: true,
  },
  {
    id: 'transmission',
    name: 'Transmission',
    description: 'Simple and lightweight torrent client',
    category: 'download-clients',
    image: 'lscr.io/linuxserver/transmission:latest',
    ports: [
      { host: 9091, container: 9091, description: 'Web UI' },
      { host: 51413, container: 51413, protocol: 'tcp', description: 'Torrent traffic' },
      { host: 51413, container: 51413, protocol: 'udp', description: 'Torrent traffic (UDP)' },
    ],
    volumes: [
      { host: '${BASE_PATH}/torrents', container: '/data/torrents', description: 'Torrent downloads' },
      { host: '${BASE_PATH}/config/transmission', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://transmissionbt.com/',
    starter: false,
  },
  {
    id: 'sabnzbd',
    name: 'SABnzbd',
    description: 'Usenet binary newsreader for NZB downloads',
    category: 'download-clients',
    image: 'lscr.io/linuxserver/sabnzbd:latest',
    ports: [{ host: 8080, container: 8080, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/usenet', container: '/data/usenet', description: 'Usenet downloads' },
      { host: '${BASE_PATH}/config/sabnzbd', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://sabnzbd.org/',
    trashUrl: 'https://trash-guides.info/Downloaders/SABnzbd/',
    starter: false,
  },
  {
    id: 'nzbget',
    name: 'NZBGet',
    description: 'Efficient Usenet downloader written in C++',
    category: 'download-clients',
    image: 'lscr.io/linuxserver/nzbget:latest',
    ports: [{ host: 6789, container: 6789, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/usenet', container: '/data/usenet', description: 'Usenet downloads' },
      { host: '${BASE_PATH}/config/nzbget', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://nzbget.com/',
    starter: false,
  },
  {
    id: 'deluge',
    name: 'Deluge',
    description: 'Full-featured torrent client with plugin support',
    category: 'download-clients',
    image: 'lscr.io/linuxserver/deluge:latest',
    ports: [
      { host: 8112, container: 8112, description: 'Web UI' },
      { host: 58846, container: 58846, description: 'Daemon' },
      { host: 58946, container: 58946, protocol: 'tcp', description: 'Torrent traffic' },
      { host: 58946, container: 58946, protocol: 'udp', description: 'Torrent traffic (UDP)' },
    ],
    volumes: [
      { host: '${BASE_PATH}/torrents', container: '/data/torrents', description: 'Torrent downloads' },
      { host: '${BASE_PATH}/config/deluge', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://deluge-torrent.org/',
    starter: false,
  },

  // ── Indexers ──
  {
    id: 'prowlarr',
    name: 'Prowlarr',
    description: 'Indexer manager that syncs with Sonarr, Radarr, etc.',
    category: 'indexers',
    image: 'lscr.io/linuxserver/prowlarr:latest',
    ports: [{ host: 9696, container: 9696, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/config/prowlarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://wiki.servarr.com/prowlarr',
    starter: true,
  },
  {
    id: 'flaresolverr',
    name: 'FlareSolverr',
    description: 'Proxy server to bypass Cloudflare protection for indexers',
    category: 'indexers',
    image: 'ghcr.io/flaresolverr/flaresolverr:latest',
    ports: [{ host: 8191, container: 8191, description: 'API' }],
    volumes: [],
    docUrl: 'https://github.com/FlareSolverr/FlareSolverr',
    starter: false,
    notes: 'No persistent config needed — runs stateless.',
  },

  // ── Media Servers ──
  {
    id: 'plex',
    name: 'Plex',
    description: 'Full-featured media server with client apps for every device',
    category: 'media-servers',
    image: 'lscr.io/linuxserver/plex:latest',
    ports: [{ host: 32400, container: 32400, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media/media', container: '/data/media', description: 'Media library' },
      { host: '${BASE_PATH}/config/plex', container: '/config', description: 'Config' },
    ],
    networkMode: 'host',
    docUrl: 'https://support.plex.tv/',
    trashUrl: 'https://trash-guides.info/Plex/',
    starter: true,
    notes: 'Uses network_mode: host for device discovery. Not added to shared Docker network.',
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Free and open-source media server — no account required',
    category: 'media-servers',
    image: 'lscr.io/linuxserver/jellyfin:latest',
    ports: [
      { host: 8096, container: 8096, description: 'Web UI' },
      { host: 7359, container: 7359, protocol: 'udp', description: 'Discovery' },
    ],
    volumes: [
      { host: '${BASE_PATH}/media/media', container: '/data/media', description: 'Media library' },
      { host: '${BASE_PATH}/config/jellyfin', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://jellyfin.org/docs/',
    starter: false,
  },
  {
    id: 'emby',
    name: 'Emby',
    description: 'Media server with live TV, DVR, and parental controls',
    category: 'media-servers',
    image: 'lscr.io/linuxserver/emby:latest',
    ports: [{ host: 8096, container: 8096, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/media/media', container: '/data/media', description: 'Media library' },
      { host: '${BASE_PATH}/config/emby', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://emby.media/support/articles/Home.html',
    starter: false,
  },

  // ── Reverse Proxies ──
  {
    id: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    description: 'Easy-to-use reverse proxy with a web UI for SSL certificates',
    category: 'reverse-proxies',
    image: 'jc21/nginx-proxy-manager:latest',
    ports: [
      { host: 80, container: 80, description: 'HTTP' },
      { host: 443, container: 443, description: 'HTTPS' },
      { host: 81, container: 81, description: 'Admin UI' },
    ],
    volumes: [
      { host: '${BASE_PATH}/config/nginx-proxy-manager/data', container: '/data', description: 'Data' },
      { host: '${BASE_PATH}/config/nginx-proxy-manager/letsencrypt', container: '/etc/letsencrypt', description: 'SSL certs' },
    ],
    env: {},
    docUrl: 'https://nginxproxymanager.com/',
    starter: false,
  },
  {
    id: 'traefik',
    name: 'Traefik',
    description: 'Modern reverse proxy with auto-discovery and Let\'s Encrypt',
    category: 'reverse-proxies',
    image: 'traefik:latest',
    ports: [
      { host: 80, container: 80, description: 'HTTP' },
      { host: 443, container: 443, description: 'HTTPS' },
      { host: 8082, container: 8080, description: 'Dashboard' },
    ],
    volumes: [
      { host: '/var/run/docker.sock', container: '/var/run/docker.sock', description: 'Docker socket (read-only)' },
      { host: '${BASE_PATH}/config/traefik', container: '/etc/traefik', description: 'Config' },
    ],
    docUrl: 'https://doc.traefik.io/traefik/',
    starter: false,
    notes: 'Requires additional configuration file (traefik.yml). See docs.',
  },

  // ── Utilities ──
  {
    id: 'recyclarr',
    name: 'Recyclarr',
    description: 'Auto-sync TRaSH Guides quality profiles to Sonarr/Radarr',
    category: 'utilities',
    image: 'ghcr.io/recyclarr/recyclarr:latest',
    ports: [],
    volumes: [
      { host: '${BASE_PATH}/config/recyclarr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://recyclarr.dev/',
    trashUrl: 'https://trash-guides.info/Recyclarr/',
    starter: false,
    notes: 'No web UI. Runs on a schedule. Requires manual recyclarr.yml configuration.',
  },
  {
    id: 'overseerr',
    name: 'Overseerr',
    description: 'Media request and discovery tool for Plex users',
    category: 'utilities',
    image: 'lscr.io/linuxserver/overseerr:latest',
    ports: [{ host: 5055, container: 5055, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/config/overseerr', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://overseerr.dev/',
    starter: false,
  },
  {
    id: 'tautulli',
    name: 'Tautulli',
    description: 'Monitoring and statistics dashboard for Plex',
    category: 'utilities',
    image: 'lscr.io/linuxserver/tautulli:latest',
    ports: [{ host: 8181, container: 8181, description: 'Web UI' }],
    volumes: [
      { host: '${BASE_PATH}/config/tautulli', container: '/config', description: 'Config' },
    ],
    docUrl: 'https://tautulli.com/',
    starter: false,
  },
];

export function getAppById(id: string): AppDefinition | undefined {
  return apps.find((a) => a.id === id);
}

export function getAppsByCategory(category: string): AppDefinition[] {
  return apps.filter((a) => a.category === category);
}
