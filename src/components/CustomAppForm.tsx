import { useState } from 'react';
import type { AppDefinition, AppPort, AppVolume, WizardAction } from '../types';

interface CustomAppFormProps {
  dispatch: React.Dispatch<WizardAction>;
  onClose: () => void;
  editApp?: AppDefinition;
}

interface PortRow {
  host: string;
  container: string;
  description: string;
}

interface VolumeRow {
  host: string;
  container: string;
  description: string;
}

export function CustomAppForm({ dispatch, onClose, editApp }: CustomAppFormProps) {
  const [name, setName] = useState(editApp?.name ?? '');
  const [image, setImage] = useState(editApp?.image ?? '');
  const [description, setDescription] = useState(editApp?.description ?? '');
  const [docUrl, setDocUrl] = useState(editApp?.docUrl ?? '');
  const [ports, setPorts] = useState<PortRow[]>(
    editApp?.ports.map((p) => ({
      host: String(p.host),
      container: String(p.container),
      description: p.description,
    })) ?? [],
  );
  const [volumes, setVolumes] = useState<VolumeRow[]>(
    editApp?.volumes.map((v) => ({
      host: v.host,
      container: v.container,
      description: v.description,
    })) ?? [],
  );

  const canSave = name.trim() !== '' && image.trim() !== '';

  function handleSave() {
    if (!canSave) return;

    const id = editApp?.id ?? `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const appPorts: AppPort[] = ports
      .filter((p) => p.host && p.container)
      .map((p) => ({
        host: Number(p.host),
        container: Number(p.container),
        description: p.description,
      }));

    const appVolumes: AppVolume[] = volumes
      .filter((v) => v.host && v.container)
      .map((v) => ({
        host: v.host,
        container: v.container,
        description: v.description,
      }));

    const app: AppDefinition = {
      id,
      name: name.trim(),
      description: description.trim(),
      category: 'custom',
      image: image.trim(),
      ports: appPorts,
      volumes: appVolumes,
      docUrl: docUrl.trim(),
      starter: false,
    };

    if (editApp) {
      dispatch({ type: 'UPDATE_CUSTOM_APP', appId: editApp.id, app });
    } else {
      dispatch({ type: 'ADD_CUSTOM_APP', app });
    }
    onClose();
  }

  function addPort() {
    setPorts([...ports, { host: '', container: '', description: '' }]);
  }

  function removePort(index: number) {
    setPorts(ports.filter((_, i) => i !== index));
  }

  function updatePort(index: number, field: keyof PortRow, value: string) {
    setPorts(ports.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  function addVolume() {
    setVolumes([...volumes, { host: '', container: '', description: '' }]);
  }

  function removeVolume(index: number) {
    setVolumes(volumes.filter((_, i) => i !== index));
  }

  function updateVolume(index: number, field: keyof VolumeRow, value: string) {
    setVolumes(volumes.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  const inputClass =
    'w-full px-3 py-2 rounded-lg bg-theme-bg-elevated border border-theme-border-subtle text-theme-text-primary text-sm focus:outline-none focus:border-theme-accent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-theme-bg-base border-0 sm:border border-theme-border rounded-none sm:rounded-2xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-theme-border-subtle shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-theme-text-primary">
                {editApp ? 'Edit Custom App' : 'Add Custom App'}
              </h2>
              <p className="text-sm text-theme-text-muted">
                Define a Docker service to include in your compose stack
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-theme-text-muted hover:text-theme-text-primary transition-colors text-lg px-2"
            >
              x
            </button>
          </div>
        </div>

        {/* Form body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Service"
              className={inputClass}
            />
          </div>

          {/* Docker Image */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Docker Image <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="nginx:latest"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this service"
              className={inputClass}
            />
          </div>

          {/* Doc URL */}
          <div>
            <label className="block text-sm font-medium text-theme-text-secondary mb-1">
              Doc URL
            </label>
            <input
              type="text"
              value={docUrl}
              onChange={(e) => setDocUrl(e.target.value)}
              placeholder="https://example.com/docs"
              className={inputClass}
            />
          </div>

          {/* Ports */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-theme-text-secondary">Ports</label>
              <button
                onClick={addPort}
                className="text-xs px-2 py-1 rounded bg-theme-bg-elevated border border-theme-border-subtle text-theme-text-secondary hover:text-theme-text-primary transition-colors"
              >
                + Add Port
              </button>
            </div>
            {ports.length === 0 && (
              <p className="text-xs text-theme-text-muted">No ports configured</p>
            )}
            <div className="space-y-2">
              {ports.map((port, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={port.host}
                    onChange={(e) => updatePort(i, 'host', e.target.value)}
                    placeholder="Host"
                    className={`${inputClass} w-20`}
                  />
                  <span className="text-theme-text-muted text-xs">:</span>
                  <input
                    type="number"
                    value={port.container}
                    onChange={(e) => updatePort(i, 'container', e.target.value)}
                    placeholder="Container"
                    className={`${inputClass} w-20`}
                  />
                  <input
                    type="text"
                    value={port.description}
                    onChange={(e) => updatePort(i, 'description', e.target.value)}
                    placeholder="Description"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={() => removePort(i)}
                    className="text-red-400 hover:text-red-300 text-sm px-1 shrink-0"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Volumes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-theme-text-secondary">Volumes</label>
              <button
                onClick={addVolume}
                className="text-xs px-2 py-1 rounded bg-theme-bg-elevated border border-theme-border-subtle text-theme-text-secondary hover:text-theme-text-primary transition-colors"
              >
                + Add Volume
              </button>
            </div>
            {volumes.length === 0 && (
              <p className="text-xs text-theme-text-muted">No volumes configured</p>
            )}
            <div className="space-y-2">
              {volumes.map((vol, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={vol.host}
                    onChange={(e) => updateVolume(i, 'host', e.target.value)}
                    placeholder="Host path"
                    className={`${inputClass} flex-1`}
                  />
                  <span className="text-theme-text-muted text-xs">:</span>
                  <input
                    type="text"
                    value={vol.container}
                    onChange={(e) => updateVolume(i, 'container', e.target.value)}
                    placeholder="Container path"
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    type="text"
                    value={vol.description}
                    onChange={(e) => updateVolume(i, 'description', e.target.value)}
                    placeholder="Description"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={() => removeVolume(i)}
                    className="text-red-400 hover:text-red-300 text-sm px-1 shrink-0"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-theme-border-subtle shrink-0 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-theme-text-muted hover:text-theme-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              canSave
                ? 'bg-theme-accent text-white hover:bg-theme-accent-hover'
                : 'bg-theme-bg-surface text-theme-text-muted cursor-not-allowed'
            }`}
          >
            {editApp ? 'Save Changes' : 'Add App'}
          </button>
        </div>
      </div>
    </div>
  );
}
