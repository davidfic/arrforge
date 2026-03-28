import { useState } from 'react';
import type { WizardState, WizardAction } from '../types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../types';
import { getAppsByCategory } from '../data/apps';
import { CategoryGroup } from '../components/CategoryGroup';
import { getActiveConflicts } from '../data/conflicts';

interface SelectAppsStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function SelectAppsStep({ state, dispatch }: SelectAppsStepProps) {
  const canContinue = state.selectedApps.length > 0;
  const conflicts = getActiveConflicts(state.selectedApps);
  const [dismissedConflicts, setDismissedConflicts] = useState<Set<string>>(new Set());

  const visibleConflicts = conflicts.filter((c) => !dismissedConflicts.has(c.id));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary mb-1">Select Your Apps</h2>
        <p className="text-sm text-theme-text-muted">
          {state.selectedApps.length} app{state.selectedApps.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {visibleConflicts.length > 0 && (
        <div className="space-y-2 mb-6">
          {visibleConflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                conflict.severity === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
              }`}
            >
              <span className="shrink-0 mt-0.5">{conflict.severity === 'warning' ? '!' : 'i'}</span>
              <span className="flex-1">{conflict.message}</span>
              <button
                onClick={() => setDismissedConflicts((prev) => new Set(prev).add(conflict.id))}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {CATEGORY_ORDER.map((category) => {
          const categoryApps = getAppsByCategory(category);
          if (categoryApps.length === 0) return null;
          return (
            <CategoryGroup
              key={category}
              label={CATEGORY_LABELS[category]}
              apps={categoryApps}
              selectedApps={state.selectedApps}
              onToggleApp={(appId) => dispatch({ type: 'TOGGLE_APP', appId })}
            />
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-theme-border-subtle">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 0 })}
          className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          disabled={!canContinue}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            canContinue
              ? 'bg-purple-600 text-white hover:bg-purple-500'
              : 'bg-theme-bg-surface text-theme-text-muted cursor-not-allowed'
          }`}
        >
          Next: Configure
        </button>
      </div>
    </div>
  );
}
