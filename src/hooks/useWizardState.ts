import { useReducer, useEffect, useCallback } from 'react';
import type { WizardState, WizardAction } from '../types';
import { DEFAULT_STATE } from '../utils/defaults';

const STORAGE_KEY = 'arrforge-wizard-state';

function loadState(): WizardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    // corrupt data — start fresh
  }
  return DEFAULT_STATE;
}

function saveState(state: WizardState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded
  }
}

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step, maxStep: Math.max(state.maxStep, action.step) };
    case 'TOGGLE_ADVANCED':
      return { ...state, advancedMode: !state.advancedMode };
    case 'TOGGLE_APP': {
      const wasSelected = state.selectedApps.includes(action.appId);
      const selected = wasSelected
        ? state.selectedApps.filter((id) => id !== action.appId)
        : [...state.selectedApps, action.appId];
      // Clean up appConfigs when deselecting
      if (wasSelected && state.appConfigs[action.appId]) {
        const { [action.appId]: _, ...rest } = state.appConfigs;
        return { ...state, selectedApps: selected, appConfigs: rest };
      }
      return { ...state, selectedApps: selected };
    }
    case 'SET_APPS':
      return { ...state, selectedApps: action.appIds };
    case 'SET_OS': {
      const basePath = action.os === 'macos' ? '~/data' : '/data';
      return { ...state, os: action.os, basePath };
    }
    case 'SET_BASE_PATH':
      return { ...state, basePath: action.path };
    case 'SET_PUID':
      return { ...state, puid: action.puid };
    case 'SET_PGID':
      return { ...state, pgid: action.pgid };
    case 'SET_TIMEZONE':
      return { ...state, timezone: action.timezone };
    case 'SET_NETWORK_NAME':
      return { ...state, networkName: action.name };
    case 'SET_CUSTOM_PATH':
      return {
        ...state,
        customPaths: { ...state.customPaths, [action.appId]: action.path },
      };
    case 'SET_APP_CONFIG': {
      const updated = { ...state.appConfigs, [action.appId]: action.config };
      // Remove empty configs
      if (!action.config.containerName && !action.config.imageTag && (!action.config.customEnv || Object.keys(action.config.customEnv).length === 0)) {
        delete updated[action.appId];
      }
      return { ...state, appConfigs: updated };
    }
    case 'TOGGLE_VPN':
      return { ...state, includeVpnCompose: !state.includeVpnCompose };
    case 'TOGGLE_SETUP_TASK': {
      const tasks = state.completedSetupTasks.includes(action.taskId)
        ? state.completedSetupTasks.filter((id) => id !== action.taskId)
        : [...state.completedSetupTasks, action.taskId];
      return { ...state, completedSetupTasks: tasks };
    }
    case 'IMPORT_STATE':
      return { ...DEFAULT_STATE, ...action.state, step: state.step };
    case 'RESET':
      return DEFAULT_STATE;
    default:
      return state;
  }
}

export function useWizardState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { state, dispatch, reset };
}
