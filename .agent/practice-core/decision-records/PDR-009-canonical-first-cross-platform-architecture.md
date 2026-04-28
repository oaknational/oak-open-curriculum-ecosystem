---
pdr_kind: governance
---

# PDR-009: Canonical-First Cross-Platform Architecture for Agent Artefacts

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract with first-class `decision-records/` and `patterns/`
directories — this PDR is authored under it);
[PDR-008](PDR-008-canonical-quality-gate-naming.md)
(cross-ecosystem naming convention — same portability intent applied to
quality gates).

## Context

A mature Practice-bearing repo typically supports more than one agent
platform. Currently exercised platforms in the author's network
include Cursor, Claude Code, Codex, and Gemini CLI; the platform set
is not closed — new platforms emerge, retire, and are adopted on
different timelines across the network.

Agent artefacts fall into five functional types, each needed in every
supported platform:

- **Rules / directives** — the authoritative policies that must govern
  agent behaviour (e.g. principles.md derivatives, TDD discipline,
  validation contracts).
- **Skills** — reusable workflow capabilities (e.g. session start,
  handoff, consolidation, napkin capture).
- **Commands** — named slash-invocations (e.g. `/review`, `/consolidate`,
  `/go`).
- **Sub-agents / reviewers** — specialist prompts invoked as
  independent reviewers or delegates.
- **Entry points** — the per-platform files that direct each platform
  to the canonical Practice material (e.g. `CLAUDE.md`, `AGENTS.md`,
  `GEMINI.md`).

Without a portability architecture, each platform holds its own copy of
every artefact. The cost compounds quickly:

**Drift**. Equivalent instructions diverge across platforms over time.
A command tweaked in one platform's copy ceases to match another's.
Which copy is authoritative becomes unclear, then contested, then a
source of latent failure.

**Maintenance entropy**. Changing one rule requires editing N
copies — one per platform. If any copy is missed, one platform holds
stale content. "Missed" becomes likely in proportion to the number of
platforms supported.

**Combinatorial scaling**. N platforms × M artefacts = N×M files that
must stay coherent. Adding a platform means duplicating M artefacts.
Adding an artefact means duplicating to N platforms. Each addition
multiplies the coherence surface rather than adding to it linearly.

**Platform lock-in**. A skill or command that exists only in one
platform cannot be invoked from another. Contributors switching
platforms find that their tools vanish. Agents that hydrate a repo
from a different platform than the authoring platform see an
incomplete capability surface.

**Activation conflation**. Rules have two distinct properties: the
**policy** they encode (what must be done) and the **activation
mechanism** that decides when the policy surfaces (always-on,
glob-scoped, agent-selected). Without a separation, the policy
document is entangled with the activation metadata, and an edit to
one risks a change to the other.

Underlying cause: the Practice needs to be cross-platform by design
(the "concepts are the unit of exchange" principle from the Practice
Core demands it), but platform support tends to accrete
per-platform — each new platform adopted pragmatically, with its own
copy — unless a portability architecture is declared up front.

## Decision

**Every agent artefact lives canonically in a platform-agnostic
location. Platform-specific files are thin adapters that reference
the canonical substance. Entry-point files per platform direct each
platform to the canonical Practice material. Activation mechanisms
are a distinct artefact type from policies, not a thin wrapper.**

### The three-layer model

```text
Layer 1: Canonical Content     (.agent/ — platform-agnostic substance)
Layer 2: Platform Adapters     (.<platform>/ — thin wrappers)
Layer 3: Entry Points          (root-level files per platform)
```

### Layer 1: Canonical Content

All substantive artefact content lives platform-agnostically. Typical
locations:

| Artefact | Canonical location |
|---|---|
| Rules / directives (authoritative policies) | `.agent/directives/` |
| Rules (enforceable extractions) | `.agent/rules/` |
| Skills | `.agent/skills/<skill-id>/` |
| Commands | `.agent/commands/` |
| Sub-agent templates | `.agent/sub-agents/templates/` |
| Sub-agent components | `.agent/sub-agents/components/` |
| Plan templates | `.agent/plans/templates/` |

