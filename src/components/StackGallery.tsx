import { useState } from 'react';
import type { WizardAction } from '../types';
import { galleryStacks, getGalleryAppNames, getAllTags, type GalleryStack } from '../data/gallery';

interface StackGalleryProps {
  dispatch: React.Dispatch<WizardAction>;
  onClose: () => void;
}

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export function StackGallery({ dispatch, onClose }: StackGalleryProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const allTags = getAllTags();

  const filtered = activeTag
    ? galleryStacks.filter((s) => s.tags.includes(activeTag))
    : galleryStacks;

  const handleUseStack = (stack: GalleryStack) => {
    dispatch({ type: 'SET_APPS', appIds: stack.appIds });
    if (stack.config) {
      dispatch({ type: 'IMPORT_STATE', state: stack.config as any });
    }
    dispatch({ type: 'SET_STEP', step: 1 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-theme-bg-base border-0 sm:border border-theme-border rounded-none sm:rounded-2xl max-w-4xl w-full h-full sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-theme-border-subtle shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-theme-text-primary">Stack Gallery</h2>
              <p className="text-sm text-theme-text-muted">Browse curated configurations and start building</p>
            </div>
            <button
              onClick={onClose}
              className="text-theme-text-muted hover:text-theme-text-primary transition-colors text-lg px-2"
            >
              x
            </button>
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                !activeTag
                  ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent-text'
                  : 'bg-theme-bg-surface border-theme-border text-theme-text-muted hover:text-theme-text-secondary'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  activeTag === tag
                    ? 'bg-theme-accent-subtle border-theme-accent text-theme-accent-text'
                    : 'bg-theme-bg-surface border-theme-border text-theme-text-muted hover:text-theme-text-secondary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stack cards */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((stack) => (
              <div
                key={stack.id}
                className="p-4 rounded-xl border border-theme-border bg-theme-bg-surface hover:border-theme-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-theme-text-primary">{stack.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[stack.difficulty]}`}>
                    {stack.difficulty}
                  </span>
                </div>
                <p className="text-sm text-theme-text-muted mb-3">{stack.description}</p>
                {stack.tip && (
                  <p className="text-xs text-theme-text-muted italic mb-3 pl-2 border-l-2 border-theme-border-subtle">
                    {stack.tip}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {getGalleryAppNames(stack).map((name) => (
                    <span
                      key={name}
                      className="text-xs px-1.5 py-0.5 rounded bg-theme-bg-elevated text-theme-text-secondary"
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleUseStack(stack)}
                  className="w-full py-1.5 rounded-lg text-xs font-medium bg-theme-accent text-white hover:bg-theme-accent-hover transition-colors"
                >
                  Use this stack
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
