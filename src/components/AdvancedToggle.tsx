interface AdvancedToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function AdvancedToggle({ enabled, onToggle }: AdvancedToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        enabled
          ? 'bg-purple-900/50 text-purple-300 border border-purple-700'
          : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
      }`}
    >
      <span
        className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${
          enabled ? 'bg-purple-600' : 'bg-gray-600'
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      Advanced Mode
    </button>
  );
}
