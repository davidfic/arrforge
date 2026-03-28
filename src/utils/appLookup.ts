import type { AppDefinition } from '../types';
import { getAppById, getAppsByCategory } from '../data/apps';

export function getAppByIdWithCustom(
  id: string,
  customApps: AppDefinition[],
): AppDefinition | undefined {
  return getAppById(id) || customApps.find((a) => a.id === id);
}

export function getAppsByCategoryWithCustom(
  category: string,
  customApps: AppDefinition[],
): AppDefinition[] {
  const builtIn = getAppsByCategory(category);
  const custom = customApps.filter((a) => a.category === category);
  return [...builtIn, ...custom];
}
