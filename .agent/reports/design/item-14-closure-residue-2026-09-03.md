# Item-14 closure residue (design-system-completion, ruled 2026-09-03)

Companion to the ruling recorded at `design-system-completion` W0.2(b) and §Decision log
(commit 0274984f6, on main at ec7cb3fa8). The plan carries the decision and the delivery slice;
this report carries the enumeration and the check's mechanism, computed at 0274984f6 by the
design-system-expert pass (`item14-lenses`) that resolved the gate. File under study:
`packages/design/oak-design-system/colors_and_type.css`; line numbers are the root declaration
of each frozen property; `<-` names the overridden input it freezes on.

## The invariant and the check

The design system's standing rule (`packages/design/oak-design-system/DECISIONS.md`, 2026-07-26):
a custom property that composes other custom properties must be re-declared wherever its inputs
are overridden — `var()` resolves at computed-value time, before inheritance (W3C CSS Custom
Properties L1 §2.3, §3), so overriding an input alone never reaches a property composed above it.

Closure is a checked property of the token surface: for every theme scope, the set of
root-declared properties that transitively reference an overridden property and are not
re-declared in that scope is empty. Emit-or-fail over whatever theme blocks exist.

## Frozen sets at 0274984f6

### high-contrast — 35 (scope `[data-theme='high-contrast']`, lines 655–741)

| Property | Root line | Freezes on |
| --- | --- | --- |
| `--bg-selected` | 352 | `--color-accent-subtle` (overridden at 699) |
| `--border-accent` | 351 | `--color-accent` |
| `--state-selected` | 358 | `--color-accent` (inside `color-mix()`) |
| `--shadow-accent` | 405 | `--color-accent` |
| `--shadow-accent-raised` | 406 | `--color-accent` |
| `--shadow-accent-display` | 407 | `--color-accent` |
| `--shadow-accent-ring` | 408 | `--color-accent` |
| `--shadow-accent-pressed` | 409 | `--color-accent` |
| `--shadow-neutral` | 416 | `--shadow-ground` |
| `--shadow-neutral-ring` | 417 | `--shadow-ground` |
| `--shadow-lemon` | 603 | `--shadow-accent` (depth 2) |
| `--shadow-wide-lemon` | 604 | `--shadow-accent-raised` (depth 2) |
| `--shadow-slide-lemon` | 605 | `--shadow-accent-display` (depth 2) |
| `--shadow-centered-lemon` | 606 | `--shadow-accent-ring` (depth 2) |
| `--shadow-lemon-flat` | 607 | `--shadow-accent-pressed` (depth 2) |
| `--shadow-grey` | 608 | `--shadow-neutral` (depth 2) |
| `--shadow-centered-grey` | 609 | `--shadow-neutral-ring` (depth 2) |
| `--surface-mint`, `-soft`, `-subtle` | 584–586 | `--surface-decorative-1` forms |
| `--surface-aqua`, `-soft`, `-subtle` | 587–589 | `--surface-decorative-2` forms |
| `--surface-lavender`, `-soft`, `-subtle` | 590–592 | `--surface-decorative-3` forms |
| `--surface-pink`, `-soft`, `-subtle` | 593–595 | `--surface-decorative-4` forms |
| `--surface-lemon`, `-soft`, `-subtle` | 596–598 | `--surface-decorative-5` forms |
| `--surface-amber`, `--surface-amber-subtle` | 599, 601 | `--surface-decorative-6`, `-subtle` |
| `--surface-red-subtle` | 602 | `--bg-error-subtle` — accessibility-class, FIX |

Ten of the 35 are canonical roles, not dialect aliases: `--bg-selected`, `--border-accent`,
`--state-selected`, the five `--shadow-accent-*`, `--shadow-neutral`, `--shadow-neutral-ring`.

### colour-safe — 13 (scope `[data-theme='colour-safe']`, lines 747–783)

`--surface-{mint,aqua,lavender,pink}` with their `-soft` and `-subtle` forms (12, lines 584–595)
on `--surface-decorative-{1,2,3,4}` forms; `--surface-red-subtle` (602) on `--bg-error-subtle`.

### dark / system — 0

