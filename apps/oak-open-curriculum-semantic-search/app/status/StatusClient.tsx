'use client';

import type { JSX } from 'react';
import { OakBox, OakHeading, OakTypography, OakLink } from '@oaknational/oak-components';
import type { HealthPayload, StatusCardConfig } from './types';
import { buildStatusCards, resolveToneColor } from './status-helpers';

export function StatusClient({ payload }: { payload: HealthPayload }): JSX.Element {
  const cards = buildStatusCards(payload.status, payload.details);
  const updatedAt = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <OakBox
      as="main"
      data-testid="status-page"
      $display="flex"
      $flexDirection="column"
      $gap="var(--app-gap-section)"
      $background="bg-primary"
      $color="text-primary"
      $pa="inner-padding-xl"
    >
      <StatusHero updatedAt={updatedAt} />
      <StatusCardsPanel cards={cards} />
      <DiagnosticsSection />
    </OakBox>
  );
}

function StatusHero({ updatedAt }: { updatedAt: string }): JSX.Element {
  return (
    <OakBox as="section" $display="flex" $flexDirection="column" $gap="space-between-s">
      <OakHeading tag="h1" $font="heading-4">
        Platform status
      </OakHeading>
      <OakTypography as="p" $font="body-3" $color="text-subdued">
        Live snapshot of critical services powering semantic search.
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued" aria-live="polite">
        Last updated {updatedAt}
      </OakTypography>
    </OakBox>
  );
}

function StatusCardsPanel({ cards }: { cards: StatusCardConfig[] }): JSX.Element {
  return (
    <OakBox
      role="status"
      aria-live="polite"
      $display="grid"
      $gap="space-between-l"
      $gridTemplateColumns="repeat(auto-fit, minmax(280px, 1fr))"
    >
      {cards.map((card) => (
        <OakBox
          key={card.title}
          $display="flex"
          $flexDirection="column"
          $gap="space-between-ssx"
          $ba="border-solid-s"
          $borderColor="border-neutral-lighter"
          $pa="inner-padding-l"
          $background="bg-elevated"
          $borderRadius="border-radius-m"
        >
          <OakHeading tag="h2" $font="heading-6">
            {card.title}
          </OakHeading>
          <OakTypography as="p" $font="body-2-bold" $color={resolveToneColor(card.tone)}>
            {card.summary}
          </OakTypography>
          {card.description ? (
            <OakTypography as="p" $font="body-4" $color="text-subdued">
              {card.description}
            </OakTypography>
          ) : null}
        </OakBox>
      ))}
    </OakBox>
  );
}

function DiagnosticsSection(): JSX.Element {
  return (
    <OakBox $display="flex" $flexDirection="column" $gap="space-between-ssx">
      <OakHeading tag="h2" $font="heading-6">
        Diagnostics
      </OakHeading>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        For raw JSON, visit <OakLink href="/healthz">/healthz</OakLink>.
        <br />
        Responses use HTTP status codes to reflect service availability.
      </OakTypography>
    </OakBox>
  );
}
