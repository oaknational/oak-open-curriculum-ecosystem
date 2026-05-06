---
name: "Agent Artefact Load Pressure Relief — Urgent Plugin and Skill Pruning"
overview: >-
  Drop active-skill discovery count below Claude Code's effective discovery
  budget by disabling redundant/unused plugins and triaging the Vercel skill
  set. Companion to the strategic agent-artefact-lifecycle-cli plan.
todos:
  - id: 0-1-baseline-capture
    content: "0.1 Capture pre-pruning baseline (validator output + active-skill count) into Baselines table."
    status: completed
    depends_on: []
  - id: 0-2-settings-backup
    content: "0.2 Backup .claude/settings.json out-of-tree (e.g. /tmp/) for safe rollback."
    status: completed
    depends_on: []
  - id: 1-1-remove-mcp-apps
    content: "1.1 Remove mcp-apps@mcp-apps from .claude/settings.json enabledPlugins."
    status: completed
    depends_on: [0-1-baseline-capture, 0-2-settings-backup]
  - id: 1-2-remove-cloudflare
    content: "1.2 Remove cloudflare@claude-plugins-official from enabledPlugins."
    status: completed
    depends_on: [0-1-baseline-capture, 0-2-settings-backup]
  - id: 1-3-remove-linear
    content: "1.3 Remove linear@claude-plugins-official from enabledPlugins."
    status: completed
    depends_on: [0-1-baseline-capture, 0-2-settings-backup]
  - id: 1-4-phase-1-gate
    content: "1.4 Run portability:check, subagents:check, type-check; document /doctor as session-local only."
    status: completed
    depends_on: [1-1-remove-mcp-apps, 1-2-remove-cloudflare, 1-3-remove-linear]
  - id: 2-1-vercel-inventory
    content: "2.1 Inventory active vs parked Vercel skills; classify each in plan body."
    status: pending
    depends_on: [1-4-phase-1-gate]
  - id: 2-2-vercel-friction
    content: "2.2 Append Vercel friction entry to frictions-register.md (defer removal to strategic plan)."
    status: pending
    depends_on: [2-1-vercel-inventory]
  - id: 3-1-validator-green
    content: "3.1 portability:check + subagents:check green; owner-supplied session count optional."
    status: pending
    depends_on: [2-2-vercel-friction]
  - id: 3-2-functional-spotcheck
    content: "3.2 Verify canonical mcp-apps skills from session evidence if supplied; MCP grants intact."
    status: pending
    depends_on: [3-1-validator-green]
  - id: 4-1-record-outcome
    content: "4.1 Fill in Outcome section with pre/post counts and any anomalies."
    status: pending
    depends_on: [3-2-functional-spotcheck]
  - id: 4-2-continuity-update
    content: "4.2 Light continuity update (comms-log + thread record refresh)."
    status: completed
    depends_on: [4-1-record-outcome]
isProject: false
---

# Agent Artefact Load Pressure Relief — Urgent Plugin and Skill Pruning

**Last Updated**: 2026-05-06
**Status**: 🟡 PHASE 1 IMPLEMENTED; PHASE 2 VERCEL TRIAGE REMAINS
**Decision-completion seal**: All decisions recorded inline; no item
awaits owner sign-off. Execution can begin at Phase 0.1 without
re-opening any question.
**Scope**: Reduce the active-skill discovery surface so Claude Code stops
silently truncating skill metadata in long sessions.
**Companion**: [`agent-artefact-lifecycle-cli.plan.md`](agent-artefact-lifecycle-cli.plan.md)
**Source report**: [`agent-artefact-portability-audit-2026-05-06.report.md`](agent-artefact-portability-audit-2026-05-06.report.md)

---

## Next-session execution — Vercel triage or optional session-local check

Phase 0 and Phase 1 settings work is implemented. The highest-impact
item, **Phase 1.2: remove `cloudflare@claude-plugins-official`
plugin (−8 skills)**, has landed alongside the duplicate `mcp-apps`
removal and unused Linear removal.

`/doctor` is **session-local Claude Code evidence**, not a useful
terminal command or Codex validation target. It reports on the skills
loaded into the active Claude Code session. Do not retry
`claude doctor` from Codex or a shell as plan evidence.

**Optional owner-supplied check** (if already in Claude Code):

