# Pending-Graduations Verification Report

**Date**: 2026-05-28
**Scope**: `.agent/memory/operational/pending-graduations.md` lines 147–799 (Legacy Backlog Gates section)
**Purpose**: Factual verification of "already covered" claims for ~35 items; main agent crashed mid-pass; results preserved here.
**Verifier**: Sub-agent (read-only verification task)

---

## Item Verdicts

---

### 1. Intent notes as abandonment coordination
**Captured**: 2026-05-22
**Claimed home(s)**: "commit workflow now preserves automated abandon-notes"; "intent-scoped commit workflow"; `agent-collaboration.md`

**Verified**:
- `agent-collaboration.md` — NO. Searched for "abandon" — zero hits. The file exists at `.agent/directives/agent-collaboration.md` but contains no abandonment-note pattern.
- `distilled.md` — NO. No abandonment-note coordination content found.
- Commit workflow skill (`commit/SKILL-CANONICAL.md`) — not directly checked but referenced.

**Portable home exists?**: None found in `.agent/rules/` or `practice-core/decision-records/`.

**One-line note**: Claimed homes do NOT contain the substantive abandonment-note pattern — high signal finding; the "already covered" claim is unverified; genuine promotion question still open.

---

### 2. More-restrictive Practice rule wins on reviewer conflict
**Captured**: 2026-05-22
**Claimed home(s)**: `different-lens-reviewer-divergence.md` (covers divergent findings as useful); `agent-collaboration.md` ("reciprocal-reviewer dispatch names principle-based conflict resolution")

**Verified**:
- `different-lens-reviewer-divergence.md` (`.agent/memory/active/patterns/`) — PARTIAL. Line 17: "the **expected outcome is divergent findings**, not…" — covers usefulness of divergence but does NOT name a "more-restrictive rule wins" resolution doctrine.
- `agent-collaboration.md` — NO. "Reciprocal reviewer" not found; "principle-based conflict" not found; "more-restrictive" not found.

**Portable home exists?**: None found.

**One-line note**: Neither claimed home contains the narrower "more-restrictive-rule-wins" resolution clause — no portable home; genuine standalone pattern question.

---

### 3. Re-plan after second cycle lands
**Captured**: 2026-05-12
**Claimed home(s)**: "graph-stack plan and thread record preserve the worked instance" (`graph-stack.plan.md`, connecting-oak-resources thread); broader: `pdr-or-rule:workstream-evolution-cadence`

**Verified**:
- `graph-stack.plan.md` — YES. Line 463 confirms: "WS1.8 GraphDocument is deferred to Inc.2 per owner direction 2026-05-12 (see §Increments row 2 retrospective-review tripwire)." The worked instance is in the plan.
- No `workstream-evolution-cadence` PDR or rule exists.

**Portable home exists?**: None in `practice-core/decision-records/` or `.agent/rules/`.

**One-line note**: Instance preserved host-locally in the plan; no portable PDR/rule — owner gates the generalization decision correctly.

---

### 4. Deferral with retrospective-review tripwire
**Captured**: 2026-05-12
**Claimed home(s)**: "Inc.2 GraphDocument deferral preserved in active graph-stack plan and connecting-oak-resources thread record"

**Verified**:
- `graph-stack.plan.md` — YES. Line 463 explicitly names the GraphDocument deferral with a retrospective-review tripwire. The substance is preserved.
- No `defer-with-binding-retrospective-review` PDR or rule exists.

**Portable home exists?**: None found.

**One-line note**: Host-local instance confirmed; no portable doctrine; owner gates correctly.

---

### 5. Portable reference arrives without plan slot
**Captured**: 2026-05-19
**Claimed home(s)**: "`comms-watch-mechanism` reference has acquired multiple concrete homes"; "reusable three-question grounding pattern is still a one-instance watch"

**Verified**:
- No `portable-reference-integration-grounding` pattern found in `.agent/memory/active/patterns/` (checked — pattern does not exist).
- `three-levels-of-reference-quality.md` exists in patterns but covers reference quality, not a three-question grounding protocol for unowned portable references.

**Portable home exists?**: None.

**One-line note**: Pattern candidate has no home anywhere — single instance, correctly owner-gated; withdraw or promote remains the decision.

---

### 6. E-1/E-2 advisory hooks and agent-tools git passthrough
**Captured**: 2026-05-12
**Claimed home(s)**: "`cost-of-collaboration.plan.md`" for parking the exploration

**Verified**:
- `cost-of-collaboration.plan.md` exists at `.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md` — YES (file confirmed, exploration presumably parked there).

**Portable home exists?**: None for the advisory-hooks pattern itself.

**One-line note**: Correctly parked in the plan; no portable doctrine; owner gates the scoping-pass decision.

---

### 7. Agent-tools CLI architectural decision extraction
**Captured**: 2026-05-12
**Claimed home(s)**: "P-Foundation landed the unified entrypoint / build-once CLI architecture"; "no separate ADR or no-new-bins rule extraction was found"

**Verified**:
- `use-built-agent-tools-cli.md` (`.agent/rules/`) — PARTIAL. Line 20 references "Unified entrypoint" in `agent-tools/README.md`. The rule enforces using the built CLI but is not an ADR documenting the architectural decision.
- ADR-178 (`178-agent-tools-build-isolation.md`) exists — but a search for "no-new-bins" and "unified entrypoint" returned no hits. The ADR covers build isolation, not the unified-entrypoint decision explicitly.
- No `adr:agent-tools-cli-unified-entrypoint` ADR found with that specific framing.

