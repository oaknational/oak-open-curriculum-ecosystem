---
name: "Pre-2026-02-15 Experience Corpus — Concept-Home Extraction"
overview: >
  Apply the concept-home discipline to the ~80 pre-2026-02-15
  experience files. For each file: identify which concepts live in
  the subjective register (stay) vs which have a canonical home
  (cite the home, drop the local restatement). Preserves the
  experience directory's purpose as a subjective register and
  recovers stranded insight to its proper canonical home. Not a
  "cleanup" or "archive" pass — a per-file concept-placement audit
  with the existing audit-trail discipline.
parent: ../current/2026-04-29-deferred-items-coordination.md
todos:
  - id: phase-0-corpus-classification
    content: "Classify the ~80 pre-2026-02-15 files into high-drift / mid-drift / low-drift / clean per the 2026-04-29 experience-audit sub-agent report. Save the classification table as a phase-0 evidence file."
    status: pending
  - id: phase-1-high-drift-batch
    content: "For each high-drift file: per-file concept-home pass. Identify the technical content's canonical home (distilled.md, ADR, governance doc, TSDoc, pattern). Cite the home from the file. Preserve subjective texture. Pattern candidates that emerged from the drift get added to .agent/memory/active/patterns/ if proven."
    status: pending
  - id: phase-2-mid-drift-batch
    content: "Same concept-home pass on mid-drift files; some may collapse to brief subjective stubs cross-referencing the canonical home."
    status: pending
  - id: phase-3-borderline-pass
    content: "Borderline files (low/no drift) verified clean; flag any that should not stay in the experience directory at all (e.g. session-handoff documents masquerading as experience)."
    status: pending
  - id: phase-4-pattern-graduation-pass
    content: "Run the cross-experience pattern scan from the 2026-04-29 audit report's purpose-(c): emergent patterns surfaced that are still valid as candidates."
    status: pending
  - id: phase-5-validate
    content: "Run pnpm format:root, pnpm markdownlint:root; confirm no broken links to canonical destinations; confirm experience-directory README still describes the register correctly."
    status: pending
isProject: false
---

# Pre-2026-02-15 Experience Corpus — Concept-Home Extraction

**Parent**:
[`../current/2026-04-29-deferred-items-coordination.md`](../current/2026-04-29-deferred-items-coordination.md).
**Created**: 2026-04-29 (deferred from 2026-04-29 deeper convergence
pass).
**Status**: FUTURE — queued for owner-directed scheduling. Not urgent;
the post-2026-02-15 corpus shows the audit discipline working as
intended.

## Context

The 2026-04-29 experience-audit sub-agent report identified that the
`.agent/experience/` directory has two epochs:

- **Post-2026-02-15 (~60 files)**: healthy as a subjective register.
  Authors follow the README template; "Technical content" sections
  point outward to ADRs / distilled / patterns rather than encoding
  doctrine inline.
- **Pre-2026-02-15 (~80 files)**: drifted. Authored before the README
  template stabilised and before the consolidate-docs §4 audit
  explicitly named purposes (a) preserve purpose, (b) recover
  stranded insight, (c) surface emergent patterns. Many files mix
  subjective journey with code blocks, principles, architecture
  descriptions, and rule statements that should live elsewhere.

The pre-2026-02 corpus is a one-time concept-placement backlog. This
plan applies the same concept-home discipline used in the 2026-04-29
displaced-doctrine extraction (4-of-6 plans landed): for each file,
identify what is genuinely subjective register (stays) vs what is
technical concept that already has a canonical home (cite the home,
strip the local restatement).

This is not a "cleanup" or "archival" pass. The substance is concept
placement — deciding, for each piece of inline technical content,
where it actually lives now and citing that home from the file.
Line count and file count are downstream consequences of correct
placement, not goals.

## High-drift files (per audit report, ~25 files)

Files where the technical content is the substance and the
subjective wrapping is thin. Candidates for full archival OR
substantial concept-home routing. Examples:

- `2025-08-08-technical-wisdom.md`
- `phase-4-test-quality-revolution.md`
- `phase-4-conditional-dependency-insight.md`
- `phase-4-architectural-clarity.md`
- `phase-3-biological-architecture-reflections.md`
- `phase-4-completion-reflection.md`
- `phase-4-env-loading-complexity.md`
- `phase-3-data-driven-execution.md`
- `phase-6-1-2-sdk-core-implementation.md`
- `phase-6-1-sdk-implementation-learnings.md`
- `phase-6-1-tdd-type-generation.md`
- `phase-6-learning-from-failure.md`
- `phase-6-type-generation-tdd.md`
- `2025-08-13-phase-6-validation-implementation.md`
- `2025-08-13-runtime-isolation-gerome.md`
- `2025-08-13-clyde-adr-refactor-collaboration.md`
- `2025-08-13-zod-validation-journey.md`
- `2025-01-11-sdk-e2e-type-safety.md`
- `2025-01-11-oak-curriculum-mcp-type-safety-journey.md`
- `2025-01-03-substrate-as-system-physics.md`
- `compilation-time-revolution-completion.md`
- `oak-curriculum-api-deep-dive.md`
- `type-preservation-breakthrough.md`
- `type-predicates-over-assertions.md`
- `type-assertion-archaeology.md`
- `typescript-dynamic-dispatch-limitation.md`
- `the-test-deletion-philosophy.md`
- `the-zod-validator-melancholy.md`