1. Record the in-session `/doctor` active-skill count and current
   system-reminder skill list.
2. Confirm the owner-observed count drops by at least 12 against the
   audit proxy (~112 → expected ~100): 4 `mcp-apps:*` and
   8 `cloudflare:*` skills gone.
3. Confirm bare canonical MCP Apps skills still surface:
   `add-app-to-server`, `convert-web-app`, `create-mcp-app`, and
   `migrate-oai-app`.
4. Confirm `.claude/settings.local.json` grants remain intact for
   Oak, Sentry, SonarQube, GitHub, and Vercel.
5. If owner-supplied evidence is captured, append it to this plan's
   Outcome/Baselines tables.

**Next implementation step**: Phase 2 Vercel triage. Do not start the
strategic `agent-tools artefacts` CLI work from this urgent plan.

---

## Context

The audit on 2026-05-06 (see source report) confirmed three plugins are
either redundant (their content is canonicalised and locked) or unused.
The Vercel plugin loads 25 skills, only some of which are exercised.
Disabling redundant plugins is fully reversible, owner-authorised by
this plan, and removes ~12 skills from the discovery surface immediately
with zero functional loss.

This plan is **urgent and tightly scoped**: it does not touch the
canonical artefact tree, does not modify ADRs, and does not refactor any
validator code. It moves only `.claude/settings.json` and (per Vercel
phase) per-skill enablement state. Any architectural improvement is
the remit of the companion strategic plan.

### Issue 1: Redundant `mcp-apps@mcp-apps` plugin

The four `mcp-apps:*` skills (`add-app-to-server`, `convert-web-app`,
`create-mcp-app`, `migrate-oai-app`) duplicate canonical skills already
present at `.agent/skills/<name>/SKILL.md` and recorded in
`skills-lock.json` with computed-hashes. Removing the plugin keeps the
canonical surface and removes the duplicate-namespace risk.

**Evidence**: `skills-lock.json` source = `modelcontextprotocol/ext-apps`
for all four; canonical SKILL.md present and checked by
`pnpm portability:check`.

**Root cause**: ADR-125 amendment 2026-04-24 permits canonicalisation but
does not state policy on whether the source plugin should remain
installed. The plugin is the upstream content source; removing it shifts
update-cadence ownership to the canonical lock entry.

### Issue 2: Unused `cloudflare@claude-plugins-official` plugin

The plugin loads 8 skills (`cloudflare:agents-sdk`,
`cloudflare:durable-objects`, `cloudflare:workers-best-practices`, etc.).

**Evidence**: zero `cloudflare`/`workers`/`wrangler` references in
`.agent/`; zero `mcp__plugin_cloudflare_*` grants in either
`.claude/settings.json` or `.claude/settings.local.json`; no
Cloudflare-deployed workspaces in this monorepo.

**Root cause**: enabled at some prior point; never exercised in this
project's domain.

### Issue 3: Unused `linear@claude-plugins-official` plugin

The plugin contributes commands and an MCP server but no surfaced
skills (per the live skill list). Its presence is metadata noise.

**Evidence**: zero `linear` references in `.agent/`; zero
`mcp__plugin_linear_*` grants in either settings file.

### Issue 4: Vercel plugin breadth

`vercel@claude-plugins-official` loads 25 skills covering AI SDK,
chat-SDK, agent, sandbox, marketplace, AI gateway, runtime cache,
Turbopack, Next.js Cache Components, knowledge-update, etc. Many are
unrelated to Oak's deployed surface (Vercel-hosted MCP server, Vercel
Functions, env vars, deployments).

**Evidence**: skill list inspected during audit. Likely-used:
`bootstrap`, `deploy`, `env`, `env-vars`, `deployments-cicd`,
`vercel-cli`, `vercel-functions`, `verification`, `nextjs`,
`vercel-storage`, `routing-middleware`, `knowledge-update`. Likely-unused
in current scope: `chat-sdk`, `ai-sdk`, `ai-gateway`, `vercel-sandbox`,
`shadcn`, `react-best-practices`, `next-forge`, `next-cache-components`,
`next-upgrade`, `runtime-cache`, `turbopack`, `marketplace`,
`vercel-agent`, `auth`, `workflow`.

