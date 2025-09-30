import { css } from 'styled-components';
import type { DocsStyleTokens } from './docs-theme-tokens';

export function docsControlStyles(tokens: DocsStyleTokens): ReturnType<typeof css> {
  return css`
    .redoc-wrap button {
      background-color: var(--docs-control-bg);
      color: var(--docs-control-text);
      border: 1px solid var(--docs-control-border);
      border-radius: ${tokens.radii.pill};
      padding-block: 0.25rem;
      padding-inline: 0.75rem;
      font-weight: 600;
      transition:
        background-color 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
    }

    .redoc-wrap button:hover,
    .redoc-wrap button:focus-visible {
      background-color: var(--docs-control-bg-hover);
      border-color: var(--docs-accent-border);
      color: var(--docs-control-text);
      outline: none;
    }
  `;
}
