import { getAppById } from './apps';

export interface PresetStack {
  id: string;
  name: string;
  description: string;
  appIds: string[];
}

export const presets: PresetStack[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'The essentials for TV and movies with torrents',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
  },
  {
    id: 'power-user',
    name: 'Power User',
    description: 'All media types with quality automation and subtitles',
    appIds: ['sonarr', 'radarr', 'lidarr', 'bazarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'recyclarr'],
  },
  {
    id: 'usenet-only',
    name: 'Usenet Only',
    description: 'TV and movies via Usenet instead of torrents',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'sabnzbd'],
  },
  {
    id: 'minimal-movies',
    name: 'Minimal Movies',
    description: 'Just movie management with the basics',
    appIds: ['radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
  },
  {
    id: 'plex-full',
    name: 'Plex Full Stack',
    description: 'Complete Plex setup with requests, monitoring, and automation',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'plex', 'overseerr', 'tautulli', 'bazarr', 'recyclarr'],
  },
  {
    id: 'jellyfin-stack',
    name: 'Jellyfin Stack',
    description: 'Fully open-source media stack with Jellyfin',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'jellyfin', 'bazarr'],
  },
];

export function getPresetAppNames(preset: PresetStack): string[] {
  return preset.appIds.map((id) => getAppById(id)?.name).filter(Boolean) as string[];
}
