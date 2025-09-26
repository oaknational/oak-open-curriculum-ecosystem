import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { getAppTheme } from '../../ui/themes/app-theme-helpers';

export const PageContainer = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
  width: 100%;
  max-inline-size: var(--app-layout-container-max-width);
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

export const HeaderSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const DocsWrapper = styledComponents(OakBox)`
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  border-color: ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  border-width: 1px;
  border-style: solid;
  overflow: hidden;
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  min-height: clamp(40rem, 70vh, 72rem);
`;
