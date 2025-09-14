/**
 * UI design tokens for the Semantic Search app.
 * Centralises spacing, radii, and colours so UI components avoid inline constants.
 */
export type AppColorTokens = {
  headerBorder: string;
  borderSubtle: string;
  textMuted: string;
  errorText: string;
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

export type AppTokens = {
  colors: AppColorTokens;
  space: AppSpaceTokens;
  radii: AppRadiiTokens;
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
      md: '6px',
    },
  };
}
