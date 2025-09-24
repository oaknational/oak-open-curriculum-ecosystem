'use client';

import type { JSX } from 'react';
import { OakBox, OakHeading, OakTypography } from '@oaknational/oak-components';
import { RedocStandalone } from 'redoc';

export default function ApiDocsPage(): JSX.Element {
  const specUrl = '/api/openapi.json';

  return (
    <OakBox
      as="main"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-md"
      $pa="inner-padding-xl"
      $maxWidth="1000px"
      $ma="auto"
    >
      <OakBox as="header" $display="flex" $flexDirection="column" $gap="space-between-ssx">
        <OakHeading tag="h1" $font="heading-4">
          Oak Curriculum Search API
        </OakHeading>
        <OakTypography as="p" $font="body-3">
          OpenAPI schema:{' '}
          <a href={specUrl} target="_blank" rel="noreferrer">
            {specUrl}
          </a>
        </OakTypography>
      </OakBox>

      <OakBox
        $ba="border-solid-s"
        $borderColor="border-neutral-lighter"
        $borderRadius="border-radius-s"
        $overflow="hidden"
      >
        <RedocStandalone
          specUrl={specUrl}
          options={{
            hideDownloadButton: false,
            expandResponses: 'all',
            jsonSampleExpandLevel: 'all',
            pathInMiddlePanel: true,
          }}
        />
      </OakBox>
    </OakBox>
  );
}
