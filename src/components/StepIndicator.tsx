const STEPS = ['Welcome', 'Select Apps', 'Configure', 'Review', 'Setup Guide'];

interface StepIndicatorProps {
  currentStep: number;
  maxStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, maxStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = i !== currentStep && i <= maxStep;

        return (
          <div key={label} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                isCurrent
                  ? 'bg-theme-accent-subtle text-theme-accent-text border border-theme-accent'
                  : isClickable
                    ? 'text-theme-accent-text hover:text-theme-accent cursor-pointer'
                    : 'text-theme-text-muted cursor-default'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCurrent
                    ? 'bg-purple-600 text-white'
                    : isClickable
                      ? 'bg-theme-accent-subtle text-theme-accent-text'
                      : 'bg-theme-bg-surface text-theme-text-muted'
                }`}
              >
                {isComplete ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`mx-1 text-xs ${i < maxStep ? 'text-theme-accent-text' : 'text-theme-border'}`}>
                /
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