`[data-theme='dark']` overrides only `--filter-icon`, `--filter-icon-inverted` and
`--filter-icon-on-btn-primary` (637–650); no root property references them.

## Evidence anchors

- Shipped component: `packages/design/oak-design-system/components.css:774-776`,
  `.oak-quiz-answer--selected { background: var(--bg-selected); }` — the freeze is reachable by kit
  class, not consumer authoring. Also `components.css:1092-1096` (high-contrast `.oak-tag`, `.oak-chip`).
- The two hand re-declarations already in the high-contrast block: `colors_and_type.css:720-722`
  (`--surface-decorative-6-soft`, comment: "re-declared: a :root alias freezes at its :root-resolved
  value inside SUBTREE theme scopes") and `:723-725` (`--surface-amber-soft`).
- `DECISIONS.md:155` (a measured 1.27:1 focus indicator, the founding instance of the rule) and
  `:157` (the rule). `KNOWN-ISSUES.md:21` (item 14), `:17` (item 12's RESOLVED shape), `:19` (item 13).

## Mechanism for the check (the delivery slice at W0.2(b))

- **Inputs, both derived by scan, never hand-listed.** (A) the root map: the union of every
  `:root {` block in the sheet (several exist; the alias block near 583 is one), property name to
  raw declared value; (B) the per-scope override set: the declared property names of each theme
  block, keyed by scope selector. The axis block set is an input, never a parameter of the
  ruling, so the check survives W2.4's re-architecture unchanged.
- **Traversal: a fixpoint, not a single pass.** Seed `tainted` with the override set; repeat until
  no change: for each root property not overridden and not yet frozen, if any `var()` reference
  in its raw value is in `tainted`, mark it frozen and add it to `tainted`. A single pass
  under-reports (28 instead of 35 in high-contrast: the seven shadow dialect aliases taint at
  depth 2). `var()` extraction must reach identifiers nested inside `light-dark()`,
  `color-mix()` and multi-value shadow lists.
- **Emit shape.** Per scope, the frozen set; per member, the declaration line and the full taint
  chain to the overridden root cause, so a failure names the cure site. Green is an empty set per
  scope. Never assert a count: a re-declaration and a new violation would cancel.
- **Red proof.** Delete one existing re-declaration (for example `--surface-amber-soft` at
  723–725); the scope's set must become exactly that member with the chain
  `<- --surface-decorative-6-soft`; restore, and the set is empty again.
- **Placement.** The kit has no CSS validator today (its test script is vitest over TypeScript;
  `src/` holds `oak-theme.ts` and two integration tests), so the check is a new surface, not an
  extension. It runs on the hand-authored sheet now and on the W2.2 emitter's output later; both
  are CSS text. Use a real CSS parser; the pass that produced these numbers used regular
  expressions over the text.

## Open points the ruling does not settle

1. **Not rendered.** The runtime claim rests on the specification and `DECISIONS.md:155`.
   Falsifier: render `<div data-theme="high-contrast">` containing `.oak-quiz-answer--selected`
   and read the computed background; white falsifies the claim.
2. **Scan scope.** `colors_and_type.css` only. `brand.css` and the identity sheets may declare
   further composed `:root` properties; those add to the sets above.
3. **Colour-safe decoratives 5 and 6** (adjacent, not part of the ruling). Lines 770–781 flatten
   decoratives 1–4 to grey while the comment at 763 states the decorative surfaces go neutral per
   the owner ruling of 2026-08-10; lemon (5) and amber (6) keep full hue at root in colour-safe
   (landed 02c9dde7c). Deliberate or not is undetermined. A role-completeness question for
   W0.2(b): complete the flatten or record the exclusion. The closure check does not catch it,
   because colour-safe does not override those roles' inputs.
4. **Contrast unmeasured.** No ratios were computed for any frozen pairing; the accessibility-class
   call on `--surface-red-subtle` rests on meaning (an un-remapped red on an error surface in the
   colour-vision theme), not on a ratio.
5. **The check's own falsifier.** A theme scope where a non-empty closure is correct by design
   would break empty-as-invariant. None exists in the current four scopes; re-test after W2.4
   multiplies them.
