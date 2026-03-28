import type { WizardState, WizardAction } from '../types';
import { getAppByIdWithCustom } from '../utils/appLookup';

interface HostAssignmentProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

function nextHostId(hosts: WizardState['hosts']): string {
  let max = 0;
  for (const h of hosts) {
    const match = h.id.match(/^host-(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `host-${max + 1}`;
}

export function HostAssignment({ state, dispatch }: HostAssignmentProps) {
  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-theme-border-subtle">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-theme-text-secondary">Multi-Host Deployment</p>
          <p className="text-xs text-theme-text-muted">
            Split services across multiple machines
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_MULTI_HOST' })}
          className={`w-12 h-6 sm:w-10 sm:h-5 rounded-full relative flex-shrink-0 transition-colors ${
            state.multiHost ? 'bg-theme-accent' : 'bg-gray-400'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-white transition-transform ${
              state.multiHost ? 'translate-x-6 sm:translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {state.multiHost && (
        <>
          {/* Host list */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">
              Hosts
            </label>
            <div className="space-y-2">
              {state.hosts.map((host) => (
                <div key={host.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={host.name}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_HOST',
                        hostId: host.id,
                        updates: { name: e.target.value },
                      })
                    }
                    placeholder="Host name"
                    className="flex-1 bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                  />
                  <input
                    type="text"
                    value={host.ip}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_HOST',
                        hostId: host.id,
                        updates: { ip: e.target.value },
                      })
                    }
                    placeholder="IP address"
                    className="flex-1 bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                  />
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_HOST', hostId: host.id })}
                    disabled={state.hosts.length <= 1}
                    className="px-2 py-2 text-sm text-red-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove host"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                dispatch({
                  type: 'ADD_HOST',
                  host: {
                    id: nextHostId(state.hosts),
                    name: `Host ${state.hosts.length + 1}`,
                    ip: '',
                  },
                })
              }
              className="mt-2 text-xs text-theme-accent-text hover:text-theme-accent-text transition-colors"
            >
              + Add Host
            </button>
          </div>

          {/* App assignment */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-2">
              Assign Apps to Hosts
            </label>
            <div className="space-y-2">
              {state.selectedApps.map((appId) => {
                const app = getAppByIdWithCustom(appId, state.customApps);
                if (!app) return null;
                const assignedHost =
                  state.hostAssignments[appId] || state.hosts[0]?.id || '';
                return (
                  <div key={appId} className="flex items-center gap-3">
                    <span className="text-xs text-theme-text-muted w-28 flex-shrink-0">
                      {app.name}
                    </span>
                    <select
                      value={assignedHost}
                      onChange={(e) =>
                        dispatch({
                          type: 'ASSIGN_APP_TO_HOST',
                          appId,
                          hostId: e.target.value,
                        })
                      }
                      className="flex-1 bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-1.5 text-xs text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
                    >
                      {state.hosts.map((host) => (
                        <option key={host.id} value={host.id}>
                          {host.name} ({host.ip || 'no IP'})
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
