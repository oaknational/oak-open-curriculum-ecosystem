'use client';

import type { JSX } from 'react';
import { OakBox } from '@oaknational/oak-components';
import styledComponents, { keyframes } from 'styled-components';
import { getAppTheme } from '../../themes/app-theme-helpers';

/**
 * Produces a shimmering placeholder block that respects reduced motion preferences.
 */
const shimmer = keyframes`
  0% {
    transform: translateX(-50%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(50%);
  }
`;

const SkeletonSurface = styledComponents(OakBox)`
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright}40,
      transparent
    );
    animation: ${shimmer} 1.6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
      background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
    }
  }
`;

const LINE_HEIGHTS = {
  lg: '1.1rem',
  md: '1rem',
  sm: '0.9rem',
  xs: '0.8rem',
} as const;

const LINE_WIDTHS = {
  xl: '100%',
  lg: '80%',
  md: '65%',
  sm: '55%',
  xs: '45%',
  xxs: '40%',
} as const;

type SkeletonLineHeightToken = keyof typeof LINE_HEIGHTS;
type SkeletonLineWidthToken = keyof typeof LINE_WIDTHS;
interface SkeletonLineProps {
  readonly $height: SkeletonLineHeightToken;
  readonly $width: SkeletonLineWidthToken;
}

const resolveSkeletonLineHeight = ({ $height }: SkeletonLineProps): string => LINE_HEIGHTS[$height];
const resolveSkeletonLineWidth = ({ $width }: SkeletonLineProps): string => LINE_WIDTHS[$width];

const SkeletonLine = styledComponents(SkeletonSurface)<SkeletonLineProps>`
  height: ${resolveSkeletonLineHeight};
  width: ${resolveSkeletonLineWidth};
`;

const SkeletonCard = styledComponents(SkeletonSurface)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
`;

const SkeletonList = styledComponents(OakBox).attrs({
  as: 'ul',
  'data-testid': 'search-results-skeleton',
  'aria-hidden': 'true',
})`
  display: grid;
  row-gap: var(--app-gap-section);
  column-gap: var(--app-gap-grid);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  list-style: none;
  padding: 0;
`;

const SummarySkeletonWrapper = styledComponents(OakBox).attrs({
  'data-testid': 'search-summary-skeleton',
  'aria-hidden': 'true',
})`
  display: grid;
  row-gap: var(--app-gap-inline, var(--app-gap-cluster));
`;

/**
 * Renders placeholder summary lines during a search.
 */
export function SummarySkeleton(): JSX.Element {
  return (
    <SummarySkeletonWrapper>
      <SkeletonLine $height="md" $width="md" />
      <SkeletonLine $height="xs" $width="xxs" />
    </SummarySkeletonWrapper>
  );
}

/**
 * Renders placeholder result cards while awaiting structured or natural search responses.
 */
export function ResultsSkeleton(): JSX.Element {
  return (
    <SkeletonList>
      {Array.from({ length: 3 }, (_, index) => (
        <OakBox as="li" key={`skeleton-${index}`}>
          <SkeletonCard>
            <SkeletonLine $height="lg" $width="lg" />
            <SkeletonLine $height="sm" $width="sm" />
            <SkeletonLine $height="sm" $width="xs" />
          </SkeletonCard>
        </OakBox>
      ))}
    </SkeletonList>
  );
}
