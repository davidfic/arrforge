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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operating System</label>
        <div className="flex gap-3">
          {(['linux', 'macos'] as const).map((os) => (
            <button
              key={os}
              onClick={() => dispatch({ type: 'SET_OS', os })}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                state.os === os
                  ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              {os === 'linux' ? 'Linux' : 'macOS'}
            </button>
          ))}
        </div>
      </div>

      {/* Base path */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Base Data Path
          <Tooltip text="Root directory for all media, downloads, and configs">
            <span className="ml-1 text-gray-400 dark:text-gray-500 cursor-help">(?)</span>
          </Tooltip>
        </label>
        <input
          type="text"
          value={state.basePath}
          onChange={(e) => dispatch({ type: 'SET_BASE_PATH', path: e.target.value })}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          placeholder="/data"
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Uses the <a href="https://trash-guides.info/Hardlinks/How-to-setup-for/Docker/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-400">TRaSH Guides recommended folder structure</a>
        </p>
      </div>

      {/* PUID / PGID */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PUID
            <Tooltip text="User ID for file ownership. Run 'id $USER' to find yours.">
              <span className="ml-1 text-gray-400 dark:text-gray-500 cursor-help">(?)</span>
            </Tooltip>
          </label>
          <input
            type="text"
            value={state.puid}
            onChange={(e) => dispatch({ type: 'SET_PUID', puid: e.target.value })}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PGID
            <Tooltip text="Group ID for file ownership. Run 'id $USER' to find yours.">
              <span className="ml-1 text-gray-400 dark:text-gray-500 cursor-help">(?)</span>
            </Tooltip>
          </label>
          <input
            type="text"
            value={state.pgid}
            onChange={(e) => dispatch({ type: 'SET_PGID', pgid: e.target.value })}
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
        <select
          value={state.timezone}
          onChange={(e) => dispatch({ type: 'SET_TIMEZONE', timezone: e.target.value })}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      {/* Folder structure preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Folder Structure Preview</label>
        <pre className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-xs text-gray-500 dark:text-gray-400 overflow-x-auto">
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
