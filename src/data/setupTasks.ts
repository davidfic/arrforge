import { getAppById } from './apps';
import { getActiveConnections } from './connections';

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  url?: string;
  docUrl?: string;
  order: number;
}

export function generateSetupTasks(selectedApps: string[]): SetupTask[] {
  const tasks: SetupTask[] = [];
  let order = 0;

  // Step 1: Run docker compose
  tasks.push({
    id: 'start-stack',
    title: 'Start your stack',
    description: 'Run `docker compose up -d` in the media-stack directory to start all services.',
    order: order++,
  });

  // Step 2: Initial setup for each app
  for (const appId of selectedApps) {
    const app = getAppById(appId);
    if (!app) continue;

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
      });
    } else if (appId === 'recyclarr') {
      tasks.push({
        id: `setup-${appId}`,
        title: 'Configure Recyclarr',
        description: 'Create and edit `recyclarr.yml` in the config directory. See docs for setup.',
        docUrl: app.docUrl,
        order: order++,
      });
    }
  }

  // Step 3: Prowlarr indexers (if selected)
  if (selectedApps.includes('prowlarr')) {
    tasks.push({
      id: 'prowlarr-indexers',
      title: 'Add indexers in Prowlarr',
      description: 'Go to Prowlarr → Indexers → + and add your indexer sites. These will sync to all connected apps.',
      url: 'http://localhost:9696',
      order: order++,
    });
  }

  // Step 4: Connection tasks
  const activeConns = getActiveConnections(selectedApps);
  for (const conn of activeConns) {
    const fromApp = getAppById(conn.from);
    const toApp = getAppById(conn.to);
    if (!fromApp || !toApp) continue;

    tasks.push({
      id: `connect-${conn.from}-${conn.to}`,
      title: `Connect ${fromApp.name} to ${toApp.name}`,
      description: conn.setupInstructions,
      docUrl: fromApp.docUrl,
      order: order++,
    });
  }

  return tasks.sort((a, b) => a.order - b.order);
}
