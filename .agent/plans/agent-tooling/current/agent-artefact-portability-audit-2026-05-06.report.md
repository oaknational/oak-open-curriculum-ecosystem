---
type: report
date: 2026-05-06
scope: agent-artefact portability — skills, rules, commands, hooks, plugins
companion_plans:
  - .agent/plans/agent-tooling/current/agent-artefact-load-pressure-relief.plan.md
  - .agent/plans/agent-tooling/current/agent-artefact-lifecycle-cli.plan.md
---

# Agent Artefact Portability Audit — 2026-05-06

**Status**: Findings frozen. Remediation tracked in companion plans.
**Authority**: Snapshot of the live state on 2026-05-06; the durable contract
lives in [PDR-009](../../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md)
and [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).
This report records what is and is not in conformance, why, and what to do
about it.

This report is a **durable analytical artefact**. It is not a plan and does not
mutate. The two companion plans capture the actions; this report captures the
reasoning behind them.

## 1. Mandate

The session began as an audit of skills and their origins. The audit broadened
to the full artefact estate — skills, rules, commands, hooks, and the plugins
that ship them — under the question: does the live state meet the defined
contract, and where it diverges, what are the issues?

The audit also surfaced an immediate operational issue: the active-skill
surface has grown large enough that Claude Code is silently truncating skill
discovery during long sessions. The audit therefore produced two companion
plans — one urgent, one strategic — alongside this report.

## 2. Contract source of truth

