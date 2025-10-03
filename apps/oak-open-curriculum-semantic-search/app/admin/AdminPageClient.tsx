'use client';

import { Fragment, type JSX, useEffect } from 'react';
import { OakBox, OakHeading, OakPrimaryButton, OakTypography } from '@oaknational/oak-components';
import type { FixtureMode } from '../lib/fixture-mode';
import { useStream, type StreamOutcome } from '../lib/useStream';
import { ZeroHitDashboard } from '../ui/admin/ZeroHitDashboard';
import {
  ActionSection,
  ActionsGrid,
  IntroSection,
  QuickLinksSection,
  TelemetrySection,
} from './AdminPage.styles';
import { OperationsLayout } from '../ui/operations/OperationsLayout';
import { SearchFixtureNotice } from '../ui/client/SearchFixtureNotice';

interface AdminPageClientProps {
  readonly initialFixtureMode: FixtureMode;
  readonly showFixtureToggle: boolean;
}

const ADMIN_FIXTURE_NOTICES: Record<FixtureMode, string | null> = {
  fixtures: 'Running deterministic admin fixtures. Switch to live data to perform real operations.',
  'fixtures-empty':
    'Viewing empty admin fixtures so you can validate messaging without touching live infrastructure.',
  'fixtures-error':
    'Simulating admin errors. Switch to live data once you have verified the outage flows.',
  live: null,
};

export function AdminPageClient({
  initialFixtureMode,
  showFixtureToggle,
}: AdminPageClientProps): JSX.Element {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window.location.hash) {
      const { pathname, search } = window.location;
      window.history.replaceState(null, '', `${pathname}${search}`);
    }
  }, []);

  const shouldShowNotice = showFixtureToggle || Boolean(ADMIN_FIXTURE_NOTICES[initialFixtureMode]);

  const fixtureNotice = shouldShowNotice ? (
    <SearchFixtureNotice
      initialFixtureMode={initialFixtureMode}
      visible={showFixtureToggle}
      label="Admin data"
      messages={ADMIN_FIXTURE_NOTICES}
    />
  ) : null;

  return (
    <OperationsLayout fixtureNotice={fixtureNotice} testId="admin-page">
      <AdminIntro />
      <QuickLinks />

      <AdminActions />
    </OperationsLayout>
  );
}

function AdminActions(): JSX.Element {
  return (
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
  );
}

function StreamOutput({ url, method }: { url: string; method?: 'GET' | 'POST' }): JSX.Element {
  const { state, text, run, outcome } = useStream(url, method ?? 'POST');

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

      <StreamSummary outcome={outcome} />
      <StreamOutputBody text={text} source={url} />
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

function StreamSummary({ outcome }: { outcome: StreamOutcome | null }): JSX.Element | null {
  if (!outcome) {
    return null;
  }
  const tone = outcome.status;
  const color = tone === 'success' ? 'text-success' : 'text-error';
  return (
    <OakTypography as="p" $font="body-4" $color={color} aria-live="polite">
      {formatOutcomeLabel(outcome)}
    </OakTypography>
  );
}

function StreamOutputBody({ text, source }: { text: string; source: string }): JSX.Element {
  const lines = text ? text.split('\n') : [];
  return (
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
        {lines.length > 0
          ? lines.map((line, index) => (
              <Fragment key={`${source}-line-${index}`}>
                {line.length > 0 ? line : null}
                {index < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))
          : '—'}
      </OakTypography>
    </OakBox>
  );
}

function formatOutcomeLabel(outcome: StreamOutcome | null): string {
  if (!outcome) {
    return '';
  }
  const formatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const timestamp = formatter.format(outcome.finishedAt);
  const prefix = outcome.status === 'success' ? 'Completed' : 'Failed';
  if (outcome.message && outcome.message.length > 0) {
    return `${prefix} at ${timestamp} – ${outcome.message}`;
  }
  return `${prefix} at ${timestamp}`;
}
