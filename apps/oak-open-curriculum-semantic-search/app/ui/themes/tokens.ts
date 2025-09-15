/**
 * UI design tokens for the Semantic Search app.
 * Centralises spacing, radii, and colours so UI components avoid inline constants.
 */
export type AppColorTokens = {
  headerBorder: string;
  borderSubtle: string;
  textMuted: string;
  errorText: string;
  pageNote: string;
  docsNote: string;
  surfaceEmphasisBg: string;
};

export type AppSpaceTokens = {
  xs: string; // 0.25rem
  sm: string; // 0.5rem
  md: string; // 0.75rem
  lg: string; // 1rem
  xl: string; // 1.25rem
};

export type AppRadiiTokens = {
  sm: string; // 4px
  md: string; // 6px
};

export type AppFontSizeTokens = {
  xs: string; // 12px
  sm: string; // 14px
  md: string; // 16px
};

export type AppLayoutTokens = {
  containerMaxWidth: string; // 900px
};

export type AppTokens = {
  colors: AppColorTokens;
  space: AppSpaceTokens;
  radii: AppRadiiTokens;
  fontSizes: AppFontSizeTokens;
  layout: AppLayoutTokens;
};

/**
 * Builds app tokens, preferring Oak theme values when available, otherwise
 * falling back to conservative defaults matching current UI.
 */
export function buildTokens(): AppTokens {
  // TODO: Map to Oak theme palette/semantic colours once available in docs.
  return {
    colors: {
      headerBorder: '#e5e7eb',
      borderSubtle: '#ddd',
      textMuted: '#666',
      errorText: 'crimson',
      // Additional app colours
      pageNote: '#555',
      docsNote: '#4b5563',
      surfaceEmphasisBg: 'rgba(0,0,0,0.06)',
    },
    space: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
    },
    radii: {
      sm: '4px',
      md: '8px',
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
    },
    layout: {
      containerMaxWidth: '900px',
    },
  };
}
