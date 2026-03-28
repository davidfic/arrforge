import type { WizardState } from '../types';
import { DEFAULT_STATE } from './defaults';

interface ShareableState {
  apps: string[];
  os?: string;
  basePath?: string;
  puid?: string;
  pgid?: string;
  tz?: string;
  net?: string;
  vpn?: boolean;
  gpu?: string;
  configs?: Record<string, unknown>;
  customApps?: WizardState['customApps'];
  multiHost?: boolean;
  hosts?: WizardState['hosts'];
  hostAssignments?: WizardState['hostAssignments'];
}

export function encodeStateToHash(state: WizardState): string {
  const minimal: ShareableState = { apps: state.selectedApps };

  // Only include non-default values
  if (state.os !== DEFAULT_STATE.os) minimal.os = state.os;
  if (state.basePath !== DEFAULT_STATE.basePath) minimal.basePath = state.basePath;
  if (state.puid !== DEFAULT_STATE.puid) minimal.puid = state.puid;
  if (state.pgid !== DEFAULT_STATE.pgid) minimal.pgid = state.pgid;
  if (state.timezone !== DEFAULT_STATE.timezone) minimal.tz = state.timezone;
  if (state.networkName !== DEFAULT_STATE.networkName) minimal.net = state.networkName;
  if (state.includeVpnCompose) minimal.vpn = true;
  if (state.gpuType !== 'none') minimal.gpu = state.gpuType;
  if (Object.keys(state.appConfigs).length > 0) minimal.configs = state.appConfigs;
  if (state.customApps.length > 0) minimal.customApps = state.customApps;
  if (state.multiHost) {
    minimal.multiHost = true;
    minimal.hosts = state.hosts;
    minimal.hostAssignments = state.hostAssignments;
  }

  const json = JSON.stringify(minimal);
  return encodeURIComponent(btoa(json));
}

export function decodeHashToState(hash: string): Partial<WizardState> | null {
  try {
    const json = atob(decodeURIComponent(hash));
    const minimal: ShareableState = JSON.parse(json);

    if (!Array.isArray(minimal.apps)) return null;

    const partial: Partial<WizardState> = {
      selectedApps: minimal.apps,
    };

    if (minimal.os) partial.os = minimal.os as 'linux' | 'macos';
    if (minimal.basePath) partial.basePath = minimal.basePath;
    if (minimal.puid) partial.puid = minimal.puid;
    if (minimal.pgid) partial.pgid = minimal.pgid;
    if (minimal.tz) partial.timezone = minimal.tz;
    if (minimal.net) partial.networkName = minimal.net;
    if (minimal.vpn) partial.includeVpnCompose = true;
    if (minimal.gpu) partial.gpuType = minimal.gpu as WizardState['gpuType'];
    if (minimal.configs) partial.appConfigs = minimal.configs as WizardState['appConfigs'];
    if (minimal.customApps) partial.customApps = minimal.customApps;
    if (minimal.multiHost) {
      partial.multiHost = true;
      if (minimal.hosts) partial.hosts = minimal.hosts;
      if (minimal.hostAssignments) partial.hostAssignments = minimal.hostAssignments;
    }

    return partial;
  } catch {
    return null;
  }
}
