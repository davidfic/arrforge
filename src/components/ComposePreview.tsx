import { useState, useCallback, useMemo } from 'react';
import type { WizardState } from '../types';
import { generateCompose } from '../generators/compose';
import { generateEnv } from '../generators/env';
import { generateReadme } from '../generators/readme';
import { generateAdvanced } from '../generators/advanced';
import { generateVpnCompose } from '../generators/vpn';
import { generateFolderGuide } from '../generators/folders';
import { generatePerHost } from '../generators/multihost';

interface Tab {
  id: string;
  label: string;
  shortLabel: string;
  generate: (state: WizardState) => string;
}

const TABS: Tab[] = [
  { id: 'compose', label: 'docker-compose.yml', shortLabel: 'compose', generate: generateCompose },
  { id: 'env', label: '.env', shortLabel: '.env', generate: generateEnv },
  { id: 'readme', label: 'README.md', shortLabel: 'README', generate: generateReadme },
  { id: 'advanced', label: 'ADVANCED.md', shortLabel: 'Advanced', generate: generateAdvanced },
  { id: 'folders', label: 'Folder Setup', shortLabel: 'Folders', generate: generateFolderGuide },
];

const VPN_TAB: Tab = {
  id: 'vpn',
  label: 'docker-compose.vpn.yml',
  shortLabel: 'VPN',
  generate: generateVpnCompose,
};

interface ComposePreviewProps {
  state: WizardState;
}

export function ComposePreview({ state }: ComposePreviewProps) {
  const [activeTab, setActiveTab] = useState('compose');
  const [copied, setCopied] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);

  const isMultiHost = state.multiHost && state.hosts.length > 1;

  const perHostOutputs = useMemo(() => {
    if (!isMultiHost) return [];
    return generatePerHost(state);
  }, [state, isMultiHost]);

  // Determine which host to show
  const activeHostId = selectedHostId || (perHostOutputs.length > 0 ? perHostOutputs[0].hostId : null);
  const activeHostOutput = perHostOutputs.find((h) => h.hostId === activeHostId);

  const tabs = useMemo(() => {
    const baseTabs = state.includeVpnCompose ? [...TABS, VPN_TAB] : TABS;
    return baseTabs;
  }, [state.includeVpnCompose]);

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const content = useMemo(() => {
    if (isMultiHost && activeHostOutput) {
      // Per-host tabs: compose and env are host-specific
      if (currentTab.id === 'compose') return activeHostOutput.compose;
      if (currentTab.id === 'env') return activeHostOutput.env;
      if (currentTab.id === 'readme') return activeHostOutput.readme;
      if (currentTab.id === 'vpn' && activeHostOutput.vpn) return activeHostOutput.vpn;
    }
    return currentTab.generate(state);
  }, [isMultiHost, activeHostOutput, currentTab, state]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <div className="border border-theme-border-subtle rounded-xl overflow-hidden">
      {/* Host selector for multi-host mode */}
      {isMultiHost && perHostOutputs.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-theme-bg-surface border-b border-theme-border-subtle">
          <span className="text-xs text-theme-text-muted">Host:</span>
          <select
            value={activeHostId || ''}
            onChange={(e) => setSelectedHostId(e.target.value)}
            className="bg-theme-bg-surface border border-theme-border rounded-lg px-2 py-1 text-xs text-theme-text-primary focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent"
          >
            {perHostOutputs.map((host) => (
              <option key={host.hostId} value={host.hostId}>
                {host.hostName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-theme-border-subtle overflow-x-auto scrollbar-hide bg-theme-bg-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-theme-accent-text bg-theme-bg-surface'
                : 'border-transparent text-theme-text-muted hover:text-theme-text-secondary'
            }`}
          >
            <span className="sm:hidden">{tab.shortLabel}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2 py-1 text-xs bg-theme-bg-surface text-theme-text-muted rounded hover:text-theme-text-primary transition-colors z-10"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <pre className="p-4 text-xs text-theme-text-secondary overflow-x-auto max-h-[500px] overflow-y-auto bg-theme-bg-base">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
}
