export interface DocsStyleTokens {
  readonly surfaces: {
    readonly surface: string;
    readonly surfaceAlt: string;
    readonly border: string;
    readonly emphasis: string;
  };
  readonly text: {
    readonly primary: string;
    readonly subdued: string;
    readonly muted: string;
  };
  readonly links: {
    readonly active: string;
    readonly hover: string;
  };
  readonly palette: {
    readonly accentBorder: string;
  };
  readonly code: {
    readonly key: string;
    readonly string: string;
    readonly number: string;
    readonly boolean: string;
    readonly null: string;
  };
  readonly controls: {
    readonly background: string;
    readonly hoverBackground: string;
    readonly border: string;
    readonly text: string;
  };
  readonly colors: {
    readonly error: string;
  };
  readonly radii: {
    readonly card: string;
    readonly pill: string;
  };
  readonly info: {
    readonly method: string;
    readonly methodBorder: string;
  };
}
