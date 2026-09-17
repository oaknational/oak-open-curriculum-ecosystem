# No Moving Targets in Permanent Docs

Operationalises the **durability axis** of
[PDR-105](../practice-core/decision-records/PDR-105-reference-direction-invariants.md)
(reference-direction invariants): a permanent doc must not depend on a more-ephemeral
target — neither an embedded moving value (a SHA, a count) nor a citation pointing at an
ephemeral surface. This rule is that axis's write-time hook. The
write-time hook enforcement at
`.agent/hooks/policy.json` `preToolUseContent.scoped_blocks` is the
machine layer; this rule names the discipline. The hook now distinguishes
prose-narrative context from data-shaped lines (cure landed 2026-05-10):
backticked SHAs in prose fire the rule; backticked SHAs inside YAML/JSON-
shaped data lines do not.

**Portable** permanent documentation (PDRs, governance docs in
practice-core, principles, testing-strategy, rules, patterns) must
not embed values that drift over time. Commit SHAs, deployment IDs,
version numbers, count-of-something figures, and other moving
targets belong in ephemeral state (plans, threads, comms, napkins,
release notes) — not in the portable permanent record.

ADRs, which are repo-bound by definition (see
[PDR-079](../practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md)),
are explicitly out of scope for this rule. ADRs may carry SHAs,
event UUIDs, repo paths, package names, and branch conventions as
appropriate evidence. See §Scope below.

## The Rule

When authoring on permanent-doc surfaces, name structural concepts,
not transient instances. The Edit/Write hook
(`.agent/hooks/policy.json` `preToolUseContent.scoped_blocks`)
catches 7- to 40-character hexadecimal tokens (with at least one
a-f character) at write-time. The deny payload surfaces the citation
*"Moving targets do not belong in permanent docs"*.

## Authoring-Time Open-Set Clause (any prose artefact entering review)

A closure claim over an open or moving set is a moving target even when it
contains no SHA or version number. Counts ("all 131 functional tokens"),
closed class-sets ("the three kinds of X"), "global"/"complete" audit-scope
assertions, appendices claiming to be *the* inventory, pinned argv or proof
commands for work that has not yet run, and present-tense statuses of
in-flight work are all closure-shaped claims: a per-push reviewer re-reads
each one against the surface as it now is, and each round falsifies another
member.

The named mechanism (worked evidence 2026-07-20: seven review arcs across
five document classes in one merge drive, every non-convergence traced to
this one generator): **closure claims survive kills by climbing one
abstraction level** — a falsified count becomes a closed class-set, a killed
class-set becomes a pinned procedure, a killed procedure becomes a
closed catalogue of named failure classes used in diagnosis. Killing the
instance does not kill the generator; the arc cannot converge while the
claims stay closure-shaped.

The cure, applied at AUTHORING time, in any prose artefact that will be
read against a living surface — reports, PR narratives and descriptions,
plan proof clauses, audit appendices, review dispositions, not only the
permanent docs this rule's hook covers:

- State open sets as **classes with dated exemplars of an explicitly open
  set**, never as exhaustive enumerations.
- Make counts and closure claims **non-load-bearing by default**: nothing
  downstream may depend on the count being current. A count that must be
  load-bearing is derived at read time from its source, not authored.
- Scope claims name what was **actually swept** (surfaces, method, date),
  never "global"/"complete"/"the inventory".
- Prescriptions for unrun work are **invariants plus a promotion trigger**,
  never pinned argv, pinned proof output, or mechanics fixed at landing
  time (see `future-work-items-are-pointers`).
- In diagnosis, read the entire governing surface unfiltered before
  hypothesis-matching, and treat any catalogue of named failure classes as
  an open set — pattern-matching against a closed catalogue is this same
  generator applied to reasoning.

## Scope: Portable Surfaces Only

Per [PDR-079](../practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability distinction), the rule applies strictly to
**portable surfaces** and explicitly **NOT** to **repo-bound surfaces**.

### Portable surfaces (rule applies strictly)

- `.agent/practice-core/decision-records/PDR-*.md` — Practice Decision
  Records carry portable doctrine; SHAs, repo paths, plan filenames,
  branch prefixes, and event UUIDs are all forbidden in PDR bodies.
- `.agent/rules/*.md` — rule files codify portable discipline;
  same content constraints apply.
- `.agent/memory/active/patterns/*.md` — pattern files distill
  portable observations; same content constraints apply.
- `.agent/directives/principles.md` — first-principles directives.
- `.agent/directives/testing-strategy.md` — testing-strategy
  directive.

### Repo-bound surfaces (rule does NOT apply)

- `docs/architecture/architectural-decisions/ADR-*.md` — ADRs are
  repository-specific by definition. SHAs, event UUIDs, repo paths,
  package names, and branch conventions appear in ADRs as appropriate
  evidence and operational specificity. Forcing ADRs to soften
  repo-bound evidence into portable-vocabulary phrasing loses the
  load-bearing operational bite the ADR class exists for.

The spirit of the rule extends to other permanent-doc surfaces that
behave as portable doctrine even when the hook's literal scope does
not list them.

## Excluded Surfaces (Why)

- `.agent/practice-core/provenance.yml` — provenance UUIDs are
  data, not prose.
- `archive/` — historical material; SHAs in past records are
  themselves part of the record.
- `fixtures/`, `/tests/`, `.test.ts` — test corpora.

## Hook Exclusions

The regex matcher applies three line-level exclusions before
detection:

