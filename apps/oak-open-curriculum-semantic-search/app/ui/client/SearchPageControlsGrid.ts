import { css } from 'styled-components';

export type ControlsLayout = 'both' | 'structured' | 'natural';

type GridTemplate = ReturnType<typeof css>;

export function controlsGridBase(layout: ControlsLayout): GridTemplate {
  switch (layout) {
    case 'structured':
      return css`
        grid-template-columns: minmax(var(--app-layout-control-column-min-width), 1fr);
        grid-template-areas: 'structured';
      `;
    case 'natural':
      return css`
        grid-template-columns: minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'natural';
      `;
    default:
      return css`
        grid-template-columns: minmax(0, 1fr);
        grid-template-areas:
          'structured'
          'natural';
      `;
  }
}

export function controlsGridMd(layout: ControlsLayout): GridTemplate {
  switch (layout) {
    case 'structured':
      return css`
        grid-template-columns: minmax(var(--app-layout-control-column-min-width), 1fr);
        grid-template-areas: 'structured';
      `;
    case 'natural':
      return css`
        grid-template-columns: minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'natural';
      `;
    default:
      return css`
        grid-template-columns:
          minmax(var(--app-layout-control-column-min-width), 1.25fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'structured natural';
      `;
  }
}

export function controlsGridXl(layout: ControlsLayout): GridTemplate {
  switch (layout) {
    case 'structured':
      return css`
        grid-template-columns: minmax(var(--app-layout-control-column-min-width), 1fr);
        grid-template-areas: 'structured';
      `;
    case 'natural':
      return css`
        grid-template-columns: minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'natural';
      `;
    default:
      return css`
        grid-template-columns:
          minmax(var(--app-layout-control-column-min-width), 1.5fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'structured natural';
      `;
  }
}
