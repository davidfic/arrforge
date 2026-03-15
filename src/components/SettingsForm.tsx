import type { WizardState, WizardAction } from '../types';
import { getAppById } from '../data/apps';

interface SettingsFormProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function SettingsForm({ state, dispatch }: SettingsFormProps) {
  if (!state.advancedMode) return null;

  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-gray-800">
      <h3 className="text-sm font-medium text-purple-400">Advanced Settings</h3>

      {/* Docker network name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Docker Network Name</label>
        <input
          type="text"
          value={state.networkName}
          onChange={(e) => dispatch({ type: 'SET_NETWORK_NAME', name: e.target.value })}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
        />
      </div>

      {/* VPN toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300">Include VPN compose file</p>
          <p className="text-xs text-gray-500">Generates a separate docker-compose.vpn.yml with gluetun</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_VPN' })}
          className={`w-10 h-5 rounded-full relative transition-colors ${
            state.includeVpnCompose ? 'bg-purple-600' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              state.includeVpnCompose ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Per-app custom paths */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Custom Config Paths</label>
        <div className="space-y-2">
          {state.selectedApps.map((appId) => {
            const app = getAppById(appId);
            if (!app) return null;
            return (
              <div key={appId} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-28 flex-shrink-0">{app.name}</span>
                <input
                  type="text"
                  value={state.customPaths[appId] || ''}
                  onChange={(e) => dispatch({ type: 'SET_CUSTOM_PATH', appId, path: e.target.value })}
                  placeholder={`${state.basePath}/config/${appId}`}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
