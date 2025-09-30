import { css } from 'styled-components';
import type { DocsStyleTokens } from './docs-theme-tokens';

export function docsVariableStyles(tokens: DocsStyleTokens): ReturnType<typeof css> {
  const { surfaces, text, links, palette, code, controls } = tokens;
  return css`
    --docs-surface: ${surfaces.surface};
    --docs-surface-alt: ${surfaces.surfaceAlt};
    --docs-surface-emphasis: ${surfaces.emphasis};
    --docs-text-primary: ${text.primary};
    --docs-text-subdued: ${text.subdued};
    --docs-text-muted: ${text.muted};
    --docs-border: ${surfaces.border};
    --docs-link: ${links.active};
    --docs-link-hover: ${links.hover};
    --docs-accent-border: ${palette.accentBorder};
    --docs-code-key: ${code.key};
    --docs-code-string: ${code.string};
    --docs-code-number: ${code.number};
    --docs-code-boolean: ${code.boolean};
    --docs-code-null: ${code.null};
    --docs-control-bg: ${controls.background};
    --docs-control-bg-hover: ${controls.hoverBackground};
    --docs-control-border: ${controls.border};
    --docs-control-text: ${controls.text};
  `;
}
