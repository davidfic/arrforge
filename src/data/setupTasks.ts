import type { WizardState } from '../types';
import { getAppByIdWithCustom } from '../utils/appLookup';
import { getActiveConnections } from './connections';
import { getAutoConfigConnections } from '../generators/configure';
import { appTips } from './appTips';

export type TaskPhase = 'prerequisites' | 'start' | 'configure' | 'connect';

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  url?: string;
  docUrl?: string;
  order: number;
  phase: TaskPhase;
  commands?: string[];
  tips?: string[];
  warning?: boolean;
}

export function generateSetupTasks(state: WizardState): SetupTask[] {
  const tasks: SetupTask[] = [];
  const { selectedApps } = state;
  let order = 0;

  // ── Prerequisites ──
  for (const appId of selectedApps) {
    const app = getAppByIdWithCustom(appId, state.customApps);
    const tip = appTips[appId];
    if (!app || !tip?.prerequisite) continue;

    tasks.push({
      id: `prereq-${appId}`,
      title: `${app.name}: prerequisite`,
      description: tip.prerequisite,
      docUrl: app.docUrl,
      order: order++,
      phase: 'prerequisites',
      commands: tip.command ? [tip.command] : undefined,
      warning: true,
    });
  }

  // ── Start ──
  const startCmd = state.includeVpnCompose
    ? 'docker compose -f docker-compose.yml -f docker-compose.vpn.yml up -d'
    : 'docker compose up -d';

  tasks.push({
    id: 'start-stack',
    title: 'Start your stack',
    description: 'Run the command below in the media-stack directory to start all services.',
    order: order++,
    phase: 'start',
    commands: [startCmd, 'docker compose logs -f'],
  });

  // ── Configure ──
  for (const appId of selectedApps) {
    const app = getAppByIdWithCustom(appId, state.customApps);
    if (!app) continue;
    const tip = appTips[appId];

    if (app.ports.length > 0) {
      const port = app.ports[0];
      const url = app.networkMode === 'host'
        ? `http://YOUR_IP:${port.host}`
        : `http://localhost:${port.host}`;
      tasks.push({
        id: `setup-${appId}`,
        title: `Complete ${app.name} initial setup`,
        description: `Open ${app.name} and complete the initial configuration wizard.`,
        url,
        docUrl: app.docUrl,
        order: order++,
        phase: 'configure',
        tips: tip?.firstRunTip ? [tip.firstRunTip] : undefined,
        commands: tip?.command && !tip?.prerequisite ? [tip.command] : undefined,
      });
    } else if (appId === 'recyclarr') {
      tasks.push({
        id: `setup-${appId}`,
        title: 'Configure Recyclarr',
        description: 'Create and edit `recyclarr.yml` in the config directory. See docs for setup.',
        docUrl: app.docUrl,
        order: order++,
        phase: 'configure',
        tips: tip?.firstRunTip ? [tip.firstRunTip] : undefined,
        commands: tip?.command ? [tip.command] : undefined,
      });
    }
  }

  // Prowlarr indexers
  if (selectedApps.includes('prowlarr')) {
    tasks.push({
      id: 'prowlarr-indexers',
      title: 'Add indexers in Prowlarr',
      description: 'Go to Prowlarr > Indexers > + and add your indexer sites. These will sync to all connected apps.',
      url: 'http://localhost:9696',
      order: order++,
      phase: 'configure',
    });
  }

  // ── Connect ──
  const activeConns = getActiveConnections(selectedApps);
  const autoConns = new Set(
    getAutoConfigConnections(selectedApps).map((c) => `${c.from}-${c.to}`)
  );
  for (const conn of activeConns) {
    const fromApp = getAppByIdWithCustom(conn.from, state.customApps);
    const toApp = getAppByIdWithCustom(conn.to, state.customApps);
    if (!fromApp || !toApp) continue;

    const isAuto = autoConns.has(`${conn.from}-${conn.to}`);
    tasks.push({
      id: `connect-${conn.from}-${conn.to}`,
      title: isAuto
        ? `Verify ${fromApp.name} → ${toApp.name} connection`
        : `Connect ${fromApp.name} to ${toApp.name}`,
      description: isAuto
        ? `Auto-configured on first startup. Verify in ${fromApp.name} settings if needed.`
        : conn.setupInstructions,
      docUrl: fromApp.docUrl,
      order: order++,
      phase: 'connect',
    });
  }

  return tasks.sort((a, b) => a.order - b.order);
}

export function getTasksByPhase(tasks: SetupTask[]): Map<TaskPhase, SetupTask[]> {
  const phases: TaskPhase[] = ['prerequisites', 'start', 'configure', 'connect'];
  const map = new Map<TaskPhase, SetupTask[]>();
  for (const phase of phases) {
    const phaseTasks = tasks.filter((t) => t.phase === phase);
    if (phaseTasks.length > 0) map.set(phase, phaseTasks);
  }
  return map;
}

export const PHASE_LABELS: Record<TaskPhase, string> = {
  prerequisites: 'Prerequisites',
  start: 'Start',
  configure: 'Configure Apps',
  connect: 'Connect Apps',
};
