---
name: "Practice-Core Portability — Strict Enforcement"
overview: >
  Add a portability scanner that fails when any file under
  .agent/practice-core/ contains repo paths, ADR references, or
  commit references except a link to .agent/practice-index.md, then
  remediate the existing violations by porting host-specific
  addressing into the practice-index bridge and rewriting Core prose
  in portable language. Closes the structural-enforcement gap behind
  the owner-stated rule "Practice-Core portability is by construction".
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify the rule, the existing portability infrastructure, and the violation inventory."
    status: pending
  - id: phase-1-scanner-red
    content: "Phase 1 (RED): write failing tests against the known-violation files before any scanner change."
    status: pending
  - id: phase-2-scanner-green
    content: "Phase 2 (GREEN): extend pnpm portability:check with the practice-core portability checks; tests turn green at the right places (i.e. fail at the right places)."
    status: pending
  - id: phase-3-remediate-host-paths
    content: "Phase 3: port host-specific addressing (repo paths, ADR/PDR cross-doc paths) into .agent/practice-index.md; rewrite Core prose portably."
    status: pending
  - id: phase-4-remediate-adr-mentions
    content: "Phase 4: rewrite inline ADR-NNN mentions in Core prose to portable language; route any required reference through practice-index."
    status: pending
  - id: phase-5-closure-proof
    content: "Phase 5: scanner green; full quality gates green; docs updated; consolidation pass."
    status: pending
isProject: false
---

# Practice-Core Portability — Strict Enforcement

**Last Updated**: 2026-05-01
**Status**: 🔴 NOT STARTED
**Scope**: Add structural enforcement (scanner + CI gate) for the
strict portability rule on `.agent/practice-core/`, then remediate
existing violations.

---

## Context

### The rule

Owner stated 2026-05-01: anything under `.agent/practice-core/` MUST
be repo-independent. The Practice-Core is portable by construction.
Specifically:

- No repo paths (`docs/...`, `src/...`, `packages/...`, `apps/...`,
  and any `../../skills/`, `../../commands/`, `../../memory/`,
  `../../plans/`, `../../experience/`, `../../rules/`, etc. that
  escape the `practice-core/` package boundary).
- No ADR references (no `ADR-NNN`, no links into
  `docs/architecture/architectural-decisions/`).
- No commit references (no SHAs, no commit-subject citations,
  no `commit abcdef0`-style prose).

The only outgoing link allowed from any file under
`.agent/practice-core/` is to the stable bridge index
`.agent/practice-index.md`. Cross-references between Core files
(PDR↔PDR, trinity↔trinity, `index.md`↔`practice.md`, etc.) are
internal to the Core package and remain allowed; what is forbidden is
leakage out of the Core into the host repo.

This is stricter than the prior "Core self-containment" framing —
the seam tightens from "the host repo" to *exactly one* permitted
outgoing target (the practice-index bridge).

### Issue 1: The rule is stated, not enforced

**Evidence**: The rule was stated by the owner this morning. Without
a scanner, the rule is enforced only by reviewer attention; that
attention failed for at least the violations enumerated below, several
of which were authored in recent sessions while the implicit form of
the rule was already in place.

**Root cause**: Owner-stated principles without structural enforcement
rot. This is the general form recorded as a hard-won rule in
`distilled.md` and previously generalised in the form "stated
principles require structural enforcement."

**Existing capabilities**: The `pnpm portability:check` script
(`scripts/validate-portability.ts`) already runs portability checks
across the agent surface. It owns the natural extension point for
practice-core portability, and it already fails CI on violation. The
scanner code is structured around per-check helpers in
`validate-portability-helpers.ts`; adding a new check is the
canonical extension shape.

### Issue 2: Existing violations under `.agent/practice-core/`

**Evidence**: Audit performed at session open 2026-05-01. Violations
fall into three classes:

1. **Cross-doc paths into the host repo's ADR directory** — multiple
   PDRs link `../../../docs/architecture/architectural-decisions/...`.
   Specifically, the violation pattern appears in PDR-038, PDR-039,
   PDR-040, PDR-041, and PDR-042. Each link should route through the
   practice-index bridge instead.

2. **Cross-doc paths into other host-repo surfaces** — PDR-026 links
   `../../skills/`, `../../commands/`, `../../memory/`, and
   `../../plans/observability/` from inside the Core. PDR-041 links
   `../../experience/...` and `../../plans/...`. Each link should
   either be replaced with portable language naming the *concept* and
   referencing the practice-index, or removed if the citation is not
   load-bearing for the PDR's argument.

