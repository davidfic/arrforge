import type { WizardState } from '../types';
import { getRequiredDirs, getConfigDirs } from './folders';

export function generateSetupScript(state: WizardState): string {
  const allDirs = [
    ...getRequiredDirs(state.selectedApps),
    ...getConfigDirs(state.selectedApps),
  ];

  const bp = state.basePath;
  const dirArgs = allDirs.map((d) => `"${bp}/${d}"`).join(' \\\n  ');

  return `#!/usr/bin/env bash
set -euo pipefail

# Creates all directories needed by docker-compose.yml before first run.
# This ensures correct ownership (your user, not root) so containers
# that don't use PUID/PGID can write to their config volumes.

mkdir -p \\
  ${dirArgs}

echo "Directories created. You can now run: docker compose up -d"
`;
}
