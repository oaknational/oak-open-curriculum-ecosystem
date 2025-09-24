'use client';

import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { OakBox, OakHeading, OakSecondaryButton, OakTypography } from '@oaknational/oak-components';
import { SummaryGrid, buildCards } from './ZeroHitDashboard.cards';
import { RecentEventsList } from './ZeroHitDashboard.events';
import type { TelemetryState } from './ZeroHitDashboard.types';
import { useZeroHitTelemetry } from './use-zero-hit-telemetry';

/**
 * Oak-themed dashboard presenting zero-hit telemetry summaries and recent events
 * for operators monitoring search quality.
 */
export function ZeroHitDashboard(): ReactElement {
  const { data, loading, error, refresh } = useZeroHitTelemetry();
  const cards = useMemo(() => buildCards(data?.summary), [data?.summary]);

  return (
    <OakBox
      as="section"
      aria-labelledby="zero-hit-heading"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-sm"
    >
      <DashboardHeader loading={loading} onRefresh={refresh} />
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Track queries with zero results, grouped by scope. Data refreshes every 30 seconds.
      </OakTypography>
      <SummaryGrid cards={cards} />
      {error ? (
        <OakTypography role="alert" as="p" $color="text-error" $font="body-4">
          {error}
        </OakTypography>
      ) : null}
      <RecentEventsList events={data?.recent ?? []} hasError={Boolean(error)} />
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
        element="button"
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
