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
        <h2 className="text-3xl font-bold text-theme-text-primary mb-3">
          Let's build your media server stack
        </h2>
        <p className="text-theme-text-muted">
          ArrForge generates a ready-to-run Docker Compose setup for Sonarr, Radarr,
          and the rest of the arr ecosystem. Pick your apps, configure paths, and
          download everything you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleStarter}
          className="p-6 rounded-xl border-2 border-theme-accent bg-theme-accent-subtle hover:bg-theme-accent-subtle transition-colors text-left"
        >
          <h3 className="font-semibold text-theme-text-primary mb-2">Use Recommended Starter</h3>
          <p className="text-sm text-theme-text-muted mb-3">
            Pre-selected apps for a complete setup:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Sonarr', 'Radarr', 'Prowlarr', 'qBittorrent'].map((name) => (
              <span
                key={name}
                className="text-xs px-2 py-0.5 rounded-full bg-theme-accent-subtle text-theme-accent-text border border-theme-accent"
              >
                {name}
              </span>
            ))}
          </div>
        </button>

        <button
          onClick={handleCustom}
          className="p-6 rounded-xl border-2 border-theme-border bg-theme-bg-surface hover:bg-theme-bg-surface transition-colors text-left"
        >
          <h3 className="font-semibold text-theme-text-primary mb-2">Build Custom Stack</h3>
          <p className="text-sm text-theme-text-muted">
            Choose from 20 apps across media management, download clients, indexers,
            media servers, and more.
          </p>
        </button>
      </div>

      <div className="text-sm text-theme-text-muted space-y-2">
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
