---
fitness_line_target: 350
fitness_line_limit: 500
fitness_char_limit: 40000
fitness_line_length: 200
split_strategy: "Graduate items to PDRs/ADRs/rules/permanent docs; archive resolved items to repo-continuity-session-history archives; keep only pending and recently-graduated items here"
---

# Pending-Graduations Register

The structured queue of doctrine candidates awaiting graduation per
the capture → distil → graduate → enforce pipeline (ADR-150, PDR-011).
Each entry carries `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, and `status`.

Items with `status: due` or `status: overdue` are the primary
graduation candidates for the next consolidation pass. Items with
`status: pending` are reviewed at each consolidation to see whether
their trigger condition has fired since last consolidation. Items
with `status: graduated` are kept here briefly for audit trail before
being archived to `archive/repo-continuity-session-history-*.md`.

This register lives in its own file (split out from
`repo-continuity.md` § Deep Consolidation Status on 2026-04-30 by
Briny Lapping Harbor under owner direction, when accumulated rich
register content was contributing the bulk of repo-continuity's
HARD fitness state). Doctrine references that previously pointed to
`repo-continuity.md § Deep consolidation status` now point here.

Schema: `captured-date`, `source-surface`, `graduation-target`,
`trigger-condition`, `status`. `consolidate-docs` uses this as the live
queue. Graduated and merged history is preserved in git and the archived
continuity snapshots.

+ 2026-04-29; PR-90 closure session — `scripts/validate-*` family is
  structural drift relative to ADR-041 / §Separate-Framework-from-Consumer /
  owner-direction "complex-with-tests must live in workspace"; 4 parallel
  architecture reviewers convergent; future + executable plans authored
  ([`current/scripts-validator-family-workspace-migration.plan.md`](../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md));
  Phase 0 of the executable plan graduates the owner-direction rule to
  `.agent/rules/no-workspace-evading-scripts.md` and authors ADR delta or
  peer ADR via docs-adr-reviewer; trigger: owner directs Phase 0 OR third
  validator class accumulated; status: pending.
+ 2026-04-29; PR-90 closure session — `external-systems-shouldnt-be-the-
  first-detector` principle introduced by owner mid-session, drove Phases 4
  and 5 (TS-invocation gate + MD024 enable). Recursively useful (caught its
  own meta-instances via Cursor Bugbot napkin finding). **GRADUATED
  2026-04-30 by Verdant Sheltering Glade per owner direction "promote
  both now"** to
  [PDR-039 External-System Findings Reveal Local Detection Gaps](../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md);
  status: graduated 2026-04-30.
+ 2026-04-29; PR-90 closure session — testing-strategy.md §Test Types named
  "validation scripts that require external resources should be standalone
  scripts, not tests" caught my Phase 4 misclassification (vitest-as-
  validator-harness). The principle is sound but lives in one paragraph;
  worth elaborating in `docs/engineering/testing-tdd-recipes.md` with the
  contrast pattern (validator script + helper unit tests vs integration test
  on real-FS repo state); trigger: second similar misclassification OR
  owner direction; status: pending.
+ 2026-04-29; PR-90 closure session — Vercel build emits 2 warning classes
  (pnpm `@humanfs/node` bin defect; 3 env vars not in `turbo.json`).
  Captured in
  [`future/vercel-build-warning-elimination.plan.md`](../../plans/architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md).
  Trigger: third warning class accumulates OR owner direction; status:
  pending (future plan).
+ 2026-04-29; owner-requested PR lifecycle skill note;
  `.agent/skills/pr-lifecycle/SKILL.md` plus possible PDR amendment for
  gate-honest PR stewardship; trigger: first real PR shepherding run using
  the skill OR second repeated PR feedback / CI / Sonar / reviewer-wait
  friction instance; status: pending. Evidence:
  [`pr-lifecycle-skill.plan.md`](../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
+ 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second
  plugin-managed in-repo capture surface or owner direction; status:
  pending.
+ 2026-04-23; ADR-163 release/version boundary and vendor passthrough
  audit; trigger: observability-thread consolidation audit; status:
  pending-audit.
+ 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: pending.
+ 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: pending.
+ 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: pending.
+ 2026-04-26; workspace-first failure cluster; rule or
  recurrence-prevention amendment for workspace inventory before external
  tooling/new infra; trigger: second cross-session instance or owner
  direction; status: pending.
+ 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner
  direction; status: pending.
+ 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: pending.
+ 2026-04-26; WS3A closeout; protocol observability by consolidation
  audit before new visible surfaces; trigger: second protocol slice with
  the same shape or owner direction; status: pending.
+ 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`);
  future strategic plan candidate for promotion to `current/`; trigger:
  second instance OR owner direction; **status: ready for promotion**
  (both triggers fired 2026-04-30 — owner observed warnings during
  Verdant Sheltering Glade session, AND the session itself accumulated
  new evidence). Second-instance evidence (2026-04-30):
  `pnpm agent-tools:agent-identity` does not inherit
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` through `pnpm --filter` (forcing
  --seed); `comms append` requires `--events-dir`, `--now`,
  `--created-at` with no discoverable defaults; `claims open` requires
  `--active`, `--thread`, `--area-kind` (with `--area-kind` rejecting
  intuitive values like `shared-state` — only `files`/`workspace`/`plan`/
  `adr`/`git` are accepted); `comms render` uses `--output` not
  `--output-file`. Each error is a single iteration cost but they
  compound to ~5–8 round-trips per session-open. Evidence + plan:
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md).
  **Third-instance evidence (2026-05-01, Vining Whispering Root,
  Increment 1 promotion-materials commit `b3d4c041`)** — six
  frictions in one end-to-end run of the always-active commit skill:
  (i) `commit-queue enqueue` rejects a placeholder claim_id with
  `unknown claim_id: <uuid>` — chicken-and-egg; the queue requires a
  claim to exist, but step ordering at the CLI surface is the inverse
  of the skill's documented step ordering; (ii) `collaboration-state
  claims open --help` errors `flag '--help' requires a value` —
  help is unreachable; (iii) `--active "$PRACTICE_AGENT_SESSION_ID_CLAUDE"`
  produces `ENOENT: no such file or directory, open '<UUID>'` — the
  flag interprets the UUID as a path; (iv) `pnpm
  agent-tools:agent-identity` does not inherit env vars through `pnpm
  --filter`, requiring `--seed` despite the parent shell having the
  variable set; (v) `collaboration-state claims` (no action) prints
  only the top-level usage line, not the list of available actions
  (`open`, `close`, etc.); (vi) `--area-kind` accepts a closed
  enum (`files`/`workspace`/`plan`/`adr`/`git`) but rejects
  intuitive values like `shared-state` without listing the accepted
  set in the error. Compound effect: the agent abandoned the queue
  workflow and fell back to plain explicit-pathspec staging — the
  substance of the discipline survived (validation + pathspec) but
  the audit-trail value of the queue was lost. Routing-around is
  itself a Practice failure mode: a queue that exists but is
  habitually bypassed under friction is worse than no queue. Strong
  case to promote the future plan to `current/` and execute its
  ergonomics-fix slice next consolidation. **Status: ready for
  promotion** (was already; third instance hardens the case
  significantly). **Fourth-instance evidence (2026-05-01, Deep
  Navigating Stern, day-arc continuity commits `514838c9` +
  `bc6cd2e6`)** — eight distinct frictions in one ceremony pair
  produced ~60 seconds of pure flag-discovery and recovery
  overhead per commit: (i) `agent-tools:agent-identity` first-call
  build failure (transient, retry succeeded); (ii) `claims open
  --help` rejected (unchanged); (iii) `claims open` required-flag
  discovery by error iteration over **5 round-trips**
  (`--platform`, `--model`, `--active`, `--now`); (iv) `claims
  close` required another **3 round-trips** (`--closed` path,
  `--summary` not `--closure-summary`, identity quartet); (v)
  identity quartet repeated across every CLI call (`--platform`,
  `--model`, `--agent-name`, `--seed`); (vi) commit-queue
  `enqueue` records subject at enqueue time with no `update-subject`
  subcommand — over-length subject required abandon-and-re-enqueue
  cycle, leaving an `abandoned` row in `commit_queue`; (vii) `comms
  append` uses `--body` while SKILL.md vocabulary suggested
  `--message`; (viii) markdownlint `--fix` corrupted prose-`+` at
  column 0 into a list marker, requiring two manual rephrasings.
  Concrete fixes for the ergonomics slice to prioritise: subject-
  correction subcommand; identity-quartet env defaults inside the
  CLI binary (bypass `pnpm --filter` propagation gap); `--help`
  acceptable without value; subcommand discovery; `comms append`
  flag rename; required-flag enumeration on first error.
  Adjacent: napkin 2026-05-01 fourth-instance entry surfaces an
  *agent-authored prose interacts surprisingly with markdown
  linters under wrap* observation as small operational discipline,
  not a separate candidate.
+ 2026-05-01; ~~bootstrap fast-path should not pay full coordination
  cost~~ **WITHDRAWN 2026-05-01 by Deep Navigating Stern** under
  owner direction *"we never take the fast path we ONLY take the
  path that maximises long-term architectural excellence."* The
  candidate framed real evidence (six compound CLI frictions in one
  commit-skill run) under a *conditional-discipline* shape (skip
  queue when registry empty), which introduces microstate
  proliferation: every future agent must evaluate whether their
  situation is "fast-path", the condition's accuracy degrades
  silently as the system evolves, and the audit-trail surface that
  is most needed when coordination fails is the one being skipped.
  The genuine substance — *the queue ergonomics are bad and that
  produces route-around behaviour* — survives intact and routes to
  the CLI ergonomics plan
  ([`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md))
  as *fix the surfaces*, not *make the discipline contingent*.
  Withdrawal is itself the doctrine: rush-impulse re-frames real
  concerns under conditional-discipline shapes; the corrective is
  to re-frame under long-term excellence. Captured in napkin
  2026-05-01 metacognition entry. Status: withdrawn 2026-05-01.
