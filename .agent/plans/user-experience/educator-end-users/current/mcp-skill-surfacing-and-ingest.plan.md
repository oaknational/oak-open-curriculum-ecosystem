---
name: "MCP skill-surfacing and ingest — this repo's half of the both-directions distribution decision"
collection: user-experience
audience: educator-end-users
lane: current
status: current
type: executable
last_updated: 2026-06-08
---

# MCP skill-surfacing and ingest — this-repo half of the both-directions decision

> **Executable, queued (`current/`).** This is the **this-repo** half of an owner
> decision (2026-06-08): pursue **both** external-facing distribution directions
> for Oak's curriculum-assistance capability — (A) **this repo** ingests Agent
> Skills and re-surfaces them through the Oak Curriculum MCP app in MCP-native
> forms, and (B) the
> [`oaknational/oak-skills`](https://github.com/oaknational/oak-skills) library
> becomes a publicly installable skills source (its plan lives in that repo under
> `.agent/plans/public-distribution.plan.md`). This plan owns **Direction A**. It
> sits alongside the synthesis plan
> [`external-facing-capability-distribution.plan.md`](external-facing-capability-distribution.plan.md),
> which **frames** the cross-cutting decisions; this plan **executes** the
> this-repo engineering. **Execution gate:** Workstream 0 is a design spike whose
> recorded verdicts gate every code workstream below — no build cycle starts until
> t0 lands.

## Problem and intent

Oak grows the *same* curriculum-assistance capability in two packagings with no
shared source of truth: the `oak-skills` library emits every packaging target
(Claude plugin, ChatGPT Custom GPT, Gemini extension/Gem, per-skill zips, a
`.well-known/agent-skills/index.json` discovery index) **except** MCP
prompts/resources; meanwhile this repo's MCP app authors skill-*like* surfaces
**by hand** — the EEF **c4** `eef://interpretation` resource and **c5**
`adapt-lesson` prompt. The seed review
([`../external-facing-skills-and-mcp-surfaces-review.report.md`](../external-facing-skills-and-mcp-surfaces-review.report.md))
grounds this seam first-hand: one capability, two hand-maintained packagings,
drift waiting to happen.

**Intent:** build a generated path from `SKILL.md` capability sources into
MCP-native forms — admitted through the latent `sourceType` extension point
already present in this repo's `skills-adapter-generate` tooling — so the MCP
surfaces become generated, not hand-authored, with attribution and teacher-agency
preserved.

## End goal, mechanism, and means

- **End goal.** Teachers reach Oak's curriculum-assistance capability through the
  MCP app in MCP-native forms (resources / prompts / tools) **generated from the
  same `SKILL.md` capability source** the other channels use — no second
  hand-maintained copy, no drift.
- **Mechanism.** Extend `skills-adapter-generate` from "discover local canonicals
  → emit agent adapters" to "resolve a capability source by `sourceType` → emit
  the target surface for that type", adding an MCP-emitter surface. The generator
  stays the source of truth; MCP surfaces become generated — the structural cure
  the metacognition directive prefers over doc-patching.
- **Means.** A design spike (t0) that resolves the open decisions, then the
  discriminated-union `sourceType` + resolver (t1), the MCP emitter (t2),
  determinism/pinning (t3), and folding the hand-authored EEF c4/c5 surfaces under
  the generated path (t4).

## Verified facts grounded first-hand (2026-06-08; re-verify platform facts at use)

- `agent-tools/src/skills-adapter-generate/` reads local canonicals at
  `.agent/skills/<id>/SKILL-CANONICAL.md` and emits **two** adapter surfaces
  (`.claude/skills/`, `.agents/skills/`) as stub pointers. It emits **no** MCP
  surface today.
- `skills-lock.json` (loader `lock.ts`) carries a per-entry
  `LockedSkillEntry { source; sourceType; computedHash }`. The `skills` map is
  empty and `sourceType` is an **unused discriminator** — a latent, designed-for
  extension point.
- The MCP app (`apps/oak-curriculum-mcp-streamable-http`) already exposes the EEF
  **c4** `eef://interpretation` resource and **c5** `adapt-lesson` prompt;
  EEF is default-ON in this repo (commit `d3109d7c`), gated live by deployment.
- `oak-skills` is an Agent Skills library (`skills/<id>/SKILL.md`); it is a
  separate repo, **not edited from here** (Direction B is owned by its own plan).

## Open design decisions — resolved by Workstream 0 (the design gate)

t0 must record a verdict + rationale for each before any build workstream starts:

1. **MCP form mapping** — which form(s) the capability surfaces as (`eef://`-style
   **resources**, **prompts**, **tools**, or a mapping across them), and how
   `SKILL.md` anatomy maps onto them (the seed report's candidate: workflow spine
   ↔ prompt; `references/` ↔ resource).
2. **The `sourceType` contract** — the closed discriminated union shape (per
   `closed-shape-design-optionality`), each member carrying its resolver + emitter.
3. **Source-of-truth topology** — ingest `oak-skills` directly, or a
   capability-manifest layer between (synthesis-plan open decision #1).
4. **Determinism and pinning** — how an ingested source is pinned (SHA in
   `skills-lock.json` `source`/`computedHash`) so `pnpm skills:check` stays
   byte-deterministic.
5. **Licensing / attribution** — terms for re-surfacing ingested `SKILL.md`
   content through Oak's MCP (`ATTRIBUTION.md` / `LICENCE-DATA.md`, OGL v3.0 for
   Oak material, EEF attribution for evidence).

## Todos

```yaml
todos:
  - id: t0-design-spike
    content: >-
      Resolve the five open design decisions above (MCP form mapping; closed
      sourceType union contract; source-of-truth topology; determinism/pinning;
      licensing/attribution). Output is a decision record (non-code) with a
      verdict + rationale for each. This is the design gate: no code workstream
      starts until t0 lands. Acceptance: all five decisions have a recorded
      verdict and rationale; assumptions-expert has reviewed the spike scope.
      Validation (non-code): the decision record exists, each decision resolves
      to a verdict, and the chosen MCP form is consistent with the MCP app's
      existing resource/prompt registry.
    status: pending
  - id: t1-sourcetype-union
    content: >-
      Promote sourceType from an open string to the closed discriminated union
      decided in t0, with a resolver per member. TDD: failing unit tests for the
      union + resolver land with the product code that greens them. Acceptance:
      the union is closed (exhaustive switch, no default-string escape); resolver
      unit tests pass at every level. Proof: unit.
    status: pending
    depends_on: [t0-design-spike]
  - id: t2-mcp-emitter
    content: >-
      Add an MCP emitter sibling to emitAdapter in generator.ts that renders an
      ingested SKILL.md into the MCP app's resource/prompt/tool registry per the
      t0 form mapping. TDD: an integration test proves the MCP app exposes a
      generated surface from a SKILL.md fixture. Acceptance: a fixture skill is
      reachable through the MCP app via the generated surface; tests green.
      Proof: integration.
    status: pending
    depends_on: [t0-design-spike, t1-sourcetype-union]
  - id: t3-determinism-gate
    content: >-
      Pin the ingested source + computedHash in skills-lock.json and extend the
      --check drift gate (checker.ts) + pnpm skills:check to cover the MCP
      surface. TDD: re-running the generator yields byte-identical output;
      drift is detected. Acceptance: pnpm skills:check is green and deterministic
      across re-runs. Proof: unit + integration.
    status: pending
    depends_on: [t1-sourcetype-union]
  - id: t4-fold-eef
    content: >-
      Fold the hand-authored EEF c4/c5 surfaces (eef://interpretation resource,
      adapt-lesson prompt) under the generated path so they are emitted by the
      generator rather than maintained by hand. Acceptance: the EEF c4/c5
      surfaces are generated; the drift check is green; behaviour is unchanged.
      Proof: integration.
    status: pending
    depends_on: [t2-mcp-emitter]
```

## Sequencing and gating

t0 is the design gate and has no code dependency — it can start now. t1 and the
EEF fold (t4) sequence behind it; t2 needs t1; t3 needs t1; t4 needs t2. t0 is
the only workstream that is unconditionally ready; the rest are queued behind it.
A `beneficial` (not blocking) input is the EEF surface being live in the deployed
MCP — t4 folds the *generation* of c4/c5 regardless of deployment state.

## Quality gates

Per-cycle: the validation line in each todo plus the relevant local gates. Phase
and final validation use the canonical aggregate gate
([`../../../templates/components/quality-gates.md`](../../../templates/components/quality-gates.md));
`pnpm skills:check`, `pnpm test`, `pnpm type-check`, `pnpm lint`, and
`pnpm markdownlint:root` are the load-bearing gates for this work.

## Acceptance / proof contract

Proof levels by todo: **t0** non-code (decision record); **t1** unit; **t2**
integration; **t3** unit + integration; **t4** integration. Completion of a code
workstream requires all tests passing at every level for that workstream; the
plan is complete when at least one curriculum-assistance capability is reachable
through the MCP app from a generated `SKILL.md` source, the EEF c4/c5 surfaces are
generated (t4), and `pnpm skills:check` is green and deterministic.

## Non-goals

- **Do not start a code workstream before t0 lands** — the spike is the gate.
- **Do not resolve packaging/host decisions** beyond what t0 needs — those stay
  framed in the synthesis plan.
- **Do not edit `oak-skills`** — Direction B is owned by the plan in that repo;
  the EEF-referencing content change is the separate upstream request
  [`../../../upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md`](../../../upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md).
- **Do not duplicate** the synthesis plan's framing, the ADR-189 taxonomy, or the
  discovery parent's layer map. Reference them.
- **Do not conflate distribution with content.** This plan generates MCP *forms*;
  the EEF *content* referencing is the upstream request above.

## Risks and unknowns

| Risk / unknown | Impact | Mitigation |
|---|---|---|
| Building before t0 decides the form | Wrong abstraction; wasted work | t0 design gate blocks all code workstreams |
| Remote ingest breaks determinism | `pnpm skills:check` flaps | t3 pins source by SHA + computedHash; build local/manifest emitter first |
| Re-surfacing ingested content without attribution | Licence/attribution breach | t0 decision #5 resolved before any ingest emitter ships |
| Smuggling a downstream assumption (topology/host) back in | The frame error the synthesis plan corrects | t0 records verdicts explicitly; synthesis plan owns the cross-cutting frame |
| Platform facts drift (MCP form vendor specifics) | Vendor specifics go stale | Verified-facts block dated; re-verify at t0 |

## Foundation alignment

`principles.md` (replace-don't-bridge, no special cases, YAGNI),
`schema-first-execution.md` (generator is the source of truth; surfaces are
generated), `testing-strategy.md` (TDD cycle-pairs as the unit of landing),
ADR-189 (audience-led taxonomy), ADR-125 (artefact portability), ADR-191
(deterministic data; agent reasons), PDR-051 (vendor-agnostic skills
standardisation), the metacognition directive (structural cure over doc-patch),
and `closed-shape-design-optionality`.

## Plan-body first-principles check

Fires per [`../../../../rules/plan-body-first-principles-check.md`](../../../../rules/plan-body-first-principles-check.md):
**shape** — `current/` executable is correct now that the owner has chosen to
queue this work; the genuine design unknowns are contained in t0 (a non-code
spike) rather than fabricated into code cycles. **landing-path** — t0 lands a
decision record; each code todo is a TDD cycle ending green. **vendor-literal** —
the verified-facts block was grounded first-hand 2026-06-08; MCP-form vendor
specifics are re-verified at t0.

## Readiness reviewers

Dispatch `assumptions-expert` on the t0 spike scope (the design gate) before any
code workstream starts; dispatch `mcp-expert` once the t0 form mapping is drafted
(MCP resource/prompt/tool surface design) and `type-expert` on the t1 closed
union if the discriminated-union shape proves non-trivial.

## Learning loop and lifecycle triggers

On completion: run `oak-consolidate-docs`; route any durable doctrine (the
generated-MCP-surface pattern, the sourceType union contract) to its permanent
home. Lifecycle triggers per
[`../../../templates/components/lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md).

## Cross-references (authoritative homes — do not duplicate)

- Synthesis (same-dir sibling): [`external-facing-capability-distribution.plan.md`](external-facing-capability-distribution.plan.md)
- Seed review: [`../external-facing-skills-and-mcp-surfaces-review.report.md`](../external-facing-skills-and-mcp-surfaces-review.report.md)
- EEF upstream request (content, distinct from this distribution work): [`../../../upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md`](../../../upstream-feature-requests/oak-skills/reference-eef-evidence-once-live.md)
- Direction B (other repo): `oaknational/oak-skills` → `.agent/plans/public-distribution.plan.md`