**Root cause**: plugin loads its full skill catalogue; Claude Code
exposes no per-skill disable mechanism in user-facing settings. Any
narrowing must be done by the plugin or by removing the plugin and
selecting an alternative integration. Phase 2 captures the audit and
documents the gap; the strategic plan codifies a measurable
skill-budget.

---

## Quality Gate Strategy

After each phase, run:

```bash
pnpm portability:check    # contract still passes
pnpm subagents:check      # reviewer adapters still consistent
pnpm type-check           # no settings parse breakage
```

After Phase 3, also:

```bash
pnpm test:root-scripts    # repo-script smoke
```

A Claude Code `/doctor` or system-reminder measurement is session-local
only. It can be owner-supplied as extra evidence, but is not a
command-line or Codex gate.

---

## Phase 0: Baseline

### 0.1 Capture pre-pruning state

+ **Action**: Record the live `pnpm portability:check` output and, if
  owner-supplied from an interactive Claude Code session, the
  active-skill list (system-reminder block) at session open.
+ **Output**: Append the baseline counts to this plan's "Baselines"
  section below. Do NOT embed in any permanent doc.
+ **Acceptance**: validator green; baseline counts captured here.
  Session-local `/doctor` evidence is optional and cannot be produced
  authoritatively by terminal invocation.

### 0.2 Backup settings

+ **Action**: copy `.claude/settings.json` to an **out-of-tree** location
  (e.g. `/tmp/oak-claude-settings.pre-prune-2026-05-06.json`) for
  rollback. Do NOT place the backup in the repo working tree — the
  `.gitignore` does not currently cover `*.pre-prune-*` suffixes and an
  in-tree backup risks accidental staging.
+ **Acceptance**: backup file exists at the out-of-tree path; the path
  is recorded in the Outcome section for retention.

---

## Phase 1: Redundant plugins

The three removals here are **non-destructive**:

1. **`mcp-apps@mcp-apps`** — content already canonicalised + locked.
2. **`cloudflare@claude-plugins-official`** — no functional dependency.
3. **`linear@claude-plugins-official`** — no skills, no MCP grants in
   use; commands surface only.

### 1.1 Remove `mcp-apps@mcp-apps` plugin

+ **Action**: Edit `.claude/settings.json` `enabledPlugins`; remove the
  `mcp-apps@mcp-apps` entry.
+ **Action**: Optionally `claude plugin uninstall mcp-apps@mcp-apps`
  (project scope) to drop the cache directory.
+ **Owner-confirmation gate**: this is reversible and authorised by
  this plan; proceed without further prompt.
+ **Acceptance**:
  + `pnpm portability:check` passes (canonical skills are unaffected).
  + If owner captures Claude Code session-local evidence, the four
    `mcp-apps:*` skills no longer appear in the system reminder.
  + Bare-name skills `add-app-to-server`, `convert-web-app`,
    `create-mcp-app`, `migrate-oai-app` continue to load (they are
    canonical).

### 1.2 Remove `cloudflare@claude-plugins-official` plugin

+ **Action**: Same shape as 1.1.
+ **Acceptance**: settings no longer enable the plugin; if owner
  captures Claude Code session-local evidence, 8 `cloudflare:*` skills
  no longer appear in the reminder; no failed MCP tool grants.

### 1.3 Remove `linear@claude-plugins-official` plugin

+ **Action**: Same shape as 1.1.
+ **Acceptance**: settings no longer enable the plugin; if owner
  captures Claude Code session-local evidence, no `linear` plugin
  presence appears in the reminder; GitHub plugin (user-scope) is
  unaffected.

### 1.4 Phase-1 gate

+ Run quality gates (above).
+ Document that `/doctor` evidence is session-local and owner-supplied;
  it is not a command-line gate.
+ Expected settings-derived drop: ~12 skills (4 mcp-apps +
  8 cloudflare).
+ If owner supplies post-Phase-1 in-session counts, record them in the
  "Baselines" section.

---

## Phase 2: Vercel triage

The Vercel plugin loads 25 skills. We use Vercel for hosting; we use a
narrow subset of skills.

### 2.1 Inventory active Vercel usage

+ **Action**: Read every `vercel:*` skill description from the active
  surface (already shown in the system reminder); classify into:
  + `keep` — directly relevant to this monorepo's Vercel usage.
  + `parked` — unused in current scope; remove or document.
+ **Output**: Add a table to this plan listing each skill's verdict
  with one-line justification. (Plans are ephemeral; counts and per-skill
  verdicts are appropriate here, not in permanent docs.)
