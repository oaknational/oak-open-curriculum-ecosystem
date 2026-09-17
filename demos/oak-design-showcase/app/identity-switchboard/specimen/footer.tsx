/**
 * The page footer: brand blurb, three link columns, and the legal row on
 * the inverted band. One wording change from the export, recorded: its
 * blurb says "this specimen FILE is byte-identical under every brand",
 * which is true of a static file and false of this server-rendered route —
 * the claim is restated for what IS true here (identical markup, brand as
 * data), because carrying over a false sentence verbatim would put an
 * untruth on the page.
 */

interface FooterColumn {
  readonly heading: string;
  readonly links: readonly { readonly label: string; readonly href: string }[];
}

const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'For teachers',
    links: [
      { label: 'Subjects', href: '#browse' },
      { label: 'Units', href: '#browse' },
      { label: 'Lessons', href: '#lesson' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Downloads', href: '#resources' },
      { label: 'Guidance', href: '#support' },
      { label: 'FAQ', href: '#support' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Who we are', href: '#main' },
      { label: 'Accessibility', href: '#main' },
      { label: 'Contact', href: '#main' },
    ],
  },
];

export function FooterRegion(): React.JSX.Element {
  return (
    <footer className="oak-region foot" data-region="footer">
      <div className="oak-container foot-inner">
        <div className="foot-cols">
          <div className="oak-stack oak-stack--s">
            <span className="oak-heading-6 brand-name">The learning service</span>
            <p className="oak-body-3 blurb">
              Placeholder content. This specimen renders identical markup under every brand.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <span className="oak-body-2 col-h">{column.heading}</span>
              {column.links.map((link) => (
                <a key={link.label} className="oak-link oak-body-3" href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <hr />
        <div className="oak-cluster oak-cluster--s">
          <span className="oak-body-3">© 2026 The learning service</span>
          <nav className="oak-cluster oak-cluster--s legal" aria-label="Legal">
            <a className="oak-link oak-body-3" href="#main">
              Terms
            </a>
            <a className="oak-link oak-body-3" href="#main">
              Privacy
            </a>
            <a className="oak-link oak-body-3" href="#main">
              Licence
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
