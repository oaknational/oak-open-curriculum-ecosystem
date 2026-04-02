import { describe, expect, it } from 'vitest';
import {
  createCssBlock,
  flattenDesignTokens,
  type DtcgTokenTree,
  validateTierReferences,
} from './index.js';

describe('design token core helpers', () => {
  it('flattens DTCG tokens into namespaced Oak CSS variables', () => {
    const tokenTree: DtcgTokenTree = {
      color: {
        ink: { $type: 'color', $value: '#102033' },
      },
      semantic: {
        'text-primary': { $type: 'color', $value: '{color.ink}' },
      },
      component: {
        'shell-title-color': { $type: 'color', $value: '{semantic.text-primary}' },
      },
    };

    expect(flattenDesignTokens(tokenTree)).toEqual([
      {
        path: ['color', 'ink'],
        cssVariable: '--oak-color-ink',
        cssValue: '#102033',
      },
      {
        path: ['semantic', 'text-primary'],
        cssVariable: '--oak-semantic-text-primary',
        cssValue: 'var(--oak-color-ink)',
      },
      {
        path: ['component', 'shell-title-color'],
        cssVariable: '--oak-component-shell-title-color',
        cssValue: 'var(--oak-semantic-text-primary)',
      },
    ]);
  });

  it('emits a CSS block for flattened design tokens', () => {
    const tokenTree: DtcgTokenTree = {
      color: {
        paper: { $type: 'color', $value: '#f7f3eb' },
      },
      semantic: {
        'surface-page': { $type: 'color', $value: '{color.paper}' },
      },
    };

    const css = createCssBlock(':root', flattenDesignTokens(tokenTree));

    expect(css).toContain(':root {');
    expect(css).toContain('--oak-color-paper: #f7f3eb;');
    expect(css).toContain('--oak-semantic-surface-page: var(--oak-color-paper);');
  });

  it('rejects component tokens that skip the semantic tier', () => {
    const invalidTokenTree: DtcgTokenTree = {
      color: {
        ink: { $type: 'color', $value: '#102033' },
      },
      component: {
        'shell-title-color': { $type: 'color', $value: '{color.ink}' },
      },
    };

    expect(() => validateTierReferences(invalidTokenTree)).toThrow(
      'Component tokens must reference semantic tokens.',
    );
  });
});
