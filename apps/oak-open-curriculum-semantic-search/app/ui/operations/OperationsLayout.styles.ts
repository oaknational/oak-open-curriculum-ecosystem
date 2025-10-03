import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

export const OperationsPage = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
  width: min(100%, var(--app-layout-container-max-width));
  max-width: min(100%, var(--app-layout-container-max-width));
  margin-inline: auto;
  padding-inline: clamp(
    var(--app-layout-inline-padding-base),
    4vw,
    var(--app-layout-inline-padding-wide)
  );
  padding-block: var(--app-gap-cluster);

  @media (min-width: var(--app-bp-lg)) {
    padding-block: var(--app-gap-section);
  }
`;

export const OperationsContent = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
`;

export const OperationsSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const OperationsBanner = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-stack);
  padding: var(--app-gap-stack);
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  border: 1px solid
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-neutral-lighter')};
`;
