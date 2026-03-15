import { StepIndicator } from './StepIndicator';
import { AdvancedToggle } from './AdvancedToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  advancedMode: boolean;
  onStepClick: (step: number) => void;
  onToggleAdvanced: () => void;
}

export function Layout({ children, currentStep, advancedMode, onStepClick, onToggleAdvanced }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => onStepClick(0)}
            className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 hover:text-purple-300 transition-colors"
          >
            <span className="text-purple-400">&#9881;</span>
            ArrForge
          </button>
          <StepIndicator currentStep={currentStep} onStepClick={onStepClick} />
          <AdvancedToggle enabled={advancedMode} onToggle={onToggleAdvanced} />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        ArrForge &mdash; Open source Docker Compose generator for the arr media stack
      </footer>
    </div>
  );
}
