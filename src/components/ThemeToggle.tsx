import { useState, useRef, useEffect } from 'react';
import { THEMES, type Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onSelect: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onSelect }: ThemeToggleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors bg-theme-bg-surface text-theme-text-muted border border-theme-border hover:text-theme-text-secondary"
        title={`Theme: ${current.label}`}
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-theme-border"
          style={{ backgroundColor: current.bg, boxShadow: `inset 0 -4px 0 ${current.accent}` }}
        />
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 p-2 rounded-lg border border-theme-border bg-theme-bg-base shadow-lg z-50">
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSelect(t.id); setOpen(false); }}
                className="flex flex-col items-center gap-1 group"
                title={t.label}
              >
                <span
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    theme === t.id ? 'border-theme-accent scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.bg, boxShadow: `inset 0 -8px 0 ${t.accent}` }}
                />
                <span className={`text-[10px] ${theme === t.id ? 'text-theme-accent-text font-medium' : 'text-theme-text-muted'}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
