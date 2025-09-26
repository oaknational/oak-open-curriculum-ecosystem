'use client';

import type { JSX } from 'react';
import { OakHeading, OakTypography } from '@oaknational/oak-components';
import { RedocStandalone } from 'redoc';
import { DocsWrapper, HeaderSection, PageContainer } from './DocsPage.styles';

export default function ApiDocsPage(): JSX.Element {
  const specUrl = '/api/openapi.json';

  return (
    <PageContainer as="main" $background="bg-primary" $color="text-primary">
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

      <DocsWrapper>
        <RedocStandalone
          specUrl={specUrl}
          options={{
            hideDownloadButton: false,
            expandResponses: 'all',
            jsonSampleExpandLevel: 'all',
            pathInMiddlePanel: true,
          }}
        />
      </DocsWrapper>
    </PageContainer>
  );
}
