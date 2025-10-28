'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { OakBox, OakHeading, OakSecondaryButton, OakTypography } from '@oaknational/oak-components';
import { SummaryGrid, buildCards } from './ZeroHitDashboard.cards';
import { RecentEventsList } from './ZeroHitDashboard.events';
import type { TelemetryState } from './ZeroHitDashboard.types';
import { useZeroHitTelemetry } from './use-zero-hit-telemetry';
import { resolveFixtureMode } from '../../../lib/fixture-mode';
import type { FixtureMode } from '../../../lib/fixture-mode';

const ZERO_HIT_STATUS_HEADING_ID = 'zero-hit-telemetry-status-heading';

/**
 * Oak-themed dashboard presenting zero-hit telemetry summaries and recent events
 * for operators monitoring search quality.
 */
export function ZeroHitDashboard(): ReactElement {
  const viewModel = useTelemetryViewModel();

  return (
    <OakBox
      as="section"
      aria-labelledby="zero-hit-heading"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-sm"
    >
      <StatusNotice
        statusMessage={viewModel.statusMessage}
        fixtureMessage={viewModel.fixtureMessage}
        loading={viewModel.loading}
      />
      <DashboardHeader loading={viewModel.loading} onRefresh={viewModel.refresh} />
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Track queries with zero results, grouped by scope. Data refreshes every 30 seconds.
      </OakTypography>
      <SummaryGrid cards={viewModel.cards} />
      {viewModel.errorMessage ? (
        <OakBox role="alert" aria-live="assertive">
          <OakTypography as="p" $color="text-error" $font="body-4">
            {viewModel.errorMessage}
          </OakTypography>
        </OakBox>
      ) : null}
      <RecentEventsList events={viewModel.recent} hasError={Boolean(viewModel.errorMessage)} />
    </OakBox>
  );
}

interface DashboardHeaderProps {
  readonly loading: boolean;
  readonly onRefresh: TelemetryState['refresh'];
}

/** Renders the dashboard heading and manual refresh control. */
function DashboardHeader({ loading, onRefresh }: DashboardHeaderProps): ReactElement {
  return (
    <OakBox $display="flex" $justifyContent="space-between" $alignItems="center">
      <OakHeading tag="h2" id="zero-hit-heading" $font="heading-6">
        Zero-hit telemetry
      </OakHeading>
      <OakSecondaryButton
        type="button"
        disabled={loading}
        onClick={() => {
          void onRefresh();
        }}
      >
        {loading ? 'Refreshing…' : 'Refresh'}
      </OakSecondaryButton>
    </OakBox>
  );
}

export default ZeroHitDashboard;

type ZeroHitRecentEvents = NonNullable<TelemetryState['data']>['recent'];

function useTelemetryViewModel(): {
  cards: ReturnType<typeof buildCards>;
  loading: boolean;
  errorMessage: string | null;
  statusMessage: string;
  fixtureMessage: string | null;
  recent: ZeroHitRecentEvents;
  refresh: TelemetryState['refresh'];
} {
  const { data, loading, error, refresh } = useZeroHitTelemetry();
  const [fixtureMode, setFixtureMode] = useState<FixtureMode>('live');

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const cookieValue = readCookie('semantic-search-fixtures');
    const resolved = resolveFixtureMode({
      cookieValue,
      queryValue: null,
      envValue: undefined,
    }).mode;
    setFixtureMode(resolved);
  }, []);

  const cards = useMemo(() => buildCards(data?.summary), [data?.summary]);
  const statusMessage = buildStatusMessage({
    latestVersion: data?.summary.latestIndexVersion ?? null,
  });
  const fixtureMessage = buildFixtureMessage(fixtureMode);
  const errorMessage = error ? buildErrorMessage(error) : null;
  const recent: ZeroHitRecentEvents = data?.recent ?? [];

  return {
    cards,
    loading,
    errorMessage,
    statusMessage,
    fixtureMessage,
    recent,
    refresh,
  };
}

function StatusNotice({
  statusMessage,
  fixtureMessage,
  loading,
}: {
  statusMessage: string;
  fixtureMessage: string | null;
  loading: boolean;
}): ReactElement {
  return (
    <OakBox
      role="status"
      aria-live="polite"
      $background="bg-neutral"
      $pa="inner-padding-m"
      $borderRadius="border-radius-s"
      $ba="border-solid-s"
      $borderColor="border-neutral-lighter"
      data-testid="zero-hit-telemetry-status"
    >
      <OakHeading as="h2" id={ZERO_HIT_STATUS_HEADING_ID} $font="heading-7" $color="text-subdued">
        Zero-hit telemetry status
      </OakHeading>
      <OakTypography as="p" $font="body-4">
        {loading ? 'Refreshing telemetry…' : statusMessage}
      </OakTypography>
      {fixtureMessage ? (
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          {fixtureMessage}
        </OakTypography>
      ) : null}
    </OakBox>
  );
}

function buildStatusMessage({ latestVersion }: { latestVersion: string | null }): string {
  const version = latestVersion?.trim().length ? latestVersion : 'Unknown';
  return `Zero-hit telemetry updated. Latest index version: ${version}.`;
}

function buildFixtureMessage(mode: FixtureMode): string | null {
  if (mode === 'fixtures' || mode === 'fixtures-empty' || mode === 'fixtures-error') {
    return 'Deterministic fixtures active – telemetry is sourced from SDK fixtures.';
  }
  return null;
}

function buildErrorMessage(raw: string): string {
  return `Zero-hit telemetry is temporarily unavailable. ${raw}`;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const prefix = `${name}=`;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }
  return null;
}
