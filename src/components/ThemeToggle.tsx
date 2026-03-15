import type { ThemePreference } from '../hooks/useTheme';

interface ThemeToggleProps {
  preference: ThemePreference;
  resolved: 'light' | 'dark';
  onCycle: () => void;
}

const icons: Record<ThemePreference, string> = {
  light: '\u2600',   // sun
  dark: '\uD83C\uDF19',    // moon
  system: '\uD83D\uDDA5',  // monitor
};

const labels: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

export function ThemeToggle({ preference, onCycle }: ThemeToggleProps) {
  return (
    <button
      onClick={onCycle}
      className="px-2 py-1.5 rounded-lg text-sm transition-colors bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
      title={`Theme: ${labels[preference]}`}
    >
      {icons[preference]}
    </button>
  );
}