3. **Inline `ADR-NNN` mentions in trinity prose** — `practice.md`,
   `practice-lineage.md`, `practice-bootstrap.md`, and `CHANGELOG.md`
   each reference `ADR-NNN` numbers in body text or examples (and
   `practice-bootstrap.md` uses ADRs as part of its templates).
   Templates may legitimately use `ADR-{NNN}` as a placeholder shape;
   live references must be ported to portable language with the
   actual cross-link living in the practice-index.

**Root cause**: Until today the rule was implicit and weaker — the
ADR-124 / PDR-007 framing said "Core self-containment", which several
authors (including this agent) read as "minimise host coupling" rather
than "permit exactly one outgoing target". The recent PDRs are
prior-art evidence of that drift.

**Existing capabilities**: The practice-index
(`.agent/practice-index.md`) is already the canonical bridge between
the portable Core and the local repo. Most cross-doc references
currently embedded in Core files have a natural home in
practice-index. The migration is mostly a relocation, not a rewrite.

---

## Quality Gate Strategy

**Critical**: Run all quality gates after each task. Practice
infrastructure is cross-cutting; regressions in scanner output or in
Core file rendering can cascade.

### After Each Task

```bash
pnpm portability:check   # Scanner — must reflect intended state
pnpm test:root-scripts   # Scanner unit tests
pnpm markdownlint:root   # Doc-mutation gate
pnpm practice:fitness:informational  # Fitness over Core trinity
```

### After Each Phase

```bash
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm practice:fitness:strict-hard
```

**Rationale** (from `principles.md`): run quality gates frequently;
do not let drift accumulate.

---

## Solution Architecture

### Principle

- "Stated principles require structural enforcement." (recorded in
  `distilled.md`; the general form was graduated 2026-04-30.)
- "Anything under `.agent/practice-core/` must have no repo paths,
  no ADR references, and no commit references; the only outgoing
  link allowed is to `.agent/practice-index.md`." — owner, 2026-05-01.

### Key Insight

The Practice-Core's value is that it travels. Every outbound link
into the host repo binds the Core to that host repo and silently
breaks propagation. The practice-index bridge already exists and is
already the documented seam between portable Core and local repo —
this plan tightens the seam to *exactly one* permitted outgoing
target and makes that constraint mechanical.

The scanner does not need a new manifest of "what counts as a
violation." It walks every file under `.agent/practice-core/` and
applies three pattern checks: repo-path-escapes-package, ADR-mention,
and commit-reference. Internal cross-references (relative paths that
stay inside `practice-core/`) are allowed; the practice-index URL
(`.agent/practice-index.md` from the Core's perspective, expressed as
a relative path) is the single allowed outbound exception.

This exemplifies the first question from `principles.md`: **"Could
it be simpler?"**

Answer: **YES.** A single scanner with three pattern checks, one
allowed exception. No new manifest, no per-file annotations, no
config table to maintain.

### Strategy

**Phase 1 (RED)**: write unit tests that assert the scanner *would*
flag each known violation file when given known-violation content.
Tests fail today (no such check exists in the scanner).

**Phase 2 (GREEN)**: extend `validate-portability.ts` with three new
checks: (a) repo-path-escapes-Core, (b) ADR-mention-in-Core, (c)
commit-reference-in-Core. Each emits a structured issue list with
file path, line number, matched pattern, and remediation hint. Tests
turn green; the scanner now fails the existing violations.

**Phase 3**: remediate the host-path violations by porting addressing
into `.agent/practice-index.md` and rewriting the Core prose in
portable language.

**Phase 4**: remediate inline ADR-NNN mentions in trinity prose;
route any required cross-reference through practice-index.

**Phase 5**: scanner green, quality gates green, consolidation pass.

**Non-Goals** (YAGNI):

- ❌ Authoring a new ADR/PDR for the rule itself. The rule is
  captured in `distilled.md § Process` and in platform memory
  (`feedback_practice_core_portability_strict`). Promotion to a PDR
  is a separate decision; tracked in the pending-graduations
  register, not blocking this plan.
- ❌ Multi-checkout merge handling for fitness-managed files. This
  is a related architectural concern from the same session, but it
  is its own plan (sequenced after a fitness-frontmatter manifest
  sweep). See *Future / Related Plans* below.
- ❌ Fitness-frontmatter manifest sweep across the wider repo. Its
  own plan; pre-requisite for any merge-handling mechanism.
