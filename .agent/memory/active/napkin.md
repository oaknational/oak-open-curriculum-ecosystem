---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

## 2026-05-04 (Fronded Flowering Thicket, `7c8381`) — Napkin rotation under owner-relaxed fitness

Owner directed a full napkin processing pass with fitness pressure on
target surfaces (distilled.md, archive) explicitly relaxed:
*temporarily do not worry about fitness targets in the target
surfaces; once that is done we will revisit the fitness results and
decide what to target next*. The previous active napkin had reached
785 lines (critical zone — over target 220, hard limit 300, and
critical threshold 450), and had accumulated the load-bearing learning
from the 2026-05-03 → 2026-05-04 doctrinal arc (rule-applies-always,
plan-vs-principle, question-shape, insight-capture-now,
sequenced-deferral, templates-encode-failure-modes, and the
parallel-worktree-dispatch reliability finding).

The previous active napkin was archived to
[`archive/napkin-2026-05-04.md`](archive/napkin-2026-05-04.md). It
carries the full record of the 2026-05-03 corrective consolidation
(hedging stripped from principles), the 2026-05-03 EEF observability
session-spiral diagnosis (Salty Navigating Jetty + Tidal Flowing
Reef), the 2026-05-04 TDD-as-design doctrinal restructure (Dewy
Shedding Glade), the 2026-05-04 doctrine-enforcement-quick-wins
parallel dispatch (Pearly Snorkelling Reef), and the three
session-close owner asides (planning vocabulary, memory-system review,
sequenced-deferral discipline).

High-signal entries from that arc graduated this rotation to:

- `distilled.md § Process` — *the rule applies, always; no hedging,
  no carve-outs, no exceptions*; *plan-following is not
  principle-following; re-apply the first-question at every
  elaboration boundary*; *the question is never "carry on with known
  bad", it is "how do we adopt the new insight"*; *insight capture
  happens at the moment of occurrence, every later moment is a
  degraded copy*; *sequenced-deferral discipline: every deferral
  points to a plan + phase, or to a sequenced decision point*;
  *templates can institutionalise failure modes; doctrine and
  template must update together*; *the "cheap cure" framing is
  categorically excluded* (operationalisation of principles.md §
  Architectural Excellence Over Expediency).
- `distilled.md § Multi-agent collaboration` — *parallel
  `isolation:"worktree"` dispatch is unreliable; prefer sequential
  for non-trivial work* (with full set of cures: HEAD verification,
  halt-and-report briefing, worktree-path tool-call confirmation,
  default to sequential).
- `principles.md § Architectural Excellence Over Expediency` — already
  carries the absolute "no hedging" framing as of 2026-05-02; the
  2026-05-03 corrective sharpened the operational consequences and
  removed prior-art carve-out PDRs/ADRs in the same arc.
- `PDR-018 2026-05-04 amendment §"Beneficial prerequisites must not
  block"` — graduated from owner-named pattern (three observed
  instances: agent-roster taxonomy rename, smoke-harness redesign,
  plans-creating-plans).
- `PDR-038 2026-05-04 amendment §"Doctrine-without-enforcement is
  benefit-then-cost across maturity"` — graduated from owner
  sharpening; refines PDR-038 along a maturity axis.
- `tdd-as-design.md` (new directive) + `no-conditional-tests.md`
  rule + adapters + test-reviewer carrier framing — landed in commit
  `b2ef7992` from the 2026-05-04 TDD-as-design arc.
- `pending-graduations.md` — active candidates including: memory-
  classifications-and-systems review (taxonomy-review trigger
  candidate, owner Aside 2 2026-05-04); PDR-026 §Deferral-honesty
  amendment for sequenced-deferral discipline (sequenced behind
  enforcement infrastructure landing); tests-describe-the-system-to-
  itself (PDR candidate from TDD-as-design arc); reviewers-carry-
  doctrine (PDR candidate, second-instance trigger); validation-
  strategy-as-umbrella (ADR candidate, ADR-121 refresh natural
  carrier); forcing-function-read-path (pattern candidate,
  second-instance trigger); templates-can-institutionalise-failure-
  modes (pattern candidate from this rotation); insight-capture-at-
  moment-of-occurrence (principles-level candidate from this
  rotation).

