import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { resolveUiColor } from '../../../lib/theme/ThemeGlobalStyle';

export const FixtureToggleWrapper = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-stack);
  align-items: start;
  justify-items: start;
`;

export const FixturePill = styledComponents(OakBox)`
  display: inline-flex;
  align-items: center;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  padding-inline: var(--app-gap-inline, var(--app-gap-cluster));
  padding-block: calc(var(--app-gap-inline, var(--app-gap-cluster)) / 2);
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
  border: 1px solid ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
  width: fit-content;
`;

export const FixturePillText = styledComponents(OakTypography)`
  color: inherit;
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
