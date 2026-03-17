import type { WizardState, WizardAction } from '../types';
import { Tooltip } from './Tooltip';
import { TIMEZONES } from '../utils/defaults';

interface PathConfigFormProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function PathConfigForm({ state, dispatch }: PathConfigFormProps) {
  return (
    <div className="space-y-6">
      {/* OS selector */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-2">Operating System</label>
        <div className="flex gap-3">
          {(['linux', 'macos'] as const).map((os) => (
            <button
              key={os}
              onClick={() => dispatch({ type: 'SET_OS', os })}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                state.os === os
                  ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent-text'
                  : 'bg-theme-bg-surface border-theme-border text-theme-text-muted hover:border-theme-border'
              }`}
            >
              {os === 'linux' ? 'Linux' : 'macOS'}
            </button>
          ))}
        </div>
      </div>

      {/* Base path */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-1">
          Base Data Path
          <Tooltip text="Root directory for all media, downloads, and configs">
            <span className="ml-1 text-theme-text-muted cursor-help">(?)</span>
          </Tooltip>
        </label>
        <input
          type="text"
          value={state.basePath}
          onChange={(e) => dispatch({ type: 'SET_BASE_PATH', path: e.target.value })}
          className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
          placeholder="./data"
        />
        <p className="text-xs text-theme-text-muted mt-1">
          Uses the <a href="https://trash-guides.info/Hardlinks/How-to-setup-for/Docker/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400">TRaSH Guides recommended folder structure</a>
        </p>
      </div>

      {/* PUID / PGID */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-1">
            PUID
            <Tooltip text="User ID for file ownership. Run 'id $USER' to find yours.">
              <span className="ml-1 text-theme-text-muted cursor-help">(?)</span>
            </Tooltip>
          </label>
          <input
            type="text"
            value={state.puid}
            onChange={(e) => dispatch({ type: 'SET_PUID', puid: e.target.value })}
            className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-text-secondary mb-1">
            PGID
            <Tooltip text="Group ID for file ownership. Run 'id $USER' to find yours.">
              <span className="ml-1 text-theme-text-muted cursor-help">(?)</span>
            </Tooltip>
          </label>
          <input
            type="text"
            value={state.pgid}
            onChange={(e) => dispatch({ type: 'SET_PGID', pgid: e.target.value })}
            className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-1">Timezone</label>
        <select
          value={state.timezone}
          onChange={(e) => dispatch({ type: 'SET_TIMEZONE', timezone: e.target.value })}
          className="w-full bg-theme-bg-surface border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      {/* VPN toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-theme-text-secondary">Route download clients through VPN</p>
          <p className="text-xs text-theme-text-muted">Generates a separate docker-compose.vpn.yml with gluetun</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_VPN' })}
          className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${
            state.includeVpnCompose ? 'bg-purple-600' : 'bg-gray-400'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              state.includeVpnCompose ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Folder structure preview */}
      <div>
        <label className="block text-sm font-medium text-theme-text-secondary mb-2">Folder Structure Preview</label>
        <pre className="bg-theme-bg-surface border border-theme-border-subtle rounded-lg p-4 text-xs text-theme-text-muted overflow-x-auto">
{`${state.basePath}/
├── torrents/       # Torrent downloads
├── usenet/         # Usenet downloads
├── media/
│   ├── movies/     # Movie library
│   ├── tv/         # TV show library
│   ├── music/      # Music library
│   └── books/      # Book library
└── config/         # App configs (auto-created)`}
        </pre>
      </div>
    </div>
  );
}
