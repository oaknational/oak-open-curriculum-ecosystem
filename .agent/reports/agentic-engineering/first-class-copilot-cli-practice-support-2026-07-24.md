# First-class Copilot CLI Practice support

- **Date:** 2026-07-24
- **Scope:** GitHub Copilot CLI running locally in this repository
- **Status:** Evidence and target architecture ratified; runtime delivery has
  not yet landed
- **Controlling plan:**
  [First-class Copilot CLI Practice citizenship](../../plans/strategic/first-class-copilot-cli-practice-citizenship.plan.md)
- **Delivery tickets:** MCP-150, MCP-154, MCP-155, MCP-156

## Evidence labels

- **[V]** — directly observed in the local Copilot CLI design session.
- **[D]** — documented by GitHub in the official sources below.
- **[R]** — verified in repository source or doctrine.
- **[I]** — a design judgement derived from the preceding evidence.

## Executive verdict

The repository should make **local Copilot CLI** an equal first-class citizen
of its existing Practice and agentic tools **[I]**. Equal does not mean
pretending every host has identical files. It means that a Copilot CLI session
can achieve the same behavioural outcomes through supported native surfaces:
honest identity, deliberate team membership, canonical capabilities,
bidirectional communications, policy enforcement, lifecycle, and proof.

The repository already owns the durable substance under `.agent/` and the
portable skill projection under `.agents/skills/` **[R]**. The missing work is
a thin local-CLI-only adapter composition plus Copilot-aware boundaries in
canonical tooling. It is not a new Practice, a plugin, a remote service, or a
second policy implementation **[I]**.

This report is intentionally limited to the CLI process running locally,
alongside local Claude and Codex seats. GitHub Copilot coding-agent/cloud
execution, hosted bridges, cross-machine routing, and a separate Codex delivery
programme are outside the ratified scope.

## What first-class means

| Layer | Observable bar | Current repository state | Delivery |
| --- | --- | --- | --- |
| Identity | Stable, model-visible identity with truthful Copilot provenance | Canonical identity types do not yet admit Copilot **[R]** | MCP-154 |
| Deliberate membership | Native startup is useful alone; `oak-start-right-team` explicitly joins claims, heartbeat, watcher, and lifecycle | No Copilot bootstrap/join projection exists **[R]** | MCP-154 |
| Canonical capability | Instructions, skills, specialist agents, and MCP tools reach the CLI without a second authority | Repo-wide pointer and portable skills exist; other GitHub projections are absent **[R]** | MCP-155 |
| Policy | Valid writes receive one canonical decision through Copilot's real input/output contract | Inherited Claude parsing blocks valid Copilot writes **[V][R]** | MCP-150 |
| Communications | Directed/broadcast send, wake, drain recovery, handoff, and retirement work on the local shared substrate | The substrate exists; no Copilot notification/lifecycle projection is wired **[R]** | MCP-156 |
| Proof | Fresh-checkout validators and a live CLI run demonstrate the whole journey | No end-to-end Copilot CLI acceptance record exists **[R]** | All four |

The table separates **target** from **wired state**. Ratification authorises the
target; it does not turn missing runtime paths green.

## Findings

### 1. Honest identity has a native seed

The observed local process exposed Copilot-specific environment signals,
including a stable session UUID, but the public contract for model-visible
identity is the `sessionStart` hook input's `sessionId` **[V][D]**. The
repository's existing UUID-v5 identity pipeline can consume that signal; it
does not need a Copilot-specific naming algorithm **[R][I]**.

The native session-start adapter should return Copilot CLI's documented
`additionalContext` shape **[D]**. A Claude hook response wrapped in
`hookSpecificOutput` is not a valid substitute for that Copilot-native output
**[R][I]**. Shell-only environment variables may assist a version-tested
launcher, but they must not be relabelled as Codex or Claude provenance and
must not become the only identity source **[I]**.

### 2. Native bootstrap and team join are different acts

Every Copilot CLI session in the repository should receive enough context to be
useful and honest **[I]**. That does not authorise every session to mutate
shared coordination state. The existing `oak-start-right-team` contract is the
deliberate join: it opens claims, starts heartbeats and the all-channel watcher,
and registers lifecycle state **[R]**.

The launcher therefore bootstraps repository and identity context only.
Joined/non-joined behaviour must be proved with negative as well as positive
integration tests **[I]**.

### 3. The inherited cross-tool hook path blocks valid writes

Copilot CLI 1.0.74 was observed sending a batched pre-tool-use envelope with
`sessionId`, `cwd`, and `toolCalls[]`; each call carried `id`, `name`, and
serialised `args` **[V]**. This was the **inherited Claude-compatibility
activation**, not GitHub's documented native hook contract. The inherited
Claude Edit matcher fired for Copilot `create` and `apply_patch` calls **[V]**.

