import type { AppDefinition } from '../types';
import { AppCard } from './AppCard';

interface CategoryGroupProps {
  label: string;
  apps: AppDefinition[];
  selectedApps: string[];
  onToggleApp: (appId: string) => void;
}

export function CategoryGroup({ label, apps, selectedApps, onToggleApp }: CategoryGroupProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-theme-text-secondary mb-3">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            selected={selectedApps.includes(app.id)}
            onToggle={() => onToggleApp(app.id)}
          />
        ))}
      </div>
    </div>
  );
}