- ❌ Moving-targets remediation in `practice-index.md` and other
  permanent docs. Same shape (structural enforcement of an
  owner-stated rule), different surface; its own plan.
- ❌ Replacing the existing ADR-124 / PDR-007 framing wholesale. The
  strict rule tightens those decisions; an amendment may follow if
  warranted, but it is not load-bearing for closing this plan.
- ✅ A scanner check, a remediation pass, and a closure proof.

---

## Build-vs-Buy Attestation

Not applicable. This plan extends an existing first-party scanner
(`scripts/validate-portability.ts`) with additional checks. No vendor
adoption.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-reviewer` (challenge: is the strict
  rule the right shape, or is a softer "minimise outbound" form
  preferable? Owner has stated; the reviewer challenges the
  *implementation shape*, not the rule).
- **During**: `test-reviewer` (Phase 1 RED tests prove the right
  things), `code-reviewer` gateway, `architecture-reviewer-fred`
  (principles-first; the strict-portability rule is principle-shaped)
  during Phases 2 and 3.
- **Post**: `docs-adr-reviewer` (Core prose now portable;
  practice-index updated coherently); `release-readiness-reviewer`
  before declaring closure.

Scheduling all reviewers at close is phase-misalignment.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. Re-read `.agent/directives/principles.md` — Core principles.
2. Re-read `.agent/directives/testing-strategy.md` — Testing
   philosophy (RED-GREEN-REFACTOR; behaviour over implementation).
3. Re-read `.agent/directives/schema-first-execution.md` — applies
   here only insofar as the scanner's pattern definitions are the
   "schema" for what counts as a violation; treat them with the same
   rigour.
4. Ask: "Does this deliver system-level value?" Yes — durable
   structural enforcement of a portability constraint that protects
   every future Core hydration.
5. Verify: no compatibility shims, no type shortcuts, no disabled
   checks. The scanner extension must fail-closed on unknown
   patterns, not warn-and-pass.

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. Record the work shape: this is an executable repo plan. The plan
   *is* the lifecycle artefact.
2. Run `start-right-quick`; consult active claims and recent
   collaboration log entries.
3. Register the active areas before edits (scanner code under
   `scripts/`, every file under `.agent/practice-core/`, the
   practice-index file).
4. Apply
   [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md)
   for any non-trivial cross-file edit. Practice-Core edits are
   particularly sensitive — peer agents may be reading / amending
   the same files.

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update `.agent/practice-index.md` if practice-core content moves
   into it.
2. Update `.agent/memory/active/distilled.md § Process` only if the
   rule itself changes — capturing the rule is already done; the
   plan does not re-record it.
3. Update `docs/architecture/architectural-decisions/124-...md`
   and `.agent/practice-core/decision-records/PDR-007-*.md` if the
   strictening warrants an amendment log entry. Decision: amend if
   the strict form changes the contract; otherwise leave to a future
   amendment-log session and record an explicit no-change rationale.
4. Apply `/jc-consolidate-docs` after Phase 5 to ensure settled
   content is not trapped in this plan.

If no update is needed for a required surface, record an explicit
no-change rationale.

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions

**Foundation Check-In**: Re-read `principles.md` (architectural
correctness over expediency), `testing-strategy.md` (RED first), and
the rule capture in `distilled.md § Process` plus
`feedback_practice_core_portability_strict`.

**Key Principle**: Capture the violation inventory mechanically (not
from the prose audit) before writing any scanner code, so RED tests
in Phase 1 are grounded in current state, not in this plan body.

#### Task 0.1: Reproduce the violation inventory mechanically

**Current Assumption**: The session-open audit prose names the
violation files correctly. We re-verify mechanically before relying
on those names.

**Validation Required**: Confirm that current-HEAD `.agent/practice-core/`
contains repo-path-escapes, ADR mentions, and commit references; capture
the file list as a build artefact rather than as plan-body prose.

**Acceptance Criteria**:

1. ✅ A throw-away grep run produces a file list and pattern-count
   summary that the scanner (Phase 2) will be expected to reproduce.
2. ✅ The inventory is written to a temporary path under
   `.remember/` or the napkin (ephemeral surface) — *not* into this
   plan body, per the no-moving-targets rule.
3. ✅ The pattern definitions are recorded: which regex catches
   repo-path-escape, which catches ADR-mention, which catches
   commit-reference. These will become the scanner's `const` patterns.
4. ✅ Cross-references *internal* to `practice-core/` are not flagged
   (e.g. `practice.md` → `practice-lineage.md` is allowed; PDR → PDR
   is allowed).

**Deterministic Validation**:

```bash
# 1. Repo-path escapes from inside practice-core/ — relative paths
#    that climb above .agent/practice-core/.
grep -REn '\]\(\.\./\.\./' .agent/practice-core/ | tee /tmp/practice-core-repo-path-escapes.txt
# Expected: non-empty (current state has violations)

