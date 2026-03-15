const STEPS = ['Welcome', 'Select Apps', 'Configure', 'Review'];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2">
      {STEPS.map((label, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = i < currentStep;

        return (
          <div key={label} className="flex items-center">
            <button
              onClick={() => isClickable && onStepClick(i)}
              disabled={!isClickable}
              className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                isCurrent
                  ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
                  : isComplete
                    ? 'text-purple-400 hover:text-purple-300 cursor-pointer'
                    : 'text-gray-600 cursor-default'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCurrent
                    ? 'bg-purple-600 text-white'
                    : isComplete
                      ? 'bg-purple-800 text-purple-300'
                      : 'bg-gray-800 text-gray-500'
                }`}
              >
                {isComplete ? '\u2713' : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`mx-1 text-xs ${i < currentStep ? 'text-purple-700' : 'text-gray-700'}`}>
                /
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
