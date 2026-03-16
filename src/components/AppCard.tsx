import type { AppDefinition } from '../types';

interface AppCardProps {
  app: AppDefinition;
  selected: boolean;
  onToggle: () => void;
}

export function AppCard({ app, selected, onToggle }: AppCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`text-left w-full p-4 rounded-xl border transition-all ${
        selected
          ? 'bg-theme-accent-subtle border-theme-accent ring-1 ring-theme-accent'
          : 'bg-theme-bg-surface border-theme-border-subtle hover:border-theme-border'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-theme-text-primary text-sm">{app.name}</h3>
            {app.starter && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-theme-accent-subtle text-theme-accent-text border border-theme-accent whitespace-nowrap">
                Starter
              </span>
            )}
          </div>
          <p className="text-xs text-theme-text-muted mt-1 line-clamp-2">{app.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-theme-text-muted">
            {app.ports.length > 0 && (
              <span>Port {app.ports[0].host}</span>
            )}
            <a
              href={app.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-purple-500 hover:text-purple-400"
            >
              Docs
            </a>
            {app.trashUrl && (
              <a
                href={app.trashUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-purple-500 hover:text-purple-400"
              >
                TRaSH Guide
              </a>
            )}
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            selected
              ? 'bg-purple-600 border-purple-600 text-white'
              : 'border-theme-border'
          }`}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
