// src/styled.d.ts
import 'styled-components';
import { ThemeType } from './assets/themes/themes'; // Import your theme type

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
