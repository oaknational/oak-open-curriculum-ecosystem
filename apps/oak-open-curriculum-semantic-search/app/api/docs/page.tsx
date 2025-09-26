'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import { OakHeading, OakTypography } from '@oaknational/oak-components';
import { RedocStandalone } from 'redoc';
import { DocsWrapper, HeaderSection, PageContainer } from './DocsPage.styles';
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
    <PageContainer as="main" $background="bg-primary" $color="text-primary">
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
        Oak Curriculum Search API
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
  const palette = createRedocColorPalette(appTheme);
  const typography = createRedocTypography(appTheme);
  const surfaceRaised = appTheme.app.colors.surfaceRaised;
  const textPrimary = palette.text.primary;
  const background = {
    main: appTheme.app.colors.surfaceCard,
    secondary: surfaceRaised,
  };

  return {
    colors: { ...palette, background },
    typography,
    sidebar: {
      backgroundColor: surfaceRaised,
      textColor: textPrimary,
      activeTextColor: appTheme.app.palette.brandPrimaryDeep,
    },
    rightPanel: {
      backgroundColor: surfaceRaised,
      textColor: textPrimary,
    },
    codeBlock: {
      backgroundColor: surfaceRaised,
      textColor: textPrimary,
    },
    schema: {
      linesColor: appTheme.app.colors.borderSubtle,
      defaultDetailsWidth: '33%',
      labelsTextColor: textPrimary,
    },
  };
}

function createRedocColorPalette(appTheme: ReturnType<typeof getAppTheme>) {
  const textPrimary = resolveUiColor(appTheme, 'text-primary');
  const textSecondary = resolveUiColor(appTheme, 'text-subdued');
  return {
    primary: {
      main: appTheme.app.palette.brandPrimaryDeep,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    http: {
      get: appTheme.app.palette.brandPrimaryBright,
      post: appTheme.app.palette.brandPrimaryDeep,
      delete: appTheme.app.colors.errorText,
      put: appTheme.app.palette.brandPrimaryDeep,
      options: appTheme.app.palette.brandPrimaryDeep,
    },
  };
}

function createRedocTypography(appTheme: ReturnType<typeof getAppTheme>) {
  return {
    fontFamily: appTheme.app.typography.body.fontFamily,
    headings: {
      fontFamily: appTheme.app.typography.heading.fontFamily,
      fontWeight: String(appTheme.app.typography.heading.fontWeight),
    },
    code: {
      fontFamily: '"Source Code Pro", monospace',
    },
  };
}