Location names adapt per repo convention; the invariant is that the
substance lives in one platform-agnostic place. An edit to an artefact
happens in exactly one location.

### Layer 2: Platform Adapters

Each supported platform has an adapter directory (e.g. `.cursor/`,
`.claude/`, `.agents/`, `.gemini/`, `.codex/` at time of authoring)
containing thin wrappers. A thin wrapper contains ONLY:

- **Platform-specific activation metadata** — frontmatter or config
  that the platform's native mechanism requires to trigger the
  artefact (globs, paths, `alwaysApply`, permission mode, allowed
  tools, model selection, etc.).
- **A short description** — sufficient for platform-native discovery
  surfaces.
- **A pointer to the canonical content path** — the wrapper's one
  substantive statement is "read and follow `.agent/<path>`".
- **Platform-specific invocation syntax** — where the canonical form
  cannot express a platform's native mechanism (e.g. `@file` mentions,
  argument-substitution placeholders, skill-invocation syntax).

A thin wrapper MUST NOT contain substantive instructions, workflow
steps, or logic that does not exist in the canonical source. The
canonical content describes **what** to do; the wrapper describes
**how** to invoke it on a specific platform.

Concretely: a wrapper file longer than ~10 content lines (excluding
frontmatter) is a red flag that substance has leaked into the wrapper.

Cross-platform standard directories, such as `.agents/`, are adapter
targets under this model, not canonical locations. A vendor tool may
install full content there, but the Practice-bearing repo must
canonicalise that content back into Layer 1 and replace the platform
copy with a thin wrapper.

Validation must be bidirectional: every canonical artefact has the
required adapters, and every platform adapter points back to an
existing canonical artefact. It must also validate wrapper form, not
only presence. Existence-only checks allow full-content drift to hide
inside platform directories.

### Layer 3: Entry Points

Root-level files direct each platform's agent to the canonical
Practice. Each platform reads its own entry point; each entry point
redirects to the single canonical directive (typically
`.agent/directives/AGENT.md` or equivalent). Examples at time of
authoring:

- `CLAUDE.md` → canonical directives
- `AGENTS.md` → canonical directives
- `GEMINI.md` → canonical directives
- (Cursor uses always-on rules via its own mechanism; the entry
  point is implicit)

An entry point file is itself a thin wrapper: platform-native frontmatter
or content requirements plus a pointer to the canonical directive.

### Activation triggers are a distinct artefact type, not a wrapper

Rules have two conceptually separate layers:

1. **Authoritative policy** — the canonical substance defining what must
   be done. Lives at Layer 1 (e.g. `.agent/directives/principles.md`,
   `.agent/rules/<specific-rule>.md`). This is substantive content.
2. **Activation trigger** — the platform-specific mechanism deciding
   _when_ and _how_ a policy surfaces (always-on, glob-scoped, agent-
   selected, path-scoped, entry-point-inherited). Lives at Layer 2.

An activation trigger is NOT a thin wrapper _for_ a policy in the way
a command wrapper points at a command. It is a separate artefact type:
a trigger mechanism that activates a specific policy, directive, or
skill at the right moment during the session.

This separation has three consequences:

- A single trigger may activate many policies (e.g. "apply architectural
  principles" trigger activates everything in the canonical rule, which
  itself aggregates principles from the foundation directive).
- Different platforms have different activation expressiveness
  (granular globs in some; entry-point-inherited always-on in others).
  Each platform wraps the trigger in its native form without changing
  the policy substance.
- An edit to a policy happens in the canonical location; an edit to
  when/how it surfaces happens in the trigger. The two concerns stay
  uncoupled.

### Many-to-one trigger consolidation

When multiple canonical rules all point to the same authoritative source
(different sections of a single policy document, for instance), they
may consolidate into **one canonical rule** with **one trigger per
platform**, rather than maintaining many thin redirects that add no
value beyond indirection.

The three-layer model is preserved: trigger → canonical rule →
authoritative source. Consolidation reduces the number of canonical
rules and triggers while keeping the layer count at three.
Specialised rules are retained when they have unique activation
metadata (e.g. a file-scoped glob) that cannot be expressed by the
consolidated trigger.

### Command and skill naming discipline

