/**
 * Site chrome — masthead and footer.
 *
 * @remarks
 * Oak's main-website grammar (OWA `TopNavMinimal` / `LayoutSiteFooter`)
 * reproduced from the design system's own classes and assets, with the
 * real site navigation stood in for by absolute links to
 * www.thenational.academy. This app serves one page; it does not host Oak's
 * nav, and pretending otherwise would strand a visitor in a dead menu.
 *
 * Assets come from the design system's served copy (`/oak-ds/…`) — the app
 * vendors no logo or rule artwork of its own.
 *
 * @packageDocumentation
 */

import type { JSX } from 'react';

/** Where the design system's runtime files are served from. */
const OAK_DS_BASE = '/oak-ds';

const OAK_WEBSITE_URL = 'https://www.thenational.academy';
const OAK_TEACHERS_URL = 'https://www.thenational.academy/teachers';

/**
 * The five themes `oak-theme.js` supports, in the order the control offers
 * them.
 *
 * @remarks
 * `colour-safe` is present deliberately: the design system ships a
 * colour-vision-deficiency theme and the studio design omitted it from the
 * control, leaving a theme that existed but that no user could reach (a
 * confirmed finding of the page's pre-integration accessibility audit).
 */
export const THEME_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
  { value: 'high-contrast', label: 'High contrast' },
  { value: 'colour-safe', label: 'Colour safe' },
] as const;

function ThemeControl(): JSX.Element {
  return (
    <span className="oak-select-wrap">
      <select
        className="oak-select theme-control"
        id="theme-control"
        aria-label="Colour theme"
        defaultValue="light"
      >
        {THEME_OPTIONS.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </span>
  );
}

/**
 * The masthead: Oak's black tab bar over the white logo bar.
 *
 * @param themeSelectorEnabled - Renders the theme control when true.
 *   Default-hidden; the page still honours a stored theme or the visitor's
 *   OS contrast preference through the design system's own theme script,
 *   so hiding the control removes the affordance, never the theming.
 */
export function SiteMasthead({
  themeSelectorEnabled = false,
}: {
  readonly themeSelectorEnabled?: boolean;
}): JSX.Element {
  return (
    <header data-region="masthead">
      <a className="oak-skip-link" href="#main">
        Skip to content
      </a>
      <nav className="site-tabs" aria-label="Oak site areas">
        <a className="oak-btn oak-btn--secondary" href={OAK_TEACHERS_URL}>
          Teachers
        </a>
        <a className="oak-btn" href={OAK_WEBSITE_URL}>
          Back to www
        </a>
      </nav>
      <nav className="site-nav" aria-label="Site">
        <a className="site-nav-logo" href={OAK_WEBSITE_URL} aria-label="Oak National Academy home">
          <img src={`${OAK_DS_BASE}/assets/logo-full-black.svg`} alt="" />
        </a>
        <a className="oak-btn oak-btn--secondary oak-btn--sm site-nav-back" href={OAK_WEBSITE_URL}>
          {/* The trailing words are dropped below 640px so the masthead
              reflows at 320px without horizontal scroll; the full label stays
              in the accessibility tree either way because CSS `display: none`
              on the inner span removes it from both. Keeping "Back to" +
              "the main Oak website" split lets the short form remain a
              sentence rather than a truncation. */}
          Back to<span className="site-nav-back__long"> the main Oak website</span>
          <span className="oak-btn__icon oak-icon--mask ic-external" aria-hidden="true" />
        </a>
        {themeSelectorEnabled && <ThemeControl />}
      </nav>
    </header>
  );
}

/**
 * The footer: Oak's squiggle rule, logo, and registered-company line.
 */
export function SiteFooter(): JSX.Element {
  return (
    <footer data-region="footer">
      <img
        className="site-footer-rule"
        src={`${OAK_DS_BASE}/assets/icons/header-underline.svg`}
        alt=""
      />
      <div className="oak-container site-footer-inner">
        <a href={OAK_WEBSITE_URL} aria-label="Oak National Academy home">
          <img src={`${OAK_DS_BASE}/assets/logo-full-black.svg`} alt="" />
        </a>
        <address className="site-footer-meta">
          <p className="oak-body-3-bold">© Oak National Academy Limited, No 14174888</p>
          <p className="oak-body-4">1 Scott Place, 2 Hardman Street, Manchester, M3 3AA</p>
        </address>
      </div>
    </footer>
  );
}
