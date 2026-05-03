---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before every session.
Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-24.md` through `napkin-2026-04-28.md`
(sessions 2026-02-10 to 2026-04-25).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

---

## User Preferences

- Plans must be **discoverable** (linked from README, roadmap,
  AND session prompt) AND **actionable** (status tracking tables,
  completion checklists, resolved open questions).

Collaboration-specific entries formerly in this section graduated
to the [user-collaboration directive][user-collaboration] on 2026-04-24.
The merge-blocking simplification preference also lives there now.

## Multi-agent collaboration

The agent-to-agent working model lives in
[`agent-collaboration.md`][agent-collaboration]. The discovery surface
is the shared communication log at `.agent/state/collaboration/shared-comms-log.md`. The
structured claims registry (WS1) lives at
`.agent/state/collaboration/active-claims.json`. Three foundational
behavioural rules are loaded as session-open tripwires:
[`dont-break-build-without-fix-plan`](../../rules/dont-break-build-without-fix-plan.md),
[`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md),
and
[`register-active-areas-at-session-open`](../../rules/register-active-areas-at-session-open.md).
Knowledge and communication, not mechanical refusals — locks would be
routed around at the cost of architectural excellence.

The protocol is platform independent by design. Platform-specific
agent-team features may help build, inspect, or stress test the system,
but the local markdown/JSON/rules/commands/skills/hooks surfaces are the
operating substrate for Practice-owned coordination concepts and must remain
sufficient without platform-native collaboration features.

Before adding a new always-visible coordination surface, widen the regular
state audit first. WS3A showed that active claims, closure history, decision
threads, unresolved decision requests, evidence bundles, and schema
validation became usable once `consolidate-docs` reported them together.
Structured state plus consolidation output is usually the first dashboard.

Split evidenced durability gaps from speculative coordination mechanisms.
WS3A claim-history / decision-thread work was grounded in real harvest
evidence; WS3B sidebar, timeout, and file-backed owner escalation remain
promotion-gated until async decision threads prove insufficient.

Tripwire-observable-artefacts entries graduated 2026-04-25 to
[PDR-029 v2 amendment][pdr-029].

Owner-directed pause as a load-bearing planning move graduated
2026-04-26 to [PDR-026 amendment][pdr-026].

Parallel reviewer dispatch and structural-then-pre-landing review
phasing graduated 2026-04-26 to [PDR-015 amendment][pdr-015].

ADR/PDR citation discipline remains live-distilled until enough
evidence accumulates to graduate to a PDR amendment or a rule:
when citing an ADR or PDR by number, verify the filename and the
substance against the live decision-record file rather than
inheriting plan-body shorthand.

**Shared-state files are ALWAYS writable and ALWAYS commit-includable
regardless of any active claim.** Full coverage list, rationale, and
the surgical-edit guidance graduated 2026-04-29 to
[`respect-active-agent-claims` § Shared-state always writable][respect-shared-state-rule].

When an apparently orphaned active claim is found, archive it only through a
deliberate governance pass or owner-forced close. If another session is
already performing that cleanup, let the natural claim lifecycle finish rather
than deleting unilaterally.

## Workspace-first before external tooling or new infrastructure

Three failure modes share one shape and one fix. Before reaching for
external tools or proposing new code, exhaust workspace inventory:

- **Diagnostic failure investigation**: when remote tooling truncates
  (Vercel MCP, Sentry MCP, GitHub API), search the workspace for
  owner-provided artefacts (`vercel_logs/`, `test-results/`,
  `coverage/`) BEFORE retrying the same tool with bigger limits.
  The owner may have downloaded the complete artefact locally.
- **Brief enumeration of failing checks**: a brief listing failing PR
  checks is a snapshot from when the prior session closed. Run
  `gh pr checks <PR>` first; cross-check against the brief. Pre-existing
  red gates the brief omitted are still blocking — *all gate failures
  are blocking at all times, regardless of cause or location*
  (principles.md §Code Quality).
- **Infrastructure proposals**: before adding new Zod schemas /
  validation pipelines / helper modules, survey existing `core/` and
  `libs/` packages. `@oaknational/env` already has shared schema
  contracts; `@oaknational/env-resolution` already has the
  schema-validate-then-narrow flow; `@oaknational/build-metadata`
  already has the constant-type-predicate pattern in place. Extending
  existing infrastructure beats parallel implementations every time.
- **Vendor-platform plans**: see [PDR-033][pdr-033] and the pattern
  instance at [`patterns/vendor-doc-review-for-unknown-unknowns.md`][vendor-pattern].
  Vendor-doc review at plan time finds capability gaps;
  vendor-specialist reviewer dispatch at implementation time catches
  contract violations. Both review acts are routine, not exceptional.
