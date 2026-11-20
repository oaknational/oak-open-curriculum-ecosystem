---
id: copilot-cli-practice-projections
node_type: delivery
name: Copilot CLI Practice projections
overview: "Project canonical instructions, skills, specialist agents, and repository MCP tools onto supported Copilot CLI surfaces without creating another authority."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-24
ratified_where: "PR #529 owner ratification record: https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/529#issuecomment-5079688100"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-155
depends_on:
  - plan: copilot-cli-identity-and-practice-join
    kind: beneficial
last_updated: 2026-07-25
---

# Copilot CLI Practice projections

## Dated notes

- **2026-07-25** — Corrected current vendor precedence and `excludeAgent`
  arity/residual exposure; added supported-version and fresh-checkout gates
  for instruction, skill, specialist-agent, and MCP projections; made
  `disable-model-invocation: true` the cloud-safe specialist default; and
  clarified that the direct `AGENT.md` root import intentionally gives local
  and cloud Copilot the same canonical rule set as every other agent.
  Path-scoped dispositions govern supplemental contextual projections, never
  rule inclusion. This preserves parity of behaviour and abilities across
  vendors wherever the host exposes an equivalent mechanism; only evidenced
  platform limits justify divergence. The cloud out-of-scope statement is
  narrowed so shared repository projections require explicit cloud-safe
  dispositions while cloud feature delivery remains excluded. These amendments
  make the original projection outcome executable against current platform
  facts without adding a new projected capability family.

## Goal

A clean local Copilot CLI checkout discovers the repository's canonical
instructions, existing skills, specialist agents, and MCP tools through
supported first-party paths, with deterministic proof that every projection is
current and thin.

## Mechanism

Keep canonical content in `.agent/`. Bring the repo-wide Copilot instruction
entry point under validated ownership as a direct import of `AGENT.md`, so
local Copilot CLI and Copilot cloud agent load the same canonical rule set as
every other agent. Generate path-scoped instruction projections only as
supplemental contextual activation, never as a filter over which rules apply.
Preserve parity of behaviour and abilities across vendors wherever Copilot
supports the corresponding mechanism. Continue using `.agents/skills` as the
repository's chosen skill home, and generate a tracked repository MCP
projection from a new secret-free canonical server manifest.

Three total disposition manifests make the source sets recomputable:

1. Every live `.agent/rules/*.md` source is classified `repo-wide`,
   `path-projected`, or `excluded` with a reason, and every emitted instruction
   is separately classified `cloud-shared` or `cloud-excluded`. Those two
   labels record the intended disposition and the marker it emits; neither
   asserts a proven platform outcome. All rules remain reachable through the
   root `AGENT.md` import. Here `path-projected` means an additional
   file-scoped contextual copy is emitted, and `excluded` means no additional
   modular copy is emitted — neither label removes the canonical rule from
   Copilot. A path projection is selected only when file-scoped activation is
   expressible through Copilot `applyTo` and the contextual reinforcement is
   worth its duplication cost. A `cloud-excluded` instruction must
   emit the documented `excludeAgent: "cloud-agent"` frontmatter.
   Provenance: GitHub's repository custom-instructions documentation, verified
   first-hand 2026-07-25, defines `excludeAgent` as taking exactly one value,
   either `"code-review"` or `"cloud-agent"`, with no array, comma-separated,
   or repeated-key form. So `cloud-agent` is the correct literal for excluding
   the Copilot cloud agent and must not be "corrected" to another spelling,
   and `"code-review"` is the separate value that excludes Copilot code review.
   Because only one value may be set, one surface always stays in scope: a file
   carrying `excludeAgent: "cloud-agent"` is still read by Copilot code review.
   That residual exposure is a dated fact about the platform, not a defect in
   our generator. These labels govern only whether the supplemental modular
   copy reaches a cloud surface; they do not exclude any canonical rule or
   behaviour already supplied by the root `AGENT.md` import. No canonical rule
   is cloud-excluded under the parity contract. Content that genuinely must not
   reach a Copilot surface cannot enter that canonical root rule corpus and
   requires a separately designed mechanism. This capability claim is pinned
   to the 2026-07-25 documentation and expires — a later reader re-checks
   GitHub's current documentation rather than trusting this line.
2. Every live, non-archived `.agent/sub-agents/templates/*.md` specialist is
   classified `projected` or `excluded` with a reason.
3. Every server found in tracked platform MCP configuration is reconciled into
   or explicitly excluded from the new canonical manifest. No platform adapter,
   including `.cursor/mcp.json`, becomes authority by inheritance.

Platform metadata adapts invocation; it does not copy doctrine.

The minimum shippable shape without the beneficial identity node is
deterministic generation, validation, and live discovery under the host's
native session identity. The identity node improves acceptance-seat
attribution but supplies no required projection primitive.

This repository plan owns the projection contract; versioned mappings and
generated-file manifests land with the implementation. MCP-155 is the
supplementary Linear projection for execution state, sensitive details, and
evidence that cannot be versioned safely.
Every relied-upon Copilot surface is activated only after a tested version
floor and live capability probe for that surface; documentation is evidence
for the probe design, not proof about the installed CLI.

## Acceptance criteria (each with a proof)

- **The repo-wide entry point imports `AGENT.md` and reaches the full canonical
  rule inventory for both local and cloud Copilot, while supplemental
  path-scoped projections never change rule inclusion.** Proof: `repo-safe` —
  root-import and rule-inventory parity tests compare Copilot with the
  canonical rule index; manifest-totality tests prove every modular projection
  is supplemental, require schema-valid `applyTo`, positive/negative matching,
  `**` and `**/*` recursion, comma-separated patterns, no `@` imports in
  modular files, and detect contradictory duplicate projections.
