import type { ReactElement } from 'react';

/** The "linked quality standard" example card shown in the right panel — a pastel-blue
 *  callout that models how connected content links out across the hub. */
function LinkedStandardCard(): ReactElement {
  return (
    <div className="rounded-xl border-2 border-decorative-3 bg-decorative-3-subtle p-4">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-link">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
        Linked quality standard
      </div>
      <div className="mb-1 text-[15px] font-semibold leading-snug text-ink">
        Writing questions for checks for understanding
      </div>
      <span className="text-[13px] font-bold text-link">
        View the standard and exemplification &rarr;
      </span>
    </div>
  );
}

/**
 * The "Content that links to itself" feature block — static explainer prose from the
 * prototype (verified real DOM content, no data source). Two-column: a lavender explainer
 * panel and a surface-role panel modelling a linked-standard callout.
 */
export default function ContentLinks(): ReactElement {
  return (
    <section className="mx-auto max-w-[1080px] px-6 pb-16">
      <div className="grid overflow-hidden rounded-2xl border-2 border-line md:grid-cols-[1.4fr_1fr]">
        <div className="bg-decorative-3-subtle p-8">
          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-subdued">
            Everything&rsquo;s connected
          </div>
          <h2 className="mb-4 text-[26px] font-semibold leading-tight text-ink">
            Content that links to itself
          </h2>
          <p className="mb-3 max-w-[46ch] text-[15px] leading-relaxed text-ink">
            As you move through a training course, related guidance surfaces right where you need
            it. When a lesson touches a quality standard, you&rsquo;ll see a link straight to that
            standard and its exemplification &mdash; no hunting required.
          </p>
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink">
            Update a standard once, and every page that references it stays in step. One source of
            truth, joined up.
          </p>
        </div>
        <div className="border-t-2 border-line bg-surface p-8 md:border-l-2 md:border-t-0">
          <div className="mb-3 text-[13px] text-ink-subdued">
            In a training page, you&rsquo;ll see:
          </div>
          <LinkedStandardCard />
          <p className="mt-4 text-[13px] leading-relaxed text-ink-subdued">
            Pastel-blue boxes always signal a link out to a connected standard or exemplar.
          </p>
        </div>
      </div>
    </section>
  );
}