+ 2026-05-01; **rule visibility under friction is uneven** — the
  always-active `capture-practice-tool-feedback` rule exists and is
  loaded every session via `CLAUDE.md`, but in this session the agent
  hit six tooling frictions in one commit attempt and did not pause
  to capture until the user asked. The rule fired on owner prompt,
  not on the friction itself. Candidate structural cue: when an agent
  uses an `agent-tools:*` command and encounters an unexpected error,
  that should be a structural prompt to write a napkin entry — not a
  sometimes-yes-sometimes-no judgement call. Recursive: this very
  candidate is a meta-instance of the same shape (a rule existed but
  did not fire under friction; the user had to ask). Trigger for
  graduation: second instance of "rule existed but didn't fire under
  friction" OR owner direction. Status: pending.
+ 2026-04-28; cross-thread comms event request/response correlation gap
  (no `audience`, no `in_response_to`, no TTL/escalation timer);
  minimal correlation primitive on the comms event schema as recommended
  first promotion slice; trigger: second silently-rotted cross-thread
  request OR owner direction; status: pending.
+ 2026-04-28; stance-staleness within a single conversation
  (parallel-agent state moves between forming a stance and reporting it);
  doctrine candidate for `agent-collaboration.md` and start-right
  skills; trigger: second instance OR owner direction; status: pending.
