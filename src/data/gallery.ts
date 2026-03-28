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
}

export const galleryStacks: GalleryStack[] = [
  {
    id: 'the-minimalist',
    name: 'The Minimalist',
    description: 'Just the essentials: grab TV shows and movies with the fewest moving parts.',
    tags: ['minimal', 'torrents', 'starter'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'qbittorrent'],
    difficulty: 'beginner',
  },
  {
    id: 'usenet-power-user',
    name: 'Usenet Power User',
    description: 'Full media automation over Usenet with quality profiles and subtitle management.',
    tags: ['usenet', 'automation', 'subtitles'],
    appIds: ['sonarr', 'radarr', 'lidarr', 'prowlarr', 'sabnzbd', 'recyclarr', 'bazarr'],
    difficulty: 'intermediate',
  },
  {
    id: 'plex-empire',
    name: 'Plex Empire',
    description: 'Complete Plex ecosystem with requests, monitoring, subtitles, and quality automation.',
    tags: ['plex', 'automation', 'requests', 'monitoring'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'qbittorrent', 'plex', 'overseerr', 'tautulli', 'bazarr', 'recyclarr'],
    difficulty: 'advanced',
  },
  {
    id: 'jellyfin-free-stack',
    name: 'Jellyfin Free Stack',
    description: 'Fully open-source from top to bottom. No accounts, no subscriptions.',
    tags: ['jellyfin', 'open-source', 'torrents'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'qbittorrent', 'jellyfin', 'bazarr'],
    difficulty: 'beginner',
  },
  {
    id: 'privacy-first',
    name: 'Privacy First',
    description: 'Route all download traffic through a VPN. Includes gluetun overlay compose.',
    tags: ['vpn', 'privacy', 'torrents'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'qbittorrent'],
    config: { includeVpnCompose: true },
    difficulty: 'intermediate',
  },
  {
    id: 'book-worm',
    name: 'Book Worm',
    description: 'Focused on books and audiobooks. Readarr handles the library.',
    tags: ['books', 'minimal'],
    appIds: ['readarr', 'prowlarr', 'qbittorrent'],
    difficulty: 'beginner',
  },
  {
    id: 'music-collector',
    name: 'Music Collector',
    description: 'Automated music library management with Lidarr.',
    tags: ['music', 'minimal'],
    appIds: ['lidarr', 'prowlarr', 'qbittorrent'],
    difficulty: 'beginner',
  },
  {
    id: 'luminarr-starter',
    name: 'Luminarr Starter',
    description: 'Modern movie management with Luminarr instead of Radarr. Lightweight and fast.',
    tags: ['luminarr', 'movies', 'minimal'],
    appIds: ['luminarr', 'sonarr', 'prowlarr', 'qbittorrent'],
    difficulty: 'beginner',
  },
  {
    id: 'hybrid-downloader',
    name: 'Hybrid Downloader',
    description: 'Torrents and Usenet together for maximum availability. Best of both worlds.',
    tags: ['torrents', 'usenet', 'hybrid'],
    appIds: ['sonarr', 'radarr', 'prowlarr', 'qbittorrent', 'sabnzbd'],
    difficulty: 'intermediate',
  },
  {
    id: 'everything',
    name: 'The Kitchen Sink',
    description: 'Every app category covered. For the person who wants it all.',
    tags: ['complete', 'advanced'],
    appIds: ['sonarr', 'radarr', 'lidarr', 'readarr', 'bazarr', 'prowlarr', 'qbittorrent', 'sabnzbd', 'plex', 'overseerr', 'tautulli', 'recyclarr', 'nginx-proxy-manager'],
    difficulty: 'advanced',
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
