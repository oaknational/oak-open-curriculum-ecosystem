import 'styled-components';
import type { AppTheme } from './app/ui/themes/types';

declare module 'styled-components' {
  // Augment the DefaultTheme used by styled-components
  // to include our Oak + app semantic tokens
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppTheme {}
}
