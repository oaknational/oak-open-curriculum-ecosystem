---
name: "Agent Naming Schema v3 — era-pinning cure + noun-agentive names"
overview: "Pin the naming-schema era (not the rendered name) in session hooks so identity is single-valued and provenance is true — the safety prerequisite for v3 activation, sequenced first and shippable ahead of the wordlist work; then curate the v3 noun-agentive wordlists under the v2 curation gates; then register v3 as a digest-pinned era and activate it under owner taste review."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1 (era-pinning, CLI core): teach the agent-identity CLI to derive through a pinned OAK_AGENT_NAMING_SCHEMA_ID (era), falling back to the active schema; explicit OAK_AGENT_IDENTITY_OVERRIDE still wins and still yields an override result. One commit. Tree green at end."
    status: pending
  - id: ws1-cycle-2
    content: "WS1 cycle 2 (era-pinning, collaboration-state identity): collaboration-state identity derivation reads the pinned era and stamps the true naming_schema_version; override path unchanged. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws1-cycle-3
    content: "WS1 cycle 3 (era-pinning, producers): Claude + Cursor SessionStart hooks write OAK_AGENT_NAMING_SCHEMA_ID=<active era> instead of OAK_AGENT_IDENTITY_OVERRIDE=<rendered name>. statusline-identity.ts is NOT edited — it spawns the CLI and is cured transitively. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-2]
  - id: ws1-cycle-4
    content: "WS1 cycle 4 (era-pinning, docs + live proof): agent-identity.md + CLI help + cli-spec-help reflect era-pinning; OAK_AGENT_IDENTITY_OVERRIDE documented as operator-only; live proof that one seed yields one name and a true (non-override) era. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-3]
  - id: ws2-cycle-1
    content: "WS2 cycle 1 (v3 curation gates): data-driven curation gate tests for the v3 noun-agentive shape (reuse the v2 gate predicates; add agentive-pool gates). One commit. Tree green at end."
    status: pending
  - id: ws2-agentive-pool
    content: "WS2 cycle 2 (agentive wordlist): curated ~120-agentive pool passing the WS2 gates; the 540-noun first-word union reused from the v2 subject+object lists. One commit. Tree green at end."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws2-owner-review
    content: "WS2 checkpoint: owner taste review of the v3 agentive wordlist BEFORE registration (BLOCKING for ws3-cycle-1). The design target is live-window distinguishability: the review evaluates a sample of 5–10 concurrently-derived FULL names (can the owner tell a real multi-agent team apart at a glance and remember them across a session), not only per-word taste. Mirrors the v2 WS4 review gate."
    status: pending
    depends_on: [ws2-agentive-pool]
  - id: ws3-cycle-1
    content: "WS3 cycle 1 (v3 registry entry): add v3 id to the NamingSchemaId union + NAMING_SCHEMA_VERSION_VALUES, register the v3 schema (2 title-cased columns, flat group), pin its digest, add era-snapshot test. ACTIVE_NAMING_SCHEMA_ID unchanged. One commit. Tree green at end."
    status: pending
    depends_on: [ws2-owner-review, ws1-cycle-4]
  - id: ws3-cycle-2
    content: "WS3 cycle 2 (activation): flip ACTIVE_NAMING_SCHEMA_ID to v3; surface verification (CLI, statusline, hooks emit a v3 name and a true v3 era for a fresh seed); live proof. Owner-gated. One commit. Tree green at end."
    status: pending
    depends_on: [ws3-cycle-1]
  - id: ws4-docs-adr
    content: "WS4: ADR-198 amendment (v3 era registered + era-pinning provenance cure) or successor ADR; agent-identity.md example-name refresh; PDR-027 example refresh if it cites a v2 name."
    status: pending
    depends_on: [ws3-cycle-2]
  - id: ws5-quality-gates
    content: "WS5: full quality-gate chain on the integrated delivery (green repeatedly)."
    status: pending
    depends_on: [ws4-docs-adr]
  - id: ws6-adversarial-review
    content: "WS6: adversarial specialist reviews (code, test, type, docs-adr, config for hook/env surface). Verdicts adjudicated; amendments landed."
    status: pending
    depends_on: [ws5-quality-gates]
isProject: false
---

# Agent Naming Schema v3 — Era-Pinning Cure + Noun-Agentive Names

