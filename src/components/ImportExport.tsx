import { useRef, useState, useMemo } from 'react';
import type { WizardState, WizardAction } from '../types';

interface ImportExportProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function ImportExport({ state, dispatch }: ImportExportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);

  const exportUrl = useMemo(() => {
    const { step, ...exportable } = state;
    const blob = new Blob([JSON.stringify(exportable, null, 2)], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }, [state]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!Array.isArray(parsed.selectedApps) || typeof parsed.basePath !== 'string') {
          setError('Invalid config file: missing selectedApps or basePath');
          return;
        }
        dispatch({ type: 'IMPORT_STATE', state: parsed });
        setImported(true);
        setTimeout(() => setImported(false), 3000);
      } catch {
        setError('Failed to parse config file');
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={exportUrl}
        download="arrforge-config.json"
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      >
        Export Config
      </a>

      <button
        onClick={() => fileRef.current?.click()}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      >
        Import Config
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {imported && <span className="text-xs text-green-500">Config imported!</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