# 2. ADR references in any form (link or inline mention).
grep -REn '(ADR-[0-9]{3}|architectural-decisions/[0-9]{3})' .agent/practice-core/ | tee /tmp/practice-core-adr-mentions.txt
# Expected: non-empty (current state has violations)

# 3. Commit references — short SHAs in prose.
grep -REn '\b[0-9a-f]{7,40}\b' .agent/practice-core/ | tee /tmp/practice-core-commit-refs.txt
# Expected: review manually; SHA-shaped tokens may include false
# positives (UUIDs, content hashes); this is signal not specification.

# 4. Internal cross-references (relative paths that stay in-package).
grep -REn '\]\((?!\.\./\.\./)\.\.?/[^)]*\.md' .agent/practice-core/ | head
# Expected: non-empty; these are ALLOWED (PDR↔PDR, trinity↔trinity).
```

**If Violations Found**:

Proceed to Phase 1 with the captured pattern set and inventory. Do
*not* embed the file count or violation count in this plan body —
it is a moving target. The scanner will be the live source of truth.

**If No Violations**: surprising; investigate before proceeding.
Either the audit was wrong or remediation already happened.

**Task Complete When**: Pattern definitions recorded; inventory
captured to ephemeral path; cross-reference behaviour confirmed.

**Foundation Alignment**: Schema-first-execution analogue — define
the patterns (the "schema" for violations) before writing the
scanner that validates against them.

---

### Phase 1: RED — Failing Tests First

**Foundation Check-In**: Re-read
`testing-strategy.md § RED-GREEN-REFACTOR` and the
`tdd-for-refactoring` rule.

**Key Principle**: Tests must fail at the right places before the
implementation exists. RED proves the test would catch a
re-introduction of a violation.

#### Task 1.1: Add fixture files representing each violation class

**Current Implementation**: `scripts/validate-portability.unit.test.ts`
exists with a structured fixture pattern. The new check needs three
fixture cases (one per violation class) plus negative cases (one
allowed internal cross-reference, one allowed practice-index outbound
link).

**Target Implementation**: tmp-fixture pattern (per existing test
style) with:

- fixture A — Core file containing `../../skills/...` outbound link
  (repo-path-escape)
- fixture B — Core file containing `[ADR-131](../../../docs/...)`
  (ADR-mention)
- fixture C — Core file containing `commit 514838c8` in prose
  (commit-reference)
- fixture D — Core file containing internal `[other](./other.md)`
  link (allowed)
- fixture E — Core file containing
  `[practice-index](../practice-index.md)` link (the one allowed
  outbound exception)

**Changes**:

- New test file (or new `describe` block in existing test) covering
  the five fixture cases.
- Test names follow the existing convention; one assertion per case
  describing the expected scanner behaviour.

**Acceptance Criteria**:

1. ✅ Five fixture cases authored in the test suite.
2. ✅ Tests reference an as-yet-unimplemented check function
   (`getPracticeCorePortabilityIssues` or equivalent name following
   existing helper conventions).
3. ✅ `pnpm test:root-scripts` exits non-zero with a clear message
   that the new check is not implemented (RED).
4. ✅ No production scanner code has been written yet.

**Deterministic Validation**:

```bash
pnpm test:root-scripts -- --run validate-portability
# Expected: exit non-zero; error mentions the new check function or
# missing fixture handler.
```

**Task Complete When**: Tests fail for the right reason
(implementation absent), and pass for none of the cases.

---

### Phase 2: GREEN — Scanner Implementation

**Foundation Check-In**: Re-read `principles.md § Quality Gates` and
the existing scanner architecture in `validate-portability.ts` /
`validate-portability-helpers.ts`.

**Key Principle**: Add the new check using the existing helper
pattern. No special-casing. The check returns a structured issue
list; `validate-portability.ts` aggregates and exits non-zero on
any issue.

#### Task 2.1: Implement the practice-core portability check

**Target Implementation**: a new helper
`getPracticeCorePortabilityIssues(rootPath)` in
`validate-portability-helpers.ts` (or a sibling file if the helper
file is approaching fitness limits — judgement call at the time).

**Changes**:

- Walk every `.md` (and any other content-bearing extension) under
  `.agent/practice-core/`.
- For each file, apply three pattern checks:
  1. Outbound relative path that escapes `practice-core/` AND is
     not the practice-index exception.
  2. ADR mention (link into `docs/architecture/architectural-decisions/`
     OR inline `ADR-NNN` in body text — note: template placeholder
     `ADR-{NNN}` is allowed; treat brace-delimited tokens specially).
  3. Commit reference (link or prose containing a 7+ hex-character
     token in a context indicating commit identity — heuristic; tune
     to minimise false positives on UUIDs and content hashes).
- Return `{ filePath, line, matchedText, violationClass, remediationHint }`
  per issue.
- Wire the helper into `validate-portability.ts`'s aggregation.

**Acceptance Criteria**:

1. ✅ All Phase 1 fixtures behave as asserted: A, B, C flagged with
   correct violation class; D and E pass.
2. ✅ Scanner output is structured (machine-readable list of issues
   with stable shape), so downstream tooling can consume it.
3. ✅ Allowed exception (link to `practice-index.md`) is whitelisted
   exactly once and documented inline (a single comment is allowed
   here — this is the "WHY is non-obvious" case from
   `principles.md`).
4. ✅ Internal cross-references are not flagged.
5. ✅ No `as`, `any`, or `@ts-expect-error` introduced; the helper
   uses concrete types end-to-end.
6. ✅ The helper is independently importable and unit-testable;
   the integration into `validate-portability.ts` is a thin wiring.

**Deterministic Validation**:

```bash
# 1. Unit tests pass.
pnpm test:root-scripts
# Expected: exit 0; the five fixture cases all pass.

