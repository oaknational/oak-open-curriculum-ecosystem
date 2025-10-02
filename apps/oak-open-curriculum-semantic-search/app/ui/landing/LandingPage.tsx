'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import {
  AccentTypography,
  ContentContainer,
  HeroCard,
  PageContainer,
} from '../client/SearchPageClient.styles';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveBreakpoint } from '../shared/breakpoints';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

export function LandingPage(): JSX.Element {
  return (
    <PageContainer
      as="main"
      aria-labelledby="landing-hero-heading"
      $background="bg-primary"
      $color="text-primary"
      data-testid="landing-page"
    >
      <ContentContainer as="div">
        <LandingHero />
        <LandingCtaCards />
      </ContentContainer>
    </PageContainer>
  );
}

function LandingHero(): JSX.Element {
  return (
    <HeroCard as="section" aria-labelledby="landing-hero-heading">
      <OakTypography as="h1" id="landing-hero-heading" $font="heading-3">
        <HeroHeading>
          <AccentTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Hybrid
          </AccentTypography>
          <OakTypography as="span" $font="heading-3">
            search for Oak resources
          </OakTypography>
        </HeroHeading>
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Choose between structured filtering and natural language understanding to start exploring.
      </OakTypography>
      <OakTypography as="p" $font="body-2">
        Use the cards below to decide which search experience matches your workflow before diving
        into live data or deterministic fixtures.
      </OakTypography>
    </HeroCard>
  );
}

function LandingCtaCards(): JSX.Element {
  return (
    <CardsSection as="section" aria-label="Search experience options">
      <CtaCard as="article" aria-labelledby="structured-cta-heading">
        <OakTypography as="h2" id="structured-cta-heading" $font="heading-6">
          Structured search
        </OakTypography>
        <OakTypography as="p" $font="body-3">
          Navigate hybrid search with precise filters for subject, key stage, phase, and result
          limits.
        </OakTypography>
        <OakTypography as="p" $font="body-3">
          Ideal when you know the curriculum boundaries you need to stay within.
        </OakTypography>
        <CtaLink href="/structured_search">Explore structured search</CtaLink>
      </CtaCard>
      <CtaCard as="article" aria-labelledby="natural-cta-heading">
        <OakTypography as="h2" id="natural-cta-heading" $font="heading-6">
          Natural language search
        </OakTypography>
        <OakTypography as="p" $font="body-3">
          Describe what you need in plain language; we map it to structured queries backed by hybrid
          semantic + lexical search.
        </OakTypography>
        <OakTypography as="p" $font="body-3">
          Ideal when you want fast inspiration or to explore new curriculum angles.
        </OakTypography>
        <CtaLink href="/natural_language_search">Explore natural language search</CtaLink>
      </CtaCard>
    </CardsSection>
  );
}

const HeroHeading = styledComponents(OakBox)`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
`;

const CardsSection = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (min-width: ${xl}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    `;
  }}
`;

const CtaCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border: 1px solid ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
  background: linear-gradient(
      135deg,
      ${({ theme }) => resolveUiColor(getAppTheme(theme), 'bg-neutral')} 0%,
      ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised} 100%
    );
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
  }
`;

const CtaLink = styledComponents(OakTypography).attrs({
  as: 'a',
  $font: 'body-2-bold',
})`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => resolveUiColor(getAppTheme(theme), 'text-link-hover')};
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
    outline-offset: 2px;
  }
`;