+ 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as MUST-FIX; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope`; trigger: second
  cross-session instance OR owner direction; status: pending.
+ 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to
  *first edit* rather than to thread join; trigger: owner-flagged AND
  named for separate investigation; status: pending. Cross-reference:
  [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
+ 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions);
  testing-strategy amendment to classify tests by behaviour shape, not
  by filename suffix; trigger: second observed instance OR owner
  direction; status: pending.
+ 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default); PDR candidate
  extracting the canonical contract from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform implementing a thin
  wrapper, OR owner direction; status: pending.
+ 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass); pattern
  candidate or PDR amendment for "tool-error-as-question" meta-pattern;
  trigger: third surface OR owner direction; status: pending. Evidence:
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md).
+ 2026-04-29; scope-as-goal anti-pattern (treating instrumental work as
  terminal because the work-list was full; reviewer "GO WITH CONDITIONS"
  reading as green light when arc-scope ≠ branch-scope); pattern or
  PDR-018 amendment about reviewer-scope-equals-prompted-scope;
  trigger: second cross-session instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  session-end summary in
  [`archive/napkin-2026-04-29.md`](../active/archive/napkin-2026-04-29.md).
+ 2026-04-29; lockfile-corruption diagnosis discipline (read build log
  before extending speculation list; speculation lists are negative
  hypotheses, not narrowing tools); recast 2026-04-30 as
  **composition-obscurity investigation methodology**;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner direction
  to [PDR-041 Composition-Obscurity Investigation Methodology](../../practice-core/decision-records/PDR-041-composition-obscurity-investigation-methodology.md)**;
  status: graduated 2026-04-30.
+ 2026-04-30; pin GitHub Actions to maintainer-Latest SHA, not
  highest-version-number SHA;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner direction
  with conscious PDR-vs-ADR distinction: general principle to
  [PDR-040 Pin to Maintainer-`/releases/latest`, Not Highest Version Number](../../practice-core/decision-records/PDR-040-pin-to-maintainer-latest-not-highest-version.md)
  (Practice substance, cross-repo); host-side adoption to
  [ADR-169 Pin GitHub Actions to Maintainer-`/releases/latest` SHA](../../../docs/architecture/architectural-decisions/169-pin-github-actions-to-maintainer-latest-sha.md)
  (this repo's CI workflows + override mechanism + future-validator
  scope)**; status: graduated 2026-04-30.
+ 2026-04-30; signal-distinguishing pre-action gate — the agent
  defaults to "make the failing thing pass" when any failing
  signal appears, but contract-violation signals want fixes while
  structural-health diagnostics want graduate/split/accept; agent
  currently collapses both into "fix the metric"; surfaced by
  five same-shape reframes in one session;
  **GRADUATED 2026-04-30 by Briny Lapping Harbor per owner
  direction to fresh
  [PDR-042 Signal-Distinguishing Pre-Action Gate](../../practice-core/decision-records/PDR-042-signal-distinguishing-pre-action-gate.md)
  rather than amendment to PDR-018 or PDR-026 — the substance is
  upstream of planning and landing-commitment, applying to any
  agent action proposal under failing-signal pressure**; status:
  graduated 2026-04-30.
+ 2026-04-29; reviewer-scope-equals-prompted-scope (a reviewer's
  "GO WITH CONDITIONS" reads as green only if reviewer scope ≡ branch
  merge-gate scope; brief reviewers with full merge gate when
  gating merge); PDR-015 amendment OR new pattern; trigger: second
  cross-session instance OR owner direction; status: pending. Evidence:
  napkin 2026-04-29 Verdant Regrowing Pollen Surprise 4.
+ 2026-04-29; experience-audit emergent patterns (medium strength,
  ≥3 instances each, surfaced by 2026-04-29 deep consolidation pass);
  pattern candidates for promotion at second-instance OR owner
  direction; status: pending. Evidence: experience-audit report
  in 2026-04-29 deep consolidation closeout. Six candidates:
  + **silent-degradation-in-green-systems** — tests pass while
    running system is broken (tsx vs dist, characterisation tests
    that never ran, mapping promises a builder never delivers).
  + **plans-are-load-bearing-and-age** — plans encode world-state
    at authoring time and drift; mischaracterisations have the same
    structural risk as bugs.
  + **verify-the-premise-before-solving** — reviewer findings are
    hypotheses about the system, not facts; the fact lives in code.
    Pairs with `ground-before-framing`.
  + **complexity-cascade-feels-productive** — over-engineering
    feels like progress; the simple solution is invisible while in
    the spiral. Pairs with `workaround-gravity`.
  + **bridging-language-smuggles-old-shapes** — "deprecated notice",
    "follow-up", "compatibility layer", "stretch goal" perform
    preservation while preventing the new shape from existing.
  + **fix-the-producer-not-the-consumer** — when a consumer cannot
    use a type/function/structure correctly, the fix is in the
    producer; one template fix → 24 generated files cleaned.
+ 2026-04-29; doctrine-tests-itself-on-the-session-of-its-landing
  (the strongest test of a newly-authored rule is whether the
  session that authored it obeys it; corollary: install-session
  self-application is the acid test); PDR candidate (sibling of
  PDR-029 / install-session-blind-to-cold-start-gaps); trigger:
  owner direction (≥4 cross-session instances already documented);
  status: pending. Evidence: experience-audit report; instance
  patterns include 2026-04-22-the-rule-tested-itself,
  2026-04-21-the-recursive-session,
  2026-04-25-fresh-prince-the-protocol-applied-to-itself,
  2026-04-21-installing-a-tripwire-i-cannot-test.
+ 2026-04-29; open-up-the-value-early (when extra work closes a
  coordination gap that the surrounding decisions would otherwise
  ship with, the move is to open up that value within the current
  arc rather than ship the original arc and defer); PDR candidate
  (strategic test about composability of surrounding decisions,
  distinct from "do it now"); trigger: owner direction OR fourth
  cross-session instance; status: pending. Evidence: experience-
  audit report; instance patterns include
  2026-04-21-session-3-doctrine-bundle-opening-up-value-early
  (canonical naming), 2026-04-22-the-rule-tested-itself,
  2026-04-18-observability-as-principle.
+ 2026-04-29; sentry-observability-maximisation-mcp.plan.md displaced
  doctrine (build-vs-buy attestation + six metacognition guardrails);
  PDR creation candidate ("Build-vs-Buy Attestation as Plan Authoring
  Discipline"), plus ADR-163 §6 amendment to outcome-not-CLI form;
  trigger: owner direction (PDR creation needs explicit approval per
  PDR-003 care-and-consult posture); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep
  consolidation pass.
+ 2026-04-29; multi-agent-collaboration-protocol.plan.md concept-home
  refinement; doctrine has graduated to canonical surfaces
  (agent-collaboration directive, respect-active-agent-claims rule,
  distilled.md, consolidate-docs §7e, PDR-029 Family A.3); plan body
  still narrates the doctrine alongside execution status; the work is
  routing each section to its canonical home (or keeping it as
  plan-scoped substance), not a size-target trim — line count falls
  because duplication is removed; trigger: owner direction (preserves
  audit-trail role for WS5 evidence harvest); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep consolidation
  pass; child plan at
  [`multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md).
