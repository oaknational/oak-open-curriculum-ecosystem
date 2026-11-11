/**
 * Oak National Academy brand banner.
 *
 * @remarks
 * Displayed when `get-curriculum-model` fires as a session-start proxy.
 * The banner serves the human with orientation ("you are in Oak now").
 * The curriculum-model data serves the agent via text content; the human
 * sees only the brand banner.
 *
 * The wide wordmark is the design-system asset
 * (`@oaknational/oak-design-system/assets/logo-wide-black.svg`) imported
 * raw at build time, so the design system stays the single copy — there
 * is no second geometry to drift (MCP-368). The inner geometry is
 * injected into a JSX-owned `<svg>` root so the accessibility and
 * theming contract (aria-hidden, viewBox, class) lives in component
 * code; the slice drops the asset's XML prolog and root `id`. Colour
 * comes from CSS `fill: currentColor` on the logo class: the asset is
 * bare geometry with no fill attributes, inline fill styles, or style
 * elements, which the unit suite pins — a single upstream fill in any of
 * those forms would defeat inheritance and render the wordmark black in
 * every theme.
 */
import wordmarkRaw from '@oaknational/oak-design-system/assets/logo-wide-black.svg?raw';

const OAK_URL = 'https://www.thenational.academy';

// Everything below derives from the asset at module scope — the viewBox is
// PARSED, never hand-copied, so a re-exported asset on a different canvas
// cannot render mis-scaled inside a stale coordinate system. Module-scope
// throws surface at build/test time, not in a host. (The one authored copy
// of the expected viewBox lives in the unit suite as the discriminating
// fixture between the wide lockup and the old acorn.)
const rootTagStart = wordmarkRaw.indexOf('<svg');
const rootTagEnd = wordmarkRaw.indexOf('>', rootTagStart);
const rootClose = wordmarkRaw.lastIndexOf('</svg>');
if (
  rootTagStart === -1 ||
  rootTagEnd === -1 ||
  rootClose === -1 ||
  rootClose < rootTagEnd ||
  // Exactly ONE root: a second <svg (a concatenated re-export) would
  // otherwise pair the first opening tag with the LAST closing tag and
  // inject the extra root as geometry; trailing non-whitespace after the
  // close is the same class.
  wordmarkRaw.includes('<svg', rootTagStart + 1) ||
  wordmarkRaw.slice(rootClose + '</svg>'.length).trim() !== ''
) {
  throw new Error(
    'logo-wide-black.svg no longer parses as a single-root SVG document — refusing to inject garbage',
  );
}
const viewBoxMatch = /viewBox="([^"]+)"/u.exec(wordmarkRaw.slice(rootTagStart, rootTagEnd + 1));
if (viewBoxMatch?.[1] === undefined) {
  throw new Error('logo-wide-black.svg carries no viewBox — the wordmark cannot be scaled');
}

/** The asset's own viewBox, parsed from the raw import — never hand-copied. */
const WORDMARK_VIEWBOX = viewBoxMatch[1];

// Inner geometry only: everything between the asset's root tags. Built at
// module scope (never inline in JSX) per the React guidance for
// dangerouslySetInnerHTML payloads. The markup is a committed repo asset
// resolved by Vite at build time — a fully trusted source, no user input.
const wordmarkGeometry = {
  __html: wordmarkRaw.slice(rootTagEnd + 1, rootClose),
};

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
 * Inline Oak wide wordmark rendered with CSS `fill: currentColor`.
 *
 * @remarks
 * Hidden from assistive technology (`aria-hidden`) because the link's
 * visually hidden text provides the accessible name; the wordmark is an
 * image of that same text, so exposing both would double-announce.
 * `focusable="false"` guards legacy engines that make SVGs tabbable.
 * Sizing lives in CSS (width-driven with `block-size: auto`, clamped by
 * the banner-wordmark-max-width token), never in width/height attributes.
 */
function OakWordmark(): React.JSX.Element {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={WORDMARK_VIEWBOX}
      className="oak-brand-banner__logo"
      dangerouslySetInnerHTML={wordmarkGeometry}
    />
  );
}

/**
 * Brand banner — the wide wordmark as a link to the Oak website.
 *
 * @remarks
 * The wordmark is the link's only visible content; a single visually
 * hidden text node carries the whole accessible name (brand + new-tab
 * hint), keeping the name exact by construction, translatable, and in
 * the content-audit corpus (WCAG H2: one link, one tab stop). External
 * navigation uses `onOpenLink` which delegates to `app.openLink()` in
 * the connected component. Service-scoped copy (the experimental
 * disclaimer) lives in the app shell, not here — this component owns
 * brand identity only.
 */
export function BrandBanner({ onOpenLink }: BrandBannerProps): React.JSX.Element {
  return (
    <header className="oak-brand-banner">
      <a
        href={OAK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="oak-brand-banner__link"
        onClick={(event) => {
          onOpenLink(OAK_URL, event);
        }}
      >
        <OakWordmark />
        <span className="visually-hidden">Oak National Academy (opens in a new tab)</span>
      </a>
    </header>
  );
}
