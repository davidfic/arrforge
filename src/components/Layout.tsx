import { StepIndicator } from './StepIndicator';
import { AdvancedToggle } from './AdvancedToggle';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  maxStep: number;
  advancedMode: boolean;
  onStepClick: (step: number) => void;
  onToggleAdvanced: () => void;
  theme: { theme: Theme; setTheme: (t: Theme) => void };
}

export function Layout({ children, currentStep, maxStep, advancedMode, onStepClick, onToggleAdvanced, theme }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-theme-border bg-theme-bg-elevated backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => onStepClick(0)}
            className="text-lg font-semibold text-theme-text-primary tracking-tight flex items-center gap-2 hover:text-theme-accent transition-colors"
          >
            <span className="text-theme-accent">&#9881;</span>
            ArrForge
          </button>
          <StepIndicator currentStep={currentStep} maxStep={maxStep} onStepClick={onStepClick} />
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme.theme} onSelect={theme.setTheme} />
            <AdvancedToggle enabled={advancedMode} onToggle={onToggleAdvanced} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-theme-border py-4 text-center text-xs text-theme-text-muted">
        ArrForge &mdash; Open source Docker Compose generator for the arr media stack
      </footer>
    </div>
  );
}
