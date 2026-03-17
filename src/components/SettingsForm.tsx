import type { WizardState, WizardAction } from '../types';
import { getAppById } from '../data/apps';

interface SettingsFormProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function SettingsForm({ state, dispatch }: SettingsFormProps) {
  if (!state.advancedMode) return null;

  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-theme-border-subtle">
      <h3 className="text-sm font-medium text-theme-accent-text">Advanced Settings</h3>

      {/* Docker network name */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-1">Docker Network Name</label>
        <input
          type="text"
          value={state.networkName}
          onChange={(e) => dispatch({ type: 'SET_NETWORK_NAME', name: e.target.value })}
          className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
        />
      </div>

      {/* Per-app custom paths */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-2">Custom Config Paths</label>
        <div className="space-y-2">
          {state.selectedApps.map((appId) => {
            const app = getAppById(appId);
            if (!app) return null;
            return (
              <div key={appId} className="flex items-center gap-3">
                <span className="text-xs text-theme-text-muted w-28 flex-shrink-0">{app.name}</span>
                <input
                  type="text"
                  value={state.customPaths[appId] || ''}
                  onChange={(e) => dispatch({ type: 'SET_CUSTOM_PATH', appId, path: e.target.value })}
                  placeholder={`${state.basePath}/config/${appId}`}
                  className="flex-1 bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text-primary placeholder-theme-text-muted focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
