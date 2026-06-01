# Next-session brief (Codex) — EEF plan consistency / residue sweep

**For**: a Codex session. Self-contained; read this in full before starting.
**Authored**: 2026-05-31 by Opalescent Transiting Prism (claude-opus-4-8), at EEF
D0 close. **Scope owner**: the `eef` thread.

## Why this session exists

EEF D0 just completed (commit `ce9745c7`). D0's closing step was an
intent-versus-letter audit, and it caught a class of defect a letter-only check
misses: a decision that was **reshaped mid-execution but recorded in only one
place, not propagated**. Concretely — the owner decided during D0 to delete the
*entire* `validate-external-data-files` validator (not "expunge two rules, keep
two"). That reshape was written into the plan's `EXECUTION STATUS` note but **not
swept through the plan's other restatements**, so the stale "keep two rules"
framing stayed live in five locations (Ratified Decision 3, the frontmatter
`todos` step 7, the "Do — validator expunge" step, and the "Done when" acceptance
criterion + Proof — the last two literally unsatisfiable, referencing deleted
tests), and a stale `gate-1b refresh script` line survived in the shipped corpus
file's docstring. All were fixed in D0; the doctrine is captured in **PDR-089**
(Proposed): *a reshaped decision is done only when propagated to every reference;
the reflex is invisible from inside the frame; the cure is an external check.*

D0 only fixed D0's own surfaces. **D1–D7 and the cross-cutting sections of the
plan were not swept for the same class of defect.** That is this session's job.

## Task

Sweep `eef-graph-tool-completion.plan.md` (≈1190 lines, deliverables D0–D7) **and
the live EEF estate** for the same defect classes D0's audit found, focusing on
D1–D7 and the cross-cutting sections (Ratified Decisions, Known-vs-Unknown
Doctrine, Definition of Done, Non-Goals, Risk, Readiness Reviewers, and the
frontmatter `todos` content blob). Hunt for:

1. **Reshape-propagation residue.** For every cross-cutting decision, cross-check
   that it is stated *consistently everywhere it appears* — the frontmatter
   `todos` blob, the Ratified Decisions, the per-deliverable bodies, the "Done
   when" acceptance criteria, the Proof lines, and the Definition of Done. A
   decision restated in N places where one restatement is stale is the exact D0
   defect. Decisions especially worth cross-checking: the **single-Zod-call MCP
   input+output schema** rule (Ratified Decision 2 — each input and output schema
   is derived by one Zod call on the appropriate subset of the EEF graph, and if
   that proves impossible at implementation time the next step is an owner
   conversation, not an executor-chosen workaround); **no Zod over the corpus**
   (Decision 2); **node type = `(typeof EEF_TOOLKIT_DATA.strands)[number]`**,
   no normalized parallel shape (Decisions 4/5); **graph-core query contract is
   input to be reshaped, not fixed** (Decision 6); **no response cap; graph scope
   is the bound** (Decision 7); **freshness fully WITHDRAWN** (Decision 9).
2. **Stale acceptance criteria / Proof** referencing artefacts a reshape changed
   or deleted (the D0 pattern: a criterion that cannot be satisfied because the
   thing it names no longer exists).
3. **Contaminated current-truth** — discarded tokens (`gate-1a`/`gate-1b`,
   Zod-over-corpus, `freshness`/`ADR-175`, `response-budget`/cap,
   normalized/`z.infer` node interface) asserted as **live guidance** in D1–D7
   bodies. Distinguish from correctly-marked history.
4. **Internal inconsistency** — a decision superseded by a note while the body
   still asserts the old position (the D0 Ratified-Decision-3 shape).
5. **Dangling links** within the EEF estate.
6. **Doc-vs-code mismatch that is NOT the expected migration.** The EEF SDK code
   still contains Zod + a freshness gate (`loader.ts`, `freshness.ts`,
   `strand-schema.ts`, and code-comment `gate-1a/1b` in surviving files); that is
   deleted/rewritten in the LATER deliverables D2/D4/D5/D6 and is **expected, not
   a finding** (see the D0 decontamination ledger's "Covered by a later D-step"
   section). Only flag a doc-vs-code mismatch that is neither expected-migration
   nor history.

## Method (the lens that worked)

- **Intent, not just letter.** Ask of each section "does this still describe the
  decided shape, or a superseded one?" — not merely "is it well-formed?".
- For each cross-cutting decision, `rg` every restatement and compare them
  pairwise; a divergence is the defect.
- `rg` the discarded tokens across the EEF estate; classify each hit as
  current-truth (fix) vs history-retained (preserve) vs covered-by-later-D-step
  (leave, per the ledger).
- Apply PDR-089: the cure for any residue is to sweep-and-replace **every**
  instance, not just the one you found.

## Scope and boundaries

- **In scope**: `eef-graph-tool-completion.plan.md` + the live EEF estate under
  `.agent/plans/sector-engagement/eef/` (README, reference/, current/), excluding
  `archive/`.
- **Out of scope**: non-EEF plans (owned by
  `connecting-oak-resources/knowledge-graph-integration/current/graph-estate-consolidation.plan.md`);
  history-retained zones (`archive/`, the `eef` thread record's superseded
  sections below its banner, `conservation-map.md`'s historical record — these
  are preserved, never swept).

## Output and acceptance

- A findings list, each with a disposition: correct-in-place / inline
  supersession-marker (preserve decision history) / leave-as-history /
  surface-as-owner-judgment-call. Fix the clear-cut ones; surface judgment calls.
- After edits: a final `rg` sweep returns zero LIVE discarded-token current-truth
  in the EEF estate; each cross-cutting decision reads consistently across all its
  restatements; `pnpm markdownlint-check:root` and `pnpm format-check:root` green
  (and the EEF package gates if any code is touched — though this is expected to
  be a docs-only pass).

## Gotchas

- **Markdown foot-guns** (cost real time in D0): prose written `X + Y` that wraps
  so `+ Y` lands at a line start trips markdownlint MD004 (parsed as a `+` list
  item, and flips the file's inferred list-style so other lists then fail);
  MD049 emphasis-style is per-file-consistent (match each file's existing
  `*asterisk*` vs `_underscore_` convention). Run `markdownlint` on each file
  after editing it, and never pass a shell variable as a file list to
  lint/format (zsh does not word-split unquoted vars — it silently lints nothing
  and falsely reports clean).

## Authority / read-first

- `eef-graph-tool-completion.plan.md` (the plan being swept).
- `eef-d0-decontamination-ledger.md` (what D0 dispositioned, and the
  covered-by-later-D-step list — do not re-flag those).
- `.agent/practice-core/decision-records/PDR-089-conservation-reflex-external-check.md`
  (the doctrine; Proposed).
- the `eef` thread record (`.agent/memory/operational/threads/eef.next-session.md`)
  top banner.
