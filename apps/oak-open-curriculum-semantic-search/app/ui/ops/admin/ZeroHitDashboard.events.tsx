import type { ReactElement } from 'react';
import { OakBox, OakHeading, OakTypography, OakUL } from '@oaknational/oak-components';
import type { DashboardEvent } from './zero-hit-dashboard.parse';

/** Renders the dashboard list of recent zero-hit events, including empty states. */
export function RecentEventsList({
  events,
  hasError,
}: {
  events: DashboardEvent[];
  hasError: boolean;
}): ReactElement {
  if (events.length === 0 && !hasError) {
    return (
      <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx">
        <OakHeading tag="h3" $font="heading-7">
          Recent events
        </OakHeading>
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          No zero-hit events recorded yet.
        </OakTypography>
      </OakBox>
    );
  }

  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx">
      <OakHeading tag="h3" $font="heading-7">
        Recent events
      </OakHeading>
      {events.length > 0 ? (
        <OakUL $reset $display="flex" $flexDirection="column" $gap="spacing-4">
          {events.map((event) => (
            <RecentEventItem key={`${event.timestamp}-${event.text}`} event={event} />
          ))}
        </OakUL>
      ) : null}
    </OakBox>
  );
}

function RecentEventItem({ event }: { event: DashboardEvent }): ReactElement {
  const hasFilters = Object.keys(event.filters).length > 0;

  return (
    <OakBox
      as="li"
      $ba="border-solid-s"
      $borderColor="border-neutral-lighter"
      $borderRadius="border-radius-s"
      $pa="inner-padding-m"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-ssx"
    >
      <OakTypography as="p" $font="body-4-bold">
        {formatTimestamp(event.timestamp)} · {formatScope(event.scope)}
      </OakTypography>
      <OakTypography as="p" $font="body-4">
        {event.text}
      </OakTypography>
      <OakTypography as="p" $font="body-5" $color="text-subdued">
        Index version: {event.indexVersion}
      </OakTypography>
      {hasFilters ? (
        <OakTypography as="p" $font="body-5" $color="text-subdued">
          Filters: {formatFilters(event.filters)}
        </OakTypography>
      ) : null}
    </OakBox>
  );
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function formatScope(scope: DashboardEvent['scope']): string {
  if (scope === 'lessons') {
    return 'Lesson scope';
  }
  if (scope === 'units') {
    return 'Unit scope';
  }
  return 'Programme scope';
}

function formatFilters(filters: Record<string, string>): string {
  return Object.entries(filters)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}
