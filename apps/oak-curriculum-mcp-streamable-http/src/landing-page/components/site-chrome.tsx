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

import { OAK_DS_BASE } from './design-system-refs.js';

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
 *   Default-hidden, and the theme script is withheld with it: a mechanism that
 *   changes a user-visible setting ships only alongside the control that
 *   changes it back (ADR-217 §5). Left to load alone, `oak-theme.js` applies a
 *   stored or OS-derived theme and leaves the visitor in a state the page never
 *   offered, with no way out. Hiding the control therefore removes the theming
 *   too, deliberately; the page declares `data-theme="light"` and stays there.
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
      {/* Both bands are full-bleed with an inner `.oak-container`, the shape
          the footer already uses. Hand-rolled gutters here previously put the
          masthead logo out of line with the page's content column at every
          width, and the error reversed direction between 1200px and 1440px. */}
      <nav className="site-tabs" aria-label="Oak site areas">
        <div className="oak-container site-tabs-inner">
          <a className="oak-btn oak-btn--secondary" href={OAK_TEACHERS_URL}>
            Teachers
          </a>
          <a className="oak-btn" href={OAK_WEBSITE_URL}>
            Oak home
          </a>
        </div>
      </nav>
      <nav className="site-nav" aria-label="Site">
        <div className="oak-container site-nav-inner">
          <a
            className="site-nav-logo"
            href={OAK_WEBSITE_URL}
            aria-label="Oak National Academy home"
          >
            <img src={`${OAK_DS_BASE}/assets/logo-full-black.svg`} alt="" />
          </a>
          <a
            className="oak-btn oak-btn--secondary oak-btn--sm site-nav-back"
            href={OAK_WEBSITE_URL}
          >
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
        </div>
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
