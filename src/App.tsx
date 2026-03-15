import { Layout } from './components/Layout';
import { WelcomeStep } from './steps/WelcomeStep';
import { SelectAppsStep } from './steps/SelectAppsStep';
import { ConfigureStep } from './steps/ConfigureStep';
import { ReviewStep } from './steps/ReviewStep';
import { useWizardState } from './hooks/useWizardState';

export default function App() {
  const { state, dispatch, reset } = useWizardState();

  const handleStepClick = (step: number) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <WelcomeStep dispatch={dispatch} />;
      case 1:
        return <SelectAppsStep state={state} dispatch={dispatch} />;
      case 2:
        return <ConfigureStep state={state} dispatch={dispatch} />;
      case 3:
        return <ReviewStep state={state} dispatch={dispatch} onReset={reset} />;
      default:
        return <WelcomeStep dispatch={dispatch} />;
    }
  };

  return (
    <Layout
      currentStep={state.step}
      advancedMode={state.advancedMode}
      onStepClick={handleStepClick}
      onToggleAdvanced={() => dispatch({ type: 'TOGGLE_ADVANCED' })}
    >
      {renderStep()}
    </Layout>
  );
}
