import type { WizardState, WizardAction } from '../types';
import { PathConfigForm } from '../components/PathConfigForm';
import { SettingsForm } from '../components/SettingsForm';

interface ConfigureStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function ConfigureStep({ state, dispatch }: ConfigureStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Configure Your Stack</h2>
        <p className="text-sm text-gray-400">
          Set paths, permissions, and timezone for your {state.selectedApps.length} selected apps
        </p>
      </div>

      <div className="max-w-xl">
        <PathConfigForm state={state} dispatch={dispatch} />
        <SettingsForm state={state} dispatch={dispatch} />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-800">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
          className="px-6 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
        >
          Next: Review & Download
        </button>
      </div>
    </div>
  );
}
