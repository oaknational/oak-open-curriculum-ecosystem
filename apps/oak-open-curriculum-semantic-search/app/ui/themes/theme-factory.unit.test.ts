import { describe, expect, it } from 'vitest';
import { oakColorTokens, oakUiRoleTokens } from '@oaknational/oak-components';
import { createLightTheme } from './light';
import { createDarkTheme } from './dark';
import { semanticThemeSpec } from './semantic-theme-spec';
import { resolveAppTokens } from './semantic-theme-resolver';
import { resolveSemanticColor } from './semantic-color-registry';

const modes = ['light', 'dark'] as const;

describe('semanticThemeSpec', () => {
  it.each(modes)('provides an Oak colour token for every UI role in %s mode', (mode) => {
    const spec = semanticThemeSpec[mode];
    const uiRoleKeys = Object.keys(spec.uiColors).sort();
    expect(uiRoleKeys).toEqual([...oakUiRoleTokens].sort());
  });

  it('keeps app token namespaces aligned across modes', () => {
    const lightApp = semanticThemeSpec.light.app;
    const darkApp = semanticThemeSpec.dark.app;

    expect(Object.keys(darkApp.colors).sort()).toEqual(Object.keys(lightApp.colors).sort());
    expect(Object.keys(darkApp.space.gap).sort()).toEqual(Object.keys(lightApp.space.gap).sort());
    expect(Object.keys(darkApp.space.padding).sort()).toEqual(
      Object.keys(lightApp.space.padding).sort(),
    );
    expect(Object.keys(darkApp.radii).sort()).toEqual(Object.keys(lightApp.radii).sort());
    expect(Object.keys(darkApp.typography).sort()).toEqual(Object.keys(lightApp.typography).sort());
    expect(Object.keys(darkApp.fonts).sort()).toEqual(Object.keys(lightApp.fonts).sort());
  });

  it('leans on oakGreen for key brand accents', () => {
    expect(semanticThemeSpec.light.uiColors['bg-btn-primary']).toBe('oakGreen');
    expect(semanticThemeSpec.light.uiColors['text-link-active']).toBe('oakGreen');
    expect(semanticThemeSpec.light.uiColors['border-primary']).toBe('oakGreen');

    expect(semanticThemeSpec.dark.uiColors['bg-btn-primary']).toBe('oakGreen');
    expect(semanticThemeSpec.dark.uiColors['border-primary']).toBe('oakGreen');
    expect(semanticThemeSpec.dark.uiColors['border-brand']).toBe('oakGreen');
  });
});

