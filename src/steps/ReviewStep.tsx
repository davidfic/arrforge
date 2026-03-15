import { useState, useEffect } from 'react';
import type { WizardState, WizardAction } from '../types';
import { getAppById } from '../data/apps';
import { ComposePreview } from '../components/ComposePreview';
import { buildZipBlob, buildComposeBlob } from '../generators/zip';

interface ReviewStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  onReset: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ReviewStep({ state, dispatch, onReset }: ReviewStepProps) {
  // Pre-generate the ZIP blob so the click handler is fully synchronous.
  // Async handlers lose the user gesture, causing Chromium/Brave to silently
  // block the download.
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  useEffect(() => {
    let stale = false;
    setZipBlob(null);
    buildZipBlob(state).then((blob) => {
      if (!stale) setZipBlob(blob);
    });
    return () => { stale = true; };
  }, [state]);

  const handleDownloadZip = () => {
    if (!zipBlob) return;
    downloadBlob(zipBlob, 'media-stack.zip');
  };

  const handleDownloadCompose = () => {
    const blob = buildComposeBlob(state);
    downloadBlob(blob, 'docker-compose.yml');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Review & Download</h2>
        <p className="text-sm text-gray-400">
          Preview your generated files and download when ready
        </p>
      </div>

      {/* Selected apps summary */}
      <div className="mb-6 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Selected Apps</h3>
        <div className="flex flex-wrap gap-2">
          {state.selectedApps.map((appId) => {
            const app = getAppById(appId);
            if (!app) return null;
            return (
              <span
                key={appId}
                className="text-xs px-2.5 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/50"
              >
                {app.name}
                {app.ports.length > 0 && (
                  <span className="text-purple-500 ml-1">:{app.ports[0].host}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* File preview */}
      <ComposePreview state={state} />

      {/* Download buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={handleDownloadZip}
          disabled={!zipBlob}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium ${!zipBlob ? 'bg-purple-800 text-purple-400' : 'bg-purple-600 text-white hover:bg-purple-500'} transition-colors inline-block`}
        >
          {!zipBlob ? 'Preparing...' : 'Download ZIP'}
        </button>

        <button
          onClick={handleDownloadCompose}
          className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors border border-gray-700 inline-block"
        >
          Download docker-compose.yml only
        </button>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
