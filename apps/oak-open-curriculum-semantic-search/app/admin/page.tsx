'use client';

import { Fragment, type JSX } from 'react';
import { OakBox, OakHeading, OakPrimaryButton, OakTypography } from '@oaknational/oak-components';
import { useStream } from '../lib/useStream';
import { ZeroHitDashboard } from '../ui/admin/ZeroHitDashboard';

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
    <OakBox as="section" $display="flex" $flexDirection="column" $gap="space-between-sm">
      <OakHeading tag="h2" $font="heading-6">
        {heading}
      </OakHeading>
      {children}
    </OakBox>
  );
}

export default function AdminPage(): JSX.Element {
  return (
    <OakBox
      as="main"
      $maxWidth="900px"
      $ma="auto"
      $pa="inner-padding-xl"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-xl"
    >
      <AdminIntro />
      <QuickLinks />

      <AdminSection heading="Elasticsearch setup">
        <StreamOutput url="/api/admin/elastic-setup" method="POST" />
      </AdminSection>

      <AdminSection heading="Index Oak content">
        <StreamOutput url="/api/admin/index-oak" method="GET" />
      </AdminSection>

      <AdminSection heading="Rebuild rollup">
        <StreamOutput url="/api/admin/rebuild-rollup" method="GET" />
      </AdminSection>

      <AdminSection heading="Zero-hit telemetry">
        <ZeroHitDashboard />
      </AdminSection>
    </OakBox>
  );
}

function AdminIntro(): JSX.Element {
  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx">
      <OakHeading tag="h1" $font="heading-4">
        Admin tools
      </OakHeading>
      <OakTypography as="p" $font="body-3" $color="text-subdued">
        Run indexing and rollup tasks. Output streams below each action.
      </OakTypography>
    </OakBox>
  );
}

function QuickLinks(): JSX.Element {
  return (
    <OakBox as="section" $display="flex" $flexDirection="column" $gap="space-between-xs">
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
    </OakBox>
  );
}
