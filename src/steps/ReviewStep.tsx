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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Review & Download</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preview your generated files and download when ready
        </p>
      </div>

      {/* Selected apps summary */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Selected Apps</h3>
        <div className="flex flex-wrap gap-2">
          {state.selectedApps.map((appId) => {
            const app = getAppById(appId);
            if (!app) return null;
            return (
              <span
                key={appId}
                className="text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
              >
                {app.name}
                {app.ports.length > 0 && (
                  <span className="text-purple-400 dark:text-purple-500 ml-1">:{app.ports[0].host}</span>
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
          <span className="px-6 py-2.5 rounded-lg text-sm font-medium bg-purple-200 dark:bg-purple-800 text-purple-500 dark:text-purple-400 inline-block">
            Preparing ZIP...
          </span>
        )}

        <a
          href={composeUrl}
          download="docker-compose.yml"
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 inline-block cursor-pointer"
        >
          Download docker-compose.yml only
        </a>
      </div>

      {/* Import/Export */}
      <div className="mt-4">
        <ImportExport state={state} dispatch={dispatch} />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
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
