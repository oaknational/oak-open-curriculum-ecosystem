/**
 * The results region: the browse heading, active-filter bar, update
 * banner, the six-lesson ledger across two terms, and pagination — the
 * spec's words exactly, the kit's components throughout.
 */

interface Lesson {
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly length: string;
}

const AUTUMN: readonly Lesson[] = [
  {
    number: 1,
    title: 'Where does a puddle go?',
    description: 'Evaporation, observed with chalk and patience.',
    length: '45 min',
  },
  {
    number: 2,
    title: 'The window that cried',
    description: 'Condensation on cold surfaces.',
    length: '45 min',
  },
  {
    number: 3,
    title: 'Clouds are not smoke',
    description: 'Droplets, vapour and what clouds are made of.',
    length: '60 min',
  },
];

const SPRING: readonly Lesson[] = [
  {
    number: 4,
    title: 'When rain becomes a river',
    description: 'Precipitation and collection.',
    length: '60 min',
  },
  {
    number: 5,
    title: 'The whole cycle, drawn',
    description: 'Assembling the diagram from memory.',
    length: '45 min',
  },
  {
    number: 6,
    title: 'Review and quiz',
    description: 'Retrieval across the whole unit.',
    length: '45 min',
  },
];

function LessonRow({ lesson }: { readonly lesson: Lesson }): React.JSX.Element {
  return (
    <li>
      <span className="oak-body-3 num">{lesson.number}</span>
      <div className="entry">
        <a className="oak-link oak-body-1" href="#lesson">
          {lesson.title}
        </a>
        <p className="oak-body-3">{lesson.description}</p>
      </div>
      <span className="oak-tag oak-tag--white">{lesson.length}</span>
      <button
        className="oak-icon-btn oak-icon-btn--secondary"
        type="button"
        aria-label="Save lesson"
      >
        <span className="oak-icon--mask ic-star" aria-hidden="true" />
      </button>
    </li>
  );
}

function TermLedger({
  term,
  lessons,
}: {
  readonly term: string;
  readonly lessons: readonly Lesson[];
}): React.JSX.Element {
  return (
    <div className="oak-stack">
      <h3 className="oak-heading-6 term-h">{term}</h3>
      <ol className="ledger" start={lessons[0]?.number}>
        {lessons.map((lesson) => (
          <LessonRow key={lesson.number} lesson={lesson} />
        ))}
      </ol>
    </div>
  );
}

function ResultsBar(): React.JSX.Element {
  return (
    <div className="oak-cluster results-bar">
      <output className="oak-body-2">
        Showing <strong>6</strong> of 6 lessons
      </output>
      <div className="oak-cluster oak-cluster--s">
        <span className="oak-tag oak-tag--aqua">
          {'45 minutes'}
          <span className="oak-icon--mask ic-cross icon-s" aria-hidden="true" />
        </span>
        <span className="oak-tag oak-tag--aqua">
          {'60 minutes'}
          <span className="oak-icon--mask ic-cross icon-s" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function Pagination(): React.JSX.Element {
  return (
    <nav className="oak-cluster oak-cluster--s pagenav" aria-label="Pagination">
      <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button" disabled>
        Previous
      </button>
      <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button" aria-current="page">
        1
      </button>
      <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button">
        2
      </button>
      <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button">
        Next
      </button>
    </nav>
  );
}

export function ResultsRegion(): React.JSX.Element {
  return (
    <section
      id="browse"
      className="oak-region results-pad"
      data-region="results"
      aria-labelledby="browse-h"
    >
      <div className="oak-stack oak-stack--l">
        <h2 id="browse-h" className="oak-heading-5 m0">
          Browse the unit sequence
        </h2>
        <ResultsBar />
        {/* Static at load — a live-region role would announce nothing and
            is dropped; the banner is plain informational content. */}
        <div className="oak-banner oak-banner--info">
          <span className="oak-icon--mask ic-info icon-s" aria-hidden="true" />
          <div>
            <strong>Updated for 2026.</strong> This unit was revised in line with the latest
            curriculum guidance.
          </div>
        </div>
        <TermLedger term="Autumn term" lessons={AUTUMN} />
        <TermLedger term="Spring term" lessons={SPRING} />
        <Pagination />
      </div>
    </section>
  );
}