The repository parser expects Claude-style `tool_input`/`toolInput` or
top-level content fields **[R]**. It could not extract writable content from
the Copilot batch, returned the fail-closed error path, and Copilot correctly
denied the write **[V][R]**. The policy itself did not reject the content; its
platform boundary could not represent the request **[I]**.

The cure has two explicit routes, not one permissive Copilot schema **[I]**:

- the documented native GitHub single-tool envelope (`toolName`/`toolArgs`) is
  the evaluator contract, is activated through the CLI-only inline hooks block
  in `.github/copilot/settings.json`, and renders a native decision **[D]**;
- the version-pinned inherited batch is compatibility-defect evidence and
  returns a neutral pass-through with zero policy loads or evaluations only
  after a conjunctive environment/schema/session/native-attestation
  discriminator succeeds.

The observed batch and patch-document semantics remain intact in their fixture;
they are never approximated as Claude edit pairs or elevated into architectural
authority **[I]**. The raw live payload was inspected but deliberately not
retained because tool arguments can contain caller content. It is therefore an
unretained observation until delivery replaces it with a sanitised literal
fixture and a reproducible probe record.

### 4. Canonical policy needs a platform-free centre

MCP-150 first extracts one validated policy snapshot and one platform-free
evaluator while keeping production wiring Claude-only **[I]**. Only after that
baseline lands does the Copilot CLI vertical add its adapter, renderer, and
native activation.

This sequencing keeps the first code landing reviewable and protects current
Claude behaviour. Canonical decisions contain no host response shapes;
renderers alone construct Claude or Copilot outputs **[I]**. Synthetic adapters
exercise arbitration in baseline tests without planting dormant Copilot or
Codex production branches.

### 5. Native and inherited hook activation can coexist only with one authority

Copilot CLI reads selected Claude configuration. GitHub's current reference
also makes an important scope distinction: `.github/hooks/*.json` is loaded by
both local CLI and cloud agent, whereas the inline hooks block in
`.github/copilot/settings.json` is a CLI source and cloud agent does not load
repository settings **[D]**. The local-only activation must therefore be
inline settings; a `.github/hooks` projection would violate the ratified scope
even if its script later tried to self-filter **[I]**.

For a tested supported version, inline native GitHub `preToolUse` is the sole
Copilot CLI evaluator. The inherited `.claude` wrapper selects a neutral
compatibility route only when all of these agree: observed
`COPILOT_CLI=1`; a probe-approved observed binary version; a valid observed
`COPILOT_AGENT_SESSION_ID`; the exact versioned inherited-batch schema with a
matching `sessionId`; and a current local attestation written by the CLI-only
native `sessionStart` hook for that session, repository, version, and
configuration hash **[V][I]**. These environment variables are undocumented
observations, not standalone authority. Any partial marker, mismatch, missing
attestation, or malformed batch fails closed. With no Copilot marker, the
genuine Claude route still parses and evaluates Claude input **[I]**.

Native `sessionEnd` removes the ephemeral attestation; bounded TTL cleanup
covers abnormal exits. Tests inject environment and attestation-store
interfaces so a caller cannot spoof one ambient value to disable Claude
enforcement **[I]**.

The exact-once claim applies to **successfully dispatched** requests. GitHub's
hook timeout is a host fail-open ceiling: a timed-out hook may not have
completed an evaluation, so timeout cannot be advertised as exact-once proof
**[D][I]**.

### 6. Skills already have a suitable repository home

GitHub documents Copilot CLI skill discovery in this precedence order:
`.github/skills`, `.agents/skills`, then `.claude/skills`, with the first
matching skill taking precedence **[D]**. The repository already generates
canonical thin wrappers under `.agents/skills/` **[R]**.

The correct delivery is therefore to test and document that precedence while
keeping `.agents/skills/` as this repository's chosen Copilot skill home.
Generating duplicate `.github/skills/` wrappers would create a third adapter
surface and a new drift opportunity without adding capability **[I]**.

### 7. Instructions need supported, local-only projections

GitHub documents direct Copilot CLI discovery of root `AGENTS.md` and optional
additional instruction directories through
`COPILOT_CUSTOM_INSTRUCTIONS_DIRS` **[D]**. Those surfaces are sufficient
without changing `.github/copilot-instructions.md` or emitting
`.github/instructions`, which are shared with other Copilot products **[D][I]**.

