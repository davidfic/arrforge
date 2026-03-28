import { useState } from 'react';
import type { WizardState } from '../types';
import { getAppById } from '../data/apps';
import { getPortOverrides } from '../generators/compose';

interface PortSummaryTableProps {
  state: WizardState;
}

export function PortSummaryTable({ state }: PortSummaryTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const portOverrides = getPortOverrides(state.selectedApps);

  function getUrl(appId: string): string | null {
    const app = getAppById(appId);
    if (!app || app.ports.length === 0) return null;

    const mainPort = app.ports[0];
    const override = portOverrides[appId]?.overrides[mainPort.host];
    const port = override || mainPort.host;
    const host = app.networkMode === 'host' ? 'YOUR_IP' : 'localhost';
    return `http://${host}:${port}`;
  }

  function handleCopy(appId: string, url: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const rows = state.selectedApps.map((appId) => {
    const app = getAppById(appId);
    if (!app) return null;
    const url = getUrl(appId);
    return { appId, app, url };
  }).filter(Boolean) as { appId: string; app: NonNullable<ReturnType<typeof getAppById>>; url: string | null }[];

  return (
    <div className="mb-6 p-4 bg-theme-bg-surface border border-theme-border-subtle rounded-xl">
      <h3 className="text-sm font-medium text-theme-text-secondary mb-3">Service URLs</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-theme-text-muted border-b border-theme-border-subtle">
              <th className="pb-2 pr-4 font-medium">App</th>
              <th className="pb-2 pr-4 font-medium">URL</th>
              <th className="pb-2 pr-4 font-medium">Description</th>
              <th className="pb-2 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ appId, app, url }) => (
              <tr key={appId} className="border-b border-theme-border-subtle last:border-0">
                <td className="py-2 pr-4 text-theme-text-primary font-medium">{app.name}</td>
                <td className="py-2 pr-4">
                  {url ? (
                    <code className="text-xs px-1.5 py-0.5 rounded bg-theme-bg-elevated text-theme-accent-text">
                      {url}
                    </code>
                  ) : (
                    <span className="text-theme-text-muted text-xs">No web UI</span>
                  )}
                </td>
                <td className="py-2 pr-4 text-theme-text-muted">
                  {app.ports.length > 0 ? app.ports[0].description : app.notes || ''}
                </td>
                <td className="py-2">
                  {url && (
                    <button
                      onClick={() => handleCopy(appId, url)}
                      className="text-xs px-2 py-1 rounded bg-theme-bg-elevated text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                    >
                      {copiedId === appId ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
