import type { WizardState } from '../types';
import { getAppById } from './apps';

export interface GalleryStack {
  id: string;
  name: string;
  description: string;
  tags: string[];
  appIds: string[];
  config?: Partial<WizardState>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Short hint shown below the description — compatibility notes,
   *  follow-ups the user might want to add, gotchas. */
  tip?: string;
}

export const galleryStacks: GalleryStack[] = [
  {
    id: 'the-minimalist',
    name: 'The Minimalist',
    description: 'Just the essentials: grab TV shows and movies with the fewest moving parts.',
    tags: ['minimal', 'torrents', 'starter'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
    difficulty: 'beginner',
    tip: 'No media server included — copy files to your device or add Plex/Jellyfin once the downloader is working.',
  },
  {
    id: 'usenet-power-user',
    name: 'Usenet Power User',
    description: 'Full media automation over Usenet with quality profiles and subtitle management.',
    tags: ['usenet', 'automation', 'subtitles'],
    appIds: ['sonarr', 'radarr', 'lidarr', 'prowlarr', 'sabnzbd', 'recyclarr', 'bazarr'],
    difficulty: 'intermediate',
    tip: 'Recyclarr needs a recyclarr.yml you provide. Bazarr needs a subtitle-provider account (OpenSubtitles, Subscene, etc.).',
  },
  {
    id: 'plex-empire',
    name: 'Plex Empire',
    description: 'Complete Plex ecosystem with requests, monitoring, subtitles, and quality automation.',
    tags: ['plex', 'automation', 'requests', 'monitoring'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'plex', 'overseerr', 'tautulli', 'bazarr', 'recyclarr'],
    difficulty: 'advanced',
    tip: 'Grab a Plex claim token before starting — it expires in 4 minutes. Set PLEX_CLAIM in your .env on first run.',
  },
  {
    id: 'jellyfin-free-stack',
    name: 'Jellyfin Free Stack',
    description: 'Fully open-source from top to bottom. No accounts, no subscriptions.',
    tags: ['jellyfin', 'open-source', 'torrents'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'jellyfin', 'bazarr'],
    difficulty: 'beginner',
    tip: 'Overseerr supports Jellyfin if you want request management later.',
  },
  {
    id: 'privacy-first',
    name: 'Privacy First',
    description: 'Route all download traffic through a VPN. Includes gluetun overlay compose.',
    tags: ['vpn', 'privacy', 'torrents'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
    config: { includeVpnCompose: true },
    difficulty: 'intermediate',
    tip: 'You supply the VPN credentials. Gluetun supports 30+ providers — PIA, Mullvad, NordVPN, ProtonVPN, Surfshark, and more.',
  },
  {
    id: 'music-collector',
    name: 'Music Collector',
    description: 'Automated music library management with Lidarr.',
    tags: ['music', 'minimal'],
    appIds: ['lidarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
    difficulty: 'beginner',
    tip: 'Music indexers are mostly private trackers (Redacted, Orpheus, JPopSuki). You\'ll need existing accounts to add them in Prowlarr.',
  },
  {
    id: 'beacon-stack-plus',
    name: 'Beacon Stack + Plex',
    description: 'The Beacon Stack (Pulse, Pilot, Prism, Haul) alongside Plex and Overseerr for a full media experience.',
    tags: ['beacon', 'plex', 'requests'],
    appIds: ['pulse', 'pilot', 'prism', 'haul', 'flaresolverr', 'plex', 'overseerr'],
    difficulty: 'intermediate',
    tip: 'Overseerr connects to Prism as if it were Radarr (same API). For a turnkey beacon install with rotated secrets, see beacon-stack/deploy.',
  },
  {
    id: 'beacon-stack-jellyfin',
    name: 'Beacon Stack + Jellyfin',
    description: 'The Beacon Stack on a fully open-source media server.',
    tags: ['beacon', 'jellyfin', 'open-source'],
    appIds: ['pulse', 'pilot', 'prism', 'haul', 'flaresolverr', 'jellyfin'],
    difficulty: 'intermediate',
    tip: 'Fully open-source top to bottom. For turnkey beacon install with rotated secrets, see beacon-stack/deploy.',
  },
  {
    id: 'hybrid-downloader',
    name: 'Hybrid Downloader',
    description: 'Torrents and Usenet together for maximum availability. Best of both worlds.',
    tags: ['torrents', 'usenet', 'hybrid'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'sabnzbd'],
    difficulty: 'intermediate',
    tip: 'Port 8080 collides between qBittorrent and SABnzbd — the wizard auto-remaps SABnzbd to 8081.',
  },
  {
    id: 'everything',
    name: 'The Kitchen Sink',
    description: 'Every app category covered. For the person who wants it all.',
    tags: ['complete', 'advanced'],
    appIds: ['sonarr', 'radarr', 'lidarr', 'bazarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'sabnzbd', 'plex', 'overseerr', 'tautulli', 'recyclarr', 'nginx-proxy-manager'],
    difficulty: 'advanced',
    tip: 'Thirteen services and ~4 GB of RAM. NPM lets you front the web UIs with real TLS; Tautulli watches playback stats.',
  },
];

export function getGalleryAppNames(stack: GalleryStack): string[] {
  return stack.appIds.map((id) => getAppById(id)?.name).filter(Boolean) as string[];
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const stack of galleryStacks) {
    for (const tag of stack.tags) tags.add(tag);
  }
  return [...tags].sort();
}
