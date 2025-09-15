import 'styled-components';
import type { AppTheme } from '../app/ui/themes/types';

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
