import type { WizardAction, AppDefinition } from '../types';
import { getAppByIdWithCustom } from '../utils/appLookup';
import { CATEGORY_LABELS, type AppCategory } from '../types';
import { useDragReorder } from '../hooks/useDragReorder';

interface ReorderableAppListProps {
  selectedApps: string[];
  customApps: AppDefinition[];
  dispatch: React.Dispatch<WizardAction>;
}

export function ReorderableAppList({ selectedApps, customApps, dispatch }: ReorderableAppListProps) {
  const { drag, getDragProps, containerRef } = useDragReorder(
    selectedApps,
    (reordered) => dispatch({ type: 'REORDER_APPS', appIds: reordered }),
  );

  if (selectedApps.length < 2) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-theme-text-secondary mb-2">
        Service Order
      </label>
      <p className="text-xs text-theme-text-muted mb-3">
        Drag to reorder services in the generated docker-compose.yml
      </p>
      <div ref={containerRef} className="space-y-1">
        {selectedApps.map((appId, index) => {
          const app = getAppByIdWithCustom(appId, customApps);
          if (!app) return null;

          const isDragging = drag.dragIndex === index;
          const isOver = drag.overIndex === index && drag.dragIndex !== index;

          return (
            <div
              key={appId}
              {...getDragProps(index)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing transition-all select-none ${
                isDragging
                  ? 'opacity-40 border-theme-accent bg-theme-accent-subtle'
                  : isOver
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-theme-border-subtle bg-theme-bg-surface hover:border-theme-border'
              }`}
            >
              {/* Grip handle */}
              <span className="text-theme-text-muted text-xs shrink-0 select-none">
                {'\u2630'}
              </span>

              {/* App info */}
              <span className="text-sm text-theme-text-primary font-medium flex-1">{app.name}</span>
              <span className="text-xs text-theme-text-muted">
                {CATEGORY_LABELS[app.category as AppCategory] || app.category}
              </span>
              {app.ports.length > 0 && (
                <span className="text-xs text-theme-text-muted">:{app.ports[0].host}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