**Last Updated**: 2026-06-29
**Status**: 🟡 DECISION-COMPLETE — QUEUED (`current/`; not started). Owner
decisions are landed (shape, sequence, accepted P1 diagnosis); execution
has not begun.
**Scope**: (1) Cure the single-valued-identity P1 by pinning the naming-schema
*era* in session hooks instead of the rendered *name*; (2) curate the v3
noun-agentive wordlists under the v2 curation gates; (3) register v3 as a
digest-pinned era in `agent-tools/src/core/agent-identity/` and activate it
under owner taste review.
**Thread**: [`agent-naming`](../../../memory/operational/threads/agent-naming.next-session.md)
**Source decision**: [`naming-v3-shape-sample-sheets-2026-06-12.md`](../../../reports/agentic-engineering/naming-v3-shape-sample-sheets-2026-06-12.md)
(shape **C — noun + agentive**, owner-chosen 2026-06-12)
**Predecessor**: [`agent-naming-schema-v2.plan.md`](../archive/completed/agent-naming-schema-v2.plan.md)
(merged PR #189 `289b3e036`; registry + v1/v2 eras + `naming_schema_version`)

---

## End Goal

A follow-on agent reads one plan and executes the whole remaining naming
throughline. Concretely, two user-facing outcomes:

1. **Single-valued identity.** One harness seed renders exactly one display
   name for the life of a session, and the recorded `naming_schema_version`
   states the *true* era that produced it — never `override` on the happy
   path. This cures the observed one-seed-two-names split (e.g. the same seed
   surfacing as both "Swift Gliding Zephyr" v1 and "Harrier weaves
   Stratosphere" v2) and restores `override` to meaning only operator-assigned
   names. This is the **safety prerequisite for v3 activation**: within one
   active era every consumer already re-derives the same name, so the
   name-split only manifests *at* an era-activation event — and the next such
   event is v3's. Its split-prevention payoff is therefore consumed by
   activation, not by an independently-urgent live regression. The
   provenance-correctness gain (true era recorded, never `override` on the
   happy path) is real and lands immediately; the fix is mechanically
   shippable ahead of the v3 wordlist work and does not depend on v3 ever
   being built.
2. **The v3 noun-agentive naming era**, live: fresh sessions derive names like
   "Squall Tracker" / "Crescent Weaver" / "Wind Smith" — a curated two-word
   shape with materially better per-window distinctiveness (8.3% ten-agent
   first-name clash vs v2's 15%, per the source decision's namespace analysis).

## Mechanism

- **Why era-pinning cures the split (Phase 1).** The display name is a
  deterministic projection: `deriveIdentity(seed, { schemaId })` routes
  `SHA-256(seed)` through a registered era's wordlists
  (`agent-tools/src/core/agent-identity/derive.ts`). The defect is that the
  Claude and Cursor `SessionStart` hooks cache the *rendered name* in
  `OAK_AGENT_IDENTITY_OVERRIDE` (Claude `session-identity-hook.ts:90`; Cursor
  `oak-session-identity-hook.ts:77`), and every downstream consumer that reads
  that var treats the session as an *operator override*. In collaboration-state
  the normal path `deriveCollaborationIdentity` (`identity.ts:61`) calls
  `deriveIdentity(seed, { override: env.OAK_AGENT_IDENTITY_OVERRIDE })`; because
  the hook set that var to the rendered name, `deriveIdentity` returns an
  `OverrideIdentityResult` whose `namingSchemaVersion` is `'override'`, and the
  tuple records it. (The unconditional `naming_schema_version: 'override'` at
  `identity.ts:103` is the *separate* admin/test path
  `deriveOverrideCollaborationIdentity` — legitimately an override and **not
  touched by this plan**.) Any *fresh* re-derivation under a different active
  era produces a different name. Pinning the **era**
  (`OAK_AGENT_NAMING_SCHEMA_ID=<active-at-session-start>`) instead means every
  consumer re-derives the same name from the stable seed through the same
  pinned era: the name is stable for the session's life *and* the provenance is
  true. The seed + era are sufficient to reproduce the name, so nothing needs
  to cache the rendered string.
- **Why v3 is a small, safe addition (Phases 2–3).** ADR-198's digest-pinned
  registry already makes a new era one closed-union member plus one frozen,
  digest-pinned schema object. The v2 curation gates are data-driven tests that
  apply to any shape; v3 reuses them and adds agentive-pool gates. The first
  word reuses the existing 540-noun union (300 subject + 240 object, zero
  overlap — verified in the source decision); only the ~120-agentive column is
  new material requiring owner taste review.

## Means (Phases)

| Phase | Workstream | Outcome | Independence |
|---|---|---|---|
| **1** | WS1 — Era-pinning cure | Single-valued identity + true provenance | **The safety prerequisite for Phase 3 activation** (a v3 flip under the old name-caching hooks would re-split every live session, exactly as v2's activation did). Mechanically shippable ahead of the wordlist work; its split-prevention payoff lands at activation, its provenance-correctness gain lands immediately. |
| **2** | WS2 — v3 wordlist curation | Curated ~120 agentives passing the gates; owner-approved | Independent of Phase 1 mechanically; sequenced after per the source decision. |
| **3** | WS3 — v3 registry entry + activation | v3 registered, digest-pinned, and active | Consumes Phase 1 (true provenance at activation) and Phase 2 (approved wordlists). |

Phases are sequenced by consumption (PDR-093): Phase 3's activation
verification (a fresh seed must yield a v3 name *with a true `v3` era*, not
`override`) breaks if Phase 1 drifted; Phase 3's digest gate breaks if Phase 2
drifted.

---

## Prerequisite Classification

- **Phase 1 (era-pinning cure)** — `blocking` for Phase 3 activation. No
  minimum-shippable-without: activating v3 under the name-caching hooks is the
  exact failure this plan exists to prevent. Phase 1 itself has **no**
  prerequisites and is shippable alone.
- **Owner taste review of the v3 agentive wordlist (WS2 checkpoint)** —
  `blocking` for WS3 registration. Mirrors the v2 WS4 gate; the registry's
  digest pin freezes material at activation, so review must precede it.
- **Phase 2 (curation)** — `beneficial` relative to Phase 1; the two are
  independent and may be worked in either order. Minimum shippable shape if
  Phase 2 slips: Phase 1 lands alone as the P1 fix and v3 remains a registered
  but inactive era authored later.

---

## Non-Goals (YAGNI)

- **No change to the UUID v5 id or its namespace constant** — the continuity
  anchor (PDR-076a) is deliberately untouched; only the display-name projection
  and its provenance change (ADR-198 §Decision #5).
- **No backfill of historical `naming_schema_version` values** — absent reads
  as v1; recorded `override` rows from pre-cure sessions stay as written
  (immutable events; ADR-198 §Decision #4).
- **No retirement of `OAK_AGENT_IDENTITY_OVERRIDE`** — it remains the
  operator-assigned-name channel; the cure narrows it back to that meaning, it
  does not remove it.
- **No theming of the v3 first word** — the source decision's allocation maths
  favours a flat 540-noun first column for first-word distinctiveness; v3 is a
  single flat group, not six themed groups (see WS3 cycle 1).
- **No v4 shapes, adverb/verb columns, or namespace re-tuning** — the other
  sample sheets (A/B/D) are decided against; this plan ships C only.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: executable repo plan (this document). Execution sessions open with
`oak-start-right-quick`, register an active claim on
`agent-tools/src/core/agent-identity/`, `agent-tools/src/collaboration-state/`,
and `agent-tools/src/{claude,cursor,codex}/` + `agent-tools/src/bin/`, use the
`oak-commit` skill per cycle, close with `oak-session-handoff`, and run
consolidation at plan completion. The `agent-naming` thread record is the
continuity home between sessions.

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):
before executing any cycle, the executor re-derives the shape from the live
code, not this plan's sketches. The check fires specifically:

- **Shape clause** — at the start of WS1 (re-read `derive.ts`,
  `agent-identity-cli.ts`, `collaboration-state/identity.ts`, the two hook
  planners, `statusline-identity.ts`) and WS3 (re-read `schema-registry.ts`).
- **Landing-path clause** — line/symbol references in this plan
  (`session-identity-hook.ts:90`, `identity.ts:61-62`, etc.) are
  derivation-anchored to HEAD at authoring (2026-06-13); re-confirm them before
  editing, as upstream churn may move them.
- **Vendor-literal clause** — the Claude `SessionStart` env-file contract
  (`CLAUDE_ENV_FILE` append) and Cursor `sessionStart` `env` map are vendor
  surfaces; re-verify against current platform docs before changing what the
  hooks write (the hooks are soft — exit 0 with empty output on any
  uncertainty).

---

## WS1 — Era-Pinning Cure (Phase 1, the P1 fix)

**Defect, traced first-hand (2026-06-13):** the rendered name is cached in
`OAK_AGENT_IDENTITY_OVERRIDE` by the hooks, then consumed as an operator
override by the CLI (`agent-identity-cli.ts:103`) and by the normal
collaboration-state path `deriveCollaborationIdentity` (`identity.ts:61`):
`deriveIdentity` returns an override result, so the tuple records
`naming_schema_version: 'override'`. Two harms: (a) provenance is wrong on the
happy path; (b) a fresh derivation under a later active era splits the name.
(The unconditional `'override'` stamp at `identity.ts:103` is the separate
admin path `deriveOverrideCollaborationIdentity` — correct as-is, not in scope.)

**Cure:** pin the era, derive the name. Precedence at every consumer:
explicit operator `OAK_AGENT_IDENTITY_OVERRIDE` (→ override result) **>**
`OAK_AGENT_NAMING_SCHEMA_ID` pinned era (→ derived result, true era) **>**
`ACTIVE_NAMING_SCHEMA_ID` default (→ derived result, active era). An
unrecognised pinned-era id fails soft: ignore it and derive under the active
schema (hooks are soft by contract).

### Cycle 1.1: CLI core derives through a pinned era

**Parallel-safety**: first cycle; owns the CLI env surface.

**File scope**: `agent-tools/src/bin/agent-identity-cli.ts`,
`agent-tools/src/bin/agent-identity-cli-environment.ts`,
`agent-tools/tests/agent-identity/cli.unit.test.ts`.

**Test (Red):**

- With `OAK_AGENT_NAMING_SCHEMA_ID` set to a registered era and no override,
  the CLI returns a **derived** result whose `namingSchemaVersion` equals the
  pinned era (not `override`), for `--format json`.
- With both the pinned era and an explicit override set, the override wins
  (override result, `namingSchemaVersion: 'override'`).
- With an unregistered `OAK_AGENT_NAMING_SCHEMA_ID`, the CLI derives under the
  active schema (fail-soft) — no throw, exit 0.
- With neither set, behaviour is byte-identical to today (active-schema
  derivation).

**Green**: add `OAK_AGENT_NAMING_SCHEMA_ID` to `AgentIdentityCliEnvironment`
and `agentIdentityCliEnvironmentFromProcessEnv`; in `runAgentIdentityCli`,
resolve the pinned era (validate against the `NamingSchemaId` union via a
registry helper) and pass `{ schemaId }` to `deriveIdentity` when no override
is present.

**Acceptance**: AC-1, AC-2. **Validation**:
`pnpm --filter @oaknational/agent-tools test -- cli.unit`.

### Cycle 1.2: Collaboration-state identity stamps the true era

**File scope**: `agent-tools/src/collaboration-state/identity.ts`,
`agent-tools/src/collaboration-state/types.ts`,
`agent-tools/src/collaboration-state/cli-spec-help.ts`,
`agent-tools/tests/collaboration-state/identity.unit.test.ts`.

**Test (Red):**

- A seed resolved with `OAK_AGENT_NAMING_SCHEMA_ID` pinned produces an identity
  tuple whose `naming_schema_version` is the pinned era, not `override`.
- The explicit `OAK_AGENT_IDENTITY_OVERRIDE` path still yields
  `naming_schema_version: 'override'` (operator path unchanged).

**Green**: add `OAK_AGENT_NAMING_SCHEMA_ID` to the
`CollaborationStateEnvironment` interface in `types.ts` (alongside the existing
`OAK_AGENT_IDENTITY_OVERRIDE`); thread it into the `deriveIdentity` call inside
`deriveCollaborationIdentity` at `identity.ts:61` as `{ schemaId }` when no
operator override is present; update `cli-spec-help.ts` to document it. Do
**not** touch `deriveOverrideCollaborationIdentity` (the admin path at
`identity.ts:103` — it stamps `'override'` by design). No write-schema change —
`naming_schema_version` already accepts every registered era
(`NAMING_SCHEMA_VERSION_VALUES`).

**Acceptance**: AC-3. **Validation**:
`pnpm --filter @oaknational/agent-tools test -- collaboration-state/identity`.

### Cycle 1.3: Hooks pin the era (producers only)

**File scope**: `agent-tools/src/claude/session-identity-hook.ts`,
`agent-tools/src/cursor/oak-session-identity-hook.ts`, and their unit tests.
**Not in scope**: `statusline-identity.ts` requires **no code change** — it
spawns the built `agent-identity.js` CLI with `--seed --format display`
(`statusline-identity.ts:94-98`), so once Cycle 1.1 teaches the CLI to honour
`OAK_AGENT_NAMING_SCHEMA_ID` and this cycle writes that var into the session
env, the statusline subprocess inherits it and derives through the pinned era
automatically. The statusline is a *consumer proof*, not an edit site.

**Test (Red):**

- The Claude hook plan's `envFileWrite.appendLine` exports
  `OAK_AGENT_NAMING_SCHEMA_ID=<ACTIVE_NAMING_SCHEMA_ID>` and **does not** export
  `OAK_AGENT_IDENTITY_OVERRIDE`. `PRACTICE_AGENT_SESSION_ID_CLAUDE` is still
  exported.
- The Cursor hook output `env` map carries `OAK_AGENT_NAMING_SCHEMA_ID` and
  drops `OAK_AGENT_IDENTITY_OVERRIDE`; the mirror/`additional_context` still
  carry the human-visible display name (derived, unchanged).

**Green**: change the two hook planners. The `additionalContext` /
`additional_context` strings keep showing the derived display name (identical to
before; only the env-cache mechanism changes).

**Statusline propagation proof** (no `statusline-identity.ts` edit): assert that
a CLI invocation with `OAK_AGENT_NAMING_SCHEMA_ID` set in its environment
returns the pinned-era name — this is an integration assertion against the CLI
boundary the statusline spawns, not a unit test of `statusline-identity.ts`. The
open execution decision (resolve at cycle start, do not stall): whether to add a
focused integration test exercising the spawn-env path or to rely on the CLI
unit coverage from 1.1 plus the live proof in 1.4. Either is acceptable;
`statusline-identity.ts` is not modified in this plan.

**Acceptance**: AC-4. **Validation**:
`pnpm --filter @oaknational/agent-tools test -- session-identity-hook`,
then `pnpm --filter @oaknational/agent-tools build` (hook bins consume `dist/`).

### Cycle 1.4: Docs + live single-valued proof

**File scope**: `agent-tools/docs/agent-identity.md`, CLI `HELP_TEXT`
(`agent-identity-cli.ts`), `cli-spec-help.ts`.

**Test (Red / observation):** a live end-to-end proof recorded in the cycle:
with a pinned era exported, `pnpm agent-tools:agent-identity --format json`
returns a derived result with a true era; a fresh derivation of the same seed
yields the identical name; no path yields `override` absent an explicit
operator override.

**Green**: document era-pinning in `agent-identity.md`; the CLI help and
spec-help describe `OAK_AGENT_NAMING_SCHEMA_ID` (era pin) and narrow
`OAK_AGENT_IDENTITY_OVERRIDE` to "operator-assigned name only".

**Acceptance**: AC-5, AC-9. **Validation**: the recorded CLI transcript +
`pnpm --filter @oaknational/agent-tools test`.

> **Phase 1 landing note.** WS1 cycles 1.1–1.4 are complete and shippable
> ahead of any Phase 2/3 work — they may merge before the v3 wordlists exist,
> and must not be gated on v3 wordlist curation. Their purpose is to make v3
> activation safe, so sequence them first: activation (WS3 cycle 3.2) is
> hard-gated on this cure being live.

---

## WS2 — v3 Wordlist Curation (Phase 2)

**Shape (decided):** C — **Noun + Agentive**, two title-cased columns. First
word from the existing 540-noun union (the v2 subject + object lists, reused
verbatim — zero new first-word material). Second word a curated **~120
agentive** pool (agent-of-the-verb nouns: Tracker, Weaver, Smith, Keeper,
Rider, Mender, …). Single **flat group** (no themes) — the allocation maths in
the source decision favours a flat ~450+ first-column cardinality for
ten-agent-window distinctiveness.

### Cycle 2.1: v3 curation gate tests

**File scope**: `agent-tools/src/core/agent-identity/schemas/v3/` (new),
`agent-tools/tests/agent-identity/v3-curation.unit.test.ts` (new).

**Test (Red):** the v2 gate predicates applied to the v3 material — per-column
uniqueness, length variety, initial-bigram diversity floor, 4-char minimum —
plus agentive-specific gates: agentives are distinct from every first-word
noun (no noun appearing as its own agentive), and the agentive pool meets the
target cardinality floor (≈120). Reuse the v2 gate helpers; do not re-implement.

**Assumption verified 2026-06-29 (gate retained for defence-in-depth):** the
"540-noun union" rests on the v2 subject (300) and object (240) lists being
**disjoint** (subject ∩ object = ∅). This was confirmed first-hand against the
live theme files (`schemas/v2/{aerial,botanical,celestial,ember,maritime,nocturnal}.ts`):
subject 300 unique, object 240 unique, **union exactly 540, intersection empty,
no cross-theme duplicates**. So the 64,800 namespace figure holds as authored.
The v2 gates enforce only *within-theme* subject/object stem-disjointness, NOT
full cross-set disjointness across all six themes — so the explicit gate below
still belongs: keep a test asserting the subject-set and object-set union has
cardinality 540 (no element in both), because the material can change and the
gate is what keeps the namespace figure honest. If a future edit introduces
overlap, the test fails and the distinctiveness maths is re-surfaced to the
owner rather than silently de-duplicated.

**Acceptance**: AC-6. **Validation**:
`pnpm --filter @oaknational/agent-tools test -- v3-curation`.

### Cycle 2.2: The curated agentive pool

**File scope**: `agent-tools/src/core/agent-identity/schemas/v3/agentives.ts`
(new); the first-word union is referenced from the v2 lists, not copied.

**Green**: author ~120 agentives passing 2.1's gates. The 20 demo agentives in
the source decision (Wright, Hunter, Seeker, Mason, Keeper, Singer, Turner,
Tracker, Rider, Fisher, Spinner, Smith, Piper, Caller, Walker, Mender, Herder,
Carver, Weaver, Shepherd) are a seed list, not the final pool.

**Acceptance**: AC-6. **Validation**: as 2.1.

### Checkpoint: owner taste review (BLOCKING for WS3 cycle 1)

The owner reviews the full v3 agentive list before registration, exactly as the
v2 WS4 checkpoint gated v2 activation. The digest pin freezes the material at
registration, so review must land first. Surface the list via
`AskUserQuestion` with the curated pool attached; the gates prove correctness,
the owner owns taste.

**The review's primary target is live-window distinguishability, not per-word
taste.** The design goal of shape C is that a human supervising a real
multi-agent team can tell 5–10 simultaneously-active agents apart at a glance
and remember them across a session — that is the impact the namespace-clash
figure (8.3% ten-agent first-name clash) is a *proxy* for, and the two can
diverge: a low clash rate does not guarantee that eight flat two-word names
read as distinct to a human eye. So the review must present a **sample of
5–10 concurrently-derived full names** (deterministic, from fixed sample
seeds), not just the agentive column in isolation. The wordlist passing the
cardinality and diversity gates is necessary but not sufficient; the owner
judges whether the *rendered team* is distinguishable and memorable.

This distinguishability target is the **human-UX face of the system**. The
agent name exists *for the human supervising the team*: its machine-side
identity is the UUID v5 and the `session_id` (both untouched here), so the
rendered name's entire job is human apprehension — **owner legibility of a live
agent team**, being able to see, tell apart, trust, and direct a fluid set of
agents at a glance. The
[**statusline**](session-and-team-state-statusline-icons.plan.md) is where that
name is actually consumed, and its **entire function is human UX** too —
alongside the session title. So the name and the statusline are the *same kind
of thing*: a human-facing **render** over machine-keyed state (the derived
work-state seat in
[`agent-spawn-flow-tool.plan.md`](agent-spawn-flow-tool.plan.md), the
`session_id`, the UUID). The clash-rate figure is a **machine-proxy for a
human-UX function**, never the function itself — which is exactly why the
owner-taste-review must judge the 5–10 names **as they render on the statusline
and in session titles**, their real consumption context, not as an abstract
wordlist.

---

## WS3 — v3 Registry Entry + Activation (Phase 3)

### Cycle 3.1: Register v3 (inactive)

**File scope**: `agent-tools/src/core/agent-identity/schema-registry.ts`,
`agent-tools/tests/agent-identity/schema-registry.unit.test.ts`.

**Test (Red):**

- The `NamingSchemaId` union and `NAMING_SCHEMA_VERSION_VALUES` gain the v3 id
  (descriptive slug, e.g. `v3-noun-agentive` — never a bare digit, per
  ADR-198 §Decision #1).
- `NAMING_SCHEMAS` carries a v3 entry: `columnCasing: ['title', 'title']`, a
  single flat group `{ columns: [NOUN_UNION_540, AGENTIVES_120] }`, and a pinned
  `wordlistDigest`. (Grounded note, verified against `derive.ts` 2026-06-13: with
  one group, `selectByDigest` over the groups array always returns index 0 — the
  group-routing digest bytes are intentionally unused for a flat schema; the two
  column selections use byte offsets 4 and 8. This is correct, not a defect; do
  not add a second group to "use" the bytes.)
- `computeNamingSchemaDigest` over the live v3 material equals the pinned
  constant (the self-enforcement gate).
- A fixed known seed derives a stable v3 name + slug (era-snapshot).
- `ACTIVE_NAMING_SCHEMA_ID` is **unchanged** (still v2) at the end of this
  cycle — registration is not activation.

**Acceptance**: AC-7. **Validation**:
`pnpm --filter @oaknational/agent-tools test -- schema-registry`.

### Cycle 3.2: Activate v3 (owner-gated)

**Precondition**: WS1 fully landed (era-pinning live) **and** WS2 owner review
passed **and** WS3 cycle 3.1 landed.

**File scope**: `schema-registry.ts` (`ACTIVE_NAMING_SCHEMA_ID` → v3),
surface tests across CLI / statusline / hooks.

**Test (Red / observation):** a fresh seed (no env override) now derives a v3
display name, and the recorded `naming_schema_version` is the **true v3 era**
(not `override`, not v2) — this assertion is the cross-phase gate: it can only
pass if WS1 cured the override-caching. In-flight pre-activation sessions keep
their pinned era for their lifetime (ADR-198 §Consequences).

**Acceptance**: AC-8, and AC-3/AC-4 re-proven under v3. **Validation**: live
CLI proof on a fresh seed + `pnpm --filter @oaknational/agent-tools test`.

---

## WS4 — Documentation and ADR

ADR-198 is amended (or a short successor ADR is added) to record: the v3
noun-agentive era, and the **era-pinning provenance cure** — that hooks pin the
era, not the rendered name, so `naming_schema_version` records the true era and
`override` again means only operator-assigned names. This amendment is
**substantive, not additive**: ADR-198 §Consequences currently states in-flight
sessions keep their name via the `OAK_AGENT_IDENTITY_OVERRIDE` env cache; after
WS1 that mechanism is the pinned-era var, so that consequence text is rewritten,
not appended to. Refresh example names in `agent-identity.md`; refresh any
PDR-027 example that cites a v2 name.

## WS5 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

Run the full chain on the integrated delivery; green repeatedly. The
portability gate (`pnpm portability:check`) matters here — the cure changes
platform hook surfaces.

## WS6 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Dispatch by substance: `code-expert` (gateway), `test-expert` (cycle shape +
no audit-tests), `type-expert` (the `NamingSchemaId` union widening + env
parsing at the boundary), `config-expert` (hook/env surface + `.claude`/`.cursor`
wiring), `docs-adr-expert` (ADR amendment + agent-identity.md). Adjudicate every
verdict; land amendments before claiming completion.

---

## Proof Contract

| Acceptance id | Claim | Proof level | Proof |
|---|---|---|---|
| AC-1 | Pinned era yields a derived result with the true era, not `override`; explicit override still wins | unit | `cli.unit.test.ts` |
| AC-2 | Unregistered pinned-era id fails soft (derives under active, exit 0) | unit | `cli.unit.test.ts` |
| AC-3 | Collaboration-state stamps the true `naming_schema_version` under a pinned era | unit | `collaboration-state/identity.unit.test.ts` |
| AC-4 | Hooks export `OAK_AGENT_NAMING_SCHEMA_ID`, not a cached rendered name; the CLI the statusline spawns derives through the pinned era | unit | hook-planner unit tests + CLI env coverage (AC-1) |
| AC-5 | One seed → one name for a session's life; no happy-path `override` | e2e | recorded live CLI transcript (WS1 cycle 1.4) |
| AC-6 | v3 wordlists pass every curation gate | unit | `v3-curation.unit.test.ts` |
| AC-7 | v3 registered + digest-pinned; editing material without a version bump fails the tree; `ACTIVE` unchanged at registration | unit | `schema-registry.unit.test.ts` |
| AC-8 | After activation a fresh seed derives a v3 name with a true `v3` era | e2e | recorded live CLI proof (WS3 cycle 3.2) |
| AC-9 | Docs/ADR reflect landed behaviour (era-pinning + v3) | non-code | `docs-adr-expert` verdict in WS6 |

Completion language (plan complete, workstream complete, Phase N complete) is
valid only when every AC for that scope is proven at its stated level. Phase 1
is complete at AC-1…AC-5; the full plan at AC-1…AC-9.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| A consumer of `OAK_AGENT_IDENTITY_OVERRIDE` is missed, leaving a split path | Touch-point list enumerated first-hand by grep at authoring — direct env readers: cli, cli-environment, collaboration-state/identity (normal path), types, cli-spec-help, both hooks. `statusline-identity.ts` is NOT a direct reader (it spawns the CLI, so it is cured transitively). Re-grep at execution before claiming WS1 done |
| Activating v3 before era-pinning lands re-splits every live session | WS3 cycle 3.2 is hard-gated on WS1 fully landed; the activation test asserts a true `v3` era, which only passes post-cure |
| Stale `dist/` makes hooks emit old behaviour during checks | Rebuild `@oaknational/agent-tools` before exercising hooks (noted in WS1 cycle 1.3) |
| Agentive wordlist quality is taste-laden | Curation gates as tests + blocking owner review before registration |
| v3 material edited after activation | Digest pin makes it structurally impossible without a v4 entry (ADR-198) |
| Operator-override semantics regress | A dedicated test keeps the explicit-override path yielding an override result (AC-1) |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- `principles.md`: long-term architectural correctness — derive-from-seed+era
  over caching a rendered string; the cure is structural (the name is
  reproducible, so it is never stored), not a doc patch.
- `testing-strategy.md`: every cycle is a test+code pair in one commit; curation
  gates and provenance assertions are state descriptions, not implementation
  audits.
- `schema-first-execution.md`: `NAMING_SCHEMA_VERSION_VALUES` /
  `NamingSchemaId` remain the single source the boundary schemas derive from;
  the env-pinned era is validated against that union before use.

---

## Connection to the Knowledge-Distribution Substrate (recorded 2026-06-29)

This plan was authored 2026-06-13, **before** the owner's 2026-06-28 substrate
direction in
[`knowledge-distribution-substrate.plan.md`](../future/knowledge-distribution-substrate.plan.md)
(future-strategic — *recorded understanding, not a build authorisation*). The
connection is recorded here so the env-var choice is reconciled by design, not
discovered later.

- **The seed-on-env is sanctioned, not debt.** The substrate's own spawn flow
  (`agent-spawn-flow-tool.plan.md`) sets `PRACTICE_AGENT_SESSION_ID` in its
  launch command to root a session — env is the agreed bootstrap carrier for
  the *seed*, because a shell subprocess cannot see the harness stdin that
  carries `session_id`. WS1 reuses that exact mechanism.
- **The era env var is a deliberate minimal bootstrap carrier.**
  `OAK_AGENT_NAMING_SCHEMA_ID` is a *second* identity env var the substrate's
  two-layer identity model (`knowledge-distribution-substrate.plan.md` §"Two-layer
  identity model") does not itself name. It is justified at t=0: the statusline
  derives before any session record exists, so the era must be pinned somewhere
  env-reachable. Ship it — it is the safe, available single-valued-identity cure.
- **Known reconciliation-debt, named now.** The substrate-native cure for the
  split is to **stamp identity once in an append-only session-identity event**
  and have consumers *render* over it (the substrate's `render` transport verb),
  rather than re-derive everywhere from a pinned env era. v3's own
  *derive-don't-cache* insight is a **local instance of that same `render`
  principle** — the small fix independently found the substrate's core verb.
  When the substrate is built, `OAK_AGENT_NAMING_SCHEMA_ID` either becomes a
  typed bootstrap instance or dissolves into the session-identity event; this
  note marks it as known, not a surprise. v3 era-pinning is also the natural
  **first proving instance of substrate cold-start for identity**, as the spawn
  flow is for the work-state seat.
- **Identity cross-links (the wider cluster):**
  [`collaboration-identity-doctrine-enforcement-remediation.plan.md`](collaboration-identity-doctrine-enforcement-remediation.plan.md)
  (the UUID-v5 `id` tuple — content-addressed identity),
  [`codex-session-identity-plumbing.plan.md`](../future/codex-session-identity-plumbing.plan.md)
  (per-platform seed derivation from `CODEX_THREAD_ID`),
  [`agent-work-state-registry.plan.md`](../future/agent-work-state-registry.plan.md)
  (superseded — the seat is *derived*, not authored).

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

WS4 enumerates the doc surfaces; the ADR-198 amendment (or successor) is the
permanent consolidation record for both the era-pinning cure and the v3 era.

---

## Consolidation

After completion and green gates, run `/oak-consolidate-docs` to graduate
settled rationale (era-pinning = derive-don't-cache; flat-group distinctiveness
trade-off) into the ADR, refresh the `agent-naming` thread record, and rotate
working notes.

---

## Dependencies

**Blocking**: owner taste review of the v3 agentive wordlist before WS3
registration (WS2 checkpoint). WS1 fully landed before WS3 cycle 3.2
(activation).

**Beneficial**: none. All work is self-contained in the
`@oaknational/agent-tools` workspace.

**Related plans**: [`statusline-session-shape-indicators.plan.md`](statusline-session-shape-indicators.plan.md)
also touches `statusline-identity` — coordinate the statusline edit if both run
concurrently (separate concern: shape indicators vs identity derivation). For
the conceptual identity-substrate cross-links (the substrate, the two-layer
identity model, the superseded work-state registry, the UUID-tuple and Codex
identity work), see §"Connection to the Knowledge-Distribution Substrate" above.

## Readiness Reviewers

`assumptions-expert` reviewed this plan 2026-06-13 for proportionality and
assumption validity against the live code: verdict **READY-WITH-AMENDMENTS**,
both amendments applied — (A) `statusline-identity.ts` needs no edit (it spawns
the CLI; cured transitively), reframed as a propagation proof; (B) the
`identity.ts:103` citation corrected to distinguish the untouched admin override
path from the normal path at `identity.ts:61`. Proportionality assessed
right-sized; all three blocking relationships assessed legitimate; the
touch-point list verified against an independent grep. Technical specialists
(`type-expert` on the union widening, `config-expert` on the hook/env surface)
are dispatched in WS6 at implementation time per the no-backfill discipline.
