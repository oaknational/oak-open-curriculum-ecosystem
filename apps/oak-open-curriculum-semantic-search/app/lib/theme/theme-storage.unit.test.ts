import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getStoredThemeMode,
  setStoredThemeMode,
  THEME_MODEL_LOCAL_STORAGE_KEY,
} from './theme-utils';

describe('theme storage utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('setStoredThemeMode writes to localStorage', () => {
    setStoredThemeMode('dark');
    expect(window.localStorage.getItem(THEME_MODEL_LOCAL_STORAGE_KEY)).toBe('dark');
  });

  it('getStoredThemeMode reads a valid stored value', () => {
    window.localStorage.setItem(THEME_MODEL_LOCAL_STORAGE_KEY, 'light');
    expect(getStoredThemeMode()).toBe('light');
  });

  it('getStoredThemeMode returns null for invalid value', () => {
    window.localStorage.setItem(THEME_MODEL_LOCAL_STORAGE_KEY, 'invalid');
    expect(getStoredThemeMode()).toBeNull();
  });
});
