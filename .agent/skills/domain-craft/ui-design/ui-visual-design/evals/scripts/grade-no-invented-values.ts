/**
 * Script grader for the ui-visual-design eval suite — the non-render half.
 *
 *   pnpm exec tsx <this file> <artefact> [<artefact> ...]
 *
 * The skill decides emphasis, grouping, and affordance, and takes every
 * VALUE from the design system. An artefact carrying an invented value has
 * crossed into design-system-usage's territory.
 *
 * THREE INDEPENDENT ARMS, reported separately so a control can prove each
 * one alone. The earlier single-assertion version could not: its fixture
 * carried the same hex in both prose and fenced CSS, so either detector
 * could have broken silently while the other kept the fixture red.
 *
 *   no-invented-values-in-authored-css
 *       Authored CSS — <style> blocks, style= attributes, fenced ```css —
 *       run through the estate's own classifier so the eval and the repo
 *       gate cannot drift apart on what counts as a literal.
 *
 *   no-invented-values-in-prose
 *       Bare hexes and non-system durations stated in prose. Every
 *       authored-CSS form is STRIPPED from the prose input first, so this
 *       arm sees only what the response says in its own voice.
 *
 *   no-bespoke-size-proposals
 *       Sizes are the arm the first version lacked entirely: a critique
 *       could replace every problematic size with another invented literal
 *       and still grade green. Detection is CONTEXT-AWARE, because a
 *       blanket number scan would reject legitimate references — quoting
 *       the artefact under critique ("the 32px height"), or citing Oak's
 *       own documented values. A size counts as PROPOSED only when
 *       prescriptive language introduces it AND it is not a documented
 *       value.
 *
 * Exits non-zero if any arm fails.
 */
import { readFileSync } from 'node:fs';

import { findLiteralDesignValues } from '../../../../../../../demos/oak-design-showcase/tools/css-literal-values.js';

/**
 * Values the estate documents, which a response may name freely: Oak's
 * target floor, the WCAG AA target minimum, the motif border, the press
 * translate, the motion durations, and the measure bounds.
 *
 * Provenance, per value:
 * - `44px` — `packages/design/oak-design-system/colors_and_type.css:247`
 *   (`--size-target-min`), Oak's house target floor.
 * - `24px` — WCAG SC 2.5.8's own threshold (24×24 CSS pixels), NOT a
 *   design-system value.
 * - `2px` / `3px` — the motif border weights
 *   (`colors_and_type.css:153-154`, `--border-solid-m`/`--border-solid-l`)
 *   and the +2/+2 press translate the motif pairs with them.
 * - `120ms` — `colors_and_type.css:261` (`--motion-quick-full`).
 * - `200ms` — `colors_and_type.css:262` (`--motion-base-full`).
 * - `45` / `75` — this skill's own measure doctrine (45–75 characters a
 *   line for continuous prose), NOT design-system values.
 *
 * This set is a hand-carried projection of those sources. Extraction to a
 * design-system-owned machine-readable source routes to WS8-general with
 * the eval runner; it is deliberately not built here.
 */
const DOCUMENTED_VALUES = new Set([
  '44px',
  '24px',
  '2px',
  '3px',
  '120ms',
  '200ms',
  '45',
  '75',
]);

/**
 * Prescriptive lead-ins: the response proposing a value of its own. Word
 * alternatives are anchored with `\b` on both sides — unanchored, "because"
 * and "paused" matched as `use`, "offset" as `set`, and "entry" as `try`,
 * flagging quotes and citations as proposals. The arrow forms sit outside
 * the anchors because `\b` needs a word character beside it.
 */
const PROPOSAL_LEAD = String.raw`(?:\b(?:use|set|make it|change (?:it )?to|increase (?:it )?to|bump (?:it )?to|raise (?:it )?to|at least|should be|needs to be|try|replace (?:it )?with|recommend)\b|→|->)`;

/**
 * Trailing prescriptive forms: the value stated first, the prescription
 * after it. The lead-in test alone missed "48px would work better", "I
 * would go with 48px instead", and "A larger 48px target is the right
 * call" ("I recommend 48px" is the lead-in direction, covered by
 * `recommend` in {@link PROPOSAL_LEAD}).
 */
const PROPOSAL_TRAIL = String.raw`(?:would work|would be better|is the right|instead|recommend)`;

function authoredCssParts(text: string): readonly string[] {
  const parts: string[] = [];
  for (const style of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) parts.push(style[1]);
  for (const inline of text.matchAll(/style\s*=\s*["']([^"']*)["']/g))
    parts.push(`.inline-style-attribute { ${inline[1]} }`);
  for (const fence of text.matchAll(/```(?:css|CSS)\s*\n([\s\S]*?)```/g)) parts.push(fence[1]);
  return parts;
}

