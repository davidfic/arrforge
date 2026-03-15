import type { WizardState, WizardAction } from '../types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from '../types';
import { getAppsByCategory } from '../data/apps';
import { CategoryGroup } from '../components/CategoryGroup';

interface SelectAppsStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function SelectAppsStep({ state, dispatch }: SelectAppsStepProps) {
  const canContinue = state.selectedApps.length > 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Select Your Apps</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {state.selectedApps.length} app{state.selectedApps.length !== 1 ? 's' : ''} selected
        </p>
      </div>

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

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 0 })}
          className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          disabled={!canContinue}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            canContinue
              ? 'bg-purple-600 text-white hover:bg-purple-500'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Configure
        </button>
      </div>
    </div>
  );
}
