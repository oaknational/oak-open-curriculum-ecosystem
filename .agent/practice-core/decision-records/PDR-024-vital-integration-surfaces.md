---
pdr_kind: governance
---

# PDR-024: Vital Integration Surfaces Between Repo and Practice Core

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(Core contract — this PDR names what must connect to the Core);
[PDR-008](PDR-008-canonical-quality-gate-naming.md)
(canonical gate names — one vital integration);
[PDR-009](PDR-009-canonical-first-cross-platform-architecture.md)
(canonical-first artefact architecture — another vital integration);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — another);
[PDR-002](PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md)
(deliberate cross-document reinforcement — a defensive integration);
[PDR-003](PDR-003-sub-agent-protection-of-foundational-practice-docs.md)
(owner-edited foundations — a safety integration).

## Context

A Practice-bearing repo is not "a repo plus a `.agent/practice-core/`
directory that happens to exist alongside it." It is a **coupled
system** in which specific integration surfaces create flows in both
directions. Without those surfaces, the Practice Core becomes a
dormant archive: the files exist but no agent reads them at the right
moment, no session discoveries reach them, no bootstrap respects them,
no hydration preserves them.

The coupling flows in three categories:

**Core → Repo (orientation).** The repo must point agents at the
Practice during normal operation. Without the pointer, the Practice
Core is invisible to the work. The pointer is neither passive nor
implicit: specific files (entry-point chain, practice-index bridge,
start-flow skills) direct attention at specific moments (session
start, artefact search, workflow invocation). When the pointer
breaks — a renamed file, a missing link, a bypassed skill — the
Practice remains on disk but is not in the session. The repo silently
reverts to whatever ambient habits the platform provides.

**Repo → Core (feedback).** The session's learning must reach the
Practice, or the Practice stagnates. This is the knowledge flow
(napkin → distilled → graduated to PDRs / patterns / trinity
amendments), the upstream review (session learning contradicts or
refines existing Core substance), and the practice exchange (incoming
plasmids from other repos in the network). Without feedback
mechanisms, the Practice grows a gap between what it says and what
the repo has learned — and the gap accumulates silently until the
Practice teaches patterns the work has outgrown.

**Cross-cutting contracts.** Specific conventions (canonical agent
artefact architecture, canonical quality-gate names, specialist
capability pattern, ecosystem-tooling reference, continuity
surfaces) act as the shared vocabulary that makes the bidirectional
flows coherent across the Practice network. Without canonical
names, a hydrating agent cannot find the repo's quality gate by
name; without canonical artefact architecture, adding a platform
requires rewriting the Practice; without continuity surfaces,
cross-session work recovery is ad-hoc. These contracts exist at the
intersection of Core and repo — they govern how both sides agree to
address each other.

The absence of any one vital integration produces the same failure
mode: the Practice is **structurally present but inert**. Present
because the files are on disk; inert because the flows that would
make the files matter are broken. Practice Maturity Level 1 per
`.agent/practice-context/outgoing/practice-maturity-framework.md`
names this state: "Files present, references resolve — looks right,
nothing works."

Underlying cause: integration surfaces are a distinct design
concern from the Core's own content. A correct trinity, a complete
PDR set, and a well-populated memory/patterns do not by themselves
produce a functioning Practice. The surfaces that bind the Core to
the repo — and bind the repo's feedback to the Core — must be
explicit, enumerable, and verified. Without enumeration, they fail
silently because nothing in the repo looks wrong.

## Decision

**Every Practice-bearing repo has a named set of vital integration
surfaces that MUST exist for the Practice to be operational. The
surfaces are categorised by flow direction, specified at the role
level (portable across ecosystems), and enumerated for verification.
A Practice instance that lacks any vital surface is inert; hydration,
transplantation, and routine verification all check for each surface
explicitly.**

### The vital integration surfaces

Five categories. Each surface names a role, not a specific file path
(paths adapt per host); every surface MUST exist in some form in a
Practice-bearing repo.

#### Category A — Core → Repo (orientation)

The Practice Core directs the repo's agents to itself at session
start, artefact search, and workflow invocation.

