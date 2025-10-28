import { OakBox } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';

import { resolveBreakpoint } from '../../shared/breakpoints';
import { getSpacingVar } from './spacing';

export type PageVariant = 'default' | 'ops' | 'landing';

export const PageContainer = styledComponents(OakBox)<{ $variant?: PageVariant }>`
  width: min(100%, var(--app-layout-container-max-width));
  max-width: min(100%, var(--app-layout-container-max-width));
  margin-inline: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${getSpacingVar('section')};
  padding-inline: clamp(
    ${getSpacingVar('inline-base')},
    4vw,
    ${getSpacingVar('inline-wide')}
  );
  padding-block: ${getSpacingVar('stack')};

  ${({ theme }) => css`
    @media (min-width: ${resolveBreakpoint(theme, 'lg')}) {
      padding-block: ${getSpacingVar('section')};
    }
  `}
`;

export const PageContent = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: ${getSpacingVar('section')};
`;
