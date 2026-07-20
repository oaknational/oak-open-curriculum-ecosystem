import type { ReactElement } from 'react';

import { FRAMEWORK_STAGES, type FrameworkStage } from './stages';
import { chevronPath, polar } from './framework-animation';

// Ring geometry (screen space): the export's 300° C-ring — "Fit it" at top-left round to "Check it"
// at the left, with an open gap at the top-left.
const RING_START = -150;
const RING_ARC = 300;
const SEG = RING_ARC / FRAMEWORK_STAGES.length;
const GAP = 2.5;
const CENTER = 250;
const INNER_R = 118;
const OUTER_R = 232;

/**
 * The seven-stage ring diagram. Decorative: the ordered stage list below conveys the content to AT.
 * When `activeStage` is set, the non-active segments dim so the active stage reads as highlighted
 * during the walk-through; when unset (the static baseline) every segment is at full strength.
 */
function RingDiagram({ activeStage }: { readonly activeStage?: number }): ReactElement {
  return (
    <svg viewBox="0 0 500 500" className="mx-auto h-auto w-full max-w-[420px]" aria-hidden="true">
      {FRAMEWORK_STAGES.map((stage, index) => {
        const startDeg = RING_START + index * SEG;
        const endDeg = startDeg + SEG - GAP;
        const midDeg = startDeg + (SEG - GAP) / 2;
        const d = chevronPath({
          cx: CENTER,
          cy: CENTER,
          innerR: INNER_R,
          outerR: OUTER_R,
          startDeg,
          endDeg,
          pointDeg: SEG * 0.42,
        });
        const [labelX, labelY] = polar(CENTER, CENTER, (INNER_R + OUTER_R) / 2, midDeg);
        const dim = activeStage !== undefined && activeStage !== index;
        return (
          <g key={stage.n} style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 300ms ease' }}>
            <path d={d} fill={stage.color} stroke="#ffffff" strokeWidth={5} />
            <text
              x={labelX}
              y={labelY}
              fill={stage.ink}
              fontFamily="Lexend, sans-serif"
              fontWeight={700}
              fontSize={22}
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${midDeg + 90} ${labelX} ${labelY})`}
            >
              {stage.key}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** One stage as an accessible card: number badge, name, phase, summary, fuller text, and features. */
function StageCard({
  stage,
  active,
}: {
  readonly stage: FrameworkStage;
  readonly active: boolean;
}): ReactElement {
  const emphasis = active ? 'ring-2 ring-line shadow-accent-brand' : '';
  return (
    <li className={`rounded-xl border-2 border-line bg-surface p-5 transition-shadow ${emphasis}`}>
      <div className="mb-2 flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-line text-[15px] font-bold"
          style={{ backgroundColor: stage.color, color: stage.ink }}
          aria-hidden="true"
        >
          {stage.n}
        </span>
        <h3 className="text-lg font-semibold leading-none">{stage.key}</h3>
        <span className="ml-auto rounded-full border border-line-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-subdued">
          {stage.phase}
        </span>
      </div>
      <p className="mb-2 text-[15px] font-semibold leading-snug">{stage.desc}</p>
      <p className="mb-3 text-[14px] leading-relaxed text-ink-subdued">{stage.long}</p>
      <ul className="flex flex-col gap-1.5">
        {stage.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[13px] text-ink">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success"
            />
            {feature}
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * The learning framework rendered without motion: the seven-stage ring diagram plus the seven stages
 * as an ordered, fully accessible list. This is the SSR / no-JS baseline and the
 * `prefers-reduced-motion` fallback. The animated client island renders this same component with a
 * stepping `activeStage` to walk through the stages when motion is allowed.
 */
export function LearningFrameworkStatic({
  activeStage,
}: {
  readonly activeStage?: number;
}): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      <RingDiagram activeStage={activeStage} />
      <ol aria-label="The seven stages" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FRAMEWORK_STAGES.map((stage, index) => (
          <StageCard key={stage.n} stage={stage} active={activeStage === index} />
        ))}
      </ol>
    </div>
  );
}
