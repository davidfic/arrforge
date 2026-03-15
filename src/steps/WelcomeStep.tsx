import type { WizardAction } from '../types';
import { STARTER_APPS } from '../utils/defaults';

interface WelcomeStepProps {
  dispatch: React.Dispatch<WizardAction>;
}

export function WelcomeStep({ dispatch }: WelcomeStepProps) {
  const handleStarter = () => {
    dispatch({ type: 'SET_APPS', appIds: STARTER_APPS });
    dispatch({ type: 'SET_STEP', step: 1 });
  };

  const handleCustom = () => {
    dispatch({ type: 'SET_STEP', step: 1 });
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">
          Let's build your media server stack
        </h2>
        <p className="text-gray-400">
          ArrForge generates a ready-to-run Docker Compose setup for Sonarr, Radarr,
          and the rest of the arr ecosystem. Pick your apps, configure paths, and
          download everything you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleStarter}
          className="p-6 rounded-xl border-2 border-purple-700 bg-purple-950/30 hover:bg-purple-950/50 transition-colors text-left"
        >
          <h3 className="font-semibold text-white mb-2">Use Recommended Starter</h3>
          <p className="text-sm text-gray-400 mb-3">
            Pre-selected apps for a complete setup:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Sonarr', 'Radarr', 'Prowlarr', 'qBittorrent', 'Plex'].map((name) => (
              <span
                key={name}
                className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800"
              >
                {name}
              </span>
            ))}
          </div>
        </button>

        <button
          onClick={handleCustom}
          className="p-6 rounded-xl border-2 border-gray-700 bg-gray-900/30 hover:bg-gray-900/50 transition-colors text-left"
        >
          <h3 className="font-semibold text-white mb-2">Build Custom Stack</h3>
          <p className="text-sm text-gray-400">
            Choose from 20 apps across media management, download clients, indexers,
            media servers, and more.
          </p>
        </button>
      </div>

      <div className="text-sm text-gray-500 space-y-2">
        <p>New to Docker? Install it first:</p>
        <div className="flex justify-center gap-4">
          <a
            href="https://docs.docker.com/engine/install/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-400"
          >
            Linux install guide
          </a>
          <a
            href="https://docs.docker.com/desktop/install/mac-install/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-400"
          >
            macOS install guide
          </a>
        </div>
      </div>
    </div>
  );
}