Canonical artefact IDs are mandatory. A canonical command, skill, or
sub-agent has one ID that all platform adapters carry verbatim.
Compatibility aliases — a command named one way on one platform and
another on another — are not permitted: the portability value of a
consistent name across platforms outweighs any platform-native
convention.

Practical convention (adopt or adapt): a project prefix like `jc-` or
similar makes it visible at a glance which commands are
Practice-owned vs. platform-native or plugin-installed.

### Plan templates are canonical-only

Plan templates are consumed directly by agents on any platform without
requiring an adapter — they are read as markdown files regardless of
which platform is active. Plan templates therefore live only at
Layer 1; no adapter directories contain plan wrappers. This is the one
artefact type that legitimately has no adapters because the agents
consume the canonical form directly.

### Platform configuration as infrastructure

Each platform's project-level configuration — permissions, hooks,
plugin state, MCP allowlists, fetch allowlists — is **tracked**
infrastructure, not a user preference. It defines the agentic system's
operational contract. Local overrides (gitignored settings files per
platform) carry user-specific paths and one-off permissions; normal
operation must not depend on them.

The canonical-first architecture depends on this split: wrappers exist
in tracked platform directories but will not activate without tracked
platform permissions. Portability validation must check **authorisation
parity** (the platform will actually run the wrapper), not just
**wrapper presence**. A repo with complete adapters but missing
tracked permissions has a silent-failure mode where the Practice
appears installed but does not run.

## Rationale

Four options were considered.

**Option A — Per-platform copies.** Each platform holds its own copy
of every artefact. Rejected: combinatorial scaling (N×M) with drift
built in. The canonical-first model replaces it.

**Option B — Runtime prompt assembly tooling.** Build a tool that
assembles artefacts on demand from shared components at runtime.
Rejected: complexity does not justify itself at current scale. The
canonical-plus-wrapper model achieves the portability benefit with
only file-level machinery.

**Option C — Components only, no templates.** Just fragments; each
platform composes its own. Rejected: too granular for daily editing;
every artefact requires assembly; onboarding cost rises. Templates
are the unit that matches the cadence at which agents read and apply
material.

**Option D (adopted) — Canonical content + thin adapters + entry
points.** The canonical substance is the source of truth; adapters
are pointers with activation metadata; entry points direct each
platform to canonical material. Scales linearly in platforms; edits
happen once; platform-specific differences (granular activation
vs. always-on inheritance) are preserved in adapters without entangling
substance.

**Why "thin" is a contract, not a suggestion.** A wrapper that grows
substantive content silently reintroduces the per-platform-copy
failure mode. The thin-wrapper rule is load-bearing: when it slips,
the canonical-first property fails. Enforcement via validation
(wrapper-line-count checks, grep for substance leakage) is the only
durable discipline.

**Why activation triggers are not wrappers for policies.** A policy
and a when-to-apply-it are separate concerns. Wrapping a policy in
activation metadata entangles them. An activation-trigger artefact
that names the policy it surfaces lets the policy evolve
independently of the trigger conditions. Both are Layer-2 content in
the sense that both are platform-specific, but they are different
Layer-2 artefact types.

## Consequences

### Required

- Every artefact type has exactly one canonical location under a
  platform-agnostic root (typically `.agent/`).
- Every platform adapter directory contains only thin wrappers,
  activation triggers, and platform-native config.
- Every entry-point file is itself a thin wrapper pointing at the
  canonical directive.
- Every platform that supports activation mechanisms beyond always-on
  (glob-scoping, path-scoping, agent-selection) uses the platform's
  native mechanism for activation triggers, not a wrapped form of a
  policy file.
- Portability validation (automated) checks: (a) every canonical
  artefact has the required adapters; (b) every adapter is thin
  (content-line count under the threshold; no substantive prose);
  (c) every platform adapter points back to an existing canonical
  artefact; (d) every platform's tracked configuration grants the
  permissions wrappers need to activate.
- Cross-platform probes use platform-neutral inputs by default, or
  explicitly provide parity across the platforms they claim to verify.
- Tripwire installs should include at least one self-applying
  acceptance check against the installing session.
