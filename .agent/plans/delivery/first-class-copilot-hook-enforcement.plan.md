---
id: first-class-copilot-hook-enforcement
node_type: delivery
name: First-class Copilot hook enforcement
overview: "Evaluate Oak's canonical hook policy once for each supported agent platform and return that platform's native decision."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-07-24
ratified_where: collaboration event 9d305a22-b318-4678-a39b-b5eae6cb736d
serves: first-class-copilot-agent-participation
impact_areas:
  - practice-and-estate
tickets:
  - MCP-150
depends_on: []
owner_gates: []
last_updated: 2026-07-24
---

# First-class Copilot hook enforcement

## Goal

A valid request from a supported Claude, Copilot, or Codex version reaches
Oak's canonical hook policy through its own platform contract, and an invalid
or ambiguous request fails closed at the boundary with a truthful schema error.
Copilot and Codex gain native enforcement without changing Claude's observable
behaviour.

## Mechanism

The dispatcher parses JSON once. An explicit activation context validates only
the selected platform's closed schema. A genuinely shared compatibility
activation runs exactly-one arbitration over a bounded candidate set and fails
closed on zero or multiple matches; unrelated adapters are never consulted.
The selected adapter normalises its native single-call or batch form into one
canonical event containing canonical commands and content changes. Copilot
patch documents remain patch documents until the canonical normaliser has
derived their changes.

The current Bash and content guard paths do not yet share one evaluator.
Delivery extracts a platform-free
`evaluatePolicy(canonicalEvent, policySnapshot, dependencies)` boundary that
returns a `CanonicalDecision`. One policy snapshot is loaded and that evaluator
is called once for each valid originating request; only renderers construct
host responses.

Configuration for Claude, GitHub, and Codex points to the central dispatcher
with explicit activation context. For Copilot, native `.github` `preToolUse` is
the sole authoritative evaluation source. The dispatcher classifies the
inherited `.claude` compatibility shape as non-authoritative and returns its
host-valid pass-through without loading policy or calling the evaluator. This
static ownership rule, rather than request-fingerprint guessing, remains safe
only for a tested Copilot version floor where native activation is present.
The Copilot slice does not wire activation until its capability probe proves
that boundary; if the installed host cannot support it, the slice returns for
re-shaping rather than landing a bypass.

GitHub's first-party hook surfaces provide activation and decision transport,
but no first-party component projects Oak's policy into those contracts. The
repository therefore owns only the strict adapters, dispatcher, and validators
around the existing canonical policy core. This is the smallest build shape
that preserves native platform behavior without introducing another policy
home.

The plan-body first-principles check fires at the protocol boundary: platform
literals stay in adapters and renderers, the canonical evaluator remains
platform-free, and the landing path separates the pure protocol from activation
wiring so each review has one story.

## Acceptance criteria (each with a proof — required)

- **Explicit dispatch validates only its selected closed schema; shared
  compatibility dispatch accepts exactly one bounded candidate, with zero or
  multiple matches failing closed.** Proof: `repo-safe` — schema unit tests
  cover valid Claude, Copilot, and Codex events, unknown fields, malformed
  serialised arguments, zero matches, an intentionally overlapping fixture,
  and trap adapters proving unselected schemas are never invoked.
- **Claude's existing Bash and Edit/Write behavior is unchanged for wrapped
  and flattened inputs.** Proof: `repo-safe` — the current hook-policy unit and
  integration suites remain unchanged in their observable allow, deny, error,
  and output assertions, with regression fixtures at the new boundary.
- **Copilot batches and patch documents become faithful canonical commands and
  content changes.** Proof: `repo-safe` — fixture tests cover multi-call
  batches, `create` arguments, patch-document `apply_patch` arguments, call
  identifiers, ordering, and one denied member among allowed members.
- **Codex native tool input reaches the same canonical policy as new scope,
  without adopting Claude or Copilot output semantics.** Proof: `repo-safe` —
  versioned fixtures derived from OpenAI's official Hooks `PreToolUse` contract
  parse, normalise, and render a schema-valid Codex decision; a capability probe
  and tested version floor guard tracked activation.
- **The canonical evaluator and policy loader each run exactly once per valid
  originating request.** Proof: `repo-safe` — integration tests inject counting
  evaluator and loader boundaries across single and batched inputs, while the
  routing validator proves every tracked activation enters through the central
  dispatcher.
- **Copilot's inherited Claude activation and native GitHub activation do not
  double-evaluate a request.** Proof: `repo-safe` — coexistence integration
  tests launch both activation sources as separate processes, prove native
  GitHub is the sole evaluator and inherited compatibility does not load policy,
  and the extended `pretooluse-guard-routing` validator rejects direct,
  duplicate, or authority-free guard wiring.
- **Every activated host has a tested supported-version floor and capability
  probe for the relied-upon input, output, and activation surfaces.** Proof:
  `repo-safe` — fixture-locus metadata, version-matrix tests, and operator-facing
  probe output distinguish supported, unsupported, and documentation-skewed
  builds before tracked activation is enabled.
- **A real Copilot session can perform an allowed create and patch, receives a
  native deny for a policy violation, and records exactly one evaluation for
  each request.** Proof: `owner-held` — Forge rides Brimstone assigns a live
  Copilot seat to verify correlated request identifiers and count-bearing
  dispatcher/evaluator records, then records the result on the MCP-150
  coordination event and the Copilot implementation pull request.

## Todos

- **Claude vertical-baseline PR (round budget: at most two review rounds).**
  Extract the one-snapshot canonical evaluator and dispatcher, migrate Claude
  completely through its closed adapter and renderer, remove the superseded
  runner composition, and prove no observable behaviour changed.
- **Copilot vertical PR (round budget: at most two review rounds).** Add the
  native and inherited-compatibility adapters, native renderer, supported-floor
  probe, sole-authoritative activation rule, routing validation, and live
  Copilot acceptance as one complete landing.
- **Codex vertical PR (round budget: at most two review rounds).** Add the
  versioned official fixture locus, closed adapter, native renderer, supported
  floor and capability probe, tracked activation, routing validation, and
  end-to-end acceptance as one complete landing.
- **Truth reconciliation PR, only if evidence changes the ratified contract
  (round budget: at most two review rounds).** Apply evidence-backed corrections
  to the capability matrix, operator documentation, and plan before archival;
  do not open this slice for narration-only changes.

## Out of scope

- Copilot session identity and `sessionStart` context injection; they are a
  separate delivery step under the strategic node.
- Native Copilot custom-agent generation, instruction projections, and skill
  changes; existing `.agents/skills` support remains the source.
- Event-driven communications wake and watcher lifecycle; those require their
  own delivery proof.
- A Copilot plugin or a second policy implementation; neither is needed for one
  repository and both would duplicate the canonical Practice.
- New policy rules or changed blocked-pattern content; this step changes
  transport and evaluation boundaries only.
