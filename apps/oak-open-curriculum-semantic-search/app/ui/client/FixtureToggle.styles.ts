import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

export const FixtureToggleWrapper = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-stack);
  align-items: start;
  justify-items: start;
`;

export const FixtureToggleCluster = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-cluster);
  align-items: start;
`;

export const FixtureBanner = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-stack);
  padding: var(--app-gap-stack);
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  border: 1px solid
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-neutral-lighter')};
`;

export const FixtureNoticeText = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.colors.textSubdued};
`;

export const VisuallyHiddenStatus = styledComponents.span`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`;
