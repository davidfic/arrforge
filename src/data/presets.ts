import { getAppById } from './apps';

export interface PresetStack {
  id: string;
  name: string;
  description: string;
  appIds: string[];
  /** Short hint shown below the description — compatibility notes,
   *  follow-ups the user might want to add, gotchas. */
  tip?: string;
}

export const presets: PresetStack[] = [
  {
    id: 'beacon-stack',
    name: 'The Beacon Stack',
    description: 'Pulse + Pilot + Prism + Haul, the new Go-based alternative to the Arr suite. Ships with a shared Postgres and FlareSolverr.',
    appIds: ['pulse', 'pilot', 'prism', 'haul', 'flaresolverr'],
    tip: 'Prism is Radarr v3 API compatible — add Overseerr or Bazarr later and they\'ll connect to Prism as if it were Radarr.',
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'The essentials for TV and movies with torrents',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
    tip: 'Bare-minimum setup. Add Plex or Jellyfin later for playback.',
  },
  {
    id: 'power-user',
    name: 'Power User',
    description: 'All media types with quality automation and subtitles',
    appIds: ['sonarr', 'radarr', 'lidarr', 'bazarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'recyclarr'],
    tip: 'Recyclarr auto-syncs TRaSH Guides quality profiles on a schedule. Still no media server — add Plex or Jellyfin to actually watch anything.',
  },
  {
    id: 'usenet-only',
    name: 'Usenet Only',
    description: 'TV and movies via Usenet instead of torrents',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'sabnzbd'],
    tip: 'Requires an active Usenet subscription + indexer accounts. No VPN needed since NNTP traffic is already encrypted.',
  },
  {
    id: 'minimal-movies',
    name: 'Minimal Movies',
    description: 'Just movie management with the basics',
    appIds: ['radarr', 'prowlarr', 'flaresolverr', 'qbittorrent'],
    tip: 'Movies only. You can add Sonarr to the same stack later without reconfiguring anything.',
  },
  {
    id: 'plex-full',
    name: 'Plex Full Stack',
    description: 'Complete Plex setup with requests, monitoring, and automation',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'plex', 'overseerr', 'tautulli', 'bazarr', 'recyclarr'],
    tip: 'Plex uses host networking for device discovery. A Plex Pass unlocks DVR and hardware transcoding but isn\'t required.',
  },
  {
    id: 'jellyfin-stack',
    name: 'Jellyfin Stack',
    description: 'Fully open-source media stack with Jellyfin',
    appIds: ['sonarr', 'radarr', 'prowlarr', 'flaresolverr', 'qbittorrent', 'jellyfin', 'bazarr'],
    tip: 'No paid accounts, no subscriptions. Overseerr works with Jellyfin too if you want a request interface.',
  },
];

export function getPresetAppNames(preset: PresetStack): string[] {
  return preset.appIds.map((id) => getAppById(id)?.name).filter(Boolean) as string[];
}
