import { describe, expect, it } from 'vitest';
import { oakColorTokens, oakUiRoleTokens } from '@oaknational/oak-components';
import { createLightTheme } from './light';
import { createDarkTheme } from './dark';
import { semanticThemeSpec } from './semantic-theme-spec';
import { resolveAppTokens } from './semantic-theme-resolver';

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

    expect(resolved.space.gap.section).toBe('3.5rem');
    expect(resolved.space.gap.cluster).toBe('1rem');
    expect(resolved.space.padding.card).toBe('1.25rem');
    expect(resolved.space.padding.pill).toBe('0.5rem');
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

  it('exposes custom palette entries for brand colours', () => {
    const lightPalette = resolveAppTokens('light').palette;
    const darkPalette = resolveAppTokens('dark').palette;

    expect(lightPalette.brandPrimary).toBe(oakColorTokens.oakGreen);
    expect(darkPalette.brandPrimary).toBe(oakColorTokens.oakGreen);
    expect(lightPalette.brandPrimaryDark).toBe('#0f381b');
    expect(darkPalette.brandPrimaryDark).toBe('#82d88a');
  });

  it('provides surface colour entries for cards and panels', () => {
    const lightColors = resolveAppTokens('light').colors as Record<string, string>;
    const darkColors = resolveAppTokens('dark').colors as Record<string, string>;

    expect(lightColors.surfaceCard).toBe(oakColorTokens.white);
    expect(lightColors.surfaceRaised).toBe(oakColorTokens.grey20);
    expect(darkColors.surfaceCard).toBe(oakColorTokens.navy110);
    expect(darkColors.surfaceRaised).toBe(oakColorTokens.navy);
  });

  it('exposes extended brand palette shades', () => {
    const lightPalette = resolveAppTokens('light').palette as Record<string, string>;
    const darkPalette = resolveAppTokens('dark').palette as Record<string, string>;

    expect(lightPalette.brandPrimaryDeep).toBe('#144d24');
    expect(lightPalette.brandPrimaryBright).toBe('#35a04c');
    expect(darkPalette.brandPrimaryDeep).toBe('#0b2a16');
    expect(darkPalette.brandPrimaryBright).toBe('#6ed680');
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