describe('App theme factories', () => {
  const createThemeByMode = {
    light: createLightTheme,
    dark: createDarkTheme,
  } as const;

  it.each(modes)('builds a semantic %s theme from the shared spec', (mode) => {
    const theme = createThemeByMode[mode]();
    const spec = semanticThemeSpec[mode];

    expect(theme.name).toBe(spec.name);
    expect(theme.uiColors).toStrictEqual(spec.uiColors);
    expect(theme.app).toStrictEqual(resolveAppTokens(mode));
  });

  it('resolves Oak spacing tokens to rem values', () => {
    const resolved = resolveAppTokens('light');

    expect(resolved.space.gap.section).toBe('2rem');
    expect(resolved.space.gap.cluster).toBe('0.5rem');
    expect(resolved.space.gap.stack.endsWith('rem')).toBe(true);
    expect(parseFloat(resolved.space.gap.stack)).toBeGreaterThan(
      parseFloat(resolved.space.gap.cluster),
    );
    expect(parseFloat(resolved.space.gap.stack)).toBeLessThan(
      parseFloat(resolved.space.gap.section),
    );
    expect(resolved.space.padding.card).toBe('1.5rem');
    expect(resolved.space.padding.pill).toBe('0.25rem');
  });

  it('resolves Oak typography tokens to CSS-ready values', () => {
    const resolved = resolveAppTokens('light');

    expect(resolved.typography.hero.fontSizeRem).toBe('3rem');
    expect(resolved.typography.hero.lineHeight).toBeCloseTo(1.167, 3);
    expect(resolved.typography.hero.fontWeight).toBe(600);
    expect(resolved.typography.body.fontSizeRem).toBe('1.25rem');
    expect(resolved.typography.body.lineHeight).toBeCloseTo(1.4, 3);
    expect(resolved.typography.quote.fontStyle).toBe('italic');
    expect(resolved.typography.quote.fontFamily).toContain('Work Sans');
  });

  it('applies mode-specific colour overrides', () => {
    const lightColors = resolveAppTokens('light').colors;
    const darkColors = resolveAppTokens('dark').colors;

    expect(lightColors.headerBorder).toBe(oakColorTokens.oakGreen);
    expect(darkColors.headerBorder).toBe(oakColorTokens.oakGreen);
    expect(lightColors.textMuted).not.toBe(darkColors.textMuted);
    expect(lightColors.surfaceEmphasisBg).toBe('rgba(0, 0, 0, 0.06)');
    expect(darkColors.surfaceEmphasisBg).toBe('rgba(255, 255, 255, 0.08)');
  });

  it('exposes palette entries for brand colours', () => {
    const requiredKeys = [
      'brandPrimary',
      'brandPrimaryDark',
      'brandPrimaryDeep',
      'brandPrimaryBright',
    ] as const;
    const lightPalette = resolveAppTokens('light').palette;
    const darkPalette = resolveAppTokens('dark').palette;

    for (const key of requiredKeys) {
      expect(lightPalette[key]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(darkPalette[key]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('provides surface colour entries for cards and panels', () => {
    const lightColors = resolveAppTokens('light').colors as Record<string, string>;
    const darkColors = resolveAppTokens('dark').colors as Record<string, string>;

    expect(lightColors.surfaceCard).toMatch(/^#[0-9a-f]{6}$/i);
    expect(lightColors.surfaceRaised).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darkColors.surfaceCard).toMatch(/^#[0-9a-f]{6}$/i);
    expect(darkColors.surfaceRaised).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('provides layout measurements for responsive grids', () => {
    const lightLayout = resolveAppTokens('light').layout;

    expect(lightLayout.controlColumnMinWidth).toBe('20rem');
    expect(lightLayout.secondaryColumnMinWidth).toBe('18rem');
    expect(lightLayout.containerMaxWidth.replace(/\s+/g, '')).toBe('clamp(20rem,92vw,78rem)');
    expect(lightLayout.inlinePadding.base).toMatch(/rem$/);
    expect(lightLayout.inlinePadding.wide).toMatch(/rem$/);
    expect(parseFloat(lightLayout.inlinePadding.base)).toBeLessThan(
      parseFloat(lightLayout.inlinePadding.wide),
    );
    expect(lightLayout.breakpoints).toMatchObject({
      xs: '0px',
      md: '768px',
      lg: '1024px',
      xxl: '1760px',
    });
  });
});

describe('semantic theme contrast', () => {
  const contrastTriples = {
    light: [
      {
        context: 'card surface',
        text: 'textPrimary',
        background: 'surfaceCard',
        border: 'brandPrimary',
      },
      {
        context: 'raised surface',
        text: 'textPrimary',
        background: 'surfaceRaised',
        border: 'brandPrimary',
      },
    ],
    dark: [
      {
        context: 'card surface',
        text: 'textPrimary',
        background: 'surfaceCard',
        border: 'brandPrimaryBright',
      },
      {
        context: 'raised surface',
        text: 'textPrimary',
        background: 'surfaceRaised',
        border: 'brandPrimaryBright',
      },
    ],
  } as const;

  it.each(modes)('keeps %s mode text and borders above WCAG AA thresholds', (mode) => {
    const resolved = resolveAppTokens(mode);
    const triples = contrastTriples[mode];

    for (const triple of triples) {
      const { context, text, background, border } = triple;
      const textHex = expectHexColor(resolved.colors[text]);
      const backgroundHex = expectHexColor(resolved.colors[background]);
      const borderHex = expectHexColor(resolved.palette[border]);

      expect(
        contrastRatio(textHex, backgroundHex),
        `${mode} ${context} text`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(borderHex).toMatch(/^#[0-9a-f]{6}$/i);
    }

    const uiBackground = expectHexColor(
      resolveSemanticColor(semanticThemeSpec[mode].uiColors['bg-neutral']),
    );
    const uiText = expectHexColor(
      resolveSemanticColor(semanticThemeSpec[mode].uiColors['text-primary']),
    );

    expect(contrastRatio(uiText, uiBackground)).toBeGreaterThanOrEqual(4.5);
  });
});

function expectHexColor(value: string): string {
  expect(value).toMatch(/^#/);
  return value.toLowerCase();
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  return [0, 1, 2].map((index) => parseInt(normalized.slice(index * 2, index * 2 + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const scaled = channel / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLum = relativeLuminance(foreground);
  const backgroundLum = relativeLuminance(background);
  const lighter = Math.max(foregroundLum, backgroundLum);
  const darker = Math.min(foregroundLum, backgroundLum);
  return (lighter + 0.05) / (darker + 0.05);
}
