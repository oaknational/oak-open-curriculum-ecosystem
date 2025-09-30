import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { buildDocsWrapperStyles } from './docs-style-helpers';
export { resolveDocsSurfaces } from './docs-style-helpers';

export const PageContainer = styledComponents(OakBox)`
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

export const HeaderSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const DocsWrapper = styledComponents(OakBox)`
  ${({ theme }) => buildDocsWrapperStyles(theme)}
`;
