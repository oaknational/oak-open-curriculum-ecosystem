'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import { OakHeading, OakTypography } from '@oaknational/oak-components';
import { RedocStandalone } from 'redoc';
import { DocsWrapper, HeaderSection, PageContainer, resolveDocsSurfaces } from './DocsPage.styles';
import { useTheme } from 'styled-components';
import { getAppTheme } from '../../ui/themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

export default function ApiDocsPage(): JSX.Element {
  const specUrl = '/api/openapi.json';
  const theme = useTheme();
  const appTheme = getAppTheme(theme);
  const redocTheme = useRedocTheme(appTheme);
  const redocOptions = useMemo(() => buildRedocOptions(redocTheme), [redocTheme]);

  return (
    <PageContainer
      as="main"
      data-testid="api-docs-page"
      $background="bg-neutral"
      $color="text-primary"
    >
      <DocsHeader specUrl={specUrl} />

      <DocsWrapper>
        <RedocStandalone specUrl={specUrl} options={redocOptions} />
      </DocsWrapper>
    </PageContainer>
  );
}

function DocsHeader({ specUrl }: { specUrl: string }): JSX.Element {
  return (
    <HeaderSection as="header">
      <OakHeading tag="h1" $font="heading-4">
        Oak Curriculum Search API <em>Alpha</em>
      </OakHeading>
      <OakTypography as="p" $font="body-3">
        OpenAPI schema:{' '}
        <a href={specUrl} target="_blank" rel="noreferrer">
          {specUrl}
        </a>
      </OakTypography>
    </HeaderSection>
  );
}

function useRedocTheme(appTheme: ReturnType<typeof getAppTheme>) {
  return useMemo(() => createRedocThemeConfig(appTheme), [appTheme]);
}

function buildRedocOptions(theme: ReturnType<typeof useRedocTheme>) {
  return {
    hideDownloadButton: false,
    expandResponses: 'all' as const,
    jsonSampleExpandLevel: 'all' as const,
    pathInMiddlePanel: true,
    theme,
  };
}

function createRedocThemeConfig(appTheme: ReturnType<typeof getAppTheme>) {
  const surfaces = resolveDocsSurfaces(appTheme);
  const palette = createRedocColorPalette(appTheme);
  const typography = createRedocTypography(appTheme, surfaces);
  const textPrimary = palette.text.primary;
  const background = {
    main: surfaces.surface,
    secondary: surfaces.surfaceAlt,
  };

  return {
    colors: { ...palette, background },
    typography,
    sidebar: {
      backgroundColor: surfaces.surfaceAlt,
      textColor: textPrimary,
      activeTextColor: appTheme.app.palette.brandPrimaryDeep,
    },
    rightPanel: {
      backgroundColor: surfaces.surfaceAlt,
      textColor: textPrimary,
    },
    codeBlock: {
      backgroundColor: surfaces.surfaceAlt,
    },
    schema: {
      linesColor: surfaces.border,
      defaultDetailsWidth: '33%',
      labelsTextColor: palette.text.secondary,
      typeNameColor: textPrimary,
      typeTitleColor: textPrimary,
      requireLabelColor: appTheme.app.colors.errorText,
      nestingSpacing: '1.25rem',
      nestedBackground: surfaces.surfaceAlt,
      arrow: {
        size: '0.75rem',
        color: textPrimary,
      },
    },
  };
}

function createRedocColorPalette(appTheme: ReturnType<typeof getAppTheme>) {
  const textPrimary = resolveUiColor(appTheme, 'text-primary');
  const textSecondary = resolveUiColor(appTheme, 'text-subdued');

  return {
    tonalOffset: 0,
    primary: createPrimaryPalette(appTheme),
    border: createBorderPalette(appTheme),
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    http: createHttpPalette(appTheme),
    responses: createResponsePalette(appTheme, textPrimary),
  };
}

function createPrimaryPalette(appTheme: ReturnType<typeof getAppTheme>) {
  const surfaceCard = appTheme.app.colors.surfaceCard;
  return {
    main: appTheme.app.palette.brandPrimary,
    dark: appTheme.app.palette.brandPrimaryDeep,
    light: appTheme.app.palette.brandPrimaryBright,
    contrastText: surfaceCard,
  };
}

function createBorderPalette(appTheme: ReturnType<typeof getAppTheme>) {
  return {
    light: appTheme.app.colors.borderSubtle,
    dark: appTheme.app.colors.borderAccent,
  };
}

function createHttpPalette(appTheme: ReturnType<typeof getAppTheme>) {
  const primaryDark = appTheme.app.palette.brandPrimaryDark;
  const primaryDeep = appTheme.app.palette.brandPrimaryDeep;
  const primaryBright = appTheme.app.palette.brandPrimaryBright;

  return {
    get: primaryBright,
    post: primaryDeep,
    delete: appTheme.app.colors.errorText,
    put: primaryDark,
    options: primaryDark,
    patch: primaryDark,
    link: primaryDark,
    head: primaryDark,
    basic: primaryDark,
  };
}

function createResponsePalette(appTheme: ReturnType<typeof getAppTheme>, textPrimary: string) {
  const surfaceCard = appTheme.app.colors.surfaceCard;
  const primaryDark = appTheme.app.palette.brandPrimaryDark;
  const primaryDeep = appTheme.app.palette.brandPrimaryDeep;

  return {
    success: {
      color: primaryDeep,
      backgroundColor: surfaceCard,
      tabTextColor: textPrimary,
    },
    error: {
      color: appTheme.app.colors.errorText,
      backgroundColor: surfaceCard,
      tabTextColor: textPrimary,
    },
    redirect: {
      color: primaryDark,
      backgroundColor: surfaceCard,
      tabTextColor: textPrimary,
    },
    info: {
      color: primaryDark,
      backgroundColor: surfaceCard,
      tabTextColor: textPrimary,
    },
  };
}

function createRedocTypography(
  appTheme: ReturnType<typeof getAppTheme>,
  surfaces: ReturnType<typeof resolveDocsSurfaces>,
) {
  const textPrimary = resolveUiColor(appTheme, 'text-primary');
  const linkColor = resolveUiColor(appTheme, 'text-link-active');
  const linkHover = resolveUiColor(appTheme, 'text-link-hover');
  return {
    fontFamily: appTheme.app.typography.body.fontFamily,
    headings: {
      fontFamily: appTheme.app.typography.heading.fontFamily,
      fontWeight: String(appTheme.app.typography.heading.fontWeight),
    },
    code: {
      fontFamily: '"Source Code Pro", monospace',
      fontSize: '0.95rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: textPrimary,
      backgroundColor: surfaces.surfaceAlt,
      wrap: true,
    },
    links: {
      color: linkColor,
      visited: linkColor,
      hover: linkHover,
      textDecoration: 'underline',
      hoverTextDecoration: 'underline',
    },
  };
}