+ 2026-04-29; trinity Active Principles + bootstrap structural
  extensions for the five 2026-04-29 doctrine sharpenings (knowledge-
  preservation absolute, shared-state always-writable, tool-error-as-
  question, scope-as-goal, behaviour-shape testing classification);
  amendments queue for `practice.md` §Philosophy + Collaboration,
  `practice-lineage.md` Active Principles, `practice-bootstrap.md`
  §Napkin + §Sub-agents, `practice-verification.md` shared-state
  smoke-test addition; trigger: owner direction (per PDR-003 care-
  and-consult; sub-agent assessed as healthy-lag, not silent rot);
  status: pending. Evidence: trinity-drift sub-agent report from
  2026-04-29 deep consolidation pass.
+ 2026-04-30; graduation-trigger criteria too restrictive — owner
  observation at session close (Verdant Sheltering Glade): the
  default "trigger: second instance OR owner direction" criteria
  used across most Pending-Graduations Register entries is too
  restrictive in practice. Strong candidates with one robust instance
  + clear principle articulation can wait sessions for a second
  instance that may never come, while owner direction is a synchronous
  cost. Future session needed to: (a) audit the trigger criteria
  shape across the register; (b) propose alternative criteria
  (single-instance-with-evidence-density, principle-articulation
  quality test, structural-coverage check); (c) update consolidate-docs
  §7a guidance. Trigger: future session with owner appetite for
  flow refinement; status: pending. Evidence: this session graduated
  PDR-036/037/038/039 on owner direction after the candidates had
  been pending for sessions despite stable doctrine and worked
  instances.
