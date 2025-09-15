import { describe, it, expect } from 'vitest';
import { isThemeMode, resolveMode, makeThemeCookie } from './theme-utils';

describe('theme-utils', () => {
  it('isThemeMode validates allowed modes', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(true);
    expect(isThemeMode('other')).toBe(false);
    expect(isThemeMode(123)).toBe(false);
  });

  it('resolveMode maps explicit modes directly', () => {
    const prefersDark = () => true;
    expect(resolveMode('light', prefersDark)).toBe('light');
    expect(resolveMode('dark', prefersDark)).toBe('dark');
  });

  it('resolveMode(system) uses prefers-color-scheme helper', () => {
    expect(resolveMode('system', () => true)).toBe('dark');
    expect(resolveMode('system', () => false)).toBe('light');
  });

  it('makeThemeCookie builds a safe cookie string', () => {
    const cookie = makeThemeCookie('dark');
    expect(cookie).toContain('theme-mode=dark');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain('SameSite=Lax');
  });

  it('makeThemeCookie defaults to system when invalid', () => {
    const cookie = makeThemeCookie('invalid');
    expect(cookie).toContain('theme-mode=system');
  });
});
