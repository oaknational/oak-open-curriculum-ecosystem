/**
 * The specimen's hero region, rebuilt from the design system under the
 * playbook's two governing rules: the export defines the appearance and
 * the words (carried over exactly); the construction is the kit's
 * documented component vocabulary — band, container, flow, cluster,
 * buttons, tags, cards — with layout-only app classes in specimen.css.
 */

function Breadcrumbs(): React.JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className="hero-crumbs">
      <ol className="crumbs oak-body-3">
        <li>
          <a className="oak-link" href="#main">
            Home
          </a>
        </li>
        <li>
          <a className="oak-link" href="#main">
            Teachers
          </a>
        </li>
        <li>
          <a className="oak-link" href="#browse">
            Science
          </a>
        </li>
        <li aria-current="page" className="here">
          The water cycle
        </li>
      </ol>
    </nav>
  );
}

function HeroActions(): React.JSX.Element {
  return (
    <div className="oak-flow-key oak-cluster actions">
      <button className="oak-btn" type="button">
        Start the unit
      </button>
      <button className="oak-btn oak-btn--secondary" type="button">
        <span className="oak-icon--mask ic-download icon-s" aria-hidden="true" />
        {'Download all resources'}
      </button>
      <button
        className="oak-icon-btn oak-icon-btn--secondary"
        type="button"
        aria-label="Save this unit"
      >
        <span className="oak-icon--mask ic-star" aria-hidden="true" />
      </button>
    </div>
  );
}

function HeroTags(): React.JSX.Element {
  return (
    <div className="oak-flow-key oak-cluster oak-cluster--s tagrow">
      <span className="oak-tag oak-tag--mint">Science</span>
      <span className="oak-tag oak-tag--aqua">Year 4</span>
      <span className="oak-tag oak-tag--lavender">States of matter</span>
      <span className="oak-tag oak-tag--grey">6 lessons</span>
      <span className="oak-tag oak-tag--white">Free</span>
    </div>
  );
}

function UnitTabs(): React.JSX.Element {
  return (
    <div className="oak-container tabs-wrap">
      <nav aria-label="Unit views">
        <ul className="tabs oak-body-1">
          <li>
            <a href="#browse" aria-current="page">
              Unit sequence
            </a>
          </li>
          <li>
            <a href="#lesson">Lesson detail</a>
          </li>
          <li>
            <a href="#resources">Downloads</a>
          </li>
          <li>
            <a href="#support">FAQ</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const UNIT_METRICS = [
  { label: 'Lessons', value: '6' },
  { label: 'Teaching time', value: '5h 15m' },
  { label: 'Keywords', value: '18' },
  { label: 'Downloads', value: '24' },
] as const;

function UnitMetrics(): React.JSX.Element {
  return (
    <div className="oak-container metrics-wrap">
      <dl className="metrics">
        {UNIT_METRICS.map((metric) => (
          <div key={metric.label} className="oak-card oak-stack oak-stack--s metric">
            <dt className="oak-body-3">{metric.label}</dt>
            <dd className="oak-heading-4">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function HeroRegion(): React.JSX.Element {
  return (
    <section className="oak-region" data-region="hero" aria-label="Unit overview">
      <div className="oak-band hero-band">
        <div className="oak-container hero-inner">
          <Breadcrumbs />
          <div className="oak-flow">
            <p className="oak-flow-key oak-heading-7 kicker">
              Unit 4 · Science · Year 4 · Key Stage 2
            </p>
            {/* The skip link's focus target (WCAG G1): the page's own
                headline announces better than an unnamed landmark, and a
                negative tabindex is harmless HERE — the h1 is nested in a
                region, not a reading-flow item of .oak-canvas/.oak-main. */}
            <h1
              className="oak-flow-key oak-heading-2 headline"
              id="specimen-headline"
              tabIndex={-1}
            >
              The water cycle
            </h1>
            <p className="oak-flow-key oak-body-1 standfirst">
              Every drop of rain has been rained before. Six lessons following one puddle from the
              playground into the sky and back again — evaporation, condensation, and the words to
              name them.
            </p>
            <HeroActions />
            <HeroTags />
          </div>
        </div>
      </div>
      <UnitTabs />
      <UnitMetrics />
    </section>
  );
}