For each: confirm doctrine has a canonical home (most do already;
e.g. ADR-022 carries graceful-degradation; ADR-038 carries
compilation-time-revolution); cite the home from the file; preserve
subjective texture; consider whether the file should be archived
out of `experience/` if the subjective wrapping is thin.

## Mid-drift files (per audit report, ~12 files)

Partly technical, doctrine in numbered/bulleted form. Lighter
concept-home pass; some may collapse to brief subjective stubs
cross-referencing the canonical home.

## Phases

### Phase 0 — Corpus classification

1. Pull the audit report's classification (high / mid / low / clean)
   and rebuild a per-file table.
2. For each high/mid file: identify the dominant concept(s) in the
   technical content and the canonical home.
3. Save the table as `pre-2026-02-15-experience-corpus.phase-0-evidence.md`
   alongside this plan.

### Phase 1 — High-drift batch

For each high-drift file (~25 files):

1. Read the file fully.
2. For each concept currently inline as technical content: locate the
   canonical home (ADR, distilled, governance doc, TSDoc, pattern).
3. If the canonical home exists, cite from the file and strip the
   local restatement.
4. If the canonical home does NOT exist, surface as a graduation
   candidate (PDR-shaped, ADR-shaped, pattern-shaped).
5. Preserve subjective texture (qualia content; "what work was like";
   surprise narratives; reflective passages).
6. If the entire file is a session-handoff or technical post-mortem
   masquerading as experience (e.g. `compilation-time-revolution-
   completion.md`): mark for full archival to a session-history archive.

May dispatch a sub-agent for the read-mostly batch; the per-file
edits are individually low-risk.

### Phase 2 — Mid-drift batch

Same pass at lighter weight. Some files may collapse to brief
subjective stubs.

### Phase 3 — Borderline pass

Verify low-drift / clean files remain clean. Flag any that should
not stay in `experience/` at all.

### Phase 4 — Cross-experience pattern scan

Re-run the consolidate-docs §4 purpose-(c) cross-experience pattern
scan on the pre-2026-02 corpus once the inline drift has cleared.
The audit report named several emergent patterns from this corpus
that may now be ready to graduate (`workaround-gravity`,
`silent-degradation-in-green-systems`, `plans-are-load-bearing-and-
age`, etc.) — these are already in the Pending-Graduations Register
and may have promotion criteria met after the cross-scan.

### Phase 5 — Validation

- `pnpm format:root` — fix line-width issues from the additions of
  cross-references.
- `pnpm markdownlint:root` — enforce link integrity and structure.
- Spot-check that canonical homes named from cited files actually
  exist and contain the substance.
- Confirm `.agent/experience/README.md` still accurately describes
  the register and the audit purposes.

## Acceptance Criteria

- [ ] Phase 0 evidence file documents per-file disposition.
- [ ] Every high-drift file's inline doctrine has a canonical home
      cited (or a graduation candidate raised).
- [ ] Subjective register is preserved across the corpus.
- [ ] No broken links to canonical destinations.
- [ ] The post-2026-02-15 corpus continues to look like the
      pre-2026-02-15 corpus does after this work — texture-led with
      cross-references outward.

## Reviewers

- `docs-adr-reviewer` — verify the citations to canonical homes are
  accurate.
- `code-reviewer` — final pass.

## Risk

Low. Read-mostly work with localised edits. Preserves history (the
`experience/` directory itself remains; files are not deleted unless
they are session-handoff/post-mortem misclassifications). Subjective
register is the explicitly named goal.

The principal risk is over-stripping: removing texture that reads
"doctrinal" but is actually genuinely subjective. Mitigation: the
audit report's classification (high / mid / low / clean) is
load-bearing; trust the classification rather than re-judging.

## Cross-References

- Parent:
  [`../current/2026-04-29-deferred-items-coordination.md`](../current/2026-04-29-deferred-items-coordination.md).
- Audit report: 2026-04-29 experience-audit sub-agent output (full
  text in repo-continuity Deep Consolidation Status entry for that
  date).
- Sibling pattern surface: `.agent/memory/active/patterns/`
  (where graduated patterns from this corpus may land).
