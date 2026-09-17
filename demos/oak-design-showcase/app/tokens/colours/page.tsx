import type { ReactElement } from 'react';

import { ShowcaseBreadcrumbs } from '../../../components/ShowcaseBreadcrumbs';
import { SiteFooter } from '../../../components/SiteFooter';
import { IDENTITIES, IDENTITY_LABELS } from '../../../components/useIdentity';
import { loadCatalogue } from '../token-source';

import { MATRIX_THEMES, bandId, colourTokens, frameTitle, stripHref } from './colour-matrix';

import './colours.css';

/**
 * The colour matrix: every colour the system publishes, under every
 * identity and every theme, side by side.
 *
 * EACH CELL IS A REAL DOCUMENT. One page cannot wear three identities and
 * five themes at once — an identity is a stylesheet loaded over the kit,
 * and `light-dark()` resolves against the root's colour-scheme — so the
 * comparison is made of framed exhibits, each genuinely wearing one
 * combination and painting its own swatches through its own cascade. The
 * alternative, reading values into JavaScript and printing them, would show
 * a claim about the cascade instead of the cascade.
 *
 * Fifteen frames sounds heavy and is not: each is a bare list of swatches
 * with no chrome, and every one is `loading="lazy"`, so a reader pays only
 * for the bands they scroll to.
 */
export const metadata = {
  title: 'Colour matrix — Oak Open Curriculum Design System',
  description:
    'Every colour token the design system publishes, shown under every identity and every theme side by side.',
};

/** One theme's band: the same three identities, every time, in roster
 *  order — so a reader compares down a column as well as across a row. */
function ThemeBand({
  theme,
  label,
}: {
  readonly theme: (typeof MATRIX_THEMES)[number]['id'];
  readonly label: string;
}): ReactElement {
  return (
    <section className="matrix-band" aria-labelledby={bandId(theme)}>
      <h2 className="oak-heading-6" id={bandId(theme)}>
        {label}
      </h2>
      <div className="matrix-cols">
        {IDENTITIES.map((identity) => (
          <figure key={identity} className="matrix-cell">
            <figcaption className="oak-body-3 matrix-cell-name">
              {IDENTITY_LABELS[identity]}
            </figcaption>
            <iframe
              className="matrix-frame"
              loading="lazy"
              title={frameTitle(IDENTITY_LABELS[identity], label)}
              src={stripHref(identity, theme)}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

/** The trail, the title, and what the reader is looking at. */
function MatrixIntro({ colourCount }: { readonly colourCount: number }): ReactElement {
  return (
    <>
      <ShowcaseBreadcrumbs
        trail={[
          { label: 'Showcase', href: '/' },
          { label: 'Tokens', href: '/tokens' },
          { label: 'Colours' },
        ]}
      />
      <h1 className="oak-heading-3" id="colours-headline">
        Colour matrix
      </h1>
      <p className="oak-body-2 colours-lede">
        All {colourCount} colour tokens, under every identity and every theme at once. Each panel is
        a real page wearing that identity and that theme, painting its own swatches through its own
        cascade &mdash; so what you are comparing is the system resolving, not a picture of it.
      </p>
      <p className="oak-body-3 colours-note">
        The five themes are the ones a page can be set to. <em>Match device</em> is not among them:
        it is not a face of its own but an instruction to follow the operating system, so it shows
        whichever of light or dark the machine is in.
      </p>
    </>
  );
}

export default function ColourMatrixPage(): ReactElement {
  const tokens = colourTokens(loadCatalogue().tokens);

  return (
    <>
      <a className="oak-skip-link" href="#colours-headline">
        Skip to content
      </a>
      <div className="oak-canvas" data-page="colours">
        <header className="oak-region mast" data-region="masthead">
          <div className="oak-container oak-cluster mast-inner">
            <span className="oak-heading-6 brand-name">Oak Open Curriculum Design System</span>
          </div>
        </header>

        <main
          id="main"
          className="oak-main oak-region oak-container colours-page"
          data-region="main"
        >
          <MatrixIntro colourCount={tokens.length} />
          {MATRIX_THEMES.map(({ id, label }) => (
            <ThemeBand key={id} theme={id} label={label} />
          ))}
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
