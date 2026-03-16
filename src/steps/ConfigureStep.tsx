import type { WizardState, WizardAction } from '../types';
import { PathConfigForm } from '../components/PathConfigForm';
import { SettingsForm } from '../components/SettingsForm';
import { AppConfigPanel } from '../components/AppConfigPanel';

interface ConfigureStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
}

export function ConfigureStep({ state, dispatch }: ConfigureStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary mb-1">Configure Your Stack</h2>
        <p className="text-sm text-theme-text-muted">
          Set paths, permissions, and timezone for your {state.selectedApps.length} selected apps
        </p>
      </div>

      <div className="max-w-xl">
        <PathConfigForm state={state} dispatch={dispatch} />
        <SettingsForm state={state} dispatch={dispatch} />
        <AppConfigPanel state={state} dispatch={dispatch} />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-theme-border-subtle">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}
          className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary transition-colors"
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
