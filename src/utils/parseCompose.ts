import { parse } from 'yaml';
import type { WizardState, AppConfig } from '../types';
import { apps } from '../data/apps';

interface ParseResult {
  state: Partial<WizardState>;
  matched: string[];
  unrecognized: string[];
}

export function parseComposeToState(yamlContent: string): ParseResult {
  const doc = parse(yamlContent) as { services?: Record<string, Record<string, unknown>> };
  if (!doc?.services) {
    return { state: {}, matched: [], unrecognized: [] };
  }

  const matched: string[] = [];
  const unrecognized: string[] = [];
  const selectedApps: string[] = [];
  const appConfigs: Record<string, AppConfig> = {};

  let puid: string | undefined;
  let pgid: string | undefined;
  let timezone: string | undefined;
  let networkName: string | undefined;

  // Build image lookup: strip tag from known images for matching
  const imageToApp = new Map<string, string>();
  for (const app of apps) {
    const base = app.image.split(':')[0];
    imageToApp.set(base, app.id);
  }

  for (const [serviceName, service] of Object.entries(doc.services)) {
    const image = (service.image as string) || '';
    const imageBase = image.split(':')[0];
    const imageTag = image.split(':')[1] || '';

    const appId = imageToApp.get(imageBase);
    if (appId) {
      selectedApps.push(appId);
      matched.push(serviceName);

      const app = apps.find((a) => a.id === appId);
      const config: AppConfig = {};

      // Custom container name
      const containerName = service.container_name as string;
      if (containerName && containerName !== appId) {
        config.containerName = containerName;
      }

      // Custom image tag
      const defaultTag = app?.image.split(':')[1] || 'latest';
      if (imageTag && imageTag !== defaultTag) {
        config.imageTag = imageTag;
      }

      if (config.containerName || config.imageTag) {
        appConfigs[appId] = config;
      }

      // Extract env vars for global settings (take first found)
      const env = service.environment as (string[] | Record<string, string>) | undefined;
      if (env) {
        const envMap = Array.isArray(env)
          ? Object.fromEntries(env.map((e: string) => { const [k, ...v] = e.split('='); return [k, v.join('=')]; }))
          : env;

        if (!puid && envMap.PUID) puid = envMap.PUID.replace('${PUID}', '').trim() || undefined;
        if (!pgid && envMap.PGID) pgid = envMap.PGID.replace('${PGID}', '').trim() || undefined;
        if (!timezone && envMap.TZ) timezone = envMap.TZ.replace('${TZ}', '').trim() || undefined;
      }
    } else {
      unrecognized.push(serviceName);
    }
  }

  // Extract network name
  const docNetworks = (doc as Record<string, unknown>).networks as Record<string, unknown> | undefined;
  if (docNetworks) {
    const names = Object.keys(docNetworks);
    if (names.length > 0) networkName = names[0];
  }

  const state: Partial<WizardState> = { selectedApps };
  if (Object.keys(appConfigs).length > 0) state.appConfigs = appConfigs;
  if (puid) state.puid = puid;
  if (pgid) state.pgid = pgid;
  if (timezone) state.timezone = timezone;
  if (networkName) state.networkName = networkName;

  return { state, matched, unrecognized };
}
