import type { ReactElement } from 'react';

/** A single lesson keyword and its pupil-facing definition (C4 pedagogy seam). */
export interface LessonKeyword {
  keyword: string;
  description: string;
}

/**
 * Subject · key stage · unit kicker shown above the lesson title. Renders nothing when no
 * context is available (all fields absent) — the lesson view degrades cleanly to just the title.
 */
export function ContextStrip({
  subject,
  keyStage,
  unit,
}: {
  readonly subject: string | null;
  readonly keyStage: string | null;
  readonly unit: string | null;
}): ReactElement | null {
  const parts = [subject, keyStage, unit].filter((p): p is string => p !== null);
  if (parts.length === 0) {
    return null;
  }
  return (
    <p className="mt-[18px] flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold uppercase tracking-[0.05em] text-link">
      {parts.map((part, i) => (
        <span key={part} className="flex items-center gap-2">
          {part}
          {i < parts.length - 1 && (
            <span aria-hidden className="text-line-soft">
              /
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

/** The lesson's key learning points as a bulleted list. Rendered only when non-empty. */
export function KeyLearningPoints({
  points,
}: {
  readonly points: readonly string[];
}): ReactElement {
  return (
    <section className="mb-6">
      <h2 className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-ink-subdued">
        Key learning points
      </h2>
      <ul className="flex flex-col gap-2">
        {points.map((point) => (
          <li key={point} className="flex gap-2.5 text-[15px] font-light leading-relaxed text-ink">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-link" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The lesson's keyword glossary as a definition list. Rendered only when non-empty. */
export function Keywords({ items }: { readonly items: readonly LessonKeyword[] }): ReactElement {
  return (
    <section className="mb-6">
      <h2 className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-ink-subdued">
        Keywords
      </h2>
      <dl className="shadow-accent-brand flex flex-col gap-3 rounded-xl border-2 border-line bg-surface px-5 py-4">
        {items.map((k) => (
          <div key={k.keyword} className="flex flex-col gap-0.5">
            <dt className="text-[15px] font-semibold text-ink">{k.keyword}</dt>
            <dd className="m-0 text-[14px] font-light leading-relaxed text-ink-subdued">
              {k.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
