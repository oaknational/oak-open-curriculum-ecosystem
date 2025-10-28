'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import {
  OakBox,
  OakPrimaryButton,
  OakSecondaryButton,
  OakTypography,
} from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import {
  AccentTypography,
  ContentContainer,
  HeroCard,
  PageContainer,
} from '../search/layout/SearchPageClient.styles';
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
    <LandingHeroCard as="section" aria-labelledby="landing-hero-heading">
      <OakTypography as="h1" id="landing-hero-heading" $font="heading-2" $ta="center">
        <AccentTypography as="span" $font="heading-2" $pr="space-between-ssx">
          Search
        </AccentTypography>{' '}
        the Oak curriculum your way
      </OakTypography>
      <OakTypography as="p" $font="body-2" $ta="center">
        Combine deterministic filters with conversational discovery to surface the right lesson in
        moments.
      </OakTypography>
      <OakTypography as="p" $font="body-3" $color="text-subdued" $ta="center">
        Pick a starting point below or jump straight in using the shortcuts.
      </OakTypography>
      <HeroActions>
        <HeroPrimaryButton as={Link} href="/structured_search">
          Start structured search
        </HeroPrimaryButton>
        <HeroSecondaryButton as={Link} href="/natural_language_search">
          Start natural language search
        </HeroSecondaryButton>
      </HeroActions>
    </LandingHeroCard>
  );
}

function LandingCtaCards(): JSX.Element {
  return (
    <CardsSection as="section" aria-label="Search experience options">
      <CtaCardLink href="/structured_search" aria-labelledby="structured-cta-heading">
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
        <CardCta>Explore structured search</CardCta>
      </CtaCardLink>
      <CtaCardLink href="/natural_language_search" aria-labelledby="natural-cta-heading">
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
        <CardCta>Explore natural language search</CardCta>
      </CtaCardLink>
    </CardsSection>
  );
}

const LandingHeroCard = styledComponents(HeroCard)`
  align-items: center;
  text-align: center;
  max-inline-size: min(70ch, 100%);
  margin-inline: auto;
  gap: var(--app-gap-cluster);
`;

const HeroActions = styledComponents(OakBox)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  width: 100%;
`;

const HeroPrimaryButton = styledComponents(OakPrimaryButton)`
  min-width: clamp(14rem, 20vw, 18rem);
  justify-content: center;
`;

const HeroSecondaryButton = styledComponents(OakSecondaryButton)`
  min-width: clamp(14rem, 20vw, 18rem);
  justify-content: center;
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

const cardInteractiveStyles = css`
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.16);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:focus-visible {
      transform: none;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
    }
  }
`;

const CtaCardLink = styledComponents(Link)`
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
  text-decoration: none;
  position: relative;
  ${cardInteractiveStyles}

  &:focus-visible {
    outline: 3px solid ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
    outline-offset: 4px;
  }
`;

const CardCta = styledComponents(OakTypography).attrs({ $font: 'body-2-bold', as: 'span' })`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
`;