- **Cross-system observability claims**: before investigating one system's
  behaviour, align all relevant artefacts first. For Vercel / Sentry /
  GitHub validation, compare local HEAD, origin, PR head, latest Vercel
  deployment SHA, and Sentry deploy/release metadata. If they disagree,
  establish which artefact is being tested before making runtime claims.

Captured in `feedback_workspace_first_for_diagnostics`,
`feedback_gh_pr_checks_over_brief`, and
`feedback_check_workspace_packages_before_proposing` (2026-04-26
session).

Test-fixtures-encode-production-shape doctrine graduated 2026-04-26
to [PDR-034][pdr-034].

Constant-type-predicate call-site uptake clause graduated 2026-04-26
to [ADR-153 amendment][adr-153] as Step 5 of the pattern.

Config-load-side-effects discipline graduated 2026-04-26 to
[ADR-164][adr-164].

## Process

Planning-discipline entries in this section remain routed to the
`planning-specialist-capability.plan.md` plan until the Planning
expert triplet executes.

Disposition-drift doctrine graduated 2026-04-28 to
[PDR-018 §Disposition drift at phase boundaries][pdr-018].

Rush-impulse-as-entropy-generator graduated 2026-05-02 to
[principles.md § Architectural Excellence Over Expediency][excellence].
Source: napkin entry "2026-05-01 — Metacognition: the rush impulse
as system-level entropy generator (Deep Navigating Stern)" plus
owner reinforcement 2026-05-02 (*"we always, ALWAYS, choose
long-term architectural excellence over cheap or fast or good
enough"*). Operational consequence: when surfacing options to
the owner, the "cheap cure" / "quick fix" / "land it then
iterate" frame is categorically excluded — only
architectural-excellence shapes count as legitimate options.

[excellence]: ../../directives/principles.md#architectural-excellence-over-expediency

- **Learning before fitness — knowledge preservation is absolute**:
  writing to shared-state knowledge surfaces (napkin, distilled,
  patterns, thread records, repo-continuity, comms log, conversations,
  escalations, claims) is NEVER blocked by fitness limits. Two valid
  responses when a write would push past target/limit: (a) write in
  full and flag the file for attention, or (b) thoughtful holistic
  promotion of mature concepts to a permanent home (ADR/PDR/governance/
  rule/principle/README/TSDoc) via the consolidate-docs §7 graduation
  scan. Naive cutting, compression, summarisation, or skipping the
  write are all forbidden. Fitness pressure routes to consolidate-docs
  §9 as structural follow-up, never as retroactive permission to have
  written less. See [napkin SKILL § Knowledge Preservation Is
  Absolute][napkin-skill-preservation] and [consolidate-docs §
  Learning Preservation][consolidate-docs-preservation].
- **Lead with narrative, not infrastructure**: on a multi-workstream
  initiative, write the ADR and README first. WS-0 (narrative) →
  WS-1 (factory) → WS-2+ (consumers).
- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose — not just frontmatter and todo checkboxes.
- **Reconcile parent when child changes runtime truth**: a child
  plan that evolves runtime architecture must reconcile the parent
  plan and closure proof in the same session.
- **CLI-first enumeration before owner questions**: research
  the generic REST surface (`sentry api`, `clerk api`, vendor-
  equivalent) before raising any owner question about observability
  or infrastructure state. "The specialist tool doesn't surface X"
  ≠ "X is unknowable from automation." **Extends to workstream
  sizing**: when owner direction names a repo-level mechanism
  (build cancellation, env-var policy, release resolution),
  search the repo for prior implementation before sizing a
  workstream. "Stated many times" or "should already be true"
  signals the substance may exist and the gap is
  documentation/linkage, not implementation.
- **Validation closures: produce locally-producible evidence
  first**. For deployment validation lanes, generate every
  locally-producible proof under a session-specific release tag
  before asking. Only ask for owner action when tooling cannot
  reach the artefact.
- **Split client-compatibility out of deployment-validation
  lanes**: a client-specific compat issue emerging in an active
  deployment-validation lane spins into its own follow-up plan.
  Shared preview infra ≠ shared plan ownership.
- **Dry-run multi-step workflows against accumulated state** before
  committing to the recipe; produces *proceed* or *stage differently*.
- **Plan-as-artefact gravity**: when a remediation plan grows multiple
  session-history sections, re-grounding tables, and re-classification
  amendments while the gates it targets remain red, the plan body has
  become an artefact rather than an execution document. Symptoms:
  inline "Session 1 / Session 2 / Session 2.0.5" prose; verification
  tables of stale assertions; a 12-phase scope mixing different signal
  classes (e.g. CodeQL + Sonar + duplications + micro-clusters);
  per-session re-grounding cost exceeding per-session closure rate.
  Cure: archive the plan body (preserve as `*.superseded-by-*.md`),
  port load-bearing evidence files (security reviews, sink-trace
  findings) but not prose, write a one-page replacement scoped to a
  single signal class with one row per finding and a structural cure
  (or owner-authorised dismissal-with-evidence) per row, no inline
  history. Witnessed on `pr-87-architectural-cleanup.plan.md` →
  superseded 2026-04-28 by `pr-87-codeql-alerts.plan.md`.

Non-planning process entries graduated on 2026-04-24 to:
`validate-full-target-estate`, `read-diagnostic-artefacts-in-full`,
`consolidate-at-third-consumer`, `generator-first-mindset`,
`documentation-hygiene`, reviewer doctrine, build-system doctrine,
practice verification, and the collaboration directive.

**Stated principles require structural enforcement.** Graduated
2026-04-30 to [PDR-038][pdr-038]. Three worked instances
(no-machine-local-paths, never-disable-checks,
validation-scripts-are-not-tests) preserved in the PDR.

**External-system findings tell you about your local detection
gap.** Graduated 2026-04-30 to [PDR-039][pdr-039]. Worked instance
(Cursor Bugbot duplicate heading → MD024 globally-disabled discovery
→ class-of-bug gap closed) preserved in the PDR.

**Validation scripts are not tests.** Worked example + contrast pattern
graduated 2026-04-30 to [testing-tdd-recipes § Validator Script vs
Integration Test][tdd-validator-recipe]. The scripts/-tier workspace
migration follow-on lives in
[`current/scripts-validator-family-workspace-migration.plan.md`][validator-migration-plan].

**Stage by explicit pathspec, not wildcard.** A non-empty index or
working-tree-files-outside-the-named-intent at commit time is a
coordination event (peer's WIP), not an inconvenience. The cure is
structural: the commit skill enqueues the intended bundle before
staging; staging uses explicit pathspecs from that queued list, never
`git add -A`; and the verify-staged-fingerprint step rejects any file
outside the intent. Surfaced 2026-04-30 by the `75ac6b75` post-mortem
where a continuity-deferral commit accidentally bundled 372 lines of
parallel Practice-thread plan work plus an unrelated `.claude/settings.json`
plugin enable. Companion to 2026-04-29 Pearly Swimming Atoll's index-
ownership lesson: ownership transitions are made visible via shared
comms, then proceed.

**Hash presence without recompute is silent drift.** Any validator
that *stores* a content hash in a lock or manifest but does *not*
re-compute and compare on subsequent runs cannot detect drift.
Surfaced 2026-04-30 in `validate-portability.ts` Check 9b: the lock
records `(source, sourceType, computedHash)` for every vendored
canonical skill, but the validator only checks structural shape, not
content. A hand-edit to `.agent/skills/<vendored-name>/SKILL.md`
passes every current check. The corrective is the natural one:
recompute `localHash`, compare with `computedHash`, fail on mismatch.
Closing this gap is in scope for the canonical-first-skill-pack-
ingestion-tooling future plan.

**Moving targets do not belong in permanent docs.** Tool counts, bug
counts, lint counts, file counts, Git HEAD SHAs and any other figure
that changes with ordinary work are appropriate only in ephemeral or
state-tracking surfaces (`.remember/`, `.agent/state/`, session
napkins, comms log). Embedding them in permanent docs (ADRs, PDRs,
README, principles, directives, practice-index, plans-as-reference)
only generates documentation drift; it provides no durable value. The
Git label HEAD already exists as the stable index for "current
commit" — re-recording the SHA in prose freezes a moment in time.
Existing instances (e.g. "43 canonical rules / 12 stable canonical
commands / 36 canonical skills / 77 abstract solutions" in
`practice-index.md`, baked-in SHAs in long-lived docs) are prior-art
violations to be remediated; remediation does not have to happen in
the session of discovery. Cure when count itself is the point: route
to a generated/scriptable surface (`pnpm portability:check`, fitness
reports, generated indexes), not hand-maintained prose. Owner stated
2026-05-01.

**Practice-Core portability is by construction.** Anything under
`.agent/practice-core/` (the trinity, entry points, CHANGELOG,
provenance, `decision-records/`, `incoming/` — note that the
former `patterns/` Core directory and the `practice-context/`
peer companion were retired 2026-04-29 by PDR-007 amendment) must
be repo-independent. No repo paths (`docs/...`, `src/...`,
`packages/...`, `apps/...`, `../../skills/`, `../../commands/`,
`../../memory/`, `../../plans/`, `../../experience/`, `../../rules/`,
etc.). No ADR references (no `ADR-NNN`, no links into
`docs/architecture/architectural-decisions/`). No commit references
(no SHAs, no commit subjects, no `commit abcdef0` citations). No
host-local context sections, host-context notes, or "this repo
only" sections inside any PDR — host-side adoption is recorded in
the host's bridge index and ADR surface, not in the PDR. The
only outgoing link allowed from any file under `practice-core/` is to
the stable bridge index `.agent/practice-index.md`. Cross-references
between Core files (e.g. `practice.md` → `practice-lineage.md`,
PDR → PDR) are internal to the Core package and remain allowed; what
is forbidden is leakage out of the Core into the host repo.

**Two narrow carve-outs, ratified 2026-05-02 (Phase 1 Round 2
remediation under owner direction)**:

1. **Practice-canonical directory references** describing the
   Practice's own canonical layout (`.agent/skills/`, `.agent/rules/`,
   `.agent/memory/`, `.agent/state/`, `.agent/practice-core/`, etc.)
   are portable structural contract, not host leakage — `.agent/`
   IS the Practice's canonical home per PDR-009 and the PDR-007
   Core-package contract. Spirit reading: the constraint targets
   *host-repo* paths (apps/, packages/, src/, docs/...), not
   references to the Practice's own canonical surface.
2. **External http(s) citations** to durable third-party material
   (RFCs, vendor specifications, public standards) are permitted —
   the constraint targets repo-internal leakage, not citation of
   external standards.

Existing violations (PDRs 038/039/040/041/042 linking
`../../../docs/architecture/architectural-decisions/...`; PDR-026
linking `../../skills/`, `../../commands/`, `../../memory/`,
`../../plans/observability/`; PDR-041 linking `../../experience/...`
and `../../plans/...`; `practice.md` / `practice-lineage.md` /
`CHANGELOG.md` / `practice-bootstrap.md` mentioning `ADR-NNN`) were
critical-architectural-failure-shaped prior art. The first wave of
remediation landed 2026-05-02 (Phase 1 Round 2): trinity migrated to
the post-2026-04-29 retirement model; ~30 §Host context note /
§Host-local context sections deleted across PDRs; broken cross-Core
links repaired (3 PDR-007 stale-name links + 1 machine-local path +
PDR-011 markdown defect); bridge index references re-pointed to
"(host adoption)" framing. The structural-enforcement scanner
required by PDR-038 to prevent recurrence is captured as the next
follow-on. This constraint is stricter than the prior ADR-124 /
PDR-007 "Core self-containment" framing — it tightens the seam to a
single permitted outgoing target plus the two carve-outs above.
Owner stated 2026-05-01; carve-outs ratified 2026-05-02.

## Architecture (Agent Infrastructure)

<!-- "Implicit architectural intent is not enforced principle" graduated
2026-04-19 — codified as ADR-162 (Observability-First), now Accepted. -->

Agent-infrastructure portability entries graduated on 2026-04-24 to PDR-009
and ADR-125. Live counts are enforced by `pnpm portability:check`, not
repeated here.

## Repo-Specific Rules

The `src/bulk/generators/` / `vocab-gen/generators/` duplication is
deferred to the SDK codegen decomposition plan for a separate session:
`plans/architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md`.

## Build System (Domain-Specific)

Build-system entries graduated on 2026-04-24 to
[`docs/engineering/build-system.md`][build-system].

[user-collaboration]: ../../directives/user-collaboration.md
[agent-collaboration]: ../../directives/agent-collaboration.md
[build-system]: ../../../docs/engineering/build-system.md
[respect-shared-state-rule]: ../../rules/respect-active-agent-claims.md#shared-state-files-are-always-writable-and-always-commit-includable
[napkin-skill-preservation]: ../../skills/napkin/SKILL.md#knowledge-preservation-is-absolute--fitness-is-never-a-constraint
[consolidate-docs-preservation]: ../../commands/consolidate-docs.md#learning-preservation-overrides-fitness-pressure
[adr-153]: ../../../docs/architecture/architectural-decisions/153-constant-type-predicate-pattern.md#amendment-log
[adr-164]: ../../../docs/architecture/architectural-decisions/164-config-load-side-effects.md
[tdd-validator-recipe]: ../../../docs/engineering/testing-tdd-recipes.md#validator-script-vs-integration-test
[validator-migration-plan]: ../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md
[pdr-038]: ../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md
[pdr-039]: ../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md
[pdr-015]: ../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md#amendment-log
[pdr-018]: ../../practice-core/decision-records/PDR-018-planning-discipline.md#disposition-drift-at-phase-boundaries-2026-04-28-amendment
[pdr-026]: ../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md#amendment-log
[pdr-029]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md#amendment-log
[pdr-033]: ../../practice-core/decision-records/PDR-033-vendor-doc-review-for-unknown-unknowns.md
[pdr-034]: ../../practice-core/decision-records/PDR-034-test-fixtures-encode-production-shape.md
[vendor-pattern]: patterns/vendor-doc-review-for-unknown-unknowns.md
