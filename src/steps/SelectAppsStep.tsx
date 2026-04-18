import { useState } from 'react';
import type { WizardState, WizardAction, AppDefinition } from '../types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../types';
import { CategoryGroup } from '../components/CategoryGroup';
import { getActiveConflicts } from '../data/conflicts';
import { getAppsByCategoryWithCustom } from '../utils/appLookup';
import { CustomAppForm } from '../components/CustomAppForm';

interface SelectAppsStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function SelectAppsStep({ state, dispatch }: SelectAppsStepProps) {
  const canContinue = state.selectedApps.length > 0;
  const conflicts = getActiveConflicts(state.selectedApps);
  const [dismissedConflicts, setDismissedConflicts] = useState<Set<string>>(new Set());
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [editingApp, setEditingApp] = useState<AppDefinition | undefined>(undefined);

  const visibleConflicts = conflicts.filter((c) => !dismissedConflicts.has(c.id));

  function handleOpenEdit(app: AppDefinition) {
    setEditingApp(app);
    setShowCustomForm(true);
  }

  function handleCloseForm() {
    setShowCustomForm(false);
    setEditingApp(undefined);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary mb-1">Select Your Apps</h2>
        <p className="text-sm text-theme-text-muted">
          {state.selectedApps.length} app{state.selectedApps.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {state.presetTip && (
        <div className="mb-6 p-3 rounded-lg border-l-4 border-theme-accent bg-theme-bg-surface text-sm text-theme-text-secondary">
          <span className="block text-xs font-medium uppercase tracking-wide text-theme-accent-text mb-1">Tip</span>
          <span>{state.presetTip}</span>
        </div>
      )}

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
          const categoryApps = getAppsByCategoryWithCustom(category, state.customApps);
          if (category === 'custom' && categoryApps.length === 0) return null;
          if (categoryApps.length === 0) return null;
          return (
            <div key={category}>
              <CategoryGroup
                label={CATEGORY_LABELS[category]}
                apps={categoryApps}
                selectedApps={state.selectedApps}
                onToggleApp={(appId) => dispatch({ type: 'TOGGLE_APP', appId })}
              />
              {category === 'custom' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => handleOpenEdit(app)}
                      className="text-xs px-2 py-1 rounded bg-theme-bg-elevated border border-theme-border-subtle text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                    >
                      Edit {app.name}
                    </button>
                  ))}
                  {categoryApps.map((app) => (
                    <button
                      key={`remove-${app.id}`}
                      onClick={() => dispatch({ type: 'REMOVE_CUSTOM_APP', appId: app.id })}
                      className="text-xs px-2 py-1 rounded bg-theme-bg-elevated border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove {app.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Custom App button */}
      <div className="mt-8">
        <button
          onClick={() => setShowCustomForm(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-theme-bg-surface border border-theme-border text-theme-text-secondary hover:text-theme-text-primary hover:border-theme-accent transition-colors"
        >
          + Add Custom App
        </button>
      </div>

      {/* Custom App Form modal */}
      {showCustomForm && (
        <CustomAppForm
          dispatch={dispatch}
          onClose={handleCloseForm}
          editApp={editingApp}
        />
      )}

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
              ? 'bg-theme-accent text-white hover:bg-theme-accent-hover'
              : 'bg-theme-bg-surface text-theme-text-muted cursor-not-allowed'
          }`}
        >
          Next: Configure
        </button>
      </div>
    </div>
  );
}
