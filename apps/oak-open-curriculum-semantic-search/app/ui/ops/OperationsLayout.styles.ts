import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { PageContainer, PageContent } from '../global/Layout';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

export const OperationsPage = styledComponents(PageContainer)``;

export const OperationsContent = styledComponents(PageContent)``;

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
