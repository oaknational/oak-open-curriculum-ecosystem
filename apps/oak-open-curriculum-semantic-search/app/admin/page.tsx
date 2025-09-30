'use client';

import { Fragment, type JSX, useEffect } from 'react';
import { OakBox, OakHeading, OakPrimaryButton, OakTypography } from '@oaknational/oak-components';
import { useStream } from '../lib/useStream';
import { ZeroHitDashboard } from '../ui/admin/ZeroHitDashboard';
import {
  ActionSection,
  ActionsGrid,
  IntroSection,
  PageContainer,
  QuickLinksSection,
  TelemetrySection,
} from './AdminPage.styles';

function StreamOutput({ url, method }: { url: string; method?: 'GET' | 'POST' }): JSX.Element {
  const { state, text, run } = useStream(url, method ?? 'POST');

  const lines = (text ?? '').split('\n');

  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-xs">
      <OakPrimaryButton
        element="button"
        type="button"
        disabled={state === 'running'}
        onClick={() => {
          void run();
        }}
      >
        {state === 'running' ? 'Running…' : 'Run'}
      </OakPrimaryButton>

      <OakBox
        role="status"
        aria-live="polite"
        $background="bg-neutral"
        $pa="inner-padding-m"
        $borderRadius="border-radius-s"
        $ba="border-solid-s"
        $borderColor="border-neutral-lighter"
      >
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          {text ? (
            lines.map((line, index) => (
              <Fragment key={`${url}-line-${index}`}>
                {line.length > 0 ? line : null}
                {index < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))
          ) : (
            <>—</>
          )}
        </OakTypography>
      </OakBox>
    </OakBox>
  );
}

function AdminSection({
  heading,
  children,
}: {
  heading: string;
  children: JSX.Element;
}): JSX.Element {
  return (
    <ActionSection as="section">
      <OakHeading tag="h2" $font="heading-6">
        {heading}
      </OakHeading>
      {children}
    </ActionSection>
  );
}

export default function AdminPage(): JSX.Element {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', `${pathname}${search}`);
    }
  }, []);

  return (
    <PageContainer
      as="main"
      data-testid="admin-page"
      $background="bg-primary"
      $color="text-primary"
    >
      <AdminIntro />
      <QuickLinks />

      <ActionsGrid data-testid="admin-actions-grid">
        <AdminSection heading="Elasticsearch setup">
          <StreamOutput url="/api/admin/elastic-setup" method="POST" />
        </AdminSection>

        <AdminSection heading="Index Oak content">
          <StreamOutput url="/api/admin/index-oak" method="GET" />
        </AdminSection>

        <AdminSection heading="Rebuild rollup">
          <StreamOutput url="/api/admin/rebuild-rollup" method="GET" />
        </AdminSection>

        <TelemetrySection as="section">
          <OakHeading tag="h2" $font="heading-6">
            Zero-hit telemetry
          </OakHeading>
          <ZeroHitDashboard />
        </TelemetrySection>
      </ActionsGrid>
    </PageContainer>
  );
}

function AdminIntro(): JSX.Element {
  return (
    <IntroSection as="section">
      <OakHeading tag="h1" $font="heading-4">
        Admin tools
      </OakHeading>
      <OakTypography as="p" $font="body-3" $color="text-subdued">
        Run indexing and rollup tasks. Output streams below each action.
      </OakTypography>
    </IntroSection>
  );
}

function QuickLinks(): JSX.Element {
  return (
    <QuickLinksSection as="section">
      <OakHeading tag="h2" $font="heading-6">
        Quick links
      </OakHeading>
      <OakTypography as="p" $font="body-3">
        1) <code>/api/admin/index-oak</code> → 2) <code>/api/admin/rebuild-rollup</code> → 3){' '}
        <code>/api/search</code>
      </OakTypography>
      <OakTypography as="p" $font="body-3">
        SDK parity tests: POST <code>/api/sdk/search-lessons</code>, POST{' '}
        <code>/api/sdk/search-transcripts</code>
      </OakTypography>
    </QuickLinksSection>
  );
}