+ 2026-04-30; commit-bundle-leakage-from-wildcard-staging — wildcard
  `git add -A` (or moral equivalent) over a working tree containing
  another session's WIP produces a commit whose message is true for one
  slice of the diff and silent about the rest. Surfaced 2026-04-30 by
  the `75ac6b75` post-mortem (51 lines of legitimate continuity work
  bundled with 372 lines of parallel Practice-thread plan work plus 3
  lines of unrelated `.claude/settings.json` plugin enable). Corrective
  shape: stage by explicit pathspec from the queued intent; verify
  staged-bundle-matches-intent before commit; treat
  files-outside-the-named-intent as a coordination event. Already
  partially in distilled.md § Process; trigger for full graduation
  (rule + commit-skill amendment): second cross-session instance OR
  owner direction. Status: pending. Evidence:
  [`experience/2026-04-30-verdant-the-bundle-was-the-signal.md`](../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md).
+ 2026-04-30; substrate-vs-axis-plans convention + working principle
  "invent-justification-as-signal"; **GRADUATED 2026-04-30 by Verdant
  Sheltering Glade per owner direction "general principles are PDRs, if
  there are two principles there are two PDRs; specific instances are
  ADRs"** to two new PDRs:
  [PDR-036 Friction-as-Structural-Finding](../../practice-core/decision-records/PDR-036-friction-as-structural-finding.md)
  (generative principle) and
  [PDR-037 Substrate-vs-Axis Plan Categorisation](../../practice-core/decision-records/PDR-037-substrate-vs-axis-plan-categorisation.md)
  (Practice-governance applied to plan collections). The convention
  component file at
  [`templates/components/substrate-vs-axis-plans.md`](../../plans/templates/components/substrate-vs-axis-plans.md)
  remains as the canonical worked-example artefact, now cited from PDR-037.
  Status: graduated 2026-04-30.
