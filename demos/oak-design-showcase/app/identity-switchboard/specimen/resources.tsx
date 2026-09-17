/**
 * The downloads band: three resource card-links on the kit grid, then the
 * lesson-breakdown table. Card and table content is typed data mapped to
 * components, never repeated markup.
 */

interface ResourceCard {
  readonly title: string;
  readonly description: string;
  readonly file: string;
  readonly cardClass: string;
}

const RESOURCE_CARDS: readonly ResourceCard[] = [
  {
    title: 'Worksheet pack',
    description: 'Printable A4, answers included.',
    file: 'PDF · 1.2 MB',
    cardClass: 'oak-card oak-card--mint oak-stack res-card',
  },
  {
    title: 'Slide deck',
    description: 'Editable, projector-safe, 1920×1080.',
    file: 'PPTX · 3.4 MB',
    cardClass: 'oak-card oak-stack res-card',
  },
  {
    title: 'Knowledge organiser',
    description: 'One page: keywords, diagram, key learning points.',
    file: 'PDF · 640 KB',
    cardClass: 'oak-card oak-card--flat oak-card--lemon oak-stack res-card',
  },
];

interface BreakdownRow {
  readonly number: number;
  readonly lesson: string;
  readonly length: string;
  readonly worksheet: string;
  readonly quiz: string;
}

const BREAKDOWN: readonly BreakdownRow[] = [
  { number: 1, lesson: 'Where does a puddle go?', length: '45 min', worksheet: 'Yes', quiz: 'Yes' },
  { number: 2, lesson: 'The window that cried', length: '45 min', worksheet: 'Yes', quiz: 'Yes' },
  { number: 3, lesson: 'Clouds are not smoke', length: '60 min', worksheet: 'Yes', quiz: 'No' },
  {
    number: 4,
    lesson: 'When rain becomes a river',
    length: '60 min',
    worksheet: 'No',
    quiz: 'Yes',
  },
];

/** SC 1.4.10 excepts a data table from reflow only when it scrolls in
 *  its OWN container — and a scrollable region must be reachable by
 *  keyboard with an accessible name (the axe finding that shaped this).
 *  A named <section> carries the region role natively; tabIndex stays
 *  because WCAG 2.1.1 requires the scroll container focusable — the
 *  known static-analysis tension for scrollable regions. */
function BreakdownTable(): React.JSX.Element {
  return (
    <section className="table-scroll" aria-label="Lesson breakdown" tabIndex={0}>
      <table className="oak-table">
        <caption className="oak-heading-6">Lesson breakdown</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Lesson</th>
            <th scope="col">Length</th>
            <th scope="col">Worksheet</th>
            <th scope="col">Quiz</th>
          </tr>
        </thead>
        <tbody>
          {BREAKDOWN.map((row) => (
            <tr key={row.number}>
              <td>{row.number}</td>
              <td>{row.lesson}</td>
              <td>{row.length}</td>
              <td>{row.worksheet}</td>
              <td>{row.quiz}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function ResourcesRegion(): React.JSX.Element {
  return (
    <section
      id="resources"
      className="oak-region oak-band band-pad"
      data-region="resources"
      aria-labelledby="res-h"
    >
      <div className="oak-container oak-stack oak-stack--l res-inner">
        <h2 id="res-h" className="oak-heading-5">
          Downloads and resources
        </h2>
        <div className="oak-grid">
          {RESOURCE_CARDS.map((card) => (
            <a key={card.title} className="oak-card-link" href="#resources">
              <div className={card.cardClass}>
                <h3 className="oak-heading-6">{card.title}</h3>
                <p className="oak-body-2">{card.description}</p>
                <span className="oak-tag oak-tag--white">{card.file}</span>
              </div>
            </a>
          ))}
        </div>
        <BreakdownTable />
      </div>
    </section>
  );
}
