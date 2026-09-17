/**
 * The lesson-detail region: media slot, lede, worked example, keyword
 * definitions, the assessment accordion, and the aside's three cards —
 * then the outcome/misconception band. The kit's block components carry
 * every voice (worked example, teacher tip, outcome, misconception); the
 * app adds layout only.
 */

function LessonArticle(): React.JSX.Element {
  return (
    <article className="oak-stack">
      <div className="media-slot" aria-hidden="true">
        <span>lesson video 16:9</span>
      </div>
      <p className="oak-body-1 lede">
        Pupils draw around a puddle with chalk, return at midday, and reason about the missing
        water. The lesson builds the word <strong>evaporation</strong> on top of what they already
        know about solids, liquids and gases.
      </p>
      <div className="oak-block oak-worked-example">
        <span className="oak-block-label">Worked example</span>
        <ol className="oak-body-2">
          <li>Draw around the puddle with chalk at 9am.</li>
          <li>Draw around it again at midday — the outline shrinks.</li>
          <li>The missing water went into the air as water vapour.</li>
        </ol>
      </div>
      <dl className="oak-keywords">
        <div className="oak-keyword">
          <dt>evaporate</dt>
          <dd>to turn from a liquid into a gas.</dd>
        </div>
        <div className="oak-keyword">
          <dt>water vapour</dt>
          <dd>water as a gas, spread out in the air.</dd>
        </div>
      </dl>
      <details className="oak-accordion">
        <summary>How is this lesson assessed?</summary>
        <div className="oak-accordion__body">
          A six-question exit quiz with distractors matched to the documented misconceptions.
          Answers download with the worksheet pack.
        </div>
      </details>
    </article>
  );
}

function LessonAside(): React.JSX.Element {
  return (
    <aside className="oak-stack" aria-label="Lesson resources">
      <div className="oak-card oak-stack aside-card">
        <h3 className="oak-heading-6">Next lesson</h3>
        <p className="oak-body-2">
          Condensation: the window that cried. 45 minutes, worksheet included.
        </p>
        <button className="oak-btn oak-btn--sm" type="button">
          Open lesson
        </button>
      </div>
      <div className="oak-block oak-teacher-tip">
        <span className="oak-block-label">Teacher tip</span>
        <p className="oak-body-2 tip-body">
          Cold call after the demonstration: &ldquo;Where has the water gone?&rdquo; Take three
          answers before revealing the chalk outlines.
        </p>
      </div>
      <div className="oak-card oak-card--flat oak-card--aqua oak-stack aside-card">
        <h3 className="oak-heading-6">Quiz bank</h3>
        <p className="oak-body-2">
          Ten questions with distractors that target the documented misconceptions.
        </p>
        <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button">
          Preview quiz
        </button>
      </div>
    </aside>
  );
}

export function DetailRegion(): React.JSX.Element {
  return (
    <section
      id="lesson"
      className="oak-region detail-pad"
      data-region="detail"
      aria-labelledby="lesson-h"
    >
      <h2 id="lesson-h" className="oak-heading-5 detail-h">
        Lesson 1 — where does a puddle go?
      </h2>
      <div className="oak-flow">
        <LessonArticle />
        <LessonAside />
        <div className="oak-band oak-flow-key band-pad">
          <div className="oak-block oak-outcome">
            <span className="oak-block-label">Pupil outcome</span>
            <p>I can describe how water evaporates from a puddle and where it goes.</p>
          </div>
          <div className="oak-block oak-misconception mis-block">
            <span className="oak-block-label">Misconception and common mistake</span>
            <p className="oak-body-2">
              <strong>&ldquo;The puddle soaks into the ground, so it&rsquo;s gone.&rdquo;</strong>{' '}
              Some soaks in — but the rest went into the air as water vapour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