# 2. Scanner runs against current repo and FAILS on the existing
#    violations (this is the desired behaviour at this phase — the
#    scanner now sees the prior-art breaches).
pnpm portability:check
# Expected: exit non-zero; output enumerates the practice-core
# violations from the Phase 0 inventory.

# 3. Scanner output stable across reruns (no nondeterministic ordering).
pnpm portability:check 2>&1 | tee /tmp/run1.txt
pnpm portability:check 2>&1 | tee /tmp/run2.txt
diff /tmp/run1.txt /tmp/run2.txt
# Expected: no diff.
```

**Task Complete When**: All acceptance criteria checked; scanner
green on fixtures and red on real repo state.

---

### Phase 3: Remediate Host-Path Violations

**Foundation Check-In**: Re-read the rule capture and the
practice-index structure. Goal: each removed outbound link from a
Core file is replaced by either portable language or a cross-link
that lives in the practice-index instead.

**Key Principle**: Move addressing into the bridge. Rewrite Core
prose so that the *concept* is named portably, and any host-specific
link is the practice-index's responsibility.

#### Task 3.1: Port PDR cross-doc links into practice-index

**Target Files** (Core side — portable rewrite):

- `practice-core/decision-records/PDR-038-*.md`
- `practice-core/decision-records/PDR-039-*.md`
- `practice-core/decision-records/PDR-040-*.md`
- `practice-core/decision-records/PDR-041-*.md`
- `practice-core/decision-records/PDR-042-*.md`
- `practice-core/decision-records/PDR-026-*.md`

**Target File** (host side — collect addressing):

- `.agent/practice-index.md` (extend the appropriate
  cross-reference table; do not add a moving-target count of how
  many references it now carries).

**Changes**:

- For each PDR, replace `../../../docs/...` and `../../<surface>/...`
  links with portable language.
- Where the cross-reference is load-bearing for the PDR's argument,
  add a row to the practice-index that resolves the local repo's
  ADR or surface; the PDR refers to the *concept* and notes "see
  practice-index for the local cross-reference".
- Where the cross-reference is decorative or duplicative, delete it
  and tighten the prose.

**Acceptance Criteria**:

1. ✅ All targeted PDRs pass the scanner's repo-path-escape check.
2. ✅ Practice-index gains the cross-reference rows where they are
   load-bearing; rows are coherent with existing practice-index
   structure.
3. ✅ PDR prose still reads as a complete argument without the
   removed outbound links — the load-bearing concepts are named in
   portable language.
4. ✅ No PDR loses substantive content.
5. ✅ `pnpm markdownlint:root` passes.

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: practice-core repo-path-escape violations now empty
# (other classes may still be red until Phase 4 lands).

pnpm markdownlint:root
# Expected: exit 0.

git diff --stat .agent/practice-core/ .agent/practice-index.md
# Expected: PDR files net-smaller or roughly even; practice-index
# net-larger; no other files touched.
```