## 2026-05-04 (Fronded Flowering Thicket, `7c8381`) — Layered processing: knowledge preservation first, fitness second; target fitness has no jurisdiction during processing of the source layer

Owner-stated principle, surfaced mid-rotation: *pick a layer, fully
process it without worry about the fitness functions in the targets,
then move up a layer and process the next layer without worry about
the fitness in the targets, and so on, until all knowledge is
preserved first and the fitness constraints are met second*.

This is a generalisation of the existing rule at `consolidate-docs.md
§ Learning Preservation Overrides Fitness Pressure`. The existing
rule is the per-write version: don't compress this insight to fit
budget. The owner's framing is the orchestration version: fitness
has no jurisdiction during processing of any layer; it only has
jurisdiction on the *resting* state of the system after all
processing is complete.

**The layer stack** (in this Practice's current shape):

1. Capture surfaces (napkin, `.remember/`) — Layer 0.
2. Distilled refinement (`distilled.md`) — Layer 1.
3. Permanent doctrine (principles, ADRs, PDRs, governance docs,
   READMEs, rules, patterns, TSDoc) — Layer 2.
4. Permanent-doctrine internal restructuring (e.g. `principles.md` →
   individual rules; `pending-graduations.md` cleared by graduation;
   over-large governance doc → split into focused docs) — Layer 3.

**The processing rule**: when working on Layer N, fitness in Layer
N+1 surfaces is relaxed. Fitness becomes a *measurement of the
resting system*, not a *constraint on in-process work*. A system
mid-processing will look unhealthy by fitness metrics; that is
expected and correct.

**The closing rule**: at the end of each layer's processing, the
NEXT layer's processing begins. Fitness on Layer N+1 is addressed
only by processing Layer N+1 (i.e. by graduating its substance
upward), not by compression. The pattern repeats until all knowledge
is at its durable home; the residual fitness pressure at that point
is structural feedback worth acting on (refine / split / extend
limit / extend target).

**Symptom in my own behaviour just now (worked instance for the
rule's own first appearance).** During Layer 1 processing
(napkin → distilled), I rewrapped a 123-char heading on the new
napkin at the end of the pass to clear a hard fitness signal. That
was Layer-1 fitness work bleeding back into the active processing
turn. The principle says: leave it. Fitness on the active source
surface has no jurisdiction during processing; if any pressure
remains after Layer 2 also resolves, address it as Layer-3 work.
I also kept the new distilled entries somewhat terse because I had
a lurking fitness concern. With this framing internalised, the
entries should be as long as the substance demands; the next layer
up pulls substance out into permanent homes where it natively
belongs.

**Graduation candidates**:

- `candidate: principle / consolidate-docs amendment` — *Layered
  processing of knowledge: preserve first, restructure second.*
  The principle generalises the existing per-write rule into a
  layer-orchestration discipline. Natural home is
  `consolidate-docs.md § Learning Preservation Overrides Fitness
  Pressure` (extension) or a new top-level methodology section.
  May warrant a principles.md addition if the methodology
  generalises beyond consolidate-docs (likely — it applies to any
  multi-layer knowledge system).
- `candidate: PDR` — *Fitness measures the resting state, not the
  in-process state.* This is a Practice-governance decision about
  the role of fitness signals in the consolidation methodology.
  Adopter scope: every Practice-bearing repo with a fitness-style
  diagnostic. The portable form belongs as a PDR; the host-local
  consequence lands in `consolidate-docs.md`.

## 2026-05-04 (Fronded Flowering Thicket, `7c8381`) — Layer-2 autonomous track complete

Three patterns created:

- `patterns/parallel-worktree-dispatch-unreliable.md` (Agent category) — replaces the distilled entry of the same substance.
- `patterns/templates-encode-failure-modes.md` (Process category) — replaces the distilled entry.
- `patterns/plan-as-artefact-gravity.md` (Process category) — replaces the distilled entry.

Seven graduation-only breadcrumbs pruned from distilled.md
(collaboration entries graduated 2026-04-24 pointer; shared-state-writable
graduated 2026-04-29 pointer; "captured in feedback_..." trio pointer;
learning-before-fitness graduated to napkin SKILL + consolidate-docs;
non-planning-process-graduated-2026-04-24 list; stage-by-explicit-pathspec
worked-instance now in commit skill; build-system-section graduation pointer).

Multi-agent-cures distilled entry trimmed from ~20 lines of prose to a
6-line pointer (substance lives at hypothesis.md / falsification-criteria.md /
experiments.md, all already linked).

Net result: distilled.md 458 → 351 lines (down 107) without losing
substance — every removal had a permanent home.

Open items deferred to owner discussion (Layer-2 second pass):

- 9 PDR-shaped candidates for new doctrine (layered-processing methodology,
  tests-describe-the-system, reviewers-carry-doctrine, the-rule-applies-always,
  plan-vs-principle, question-shape, insight-capture-at-moment-of-occurrence,
  multi-agent-cures-as-hypothesis formalisation, workspace-first-investigation).
- 1 ADR-shaped candidate (validation-strategy-as-umbrella; ADR-121 refresh).
- 3 rule candidates (no-moving-targets-in-permanent-docs, cli-first-before-
  owner-questions, no-cheap-cure-options) — each gated on underlying ADR/PDR.
- 4 stable-but-no-natural-home items (ADR/PDR citation discipline,
  sequenced-deferral discipline, hash-recompute-drift, Practice-Core-portability).

## 2026-05-04 (Fronded Flowering Thicket, `7c8381`) — PDR-045 graduated; Layer-2 first deliverable landed

Owner directed Workspace-first-investigation as the first PDR draft
of the Layer-2 graduation pass. Authored
`PDR-045-workspace-first-investigation-discipline.md` with three
moves (artefact search before remote retry; shared-package survey
before parallel infrastructure; live-state check before brief
enumeration). Composes with PDR-033 (vendor-platform variant of
Move 2) and the cross-system observability discipline (Move 1
across multiple sources).

Companion drift-fix: the PDR README index had not been updated when
PDR-043 and PDR-044 were authored. Added all three (PDR-043, PDR-044,
PDR-045) to the index in one pass; logged in the Practice CHANGELOG.

Three host-rules now operationalise PDR-045 and cite it:

- `validate-full-target-estate.md` cites PDR-045 §Move 1.
- `read-diagnostic-artefacts-in-full.md` cites PDR-045 §Move 1.
  (Also fixed a pre-existing stale PDR-016 filename in this rule.)
- `consolidate-at-third-consumer.md` cites PDR-045 §Move 2.

Distilled.md `## Workspace-first` section removed in the same pass
(substance now lives at PDR-045). distilled.md ended Layer 2 at 308
lines (down from 458 at Layer 2 start; net -107 from Layer 1 close;
net -150 from start of pass). Still in `hard` zone — owner has held
target fitness relaxed across both layers, and per the layered-
processing methodology that's correct: the residual hard pressure
is structural feedback for Layer 3 (permanent-doctrine internal
restructuring) rather than something to compress now.

Owner direction: continue the work in a fresh session. Next-session
candidates remain open from the Layer-2 candidate list:

- 8 PDR-shaped candidates not yet drafted (highest-leverage trio:
  layered-processing methodology, the-rule-applies-always,
  insight-capture-at-moment-of-occurrence).
- 1 ADR-shaped candidate (validation-strategy-as-umbrella; ADR-121
  refresh).
- 3 rule candidates (gated on underlying ADR/PDR existing).
- 4 stable-but-no-natural-home items requiring owner discussion.

## Open observations from this consolidation pass

- `distilled.md` ended this rotation at 464 lines — above its hard
  limit (275) under the prevailing thresholds. Owner has held fitness
  pressure on distilled relaxed for this pass; next-target decision is
  owner-side. Candidates for next pass: graduate sequenced-deferral
  to PDR-026 amendment once enforcement landing path is clearer;
  graduate templates-can-institutionalise-failure-modes to a pattern
  file once a second instance accrues; consider whether
  insight-capture-at-moment-of-occurrence is principles-level (owner
  decision).
- `pending-graduations.md` remains at 1128 lines (critical zone
  pre-rotation; this rotation didn't operate on it). Several entries
  added by this rotation are noted above; the register itself
  continues to grow toward an explicit pruning pass.
- The reference-link block in `distilled.md` was rebuilt during the
  prune; only references actually used in the body remain.

## 2026-05-04 (Vining Spreading Seed / `Briny Sailing Lagoon`, `11429f`) — doctrine-enforcement-quick-wins WS3/WS4/WS6 landed

Landed all three remaining workstreams of
`doctrine-enforcement-quick-wins.plan` as atomic TDD-cycle commits:

- **WS6** (`0fffc55e`) — Bash hook now blocks `git add -A`, `git add
  --all`, `git add .` with a doctrinal citation surfaced in the
  deny payload. The patterns-policy schema now accepts `string |
  {pattern, citation}` so the hook teaches the rule's anchor at the
  moment of denial, not just *that* the call was denied.
- **WS3** (`c256f325`) — `policy.json` `preToolUseContent` now
  carries a `scoped_blocks` array. Each entry: `{pattern, kind?,
  include_paths, exclude_paths?, citation}`. Path matching is
  substring for prefix paths and `endsWith` for `**/*.suffix` shapes.
  Twelve hedging-vocabulary literals registered (carve out / -out /
  around; an / with the / make an exception; for these arcs; honest
  framing for; permitted variant; land it then iterate; cheap cure;
  good enough; quick fix). Doctrine-defining surfaces excluded
  (`principles.md`, `distilled.md`, PDR-043, PDR-044, archives, test
  fixtures).
- **WS4** (`8b0fe826`) — `kind: "regex"` added to scoped_blocks
  with `excludes_inline_code` (strips backticked spans before the
  regex test) and `excludes_lines_with` (skips lines containing any
  marker, e.g. `(historical reference)`). Fenced code blocks are
  also skipped via best-effort line-level fence tracking on the
  new_string. SHA pattern uses a lookahead
  `\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b` so pure-decimal tokens
  (timestamps, integer counts) don't trip the matcher.

### Worked-instance lessons (graduation candidates if they recur)

- **Peer-staged renames in the index bleed into your staging area
  via `git add`.** Fronded had a rename pre-staged (`napkin.md →
  archive/napkin-2026-05-04.md`) before this session opened. My
  `git add scripts/...` call **also** staged that rename because
  the index already contained it. Cure: use `git commit --
  <pathspec>` to commit-by-path regardless of what else is in the
  index. `git reset HEAD <peer-files>` works as a fallback but
  briefly disturbs the peer's staging-area view. Candidate to
  graduate to a rule alongside "stage by explicit pathspec".
- **Pre-commit hooks scan the whole working tree, not just the
  staged set.** Three commits in this session were initially
  blocked by Fronded-WIP markdownlint / Prettier issues unrelated
  to my staged files. Mechanical formatting fixes to peer WIP are
  documented practice (Verdant Flowering Blossom 2026-04-28 entry
  in the comms log) — *gate-honest mechanical fixes*, not peer
  interference. Worth surfacing as part of the explicit-pathspec
  rule when it graduates.
- **The trip-list-defines-itself paradox.** Authoring the
  hedging-vocabulary scoped_blocks required exclude_paths for the
  documents that *catalogue* the trip-list (`principles.md`,
  `distilled.md`, PDR-043, PDR-044). Without those exclusions,
  every edit to those docs that re-surfaces the named hedging
  words trips the hook. The structural fix is the recursive
  exclusion list. The general principle: any structural enforcer
  that names its own pathogen must exclude the documents that
  define the pathogen. Graduation candidate: pattern.
- **Hex-class regexes match decimals too.** The naive
  `[a-f0-9]{7,40}` matched 13-digit timestamps as well as SHAs.
  The `(?=[0-9a-f]*[a-f])` lookahead is the cure — at least one
  a-f character required. Graduation candidate: a small
  ground-rule for any hex-shape detector ("require at least one
  letter to disambiguate from decimal").
- **`$CLAUDE_ENV_FILE` was empty in subshells**, so
  `pnpm agent-tools:agent-identity` could not resolve the
  briefing-stated identity (`Vining Spreading Seed`); the
  fall-back was to pass `--seed` explicitly, which produced the
  deterministic seed-name `Briny Sailing Lagoon`. The
  session_id_prefix `11429f` matches the briefing — peer
  collisions are correctly avoided — but the agent_name in
  active-claims.json drifts from the chat-rendered name. Worth
  surfacing if it recurs.
- **`agent-tools:collaboration-state` flag conventions** —
  cataloguing for future sessions: `--file` is singular (repeat
  per file), `--area-kind` is required (`files | workspace | plan
  | adr | git`), `--active <path>` and `--now <ISO>` are
  required. `comms append` requires `--events-dir` (not
  `--comms-dir`), `--title` and `--body` (not `--message`), and
  `--created-at` in addition to `--now`. Mismatches surface as
  `missing required option --X` errors.

### Audit findings (post-WS landing)

- **`RULES_INDEX.md` discoverability gap, repaired in this session.**
  Initial audit incorrectly concluded *"no rules index exists"* —
  I only inspected `.agent/rules/` and missed the repo-root
  `RULES_INDEX.md` that owner pointed to. The index *did* exist
  but was framed as a Codex project-doc fallback, not referenced
  from `AGENT.md`, and not updated when new rules graduated.
  Repaired by: (a) authoring three rule files corresponding to
  WS3/WS4/WS6 with the canonical-plus-adapters triple
  (`.agent/rules/`, `.claude/rules/`, `.cursor/rules/`); (b)
  reframing `RULES_INDEX.md` as the canonical, platform-independent
  enumeration of always-applied rules with the three-form on-disk
  contract named explicitly; (c) wiring `AGENT.md §Rules` to point
  at `RULES_INDEX.md` as the single source of truth for which files
  belong to the always-applied tier.
- **WS4 citation drift, repaired in this session.** Initial
  citation referenced `distilled.md §Moving targets do not belong
  in permanent docs`, but Fronded's layer-2 rotation removed that
  section in the same arc. Updated the citation to drop the stale
  section reference and keep the durable per-user memory pointer
  plus a forward reference to `pending-graduations.md`.
- **`never-use-git-to-remove-work.md`** scope is destructive
  history + working-tree overwrite. WS6's wildcard-staging block
  is a different class (accidental bundling, not removal). The
  separate rule `stage-by-explicit-pathspec.md` landed in this
  session as its own entry in the index.

### Self-violation discovery: hook spirit > hook implementation

The first attempt at authoring the no-moving-targets rule files
embedded backticked commit SHAs in the rule prose
(`commit \`abc1234\` landed X`-shape narrative). The repo's
permission system rejected the write, naming the anti-pattern: I
had just authored a rule against moving targets in permanent docs,
and was immediately about to violate it on the rule file itself.

The discovery: the WS4 hook's inline-code exclusion strips
backticked spans before the regex test, so backticked SHAs in
narrative prose pass the hook silently. But the rule's spirit is
stricter — bare backticked SHAs in prose are still moving targets,
because the backticks treat the SHA as a code-shaped token while
the prose still ties the doc's claim to a transient instance. The
inline-code exclusion was meant for code blocks where the SHA is
data (YAML examples, JSON snippets), not for prose-references-
with-backticks. The rule file now names this gap explicitly and
treats it as a refinement candidate (either tighten the hook to
detect prose-context SHAs even inside backticks, or leave the hook
as-is and rely on the rule for the stricter case).

This is also a worked instance for *the rule applies, always — no
hedging*: a rule against moving targets cannot embed moving
targets, even in its own source-landing footer. The fix was simple
(name the WS, name the date, omit the SHA); the discovery was the
implementation/spirit gap.

### Quality-gate state at session close

- `pnpm type-check`, `pnpm lint`, `pnpm test` (1001+),
  `pnpm test:root-scripts` (174), `pnpm practice:vocabulary` —
  all green.
- `pnpm practice:fitness:informational` — pre-existing critical /
  hard pressure on `distilled.md`, `napkin.md`,
  `pending-graduations.md`, `principles.md`. Owner-relaxed for
  Fronded's parallel napkin-rotation; not introduced by these
  workstreams.
- `pnpm build`, `pnpm test:e2e` — not run; no SDK or app code
  touched, gates would be no-ops.
