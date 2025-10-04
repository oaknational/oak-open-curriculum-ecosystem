import type { JSX, PropsWithChildren } from 'react';
import { OakBox } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';

import { resolveBreakpoint } from '../../shared/breakpoints';
import { getSpacingVar, type SpacingToken } from './spacing';

export interface ColumnsConfig {
  readonly base?: string;
  readonly md?: string;
  readonly lg?: string;
  readonly xl?: string;
}

interface ResponsiveGridProps {
  readonly columns?: ColumnsConfig;
  readonly gap?: SpacingToken;
  readonly role?: string;
  readonly as?: keyof JSX.IntrinsicElements | typeof OakBox;
  readonly className?: string;
}

const GridRoot = styledComponents(OakBox)<{ $columns?: ColumnsConfig; $gap: SpacingToken }>`
  display: grid;
  gap: ${({ $gap }) => getSpacingVar($gap)};
  grid-template-columns: ${({ $columns }: { $columns?: ColumnsConfig }) => $columns?.base ?? 'minmax(0, 1fr)'};

  ${({ theme, $columns }) =>
    $columns?.md
      ? css`
          @media (min-width: ${resolveBreakpoint(theme, 'md')}) {
            grid-template-columns: ${$columns.md};
          }
        `
      : undefined}

  ${({ theme, $columns }) =>
    $columns?.lg
      ? css`
          @media (min-width: ${resolveBreakpoint(theme, 'lg')}) {
            grid-template-columns: ${$columns.lg};
          }
        `
      : undefined}

  ${({ theme, $columns }) =>
    $columns?.xl
      ? css`
          @media (min-width: ${resolveBreakpoint(theme, 'xl')}) {
            grid-template-columns: ${$columns.xl};
          }
        `
      : undefined}
`;

export function ResponsiveGrid({
  columns,
  gap = 'section',
  children,
  ...rest
}: PropsWithChildren<ResponsiveGridProps>): JSX.Element {
  return (
    <GridRoot $columns={columns} $gap={gap} {...rest}>
      {children}
    </GridRoot>
  );
}
