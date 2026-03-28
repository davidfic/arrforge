import { useState } from 'react';

interface CopyCommandProps {
  command: string;
}

export function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <code className="flex-1 text-xs px-2.5 py-1.5 rounded bg-theme-bg-elevated text-theme-text-secondary overflow-x-auto">
        {command}
      </code>
      <button
        onClick={handleCopy}
        className="shrink-0 text-xs px-2 py-1.5 rounded bg-theme-bg-elevated text-theme-text-muted hover:text-theme-text-primary transition-colors"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
