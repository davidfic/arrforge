import type { WizardState } from '../types';

export function generateEnv(state: WizardState): string {
  const lines: string[] = [
    '# ArrForge — Generated Environment Variables',
    '# Edit these values to customize your setup',
    '',
    `PUID=${state.puid}`,
    `PGID=${state.pgid}`,
    `TZ=${state.timezone}`,
    `BASE_PATH=${state.basePath}`,
    '',
  ];
  return lines.join('\n');
}
