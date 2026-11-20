---
id: first-class-copilot-cli-policy-enforcement
node_type: delivery
name: First-class Copilot CLI policy enforcement
overview: "One inherited PreToolUse activation feeds one closed dispatcher: exactly-one schema match, one canonical policy evaluation, per-host rendering — no duplicate activation, no pass-through routes."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-25
ratified_where: "MCP-150 ticket comment 'Owner ratification record — the durable, resolvable anchor for the restructured plan' (comment 2774bf0f-251a-4394-9091-4e8d0a989012 on https://linear.app/oaknational/issue/MCP-150/first-class-copilot-cli-hook-support-canonical-policy-core-and-native), recording the owner card answered in-session on 2026-07-25 by Jim Cresswell — ratified as restructured; Director-executes exception owner-named at the preceding card"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-150
depends_on: []
last_updated: 2026-07-25
---

# First-class Copilot CLI policy enforcement

## Dated notes

- 2026-07-25 (later) — RATIFIED at owner card (in-session, ~12:47Z): the
  owner_gates row cleared; status sketch → ratified. Execution is owner-routed
  to the sitting Director (Torch mends Residue, 3bb236) by named exception to
  route-don't-execute. Delivery order: Claude vertical-baseline PR first, then
  the Copilot CLI vertical PR. Fixture provenance is route-specific: the live
  capture armed in the primary guards the same morning (machine-local
  diagnostic scaffold; Buzzard's single-probe retry) recorded the Copilot CLI
  1.0.75 **string-form** `apply_patch` payload, and is evidence for that string
  route alone. The **batch** envelope's raw payload was deliberately not
  retained from the 2026-07-24 CLI 1.0.74 observation, so its fixture is a
  sanitised reconstruction of that observation rather than a retained capture;
  no delivery claim may state the batch route as proven against a live host
  until a fresh first-hand batch capture on a stated CLI version is recorded.
  Same card thread: the Codex third-host vertical is minted as MCP-158
  (backlog, gated on a fresh original-source capability probe — outside this
  node's scope).
- 2026-07-25 — Restructured by the Director (owner word, in advance of the
  takeover seat) after falsification verdict `7be139cf` (Buzzard hunts
  Flight, live Copilot CLI 1.0.75): the prior dual-route design — a separate
  native `.github` `preToolUse` activation as Copilot's evaluation authority
  plus the inherited Claude activation as a *neutral pass-through* — is
  deleted, not deferred. The falsification proved the inherited PascalCase
  activation from `.claude/settings.json` fires for Copilot CLI and reaches
  the guard (`apply_patch` on the PascalCase Edit route); one activation with
  exactly-one adapter arbitration is the sound shape, and a no-op
  pass-through route has no place on an enforcement surface. The prior
  ratification ("Implement the plan", relayed in event `444463f6`,
  2026-07-24) was shape-bound to the superseded design; status returns to
  sketch pending fresh owner ratification (the owner_gates row above).

## Goal

Local Copilot CLI writes are governed by the same canonical repository policy
as Claude writes, through the same single activation, with each host parsed
and answered through its own closed contract. A supported request receives
exactly one policy decision; an unrecognisable or unsupported request fails
closed with a truthful error.

## Mechanism

**One inherited PascalCase `PreToolUse` activation** — the observed live
route, proven to reach Copilot CLI 1.0.75 — feeds **one closed dispatcher**:

1. Closed exact input schemas per host envelope: the existing Claude shapes,
   the documented Copilot single-tool inputs (`create` → Write,
   `edit`/`str_replace_editor`/`apply_patch` → Edit), the observed Copilot CLI
   1.0.75 PascalCase compatibility envelope whose `tool_input` is a raw
   string-form `apply_patch` document, and the observed Copilot batch envelope.
2. **Exactly one schema must match**, or the dispatcher fails closed — never
   guess a platform.
3. One validated policy snapshot per valid request (one filesystem read and
   parse), one platform-free evaluation. Canonical decisions carry no host
   response shapes.
4. The decision renders through the **matched host's documented output
   contract**: the unchanged Claude result for Claude; the native top-level
   `permissionDecision` for Copilot, with every denial carrying a reason.
5. **No second activation, no pass-through, no attestation**: every
   recognised create/edit/str_replace_editor/apply_patch change is evaluated. A
   supported-version capability probe gates *claimed* Copilot support;
   unprobed or unsupported hosts fail closed with an unsupported-host error.
   (Harvested fact from the superseded draft, still binding as rationale:
   `.github/hooks/*.json` is additionally ruled out as an activation home
   because the Copilot cloud agent also loads it — CLI-only scope forbids
   that surface even if a second activation were ever reconsidered.)

This repository plan owns the failure contract; fixture provenance,
composition details, and versionable execution evidence land with the
implementation. MCP-150 is the supplementary Linear projection for execution
state, sensitive details, and evidence that cannot be versioned safely:

| Route or failure | Required result |
| --- | --- |
| Inherited activation, valid Claude envelope | Load one snapshot, evaluate once, render the unchanged Claude result |
| Inherited activation, valid documented Copilot single-tool envelope (`create`, `edit`, `str_replace_editor`, or `apply_patch`) | Load one snapshot, evaluate once, render the native top-level decision (deny carries a reason) |
| Inherited activation, observed Copilot CLI 1.0.75 PascalCase string-form `apply_patch` envelope | Parse as Copilot, evaluate every patch change once, render the native top-level decision |
| Inherited activation, observed Copilot batch envelope | Every recognised change evaluated exactly once; one native response for the batch |
| Zero or multiple schema matches | Fail closed; never guess a platform |
| Malformed matched input or renderer failure | Fail closed with the matched host's boundary error when the hook completes before timeout |
| Missing built runtime | Preserve the current loud fail-open bootstrap contract; support is not claimed until the build/probe passes |
| Present but broken built runtime | Fail closed |
| Unsupported or unprobed Copilot CLI version | Fail closed with an unsupported-host error |
| Host-enforced timeout | Host fails open; zero completed evaluations is permitted and must be reported |

## Acceptance criteria (each with a proof)

- **The Claude baseline preserves every existing observable allow, deny,
  error, and output behaviour while reading and parsing one policy snapshot
  per request.** Proof: `repo-safe` — unchanged regression expectations plus
  injected-dependency unit and integration tests for both existing Claude
  envelope shapes.
- **Canonical decisions contain no host response shapes; the production
  dispatcher carries exactly two thin adapters (Claude, Copilot CLI); bounded
  arbitration is proven with synthetic adapters.** Proof: `repo-safe` —
  compiler/type-checking, boundary tests, and structural dependency
  validation.
- **Documented Copilot single-tool inputs are parsed faithfully and rendered
  through the native decision schema.** Proof: `repo-safe` — versioned
  literal fixtures and closed-schema unit tests covering `create`, `edit`,
  `str_replace_editor`, and `apply_patch`, plus malformed, unknown, and
  renderer-failure inputs. The tool-name set is pinned to GitHub's hooks
  reference, verified 2026-07-25, where the inherited PascalCase `Edit`
  matcher maps all three edit runtimes (`edit`, `str_replace_editor`,
  `apply_patch`).
- **The observed Copilot CLI 1.0.75 PascalCase envelope with raw string-form
  `apply_patch` input is a first-class Copilot route, not misclassified as a
  Claude edit.** Proof: `repo-safe` — the retained literal fixture, multi-file
  patch tests, matched-adapter assertion, and native-renderer expectation.
- **The observed Copilot batch envelope is a first-class evaluated route:
  every recognised change in the batch is evaluated, one native response is
  returned, and no pass-through path exists.** Proof: `repo-safe` — the
  observed batch fixture plus trap dependencies proving no route can skip
  the evaluator.
- **Each successfully dispatched write request produces exactly one policy
  evaluation.** Proof: `repo-safe` — deterministic injected routing/count
  tests plus the pre-tool-use routing validator; a separately classified
  smoke/system harness proves real-process behaviour.
- **The host timeout is recorded as a fail-open ceiling, not as proof that
  every request was evaluated.** Proof: `repo-safe` — timeout-path tests and
  operator documentation use that exact contract without wall-clock ceilings
  in Vitest.
- **Fresh-checkout activation preserves the documented missing-versus-broken
  runtime distinction.** Proof: `repo-safe` — a smoke/system harness proves a
  loud fail-open with missing build output, enforcement after build, and
  fail-closed behaviour for a present but broken runtime.
- **Unsupported, below-floor, malformed, or otherwise unprobed Copilot
  versions fail closed before policy evaluation.** Proof: `repo-safe` —
  capability-probe unit and integration fixtures cover absent version
  metadata, a below-floor version, malformed probe output, and a supported
  version missing a required route; each returns the unsupported-host error
  with zero policy evaluations.
- **A real local Copilot CLI session performs an allowed create and patch,
  receives a native denial with a reason for a policy violation, and observes
  a forced timeout that may complete zero evaluations — with correlated
  request identifiers and count-bearing dispatcher/evaluator evidence proving
  exactly one evaluation per request.** Proof: `owner-held` — the owner runs
  or observes the local Copilot CLI acceptance seat and records correlated
  evidence on MCP-150 and the implementation pull request.

## Todos

- **Claude vertical-baseline PR (round budget: at most two review rounds).**
  Two atomic green TDD commits: validated snapshot/platform-free evaluation
  first, routing both current Claude runners through it; then the closed
  Claude adapter, renderer, bounded dispatcher, and one composition root,
  with every activation migrated, superseded runners deleted, and every
  structural consumer updated in that landing.
- **Copilot CLI vertical PR (round budget: at most two review rounds).** The
  thin Copilot adapter (documented single-tool + observed batch schemas),
  native renderer, supported-version capability probe, routing validation,
  clean-checkout system harness, and the live CLI acceptance — delivered by
  **preserving and refactoring the existing tested implementation in place**
  (closed schemas, fail-closed arbitration, and gate-green proofs are
  harvest, never rewrite).

## Out of scope

- Codex policy adapters or activation; they are not part of Copilot CLI
  citizenship.
- GitHub Copilot coding-agent or cloud execution — deleted scope by owner
  correction (2026-07-24), not deferred.
- New policy rules, weakened denials, bypass switches, or a second policy
  implementation.
- Copilot CLI identity, Practice projections, and communications; their own
  delivery nodes hold those proofs. (The identity node's bootstrap launcher
  is untouched by falsification `7be139cf`, which speaks only to enforcement
  activation.)
