import { describe, expect, it } from 'vitest';

import { oakTerminalThemes } from './terminal-theme.js';

describe('oakTerminalThemes', () => {
  it('projects light and dark terminal colours from resolved token source', () => {
    expect(oakTerminalThemes.light.mode).toBe('light');
    expect(oakTerminalThemes.light.colours).toMatchObject({
      page: '#bef2bd',
      panel: '#f4efe8',
      text: '#222222',
      active: '#287c34',
      danger: '#b43c31',
    });
    expect(oakTerminalThemes.dark.mode).toBe('dark');
    expect(oakTerminalThemes.dark.colours).toMatchObject({
      page: '#008237',
      panel: '#31465f',
      text: '#fcfbf8',
      active: '#bef2bd',
      danger: '#fcfbf8',
    });
  });
});
