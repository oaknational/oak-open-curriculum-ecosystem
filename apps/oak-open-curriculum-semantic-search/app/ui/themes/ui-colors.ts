import type { OakTheme } from '@oaknational/oak-components';
import { semanticThemeSpec, type SemanticMode } from './semantic-theme-spec';

export function buildUiColors(mode: SemanticMode): OakTheme['uiColors'] {
  return semanticThemeSpec[mode].uiColors;
}
