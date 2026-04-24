# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

**Rotation**: 2026-04-22. Outgoing napkin (2,323 lines, sessions
2026-04-22 through 2026-04-24) archived to
`archive/napkin-2026-04-22b.md`. Nine behavioural learnings
extracted and merged into `distilled.md`. Pattern candidates
carried forward in the pending-graduations register.

Prior rotation: 2026-04-22 (sessions 2026-04-19 through 2026-04-21,
archived to `archive/napkin-2026-04-22.md`).

---

## 2026-04-24 (Frodo / claude-code / claude-opus-4-7-1m) — `.remember/` plugin wiring + sonarjs investigation + activation plan

**Landings**: `.remember/` plugin buffers wired into ignore configs (ESLint shared `ignores`, `.prettierignore`, `.markdownlintignore`) and capture workflows (`start-right-quick` step 3, `start-right-thorough` learning-loop section, `session-handoff` step 6a auxiliary input, `consolidate-docs` step 3 capture surfaces + step 7 graduation inputs); commit `83ec9198`. Cursor and Codex per-user memory surfaces named explicitly in the same grounding/consolidation surfaces (parallel to the existing Claude Code auto-memory bullet); commit `76b4de50`. SonarCloud integration committed; commit `69a87c44`. Sonarjs plugin imported in oak-eslint `recommended` but registered as an inactive `{ plugins: { sonarjs } }` placeholder; activation backlog plan authored at `.agent/plans/architecture-and-infrastructure/current/sonarjs-activation-and-sonarcloud-backlog.plan.md`; commit `d2a4815e`. Owner's pre-staged observability plan-body tightening committed; commit `5fc52d86`.

**Observations / Surprises**:

### Surprise (candidate: feedback memory + possible PDR)

