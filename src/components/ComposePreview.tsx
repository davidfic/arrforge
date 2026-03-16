import { useState, useCallback } from 'react';
import type { WizardState } from '../types';
import { generateCompose } from '../generators/compose';
import { generateEnv } from '../generators/env';
import { generateReadme } from '../generators/readme';
import { generateAdvanced } from '../generators/advanced';
import { generateVpnCompose } from '../generators/vpn';

interface Tab {
  id: string;
  label: string;
  generate: (state: WizardState) => string;
}

const TABS: Tab[] = [
  { id: 'compose', label: 'docker-compose.yml', generate: generateCompose },
  { id: 'env', label: '.env', generate: generateEnv },
  { id: 'readme', label: 'README.md', generate: generateReadme },
  { id: 'advanced', label: 'ADVANCED.md', generate: generateAdvanced },
];

const VPN_TAB: Tab = {
  id: 'vpn',
  label: 'docker-compose.vpn.yml',
  generate: generateVpnCompose,
};

interface ComposePreviewProps {
  state: WizardState;
}

export function ComposePreview({ state }: ComposePreviewProps) {
  const [activeTab, setActiveTab] = useState('compose');
  const [copied, setCopied] = useState(false);

  const tabs = state.includeVpnCompose ? [...TABS, VPN_TAB] : TABS;
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const content = currentTab.generate(state);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <div className="border border-theme-border-subtle rounded-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-theme-border-subtle overflow-x-auto bg-theme-bg-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-purple-500 text-theme-accent-text bg-theme-bg-surface'
                : 'border-transparent text-theme-text-muted hover:text-theme-text-secondary'
            }`}
          >
            {tab.label}
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
