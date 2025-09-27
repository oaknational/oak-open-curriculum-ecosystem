import { css } from 'styled-components';
import type { DocsStyleTokens } from './docs-theme-tokens';

export function docsStructureStyles(tokens: DocsStyleTokens): ReturnType<typeof css> {
  return css`
    border-radius: ${tokens.radii.card};
    border: 1px solid var(--docs-border);
    overflow: hidden;
    background-color: var(--docs-surface);
    color: var(--docs-text-primary);
    min-height: clamp(40rem, 70vh, 72rem);
    box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.08);

    a {
      color: var(--docs-link);
    }

    a:hover,
    a:focus {
      color: var(--docs-link-hover);
    }
  `;
}

export function docsContentStyles(tokens: DocsStyleTokens): ReturnType<typeof css> {
  return css`
    ${contentLayoutBlock(tokens)}
    ${contentTypographyBlock()}
    ${contentCodeBlock(tokens)}
    ${contentBadgeBlock(tokens)}
  `;
}

const contentLayoutBlock = (tokens: DocsStyleTokens): ReturnType<typeof css> => css`
  .redoc-wrap,
  .redoc-wrap .api-content,
  .redoc-wrap .menu-content {
    background-color: var(--docs-surface);
    color: var(--docs-text-primary);
  }

  .redoc-wrap {
    background-color: var(--docs-surface);
  }

  .redoc-wrap .menu-content {
    background-color: var(--docs-surface-alt);
    border-right: 1px solid var(--docs-border);
  }

  .redoc-wrap .operation-type {
    box-sizing: content-box;
    line-height: 2.2;
    color: var(--docs-text-primary);
    background-color: ${tokens.info.method};
    border: 2px solid ${tokens.info.methodBorder};
  }
`;

const contentTypographyBlock = (): ReturnType<typeof css> => {
  const headingSelectors = [
    '.redoc-wrap h1',
    '.redoc-wrap h2',
    '.redoc-wrap h3',
    '.redoc-wrap h4',
    '.redoc-wrap h5',
    '.redoc-wrap h6',
    '.redoc-wrap p',
    '.redoc-wrap li',
  ].join(',\n');

  const subduedSelectors = [
    '.redoc-wrap small',
    '.redoc-wrap .menu-content p',
    '.redoc-wrap .menu-content li',
    '.redoc-wrap .api-info p',
  ].join(',\n');

  return css`
    ${headingSelectors} {
      color: var(--docs-text-primary);
    }

    ${subduedSelectors} {
      color: var(--docs-text-subdued);
    }

    .redoc-wrap .api-info small {
      color: var(--docs-text-muted);
    }
  `;
};

const contentCodeBlock = (tokens: DocsStyleTokens): ReturnType<typeof css> => css`
  .redoc-wrap pre,
  .redoc-wrap code {
    background-color: var(--docs-surface-alt);
    color: var(--docs-text-primary);
    border-radius: ${tokens.radii.card};
  }

  .redoc-wrap pre {
    border: 1px solid var(--docs-border);
  }

  .redoc-wrap table {
    background-color: var(--docs-surface);
    color: var(--docs-text-primary);
    border: 1px solid var(--docs-border);
  }

  .redoc-wrap th,
  .redoc-wrap td {
    border-color: var(--docs-border);
  }
`;

const contentBadgeBlock = (tokens: DocsStyleTokens): ReturnType<typeof css> => css`
  .redoc-wrap .http-verb,
  .redoc-wrap [class*='badge'],
  .redoc-wrap [class*='label'] {
    background-color: var(--docs-surface-emphasis);
    color: var(--docs-text-primary);
    border: 1px solid var(--docs-accent-border);
  }

  .redoc-wrap ul.react-tabs__tab-list li.react-tabs__tab {
    margin: 1em;
    border: 1px solid var(--docs-accent-border);
    background-color: var(--docs-surface);
    color: var(--docs-text-primary);
  }

  .redoc-wrap ul.react-tabs__tab-list li.react-tabs__tab.react-tabs__tab--selected {
    background-color: var(--docs-surface-alt);
  }

  .redoc-wrap span.sc-bEjUoa + span.sc-bEjUoa {
    color: var(--docs-text-primary) !important;
    background-color: var(--docs-surface-alt) !important;
    border: 1px solid var(--docs-border) !important;
    border-radius: ${tokens.radii.pill};
    padding-inline: 0.5rem;
    padding-block: 0.125rem;
    font-weight: 600;
  }

  .redoc-wrap span.sc-dNFkOE {
    color: var(--docs-text-primary) !important;
  }

  .redoc-wrap .required,
  .redoc-wrap .required-property {
    color: ${tokens.colors.error};
  }
`;
