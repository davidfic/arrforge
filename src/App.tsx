import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { WelcomeStep } from './steps/WelcomeStep';
import { SelectAppsStep } from './steps/SelectAppsStep';
import { ConfigureStep } from './steps/ConfigureStep';
import { ReviewStep } from './steps/ReviewStep';
import { SetupGuideStep } from './steps/SetupGuideStep';
import { useWizardState } from './hooks/useWizardState';
import { useTheme } from './hooks/useTheme';
import { decodeHashToState } from './utils/shareLink';
import { StackGallery } from './components/StackGallery';

export default function App() {
  const { state, dispatch, reset } = useWizardState();
  const theme = useTheme();
  const [sharedConfig, setSharedConfig] = useState<ReturnType<typeof decodeHashToState>>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    const prefix = '#config=';
    if (hash.startsWith(prefix)) {
      const encoded = hash.slice(prefix.length);
      const decoded = decodeHashToState(encoded);
      if (decoded) {
        setSharedConfig(decoded);
      }
      history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleStepClick = (step: number) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <WelcomeStep dispatch={dispatch} onOpenGallery={() => setGalleryOpen(true)} />;
      case 1:
        return <SelectAppsStep state={state} dispatch={dispatch} />;
      case 2:
        return <ConfigureStep state={state} dispatch={dispatch} />;
      case 3:
        return <ReviewStep state={state} dispatch={dispatch} onReset={reset} />;
      case 4:
        return <SetupGuideStep state={state} dispatch={dispatch} onReset={reset} />;
      default:
        return <WelcomeStep dispatch={dispatch} onOpenGallery={() => setGalleryOpen(true)} />;
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
      {sharedConfig && (
        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-theme-text-primary">Shared configuration detected</p>
            <p className="text-xs text-theme-text-muted">
              {sharedConfig.selectedApps?.length || 0} apps selected. Load this configuration?
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => {
                dispatch({ type: 'IMPORT_STATE', state: sharedConfig as any });
                dispatch({ type: 'SET_STEP', step: 1 });
                setSharedConfig(null);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-500 transition-colors"
            >
              Load
            </button>
            <button
              onClick={() => setSharedConfig(null)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-theme-bg-surface text-theme-text-muted hover:text-theme-text-primary transition-colors border border-theme-border"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      {renderStep()}
      {galleryOpen && (
        <StackGallery dispatch={dispatch} onClose={() => setGalleryOpen(false)} />
      )}
    </Layout>
  );
}
