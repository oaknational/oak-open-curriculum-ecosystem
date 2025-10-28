import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { OperationsSection } from '../ui/ops';

export const IntroSection = styledComponents(OperationsSection)``;

export const QuickLinksSection = styledComponents(OperationsSection)``;

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

export const ActionSection = styledComponents(OperationsSection)``;

export const TelemetrySection = styledComponents(ActionSection)`
  @media (min-width: var(--app-bp-md)) {
    grid-column: 1 / -1;
  }
`;