| Surface | Role | Typical host form |
|---|---|---|
| **Entry-point chain** | Repo-facing files direct each agent platform to the canonical Practice directives | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` at repo root, each pointing at `.agent/directives/AGENT.md`; AGENT.md chains to `principles.md` + `testing-strategy.md` + trinity |
| **Practice-index bridge** | The one permitted Core→local external link; bridges portable Core substance to the host repo's local artefacts | `.agent/practice-index.md` (per ADR-124 / retained by PDR-007) |
| **Start-flow skills** | Session-start workflows that orient agents to the Practice before work begins | Canonical `start-right-quick` / `start-right-thorough` skills with platform adapters (per PDR-009) |
| **Collaboration-state consultation** | Session-start workflows expose live agent-to-agent coordination state before mutation | Repo-owned state for shared log, active claims, closed claim history, and decision threads |
| **Pattern discovery skill** | Consulted when agents face recurring design problems; routes to the correct pattern surface | Canonical `patterns` skill pointing at `practice-core/patterns/` (general abstractions) and `memory/active/patterns/` (instances) |
| **Rule activation** | Canonical rules activated via platform-native triggers (always-on, glob-scoped, agent-selected) | `.agent/rules/` canonical + per-platform triggers (`.cursor/rules/*.mdc`, `.claude/rules/*.md`, etc.) per PDR-009 |

#### Category B — Repo → Core (feedback)

Session learning and inter-repo learning reach the Core; without
these, the Practice stagnates.

| Surface | Role |
|---|---|
| **Capture surface** | Session-local observation storage (napkin or equivalent) — where surprises and corrections land at the moment they occur |
| **Refinement surface** | Settled rules distilled from captures (distilled.md or equivalent) — read at session start |
| **Graduation workflow** | Consolidate-docs or equivalent — the workflow that moves substance from ephemeral to permanent surfaces (PDRs, patterns, trinity amendments) |
| **Upstream Core review** | The consolidate-docs step that reads existing Core content against current practice and surfaces refinement candidates (contradictions, extensions, refinements, supersessions, drift) |
| **Practice Box (inbound)** | `practice-core/incoming/` — transient receiver for inbound Core packages from other repos in the network |
| **Ephemeral exchange (outbound)** | `practice-context/outgoing/` — ephemeral sender→receiver notes (sharpened by PDR-007 to ephemeral-only) |

#### Category C — Bootstrap / Hydration / Transplantation

The three genesis paths each produce a working Practice instance —
if and only if the vital surfaces end up present in the result.

| Surface | Role |
|---|---|
| **Cold-start hydration** | New repo reads the Core package; hydrating agent grows the vital surfaces per `practice-bootstrap.md` templates |
| **Plasmid integration** | Incoming Core arrives in `practice-core/incoming/`; Integration Flow (per `practice-lineage.md`) merges concepts bidirectionally; vital surfaces updated/retained |
| **Wholesale transplantation** | Fully-applied Practice from a source repo is transplanted per PDR-005; transplant manifest classifies every source artefact by portability gradient; vital surfaces verified at four-audit close |

#### Category D — Cross-cutting canonical contracts

Portable conventions that make the bidirectional flows coherent
across the Practice network.

| Contract | Codified in | What it provides |
|---|---|---|
| **Canonical agent artefact architecture** | PDR-009 | Three-layer canonical/adapter/entry-point; thin-wrapper contract; activation triggers distinct from policies |
| **Canonical quality-gate naming** | PDR-008 | Stable `clean` / `build` / `format` / `format:fix` / `lint` / `lint:fix` / `typecheck` / `test` / `check` / `check:fix` / `check:ci` / `fix` / `dev` across ecosystems; per-ecosystem adaptation rule; CI invokes `check:ci` |
| **Domain specialist capability pattern** | PDR-010 | Four-layer triplet + optional operational tooling; classification taxonomy; modes; inverted-hierarchy variant |
| **Continuity surfaces + surprise pipeline** | PDR-011 (+ ADR-150 locally) | Three continuity types; split-loop handoff/consolidate; named continuity contract; capture→distil→graduate→enforce |
| **Dev tooling per ecosystem** | PDR-006 | Leading-edge reference repos; ecosystem-by-ecosystem nomination/supersession |

#### Category E — Defensive / safety integrations

Mechanisms that protect the Practice from specific failure modes.

| Surface | Codified in | Protects against |
|---|---|---|
| **Owner-edited foundations** | PDR-003 | Sub-agents damaging dense, cross-referenced foundational docs via scoped edits |
| **Deliberate cross-document reinforcement** | PDR-002 | Consolidation/fitness passes mechanically deduplicating intentional pedagogical repetition |
| **Explorations tier** | PDR-004 | Design-space work being lost between session-ephemeral (napkin) and committed (ADR/PDR) |

### Verification: the Practice ensures its own integrations exist

The Practice verifies that each vital surface exists. Verification
runs at three points:

1. **Hydration close** — when a new Practice instance is created,
   the Bootstrap Checklist in `practice-verification.md` confirms
   every vital surface is present and operational.
2. **Routine consolidation** — the `consolidate-docs` workflow's
   upstream-review step (per the command's step 8) re-verifies
   that each vital surface still exists and is connected; silent
   drift (a renamed entry-point, a broken practice-index link, a
   missing start-flow skill) is surfaced here.
3. **Transplantation close** — PDR-005's four-audit close includes
   verification that every vital surface ended up in the
   destination.

Verification mechanisms are platform-agnostic in their description
but implemented in host-specific scripts (per PDR-022,
governance-enforcement-requires-a-scanner). Typical host
implementations:

- **Structural presence**: scripts that walk the expected surface
  paths and exit non-zero if any is missing.
- **Link integrity**: scripts that follow the entry-point chain and
  the practice-index bridge, reporting broken links.
- **Portability/adapter parity**: scripts that confirm every
  canonical artefact has its required platform adapters (per
  PDR-009).
- **Quality-gate presence**: scripts that confirm the canonical
  gate names exposed at the package-manager script level (per
  PDR-008).

### Failure mode nomenclature

A Practice instance missing any vital surface is **structurally
present but inert** (Practice Maturity Level 1 per the maturity
framework). This is a distinct failure class from "Practice Core
content is wrong" — the content may be perfect while the surfaces
that would make the content reach the work are broken.

## Rationale

**Why name integrations as first-class decisions.** Integrations
are a distinct concern from Core content and from host-repo content.
They live at the intersection. Without naming them, they tend to be
maintained partially by both sides (the Core's `practice-index`
reference; the repo's AGENT.md entry-point) and completely by
neither. Silent failures follow: a well-formed Core and a well-formed
repo that fail to bind at a critical point.

**Why categorise by flow direction.** The failure modes differ by
direction. Missing Core→Repo surfaces makes the Practice invisible
during work; missing Repo→Core surfaces makes the Practice stagnant
over time; missing cross-cutting contracts makes inter-repo
portability fail on arrival. Naming the direction of each surface
makes the diagnostic work (what's broken when the Practice feels
inert?) tractable.

**Why verification at three points.** Hydration catches missing
surfaces at creation; routine consolidation catches drift; transplant
close catches surfaces lost in transfer. Each point covers a
different failure mode. Verifying only at hydration misses drift;
verifying only at routine consolidation misses bootstrap gaps. The
three points cover the lifecycle.

**Why "the Practice ensures its own integrations exist".** This is
the self-referential property (ADR-131): a Practice that cannot
govern its own integration surfaces is subject to the same drift it
governs elsewhere. Verification mechanisms make the Practice's
integration contract enforceable; without them, the contract is
aspirational.

**Why reference existing PDRs rather than re-specify.** Each
vital-surface category already has a codifying PDR (or multiple).
Duplicating the content would create a drift vector. PDR-024 names
the **set**; the individual PDRs specify each surface. The
meta-decision here is that the set is required — not just that each
individual surface is specified somewhere.

Alternatives rejected:

- **Leave integrations as implicit.** Works when the owner holds the
  whole Practice in active memory; fails at hydration, transplant,
  and agent handoff. Implicit structure is invisible to verification.
- **Codify only at Core contract level (PDR-007).** The contract
  names what Core surfaces exist; it does not name the integration
  flows between Core and repo. The contract is a necessary but not
  sufficient layer.
- **Codify per-surface only (existing PDRs).** Leaves the set
  un-enumerated. Adding a new vital surface later has no natural
  home to register it.

## Consequences

### Required

- Every Practice-bearing repo has every vital integration surface
  in Category A, B, D, and E present, and at least one genesis
  path in Category C exercised (cold-start, plasmid, or transplant).
- Host-local verification scripts confirm each surface's presence
  and operational integrity (per PDR-022 scanner discipline).
- The `practice-verification.md` Bootstrap Checklist enumerates
  every vital surface from Categories A, B, D, and E — no surface
  from this PDR's tables may be absent from the checklist.
- The `consolidate-docs` upstream-review step (step 8) re-verifies
  vital-surface integrity at every consolidation.
- Hydration, plasmid integration, and transplantation each produce
  a result in which every vital surface is present; if any
  surface is absent at close, the integration is incomplete.

### Forbidden

- A Practice instance that ships or merges without all vital
  surfaces present. "The Core is correct" is not sufficient; the
  integration surfaces must also be present.
- Silent renaming of a vital surface without updating every
  cross-reference. The surface's role matters, not the specific
  path; but the path must resolve from all the places that point
  at it.
- Dropping verification of a vital surface to make a check "less
  noisy." The noise is the signal.

### Accepted cost

- The vital-surface enumeration must be maintained as the Practice
  evolves. Adding a new surface category is a PDR-level change.
  Justified by the diagnostic value of having a complete list.
- Verification scripts add to the host-repo's script surface.
  Justified by the drift they prevent.
- Hydration is marginally more complex (more surfaces to
  instantiate), but completeness is enforced rather than hoped for.

## Notes

### Relationship to Practice Maturity Framework

The maturity framework in
`.agent/practice-context/outgoing/practice-maturity-framework.md`
(future PDR candidate, currently ephemeral) describes Practice
instances as Level 1 (structural), 2 (operational), 3 (self-
correcting), 4 (evolving). PDR-024 makes Level 2 the **minimum**
for a Practice-bearing repo: every vital surface must exist and be
operational. An instance stuck at Level 1 (files present, flows
broken) fails PDR-024's verification.

### Relationship to the three genesis scenarios

PDR-005 names cold-start hydration, plasmid integration, and
wholesale transplantation as the three paths into a new
repo. PDR-024 names what each path must produce: a result with
every vital surface present. The scenarios govern **how** the
Practice arrives; PDR-024 governs **what must end up** in the
destination.

### Graduation intent

This PDR is itself a candidate for eventual graduation into
`practice.md` as a named section describing the Practice's
integration surfaces, with `practice-verification.md` carrying the
enumerated checklist. The graduation would mark PDR-024 as
`Superseded by <Core section>` and retain it as provenance.

### Host-local context (this repo only, not part of the decision)

At the time of authoring, the repo where this PDR was written
carries the following specific implementations of each vital
surface. These paths are host-local; the PDR's substance names the
roles, not these paths.

Category A (Core → Repo):

- Entry-point chain: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` at repo
  root → `.agent/directives/AGENT.md` → `principles.md` → other
  directives + trinity.
- Practice-index bridge: `.agent/practice-index.md`.
- Start-flow skills: `.agent/skills/start-right-quick/SKILL.md`,
  `.agent/skills/start-right-thorough/SKILL.md`, plus platform
  adapters.
- Collaboration-state consultation:
  `.agent/state/collaboration/log.md`,
  `.agent/state/collaboration/active-claims.json`,
  `.agent/state/collaboration/closed-claims.archive.json`, and
  `.agent/state/collaboration/conversations/`.
- Pattern discovery skill: `.agent/skills/patterns/SKILL.md` (updated
  this session to point at both Core and memory pattern surfaces).
- Rule activation: `.agent/rules/*` canonical + `.cursor/rules/*.mdc`,
  `.claude/rules/*.md`, etc.

Category B (Repo → Core):

- Capture: `.agent/memory/active/napkin.md`.
- Refinement: `.agent/memory/active/distilled.md`.
- Graduation workflow: `.agent/commands/consolidate-docs.md`
  (updated this session to wire in PDRs and practice-core/patterns).
- Upstream Core review: step 8 of consolidate-docs (added this
  session).
- Practice Box (inbound): `.agent/practice-core/incoming/`.
- Ephemeral exchange (outbound): `.agent/practice-context/outgoing/`
  (sharpened per PDR-007 this session).

Category D (cross-cutting contracts):

- Canonical agent artefact architecture: validated via
  `scripts/validate-portability.mjs` + `scripts/validate-subagents.mjs`.
- Canonical quality-gate naming: partially adopted (see PDR-008
  Notes for the host-local rename plan).
- Domain specialist capability pattern: validated via reviewer
  roster + triplet presence.
- Continuity surfaces: `.agent/memory/operational/repo-continuity.md`
  hosts the continuity contract (split-surface host per PDR-011;
  prior prompt-hosted shape dissolved 2026-04-20 — see PDR-026 +
  `.agent/directives/orientation.md`).
- Dev tooling per ecosystem: this repo is the TypeScript leading-
  edge reference per PDR-006.

Category E (defensive):

- Owner-edited foundations: enforced by
  `.agent/rules/subagent-practice-core-protection.md` (updated this
  session).
- Pedagogical reinforcement: enforced by reviewer discipline against
  mechanical deduplication.
- Explorations tier: `docs/explorations/` (established by PDR-004).
