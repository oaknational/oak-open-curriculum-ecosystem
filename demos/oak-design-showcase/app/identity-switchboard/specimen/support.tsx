/**
 * The support region (FAQ) and the newsletter CTA band, plus the footer.
 *
 * The CTA deliberately has NO form element (same recorded divergence as
 * the facets): inside the picker's frame a submit would re-navigate the
 * frame and break the in-place re-skin's no-reload invariant. The email
 * field keeps its label; the button is inert until the flow is wired.
 */

interface Faq {
  readonly question: string;
  readonly answer: string;
}

const FAQS: readonly Faq[] = [
  {
    question: 'Can I edit the slides and worksheets?',
    answer:
      'Yes. Every resource downloads in an editable format — Word, PowerPoint, or the source files — so you can adapt them for your class.',
  },
  {
    question: 'Is this aligned to the national curriculum?',
    answer:
      'This unit maps to Key Stage 2 science, states of matter and the water cycle. The mapping is listed on each lesson page.',
  },
  {
    question: 'Do I need an account?',
    answer:
      "No account is needed to view or download. Signing in lets you save units and track which lessons you've used.",
  },
];

export function SupportRegion(): React.JSX.Element {
  return (
    <section
      id="support"
      className="oak-region support-pad"
      data-region="support"
      aria-labelledby="faq-h"
    >
      <h2 id="faq-h" className="oak-heading-5">
        Frequently asked questions
      </h2>
      <div className="oak-stack">
        {FAQS.map((faq) => (
          <details key={faq.question} className="oak-accordion">
            <summary>{faq.question}</summary>
            <div className="oak-accordion__body">{faq.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CtaRegion(): React.JSX.Element {
  return (
    <section className="oak-region oak-band band-pad" data-region="cta" aria-labelledby="nl-h">
      <div className="oak-container oak-flow cta-inner">
        <h2 id="nl-h" className="oak-flow-key oak-heading-4">
          Get new units in your inbox
        </h2>
        <p className="oak-flow-key oak-body-1 standfirst">
          One email a term. New units, revised lessons, and classroom-tested resources — no more
          than that.
        </p>
        <div className="oak-flow-key oak-cluster oak-cluster--s cta-form">
          <div className="oak-stack oak-stack--s cta-field">
            <label className="oak-body-2" htmlFor="email">
              Email address
            </label>
            <input className="oak-input" id="email" type="email" placeholder="you@school.sch.uk" />
          </div>
          <button className="oak-btn" type="button">
            Subscribe
          </button>
        </div>
        <label className="oak-flow-key oak-choice">
          <input className="oak-checkbox" type="checkbox" /> I&rsquo;m happy to receive the termly
          newsletter.
        </label>
      </div>
    </section>
  );
}