1. **Fenced code blocks** (between ` ``` ` markers) are skipped —
   YAML/JSON examples and code samples that embed SHAs as *data*
   are intentional.
2. **Inline-code spans on data-shaped lines** are stripped from the
   line before the regex test. A *data-shaped line* is one whose
   non-backticked content does NOT contain three consecutive
   alphabetic words (a sentence fragment) — YAML field values,
   JSON snippets, table cells with short text, list items that are
   essentially the backticked token itself. **Prose-narrative lines
   are tested verbatim**: a backticked SHA inside a sentence (the
   *"see commit `abc1234` for the change"* shape) fires the rule
   because the prose ties the doc's claim to a moving target.
3. **Lines containing `(historical reference)`** are skipped —
   citing a past commit SHA in narrative prose is permitted when
   the historical-reference marker is explicit.

The prose-vs-data distinction is implemented at
`agent-tools/src/hook-policy/matchers.ts` `lineIsPredominantlyCodeShaped`.
This closes the *"hook is more permissive than the rule"* gap that
existed before 2026-05-10.

## Hex-Class Caveat

The matcher uses `\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b`. The
lookahead requires at least one a-f character so pure-decimal
tokens (timestamps, large integer counts) do not trip the
matcher. SHAs always contain hex letters by their distribution;
decimals do not.

## Why

Three reasons:

1. **Permanent docs do not get re-edited often.** A SHA in an ADR
   ages silently. Months later, the SHA points at a commit whose
   context has shifted, and the reader has no signal that the
   reference is stale.
2. **The narrative gets tied to a snapshot.** A claim like
   "see `abc1234` for the canonical example" makes the doc
   dependent on `abc1234` continuing to be canonical. Any later
   refactor invalidates the doc without touching it.
3. **The right place exists.** Plans, threads, comms, and napkins
   are explicitly *ephemeral state* — they are read in their
   session-of-origin and rotated. Commit SHAs, timestamps,
   instance counts, and other transient values belong there.

## Citation Directionality: Portable → Ephemeral Is Forbidden

Portable permanent docs (PDRs, governance docs in practice-core,
principles, testing-strategy, rules, patterns) MUST NOT cite plans,
plan paths, plan section identifiers, thread next-session record
paths, or other ephemeral surfaces.

ADRs are repo-bound, so the **portability** axis does not bite them —
an ADR may name a host-specific surface a portable PDR could not. The
**durability** axis applies to ADRs in full, however: like all durable
doctrine, an ADR references nothing more ephemeral than itself
(PDR-105 Axis-1). Plans archive, get renamed, get split or merged; a
permanent doc — ADR included — citing a plan name becomes a dead
pointer the moment that plan archives. The one durability exemption is
a reference to a stable-*addressed* surface (a registry, log, index, or
schema whose address is fixed) per PDR-105's stable-index corollary —
never to a volatile item within it.

The directionality is one-way:

- *Plans cite permanent docs* — plans reference ADRs, principles,
  rules, and PDRs as the source of truth they execute against.
- *Permanent docs do not cite plans* — they describe what changed
  and what reattaches when, self-contained, without naming the
  plan or workstream that produced the change.

This subsumes the SHA-specific framing under the broader
directionality principle. Same family of failure (permanent →
ephemeral citation), different granularities: SHAs, plan names,
thread next-session record paths, and any other identifier
that lives in ephemeral state.

Owner sharpening 2026-05-05: *"plans are ephemeral! ADRs are
permanent. The ADRs are the source of truth, plans reference
THEM"*.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Reference the canonical example" | "see `abc1234` in `path/file.ts`" | Name the structural concept; if a worked example helps, code-fence it inline |
| "Cite the post-mortem incident" | bare SHA in prose | Date + a one-line summary; full SHA in the napkin archive |
| "Pin the version" | "v3.7.2 introduces…" | "the version that introduced X (see `package.json`)" |
| "Reference a commit for historical context" | bare backticked SHA | Add the explicit `(historical reference)` marker on the same line, so the citation is a deliberate audit trail |
| "Point the vision or a strategy page at the plan that carries a decision" | a dated note naming a delivery-plan id or a ticket | Name the ADR that records the decision (author it first if none exists — "durable homes for decisions are ADRs", owner 2026-09-03) and describe the lane, never a plan node of any type by id — an existing citation of one on a permanent page is a defect to retire, not a precedent (PDR-105 §Axis 1). Worked instance 2026-09-03: a corpus-truing pull request's notes on the vision and three strategy pages cited a delivery plan and a ticket; the owner refused the push, an adversarial review found the rule, and the cure was an ADR folded into the same pull request with every permanent page re-pointed at it. Prediction (PDR-130): no new plan-node id lands on a permanent page within the review window and the pre-existing strategy-index citation is retired at its true-up; if one lands, `validate-reference-direction` extends to plan ids on permanent pages |

## Doctrinal Anchors

- [PDR-105](../practice-core/decision-records/PDR-105-reference-direction-invariants.md)
  §Axis 1 (durability) — the reference-direction invariant this rule operationalises
- per-user feedback memory: `feedback_no_moving_targets_in_permanent_docs`
- PDR-044 §Innate immunity (write-time fingerprints)
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)

## History

The earlier version of this rule named a refinement candidate (the
hook/spirit gap on prose-context backticks) as either-or: tighten the
hook OR leave the hook as-is and rely on the rule. The 2026-05-10
hook tightening graduated this candidate by tightening the hook —
prose-context backticked SHAs now fire at write-time, matching the
rule's full reach.
