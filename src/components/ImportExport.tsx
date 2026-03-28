import { useRef, useState, useMemo } from 'react';
import type { WizardState, WizardAction } from '../types';
import { encodeStateToHash } from '../utils/shareLink';
import { parseComposeToState } from '../utils/parseCompose';

interface ImportExportProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function ImportExport({ state, dispatch }: ImportExportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const composeRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

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
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-bg-surface text-theme-text-secondary hover:bg-theme-bg-surface transition-colors border border-theme-border"
      >
        Export Config
      </a>

      <button
        onClick={() => fileRef.current?.click()}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-bg-surface text-theme-text-secondary hover:bg-theme-bg-surface transition-colors border border-theme-border"
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

      <button
        onClick={() => composeRef.current?.click()}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-bg-surface text-theme-text-secondary hover:bg-theme-bg-surface transition-colors border border-theme-border"
      >
        Import docker-compose.yml
      </button>
      <input
        ref={composeRef}
        type="file"
        accept=".yml,.yaml"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setError(null);
          setImportMsg(null);
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const { state: parsed, matched, unrecognized } = parseComposeToState(reader.result as string);
              if (matched.length === 0) {
                setError('No recognized services found in compose file');
                return;
              }
              dispatch({ type: 'IMPORT_STATE', state: parsed as any });
              const msg = `Imported ${matched.length} service${matched.length !== 1 ? 's' : ''}`;
              const extra = unrecognized.length > 0 ? ` (${unrecognized.length} unrecognized: ${unrecognized.join(', ')})` : '';
              setImportMsg(msg + extra);
              setTimeout(() => setImportMsg(null), 5000);
            } catch {
              setError('Failed to parse docker-compose.yml');
            }
          };
          reader.readAsText(file);
          if (composeRef.current) composeRef.current.value = '';
        }}
        className="hidden"
      />

      <button
        onClick={() => {
          const hash = encodeStateToHash(state);
          const url = `${window.location.origin}${window.location.pathname}#config=${hash}`;
          navigator.clipboard.writeText(url).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
          });
        }}
        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-theme-bg-surface text-theme-text-secondary hover:bg-theme-bg-surface transition-colors border border-theme-border"
      >
        {linkCopied ? 'Link Copied!' : 'Copy Share Link'}
      </button>

      {imported && <span className="text-xs text-green-500">Config imported!</span>}
      {importMsg && <span className="text-xs text-green-500">{importMsg}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
