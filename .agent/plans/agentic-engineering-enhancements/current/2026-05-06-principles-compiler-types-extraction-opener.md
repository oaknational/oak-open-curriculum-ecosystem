---
name: "Next-session opener: extract Compiler Time Types from principles.md"
status: ready-for-pickup
created: 2026-05-06
authored_by: "Hidden Slipping Moth (claude-code, 4be7b5)"
thread: agentic-engineering-enhancements
target_session_state: "any session with <30% context budget at open"
---

# Opener: Extract §Compiler Time Types and Runtime Validation

## Why this is the next single-biggest-impact item

The strategic plan
[`principles-entrypoint-content-homing.plan.md`](../future/principles-entrypoint-content-homing.plan.md)
is decision-complete after Phase 0 landed the operationalisation
contract at
[`.agent/directives/operationalisation-contract.md`](../../../directives/operationalisation-contract.md).

Of the five strong-candidate extractions named in the plan's
Implementation Detail Note, **§Compiler Time Types and Runtime
Validation** (lines 361–409 of `principles.md`) is the single
biggest-impact item:

- **Largest single drain**: ~47 lines, 10 bullets, ~3000 chars.
- **Clearest existing target home**: `docs/governance/typescript-practice.md`
  is already cross-referenced from `principles.md` line 211 as the
  TSDoc / TypeScript-practice elaboration; the extraction extends a
  doc that is already designed for this content.
- **Most self-contained**: every bullet is about TypeScript usage; no
  tangle with adjacent principles. Most bullets already point to
  Level-2 rules in `.agent/rules/` (`unknown-is-type-destruction`,
  `strict-validation-at-boundary`, etc.) so the upward links largely
  exist already.
- **Least bidirectional-link risk**: type-system rules are stable;
  rename risk is low.
- **Best test case for the contract**: this extraction will exercise
  every part of the contract (Level 1 retention of WHY + pointer,
  Level 2 home, bidirectional traceability) without straying into
  ambiguous territory.

## Pre-conditions for the next session

- Context budget at session open ≤ 30% (this is directive-file work
  per `feedback_30_percent_context_for_directives`).
- `feat/eef_exploration` branch state is clean (or limited to known
  carry-over).
- Active claims registry is empty for the agentic-engineering-
  enhancements thread, OR Hidden Slipping Moth's session-close claim
  is properly archived.
- Reviewer dispatches recommended in the snagging plan
  (`fred`, `wilma`, `assumptions-reviewer`) have NOT yet been
  dispatched against the strategic plan; this opener does not block
  on them — they assess the *broader* plan; the single-extraction
  work is bounded enough to proceed without the architectural
  reviewer trio.

## The work

### Step 1 — Read the contract; align mental model

Read [`.agent/directives/operationalisation-contract.md`](../../../directives/operationalisation-contract.md)
in full. Verify the three-level mental model is internalised before
touching `principles.md`.

### Step 2 — Read both surfaces in full

- [`.agent/directives/principles.md`](../../../directives/principles.md)
  lines 361–409 specifically (the section being extracted).
- [`docs/governance/typescript-practice.md`](../../../../docs/governance/typescript-practice.md)
  in full (the receiving home; check for any existing duplication).

### Step 3 — Plan the extraction precisely

For each of the 10 bullets in §Compiler Time Types and Runtime
Validation:

| Bullet | Substance | Already in typescript-practice? | Action |
| --- | --- | --- | --- |
| No type widening or destruction | New section needed | Verify | Move full text |
| `unknown` is type destruction | Pointer + summary | Pointer exists at rule | Drop from principles; ensure pointer lives in TS practice |
| Preserve type information | New section needed | Verify | Move full text |
| Single source of truth for types | New section needed | Verify | Move full text |
| Use library types directly | New section needed | Verify | Move full text |
| Prefer library-native error/response | New section needed | Verify | Move full text |
| Validate external signals | Pointer + summary | Verify | Drop from principles; ensure pointer lives in TS practice |
| Type imports labelled with `type` | New section needed | Verify | Move full text |
| Don't use type aliases | New section needed | Verify | Move full text |
| Reviewer findings are action items | Possibly belongs elsewhere (process, not types) | Verify | Reassess: this may belong in development-practice.md or stay |

