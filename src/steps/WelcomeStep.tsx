import type { WizardAction } from '../types';
import { presets, getPresetAppNames } from '../data/presets';

interface WelcomeStepProps {
  dispatch: React.Dispatch<WizardAction>;
  onOpenGallery: () => void;
}

export function WelcomeStep({ dispatch, onOpenGallery }: WelcomeStepProps) {
  const handlePreset = (appIds: string[], tip?: string) => {
    dispatch({ type: 'SET_APPS', appIds, tip });
    dispatch({ type: 'SET_STEP', step: 1 });
  };

  const handleCustom = () => {
    dispatch({ type: 'SET_STEP', step: 1 });
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-theme-text-primary mb-3">
          Let's build your media server stack
        </h2>
        <p className="text-theme-text-muted">
          ArrForge generates a ready-to-run Docker Compose setup for Sonarr, Radarr,
          and the rest of the arr ecosystem. Pick a preset or build your own.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 text-left">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePreset(preset.appIds, preset.tip)}
            className="p-5 rounded-xl border-2 border-theme-border bg-theme-bg-surface hover:border-theme-accent transition-colors text-left"
          >
            <h3 className="font-semibold text-theme-text-primary mb-1">{preset.name}</h3>
            <p className="text-sm text-theme-text-muted mb-3">{preset.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {getPresetAppNames(preset).map((name) => (
                <span
                  key={name}
                  className="text-xs px-2 py-0.5 rounded-full bg-theme-accent-subtle text-theme-accent-text border border-theme-accent"
                >
                  {name}
                </span>
              ))}
            </div>
          </button>
        ))}

        <button
          onClick={handleCustom}
          className="p-5 rounded-xl border-2 border-dashed border-theme-border bg-theme-bg-surface hover:border-theme-accent transition-colors text-left"
        >
          <h3 className="font-semibold text-theme-text-primary mb-1">Build Custom Stack</h3>
          <p className="text-sm text-theme-text-muted">
            Choose from 20+ apps across media management, download clients, indexers,
            media servers, and more.
          </p>
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={onOpenGallery}
          className="text-sm text-theme-accent-text hover:text-theme-accent-text transition-colors"
        >
          Browse the Stack Gallery for more configurations
        </button>
      </div>

      <div className="text-sm text-theme-text-muted space-y-2">
        <p>New to Docker? Install it first:</p>
        <div className="flex justify-center gap-4">
          <a
            href="https://docs.docker.com/engine/install/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-accent-text hover:text-theme-accent-text"
          >
            Linux install guide
          </a>
          <a
            href="https://docs.docker.com/desktop/install/mac-install/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-accent-text hover:text-theme-accent-text"
          >
            macOS install guide
          </a>
        </div>
      </div>
    </div>
  );
}
