import { Layout } from './components/Layout';
import { WelcomeStep } from './steps/WelcomeStep';
import { SelectAppsStep } from './steps/SelectAppsStep';
import { ConfigureStep } from './steps/ConfigureStep';
import { ReviewStep } from './steps/ReviewStep';
import { SetupGuideStep } from './steps/SetupGuideStep';
import { useWizardState } from './hooks/useWizardState';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { state, dispatch, reset } = useWizardState();
  const theme = useTheme();

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
      case 4:
        return <SetupGuideStep state={state} dispatch={dispatch} onReset={reset} />;
      default:
        return <WelcomeStep dispatch={dispatch} />;
    }
  };

  return (
    <Layout
      currentStep={state.step}
      maxStep={state.maxStep}
      advancedMode={state.advancedMode}
      onStepClick={handleStepClick}
      onToggleAdvanced={() => dispatch({ type: 'TOGGLE_ADVANCED' })}
      theme={theme}
    >
      {renderStep()}
    </Layout>
  );
}
