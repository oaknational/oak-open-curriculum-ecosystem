import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';

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

export const IntroSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const QuickLinksSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const ActionsGrid = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: var(--app-bp-md)) {
    grid-template-columns:
      minmax(var(--app-layout-secondary-column-min-width), 1fr)
      minmax(var(--app-layout-secondary-column-min-width), 1fr);
  }

  @media (min-width: var(--app-bp-xl)) {
    grid-template-columns:
      minmax(var(--app-layout-secondary-column-min-width), 1fr)
      minmax(var(--app-layout-secondary-column-min-width), 1fr)
      minmax(var(--app-layout-secondary-column-min-width), 1fr);
  }
`;

export const ActionSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

export const TelemetrySection = styledComponents(ActionSection)`
  @media (min-width: var(--app-bp-md)) {
    grid-column: 1 / -1;
  }
`;
