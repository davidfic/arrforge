export type AppCategory =
  | 'media-management'
  | 'download-clients'
  | 'indexers'
  | 'media-servers'
  | 'reverse-proxies'
  | 'utilities';

export interface AppVolume {
  host: string;
  container: string;
  description: string;
}

export interface AppPort {
  host: number;
  container: number;
  protocol?: 'tcp' | 'udp';
  description: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  image: string;
  ports: AppPort[];
  volumes: AppVolume[];
  env?: Record<string, string>;
  networkMode?: string;
  restart?: string;
  docUrl: string;
  trashUrl?: string;
  starter: boolean;
  notes?: string;
}

export interface WizardState {
  step: number;
  advancedMode: boolean;
  selectedApps: string[];
  os: 'linux' | 'macos';
  basePath: string;
  puid: string;
  pgid: string;
  timezone: string;
  networkName: string;
  customPaths: Record<string, string>;
  includeVpnCompose: boolean;
}

export type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'TOGGLE_ADVANCED' }
  | { type: 'TOGGLE_APP'; appId: string }
  | { type: 'SET_APPS'; appIds: string[] }
  | { type: 'SET_OS'; os: 'linux' | 'macos' }
  | { type: 'SET_BASE_PATH'; path: string }
  | { type: 'SET_PUID'; puid: string }
  | { type: 'SET_PGID'; pgid: string }
  | { type: 'SET_TIMEZONE'; timezone: string }
  | { type: 'SET_NETWORK_NAME'; name: string }
  | { type: 'SET_CUSTOM_PATH'; appId: string; path: string }
  | { type: 'TOGGLE_VPN' }
  | { type: 'RESET' };

export const CATEGORY_LABELS: Record<AppCategory, string> = {
  'media-management': 'Media Management',
  'download-clients': 'Download Clients',
  'indexers': 'Indexers & Search',
  'media-servers': 'Media Servers',
  'reverse-proxies': 'Reverse Proxies',
  'utilities': 'Utilities',
};

export const CATEGORY_ORDER: AppCategory[] = [
  'media-management',
  'download-clients',
  'indexers',
  'media-servers',
  'reverse-proxies',
  'utilities',
];