- Canonical artefact IDs are stable across platforms. Aliases are
  forbidden; platform-native renaming is not.

### Forbidden

- Substantive content in platform adapter directories. Policy
  prose, workflow steps, or decision logic in a wrapper is a
  contract violation.
- Canonical rules that duplicate authoritative-source content rather
  than pointing at it. A canonical rule is itself a pointer layer in
  the three-layer model; its own substance should be minimal.
- Silent platform additions. Adding support for a new platform
  requires creating its adapter directory, its entry-point file, its
  tracked configuration, and its portability-validation coverage. A
  new platform is not "supported" just because someone invokes the
  repo from it.
- Wrapper-only permission settings. Tracked platform config is part
  of the agentic system contract; permissions that live only in
  gitignored local files make the Practice fail silently on fresh
  checkout.

### Accepted cost

- More files overall. Canonical plus N adapters plus an entry point
  per platform produces more total files than per-platform copies
  would. The trade-off is linear scaling and zero drift, which wins
  at any N ≥ 2 and compounds thereafter.
- Platform-specific capability differences remain visible. Some
  platforms support granular activation; others do not. The wrappers
  reflect this honestly rather than hiding it. Receivers understand
  what each platform can and cannot do.
- Thin-wrapper discipline is recurring work. Wrappers tempt
  substance-growth ("just a quick note"); validation must run to
  catch this before drift accumulates.

### Accepted limitation — wrapper non-reading

Some agents do not follow "read and follow X" instructions in thin
wrappers; they treat the wrapper as sufficient. Mitigations vary:

- **File-injection mechanisms** (e.g. `@file` references) force
  content loading — most reliable.
- **Canonical content guards** ("If you have not read X, stop and
  read it now") help when the agent skips the read.
- **Minimal fallback context** — up to ~5 lines of the most
  load-bearing substance in the wrapper — helps when the agent
  ignores both mechanisms.

The mitigations do not make wrappers thick; they remain fundamentally
pointers with optional fallback.

## Notes

### Relationship to PDR-007

PDR-007 established first-class `practice-core/patterns/` and
`practice-core/decision-records/` directories. This PDR extends the
canonical-first discipline outward: the same principle that lives
inside the Core (portable substance travels; non-portable content
stays local) governs the whole agent-artefact surface. Practice
Core is the inner ring; platform adapters are the outer ring; both
rings obey the same concept-before-container logic.

### Relationship to PDR-008

PDR-008 canonicalised **names** of quality gates across ecosystems;
this PDR canonicalises **locations and shapes** of agent artefacts
across platforms. Same portability intent, applied to different
surfaces. The two compose: a Practice-bearing repo has a stable
artefact architecture (PDR-009) and a stable gate vocabulary
(PDR-008).

### Graduation intent

This PDR's substance is eventually a candidate for graduation into
`practice-lineage.md` as part of how the Practice spans platforms.
When the architecture has stabilised across multiple cross-platform
hydrations, the graduation would mark this PDR as `Superseded by
<Core section>` and retain it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring, the repo where this PDR was written carries:

- Platforms: Cursor, Claude Code, Codex, Gemini CLI.
- Canonical location: `.agent/` for all substantive content.
- Adapter directories: `.cursor/`, `.claude/`, `.agents/`
  (cross-platform skills/rules surface), `.gemini/`, plus `.codex/`
  for Codex config.
- Entry points: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, plus
  `.cursor/rules/*` for Cursor's always-on mechanism.
- Validation: `scripts/validate-portability.mjs` (wrapper presence
  per canonical artefact), `scripts/validate-subagents.mjs`
  (sub-agent adapter coverage).
- Specific counts (artefacts, wrappers, ADR references) live in the
  host ADR record that this PDR's substance extracts from.

## Amendment Log

### 2026-04-24 — Cross-platform standard directories are adapters

Practice-first portability remediation exposed that `.agents/skills/`
can receive full vendor skill content from external tools. This does
not make `.agents/` canonical in a Practice-bearing repo. The portable
decision remains canonical-first: vendor content is moved to `.agent/`,
platform copies become thin wrappers, and validators check forward
coverage, reverse adapter links, wrapper form, and tracked permission
activation.
