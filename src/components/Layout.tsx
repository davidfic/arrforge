import { StepIndicator } from './StepIndicator';
import { AdvancedToggle } from './AdvancedToggle';
import { ThemeToggle } from './ThemeToggle';
import type { ThemePreference } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  maxStep: number;
  advancedMode: boolean;
  onStepClick: (step: number) => void;
  onToggleAdvanced: () => void;
  theme: { preference: ThemePreference; resolved: 'light' | 'dark'; cycle: () => void };
}

export function Layout({ children, currentStep, maxStep, advancedMode, onStepClick, onToggleAdvanced, theme }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => onStepClick(0)}
            className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-2 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
          >
            <span className="text-purple-500 dark:text-purple-400">&#9881;</span>
            ArrForge
          </button>
          <StepIndicator currentStep={currentStep} maxStep={maxStep} onStepClick={onStepClick} />
          <div className="flex items-center gap-2">
            <ThemeToggle preference={theme.preference} resolved={theme.resolved} onCycle={theme.cycle} />
            <AdvancedToggle enabled={advancedMode} onToggle={onToggleAdvanced} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-4 text-center text-xs text-gray-400 dark:text-gray-600">
        ArrForge &mdash; Open source Docker Compose generator for the arr media stack
      </footer>
    </div>
  );
}
