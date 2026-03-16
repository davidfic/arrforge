import { useState } from 'react';
import type { WizardState, WizardAction, AppConfig } from '../types';
import { getAppById } from '../data/apps';

interface AppConfigPanelProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

function parseImageTag(image: string): string {
  const parts = image.split(':');
  return parts.length > 1 ? parts[parts.length - 1] : 'latest';
}

export function AppConfigPanel({ state, dispatch }: AppConfigPanelProps) {
  if (!state.advancedMode) return null;

  const [expanded, setExpanded] = useState<string | null>(null);

  const updateConfig = (appId: string, partial: Partial<AppConfig>) => {
    const current = state.appConfigs[appId] || {};
    dispatch({ type: 'SET_APP_CONFIG', appId, config: { ...current, ...partial } });
  };

  const addEnvVar = (appId: string) => {
    const current = state.appConfigs[appId]?.customEnv || {};
    const key = `NEW_VAR_${Object.keys(current).length + 1}`;
    updateConfig(appId, { customEnv: { ...current, [key]: '' } });
  };

  const removeEnvVar = (appId: string, key: string) => {
    const current = { ...state.appConfigs[appId]?.customEnv };
    delete current[key];
    updateConfig(appId, { customEnv: current });
  };

  const renameEnvVar = (appId: string, oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;
    const current = { ...state.appConfigs[appId]?.customEnv };
    const value = current[oldKey] || '';
    delete current[oldKey];
    current[newKey] = value;
    updateConfig(appId, { customEnv: current });
  };

  const setEnvValue = (appId: string, key: string, value: string) => {
    const current = { ...state.appConfigs[appId]?.customEnv };
    current[key] = value;
    updateConfig(appId, { customEnv: current });
  };

  return (
    <div className="space-y-3 mt-6 pt-6 border-t border-theme-border-subtle">
      <h3 className="text-sm font-medium text-theme-accent-text">Per-App Configuration</h3>
      <p className="text-xs text-theme-text-muted">Customize container names, image tags, and environment variables</p>

      {state.selectedApps.map((appId) => {
        const app = getAppById(appId);
        if (!app) return null;
        const config = state.appConfigs[appId] || {};
        const isExpanded = expanded === appId;
        const defaultTag = parseImageTag(app.image);
        const hasCustomization = config.containerName || config.imageTag || (config.customEnv && Object.keys(config.customEnv).length > 0);

        return (
          <div key={appId} className="border border-theme-border-subtle rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : appId)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left bg-theme-bg-surface hover:bg-theme-bg-surface transition-colors"
            >
              <span className="text-theme-text-primary font-medium">
                {app.name}
                {hasCustomization && <span className="ml-2 text-xs text-purple-500">customized</span>}
              </span>
              <span className="text-gray-400 text-xs">{isExpanded ? '\u25B2' : '\u25BC'}</span>
            </button>

            {isExpanded && (
              <div className="p-4 space-y-4 border-t border-theme-border-subtle">
                {/* Container name */}
                <div>
                  <label className="block text-xs font-medium text-theme-text-secondary mb-1">Container Name</label>
                  <input
                    type="text"
                    value={config.containerName || ''}
                    onChange={(e) => updateConfig(appId, { containerName: e.target.value || undefined })}
                    placeholder={app.id}
                    className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                  />
                </div>

                {/* Image tag */}
                <div>
                  <label className="block text-xs font-medium text-theme-text-secondary mb-1">Image Tag</label>
                  <input
                    type="text"
                    value={config.imageTag || ''}
                    onChange={(e) => updateConfig(appId, { imageTag: e.target.value || undefined })}
                    placeholder={defaultTag}
                    className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                  />
                </div>

                {/* Custom env vars */}
                <div>
                  <label className="block text-xs font-medium text-theme-text-secondary mb-1">Custom Environment Variables</label>
                  {config.customEnv && Object.entries(config.customEnv).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 mb-1.5">
                      <input
                        type="text"
                        defaultValue={key}
                        onBlur={(e) => renameEnvVar(appId, key, e.target.value)}
                        className="flex-1 bg-theme-bg-surface border border-theme-border rounded px-2 py-1 text-xs text-theme-text-primary font-mono focus:outline-none focus:border-theme-accent"
                        placeholder="KEY"
                      />
                      <span className="text-gray-400 text-xs">=</span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setEnvValue(appId, key, e.target.value)}
                        className="flex-1 bg-theme-bg-surface border border-theme-border rounded px-2 py-1 text-xs text-theme-text-primary font-mono focus:outline-none focus:border-theme-accent"
                        placeholder="value"
                      />
                      <button
                        onClick={() => removeEnvVar(appId, key)}
                        className="text-red-400 hover:text-red-300 text-xs px-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addEnvVar(appId)}
                    className="text-xs text-purple-500 hover:text-purple-400 mt-1"
                  >
                    + Add variable
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
