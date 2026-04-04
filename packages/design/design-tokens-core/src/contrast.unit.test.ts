import type { Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import {
  checkNonTextContrast,
  checkWcagAA,
  contrastRatio,
  hexToSrgb,
  srgbToRelativeLuminance,
} from './contrast.js';
import type { ContrastManifest } from './contrast-types.js';
import { resolveTokenTreeToHex } from './contrast-resolve.js';
import { validateContrastPairings } from './contrast-validation.js';
import type { DtcgTokenTree } from './index.js';

/** Assert a Result is Ok and return its value, or fail the test. */
function assertOkResult<T, E>(result: Result<T, E>): T {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error(`Expected Ok, got Err: ${JSON.stringify(result.error)}`);
  }

  return result.value;
}

describe('hexToSrgb', () => {
  it('parses black to zero channels', () => {
    expect(hexToSrgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('parses white to unit channels', () => {
    expect(hexToSrgb('#ffffff')).toEqual({ r: 1, g: 1, b: 1 });
  });

  it('parses a mid-range colour accurately', () => {
    const result = hexToSrgb('#8ab6d6');

    expect(result.r).toBeCloseTo(138 / 255, 10);
    expect(result.g).toBeCloseTo(182 / 255, 10);
    expect(result.b).toBeCloseTo(214 / 255, 10);
  });

  it('handles uppercase hex input', () => {
    expect(hexToSrgb('#FF0000')).toEqual({ r: 1, g: 0, b: 0 });
  });

  it('rejects a 3-digit hex shorthand', () => {
    expect(() => hexToSrgb('#fff')).toThrow('Invalid hex colour');
  });

  it('rejects a non-hex string', () => {
    expect(() => hexToSrgb('not-a-colour')).toThrow('Invalid hex colour');
  });
});

describe('srgbToRelativeLuminance', () => {
  it('returns 0 for black', () => {
    expect(srgbToRelativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
  });

  it('returns 1 for white', () => {
    expect(srgbToRelativeLuminance({ r: 1, g: 1, b: 1 })).toBeCloseTo(1, 10);
  });

  it('computes luminance for sky-400 (#8ab6d6)', () => {
    const srgb = hexToSrgb('#8ab6d6');

    expect(srgbToRelativeLuminance(srgb)).toBeCloseTo(0.4371, 3);
  });

  it('computes luminance for ink-950 (#102033)', () => {
    const srgb = hexToSrgb('#102033');

    expect(srgbToRelativeLuminance(srgb)).toBeCloseTo(0.01382, 3);
  });
});

describe('contrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    expect(contrastRatio(0, 1)).toBeCloseTo(21, 1);
  });

  it('returns 1:1 for identical luminances', () => {
    expect(contrastRatio(0.5, 0.5)).toBeCloseTo(1, 5);
  });

  it('is commutative', () => {
    expect(contrastRatio(0.1, 0.8)).toBeCloseTo(contrastRatio(0.8, 0.1), 10);
  });
});

describe('checkWcagAA', () => {
  it('passes normal text at exactly 4.5:1', () => {
    expect(checkWcagAA(4.5, 'normal')).toBe(true);
  });

  it('fails normal text below 4.5:1', () => {
    expect(checkWcagAA(4.49, 'normal')).toBe(false);
  });

  it('passes large text at exactly 3:1', () => {
    expect(checkWcagAA(3.0, 'large')).toBe(true);
  });

  it('fails large text below 3:1', () => {
    expect(checkWcagAA(2.99, 'large')).toBe(false);
  });
});

describe('checkNonTextContrast', () => {
  it('passes at exactly 3:1', () => {
    expect(checkNonTextContrast(3.0)).toBe(true);
  });

  it('fails below 3:1', () => {
    expect(checkNonTextContrast(2.99)).toBe(false);
  });
});

describe('resolveTokenTreeToHex', () => {
  it('resolves palette tokens directly to their hex values', () => {
    const tree: DtcgTokenTree = {
      color: {
        ink: { $type: 'color', $value: '#102033' },
      },
    };

    const resolved = resolveTokenTreeToHex(tree);

    expect(resolved.get('color.ink')).toBe('#102033');
  });

  it('resolves semantic tokens through palette references', () => {
    const tree: DtcgTokenTree = {
      color: {
        'paper-050': { $type: 'color', $value: '#fcfbf8' },
      },
      semantic: {
        'surface-page': { $type: 'color', $value: '{color.paper-050}' },
      },
    };

    const resolved = resolveTokenTreeToHex(tree);

    expect(resolved.get('semantic.surface-page')).toBe('#fcfbf8');
  });

  it('resolves component tokens through semantic and palette', () => {
    const tree: DtcgTokenTree = {
      color: {
        'ink-950': { $type: 'color', $value: '#102033' },
      },
      semantic: {
        'text-primary': { $type: 'color', $value: '{color.ink-950}' },
      },
      component: {
        'shell-title-color': { $type: 'color', $value: '{semantic.text-primary}' },
      },
    };

    const resolved = resolveTokenTreeToHex(tree);

    expect(resolved.get('component.shell-title-color')).toBe('#102033');
  });

  it('ignores non-colour tokens', () => {
    const tree: DtcgTokenTree = {
      font: {
        'size-300': { $type: 'dimension', $value: '1rem' },
      },
      color: {
        ink: { $type: 'color', $value: '#102033' },
      },
    };

    const resolved = resolveTokenTreeToHex(tree);

    expect(resolved.has('font.size-300')).toBe(false);
    expect(resolved.has('color.ink')).toBe(true);
  });
});

describe('validateContrastPairings', () => {
  it('reports a passing text pair', () => {
    const resolved = new Map([
      ['semantic.text-primary', '#000000'],
      ['semantic.surface-page', '#ffffff'],
    ]);
    const manifest: ContrastManifest = {
      pairs: [
        {
          foreground: 'semantic.text-primary',
          background: 'semantic.surface-page',
          context: 'text',
        },
      ],
      triads: [],
    };

    const report = assertOkResult(validateContrastPairings(resolved, manifest, 'light'));

    expect(report.summary.total).toBe(1);
    expect(report.summary.passed).toBe(1);
    expect(report.summary.failed).toBe(0);
    expect(report.results).toHaveLength(1);
    expect(report.results[0].pass).toBe(true);
  });

  it('reports a failing non-text pair', () => {
    const resolved = new Map([
      ['semantic.focus-ring', '#8ab6d6'],
      ['semantic.surface-page', '#fcfbf8'],
    ]);
    const manifest: ContrastManifest = {
      pairs: [
        {
          foreground: 'semantic.focus-ring',
          background: 'semantic.surface-page',
          context: 'non-text',
        },
      ],
      triads: [],
    };

    const report = assertOkResult(validateContrastPairings(resolved, manifest, 'light'));

    expect(report.summary.failed).toBe(1);
    expect(report.results).toHaveLength(1);
    expect(report.results[0].pass).toBe(false);
    expect(report.results[0].ratio).toBeLessThan(3);
  });

  it('expands triads into three correctly-mapped pairwise checks', () => {
    const resolved = new Map([
      ['semantic.text-inverse', '#fcfbf8'],
      ['semantic.accent', '#1d6f5f'],
      ['semantic.surface-page', '#fcfbf8'],
    ]);
    const manifest: ContrastManifest = {
      pairs: [],
      triads: [
        {
          foreground: 'semantic.text-inverse',
          middle: 'semantic.accent',
          background: 'semantic.surface-page',
          contexts: { fgMid: 'text', midBg: 'non-text', fgBg: 'text' },
        },
      ],
    };

    const report = assertOkResult(validateContrastPairings(resolved, manifest, 'light'));

    expect(report.summary.total).toBe(3);
    expect(report.results).toHaveLength(3);

    const paths = report.results.map((entry) => `${entry.foreground}->${entry.background}`);

    expect(paths).toContain('semantic.text-inverse->semantic.accent');
    expect(paths).toContain('semantic.accent->semantic.surface-page');
    expect(paths).toContain('semantic.text-inverse->semantic.surface-page');
  });

  it('marks informational triad entries as always passing', () => {
    const resolved = new Map([
      ['semantic.text-inverse', '#fcfbf8'],
      ['semantic.accent', '#1d6f5f'],
      ['semantic.surface-page', '#fcfbf8'],
    ]);
    const manifest: ContrastManifest = {
      pairs: [],
      triads: [
        {
          foreground: 'semantic.text-inverse',
          middle: 'semantic.accent',
          background: 'semantic.surface-page',
          contexts: { fgMid: 'text', midBg: 'non-text', fgBg: 'informational' },
        },
      ],
    };

    const report = assertOkResult(validateContrastPairings(resolved, manifest, 'light'));
    const fgBgEntry = report.results.find(
      (entry) =>
        entry.foreground === 'semantic.text-inverse' &&
        entry.background === 'semantic.surface-page',
    );

    expect(report.results).toHaveLength(3);
    expect(fgBgEntry).toBeDefined();

    if (fgBgEntry === undefined) {
      throw new Error('fg→bg entry not found');
    }

    expect(fgBgEntry.context).toBe('informational');
    expect(fgBgEntry.pass).toBe(true);
    expect(fgBgEntry.requiredRatio).toBe(0);
    expect(fgBgEntry.ratio).toBeCloseTo(1, 0);
  });

  it('returns Err when a manifest token path is unresolved', () => {
    const resolved = new Map([['semantic.text-primary', '#000000']]);
    const manifest: ContrastManifest = {
      pairs: [
        {
          foreground: 'semantic.text-primary',
          background: 'semantic.missing-token',
          context: 'text',
        },
      ],
      triads: [],
    };

    const result = validateContrastPairings(resolved, manifest, 'light');

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.kind).toBe('unresolved_token');
      expect(result.error.background).toBe('semantic.missing-token');
    }
  });

  it('includes the theme identifier in the report', () => {
    const resolved = new Map([
      ['semantic.text-primary', '#000000'],
      ['semantic.surface-page', '#ffffff'],
    ]);
    const manifest: ContrastManifest = {
      pairs: [
        {
          foreground: 'semantic.text-primary',
          background: 'semantic.surface-page',
          context: 'text',
        },
      ],
      triads: [],
    };

    const report = assertOkResult(validateContrastPairings(resolved, manifest, 'dark'));

    expect(report.theme).toBe('dark');
  });
});
