import JSZip from 'jszip';
import type { WizardState } from '../types';
import { generateCompose } from './compose';
import { generateEnv } from './env';
import { generateReadme } from './readme';
import { generateAdvanced } from './advanced';
import { generateVpnCompose } from './vpn';

export async function buildZipBlob(state: WizardState): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('media-stack')!;

  folder.file('docker-compose.yml', generateCompose(state));
  folder.file('.env', generateEnv(state));
  folder.file('README.md', generateReadme(state));
  folder.file('ADVANCED.md', generateAdvanced(state));

  if (state.includeVpnCompose) {
    folder.file('docker-compose.vpn.yml', generateVpnCompose(state));
  }

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
}

export function buildComposeBlob(state: WizardState): Blob {
  const content = generateCompose(state);
  return new Blob([content], { type: 'application/x-yaml' });
}