+ 2026-04-29; pre-2026-02-15 experience corpus extraction backlog
  (~80 files dating from 2025-01 through 2026-02-15 contain
  inline doctrine, code blocks, principle catalogues that displace
  the subjective register; healthy post-2026-02-15 corpus shows
  the audit discipline now works as intended); one-time extraction
  task; trigger: owner direction; status: pending. Evidence:
  experience-audit report. Recommended extraction approach:
  preserve subjective texture, strip technical content, link to
  canonical homes; group by similar source files (phase-* cluster,
  2025-01 cluster, 2025-08 cluster) for batch processing.

+ 2026-05-01; **`stop inventing optionality` / apply-don't-ask** —
  **QUARANTINED 2026-05-01 by owner direction**. The doctrine
  contributed to (or ran alongside) a destructive `git checkout --`
  that discarded parallel-agent uncommitted work; the bias toward
  action lacks a destructive-operation guard. The candidate is
  removed from active circulation pending deep human review.
  Substance, evidence trail, and pointers preserved at
  [`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`](quarantine/apply-dont-ask-doctrine.md).
  **DO NOT APPLY** until owner re-authorises with a corrected shape
  or rejects the candidate. Status: quarantined (not pending, not
  due, not graduated).
+ 2026-04-30; **don't shoehorn a value-claim into infrastructure that
  cannot carry it** — when the right way to verify something does not
  exist yet, the honest plan says so and ships the structural enforcement
  that does exist; it does not invent brittle tests or fantasy operational
  protocols to fill the gap. Sense-check: "if this stopped existing
  tomorrow, who would know? how?" If the answer is "no one, because the
  infrastructure for knowing doesn't exist", do not pretend the
  infrastructure exists. Status: pending. Trigger: second instance OR
  owner direction. Evidence: Iridescent's session-close napkin (LLM-
  graded outcome conditions in EEF plan removed under owner direction).

+ 2026-05-01; **rush impulse as system-level entropy generator + three
  structural cues** — owner-named at the close of the 2026-05-01
  consolidation turn, in response to two rush failures within that turn
  (the *bootstrap fast-path* candidate; the *informational not actioned*
  defer-shape on napkin CRITICAL fitness). Substance: most named fences
  in the codebase (replace-don't-bridge, stop-inventing-optionality,
  stage-by-explicit-pathspec, learning-preservation-overrides-fitness,
  hook-failures-are-questions, no-underscore-rename, no-sed-bypass,
  session-handoff hard gate, PDR-026 deferral-honesty, PDR-042 signal-
  distinguishing) all fight the same generator from different angles;
  fence accumulation without naming the generator is microstate
  proliferation around an unchanged macrostate. Three structural cues
  forward as a cohesive defence rather than separate fences: (1)
  vocabulary trip-list at output time — *fast path*, *quick fix*,
  *informational not actioned*, *defer*, *light pass exempts*, *for
  later*, *out of scope*, *next session*; (2) conditional-discipline
  check before proposing structure — does the candidate introduce a
  "case where the rule doesn't apply"?; (3) first-principles framing
  question — what would the path look like with no closure pressure?
  Graduation target candidates: PDR-shaped (Practice-governance about
  doctrine-evolution discipline, sibling of PDR-042); pattern in
  `practice-core/patterns/` after a synthesis with the existing fences
  it ties together; or amendment to PDR-042. Trigger: owner direction
  has fired in part (the framing was named explicitly this session);
  graduation requires a deliberate next-session shape not mid-turn
  closure (per the very discipline being captured). Evidence: napkin
  2026-05-01 metacognition entry (Deep Navigating Stern); experience
  file at
  [`experience/2026-05-01-deep-the-rush-was-the-fix.md`](../../experience/2026-05-01-deep-the-rush-was-the-fix.md).
  Status: pending — first articulation; second cross-session
  articulation OR explicit owner authorisation of PDR/pattern shape
  required before promotion.

