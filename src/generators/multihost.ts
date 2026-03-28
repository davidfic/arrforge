import type { WizardState } from '../types';
import { generateCompose } from './compose';
import { generateEnv } from './env';
import { generateReadme } from './readme';
import { generateVpnCompose } from './vpn';

export interface PerHostOutput {
  hostId: string;
  hostName: string;
  compose: string;
  env: string;
  readme: string;
  vpn?: string;
}

export function generatePerHost(state: WizardState): PerHostOutput[] {
  const results: PerHostOutput[] = [];

  for (const host of state.hosts) {
    const hostApps = state.selectedApps.filter((appId) => {
      const assigned = state.hostAssignments[appId];
      return assigned === host.id || (!assigned && host.id === state.hosts[0]?.id);
    });

    if (hostApps.length === 0) continue;

    const hostState: WizardState = {
      ...state,
      selectedApps: hostApps,
    };

    const output: PerHostOutput = {
      hostId: host.id,
      hostName: host.name,
      compose: generateCompose(hostState),
      env: generateEnv(hostState),
      readme: generateReadme(hostState),
    };

    if (state.includeVpnCompose) {
      const vpn = generateVpnCompose(hostState);
      if (vpn.trim()) output.vpn = vpn;
    }

    results.push(output);
  }

  return results;
}
