'use client';

import type { JSX } from 'react';
import { OakBox, OakHeading, OakTypography, OakLink } from '@oaknational/oak-components';
import type { HealthPayload, StatusCardConfig } from './types';
import { buildStatusCards, resolveToneColor } from './status-helpers';
import { OperationsLayout, OperationsSection } from '../ui/ops';

export function StatusClient({ payload }: { payload: HealthPayload }): JSX.Element {
  const cards = buildStatusCards(payload.status, payload.details);
  const updatedAt = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const fatalMessage = payload.details.fatal ?? null;

  return (
    <OperationsLayout testId="status-page">
      <StatusHero updatedAt={updatedAt} />
      {fatalMessage ? <StatusAlert message={fatalMessage} /> : null}
      <StatusCardsPanel cards={cards} />
      <DiagnosticsSection />
    </OperationsLayout>
  );
}

function StatusHero({ updatedAt }: { updatedAt: string }): JSX.Element {
  return (
    <OperationsSection as="section">
      <OakHeading tag="h1" $font="heading-4">
        Platform status
      </OakHeading>
      <OakTypography as="p" $font="body-3" $color="text-subdued">
        Live snapshot of critical services powering semantic search.
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued" aria-live="polite">
        Last updated {updatedAt}
      </OakTypography>
    </OperationsSection>
  );
}

function StatusCardsPanel({ cards }: { cards: StatusCardConfig[] }): JSX.Element {
  return (
    <OperationsSection as="section">
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
    </OperationsSection>
  );
}

function DiagnosticsSection(): JSX.Element {
  return (
    <OperationsSection as="section">
      <OakHeading tag="h2" $font="heading-6">
        Diagnostics
      </OakHeading>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        For raw JSON, visit <OakLink href="/healthz">/healthz</OakLink>.
        <br />
        Responses use HTTP status codes to reflect service availability.
      </OakTypography>
    </OperationsSection>
  );
}

function StatusAlert({ message }: { message: string }): JSX.Element {
  return (
    <OperationsSection as="section">
      <OakBox
        role="alert"
        aria-live="assertive"
        $display="flex"
        $flexDirection="column"
        $gap="space-between-xs"
        $background="bg-neutral"
        $pa="inner-padding-l"
        $borderRadius="border-radius-m"
        $ba="border-solid-s"
        $borderColor="border-neutral-lighter"
      >
        <OakHeading tag="h2" $font="heading-6">
          Platform outage detected
        </OakHeading>
        <OakTypography as="p" $font="body-3" $color="text-error">
          {message}
        </OakTypography>
        <OakTypography as="p" $font="body-4" $color="text-subdued">
          Engineers have been notified. Track remediation updates in the observability dashboards.
        </OakTypography>
      </OakBox>
    </OperationsSection>
  );
}
