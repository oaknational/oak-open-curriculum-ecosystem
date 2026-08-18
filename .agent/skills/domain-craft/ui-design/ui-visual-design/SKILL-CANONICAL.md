---
name: ui-visual-design
classification: active
concern: domain-craft
domain: ui-design
description: >-
  Exercise UX craft judgment on a screen or artefact — visual hierarchy,
  layout, spacing, type, and interaction behaviour — deciding what should be
  loudest, how the eye should travel, and what an element must do when
  touched. Use when a surface is being composed or critiqued and the question
  is whether it reads and behaves well, not which class or token to type. Do
  not use it to pick tokens, classes, or components (design-system-usage owns
  that), to judge conformance against WCAG success criteria (the
  accessibility-expert reviewer owns that), or to invent visual values — every
  value this skill reaches for comes from the design system, never from taste.
---

# UI visual design

Judgment, not values. The Oak Open Curriculum Design System already decides
what a colour, a step of the type scale, or a spacing unit *is*; this skill
decides what a screen should **emphasise, group, sequence, and afford**. When
a decision here needs a value, take it from the system —
`design-system-usage` is the skill that finds it. Inventing a value is the
failure mode, not the craft.

## The one question

**What is this screen for, and what must the reader do next?** Every
judgment below is downstream of that. A screen that looks handsome and
leaves the next action ambiguous has failed; a plain screen whose next action
is unmistakable has succeeded.

## Hierarchy

One primary element per view. Rank everything else beneath it, and make the
ranking visible through **size, weight, and space before colour** — colour is
the least reliable channel (it fails in bright classrooms, on cheap
projectors, and for colour-vision differences, and the system's access themes
exist precisely because that is ordinary here). Two elements competing for
primacy is the most common defect: resolve it by demoting one, never by
amplifying both.

**Semantic level and visual step are chosen independently.** `h1`–`h6` is
document structure: it follows the outline, descends without skips, and is
what assistive technology navigates by. `oak-heading-1…7` is visual
hierarchy: it follows how loud this text should be on this screen. They are
two separate decisions, and Oak pairs them deliberately across the ramp —
`<h1 class="oak-heading-2">` is the documented masthead pairing, and
specimens carry `<h3 class="oak-heading-5">`. Pick the level from the
document's structure, pick the class from the screen's hierarchy, and
distort neither to reach the other: wanting a smaller step is not a reason
to demote a heading, and wanting a heading is not a reason to jump the ramp.

## Layout and grouping

- **Proximity is the strongest grouping signal.** Related things sit close;
  the gap between groups must exceed the gap within them. Where a layout
  reads as soup, the fix is almost always subtracting space inside a group
  and adding it between groups — not adding borders.
- **Alignment is a promise.** Every edge that can share an axis should. A
  stray indent reads as a hidden meaning that isn't there.
- **Repetition carries the system.** The same intent gets the same treatment
  on every screen. A one-off treatment must justify itself as a genuine
  difference in kind.
- **Vertical rhythm**: spacing steps come from the system's scale. Consistent
  rhythm is what makes a long page scannable; arbitrary gaps are what make it
  tiring.
- **Regions before boxes.** Page shells build on the region contract
  (`.oak-canvas` > `[data-region]` siblings, `data-page` on the canvas) — the
  structure carries the layout so a re-brand can recompose it. A wrapper
  column added for visual convenience breaks that.

## Type

Measure before beauty: 45–75 characters a line for continuous prose. Set the
scale from the system's classes and use as few steps as the content needs —
a page using six heading levels usually has a structure problem, not a type
problem. Line height rises as measure rises. Sentence case everywhere; title
case is not an emphasis tool here.

## Interaction

- **Every interactive element declares itself** before it is touched, and
  confirms itself when it is. The system's signature motif (thick border,
  offset shadow, hover widen, press collapse with a +2/+2 translate via
  `.oak-interactive`) is the estate's answer to both — use it rather than
  minting a new affordance vocabulary.
- **Target size and reach**: Oak's design-system floor is **≥44px**, and hit
  areas must match what looks clickable. A 12px icon inside a 44px target is
  fine; a 44px-looking control with a 12px target is a defect. Keep the
  conformance claim straight: WCAG 2.2 **AA** is
  [SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum) at 24×24
  CSS pixels (with its exceptions); 44×44 is
  [SC 2.5.5](https://www.w3.org/TR/WCAG22/#target-size-enhanced) at
  **AAA**. So a 32px target misses Oak's floor while still meeting AA on
  size — say that, and never call it an AA failure on size alone.
- **State is never colour alone** — pair it with shape, position, icon, or
  text. This is a design obligation, not only an accessibility one: it is what
  makes a state legible on a washed-out projector.
- **Motion is quiet and purposeful**: the system's 120/200ms, honouring
  reduced-motion. Motion earns its place by explaining a change of state or
  position; decoration does not qualify.
- **Focus is designed, not inherited.** Keyboard travel order should match
  the visual reading order; where it doesn't, the layout is wrong, not the
  tab order.

## Theming as a design constraint

Design for **five selections and four palette themes** (DDR-004): light,
dark, system, high-contrast, colour-safe, with `system` resolving rather than
carrying a tree of its own. A composition is not finished until it holds in
high-contrast and colour-safe — those are peers, not fallbacks. A design whose
meaning depends on a specific hue relationship will break in at least one of
them, which is the signal to carry that meaning some other way.

## Floors, not goals

Two floors, and they are not the same floor. **WCAG 2.2 AA** is the
conformance floor — contrast, focus visibility, no colour-only state, and
target size at [SC 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum)'s
24×24. **Oak's design-system floor sits above it** in places, most visibly
at ≥44px targets, which is AAA's
[SC 2.5.5](https://www.w3.org/TR/WCAG22/#target-size-enhanced) threshold
adopted as house standard because the audience is teachers on classroom
hardware. Say which floor a thing misses. Meeting either is not a design
achievement; falling below the AA one is a defect that stops the work.
Conformance *judgment* belongs to the accessibility reviewer; this skill's
obligation is to design so the question rarely arises.

## Critique

Reviewing a screen — your own or someone else's — runs the same order every
time: what is this for; where does the eye go first, and is that right; what
is grouped, and does the grouping match the meaning; what can be touched, and
does it say so; what breaks in the other three palette themes; what could be
removed. Removal comes last because it is the strongest move and the easiest
to overuse.

Depth on the reasoning behind these calls, and the failure shapes each one
prevents, is in [`references/craft-fundamentals.md`](references/craft-fundamentals.md).