The root `AGENTS.md` remains the repository-wide entry point. Path-specific
files generate from a total disposition manifest into gitignored
`.agent/runtime/copilot/instructions/`, and the deliberate launcher alone adds
that directory to the local process environment. Each rule is classified
repo-wide, local-path-projected, or excluded with a reason. Local projections
require valid `applyTo` metadata and tests for positive, negative, recursive,
comma-separated, simultaneous-match, environment-scope, and stale-output
behaviour. They must not copy the full rule corpus or use `@` imports, which
GitHub does not expand inside modular instruction bodies **[D][I]**.

The existing `.github/copilot-instructions.md` is a pre-existing shared file
and remains unchanged in this programme. Its current Markdown link is not
counted as local CLI acceptance evidence **[R][I]**.

### 8. Custom agents need generated local installation

GitHub documents `.github/agents/*.agent.md` for both GitHub.com and Copilot
CLI, so that repository path cannot satisfy a strictly local-CLI-only
programme **[D]**. Copilot CLI also discovers user-level custom agents under
the resolved `COPILOT_HOME/agents` and supports agent frontmatter, tool
selection, MCP selection, and model inheritance **[D]**.

The target is deterministic generation from a total disposition manifest over
every live non-archived canonical specialist, with namespaced agent IDs,
Copilot tool aliases, and no unnecessary model pin. The local installer uses a
lock and an owned-entry manifest, atomically preserves every user-owned entry,
updates only Oak-owned files, and provides reversible cleanup. Forward
coverage, reverse-orphan checks, schema validation, collision tests, cleanup
proof, and live invocation make the family real without creating a cloud agent
surface **[D][I]**.

### 9. Session-scoped MCP tools require a canonical manifest first

Copilot CLI documents `--additional-mcp-config` as a session-only source with
higher priority than persistent or workspace configuration **[D]**.
Repository MCP files such as `.mcp.json` and `.github/mcp.json` are shared
workspace surfaces and are therefore excluded from this local-only programme
**[D][I]**. The repository has platform-specific MCP configuration but no
canonical secret-free server inventory **[R]**.

Delivery must first establish a canonical server manifest by reconciling every
server found in tracked platform configuration to an included or excluded
disposition. `.cursor/mcp.json` or another adapter must not silently become
authority. The local launcher then generates a deterministic, gitignored,
secret-free file and passes it as
`--additional-mcp-config=@<repo-runtime-path>` for that session. It never
rewrites user configuration, and credentials remain local **[D][I]**.

### 10. Local comms need no new transport

The Practice already has a local file-backed comms CLI with directed and
broadcast events, durable seen-file cursors, all-channel watch, heartbeat
exclusion, gap sweep, handoff, and retirement semantics **[R]**. Copilot CLI
therefore needs an adapter into the existing substrate, not an MCP bridge or
hosted broker **[I]**.

GitHub documents a CLI-only `notification` hook and a `shell_completed` event
that can return additional context **[D]**. Its activation belongs in the
CLI-only inline hooks block in `.github/copilot/settings.json`, not
`.github/hooks` **[D][I]**. A one-shot watcher can turn a newly received event
into that completion, wake the intended session, and then be re-armed
**[V][I]**. Turn-boundary drain and bounded periodic checks remain recovery,
not the primary transport.

The acceptance suite must prove burst handling, cursor advancement, ordering,
duplicate tolerance, re-arm gaps, peer liveness, and cleanup. A live local
Copilot CLI seat must then demonstrate wake, reply, handoff, and retirement.

### 11. Installed capability must be probed, not inferred from documentation

The design session observed documentation-versus-installed-version skew: a
documented CLI command was absent from Copilot CLI 1.0.74 **[V][D]**. Every
relied-upon hook, instruction, agent, skill, and MCP surface therefore needs a
tested version floor plus a capability probe before tracked or locally
materialised activation is enabled **[I]**.

The live acceptance seat remains required. Repository fixtures establish the
contract; only a real local CLI process proves that the installed host
dispatches and consumes it.

Tracked `.github/copilot/settings.json` cannot be conditionally absent per
collaborator. Its hook entries must therefore be inert runtime-gating shims, not
support claims. MCP-150's minimal launcher probes the installed binary and
required native events before starting a managed session; MCP-154 extends that
same launcher for identity/join, and MCP-155 then extends it for local
projections. Each shim also validates the actual version and event shape at
invocation. Unsupported policy input fails closed; unsupported identity and
wake input creates no context, attestation, watcher, or lifecycle state, and the
supported launcher refuses that managed mode **[I]**.

## Target architecture

1. **Canonical Practice:** `.agent/` remains the authority for doctrine,
   identity contracts, policy, agents, tools, and lifecycle.
2. **Existing portable skill surface:** `.agents/skills/` remains the chosen
   Copilot CLI skill home.
