import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'light' | 'dark' | 'midnight' | 'nord' | 'dracula';

export const THEMES: { id: Theme; label: string; bg: string; accent: string }[] = [
  { id: 'light', label: 'Light', bg: '#ffffff', accent: '#a855f7' },
  { id: 'dark', label: 'Dark', bg: '#030712', accent: '#a855f7' },
  { id: 'midnight', label: 'Midnight', bg: '#0d1117', accent: '#a371f7' },
  { id: 'nord', label: 'Nord', bg: '#2e3440', accent: '#88c0d0' },
  { id: 'dracula', label: 'Dracula', bg: '#282a36', accent: '#bd93f9' },
];

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('arrforge-theme', 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const cycle = useCallback(() => {
    const ids = THEMES.map((t) => t.id);
    const next = ids[(ids.indexOf(theme) + 1) % ids.length];
    setTheme(next);
  }, [theme, setTheme]);

  return { theme, setTheme, cycle };
}
