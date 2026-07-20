import type { ReactElement } from 'react';
import { highlightToNodes } from '@/components/highlight-marks';
import type { Hit } from '@/lib/search-client';
import { subjectName, subjectBg, keyStageLabel } from './subjects';

// Static chip shape; the background colour is data-driven (subjects.ts owns the
// per-subject pastel palette), so it stays an inline style on the element.
const chipClass =
  'inline-flex items-center rounded-full border-2 border-line px-2.5 py-[5px] text-[11px] font-bold text-ink';
const ksChipClass =
  'inline-flex items-center rounded-full border border-line-soft px-[9px] py-[5px] text-[11px] font-bold text-ink-subdued';

// The static card frame; the interactive variant below adds Oak's signature
// interaction — a lemon offset shadow that widens on hover and collapses as
// the card translates +2/+2 on press.
const cardFrameClass = 'flex text-ink border-2 border-line bg-surface shadow-accent-brand';
const lemonCardClass =
  `${cardFrameClass} no-underline ` +
  'transition-[box-shadow,transform] duration-150 hover:shadow-accent-wide-brand ' +
  'active:translate-x-0.5 active:translate-y-0.5 active:shadow-none';

const lessonCardLayoutClass = 'flex-col gap-[9px] rounded-xl px-[17px] py-[15px]';

// Lesson and unit hits share the thread cards' url contract: `safeUrl` maps a
// malformed or poisoned index url to '', so an empty url renders a non-link
// card (no hover affordance, no CTA) rather than an <a href=""> that
// navigates nowhere.
export function LessonCard({ hit }: { readonly hit: Hit }): ReactElement {
  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-[7px]">
        {hit.subjectSlug && (
          <span className={chipClass} style={{ backgroundColor: subjectBg(hit.subjectSlug) }}>
            {subjectName(hit.subjectSlug)}
          </span>
        )}
        {hit.keyStage && (
          <span className={ksChipClass}>
            {keyStageLabel(hit.keyStage)}
            {hit.years?.length ? ` · Year ${hit.years.join(', ')}` : ''}
          </span>
        )}
      </div>
      <span className="text-base font-semibold leading-[22px]">{hit.title}</span>
      {hit.unitTitle && (
        <span className="text-[13px] font-light leading-[18px] text-ink-subdued">
          Unit: {hit.unitTitle}
        </span>
      )}
      {hit.snippet && (
        <span className="text-[13px] font-light leading-[18px] text-ink-subdued">
          {/* Only the ES highlighter's <em> pair is interpreted (as <mark>); any other
              markup in the API fragment stays literal text — never raw HTML injection. */}
          {highlightToNodes(hit.snippet)}
        </span>
      )}
    </>
  );
  return hit.url ? (
    <a
      href={hit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${lemonCardClass} ${lessonCardLayoutClass}`}
    >
      {inner}
      <span className="mt-0.5 text-[13px] font-bold text-link">Open lesson on Oak ↗</span>
    </a>
  ) : (
    <div className={`${cardFrameClass} ${lessonCardLayoutClass}`}>{inner}</div>
  );
}

const unitCardLayoutClass = 'items-center gap-[14px] rounded-xl px-[18px] py-[14px]';

export function UnitCard({ hit }: { readonly hit: Hit }): ReactElement {
  const inner = (
    <>
      {hit.subjectSlug && (
        <span className={chipClass} style={{ backgroundColor: subjectBg(hit.subjectSlug) }}>
          {subjectName(hit.subjectSlug)}
        </span>
      )}
      <span className="flex-1 text-base font-semibold leading-[22px]">{hit.title}</span>
      {typeof hit.lessonCount === 'number' && (
        <span className={`${ksChipClass} flex-none`}>{hit.lessonCount} lessons</span>
      )}
    </>
  );
  return hit.url ? (
    <a
      href={hit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${lemonCardClass} ${unitCardLayoutClass}`}
    >
      {inner}
      <span className="flex-none text-[13px] font-bold text-link">↗</span>
    </a>
  ) : (
    <div className={`${cardFrameClass} ${unitCardLayoutClass}`}>{inner}</div>
  );
}

// Threads frequently have no canonical url (the live contract: thread url is often ""),
// so render a non-link chip in that case rather than an <a> pointing nowhere.
const threadChipClass =
  'inline-flex items-center gap-2.5 rounded-full border-2 border-line bg-decorative-4-subtle px-4 py-[9px] text-ink shadow-neutral-brand';

export function ThreadCard({ hit }: { readonly hit: Hit }): ReactElement {
  const inner = (
    <>
      <span className="text-[15px] font-semibold leading-none">{hit.title}</span>
      {typeof hit.unitCount === 'number' && (
        <span className="text-xs font-bold text-ink-subdued">{hit.unitCount} units</span>
      )}
    </>
  );
  return hit.url ? (
    <a
      href={hit.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${threadChipClass} no-underline transition-transform duration-150 active:translate-x-0.5 active:translate-y-0.5`}
    >
      {inner}
    </a>
  ) : (
    <span className={threadChipClass}>{inner}</span>
  );
}