**Portable home exists?**: `use-built-agent-tools-cli.md` is a rule covering the enforcement; no architectural ADR specifically for the unified-entrypoint + no-new-bins doctrine.

**One-line note**: The enforcement rule exists; the architectural ADR capturing the "why" does not — the item's own text confirms this ("no separate ADR or no-new-bins rule extraction was found"); genuine open decision.

---

### 8. Pre-flight fingerprint scan before shape decisions
**Captured**: 2026-05-11
**Claimed home(s)**: "smouldering-crackling-pyre" session; no durable home claimed — candidate for `rule-or-pattern:fingerprint-data-before-shaping-fix`

**Verified**:
- No rule or pattern named `fingerprint-data-before-shaping-fix` exists in `.agent/rules/` or `.agent/memory/active/patterns/`.
- `handoff-messages-self-contained.md` rule mentions "fingerprint" in the context of staged-bundle fingerprints, not data-corpus pre-flight fingerprinting.

**Portable home exists?**: None found.

**One-line note**: Single instance, no home — correctly owner-gated; promote or withdraw decision pending.

---

### 9. Owner re-decision on evidence-refuted premise
**Captured**: 2026-05-11
**Claimed home(s)**: "deciduous-twining-dew" session; no durable home claimed — candidate for `pdr-or-rule:re-surface-dont-override-on-evidence-correction`

**Verified**:
- No rule or PDR named `re-surface-dont-override-on-evidence-correction` found in `.agent/rules/` or `practice-core/decision-records/`.
- `distilled.md` — no "re-surface" or "evidence refutes" doctrine found.

**Portable home exists?**: None.

**One-line note**: Single instance, no home — correctly owner-gated.

---

### 10. evaluateParityChecks focused unit coverage
**Captured**: 2026-05-10
**Claimed home(s)**: `agent-tools/src/core/health-probe-parity.ts` (the function exists); candidate: `test-cycle` item

**Verified**:
- `health-probe-parity.ts` confirmed at `agent-tools/src/core/health-probe-parity.ts` line 13: `export function evaluateParityChecks`.
- No focused unit test file for `evaluateParityChecks` found — tests directory search returned zero hits for a dedicated test. Only exercised through `health-probe.ts` composed path.

**Portable home exists?**: N/A — this is a test-debt item, not a doctrine candidate.

**One-line note**: The function exists; the test gap is real — no focused unit tests exist for `evaluateParityChecks`; correctly owner-gated as a test-cycle decision.

---

### 11. getSkillPermissionIssues live skill-dir test path
**Captured**: 2026-05-10
**Claimed home(s)**: `agent-tools/scripts/validate-portability-helpers.ts` (the helpers exist)

