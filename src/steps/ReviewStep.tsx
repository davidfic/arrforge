import { useState, useEffect, useMemo } from 'react';
import type { WizardState, WizardAction } from '../types';
import { getAppById } from '../data/apps';
import { ComposePreview } from '../components/ComposePreview';
import { buildZipBlob, buildComposeBlob } from '../generators/zip';
import { ImportExport } from '../components/ImportExport';

interface ReviewStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  onReset: () => void;
}

export function ReviewStep({ state, dispatch, onReset }: ReviewStepProps) {
  const composeUrl = useMemo(() => {
    const blob = buildComposeBlob(state);
    return URL.createObjectURL(blob);
  }, [state]);

  const [zipUrl, setZipUrl] = useState<string | null>(null);

  useEffect(() => {
    let stale = false;
    buildZipBlob(state).then((blob) => {
      if (!stale) setZipUrl(URL.createObjectURL(blob));
    });
    return () => {
      stale = true;
      setZipUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [state]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary mb-1">Review & Download</h2>
        <p className="text-sm text-theme-text-muted">
          Preview your generated files and download when ready
        </p>
      </div>

      {/* Selected apps summary */}
      <div className="mb-6 p-4 bg-theme-bg-surface border border-theme-border-subtle rounded-xl">
        <h3 className="text-sm font-medium text-theme-text-secondary mb-3">Selected Apps</h3>
        <div className="flex flex-wrap gap-2">
          {state.selectedApps.map((appId) => {
            const app = getAppById(appId);
            if (!app) return null;
            return (
              <span
                key={appId}
                className="text-xs px-2.5 py-1 rounded-full bg-theme-accent-subtle text-theme-accent-text border border-theme-accent"
              >
                {app.name}
                {app.ports.length > 0 && (
                  <span className="text-theme-text-muted ml-1">:{app.ports[0].host}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* File preview */}
      <ComposePreview state={state} />

      {/* Download links */}
      <div className="flex flex-wrap gap-3 mt-6">
        {zipUrl ? (
          <a
            href={zipUrl}
            download="media-stack.zip"
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors inline-block cursor-pointer"
          >
            Download ZIP
          </a>
        ) : (
          <span className="px-6 py-2.5 rounded-lg text-sm font-medium bg-theme-accent-subtle text-theme-accent inline-block">
            Preparing ZIP...
          </span>
        )}

        <a
          href={composeUrl}
          download="docker-compose.yml"
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-theme-bg-surface text-theme-text-secondary hover:bg-theme-bg-surface transition-colors border border-theme-border inline-block cursor-pointer"
        >
          Download docker-compose.yml only
        </a>
      </div>

      {/* Import/Export */}
      <div className="mt-4">
        <ImportExport state={state} dispatch={dispatch} />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-theme-border-subtle">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Start Over
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_STEP', step: 4 })}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
          >
            Next: Setup Guide
          </button>
        </div>
      </div>
    </div>
  );
}
