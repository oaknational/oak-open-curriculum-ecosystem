/**
 * Fixed-hierarchy breadcrumbs for every showcase page (owner word
 * 2026-08-18): the trail reflects where the page LIVES, never the journey
 * that reached it, and every page can walk back to the showcase home.
 * Same shape as the specimen's own crumb pattern (ol + aria-current on
 * the terminal item, separators in CSS) so the estate has one idiom;
 * styling lives in globals.css under .showcase-crumbs.
 */
import Link from 'next/link';
import type { ReactElement } from 'react';

export interface ShowcaseCrumb {
  readonly label: string;
  /** Absent on the terminal (current-page) crumb. */
  readonly href?: string;
}

export function ShowcaseBreadcrumbs({
  trail,
}: {
  readonly trail: readonly ShowcaseCrumb[];
}): ReactElement {
  return (
    <nav aria-label="Showcase breadcrumb" className="showcase-crumbs-nav">
      <ol className="showcase-crumbs oak-body-3">
        {trail.map((crumb) =>
          crumb.href === undefined ? (
            <li key={crumb.label} aria-current="page" className="here">
              {crumb.label}
            </li>
          ) : (
            <li key={crumb.label}>
              <Link className="oak-link" href={crumb.href}>
                {crumb.label}
              </Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