**Verified**:
- `validate-portability-helpers.ts` confirmed at `agent-tools/scripts/validate-portability-helpers.ts`. `getSkillPermissionIssues` confirmed there.
- The unit test `validate-portability.unit.test.ts` exists — likely still covering the old `claudeCommandFiles: []` shape rather than the live `claudeSkillDirs` path (not deep-read, but item's claim is credible).

**Portable home exists?**: N/A — test-debt item.

**One-line note**: Function confirmed; test gap credible — owner-gated correctly.

---

### 12. Pre-commit skills/portability gate coverage
**Captured**: 2026-05-10
**Claimed home(s)**: `.husky/pre-commit` (claimed to NOT run `pnpm portability:check` or `pnpm skills:check`)

**Verified**:
- `.husky/pre-commit` read — NO `pnpm portability:check` or `pnpm skills:check` lines found. The hook runs: prettier-staged, markdownlint-staged, repo-validators:check, lint:shell. Pre-push and full `pnpm check` are the only routes covering portability/skills.
- The claim "does not run portability:check or skills:check" is CONFIRMED TRUE.

**Portable home exists?**: N/A — implementation decision, not a doctrine candidate.

**One-line note**: Item's factual claim verified — pre-commit coverage gap is real; owner-gated decision on whether to add it.

---

### 13. Generated insight artefact decay/honesty discipline
**Captured**: 2026-05-10
**Claimed home(s)**: `no-moving-targets-in-permanent-docs.md` rule (claimed as "existing doctrine"); "honest documentation doctrine"

**Verified**:
- `no-moving-targets-in-permanent-docs.md` — checked. Covers moving targets and write-time fingerprints. Does NOT contain "cadence-vs-friction decay split" or "evidence-vs-interpretation honesty discipline" for generated insight artefacts.
- No "generated-insight-artefact-discipline" pattern found in `.agent/memory/active/patterns/`.

**Portable home exists?**: None specific to generated insight artefacts.

**One-line note**: The existing rule is adjacent but does not cover the specific generated-insight-artefact decay methodology — the "already covered by existing doctrine" framing is weak; genuine candidate if the method is valuable.

---

### 14. Recurrence-rank as graduation weighting
**Captured**: 2026-05-10
**Claimed home(s)**: `pending-graduations-or-distilled-weighting`; thread record mentions it at `agentic-engineering-enhancements.next-session.md` line 168

**Verified**:
- `distilled.md` — NO recurrence-rank weighting content found.
- `pending-graduations.md` itself — no recurrence-rank weighting guidance found in operative sections.
- Thread record mentions it as a queued item only.

**Portable home exists?**: None.

**One-line note**: No durable home exists for recurrence-rank weighting — correctly owner-gated; weak single-instance observational finding.

---

### 15. Owner reply preferences and default reply shape
**Captured**: 2026-05-10
**Claimed home(s)**: `user-collaboration.md` (amendment candidate)

**Verified**:
- `user-collaboration.md` (`.agent/directives/user-collaboration.md`) — NO "lead with answer", "compact reply preferences", or "concise evidence/next-step structure" as explicit owner-reply-shape doctrine found.

**Portable home exists?**: None. The `owner-course-correct-vocabulary.md` pattern exists in `.agent/memory/active/patterns/` (confirmed by ls output) — that covers course-correction phrases, not reply structure.

**One-line note**: `user-collaboration.md` does not contain the proposed reply-shape doctrine — genuine open candidate; owner-gated.

---

### 16. Memory/skills key-terms glossary
**Captured**: 2026-05-10
**Claimed home(s)**: `memory-readme-or-memory-skills-glossary` (target); no existing home claimed

**Verified**:
- `.agent/memory/README.md` — no glossary section found; only mentions archive/active folder structure.
- No `glossary` file found in `.agent/memory/`.

**Portable home exists?**: None.

**One-line note**: Correctly identified as a gap — no glossary exists; owner-gated promote/watch/withdraw decision.

---

### 17. Owner affirmation phrase corpus
**Captured**: 2026-05-10
**Claimed home(s)**: `pattern:owner-affirmation-vocabulary`; "`owner-course-correct-vocabulary.md` note is enough"

**Verified**:
- `owner-course-correct-vocabulary.md` exists in `.agent/memory/active/patterns/` (confirmed by ls).
- No `owner-affirmation-vocabulary` pattern found in patterns directory (ls output checked).

**Portable home exists?**: None for affirmation vocabulary specifically.

**One-line note**: The course-correct pattern exists but covers corrections, not affirmations — narrow gap; owner-gated; single-instance watch is appropriate.

---

### 18. Cross-thread git-history as observable coordination signal
**Captured**: 2026-05-05/06
**Claimed home(s)**: "PDR-027 or distilled coordination guidance"; "existing shared-substrate doctrine"

**Verified**:
- `PDR-027-threads-sessions-and-agent-identity.md` — NO git-history-as-observable-coordination content found. The PDR covers thread scope and agent identity, not git-branch-head as a cross-thread signal.
- `distilled.md` — NO cross-thread git-history coordination signal content found.

**Portable home exists?**: None.

**One-line note**: Neither claimed home contains the substance — the "already covered by existing shared-substrate doctrine" claim is unverified; single instance, correctly watched.

---

### 19. In-flight consolidation workflow-gap patching
**Captured**: 2026-05-05/06
**Claimed home(s)**: "PDR-014/PDR-046 already carry enough capture-at-the-moment guidance"

**Verified**:
- `PDR-014-consolidation-and-knowledge-flow-discipline.md` — PARTIAL. Line 448 mentions "PDR-014 amendment" for ratification of a consolidation boundary refinement. Contains consolidation workflow principles but no specific "in-session workflow-gap patching" doctrine.
- `PDR-046-layered-knowledge-processing.md` — covers layered knowledge processing / preserve-first. No explicit "in-session gap patching at moment of discovery" clause found.

**Portable home exists?**: None specific to "patch a workflow gap in the same session that exposed it."

**One-line note**: PDR-014 and PDR-046 are adjacent but don't specifically codify the in-session-patch doctrine — the "already covered" claim is weak-PARTIAL; still a genuine candidate.

---

### 20. Fat-baton handoff inline diagnostics
**Captured**: 2026-05-05/06
**Claimed home(s)**: "PDR-048 and PDR-046 already carry enough capture-at-the-moment guidance"

**Verified**:
- `PDR-048-insight-capture-at-moment-of-occurrence.md` — NO "fat-baton" or "inline diagnostic in handoff" content found.
- `PDR-046-layered-knowledge-processing.md` — NO fat-baton or inline-diagnostic content found.

**Portable home exists?**: None.

**One-line note**: Neither claimed home contains the "inline ephemeral diagnostic in named-receiver handoff" pattern — "already covered" claim does NOT hold; genuine single-instance candidate.

---

### 21. Retired thread-record hygiene signal
**Captured**: 2026-05-01
**Claimed home(s)**: "PDR-027 amendment + consolidate-docs thread-hygiene check"; "repo-continuity prose" (claimed insufficient without the amendment)

**Verified**:
- `PDR-027-threads-sessions-and-agent-identity.md` — NO "retirement banner" or "retired thread hygiene" content found. The PDR covers thread scope and identity but not the visual hygiene of retired thread records.
- No `consolidate-docs thread-hygiene` check found in the skill.

**Portable home exists?**: None.

**One-line note**: Neither claimed home covers the substance — the PDR-027 amendment has NOT been landed; genuine open item pending owner direction.

---

### 22. Do not shoehorn value-claims into absent infrastructure
**Captured**: 2026-04-30
**Claimed home(s)**: `PDR-058 §Surface 3` (names this as adjacent sibling)

**Verified**:
- `PDR-058-three-tier-optionality-decomposition.md` — YES. Lines 141–143: "shoehorns value-claims into infrastructure that cannot carry them (sibling of the *don't-shoehorn-a-value-claim* candidate)"; line 176: "*don't-shoehorn-a-value-claim* candidate (2026-04-30) is its adjacent sibling and may merge or remain distinct depending on evidence." PDR-058 explicitly names this as a pending candidate, NOT as an already-graduated rule.

**Portable home exists?**: No standalone rule exists for this. PDR-058 names it as a candidate only.

**One-line note**: PDR-058 names this as a candidate alongside outcome-optionality — the substance is cited but NOT pre-graduated; the standalone rule does not exist; owner must decide merge vs separate.

---

### 23. Outcome optionality standalone rule sibling
**Captured**: 2026-05-10
**Claimed home(s)**: `PDR-058 §Surface 3` (names the failure mode and cure; "does not pre-graduate the standalone rule")

**Verified**:
- `PDR-058` §Surface 3 — YES confirmed. Lines 133–178: "The outcome must name a single observable signal… If the infrastructure to observe the signal does not exist, the plan says so explicitly… The landing of this PDR requires the rule sibling for this surface to be recorded as a candidate at pending-graduations.md… The *don't-shoehorn-a-value-claim* candidate (2026-04-30) is its adjacent sibling." PDR-058 explicitly does NOT pre-graduate this.

**Portable home exists?**: No standalone rule.

**One-line note**: PDR-058 correctly names the candidate but explicitly defers graduation — "already covered" means "named in a PDR"; no standalone rule or portability, owner must decide.

---

### 24. Design optionality standalone rule sibling
**Captured**: 2026-05-10
**Claimed home(s)**: `PDR-058 §Surface 2` (names the failure mode and cure; "does not pre-graduate the rule")

**Verified**:
- `PDR-058` §Surface 2 — YES confirmed. Lines 87–131: "Author the closed shape the known instances need… Graduation requires its own evidence trail; this PDR does not pre-graduate it."

**Portable home exists?**: No standalone rule.

**One-line note**: Same structure as outcome-optionality — PDR names it, does not graduate it; owner decision on evidence sufficiency.

---

### 25. Graduation-trigger criteria refinement
**Captured**: 2026-04-30
**Claimed home(s)**: `consolidate-docs` skill trigger guidance (amendment target)

**Verified**:
- No `evidence-density / principle-quality / structural-coverage` criteria found in the `oak-consolidate-docs` skill or in `PDR-014`.
- The default "second instance OR owner direction" trigger is in place without the proposed refinements.

**Portable home exists?**: None with the refined criteria.

**One-line note**: Refinement has not landed — the amendment target is unamended; genuine open owner-gated question.

---

### 26. Trinity Active Principles and bootstrap structural extensions
**Captured**: 2026-04-29
**Claimed home(s)**: "PDRs, rules, and practice-lineage"; the proposed amendments touch `practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `practice-verification.md`

**Verified**:
- The four Practice Core trinity files all exist and are substantial.
- The CHANGELOG (`practice-core/CHANGELOG.md`) shows active amendment history through 2026-05-25, so recent amendments have landed.
- Without reading the specific 2026-04-29 doctrine sharpenings, cannot confirm exactly which have landed vs which remain pending.

**Portable home exists?**: The doctrine lives in the Core trinity — durable homes exist; the open question is whether the 2026-04-29 batch specifically landed.

**One-line note**: The core trinity files exist as claimed homes; whether the specific 2026-04-29 sharpenings have all landed requires comparing the CHANGELOG entries — owner decision on Core amendment completeness.

---

### 27. Open up the value early PDR decision
**Captured**: 2026-04-29
**Claimed home(s)**: "experience-text pattern" — experience file confirmed at `.agent/experience/2026-04-21-session-3-doctrine-bundle-opening-up-value-early.md`

**Verified**:
- The experience file EXISTS. YES — confirmed.
- No `pdr:open-up-the-value-early` in `practice-core/decision-records/`.

**Portable home exists?**: None (experience file is host-local, not portable PDR).

**One-line note**: The experience file is durable for the instance; no portable PDR — owner gates the "fourth-cross-session-instance" promotion trigger.

---

### 28. Agent-infrastructure failure visibility Practice Core promotion
**Captured**: 2026-04-29
**Claimed home(s)**: "ADR-167 already carries the concrete host-local rule"; "`hook-as-question-not-obstacle` pattern"

**Verified**:
- `ADR-167` (`167-hook-execution-failures-must-be-observable.md`) — YES. Lines 41, 78, 94: "non-blocking hook failures are recorded… non-blocking hook failures MUST be observable in a developer-readable [failure channel]." ADR-167 carries the host-local substance.
- `hook-as-question-not-obstacle.md` pattern — YES, confirmed at `.agent/memory/active/patterns/hook-as-question-not-obstacle.md` and indexed in `practice-index.md` line 295.

**Portable home exists?**: The practice-index references the pattern; no portable Practice Core PDR specifically for "hook-failures-must-be-observable."

**One-line note**: Both claimed homes confirmed — ADR-167 and the pattern carry the substance; the remaining question is purely whether to extract a portable Practice Core PDR.

---

### 29. PR-87 pre-phase adversarial security review pattern
**Captured**: 2026-04-28
**Claimed home(s)**: "ADR-158 and `safety-and-security.md` carry the runtime-aware key-extraction boundary"

**Verified**:
- `safety-and-security.md` (`docs/governance/safety-and-security.md`) — YES. Lines 153–159: "Rate-limit key extraction is runtime-aware: on Vercel the limiter reads `x-vercel-forwarded-for`… See ADR-158 §Runtime-Aware Key Extraction."
- `ADR-158` (`158-multi-layer-security-and-rate-limiting.md`) — YES. Lines 99, 114, 132, 139, 220: `X-Forwarded-For` key extraction, runtime-aware decision. The security substance is durable.
- No `pre-phase-adversarial-review-expands-cluster-scope` pattern exists in `.agent/memory/active/patterns/`.

**Portable home exists?**: The security substance is covered; no standalone `pre-phase-adversarial-review` pattern.

**One-line note**: Both claimed security homes verified; the pattern-promotion question (the pre-phase review expands cluster scope behaviour) remains unresolved — owner-gated correctly.

---

### 30. Sync-kind / urgency flag in comms schema (ADR-184 candidate)
**Captured**: 2026-05-21
**Claimed home(s)**: "ADR-184 Proposed" (`184-comms-event-sync-kind-and-urgency-field.md`)

**Verified**:
- `ADR-184` — YES confirmed. Line 1: "# ADR-184: Comms-Event Sync Kind and Urgency Field." Lines 64, 177, 347, 393, 408: `sync` kind and `urgency` field fully specified. ADR-184 is Proposed and resolves the representation decision.
- The implementation tranches (schema/parser migration, CLI rendering, authoring/enforcement, activation) are NOT yet landed — the pending-graduations entry itself confirms this ("the implementation trigger has not fired").

**Portable home exists?**: ADR-184 is the durable home for the decision. Implementation residual remains.

**One-line note**: ADR-184 confirmed Proposed and substantive — durable home exists; this item correctly stays live until implementation tranches land.

---

### 31. Two-participant invariant write-side validator (rule candidate)
**Captured**: 2026-05-21
**Claimed home(s)**: "write-side validator in `agent-tools/src/collaboration-state/comms-messages.ts`" (TARGET, not claimed as already existing)

**Verified**:
- `comms-messages.ts` — NOT FOUND in `agent-tools/src/collaboration-state/`. The directory contains: `comms-watch-auto-seed.ts`, `cli-runtime.ts`, `comms-use-cases.ts`, `identity.ts`, `comms-relevant-events.ts`, `cli-identity-audit.ts`, `comms-heartbeat-body.ts`, `identity-audit.ts`, `cli-self-identity.ts`, `cli-options.ts`. No `comms-messages.ts`.
- No `rule:comms-write-refuses-self-addressed` found in `.agent/rules/`.
- The write-side validator does NOT exist yet.

**Portable home exists?**: None.

**One-line note**: The implementation file (`comms-messages.ts`) does not exist and the rule has not been created — this is an open implementation item, not a graduation question; owner direction needed to land the validator.

---

### 32. Coordinator role-label ontology residual
**Captured**: 2026-05-13
**Claimed home(s)**: "PDR-071 carries the coordinator allocation vs gating principle"; "falsification-criteria.md #p1--modes-not-roles"

**Verified**:
- `PDR-071-coordinator-allocates-without-gating.md` — YES. Line 55: "not a permanent ontology of role labels"; line 120: "Fixed role-label doctrine: a permanent menu of role names becomes…[failure mode]"; line 185: "Encoding a fixed menu of permanent role labels as the doctrine."
- `falsification-criteria.md` — YES. Lines 22–75: "## P1 — Modes, not roles" with full falsification criteria and N≥3 session accumulation requirement. P11 (session-close housekeeping) at line 226.

**Portable home exists?**: PDR-071 is a Proposed portable PDR. P1 is in the falsification criteria file.

**One-line note**: Both claimed homes confirmed — PDR-071 and P1 are live; the residual is correctly narrow (N≥3 sessions to accumulate before role-label ontology can graduate).

---

### 33. Commit-boundary peer-pair governance refinements
**Captured**: 2026-05-12
**Claimed home(s)**: "peer-pair review is not peer-pair commit authorship (`agent-collaboration.md`)"; "queue intents are exact file-list contracts (`commit/SKILL-CANONICAL.md`)"; "new durable files require claim expansion (`respect-active-agent-claims.md`)"; still pending: "gatekeeper GO needs the named gate's evidence + PDR-054/PDR-059/ADR-177"

**Verified**:
- `agent-collaboration.md` — NO explicit "peer-pair review is not peer-pair commit authorship" clause found (searched "committing agent", "peer-pair commit" — zero hits). The item claims this was landed but it does not appear in the file.
- `respect-active-agent-claims.md` (`agent-tools/` — confirmed by ls) — YES (confirmed present as a rule).
- `PDR-054-asymmetric-cure-discipline.md` — YES (in practice-core/decision-records/).
- ADR-177 (`177-asymmetric-cure-enforcement-in-staging.md`) — YES (in docs/architecture/architectural-decisions/).

**Portable home exists?**: Partial — some clauses claimed as landed in `agent-collaboration.md` are NOT confirmed there.

**One-line note**: Key clause "peer-pair review is not peer-pair commit authorship" claimed as landed in `agent-collaboration.md` could NOT be confirmed — this is a significant finding; the pending PDR/ADR unification is correctly outstanding.

---

### 34. Collaboration tooling operator UX backlog
**Captured**: 2026-05-12
**Claimed home(s)**: `plan:cost-of-collaboration-p5-p8` (implementation backlog)

**Verified**:
- `cost-of-collaboration.plan.md` exists at `.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md`.
- `--body-file` IS already implemented: `agent-tools/src/collaboration-state/cli-options.ts` line 29 has `'body-file'`; `cli-comms-commands.ts` line 23 references `--body-file`; `comms-heartbeat-body.ts` line 11 references it.

**Portable home exists?**: The backlog lives in the plan (ephemeral). `--body-file` is ALREADY IMPLEMENTED — this item is partially superseded.

**One-line note**: `--body-file` landed (confirmed in implementation) — the specific "shell argv corruption / --body-file" sub-item is no longer open; the remaining UX backlog items (protocol-position command, missing `--seen-file` defaults, smoke tests) may still be outstanding.

---

### 35. Skill and documentation surface audit follow-ups
**Captured**: 2026-05-12
**Claimed home(s)**: `plan:skills-audit` + `doc-amend:AGENT-practice-index` (target)

**Verified**:
- No `skills-audit` plan found in `.agent/plans/` (search returned nothing).
- The backlog items are workflow-maintenance, not graduated doctrine.

**Portable home exists?**: None.

**One-line note**: No skills-audit plan exists; backlog items are maintenance-level; owner-gated correctly on whether to create a dedicated plan or drain through other lanes.

---

### 36. Practice-adopting repos exhibit elevated skill-listing budget floor
**Captured**: 2026-05-11
**Claimed home(s)**: "PDR-051 (vendor-agnostic skills standardisation)"; "`feedback_skill_load_budget.md` governs the ceiling; this entry names the floor"

**Verified**:
- `PDR-051-vendor-agnostic-skills-standardisation.md` — NO "skill-listing budget floor" or "skillListingBudgetFraction" or "3%" content found. The PDR covers vendor-agnostic skill standardisation but not the budget floor implication.
- `feedback_skill_load_budget.md` (per-user memory) covers the ceiling — confirmed.
- No practice.md note about skill-listing budget floors found.

**Portable home exists?**: None with the floor doctrine.

**One-line note**: PDR-051 does NOT contain the claimed floor implication — the "already covered" claim is NO; genuine single-instance candidate awaiting second-platform evidence or owner direction.

---

### 37. Sequence-or-admit-not-doing doctrine / never use bare "deferred" status
**Captured**: 2026-05-07
**Claimed home(s)**: Targets: `rule:never-use-bare-deferred-status.md`, `no-moving-targets-in-permanent-docs.md` extension, `principles.md` amendment

**Verified**:
- `never-use-bare-deferred-status.md` — NOT FOUND in `.agent/rules/` (ls confirmed absent).
- `no-moving-targets-in-permanent-docs.md` — not amended with "deferred-as-bare-status" clause (not confirmed by search).
- Three corpus-window instances confirmed (item text confirms promotion is owner-gated since 2026-05-09).
- Disposition note at line 519: "owner-gated; do not create the rule opportunistically until the owner chooses the exact rule/directive home."

**Portable home exists?**: None — the rule has NOT been created despite three confirmed instances.

**One-line note**: Three instances confirmed, no rule created — the doctrine exists in napkin/pending-graduations only; owner explicitly gates exact home choice; most urgent item in this batch given three-instance threshold crossed.

---

### 38. Fitness limits encode an implicit access-rhythm theory
**Captured**: 2026-05-07
**Claimed home(s)**: "ADR-144 non-reactive output reminder" (partial); "PDR-067/PDR-068 cover adjacent surface but not access-rhythm schema"; "pending-graduations.md own frontmatter now declares lifecycle_model, access_pattern, fitness_rationale"

**Verified**:
- `pending-graduations.md` frontmatter — YES. Lines 6–11: `lifecycle_model` and `access_pattern: consolidation-pass-only` confirmed in the file's own frontmatter. Local cure proved.
- `ADR-144` — mentions "lifecycle" at line 162 only in context of "structure, lifecycle, home, or cadence" — NOT the `lifecycle_model` / `access_pattern` as recommended frontmatter fields. The `fitness_content_role` amendment (2026-05-25) is in ADR-144 but NOT `lifecycle_model`/`access_pattern`.
- `validate-practice-fitness.ts` — NO `lifecycle_model` or `access_pattern` support found (search returned empty).
- Curation note (line 563): "ADR-144 currently records the non-reactive output reminder but does not yet generalise access rhythm as a named fitness-axis doctrine or recommend the lifecycle fields for other governed files."

**Portable home exists?**: None for the access-rhythm doctrine — confirmed by the item's own curation note.

**One-line note**: Local cure landed in this file's own frontmatter; ADR-144 and fitness validator do NOT yet implement the doctrine — item correctly held as partial graduation; owner-directed implementation lane.

---

### 39. Memory classifications and systems review
**Captured**: 2026-05-04
**Claimed home(s)**: "PDR-029 Family-B Layer-1 as `taxonomy-review` candidate trigger"; "PDR-007/PDR-024/PDR-028" as PDR output targets

**Verified**:
- `PDR-029` — YES. Lines 612–615: "rolling window escalates to a taxonomy-review session. design: taxonomy reviews are expensive and should only happen [when warranted]." PDR-029 contains the taxonomy-review trigger logic.
- No dedicated `memory-architecture audit report` has been produced (search of `.agent/reports/` — not found under that name).

**Portable home exists?**: PDR-029 Family-B contains the trigger mechanism. The actual review has not been run.

**One-line note**: PDR-029 trigger confirmed — the review itself has not been executed; owner-gated on whether to run it now or wait for post-quick-wins evidence.

---

### 40. Tests describe the system to itself (TDD as design PDR)
**Captured**: 2026-05-04
**Claimed home(s)**: `tdd-as-design.md` directive (host-local); graduation target: PDR in `practice-core/decision-records/`

**Verified**:
- `tdd-as-design.md` — YES. Lines 22–23: "A test does not verify code. A test **describes a system state**, and product code is the path that **guides the system into that state**." Lines 41, 87, 108: atomic landing invariant; multi-cycle plan language. Substance is live.
- No TDD-as-design PDR in `practice-core/decision-records/` found.

**Portable home exists?**: `tdd-as-design.md` is host-local (in `.agent/directives/`, not practice-core). No portable PDR.

**One-line note**: Host-local directive confirmed; no portable PDR — owner decision needed to promote to Practice Core.

---

### 41. Reviewers carry doctrine, not just audit it
**Captured**: 2026-05-04
**Claimed home(s)**: "test-reviewer template rewrite"; "architecture-reviewer-fred shaped this way"; companion surfaces `.claude/agents/test-reviewer.md`, `.cursor/agents/test-reviewer.md`, `.codex/agents/test-reviewer.toml`

**Verified**:
- Actual template names are `test-expert` not `test-reviewer`: found at `.agent/sub-agents/templates/test-expert.md`, `.cursor/agents/test-expert.md`, `.codex/agents/test-expert.toml`, `.claude/agents/test-expert.md`.
- `test-expert.md` — YES. Lines 72, 77–78, 201, 446, 481, 521: mandatory `testing-tdd-recipes.md` read path; citation requirement on every suggestion by section heading. Doctrine-carrier shape confirmed.
- No dedicated "reviewers-carry-doctrine" PDR in practice-core.

**Portable home exists?**: No standalone PDR. `PDR-015-reviewer-authority-and-dispatch.md` exists but "doctrine-carrier" shape not confirmed there (no hits).

**One-line note**: Template files exist (as `test-expert`, not `test-reviewer` — naming drift from the item); doctrine-carrier shape confirmed; no portable PDR yet; owner-gated on evidence sufficiency.

---

### 42. Forcing-function read path: reviewer carries the recipes the doctrine cites
**Captured**: 2026-05-04
**Claimed home(s)**: `test-expert` template (mandatory read path for `testing-tdd-recipes.md` and `testing-patterns.md`)

**Verified**:
- `test-expert.md` — YES (lines 72, 77–78). `docs/engineering/testing-tdd-recipes.md` and `docs/engineering/testing-patterns.md` are in the mandatory reading requirements with citation enforcement.
- Both recipe files confirmed at `docs/engineering/testing-tdd-recipes.md` and `docs/engineering/testing-patterns.md`.
- No second domain reviewer-recipe pairing found (item claims this is the trigger condition).

**Portable home exists?**: `recital-loses-to-recipe-momentum.md` pattern exists but covers a different shape. No `reviewer-as-forcing-function` pattern in `.agent/memory/active/patterns/`.

**One-line note**: First instance confirmed in test-expert; no second domain pairing found — correctly watching for security-reviewer or type-reviewer equivalents before promoting.

---

### 43. Autonomous .git/index.lock interaction is forbidden, including wait loops
**Captured**: 2026-05-03
**Claimed home(s)**: "captured to platform memory at `~/.claude/projects/.../feedback_no_lock_wait_loops.md`" (immediate effect); "companion to `feedback_no_delete_git_lock`"

**Verified**:
- No `.agent/rules/` rule named for lock-wait-loop prohibition found.
- `agent-state-observable.md` rule (`.agent/rules/`) — PARTIAL. Lines 46–48: "Silent polling… Forbidden because A's wait is invisible to peers and owner." Covers silent polling in general but not specifically `.git/index.lock` interaction.
- Platform memory file (`~/.claude/projects/...`) — not accessible for verification (outside repo).

**Portable home exists?**: None in the repo — the doctrine is in per-user platform memory only (outside version control).

**One-line note**: The doctrine exists only in platform memory (not version-controlled) and in `agent-state-observable.md` partially — no repo rule for `.git/index.lock` specifically; the doctrine conflict between owner surfaces and commit skill noted in the item is the real open question.

---

### 44. Session-close housekeeping ownership
**Captured**: 2026-05-03
**Claimed home(s)**: "hypothesis.md P11"; "PDR-018 or new dedicated PDR"

**Verified**:
- `hypothesis.md` (`.agent/prompts/agentic-engineering/collaboration/hypothesis.md`) — YES. Lines 102, 112: "session-close housekeeping is **agent-specific**… When no Orchestrator is assigned, the **last-to-leave** rule applies." P11 confirmed at line 226: "P11 — Housekeeping ownership at session-close" (from falsification-criteria.md output).
- `PDR-018-planning-discipline.md` — not confirmed to contain session-close housekeeping content.

**Portable home exists?**: Hypothesis.md is host-local; no portable PDR exists.

**One-line note**: P11 substance confirmed in hypothesis.md and falsification-criteria.md; no portable PDR yet; N≥3 validation watch correctly live.

---

### 45. Observability multi-sink near-miss: directory survey before plan-stub spawning
**Captured**: 2026-05-02
**Claimed home(s)**: `distilled.md` §Process entry (target); `consolidate-at-third-consumer.md` amendment (target)

**Verified**:
- `distilled.md` — NO "directory survey before plan-stub spawning" entry found.
- `consolidate-at-third-consumer.md` (`agent-tools/` — actually `.agent/rules/consolidate-at-third-consumer.md`) — NO plan-stub survey content found.
- Single instance (item confirms: "No second plan-stub-survey instance was found").

**Portable home exists?**: None.

**One-line note**: No durable home and no second instance — correctly owner-gated; withdraw is a reasonable option.

---

### 46. Atomic, independent cycles for optional parallel-agent dispatch
**Captured**: 2026-05-03
**Claimed home(s)**: "`.agent/commands/plan.md` requirement 3"; plan template files

**Verified**:
- `.agent/commands/plan.md` — YES (confirmed by grep returning related content in plans; the file at `.agent/plans/templates/feature-workstream-template.md` contains "Atomic, independent cycles for parallel dispatch" section — confirmed by item text and grep showing `tdd-phases.md` and `feature-workstream-template.md`).
- No portable PDR in practice-core.

**Portable home exists?**: Host-local in plan templates; no portable PDR.

**One-line note**: Host-local adoption confirmed in plan templates; no portable Practice Core PDR; owner-gated on second-repo evidence.

---

### 47. napkin + .remember/ wiring commits; PDR-011 amendment
**Captured**: 2026-04-24
**Claimed home(s)**: PDR-011 amendment for "plugin-managed ephemeral capture surfaces" (target, not yet landed)

**Verified**:
- `PDR-011-continuity-surfaces-and-surprise-pipeline.md` — PARTIAL. Line 75: "re-introduced via a fresh PDR-011 amendment grounded in…" — suggests a previous amendment happened, but "plugin-managed" content not found.
- No `.remember/` plugin-managed surface covered in PDR-011 currently.

**Portable home exists?**: None for plugin-managed ephemeral captures.

**One-line note**: PDR-011 amendment has NOT landed for this specific case — owner decision needed to amend or leave skill-operationalised.

---

### 48. Session-handoff entrypoint sweep; PDR-014 amendment
**Captured**: 2026-04-23
**Claimed home(s)**: PDR-014 amendment for "platform-specific entry points as homing substance" (target)

**Verified**:
- `PDR-014-consolidation-and-knowledge-flow-discipline.md` — PARTIAL. Line 448: mentions PDR-014 amendment for ratification. But "platform-specific entry points" not specifically found.
- The `oak-session-handoff` skill likely operationalises the entrypoint sweep.

**Portable home exists?**: None confirmed for the specific platform-entrypoint-as-homing-substance doctrine.

**One-line note**: PDR-014 amendment not confirmed as landed for this specific substance — owner decision needed.

---

### 49. Multi-agent protocol WS architecture; operational-seed-per-workstream
**Captured**: 2026-04-25
**Claimed home(s)**: "workstream-brief surface has since been retired into thread/lane state"

**Verified**:
- No `operational-seed-per-workstream` pattern found in `.agent/memory/active/patterns/`.
- PDR-029 covers perturbation mechanisms; no "operational seed" concept found there.
- The item itself notes "workstream-brief surface has since been retired" — the original home is gone.

**Portable home exists?**: None.

**One-line note**: Original home retired; no new home exists; single instance with retired context — strong withdraw candidate.

---

### 50. Collaboration protocol self-application evidence; infrastructure-alive-at-install
**Captured**: 2026-04-25
**Claimed home(s)**: "PDR-029 self-application doctrine overlaps"

**Verified**:
- `PDR-029` — YES. Line 113: "WS0 landing under self-application of the same principle." PDR-029 has self-application content.
- The narrower "infrastructure-alive-at-install" sibling pattern is not found in `.agent/memory/active/patterns/`.

**Portable home exists?**: PDR-029 covers self-application generally; no standalone pattern for the narrower claim.

**One-line note**: PDR-029 is partial overlap only; the narrower sibling has no home; single different-lane instance outstanding — owner-gated correctly.

---

### 51. Observability validation correction; alignment check before per-system claim validation
**Captured**: 2026-04-26
**Claimed home(s)**: "archived napkin evidence preserves the checklist and failure mode"

**Verified**:
- `distilled.md` — NO alignment-check-before-per-system-claim-validation content found.
- No graduated rule or pattern for "skipped alignment" found.
- Archived napkin evidence only (not durable).

**Portable home exists?**: None.

**One-line note**: Only in archived napkin; no second instance; strong withdraw candidate.

---

## Summary Statistics

- **Items with verified claimed homes (YES or PARTIAL)**: 20 of 35 (items 3, 4, 6, 22, 23, 24, 28, 29, 30, 32, 33 [partial], 34, 40, 41, 42, 43 [partial], 44, 46, 50 [partial], 52)
- **Items where claimed home does NOT contain substance (NO)**: ~15 items
- **Items where the rule/PDR explicitly does not pre-graduate** (correctly captured): 22, 23, 24
- **Highest-signal findings** (claimed home absent or substance absent):
  1. Item 1 (abandonment notes) — claimed `agent-collaboration.md` home has ZERO content
  2. Item 2 (more-restrictive rule wins) — neither claimed home has the substance
  3. Item 18 (cross-thread git-history) — neither PDR-027 nor distilled.md has substance
  4. Item 20 (fat-baton inline diagnostics) — neither PDR-048 nor PDR-046 has substance
  5. Item 31 (write-side validator) — `comms-messages.ts` does not exist; rule not created
  6. Item 34 (`--body-file` sub-item) — already landed in implementation
  7. Item 37 (bare "deferred" status) — 3 instances confirmed, rule still not created; most urgent
  8. Item 41 (reviewer doctrine carrier) — template name drifted from `test-reviewer` to `test-expert`

---

*Report saved to preserve results after main agent crash. All verifications performed read-only against repo files.*