The bottom-row bullet ("Reviewer findings are action items by
default") is process discipline, not type-system. Flag for
relocation to development-practice.md (or retention in principles.md
under a different section).

### Step 4 — Stage 1: extend `typescript-practice.md`

Add a new section to `typescript-practice.md` titled "Compiler-time
Types and Runtime Validation" carrying the full substance of the
nine type-related bullets. Each bullet keeps its existing rule
pointer (`unknown-is-type-destruction`,
`strict-validation-at-boundary`, etc.). The new section MUST link
**upward** to the principle it operationalises (per the contract's
bidirectional traceability requirement).

### Step 5 — Stage 2: replace section in `principles.md`

Replace lines 361–409 of `principles.md` with a 3-line pointer:

```text
### Compiler Time Types and Runtime Validation

Type system is strict, complete, and schema-driven. Detail at
[`typescript-practice.md`](../../docs/governance/typescript-practice.md).
```

### Step 6 — Verify file fitness on both ends

- `principles.md` post-extraction should drop ~45 lines and ~3000
  chars (currently 24238/24000 hard on chars; this extraction takes
  it to ~21200/24000, well within hard).
- `typescript-practice.md` post-extension should remain within its
  own fitness limits. If the extension pushes it over, the recursion
  test fires: extract Level-3 worked examples or split the file.

### Step 7 — Verify bidirectional traceability

Every section moved into `typescript-practice.md` must have a
backlink to the principles.md section it elaborates. Every rule
pointed at from the moved sections must remain valid.

### Step 8 — Run the gate orchestrator

Per the commit skill, run
`pnpm exec tsx scripts/check-commit-skill-gates.ts -F /tmp/<msg>`
before staging. If fitness on `principles.md` improves (HARD →
under), record that in the commit message.

### Step 9 — Commit (single atomic commit)

Subject: `docs(principles): extract compiler-time types section to typescript-practice`

Body: list the moved bullets, the principles.md fitness drain, the
typescript-practice.md fitness state, and the bidirectional links
landed.

### Step 10 — Update the strategic plan and snagging plan

- Mark a subset of the strategic plan's Phase 4 todos as completed
  (the Compiler Time Types extraction lane).
- Update `2026-05-06-principles-graduation-pass-review-snags.md` to
  note any S-numbered findings that were resolved as a side effect.

## Acceptance Signals

- `principles.md` characters drop below 24000 hard limit.
- `typescript-practice.md` carries the full substance of the
  extracted bullets with upward bidirectional links.
- No Level-2 rule pointer breaks.
- The orchestrator's HARD-on-principles-chars signal clears in the
  next session-open fitness baseline.

## Out of Scope (for this opener)

- Other strong-candidate extractions (Tooling, Refactoring numerics,
  Cardinal Rule, Layer Role Topology) — those are subsequent
  Phase-4 lanes after this single extraction validates the contract
  in practice.
- The S-numbered snags from the reviewer dispatch (S1–S6, P-1–P-3) —
  those are scoped to their own next-session work where applicable.
- Specialist reviewer dispatch on the strategic plan as a whole
  (fred, wilma, assumptions-reviewer) — those land separately; they
  assess the plan, not the first extraction.

## Source Documents

- Strategic plan:
  [`principles-entrypoint-content-homing.plan.md`](../future/principles-entrypoint-content-homing.plan.md)
  (Phase 0 completed 2026-05-06).
- Operationalisation contract:
  [`.agent/directives/operationalisation-contract.md`](../../../directives/operationalisation-contract.md)
  (landed 2026-05-06).
- Snagging plan:
  [`2026-05-06-principles-graduation-pass-review-snags.md`](2026-05-06-principles-graduation-pass-review-snags.md)
  (P0+P1 fixes inline; remaining P1/P2 + deferred specialist
  dispatches for owner attention before plan promotion).