**Task Complete When**: All targeted PDRs pass the repo-path-escape
check; practice-index extension is coherent.

---

### Phase 4: Remediate Inline ADR Mentions in Trinity Prose

**Foundation Check-In**: Re-read the rule capture; pay attention to
the templates-vs-live-references distinction.

**Key Principle**: Templates may legitimately use `ADR-{NNN}` as a
placeholder shape; live references must be ported.

#### Task 4.1: Port live ADR references in trinity files

**Target Files**:

- `practice-core/practice.md`
- `practice-core/practice-lineage.md`
- `practice-core/practice-bootstrap.md`
- `practice-core/CHANGELOG.md`

**Changes**:

- Distinguish template placeholders (e.g. `ADR-{NNN}: {Title}`,
  `[ADR-{NNN}]({filename})`) from live references.
- Rewrite live references in portable language; route the actual
  cross-link through practice-index where load-bearing.
- For `CHANGELOG.md`: a CHANGELOG entry that names a specific local
  ADR (e.g. "ADR-165") describes a *host-specific* recording of a
  Core change. The portable form names the *Core change* and notes
  that the host repo records its adoption separately. Practice-index
  carries the actual ADR cross-link.
- Template placeholders stay; document the brace-delimited form is
  intentional in a brief inline comment so the scanner's special
  case (already in Phase 2) is owner-visible.

**Acceptance Criteria**:

1. ✅ All trinity files pass the scanner's ADR-mention check.
2. ✅ Template placeholders preserved and clearly distinguished from
   live references.
3. ✅ Practice-index extended where the live reference is
   load-bearing.
4. ✅ Trinity prose still reads as a complete argument.
5. ✅ `pnpm markdownlint:root` and `pnpm practice:fitness:strict-hard`
   pass on all four files.

**Deterministic Validation**:

```bash
pnpm portability:check
# Expected: practice-core ADR-mention class now empty.

pnpm practice:fitness:strict-hard
# Expected: exit 0; no fitness regression on trinity files.

pnpm markdownlint:root
# Expected: exit 0.
```

**Task Complete When**: All trinity files pass the ADR-mention check;
fitness and markdownlint both green.

---

### Phase 5: Closure Proof

**Foundation Check-In**: Re-read all three foundation directives.
Verify the structural-enforcement principle is satisfied, not just
asserted.

#### Task 5.1: Full quality-gate sweep and consolidation

**Acceptance Criteria**:

1. ✅ `pnpm portability:check` exits 0 across the whole repo.
2. ✅ All other standard gates green (see Validation Checklist below).
3. ✅ A subsequent re-run of the Phase 0 scanner produces an empty
   inventory, confirming structural closure.
4. ✅ Distilled.md `§ Process` entry for the rule remains as captured
   on 2026-05-01 — no edit needed; the rule did not change.
5. ✅ `feedback_practice_core_portability_strict` memory unchanged.
6. ✅ Plan moved to `archive/completed/` after closure.
7. ✅ Consolidation pass via `/jc-consolidate-docs` — verifies no
   doctrine is trapped in this plan body.

**Deterministic Validation**:

```bash
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm practice:fitness:strict-hard

# Re-run the inventory script from Phase 0; expect empty:
grep -REn '\]\(\.\./\.\./' .agent/practice-core/ | wc -l
grep -REn '(ADR-[0-9]{3}|architectural-decisions/[0-9]{3})' .agent/practice-core/ | wc -l
# Both expected: 0 (modulo legitimate template placeholders, which
# the scanner's exception logic must already handle).
```

**Task Complete When**: All gates green; inventory empty;
consolidation pass complete.

---

#### Task 5.2: Foundation Document Compliance Checklist

- [ ] **principles.md — Architectural correctness**: scanner enforces
      the rule mechanically, not by convention.
- [ ] **principles.md — No type shortcuts**: scanner code is
      concretely typed; no `any`, `as`, or `@ts-expect-error`.
- [ ] **principles.md — No compatibility layers**: existing scanner
      extended; no parallel implementation.
- [ ] **principles.md — Quality gates**: all gates pass.
- [ ] **testing-strategy.md — RED first**: Phase 1 tests failed for
      the right reason before Phase 2 implementation.
- [ ] **testing-strategy.md — Behaviour not implementation**: tests
      assert "scanner flags violation X", not "scanner uses regex Y".
- [ ] **schema-first-execution.md analogue**: pattern definitions
      recorded before scanner code.
