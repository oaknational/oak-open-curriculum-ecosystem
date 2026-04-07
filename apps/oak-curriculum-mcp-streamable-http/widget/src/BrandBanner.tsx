/**
 * Oak National Academy brand banner.
 *
 * @remarks
 * Displayed when `get-curriculum-model` fires as a session-start proxy.
 * The banner serves the human with orientation ("you are in Oak now").
 * The curriculum-model data serves the agent via text content; the human
 * sees only the brand banner.
 *
 * The inline SVG logo uses `currentColor` so it adapts to light, dark,
 * and forced-colours modes without conditional CSS or separate assets.
 * The path data is extracted from the Oak-Web-Application sprite sheet
 * (`src/image-data/generated/inline-sprite.svg`, `id="logo"`).
 */

const OAK_URL = 'https://www.thenational.academy';

interface BrandBannerProps {
  /**
   * Callback to open an external URL via the MCP Apps SDK.
   *
   * @remarks
   * Receives the React mouse event so the connected component can decide
   * whether to call `preventDefault`. When the MCP App is not connected,
   * the callback is a no-op and the native `<a href>` fallback navigates.
   */
  readonly onOpenLink: (url: string, event: React.MouseEvent) => void;
}

/**
 * Inline Oak acorn logo rendered with `currentColor`.
 *
 * @remarks
 * The SVG uses `fill="currentColor"` so it inherits the CSS `color`
 * property, adapting to all themes including Windows Forced Colours Mode.
 * Hidden from assistive technology (`aria-hidden`) because the adjacent
 * text "Oak National Academy" provides the accessible name (WCAG H2).
 */
function OakLogo(): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 42" width="20" height="26" className="oak-banner__logo">
      <path
        fill="currentColor"
        d="M16.983 7.198c.86.15 1.602.243 2.328.41a14.603 14.603 0 0 1 8.09 4.962 14.964 14.964 0 0 1 3.513 8.535c.05.58.082 1.16.092 1.74.012.627-.086.738-.676.825-2.213.32-4.468.14-6.604-.522a14.778 14.778 0 0 1-3.871-1.838 13.41 13.41 0 0 1-3.74-3.803 13.242 13.242 0 0 1-2.07-5.484c-.107-.711-.124-1.434-.191-2.234a12.84 12.84 0 0 0-6.444 3.065c-2.65 2.319-4.192 5.266-4.748 8.808.536.108 1.029.224 1.532.303.447.07.71.244.724.76.046 1.658.345 3.3.887 4.865a31.671 31.671 0 0 0 1.983 4.418 16.044 16.044 0 0 0 4.608 5.383 17.553 17.553 0 0 0 3.214 1.861c.383.17 1.015-.104 1.483-.301a13.61 13.61 0 0 0 5.595-4.23c.835-1.076 1.497-2.307 2.12-3.529.755-1.482 1.063-3.115 1.258-4.761.039-.323.15-.454.481-.423.396.04.794.05 1.191.035.474-.026.675.222.613.637-.191 1.314-.306 2.66-.67 3.927a16.895 16.895 0 0 1-4.344 7.268 15.364 15.364 0 0 1-6.6 4.002c-.504.15-.926-.027-1.372-.176-2.78-.924-5.066-2.6-6.995-4.773a28.75 28.75 0 0 1-2.51-3.27 20.02 20.02 0 0 1-2.158-4.435 18.563 18.563 0 0 1-1.074-5.01.49.49 0 0 0-.303-.325c-.592-.193-1.197-.327-1.795-.493a.615.615 0 0 1-.516-.484.628.628 0 0 1-.003-.25c.154-2.56.889-5.05 2.147-7.278a16.25 16.25 0 0 1 4.174-4.84 15.683 15.683 0 0 1 6.32-2.969 1.19 1.19 0 0 1 .326-.071c1.117.102 1.404-.63 1.682-1.53a11.998 11.998 0 0 1 3.683-5.58c.5-.436.564-.436 1.01 0 .26.26.511.53.755.804.361.41.361.594-.048.967-.947.895-1.73 1.95-2.316 3.119-.286.624-.54 1.264-.76 1.915Zm11.554 14.268c-.032-.173-.065-.31-.084-.45a13.55 13.55 0 0 0-2.01-5.465 12.892 12.892 0 0 0-5.012-4.62A12.337 12.337 0 0 0 17 9.671c-.272-.03-.42.046-.414.36.056 2.427.701 4.674 2.12 6.64a11.663 11.663 0 0 0 5.268 4.082c1.465.58 2.978.754 4.564.713Z"
      />
    </svg>
  );
}

/**
 * Brand banner — logo + "Oak National Academy" link.
 *
 * @remarks
 * The banner fills the MCP App view. Logo and text are combined in a
 * single `<a>` element (WCAG H2 technique) to avoid duplicate tab stops.
 * External navigation uses `onOpenLink` which delegates to
 * `app.openLink()` in the connected component.
 */
export function BrandBanner({ onOpenLink }: BrandBannerProps): React.JSX.Element {
  return (
    <header className="oak-banner">
      <a
        href={OAK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="oak-banner__link"
        onClick={(event) => {
          onOpenLink(OAK_URL, event);
        }}
      >
        <OakLogo />
        <span>Oak National Academy</span>
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    </header>
  );
}