- **Copilot retains behavioural and capability parity with the other supported
  agents wherever its platform exposes the corresponding mechanism.** Proof:
  `repo-safe` — the parity matrix maps each canonical rule, skill, specialist,
  hook, and MCP capability to its Copilot projection or to an evidenced
  platform limitation; unexplained vendor-specific omissions fail validation.
- **Skill discovery uses Copilot CLI's documented precedence
  `.github/skills` then `.agents/skills` then `.claude/skills`, first-found
  wins, while this repository keeps `.agents/skills` as its only chosen
  Copilot skill home.** Proof: `repo-safe` — precedence fixtures and
  stale-output validation; no `.github/skills` duplicate is emitted.
- **Every live non-archived canonical specialist is projected or explicitly
  excluded, and each projection has mapped tool aliases and inherited model
  selection.** Proof: `repo-safe` — disposition-totality, generator, schema,
  forward-coverage, reverse-orphan, and same-ID coexistence tests prove
  `.github/agents` intentionally wins over `.claude/agents`. Because this
  surface is also visible to Copilot cloud, every projection must be
  cloud-safe and emit `disable-model-invocation: true` unless automatic cloud
  selection is separately accepted.
- **A clean checkout exposes the intended repository MCP tools without tracked
  secrets or machine-local paths.** Proof: `repo-safe` — canonical
  server-manifest totality over tracked candidates, deterministic projection
  tests, secret/path validators, and fresh-checkout integration.
- **Instruction projections do not land until a supported-version clean CLI
  loads the repo-wide file and one positive path match while excluding one
  negative path match.** Proof: `repo-safe` — version and discovery fixtures
  plus manifest totality; `owner-held` — the pre-landing local CLI probe. A
  failed or unsupported probe leaves the generated projection untracked.
- **Cloud-exclusion of a supplemental modular copy is emitted correctly, and
  is not confused with exclusion of canonical behaviour supplied through the
  root import.** The locally-provable half is metadata correctness: every
  modular projection classified `cloud-excluded` emits the exclusion marker
  its surface defines. Proof: `repo-safe` — disposition and manifest-totality
  fixtures. The other half — that the modular duplicate does not reach a
  cloud-agent prompt — is a claim about a different execution environment, and
  no local fixture or local CLI probe can establish it.
  Proof: `owner-held` — a cloud-agent probe observing whether an excluded
  fixture appears in a cloud job's context. That probe's claim is bounded to
  the cloud agent alone. Because `excludeAgent` takes exactly one value
  (documentation verified 2026-07-25), a projection carrying `"cloud-agent"` is
  still read by Copilot code review, so an owner-held probe of the cloud agent
  establishes cloud-agent exclusion and nothing wider; establishing anything
  about the code-review surface needs a separate probe with `"code-review"` set
  instead, and the two cannot hold at once. No probe of either surface can
  therefore establish local-only. Regardless of that probe, the canonical rule
  and its behaviour remain available through `AGENT.md`; the marker controls
  only the extra path-scoped copy. Until the cloud-agent probe runs, the
  repository states modular-copy exclusion as emitted-and-unverified, never as
  proven.
- **Skill support is not promoted beyond `Partial` until a supported-version
  clean CLI reports the intended `.agents/skills` source and invokes a
  representative same-ID skill without `.claude/skills` shadowing it.** Proof:
  `repo-safe` — precedence fixtures; `owner-held` — discovery and invocation
  transcript. Failure blocks the support claim and any new skill projection.
- **Generated `.github/agents` do not land until a supported-version clean CLI
  discovers and manually invokes a schema-valid representative carrying
  `disable-model-invocation: true`.** Proof: `repo-safe` — schema, disposition,
  and cloud-safety fixtures; `owner-held` — local discovery/invocation probe.
  Failure leaves the generated family untracked.
- **The repository MCP projection does not land until a supported-version
  clean CLI discovers the intended secret-free server and tools and completes
  one representative call.** Proof: `repo-safe` — manifest, secret/path, and
  unsupported-version fixtures; `owner-held` — discovery/call transcript.
  Failure leaves the projection untracked and the server local.
- **A real supported-version local Copilot CLI session proves the repo-wide
  instruction entry point, one positive and one negative `applyTo` projection,
  and discovers and invokes one representative skill, specialist agent, and
  repository MCP tool.** Proof: `owner-held` — the owner runs or observes the
  local Copilot CLI seat and records acceptance evidence on MCP-155 and the
  implementation pull requests.

## Todos

- **Instructions-and-skills PR (round budget: at most two review rounds).**
  Correct the repo entry point, add bounded instruction projections, and prove
  discovery precedence without a third skill adapter tree.
- **Specialist-agents PR (round budget: at most two review rounds).** Generate,
  validate, and exercise the native Copilot CLI agent family.
- **Repository-MCP-tools PR (round budget: at most two review rounds).**
  Establish the canonical secret-free server manifest with total dispositions,
  then generate and validate the tracked repository MCP projection.

## Out of scope

- A Copilot plugin, empty speculative settings, or hand-maintained parity
  files.
- Claude-style `Skill(...)` permissions or settings semantics on Copilot CLI.
- GitHub Copilot coding-agent or cloud feature delivery. Shared repository
  projections still require explicit cloud-safe dispositions.
- Unrelated Codex adapter work.
