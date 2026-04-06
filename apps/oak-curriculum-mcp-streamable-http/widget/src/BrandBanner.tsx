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
 * The SVG uses `stroke="currentColor"` so it inherits the CSS `color`
 * property, adapting to all themes including Windows Forced Colours Mode.
 * Hidden from assistive technology (`aria-hidden`) because the adjacent
 * text "Oak National Academy" provides the accessible name (WCAG H2).
 */
function OakLogo(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      width="28"
      height="28"
      className="oak-banner__logo"
    >
      {/* Acorn body — rounded oval open at bottom-left */}
      <path
        d="M50 88 C28 88 16 72 16 54 C16 36 28 24 44 24 C60 24 84 36 84 54 C84 72 72 88 50 88 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Acorn cap leaf — upper right */}
      <path
        d="M56 24 C56 24 62 14 72 14 C82 14 84 24 84 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Stem */}
      <path
        d="M56 24 L52 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
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
      </a>
    </header>
  );
}