/** The response in its own voice: every authored-CSS form removed. */
function proseOnly(text: string): string {
  return text
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/```(?:css|CSS)\s*\n[\s\S]*?```/g, ' ')
    .replace(/style\s*=\s*["'][^"']*["']/g, ' ');
}

/**
 * Bare hexes, and durations the response PROPOSES.
 *
 * A hex in prose is always an invention — there is no legitimate reason to
 * state one. A duration is different: a critique must be able to quote the
 * artefact it is judging ("the 600ms fade is too slow") without being
 * scored as having invented it, so durations use the same proposal test as
 * sizes.
 */
function proseLiterals(prose: string): readonly string[] {
  const withoutTokens = prose.replace(/var\(--[a-z0-9-]+\)/gi, ' ');
  const hits: string[] = [];
  for (const m of withoutTokens.matchAll(/#[0-9a-f]{3,8}\b/gi)) hits.push(m[0]);
  hits.push(...proposedValues(withoutTokens, String.raw`(\d+)\s?(ms)`));
  return hits;
}

/** Sizes the response PROPOSES, as distinct from sizes it quotes or cites. */
function bespokeSizeProposals(prose: string): readonly string[] {
  return proposedValues(prose, String.raw`(\d+(?:\.\d+)?)\s?(px|rem|em)`);
}

/**
 * Values introduced by prescriptive language and not in the documented set.
 *
 * The context test is what keeps this from being a blanket number scan,
 * which would reject a critique for quoting the very values it is
 * criticising — the `legitimate-references-positive` control pins that.
 * Prescription runs in both directions: a lead-in before the value ("use
 * 48px") and a trailing form after it ("48px would work better") — the
 * `size-proposal-forms-negative` control pins the second direction.
 */
function proposedValues(prose: string, valuePattern: string): readonly string[] {
  // The gap admits newlines: real prose wraps, and a gap pattern that
  // excluded them silently missed "set the control height to\n48px" — the
  // size-only control caught it.
  const leadPattern = new RegExp(`${PROPOSAL_LEAD}[^.;]{0,40}?\\b${valuePattern}\\b`, 'gi');
  const trailPattern = new RegExp(`\\b${valuePattern}\\b[^.;]{0,40}?\\b${PROPOSAL_TRAIL}\\b`, 'gi');
  const hits: string[] = [];
  for (const pattern of [leadPattern, trailPattern]) {
    for (const m of prose.matchAll(pattern)) {
      if (DOCUMENTED_VALUES.has(`${m[1]}${m[2]}`)) continue;
      hits.push(m[0].replace(/\s+/g, ' ').trim());
    }
  }
  return hits;
}

const artefacts = process.argv.slice(2);
if (artefacts.length === 0) {
  console.error('usage: grade-no-invented-values.ts <artefact> [<artefact> ...]');
  process.exit(2);
}

let anyFailed = false;
for (const artefact of artefacts) {
  const text = readFileSync(artefact, 'utf8');
  const css = authoredCssParts(text).join('\n');
  const cssLiterals = css.trim() === '' ? [] : findLiteralDesignValues(css);
  const prose = proseOnly(text);
  const proseHits = proseLiterals(prose);
  const sizeHits = bespokeSizeProposals(prose);

  const assertions = {
    'no-invented-values-in-authored-css': {
      pass: cssLiterals.length === 0,
      evidence:
        cssLiterals.length === 0
          ? css.trim() === ''
            ? 'no authored CSS'
            : 'authored CSS carries no literal design value'
          : `${cssLiterals.length}: ${cssLiterals.map((l) => l.value).slice(0, 6).join(', ')}`,
    },
    'no-invented-values-in-prose': {
      pass: proseHits.length === 0,
      evidence:
        proseHits.length === 0
          ? 'prose states no bare hex or non-system duration'
          : `${proseHits.length}: ${proseHits.slice(0, 6).join(', ')}`,
    },
    'no-bespoke-size-proposals': {
      pass: sizeHits.length === 0,
      evidence:
        sizeHits.length === 0
          ? 'no size proposed outside the documented values'
          : `${sizeHits.length}: ${sizeHits.slice(0, 4).join(' | ')}`,
    },
  };

  if (Object.values(assertions).some((a) => !a.pass)) anyFailed = true;
  console.log(JSON.stringify({ artefact, assertions }, null, 2));
}
process.exit(anyFailed ? 1 : 0);
