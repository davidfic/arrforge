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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Setup Guide</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Follow these steps to configure your apps after starting the stack
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {completed.length} of {tasks.length} tasks completed
          </span>
          <span className="text-xs font-medium text-purple-600 dark:text-purple-400">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
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
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_SETUP_TASK', taskId: task.id })}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
                  }`}
                >
                  {isDone && (
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
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

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => dispatch({ type: 'SET_STEP', step: 3 })}
          className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Back to Review
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