+ **Acceptance**: 25 skills classified; ≥10 marked `parked`.

### 2.2 Resolve `parked` Vercel skills

Claude Code does not expose a per-skill disable in user-visible
settings. Two options:

+ **Option A (preferred)**: open an upstream issue or local override
  asking the Vercel plugin to expose its skill catalogue as
  user-selectable. Track in `.agent/plans/agent-tooling/frictions-register.md`.
+ **Option B**: remove the Vercel plugin and replace with a curated
  internal `vercel-deploy-expert` canonical skill plus the project's
  existing Vercel MCP. Out-of-scope for this urgent plan; deferred to
  the strategic plan.

This phase **records** the gap and the proposed remediation; it does
not yet remove the plugin.

+ **Action**: Append a friction entry (`F-XX: Vercel plugin skill catalogue
  unbounded`) to `frictions-register.md`.
+ **Acceptance**: friction recorded; strategic plan references it as
  input.

---

## Phase 3: Verify

### 3.1 Validator and gates

+ **Action**: `pnpm portability:check` — must pass.
+ **Action**: `pnpm subagents:check` — must pass.
+ **Action**: If owner supplies interactive Claude Code evidence,
  capture the active-skill list from `/doctor` or the system reminder.
+ **Acceptance**: settings-derived post-prune expectation is at least
  12 below baseline; owner-supplied Claude Code evidence can confirm
  no skill discovery truncation is visible.

### 3.2 Functional spot-check

+ **Action**: If owner supplies interactive Claude Code evidence,
  verify the four canonical mcp-apps skills still surface by bare name
  in that session's reminder.
+ **Action**: Verify the project's MCP grants for sentry, sonarqube,
  github, oak, vercel still resolve (no broken `mcp__*` references in
  `.claude/settings.local.json`).
+ **Acceptance**: zero functional regression; canonical skills behave
  identically; the only change is the removal of duplicate / unused
  plugin surfaces.

---

## Phase 4: Handoff

### 4.1 Record outcome

+ **Action**: Update the urgent plan's "Outcome" section below with
  pre/post counts and any anomalies.
+ **Action**: Note the remaining Vercel-plugin pressure in the strategic
  plan's input list.

### 4.2 Update continuity surfaces

+ **Action**: Light continuity-update on close (`mid-session-light-update`
  pattern): comms-log entry; thread record refresh.
+ **Acceptance**: the next session reads the outcome via the standard
  continuity surfaces.

### 4.3 Promote strategic CLI plan if owner agrees

+ The strategic plan
  [`agent-artefact-lifecycle-cli.plan.md`](agent-artefact-lifecycle-cli.plan.md)
  is the durable answer to the underlying drift. This urgent plan is
  the immediate relief; the strategic plan is the structural fix.
+ No promotion needed unless owner directs.

---

## Acceptance criteria (overall)

1. `pnpm portability:check` passes after every phase.
2. Settings-derived active-skill surface drops by ≥12 (mcp-apps:4 +
   cloudflare:8) compared to the audit baseline; owner-supplied
   in-session `/doctor` evidence may confirm this but is not a
   command-line gate.
3. No `mcp__*` grant in `.claude/settings.local.json` is broken.
4. Vercel friction recorded in `frictions-register.md`.
5. Outcome section in this plan filled in.

---

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Removing `mcp-apps` breaks an in-progress workflow that was using the namespaced form | Low | Bare-name canonical equivalents exist; spot-check Phase 3.2 |
| Removing `cloudflare` plugin removes a planned-but-unstarted Cloudflare evaluation | Low | Plan was never started; reinstall is one CLI command if needed |
| Vercel triage reveals the project uses more vercel:* skills than estimated | Medium | Phase 2 stops at "record and classify"; no removal until strategic plan |
| Plugin uninstall removes MCP server registration that another tool depends on | Low | Spot-check 3.2 enumerates MCP grants; rollback via `settings.json.pre-prune-*` backup |

---

## Foundation alignment

+ **PDR-009**: canonical-first three-layer model preserved (Layer 1
  unchanged; Layer 2 wrappers unchanged; Layer 3 entry-points unchanged).
+ **ADR-125**: thin-wrapper contract preserved; this plan operates on
  enabled-plugin set only.