- [ ] **System-level impact**: portability constraint now durable
      across future authoring; rule will not silently rot.

**Task Complete When**: All checklist items checked; any unchecked
item has documented justification or is fixed.

---

## Testing Strategy

### Unit Tests

Phase 1 fixtures cover the five canonical cases (three violations,
two allowed). The existing
`scripts/validate-portability.unit.test.ts` is the natural home;
extend its fixture pattern.

### Integration Tests

The scanner already runs end-to-end as part of `pnpm portability:check`.
The integration test is implicit: after Phase 4, the scanner against
the live repo must exit 0. Phase 5's closure-proof commands are the
integration validation.

### E2E Tests

Not applicable.

---

## Success Criteria

### Phase 0

- ✅ Pattern definitions recorded; inventory captured to ephemeral
  surface.

### Phase 1

- ✅ Tests fail for the right reason (no implementation yet).

### Phase 2

- ✅ Tests green on fixtures; scanner red against live repo.

### Phase 3

- ✅ Repo-path-escape class empty across `practice-core/`.

### Phase 4

- ✅ ADR-mention class empty across trinity prose.

### Phase 5

- ✅ Scanner empty across all classes; all quality gates green.

### Overall

- ✅ The owner-stated rule from 2026-05-01 has structural
  enforcement.
- ✅ Existing prior-art violations remediated.
- ✅ Practice-index extended coherently to carry host-specific
  addressing the Core no longer carries.
- ✅ Plan body itself complies with the no-moving-targets rule
  (no embedded counts that change with ordinary work).

---

## Dependencies

**Blocking**: none. Existing scanner infrastructure
(`pnpm portability:check` and its helper file) is already in place
and is the canonical extension point.

**Related Plans (out of scope, sequenced after this plan)**:

- *Multi-checkout merge handling for fitness-managed files* —
  drivers for append-by-date logs and JSON state, a focused
  post-merge reconciliation command, pre-merge CI gate, and
  pre-commit warning. Discussed at session-open 2026-05-01.
  Sequenced after the fitness-frontmatter manifest sweep.
- *Fitness-frontmatter manifest sweep* — ensure every file that
  should be fitness-managed has the frontmatter so enforcement
  can key on the manifest. Pre-requisite for the merge-handling
  plan.
- *Moving-targets remediation in permanent docs* — same shape
  (structural enforcement of an owner-stated rule) on a different
  surface. Practice-index is the obvious starting point; route
  count-prose through generated indexes or named pointers.

**Prerequisites**:

- ✅ `pnpm portability:check` exists and is wired into CI.
- ✅ Practice-index exists and is the documented bridge between
  Core and host repo.
- ✅ Rule captured in `distilled.md § Process` and platform memory
  (`feedback_practice_core_portability_strict`).

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: Why does Practice-Core portability matter, and why
does enforcing it structurally matter?

**Immediate Value**:

- **Portability protected**: every future Core hydration into a new
  repo cannot silently break on a dead outbound link.
- **Authoring discipline**: future PDRs and trinity edits cannot
  reintroduce the violation class without the scanner objecting.
- **Reviewer load reduced**: a constraint that previously needed
  human attention is now mechanical.

**System-Level Impact**:

- **The Practice travels intact**: this is the load-bearing claim of
  the whole Practice-Core architecture. A scanner that fails-closed
  on outbound leakage is what makes "by construction" honest.
- **General pattern reinforced**: every owner-stated principle that
  graduates to structural enforcement extends the durability of the
  Practice; this plan is one instance of the general
  PDR-038-shaped pattern.
- **Trust in the seam**: the practice-index becomes the single
  unambiguous bridge; future agents know exactly where to put
  host-specific addressing.

**Risk of Not Doing**:

- **Silent rot**: each new PDR has, on the evidence, a non-trivial
  chance of reintroducing the violation; without enforcement, the
  Core grows progressively less portable.
- **Practice transplantation breaks**: a Core hydrated into a new
  repo discovers dead links at use time, not at hydration time.
- **The doctrine pattern weakens**: failing to follow up on
  "stated principles require structural enforcement" with structural
  enforcement is itself the failure mode the principle names.

### Alignment

**From `testing-strategy.md`**:

> RED first; tests must fail for the right reason before implementation
> exists.

**From `principles.md`**:

> Quality gates run frequently; do not let drift accumulate.

**From `distilled.md § Process`**:

> Stated principles require structural enforcement.

**This Plan**:

