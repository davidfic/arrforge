export type AppCategory =
  | 'media-management'
  | 'download-clients'
  | 'indexers'
  | 'media-servers'
  | 'reverse-proxies'
  | 'utilities'
  | 'custom';

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

export interface AppHealthcheck {
  test: string;
  interval?: string;
  timeout?: string;
  retries?: number;
  startPeriod?: string;
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
  healthcheck?: AppHealthcheck;
  docUrl: string;
  trashUrl?: string;
  starter: boolean;
  notes?: string;
}

export interface AppConfig {
  containerName?: string;
  imageTag?: string;
  customEnv?: Record<string, string>;
}

export interface HostDefinition {
  id: string;
  name: string;
  ip: string;
}

export type GpuType = 'none' | 'intel' | 'nvidia' | 'vaapi';

export interface WizardState {
  step: number;
  maxStep: number;
  advancedMode: boolean;
  selectedApps: string[];
  os: 'linux' | 'macos';
  basePath: string;
  puid: string;
  pgid: string;
  timezone: string;
  networkName: string;
  customPaths: Record<string, string>;
  appConfigs: Record<string, AppConfig>;
  includeVpnCompose: boolean;
  gpuType: GpuType;
  completedSetupTasks: string[];
  customApps: AppDefinition[];
  multiHost: boolean;
  hosts: HostDefinition[];
  hostAssignments: Record<string, string>; // appId -> hostId
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
  | { type: 'SET_APP_CONFIG'; appId: string; config: AppConfig }
  | { type: 'TOGGLE_VPN' }
  | { type: 'SET_GPU_TYPE'; gpuType: GpuType }
  | { type: 'REORDER_APPS'; appIds: string[] }
  | { type: 'TOGGLE_SETUP_TASK'; taskId: string }
  | { type: 'ADD_CUSTOM_APP'; app: AppDefinition }
  | { type: 'UPDATE_CUSTOM_APP'; appId: string; app: AppDefinition }
  | { type: 'REMOVE_CUSTOM_APP'; appId: string }
  | { type: 'TOGGLE_MULTI_HOST' }
  | { type: 'ADD_HOST'; host: HostDefinition }
  | { type: 'UPDATE_HOST'; hostId: string; updates: Partial<HostDefinition> }
  | { type: 'REMOVE_HOST'; hostId: string }
  | { type: 'ASSIGN_APP_TO_HOST'; appId: string; hostId: string }
  | { type: 'IMPORT_STATE'; state: WizardState }
  | { type: 'RESET' };

export const CATEGORY_LABELS: Record<AppCategory, string> = {
  'media-management': 'Media Management',
  'download-clients': 'Download Clients',
  'indexers': 'Indexers & Search',
  'media-servers': 'Media Servers',
  'reverse-proxies': 'Reverse Proxies',
  'utilities': 'Utilities',
  'custom': 'Custom Apps',
};

export const CATEGORY_ORDER: AppCategory[] = [
  'media-management',
  'download-clients',
  'indexers',
  'media-servers',
  'reverse-proxies',
  'utilities',
  'custom',
];