+ **agentskills.io spec**: surface description format unchanged.
+ **No-moving-targets-in-permanent-docs**: counts are recorded in this
  plan body (ephemeral) and not in any permanent doc.

---

## Non-goals (YAGNI)

+ Building any new agent-tools CLI command (strategic plan).
+ Amending ADR-125 (strategic plan).
+ Removing canonical skills (strategic plan, after audit).
+ Refactoring the validator (strategic plan).
+ Touching `.cursor/`, `.gemini/`, `.codex/`, `.agents/` adapter files
  (no changes needed).

---

## Baselines

*Filled in during Phase 0. Counts here are deliberately ephemeral.*

| Metric | Pre-prune | Post-Phase-1 | Post-Phase-2 | Post-Phase-3 |
|---|---|---|---|---|
| `pnpm portability:check` | PASS | PASS | — | — |
| Approx. active-skill count (system reminder) | audit ~112; `/doctor` is session-local only | settings-derived expected ~100; optional owner confirmation | — | — |
| `mcp-apps:*` skills present | 4 | settings removed; optional owner confirmation | 0 | 0 |
| `cloudflare:*` skills present | 8 | settings removed; optional owner confirmation | 0 | 0 |
| `linear` plugin present | yes | no in settings | no | no |
| `vercel:*` skills present | 25 | 25 | 25 (no removal — see 2.2) | 25 |
| Vercel skills classified `parked` (Phase 2) | n/a | n/a | recorded in plan body | unchanged |

---

## Outcome

### 2026-05-06 Phase 1 implementation

+ **Agent**: Ashen Burning Anvil / codex / GPT-5 / `019dfd`.
+ **Claim**: `b78e00ac-6bdd-40ec-8a11-6ccd6f42bf5c`.
+ **Backup**:
  `/tmp/oak-claude-settings.pre-prune-20260506T121741Z.json`.
+ **Baseline**: `pnpm portability:check` passed before pruning with
  12 commands, 37 skills, 52 rules, 22 reviewer adapters, 54 Cursor
  triggers, 52 Claude rules, 52 `.agents` rules, and 40 command
  adapters. `/doctor` is session-local Claude Code evidence: it reports
  the skills loaded into the active Claude session, so terminal
  `claude doctor` invocation from Codex is not an authoritative evidence
  path. Use the audit's ~112 active-skill estimate as the pre-prune
  proxy unless the owner supplies an in-session Claude Code count.
+ **Change**: `.claude/settings.json` no longer enables
  `mcp-apps@mcp-apps`, `cloudflare@claude-plugins-official`, or
  `linear@claude-plugins-official`. Retained plugins are Sentry,
  remember, MCP server dev, SonarQube, and Vercel.
+ **Validation**: `jq '.enabledPlugins' .claude/settings.json`,
  `pnpm portability:check`, `pnpm subagents:check`, and
  `pnpm type-check` all passed. `pnpm type-check` reported
  36 successful Turbo tasks. Session handoff validation also passed:
  markdownlint on the touched plan/memory surfaces, `git diff --check`,
  `pnpm agent-tools:collaboration-state -- check`, and
  `pnpm practice:fitness:informational` (pre-existing HARD signals
  remain in `principles.md`, `distilled.md`, and
  `pending-graduations.md`; napkin stayed green).
+ **Optional owner-supplied evidence**: in-session Claude Code
  `/doctor`/system-reminder count, confirmation that bare canonical MCP
  Apps skills still surface, and confirmation that the removed plugin
  namespaces no longer appear in that session's reminder.
+ **Deliberately not done**: no `claude plugin uninstall`, no Vercel
  pruning, and no strategic `agent-tools artefacts` CLI work.

---

## Learning loop

After Phase 3.1 passes:

+ If unexpected behaviour appeared, append it to the napkin
  (`.agent/memory/active/napkin.md`) per the standard capture flow.
+ If a pattern emerged worth graduating, surface it in
  `.remember/now.md` for the next consolidation pass.

---

## Lifecycle triggers

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

+ **Pre-edit**: register active claim on `.claude/settings.json` via
  the collaboration-state helper.
+ **Post-edit**: light continuity update; refresh thread record (per
  the mid-session light update memory rule).
+ **Plan close**: update Outcome; do not archive — leave for owner
  review of the strategic plan kickoff.