+ 2026-05-01; **markdown shared-state writes have no collision
  safety** — captured 2026-05-01 by Deep Navigating Stern after an
  unrelated agent silently overwrote `repo-continuity.md` Last
  refreshed entry + Active identities column + Deep consolidation
  status, AND `threads/agentic-engineering-enhancements.next-session.md`
  Last refreshed entry + identity-table row, between handoff-close and
  stage. The napkin, pending-graduations register, experience file,
  and `~/.claude.json` MCP swap survived intact because their shapes
  are naturally collision-resistant (per-session append heading;
  structured per-item additive entries; per-session-per-agent named
  file; user-scope file outside any agent's standard write path).
  **Substance**: JSON shared-state has transaction safety since
  `11f0320f` (the collaboration-state-write-safety landing); markdown
  shared-state has no equivalent. Single-slot Last refreshed prose
  surfaces are the only collision class — every concurrent
  session-handoff walks through this hazard. Five prevention shapes
  considered (full table in napkin), strongest combination:
  (a) **convergent write-surfaces (additive design)** — make Last
  refreshed entries append-only by structure, eliminating the
  collision class as the thread record's identity table already does
  per PDR-027; (b) **handoff-window claim** — direct analogue of the
  `git:index/head` commit-window claim, with new `area_kind: handoff`
  on the active-claims schema. Intermediate detection-only mitigation:
  post-write `stat` of touched files at handoff-close, ALERT if
  `mtime > handoff-start`. Graduation target: extend write-safety
  doctrine from JSON state to markdown shared-state surfaces;
  concretely (a) Last refreshed surface redesign in
  `commands/session-handoff.md` + the two affected files'
  conventions, (b) `area_kind: handoff` on the active-claims schema
  + queue/claim integration, OR (c) a PDR amendment to the
  collaboration-state-domain-model plan family that names the
  collision-class structurally. Routes to existing
  [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../plans/agentic-engineering-enhancements/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
  as the future-plan home for shared-state collision analysis.
  **Trigger**: owner direction has fired in part (the request *"any
  prevention or additional signal would be very welcome"* names the
  prevention question directly); a deliberate next-session shape is
  required for design-and-implementation work — installing prevention
  mid-handoff would be the rush impulse the prior register entry
  just named. Evidence: napkin 2026-05-01 *markdown shared-state
  writes have no collision safety* entry (Deep Navigating Stern);
  this very session's revert-and-re-apply of the two affected files
  recorded in the in-place note inside both. Adjacent: the 2026-04-30
  *commit-bundle leakage from wildcard staging* distilled entry names
  a sibling-but-distinct mechanism (single-agent action consumes
  peer's WIP) — the present mechanism is the inverse (concurrent
  independent writes overwrite each other on a shared single-slot
  surface). Status: pending.

+ 2026-05-01; **retired threads need explicit retirement signal in
  the file itself, plus a consolidation-time hygiene check** — owner
  observation 2026-05-01 (Deep Navigating Stern session): the
  `pr-90-build-fix-landing.next-session.md` thread has been complete
  for several days but the file in `threads/` shows no retirement
  banner; an agent browsing the directory sees a file shaped like
  an active thread record. Retirement is documented only in
  `repo-continuity.md` prose (*"The pr-90-build-fix-landing thread
  retired 2026-04-30 (PR #90 merged 2026-04-29T20:43:22Z). Thread
  record retained ... for audit-trail value."*); the file itself
  carries no signal. Owner reframing: *"we need a thread hygiene
  prompt, perhaps in the document consolidation workflow."* Two
  distinct hygiene shapes that compose: (a) **per-file retirement
  banner** — add a frontmatter status field (`status: retired`,
  `retired_at: <date>`, `retirement_reason: <one-line>`,
  `audit_trail_retained: true|false`) plus a top-of-file banner
  pointing to the canonical record of why; (b) **`consolidate-docs`
  step 7c thread-hygiene check** — extend the existing six-check
  audit with a seventh: enumerate `threads/*.next-session.md` files
  AND compare to the `Active threads` table; flag any thread file
  not listed in Active threads (signals retirement-without-banner)
  AND any retired-banner file whose retirement age exceeds a
  threshold (signals time-to-archive to `threads/archive/`). (a)
  makes retirement self-evident at the file level; (b) catches
  retirement-without-(a) and prompts archival cadence. Substance
  routes naturally to a PDR-027 amendment (thread identity surface)
  plus a `consolidate-docs.md` step 7c amendment. Trigger: owner
  direction has fired in the request itself; graduation requires
  deliberate next-session work for the doctrine + workflow change
  + retroactive banner application to the one currently-retired
  thread record. Status: pending. Evidence: this session's owner
  observation; the
  [`pr-90-build-fix-landing.next-session.md`](threads/pr-90-build-fix-landing.next-session.md)
  thread record itself; the corresponding prose retirement note
  in `repo-continuity.md`.

+ 2026-05-01; **producer output is not immutable when the producer is
  ours** — owner-named at the close of the EEF-Increment-1 review
  turn (Vining Whispering Root): *"are the constraints truly inherent
  in the data, or do we have gaps in our graph building architecture
  that we are now discovering because of our graph consuming
  architecture?"*. Substance: the Cardinal Rule (types flow from a
  single source through codegen) implies a parallel discipline for
  generator-emitted graph structure — gaps in generator output are
  our gaps to close, not domain constraints to carve around. The
  graph-query-layer plan's four `NO TRACER` carve-outs were classified
  as "data doesn't support it" when three of four are generator gaps
  on graphs we own (`oak-sdk-codegen/bulk/generators/*-graph-generator.ts`).
  Layer-inversion: consumer designed first, producer's accidents
  became consumer's contracts. Cure: amend `principles.md § Cardinal
  Rule` (or sibling rule) to extend the single-source-types
  discipline to generator-emitted structure; pair with a shared
  `@oaknational/graph-tools` workspace (decompose-at-the-tension)
  that owns canonical graph types, derivation utilities, identity
  primitives, operations, and validation, imported by both producers
  and consumers. Status: pending — first explicit articulation
  (the Cardinal Rule's existing wording covers it for *types* but not
  visibly for *structure derivation*); trigger: second instance OR
  owner direction. Family: sibling of the PDR authorised this turn
  on *recall-dependent principles need active firing layers* — same
  underlying shape (agent substitutes path-of-least-resistance for
  architecturally-correct path; the cure is structural, not
  procedural). Evidence: napkin 2026-05-01 producer/consumer
  disjointedness entry (Vining Whispering Root); concrete impact
  proposal sketched (graph-query-layer.plan.md amendments + sibling
  `graph-tools-workspace.plan.md` FUTURE).

+ 2026-05-01; **idea (pre-candidate): hook-layer safety net for
  destructive operations** — owner-recorded after the 2026-05-01
  destructive `git checkout --` incident. Concept: a `PreToolUse`
  hook (or equivalent) that intercepts the named destructive Bash
  operations (`git push --force*`, `git reset --hard*`, `git rebase*`,
  `git clean -f*`, `git branch -D*`, `git checkout --*`,
  `git restore*`, `git stash*`, `git revert*`, `git commit --amend*`,
  `git push*`, `rm -rf*`) and either blocks or forces explicit fresh
  authorisation per call. Operates as an active firing layer — the
  shape that the recall-dependent-principles PDR (owner-authorised
  2026-05-01) names as the structural cure for safety rules whose
  passive-prose form does not survive flow-state pressure. Pairs
  with the `.claude/settings.json` `permissions.deny` / `permissions.ask`
  proposal (separate decision; settings are a coarser layer, hooks
  give per-call surfacing in chat with reasoning context).
  **Status: idea, not yet a doctrine candidate.** Not subject to any
  trigger condition; recorded for future structural-cure design
  rather than promotion through the candidate pipeline. Owner
  decision required to activate.

Older graduated entries (PDR-018, PDR-026, PDR-029, PDR-033, PDR-034,
ADR-153, ADR-164, etc.) are preserved in
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md)
and earlier archive files for full audit trail.
