import type { ReactElement } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import type { SummarySnapshot } from './zero-hit-dashboard.parse';
import type { ZeroHitSummaryCard } from './ZeroHitDashboard.types';

/** Builds dashboard cards from the summary snapshot returned by telemetry. */
export function buildCards(summary: SummarySnapshot | undefined | null): ZeroHitSummaryCard[] {
  if (!summary) {
    return [
      { label: 'Total zero-hit queries', value: '—' },
      { label: 'Lessons', value: '—' },
      { label: 'Units', value: '—' },
      { label: 'Programmes', value: '—' },
      { label: 'Latest index version', value: '—' },
    ];
  }

  return [
    { label: 'Total zero-hit queries', value: String(summary.total) },
    { label: 'Lessons', value: String(summary.byScope.lessons) },
    { label: 'Units', value: String(summary.byScope.units) },
    { label: 'Programmes', value: String(summary.byScope.sequences) },
    {
      label: 'Latest index version',
      value: summary.latestIndexVersion ? summary.latestIndexVersion : 'Unknown',
    },
  ];
}

/** Presents telemetry summary cards in an Oak-themed responsive grid. */
export function SummaryGrid({ cards }: { cards: ZeroHitSummaryCard[] }): ReactElement {
  return (
    <OakBox
      $display="grid"
      $gap="space-between-sm"
      $gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
    >
      {cards.map((card) => (
        <OakBox
          key={card.label}
          $ba="border-solid-s"
          $borderColor="border-neutral-lighter"
          $borderRadius="border-radius-s"
          $pa="inner-padding-m"
        >
          <OakTypography as="p" $font="body-4" $color="text-subdued">
            {card.label}
          </OakTypography>
          <OakTypography as="p" $font="heading-6">
            {card.value}
          </OakTypography>
        </OakBox>
      ))}
    </OakBox>
  );
}
