import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  count: number;
  completedCount: number;
  defaultOpen?: boolean;
  variant?: 'default' | 'warning';
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  count,
  completedCount,
  defaultOpen = true,
  variant = 'default',
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const allDone = count > 0 && completedCount === count;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 py-2 text-left"
      >
        <span className="text-theme-text-muted text-xs transition-transform" style={{ transform: open ? 'rotate(90deg)' : '' }}>
          {'\u25B8'}
        </span>
        <span className={`text-sm font-medium ${variant === 'warning' ? 'text-amber-400' : 'text-theme-text-primary'}`}>
          {title}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
          allDone
            ? 'bg-green-500/20 text-green-400'
            : 'bg-theme-bg-elevated text-theme-text-muted'
        }`}>
          {completedCount}/{count}
        </span>
      </button>
      {open && (
        <div className="space-y-2 ml-4">
          {children}
        </div>
      )}
    </div>
  );
}
