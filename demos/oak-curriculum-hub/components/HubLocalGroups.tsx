import Link from 'next/link';
import type { ReactElement } from 'react';

import type { CourseHit, StandardHit } from '@/lib/hub-search';

export const mutedClass = 'text-[14px] text-ink-subdued';

/** Cream notice card for search states that need a sentence, not a result list.
 *  Shared by the hub's live group and the /curriculum showcase. */
export function Notice({
  title,
  body,
}: {
  readonly title: string;
  readonly body: string;
}): ReactElement {
  return (
    <div className="max-w-[560px] rounded-[10px] border-2 border-l-[6px] border-line bg-accent-subtle-brand px-[18px] py-4">
      <div className="mb-1 text-base font-semibold leading-tight">{title}</div>
      <div className="text-sm leading-[1.55] text-ink-subdued">{body}</div>
    </div>
  );
}

/** A clickable result row: a line-bordered surface-role pill with an accent hover shadow, matching the
 *  card affordance elsewhere on the hub. Used by both local-search groups below. */
const rowLinkClass =
  'flex items-center gap-3 rounded-xl border-2 border-line bg-surface px-4 py-3 text-ink no-underline transition-shadow hover:shadow-accent-brand';

/** Tinted section header (placeholder icon tile until Oak section glyphs land), with an
 *  optional live badge + subtitle. Shared by the local groups here and the live curriculum
 *  group in HubResults (one-way import: HubResults consumes this module). */
export function GroupHeader({
  title,
  tint,
  live = false,
  subtitle,
}: {
  readonly title: string;
  readonly tint: string;
  readonly live?: boolean;
  readonly subtitle?: string;
}): ReactElement {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2.5">
      <span className={`h-8 w-8 shrink-0 rounded-card border-2 border-line ${tint}`} aria-hidden />
      <h3 className="text-lg font-semibold leading-none">{title}</h3>
      {live && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
          {/* explicit expression: no whitespace text-node ambiguity beside the dot */}
          {'Live'}
        </span>
      )}
      {subtitle !== undefined && <span className={mutedClass}>{subtitle}</span>}
    </div>
  );
}

/** Local "In the training courses" group: bundled course sections matched via `searchHub`, each
 *  deep-linking into the course player. Exported for component tests. */
export function TrainingGroup({ hits }: { readonly hits: readonly CourseHit[] }): ReactElement {
  return (
    <section>
      <GroupHeader title="In the training courses" tint="bg-decorative-2" />
      {hits.length === 0 ? (
        <p className={mutedClass}>No matching training courses.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {hits.map((h) => (
            <Link key={h.href} href={h.href} className={rowLinkClass}>
              <span className="flex-1 text-[14px] font-semibold leading-snug">{h.title}</span>
              <span className="shrink-0 text-[12px] font-bold uppercase tracking-wide text-ink-subdued">
                {h.module}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

/** Local "Quality standards" group: bundled standards matched via `searchHub`, each deep-linking to
 *  `/standards#qs=<id>` (the same focus mode Course callouts target). Exported for component tests. */
export function StandardsGroup({ hits }: { readonly hits: readonly StandardHit[] }): ReactElement {
  return (
    <section>
      <GroupHeader title="Quality standards" tint="bg-decorative-3" />
      {hits.length === 0 ? (
        <p className={mutedClass}>No matching quality standards.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {hits.map((h) => (
            <Link key={h.id} href={h.href} className={rowLinkClass}>
              <span className="shrink-0 rounded-ctl border border-link px-2 py-0.5 text-[11px] font-bold text-link">
                {h.id}
              </span>
              <span className="flex-1 text-[14px] leading-snug">{h.text}</span>
              {h.area !== '' && (
                <span className="shrink-0 rounded-full border border-line-soft px-2.5 py-1 text-[11px] font-bold text-ink-subdued">
                  {h.area}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
