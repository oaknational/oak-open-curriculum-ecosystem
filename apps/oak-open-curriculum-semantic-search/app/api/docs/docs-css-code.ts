import { css } from 'styled-components';

export function docsCodeTokenStyles(): ReturnType<typeof css> {
  return css`
    .redoc-wrap code span.token.string {
      color: var(--docs-code-string) !important;
    }

    .redoc-wrap code span.property.token.string {
      color: var(--docs-code-key) !important;
    }

    .redoc-wrap code span.token.number {
      color: var(--docs-code-number) !important;
    }

    .redoc-wrap code span.token.boolean,
    .redoc-wrap code span.token.keyword {
      color: var(--docs-code-boolean) !important;
    }

    .redoc-wrap code span.token.null {
      color: var(--docs-code-null) !important;
    }

    .redoc-wrap code span.token.punctuation,
    .redoc-wrap code span.ellipsis {
      color: var(--docs-code-key) !important;
    }
  `;
}