3. **Local-only adapter family:** `.github/copilot/settings.json` contains
   inline CLI hooks; root `AGENTS.md` and `.agents/skills/` are discovered
   directly; launcher-scoped ignored instructions, locally installed
   namespaced agents, and session-only MCP configuration cover remaining
   surfaces.
4. **Canonical MCP manifest:** a new secret-free server inventory is
   established from total dispositions over tracked platform candidates before
   any Copilot MCP projection is generated.
5. **Canonical runtime boundaries:** platform-free policy evaluation, identity,
   comms, and lifecycle remain in `agent-tools`; Copilot modules parse, render,
   probe, and compose.
6. **Deliberate membership:** native startup provides context; the team skill
   opts into shared coordination state.
7. **Executable truth:** stale-output validators, closed-schema tests,
   fresh-checkout tests, and a live local Copilot CLI acceptance record together
   establish support.

## Delivery order

1. **MCP-150:** Claude-only canonical policy baseline, then native Copilot CLI
   enforcement including the minimal launcher/preflight and non-model-visible
   session-attestation lifecycle needed to secure inherited routing.
2. **MCP-154:** one complete identity and deliberate-Practice-join vertical that
   extends MCP-150's launcher and composes model-visible identity into its
   established session-start activation without taking ownership of the
   attestation.
3. **MCP-155:** instructions/skills, locally installed specialist agents, then
   session-scoped MCP tools as separate PR-sized slices.
4. **MCP-156:** local wake/drain recovery, then lifecycle and live acceptance.
5. **Closure:** reconcile the target-versus-wired matrix and archive delivery
   plans only after every proof passes.

Runtime work remains gated behind the replacement record pull request that
lands this report, ADR amendment, matrix correction, and ratified plan estate.

## Evidence ceilings

- The observed Copilot CLI 1.0.74 inherited batch was inspected live but its raw
  caller-content-bearing payload was not retained. It establishes the defect;
  a sanitised fixture plus reproducible probe must replace it before delivery.
- Official documentation defines the native single-tool contract. Repository
  tests cannot prove the installed CLI dispatches or consumes it.
- A forced timeout is owner-held host evidence. Vitest may prove local handling
  but must not assert GitHub's wall-clock process-kill behaviour.
- No canonical MCP server manifest exists yet; MCP-155 must establish it before
  generating a Copilot projection.

## Assumptions and falsifiers

| Assumption | Falsifier | Required response |
| --- | --- | --- |
| Native `sessionStart` can deliver identity through `additionalContext`. | A supported CLI build fires the hook but the model receives no context. | Re-shape MCP-154 before activation. |
| Inline native GitHub pre-tool-use can be the sole local Copilot evaluator while the strictly attested inherited route is neutral. | The discriminator cannot require marker, version, schema, session match, and live native attestation together, or inherited activation still evaluates. | Do not land Copilot activation; return MCP-150 to design. |
| `.agents/skills/` supplies the required skill set under documented precedence. | Clean-checkout discovery misses or shadows a required skill. | Correct the projection/precedence contract; do not copy blindly. |
| Namespaced user-level agents can be installed without changing user-owned files or exposing a cloud agent profile. | Installation cannot be atomic, ownership cannot be proved, or cleanup would remove non-Oak files. | Keep agent projection unshipped and re-shape MCP-155. |
| One-shot watch to `shell_completed` provides a reliable wake edge. | Delivered events fail to wake, re-arm loses events, or unrelated sessions wake. | Keep comms delivery unshipped and re-shape MCP-156. |
| The session-only MCP projection can remain secret-free. | A required server cannot be described without credentials or a host path in the generated file. | Exclude that server and narrow the supported local set. |

## Explicit non-goals

- GitHub Copilot coding-agent or cloud support.
- Remote or cross-machine communications.
- A hosted bridge, plugin, task API, or separate Copilot Practice.
- A parallel Codex parity programme.
- Duplicate skill trees, hand-maintained agent copies, or empty speculative
  settings.
- `.github/hooks`, `.github/agents`, `.github/instructions`, `.mcp.json`, or
  `.github/mcp.json` delivery that would activate a hosted or non-CLI consumer.
- Weakened policy enforcement, timeout-as-success claims, or bypass switches.

## Official sources

- [Copilot hooks reference](https://docs.github.com/en/copilot/reference/hooks-reference)
- [Copilot CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference)
- [Copilot CLI configuration directory reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference)
- [Copilot CLI custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [Custom instructions support](https://docs.github.com/en/copilot/reference/custom-instructions-support)
- [Add repository custom instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions)
- [Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Create custom agents for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli)