| Source | Role |
|---|---|
| [PDR-009](../../../practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md) | Strategic decision: canonical-first three-layer model (Layer 1 = `.agent/`, Layer 2 = thin platform adapters, Layer 3 = root-level entry-point files). Rules-as-policy and rules-as-trigger separated. |
| [ADR-125](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) | Project-specific implementation: per-artefact-type tables, per-platform format tables, thin-wrapper line-count contracts, externally-installed-skill canonicalisation rule. |
| [PDR-035](../../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md) | Practice-substance scope. |
| [`scripts/validate-portability.ts`](../../../../scripts/validate-portability.ts) | Suite of contract checks (forward-coverage, reverse-link, thin-wrapper line-count, classification frontmatter, trigger references, lock consistency, symlink rejection, hook parity, skill permission parity). Run via `pnpm portability:check`. Check count is itself a moving target; consult the script for the live set. |
| [agentskills.io specification](https://agentskills.io/specification) (retrieved 2026-05-06) | Open standard the repo conforms to. SKILL.md + YAML frontmatter (`name` lowercase + hyphens ≤64 chars; `description` ≤1024 chars describing **what** AND **when**); optional `scripts/`, `references/`, `assets/` sub-directories. Confirmed via [DeepWiki SKILL.md spec](https://deepwiki.com/agentskills/agentskills/2.2-skill.md-specification). |

## 3. Findings — what conforms

The structural layer is sound.

- **No symlinks** anywhere in the tracked tree (excluding `node_modules`,
  `.git`, build outputs). The validator's symlink-rejection check has held.
- **`pnpm portability:check` passes**. Counts on 2026-05-06: 12 canonical
  commands, 37 canonical skills, 52 canonical rules, 22 reviewer adapters,
  54 Cursor triggers, 52 Claude rules, 52 `.agents` rules, 40 command
  adapters across 4 platforms. (These counts are recorded here for
  diagnostic purposes; they belong in plans, not in permanent docs — see
  §5.)
- **Forward and reverse parity** — every canonical artefact has its
  expected adapters, and every adapter points back to an existing
  canonical artefact.
- **Thin-wrapper form** is enforced (≤15 content lines for skill
  adapters, ≤10 for rule triggers).
- **`skills-lock.json`** is consistent with on-disk state and tracks
  vendor sources (`source`, `sourceType`, `computedHash`) for the 12
  externally installed skills (8 Clerk, 4 mcp-apps).
- **Reviewer adapter parity** — all 22 reviewer sub-agents have parity
  across Cursor, Claude, and Codex.
- **Per-platform-only skills** — none. Every adapter has a canonical
  counterpart, consistent with the rule that platform-only is rare and
  requires an explanatory note.
- **Activation-trigger separation** — rules-as-policy live canonically
  in `.agent/rules/`; rules-as-trigger are thin adapters in
  `.cursor/rules/*.mdc`, `.claude/rules/*.md`, `.agents/rules/*.md`,
  per PDR-009 §"Activation triggers are a distinct artefact type".

## 4. Findings — what diverges

The drift sits in the management layer, not the structural layer.

### 4.1 Documentation count drift (P1)

ADR-125's per-artefact-type tables embed numeric counts that have drifted
since the 2026-04-28 amendment.

| Surface | ADR-125 documented | Live 2026-05-06 | Drift |
|---|---|---|---|
| Skills (total) | 36 | 37 | +1 |
| Rules (canonical) | 35 | 52 | **+17** |
| Cursor triggers | 37 | 54 | **+17** |
| Claude rules | 35 | 52 | **+17** |
| `.agents/rules` wrappers | 35 | 52 | **+17** |
| Sub-agent templates | 19 | — | — |

This violates the `no-moving-targets-in-permanent-docs` feedback rule
(per-user memory; not a tracked repo file — referenced here by name
only, per the no-machine-local-paths repo rule). The structural rules in ADR-125 are unchanged; only the
inventory tables drift. The inventory belongs in an ephemeral, regenerable
surface (e.g. `.agent/memory/executive/artefact-inventory.md` or CLI output),
not embedded in the durable ADR.

Owner clarification this session: **moving targets can live in plans**
(plans are ephemeral); they must not live in permanent docs (ADRs,
runbooks, durable references).

### 4.2 `npx skills` wrapper does not exist (P2)

The project carries 12 vendor-installed skills (8 Clerk, 4 mcp-apps),
canonicalised + locked via `skills-lock.json`. The installation flow is
currently **manual**: `npx skills add` (or equivalent external
installer) → manual canonicalisation → manual thin-wrapper writes →
manual lock entry → `pnpm portability:check`.

`npx skills` (vercel-labs/skills) is the cross-platform standard and
ships add / list / find / update / remove / init end-to-end. It writes
content into the platform adapter directory matching the calling
agent's convention. Our internal structure differs (canonical at
`.agent/`; thin wrappers in every adapter dir), so the missing piece is
a thin **wrapper + canonicalisation post-step** that converts the
post-`npx-skills-add` state into our layout. The strategic plan
[`canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md)
in `future/` explicitly notes: *"That mitigation was flagged as future
work at the close of remediation Phase 6 (mitigation option 1, 'script
the canonicalisation as an agent-tool') and never built."*

The validator catches drift after the fact, but cannot prevent step
omissions during install. Until the CLI is built, every new vendor skill
install carries documented drift risk (step omission, vendored canonical
hand-edit, update-conflict invisibility).

### 4.3 Plugin redundancy and plugin disuse (P3)

Cross-referencing `~/.claude/plugins/installed_plugins.json`,
`.claude/settings.json` enabled-plugin list, and tool-grant evidence in
`.claude/settings.local.json`:

| Plugin | Verdict | Evidence |
|---|---|---|
| `vercel@claude-plugins-official` | KEEP | 25 vercel:* skills loaded; deploy/env tooling on Vercel-hosted MCP server |
| `sentry@claude-plugins-official` | KEEP | `mcp__plugin_sentry_sentry__*` grants in local settings; observability roadmap active |
| `sonarqube@claude-plugins-official` | KEEP | `mcp__sonarqube__*` grants and active issue queries |
| `remember@claude-plugins-official` | KEEP | Populated `.remember/` directory; SessionStart hook integration |
| `mcp-server-dev@claude-plugins-official` | KEEP | This repo authors HTTP MCP server + Search CLI MCP |
| `github@claude-plugins-official` (user-scope) | KEEP | `mcp__plugin_github_github__*` grants in local settings |
| `mcp-apps@mcp-apps` | **REMOVE** | Skills already canonicalised + locked; plugin maintains a parallel duplicate-namespaced surface (`mcp-apps:add-app-to-server` etc.) |
| `cloudflare@claude-plugins-official` | **REMOVE** | No `cloudflare`/`workers`/`wrangler` references in `.agent/`, no MCP grants, no Workers/Pages workspaces in monorepo |
| `linear@claude-plugins-official` | **REMOVE** | No Linear references in `.agent/`, no MCP grants in either settings file |
| `typescript-lsp@claude-plugins-official` (user-scope) | KEEP | User choice; not project's concern |
| `playwright@claude-plugins-official` | N/A | `projectPath` is `/Users/jim/code/oak/oak-mcp-ecosystem` — different project |

### 4.4 Skill-load pressure — Claude is dropping skills (P0)

The user-reported, measured symptom: Claude Code is silently truncating
skill discovery in long sessions. The Claude Code `/doctor` command is
the authoritative measurement source for the discovery surface and
confirms the count is over the workable ceiling. This is a measured
fact, not a hypothesis.

Root cause: total active-skill count exceeds the discovery surface's
effective context budget.

Live count of active skills surfaced to the session (estimated by inspection
of the system reminder list):

| Source | Count |
|---|---|
| Project canonical (`.agent/skills/`) | 37 |
| Project Codex command adapters (`.agents/skills/jc-*`) | 10 |
| Plugin: vercel | 25 |
| Plugin: sentry (curated subset) | 4 |
| Plugin: sonarqube | 9 |
| Plugin: cloudflare | 8 |
| Plugin: mcp-apps | 4 |
| Plugin: mcp-server-dev | 3 |
| Plugin: remember | 1 |
| Built-in (Claude Code binary) | 11 |
| **Approximate active total** | **~112** |

Per agentskills.io, frontmatter-only discovery is ~100 tokens per skill;
multiplied by ~112 skills, the discovery surface alone is ~11,000 tokens
*before* any session work. When the session reminder block approaches
context-window pressure, late-listed skills can be truncated.

Immediate relief levers, ordered by reversibility-safety × magnitude:

1. Remove `mcp-apps@mcp-apps` plugin: −4 skills, +zero functional loss
   (canonical copies present).
2. Remove `cloudflare@claude-plugins-official`: −8 skills, +zero
   functional loss (unused).
3. Remove `linear@claude-plugins-official`: 0 skills (commands/MCP
   only) but reduces plugin metadata noise.
4. Triage Vercel skill set (25 → ~10 likely): −15 skills, requires
   per-skill use audit.
5. Consolidate canonical skill descriptions to ≤300 chars where
   currently bloated: marginal token saving.

The urgent companion plan executes 1–4. The strategic plan formalises
on-going inventory pressure as a measurable budget.

### 4.5 Skill description spec drift (P4)

The agentskills.io spec requires `description` to describe **what** AND
**when**. Sample non-conformance from the canonical surface:

- `jc-go`: "Re-ground and structure execution with ACTION/REVIEW/GROUNDING cadence." (no "Use when…")
- `parallel-agents` Cursor wrapper: "Guidance on dispatching parallel sub-agents safely for independent tasks." (no "Use when…")
- `complex-merge` Cursor wrapper: "Structured workflow for merging significantly diverged branches. 7-phase process with gap analysis and reviewer validation." (no "Use when…")

The validator does not currently enforce this. A description-form check
is folded into the strategic plan.

### 4.6 `mcp-apps` four-skill duplication (P3, addressed in §4.3)

Four skill names exist in both `.agent/skills/` (canonical, vendor-installed
via `skills-lock.json`) and the `mcp-apps@mcp-apps` plugin: `add-app-to-server`,
`convert-web-app`, `create-mcp-app`, `migrate-oai-app`. ADR-125 §"Externally
installed skills" amendment (2026-04-24) permits canonicalisation but does
not state policy on whether the source plugin should remain installed
afterwards. The urgent plan removes the plugin; the strategic plan codifies
the policy as a CLI invariant.

## 5. Root-cause analysis — why drift happened

The contract is well-designed. Three structural drift mechanisms are
visible in the data:

1. **Inventory tables in permanent docs decay.** Counts change with
   every artefact addition; the docs do not. The remedy is structural:
   inventory must be **emitted** (CLI), not **embedded** (ADR table).
2. **Manual canonicalisation interfaces are drift surfaces.** Every
   manual step (canonicalise vendor content, write thin wrappers, update
   `skills-lock.json`) is a place where a human can omit a step. The
   validator catches the result post-hoc but cannot prevent the cause.
   The remedy: replace manual flows with a single CLI lifecycle.
3. **Plugin enable/disable lives outside the contract.** `.claude/settings.json`
   `enabledPlugins` controls what loads, but no validator checks whether
   each enabled plugin is actively used or whether its skills duplicate
   canonical content. The remedy: a plugin-utilisation check inside the
   same CLI lifecycle.

A common shape across all three: the contract is enforced *post-hoc* by a
validator, but the **authoring** and **configuration** interfaces are
ungoverned. Authoring is the drift origin; verification is the drift
detector. The remediation moves authoring inside the same enforcement
surface as verification.

## 6. Patterns identified (graduation candidates)

Three patterns surfaced this session worth preserving:

1. **Inventory-as-output, not as-document.** Count tables embedded in
   permanent docs always drift. The right shape is: emit counts from a
   verifier; embed counts only in ephemeral surfaces (plans, generated
   inventory pages). This is consistent with the existing
   no-moving-targets-in-permanent-docs feedback rule but adds the
   nuance that *plans* are an acceptable home for moving counts.
2. **Vendor plugin redundancy after canonicalisation.** When external
   skill content is canonicalised + locked, the source plugin becomes a
   duplicate-surface risk. Need an explicit per-vendor decision: keep
   the plugin (and accept a duplicate namespace) or remove it (and own
   the upstream-update cadence via the lock).
3. **Skill-load budget is real.** Active-skill count has an effective
   context budget; exceeding it causes silent discovery drops. The
   architecture should treat total skill count as a measurable ceiling,
   not as an unbounded list. The strategic plan installs this as a
   first-class CLI invariant.

These three patterns are good candidates for graduation in a future
`/jc-consolidate-docs` pass — either as PDR amendments to PDR-009 or as
new memory entries.

## 7. Reflection (metacognition)

The audit started narrow ("origins of skills") and broadened naturally:
once the origins map was visible, the management layer's drift was the
question that kept extending. The contract is sound; the management is
not. The pattern is the same across skills, plugins, ADR counts, and
description form: **the design surface is governed; the operational
surface is not.**

The bridge from action to impact:

- **Action (urgent plan):** disable three plugins, triage one. Direct
  result: skill-load count drops below the discovery budget; Claude
  stops dropping skills.
- **Action (strategic plan):** consolidate the operational surface into
  a single agent-tools CLI section. Direct result: every authoring,
  removal, update, inventory, and verification action goes through one
  place; drift becomes detectable and provably-absent in CI.
- **Compounding impact:** future portability work — graduating a new
  platform, accepting a new vendor pack, retiring a deprecated skill —
  inherits the rigour. The contract becomes self-documenting; ADR-125
  loses its count tables and gains a permanent shape.

The shift in how I see what we did: this session is *not* about fixing
skills. It is about closing the design-vs-operational asymmetry that
allowed drift to accumulate while still passing validation. The
validator was a guardrail; the CLI is the road.

## 8. Linked artefacts

- **Urgent companion plan:** [`agent-artefact-load-pressure-relief.plan.md`](agent-artefact-load-pressure-relief.plan.md)
  — disable redundant/unused plugins; triage Vercel; verify skill-load
  count drops.
- **Strategic remediation plan:** [`agent-artefact-lifecycle-cli.plan.md`](agent-artefact-lifecycle-cli.plan.md)
  — consolidate skills/rules/commands/hooks management into a single
  `agent-tools artefacts` CLI section. Supersedes the existing future
  plan `canonical-first-skill-pack-ingestion-tooling.plan.md`.
- **Predecessor plan:** [`canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md)
  — narrower scope; folded into the strategic plan above.
- **Predecessor remediation:** [`agent-infrastructure-portability-remediation.plan.md`](agent-infrastructure-portability-remediation.plan.md)
  — completed 2026-04-24; established the validator and the
  thin-wrapper contract.

The contract sources (PDR-009, ADR-125, validator script) are
authoritative. This report describes the gap between the contract and
the live state on 2026-05-06; the plans describe the closure.
