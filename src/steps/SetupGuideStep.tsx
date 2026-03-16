import type { WizardState, WizardAction } from '../types';
import { generateSetupTasks } from '../data/setupTasks';

interface SetupGuideStepProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  onReset: () => void;
}

export function SetupGuideStep({ state, dispatch, onReset }: SetupGuideStepProps) {
  const tasks = generateSetupTasks(state.selectedApps);
  const completed = state.completedSetupTasks;
  const progress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary mb-1">Setup Guide</h2>
        <p className="text-sm text-theme-text-muted">
          Follow these steps to configure your apps after starting the stack
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-theme-text-muted">
            {completed.length} of {tasks.length} tasks completed
          </span>
          <span className="text-xs font-medium text-theme-accent-text">{progress}%</span>
        </div>
        <div className="h-2 bg-theme-bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isDone = completed.includes(task.id);
          return (
            <div
              key={task.id}
              className={`p-4 rounded-lg border transition-colors ${
                isDone
                  ? 'bg-green-900/20 border-green-800/50'
                  : 'bg-theme-bg-surface border-theme-border-subtle'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_SETUP_TASK', taskId: task.id })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-theme-border hover:border-purple-500'
                  }`}
                >
                  {isDone && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'text-green-500 line-through' : 'text-theme-text-primary'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-theme-text-muted mt-1">{task.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {task.url && (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-500 hover:text-purple-400"
                      >
                        Open app
                      </a>
                    )}
                    {task.docUrl && (
                      <a
                        href={task.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-500 hover:text-purple-400"
                      >
                        Docs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-theme-border-subtle">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
          className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary transition-colors"
        >
          Back to Review
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-red-500 hover:text-red-400 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