- **Expected**: when owner asks a direct verification question ("did you wire X?"), I would answer with yes/no and evidence.
- **Actual**: I responded with a 5-row table AND a "what I did NOT touch" section that invented an adjacent scope question (napkin SKILL.md extension) the owner had not asked for. Owner called this out explicitly: "you have evaded direct answers, why."
- **Why expectation failed**: reflex toward breadth as a form of risk-aversion — if the answer spreads across more surfaces, I cannot be pinned on scope. But this shifts cognitive load onto the owner and reads as evasion. The failure mode is "risk-aversion through breadth."
- **Behaviour change**: on verification questions, first sentence answers the question (yes/no/partial + what's missing); second paragraph is evidence only (commit SHA, file paths); do not invent adjacent scope; tables are for comparisons, not for answering yes/no. Owner-auto-memory saved at `feedback_answer_verification_questions_directly.md`.
- **Source plane**: `active` (behavioural guidance from session learning; may be PDR-shaped at thread-scoped depth).

**candidate**: PDR-shaped governance rule — "direct-answer discipline on verification questions" — because it's substance about how agents communicate with owners, not about product architecture. Mark as PDR candidate in the pending-graduations register.

### Surprise (structural, worth recording)

- **Expected**: if `eslint-plugin-sonarjs` is installed as a dependency, it's wired into some config.
- **Actual**: sonarjs was installed, externalised in `tsup.config.ts`, and allow-listed in `knip.config.ts` under `ignoreDependencies` — but **never imported in any preset**. Dead dependency for an unknown time. Discoverable only by grepping for the package name across the repo.
- **Why expectation failed**: installed-plus-allow-listed is a wiring-decision-deferred state, and I had no heuristic for detecting it. The knip `ignoreDependencies` list is effectively a "this is intentionally unused" register; a deferred wiring decision parked there becomes invisible.
- **Behaviour change**: when a dependency is in a package's `ignoreDependencies` list, that's a wiring-decision surface — audit the entries when exploring tooling state. The comment next to the entry ("ESLint plugins are peer dependencies used at runtime") can be wrong even when well-intended.

### Surprise (scale)

- **Expected**: SonarCloud remote baseline would be moderate; maybe a few hundred issues.
- **Actual**: 1,244 total issues — 67 bugs, 1 vulnerability, 169 security hotspots, 1,176 code smells. 99 hours of technical debt. Reliability rating D (4.0), Security rating E (5.0). Maintainability A.
- **Why expectation failed**: SonarCloud's rule set is much broader than eslint-plugin-sonarjs and covers classes the plugin can't port (security hotspots especially). Absence of prior triage + broader rule coverage + 162k LOC = large backlog.
- **Behaviour change**: before proposing a "single PR" for a backlog-clearing task, pull baseline counts first. User's instinct framing (one PR) was reasonable pre-data; my job was to surface the data and let them rescope. Did so; user settled on "phased ordering with gate-outs, one PR aspirationally."

### Observation (pattern candidate)

- **Gate-off, fix, gate-on** is a named shape for quality-tool activation with phased gate-outs. Applies wherever a new linter / static-analyser / coverage threshold would produce violations large enough to stall a single-PR fix. The plan at `sonarjs-activation-and-sonarcloud-backlog.plan.md` instantiates it: Phase 0 baseline, Phases 1-4 severity-ordered fixes with explicit gate-out points, Phase 5 single-commit activation flip. Worth promoting to `.agent/memory/active/patterns/` as an engineering-instance pattern on second instance.
- **candidate**: pattern instance, pending a second ecosystem instance or explicit owner request to promote.

### Observation (category distinction)

- **Plugin-managed ephemeral capture surfaces** (e.g. `.remember/` from the remember plugin) are distinct from:
  1. agent-authored napkin (repo-in, we own lifecycle)
  2. platform-specific per-user memory (`~/.claude/projects/.../memory/`, `~/.cursor/chats/`, `~/.codex/memories/` — per-user, plugin-or-platform-manages lifecycle, scoped to one agent's platform)
- The distinction matters for the capture→distil→graduate→enforce pipeline: we READ all three but we only WRITE/ROTATE the napkin. `.remember/` and platform memory are read-sources.
- **candidate**: PDR amendment to PDR-011 (Continuity Surfaces and Surprise Pipeline) adding "plugin-managed ephemeral capture surfaces" as a first-class category alongside the napkin. Trigger: ≥1 second plugin of this shape appears (or explicit owner request).

### Observation (command nuance)

- `pnpm format` does not exist in this repo; `pnpm format:root` is the canonical. I defaulted to raw `npx prettier --check` when verifying my edits, which was corrected by the owner. Canonical repo scripts encode the exact flags and caching behaviour the gate enforces; raw npx can diverge. Owner-auto-memory saved at `feedback_repo_scripts_over_npx.md`.

---

## 2026-04-22 (consolidation session) — agent infrastructure portability audit + napkin rotation (claude-code / claude-opus-4-6-1m)

**Observations**:

- **Fitness validator does not exclude markdown links from
  prose line-length**: long markdown link lines (which cannot
  be broken across lines) trigger prose-width violations. The
  `classifyLines()` function in
  `scripts/validate-practice-fitness.mjs` should classify
  lines that are predominantly link content as a distinct kind
  (e.g. `link`) and exclude them from prose-width checks.
  Enhancement candidate for a future session. Temporarily
  worked around by raising `fitness_line_length` to 200 in
  `repo-continuity.md` (the worst-affected file); revert
  when the validator is enhanced.

- **Token budget per session is an unrecognised external
  constraint**: models have a finite context window (currently
  200k tokens typical, moving towards 1M). Every rule, skill,
  directive, plan, and memory file loaded into a session
  consumes budget. This budget is not yet explicitly designed
  for — there is no canonical definition of what a session's
  token budget IS, nor any system for measuring or managing
  the load. This is a key concept that needs a canonical
  definition and eventually explicit design consideration.
  Recognising it here; full design is future work.

- **Loop-closure evidence** (extracted from Session 5 close
  summary during repo-continuity archival): the
  `capture → distil → graduate → enforce` pipeline (ADR-150 +
  PDR-011) fired end-to-end within a single session for the
  first time during Session 5. Owner metacognition intervention
  was load-bearing — neither Class A.1 nor A.2 tripwires fire
  on close-time deferral honesty, which is the gap the
  deferral-honesty rule addresses.

- **Distilled graduation exposed structural gaps in the
  guidance system**: triaging individual distilled entries
  revealed that several categories of guidance have no proper
  home in the Practice. The categories and gaps identified:

  1. **Behavioural norms** (agent-human collaboration model,
     scope discipline, risk classification, dialogue-not-
     authority) — no directive exists. Needs a new directive
     (e.g. `behavioural.md` or `collaboration.md` in
     `.agent/directives/`).
  2. **Planning discipline** (discoverability, narrative-first
     sequencing, parent-child reconciliation, validation
     closures) — plan templates have structure but not process.
     Needs a planning skill and/or directive. Suggests a gap
     in specialist sub-agents (planning expert).
  3. **Portability principles** — general cross-platform agent
     infrastructure principles need a PDR (genotype);
     repo-specific application needs an ADR (phenotype). Both
     missing.
  4. **Agent-operational gotchas** (tool-specific behaviours
     like `replace_all` corruption) — NOT repo documentation.
     These are about specific agent tooling, not the
     codebase.

  The meta-learning: when items resist classification into
  existing homes, the question is not "where does this item
  go?" but "what does the system need to look like?" Triage
  is a surface activity; systems design is the real work.

  Owner feedback on the collaboration model: "not 'who has
  authority' but 'how can we approach this as a team'" —
  the agent should constructively challenge, ask questions,
  give bidirectional feedback. Overrides are rare, not
  default. This is fundamentally different from "apply
  feedback fully, don't negotiate."

- **`vercel-labs/skills` tool model vs our model**: the skills
  CLI treats `.agents/skills/` as canonical with symlinks
  outward. Our repo treats `.agent/` (singular) as canonical
  with thin wrappers everywhere. After `npx skills add`, a
  canonicalisation step is needed. This interaction is now
  documented in the portability remediation plan at
  `.agent/plans/agentic-engineering-enhancements/current/agent-infrastructure-portability-remediation.plan.md`.

---

## 2026-04-24 (latest, post-meta-session sweep) — cross-cutting commit + thread-record refresh (Pippin / cursor / claude-opus-4-7)

**Observations**:

- **Cross-thread commit sweep is a useful cadence after a meta-
  session**: the 2026-04-22 portability/consolidation outputs and
  this thread's deferred plan-body refinement both sat uncommitted
  for ~2 days before owner direction collected them into a single
  `docs(practice)` commit (`ffec98b0`, 80 files). One commit is
  honest about the multi-stream nature; turn-boundary discipline
  for individual workstreams resumes from the now-clean tree.

- **"Commit choice" overhead in handoff records is symptom, not
  signal**: the prior handoff carried Option-A-vs-Option-B
  framing for the next session because the plan-body refinement
  was uncommitted. Owner direction collapsed the choice. The
  generalisation: when a thread record carries commit-choice
  overhead across a session boundary, the next session's first
  question should be "is the committing actually deferred for a
  reason, or is it residue?" — and if residue, propose collapsing
  rather than executing the choice mechanically.

- **Practice surface relocation is a directive-grounding hazard
  worth flagging in the next-session record**: `continuity-
  practice.md` moving from `docs/governance/` to `.agent/
  directives/` changes which path agents read at session start.
  Refreshed thread record now names the new path explicitly so
  the next session does not chase a broken link.

---

## 2026-04-24 (intra-session, post-handoff) — tool-examples e2e relocated to integration level (Pippin / cursor / claude-opus-4-7)

**Observations**:

- **`tools/list includes examples for generated tools` e2e
  timeout under pre-push concurrency surfaced a deeper testing-
  strategy violation, not a flake**: examined the test in
  response to a 60s timeout on push; reproduction in isolation
  passed quickly. Investigation showed the file (i) created a
  fresh Express app (3 rate-limit timers each) per `it` block,
  (ii) proved a property of two upstream libraries (Zod 4
  `.meta({ examples })` round-trip + MCP SDK's built-in
  `tools/list` handler), (iii) duplicated proofs already present
  in two integration tests (codegen `meta-examples-roundtrip` +
  aggregated-search `flat-zod-schema`), and (iv) carried a
  docstring referencing an abandoned "B3 Hybrid Approach" with
  a `setRequestHandler` override that doesn't exist in source.
  Decision: delete and add the one missing piece (aggregated-
  fetch `flat-zod-schema.integration.test.ts`) at the
  integration layer. Landed in `6764457d`.

- **The 60s timeout itself is a useful diagnostic substrate
  candidate**: e2e test files that bootstrap the full Express
  app + middleware (3 rate limiters with dangling timers,
  Sentry wrappers, etc.) per `it` block are at risk of starving
  the event loop under pre-push parallel turbo execution. Pattern
  worth distilling: "if an e2e file's per-test bootstrap cost is
  high and it proves an upstream-library property, the test is
  in the wrong place". Touches the testing-strategy directive's
  rules on level-correctness and "Each proof should happen ONCE".

- **Auto-staging surprise in the pre-commit window**: at
  `git commit` time, files I had explicitly NOT staged
  (`.claude/hooks/`, `.claude/settings.json`, `README.md`)
  appeared in the staged set — origin not fully traced this
  session, possibly a hook from `sonar-secrets/` setup or a
  Cursor PostToolUse hook firing during the commit attempt.
  Mitigation: `git restore --staged` (index-only, never touches
  working tree) + re-confirm staged set before re-attempting.
  Owner directive received: "unstage is fine, but do not destroy
  any changes" — adopt as a per-commit reflex when the staged
  set widens unexpectedly.