- ✅ Phase 1 is RED before Phase 2 is GREEN.
- ✅ Quality gates run after every task and every phase.
- ✅ The owner-stated rule gets structural enforcement, not just a
  doctrine entry.
- ✅ The plan body itself complies with the no-moving-targets rule.

---

## References

- Rule capture: `.agent/memory/active/distilled.md § Process` (entries
  added 2026-05-01).
- Scanner code: `scripts/validate-portability.ts` and
  `scripts/validate-portability-helpers.ts`.
- Existing portability plan (completed):
  `.agent/plans/agent-tooling/current/agent-infrastructure-portability-remediation.plan.md`.
- Practice-index bridge: `.agent/practice-index.md`.
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

---

## Implementation Notes

### Key Insight

The fitness frontmatter and the practice-index bridge already exist.
This plan does not create new architecture; it tightens an existing
seam (the practice-index) to be the *single* outbound exception, and
makes the resulting rule mechanical via an existing scanner.

### Migration Path

1. **Phase 0**: Reproduce the inventory mechanically; record patterns.
2. **Phase 1**: RED tests against the patterns.
3. **Phase 2**: Scanner check turns the tests green; flags the live
   repo.
4. **Phase 3**: Port host-path violations into practice-index.
5. **Phase 4**: Port ADR mentions in trinity prose.
6. **Phase 5**: Closure proof; scanner empty across all classes.

### Minimal Risk

- **Scanner extension is additive**: existing checks unchanged; new
  check returns issues using the same shape.
- **Remediation is mostly relocation**: most outbound links have a
  natural home in practice-index; few rewrites needed.
- **Templates are explicitly distinguished from live references**:
  the `ADR-{NNN}` placeholder shape is preserved, so
  `practice-bootstrap.md`'s teaching value is not eroded.
- **No fitness regression by design**: practice-index gains rows;
  Core files net-shrink or stay flat; trinity files net-stay-flat
  after portable rewrites. Fitness gate confirms.

---

## Validation Checklist

```bash
pnpm portability:check
pnpm test:root-scripts
pnpm test
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm practice:fitness:strict-hard

# Stability (10 reruns, scanner output unchanged):
for i in {1..10}; do
  echo "Run $i/10"
  pnpm portability:check || break
done

# Independent inventory cross-check (must agree with scanner):
grep -REn '\]\(\.\./\.\./' .agent/practice-core/
grep -REn 'ADR-[0-9]{3}' .agent/practice-core/ | grep -v '{NNN}'
```

**Expected Results**:

- ✅ All commands exit 0.
- ✅ Independent inventory: empty for repo-path-escapes; empty for
  live ADR mentions (template placeholders excluded).
- ✅ Scanner output stable across 10 reruns.

---

## Code Quality Verification

```bash
# 1. No type shortcuts in scanner extension.
grep -REn '\b(as |any\b|@ts-expect-error)' scripts/validate-portability.ts scripts/validate-portability-helpers.ts
# Expected: pre-existing matches only; no new ones introduced.

# 2. New helper exported and unit-tested.
grep -E 'getPracticeCorePortabilityIssues' scripts/validate-portability-helpers.ts scripts/validate-portability.unit.test.ts scripts/validate-portability.ts
# Expected: appears in helper definition, unit test, and aggregator.

# 3. Allowed-exception logic is documented inline.
grep -B2 -A2 'practice-index' scripts/validate-portability-helpers.ts
# Expected: a brief comment explaining why this is the single allowed
# outbound target.

# 4. No new disabled checks.
git diff main..HEAD -- scripts/ | grep -E '(eslint-disable|@ts-(expect-error|ignore)|sonar-disable)'
# Expected: no new matches.
```

---

## Consolidation

After all work is complete and quality gates pass, run
`/jc-consolidate-docs` to graduate any settled content, extract
reusable patterns, rotate the napkin, manage fitness, and update the
practice exchange.

---

## Future Enhancements (Out of Scope)

- *Generalised "portable-by-construction" rule for other layers* —
  some directives and shared rule files may benefit from a similar
  strict outbound constraint. Evidence-led; not in scope here.
- *Per-violation auto-fix suggestions* — the scanner could emit
  proposed practice-index rows for each removed outbound link. Useful
  but not load-bearing for closure.
- *CI annotation rendering* — turn scanner output into PR-line
  annotations. Quality-of-life improvement; depends on existing CI
  annotation infrastructure.
- *PDR/ADR amendment* — if the strict rule warrants an amendment to
  ADR-124 / PDR-007, it lives in a separate session. The rule is
  currently captured in `distilled.md § Process` and platform memory.
