export interface AppTip {
  prerequisite?: string;
  firstRunTip?: string;
  command?: string;
}

export const appTips: Record<string, AppTip> = {
  plex: {
    prerequisite: 'Get a Plex claim token from https://plex.tv/claim before starting. It expires in 4 minutes.',
    firstRunTip: 'Add the claim token to your .env or pass it as PLEX_CLAIM environment variable on first run.',
  },
  qbittorrent: {
    firstRunTip: 'The default password is generated on first start. Check the logs to find it.',
    command: 'docker logs qbittorrent 2>&1 | grep "temporary password"',
  },
  deluge: {
    firstRunTip: 'Default password is "deluge". Change it immediately in Preferences > Interface.',
  },
  recyclarr: {
    prerequisite: 'Create a recyclarr.yml config file before starting. See the docs for templates.',
    command: 'docker exec recyclarr recyclarr create-config',
  },
  traefik: {
    prerequisite: 'Create a traefik.yml configuration file in the config directory before starting.',
    firstRunTip: 'The dashboard is available at port 8082 but requires additional config to secure it.',
  },
  'nginx-proxy-manager': {
    firstRunTip: 'Default admin login: admin@example.com / changeme. Change these immediately.',
  },
  flaresolverr: {
    firstRunTip: 'FlareSolverr runs automatically. Add it as an Indexer Proxy in Prowlarr to bypass Cloudflare on public trackers.',
  },
  prowlarr: {
    firstRunTip: 'Set up authentication first, then add your indexer sites. Add FlareSolverr as an Indexer Proxy under Settings > Indexers if included.',
  },
  sonarr: {
    firstRunTip: 'Go to Settings > Media Management and set your root folder to /data/media/tv.',
  },
  radarr: {
    firstRunTip: 'Go to Settings > Media Management and set your root folder to /data/media/movies.',
  },
  luminarr: {
    firstRunTip: 'An API key is auto-generated on first start. Find it in Settings for connecting other apps.',
  },
  lidarr: {
    firstRunTip: 'Go to Settings > Media Management and set your root folder to /data/media/music.',
  },
  bazarr: {
    firstRunTip: 'Configure your subtitle providers in Settings > Providers before connecting to Sonarr/Radarr.',
  },
  overseerr: {
    firstRunTip: 'Sign in with your Plex account during the setup wizard to link your media server.',
  },
};
