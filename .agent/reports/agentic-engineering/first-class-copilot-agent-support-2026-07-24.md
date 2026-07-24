# First-class GitHub Copilot agent support

**Date:** 2026-07-24
**Session:** Thistle rides Canopy (494337)
**Status:** Review and design complete. The strategic node, hook-enforcement
delivery node, and ADR-125 amendment were owner-ratified through collaboration
event `9d305a22-b318-4678-a39b-b5eae6cb736d`; implementation is released under
those plans.
**Linked plan:** [First-class GitHub Copilot agent participation](../../plans/strategic/first-class-copilot-agent-participation.plan.md)

## Evidence labels

Every claim below carries an evidence label so a reader can weigh it without
re-deriving it:

- **[V]** — directly verified this session (a command was run, a variable read,
  a log inspected).
- **[D]** — stated in official first-party GitHub or OpenAI documentation (see
  [Official sources](#official-sources)).
- **[R]** — grounded in this repository's source or doctrine, with a
  repo-relative citation.
- **[I]** — interpretation or design judgement built on the above, not itself a
  fact.

## Executive verdict

First-class membership is **named, addressable, aware participation** under the
same canonical Practice — not superficial feature parity with another tool's
configuration surface **[I]**. A Copilot session that merely reads a copied
instruction file is a guest with a borrowed badge; a first-class member has an
honest identity, can hear and answer its peers, is activated through the
platform's own native surfaces, and leaves proof that all of this actually
works **[I]**.

The priority order is therefore:

1. **Identity** — the session knows and honestly declares who it is.
2. **Bidirectional communication** — it can receive directed messages, reply,
   and detect when a peer has retired.
3. **Native activation** — instructions, agents, hooks and settings arrive
   through Copilot's own first-party surfaces, not through cross-tool
   borrowing.
4. **Validation and documentation** — the wiring is executably proven and the
   contributor experience is legible.

Parity of files is, at most, a means to an end; the end is a participant the
rest of the team can name, reach, and trust **[I]**.

## The five layers of membership

A useful way to read the findings is as five layers, each of which must hold
for the layer above it to mean anything **[I]**:

| Layer | Question it answers | First-class bar |
| --- | --- | --- |
| **Identity** | Who is this session, honestly? | A stable, model-visible name and id with truthful provenance — never another tool's seed. |
| **Addressability** | Can a peer reach exactly this session? | A durable address other agents can send to and that this session listens on. |
| **Awareness** | Does it know its team and their state? | Canonical Practice context reaches the model; peer liveness and inbox are observed. |
| **Capability** | Can it act through native surfaces? | Instructions, agents, skills, hooks and settings activate through Copilot's own mechanisms. |
| **Proof** | Can we show all of the above fired? | Executable validators and version-tested evidence, not assertion. |

## Findings

### Finding 1 — Identity: an honest name must come from Copilot's own signals

The live environment exposes Copilot-specific variables **[V]**:
`COPILOT_AGENT_SESSION_ID` (observed value a stable UUID),
`COPILOT_CLI=1`, `COPILOT_CLI_BINARY_VERSION=1.0.74`, and
`COPILOT_LOADER_PID`. This session's name — **Thistle rides Canopy (494337)** —
was in fact derived from the **native Copilot session UUID** **[V]**. Only the
tooling **preflight** temporarily used a **Codex alias** as the seed source; that
alias produced a **dishonest `seed_source`** — asserting Codex provenance for a
Copilot session — **not a dishonest name** **[V][I]**. Binding identity to a
borrowed seed source is nonetheless disqualified: the seed source must itself be
Copilot's own **[I]**.

`COPILOT_AGENT_SESSION_ID` is **observed** in the process environment **[V]**,
but a documentation search found **no published contract** for it **[V]**;
binding model-visible identity to it alone would therefore rest on an
unversioned signal **[I]**. By contrast, the official `sessionStart` hook payload
carries a documented `sessionId` field **[D]**.

**Design [I]:** derive the model-visible identity from the **documented
`sessionStart` hook payload** (the id the model sees and declares), and use the
**environment variable** only for shell-level tooling that runs outside the
model's turn — and only behind a version-tested capability probe, never as the
sole source. This **reuses the existing identity derivation** in
[PDR-027 (Threads, Sessions, and Agent Identity)](../../../.agent/practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
the documented Copilot `sessionStart` `sessionId` becomes a native Copilot
**`seed_source`** feeding the existing agent-identity CLI and its UUID-v5
pipeline — **no parallel identity algorithm** is introduced. Identity must be
Copilot's own, honestly Copilot's.

### Finding 2 — Cross-tool instruction reading works, but no Practice context reached the model

Copilot officially reads a subset of the cross-tool `.claude/settings.json`
**[D]**, and this session's own event log proves that `sessionStart`,
`userPromptSubmitted` and `preToolUse` events fired **[V]**. The repository
already ships a Claude identity hook at
[`.claude/hooks/practice-session-identity.mjs`](../../../.claude/hooks/practice-session-identity.mjs),
which parses `session_id`, optionally reads `CLAUDE_ENV_FILE`, and emits a
`hookSpecificOutput` payload carrying the agent identity row **[R]**.

The problem is a **shape mismatch, not merely a missing file** **[I]**.
Copilot's native `sessionStart` contract expects the hook to return
`additionalContext` **directly** **[D]**, whereas the Claude shim wraps its
payload in `hookSpecificOutput` **[R]**. The net observed result: **no Practice
identity context reached the session** **[V]**. A common first hypothesis — that
the sole cause is an unset `CLAUDE_ENV_FILE` — is incomplete: even with the seed
file present, the output envelope shape would still not deliver context through
Copilot's native path **[V][I]**. A native Copilot `sessionStart` adapter that
returns `additionalContext` directly is required.

### Finding 3 — Cross-tool hook execution actively blocked valid work (newly observed defect)

This session directly observed a blocking defect — and reproduced it again while
editing these very documents **[V]**. The parent Copilot session's log showed
that Copilot **1.0.74** emits a `PreToolUse` input shaped
`{ sessionId, cwd, toolCalls: [{ id, name, args }] }`, with the tool arguments
carried as a serialised `args` payload **[V]**. The inherited Claude `Edit`
matcher fired for Copilot's `create`/`apply_patch` calls **[V][R]**.

The failure chain is precise **[V][R]**:

1. [`agent-tools/src/hook-policy/hook-input.ts`](../../../agent-tools/src/hook-policy/hook-input.ts)
   expects `tool_input`/`toolInput`, or top-level `new_string`/`content`; none of
   these are present in Copilot's `toolCalls[].args` shape.
2. `extractContentChange` therefore throws
   `Claude PreToolUse hook input did not include writable content.`.
3. [`agent-tools/src/hook-policy/check-blocked-content.ts`](../../../agent-tools/src/hook-policy/check-blocked-content.ts)
   catches that error and returns **exit 2**.
4. The
   [`.claude/hooks/run-pretooluse-guard.mjs`](../../../.claude/hooks/run-pretooluse-guard.mjs)
   wrapper passes the guard's exit 2 through **fail-closed**, and Copilot denied
   the call.

The policy content core **never evaluated the content**: no blocked pattern was
matched; the guard simply could not parse Copilot's payload and so blocked
defensively **[V][I]**. Crucially, **both platforms agree that exit 2 is
fail-closed** — this was never a divergence in exit-code semantics, but a
divergence in **input payload shape** that starved the parser and tripped the
shared fail-closed path **[V][I]**. The cure is **native Copilot hook adapters
plus explicit per-platform activation**, so that exactly one platform's guard
parses exactly one platform's payload shape. **No bypass** of the guard is
proposed or acceptable; the policy it enforces must run, but it must run against
a **faithfully parsed** input **[I]**.

### Finding 4 — The strict event-schema boundary

The agreed design draws a **strict, closed schema boundary** at the hook input
edge **[I]**:

- Define **strict, closed schemas** for Claude, Copilot, and Codex input events.
- **Parse the JSON once**.
- For explicit platform activation, validate only the selected schema. For a
  genuinely shared compatibility activation, require **exactly one** match
  within a bounded candidate set; **zero or multiple** matches throw a clear,
  fail-closed **boundary error** rather than guessing.
- **Normalise** the matched input to one canonical — possibly batched —
  `PreToolUse` event, and then to canonical `ContentChange` values.
- Extract one platform-free evaluator from the current Bash and content
  runners, load one policy snapshot, and evaluate the canonical event exactly
  once.
- **Render** the verdict and context back through the **originating platform's**
  output schema.
- Where activation already knows the host, **explicit platform entrypoints select
  the expected adapter**; schema inference is confined to genuinely shared
  cross-tool activation where the host is not yet known.
- Copilot's **batch and patch-document semantics must be parsed faithfully** —
  never approximated as Claude `old_string`/`new_string` pairs.

This is the structural cure for Finding 3: the defect there was a payload shape
the parser could not represent, so the boundary must model **each platform's real
event shape** rather than assume Claude's **[I]**.

### Finding 5 — The cross-platform capability matrix is stale

The official first-party Copilot repository surfaces are now **[D]**:

- Repo-wide instructions: `.github/copilot-instructions.md`.
- Modular instructions: `.github/instructions/**/*.instructions.md`.
- Skills: `.github/skills`, and cross-tool `.claude/skills` and `.agents/skills`.
- Custom agents: `.github/agents/*.agent.md`.
- Hooks: `.github/hooks/*.json`.
- Settings: `.github/copilot/settings.json`.
- MCP servers, extensions, and plugins are supported.

The internal matrix at
[`.agent/memory/executive/cross-platform-agent-surface-matrix.md`](../../memory/executive/cross-platform-agent-surface-matrix.md)
predates these surfaces, understates what Copilot now supports natively, and
should be treated as **stale** until re-measured against the
[Official sources](#official-sources) **[V][I]**. This adapter family is governed
by
[ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md),
whose 2026-07-24 amendment adds the GitHub adapter family and names Copilot as a
reader of the cross-tool `.agents/skills` home. That amendment was co-ratified
with the strategic and delivery nodes before the surfaces are wired **[R][I]**.

**Current state [V]:** `.github/copilot-instructions.md` already exists as a thin
pointer to `AGENT.md`; it will be brought under **validated adapter ownership**,
not created fresh.

### Finding 6 — Skills are already first-class; do not duplicate them

Skills already reach Copilot through the cross-tool
[`.agents/skills`](../../../.agents/skills) directory — confirmed by the official
documentation and by **live skill invocation this session** **[D][V]**. This is
deliberately **not** cited to the repository matrix (**[R]**): that matrix
currently contradicts the observed capability and is itself stale (Finding 5).
Copying skills into `.github/skills` would create a second canonical home for the
same content and invite drift **[I]**. **Recommendation:** treat `.agents/skills`
as the single skills home and do **not** duplicate skills into `.github/skills`.

### Finding 7 — Instructions: prefer generated activation projections over canonical copies

Copilot instructions support repo-wide files with `@` relative recursive
references, and modular `*.instructions.md` files with `applyTo` globs **[D]**.
A material constraint: `@` references are **not** expanded inside
`*.instructions.md` files **[D]**. The full canonical rule corpus measures on
the order of **~150,000 tokens** **[V]**, so an always-on full copy is not
viable — it would flood every session's context **[I]**.

**Design [I]:** generate **activation projections** — thin instruction files
whose job is to route the session to the relevant canonical rules on demand —
rather than duplicating canonical content. The acceptance test is
**behavioural**: the relevant rules arrive when they are needed, without context
flooding. A generated projection can be **architecturally thin even when it is
byte-thick**: its size is an output of generation from canonical templates, not
hand-maintained duplication, so it carries no second source of truth **[I]**.

### Finding 8 — Custom agents: generate a validated GitHub family from canonical templates

Official custom agents live at `.github/agents/*.agent.md` with defined
frontmatter fields **[D]**. This repository currently lacks native Copilot agent
adapters, schema, or parity **[R]**. The runtime does expose specialist agents,
but their provenance is **not** a committed, validated GitHub agent family — so
there is nothing executable proving the exposed set matches a canonical
definition **[V][I]**.

**Design [I]:** generate agent profiles from the canonical agent templates, map
the documented Copilot tool aliases, and inherit the model rather than pinning
it per profile. The generated family is validated against its templates, giving
provenance that is committed and checkable.

### Finding 9 — Hooks: rich native event surface, including a wake path

Copilot's native hook events include `sessionStart` and `sessionEnd`, prompt and
tool events, `agentStop`, `notification`, subagent events, and
`preCompact`/error events **[D]**. Notably, the `notification` event carries a
`shell_completed` signal that **can return `additionalContext` and trigger idle
processing** **[D]**. That single capability is the seam that makes
event-driven wake-up possible without a polling loop as the primary transport
(see Finding 10) **[I]**.

### Finding 10 — Communications: a native event-driven design in three layers

This session's **owner explicitly stated** that the ability to send messages and
to know when messages arrive is the **single most important team capability after
identity** **[V]** — which establishes communications as **core**, not
speculative. The **bet** is that the transport is **event-driven** (the
mechanism); the **observable success** is directed **send and reply**, reliable
**wake and awareness**, and **peer-retirement detection**, however the transport
is wired **[I]**.

The existing Practice comms CLI already supports an all-channel watcher,
directed send and reply, a durable cursor, a watcher heartbeat, and heartbeat-tag
exclusion **[R]**. A live probe this session confirmed that `--max-events 1`
converts a received event into a **background shell completion** **[V]** — which
is exactly the signal a `notification` `shell_completed` hook consumes
(Finding 9) **[I]**.

**Design — three cooperating layers [I]:**

1. **Primary transport:** a one-shot watcher -> `shell_completed` ->
   `notification` hook -> Copilot turn, which then **re-arms** the watcher. This
   is edge-triggered and event-driven; it is the main channel.
2. **Turn-boundary safeguard:** a watcher/inbox check at turn boundaries, so a
   message that arrives outside the wake path is still picked up.
3. **Liveness detector:** a scheduled `/every` or `/loop` peer-liveness and
   inbox-absence check.

Two guardrails are load-bearing: the scheduled loop is a **safety net, not the
primary transport** — treating it as primary would reintroduce polling latency
and cost **[I]**; and **heartbeat-tag exclusion must be paired with
peer-liveness detection**, or excluding heartbeats would blind the session to a
peer that has gone silent **[I]**.

### Finding 11 — Process tree: bind lifetime to the tool runtime, prove cleanup

The process tree was verified this session **[V]**: the tool shell spawns a
per-session Copilot process (the session id appears in its `argv`), which is a
resumed loader. The variables observed on it are **undocumented** **[V]**.
**Design [I]:** bind any adapter lifetime to the **tool runtime** and prove
cleanup happens; use `COPILOT_LOADER_PID` only behind version-tested capability
probes, never as an unguarded assumption.

### Finding 12 — Documentation-versus-installed skew is real

Current documentation describes a `copilot plugins list` command, but the
installed binary version **1.0.74** reports it as unavailable **[V][D]**. This
is a concrete instance of doc-versus-build skew. **Design [I]:** require a
**supported-version floor**, use **capability probes** before relying on any
surface, and keep an explicit distinction between what is **documented
upstream** and what is **wired and tested here**.

## Target architecture

The canonical Practice content stays exactly where it is; a GitHub-native
**adapter family** projects it onto Copilot's first-party surfaces, and a
**single canonical policy core** evaluates every platform **[I]**:

- **Canonical (unchanged):** [`.agent`](../../../.agent) content, and
  [`.agents/skills`](../../../.agents/skills) as the single skills home.
- **GitHub adapter family:** `.github/copilot-instructions.md`,
  `.github/instructions`, `.github/agents`, `.github/hooks`, and
  `.github/copilot/settings.json`.
- **One canonical policy core:** extract one platform-free evaluator and one
  policy-snapshot load from the current Bash and content runners;
  [`agent-tools/src/copilot`](../../../agent-tools) holds Copilot **parsers,
  renderers, and platform-adapter composition** — not a parallel guard.
- **One platform dispatcher:** a single dispatcher owns activation routing —
  **O(N)** in the number of platforms; individual shims do **not** each need to
  know every other platform. Explicit activation validates only its named
  adapter; shared compatibility activation arbitrates within a bounded set.
- **One Copilot evaluation authority:** native `.github` `preToolUse` owns
  evaluation for a supported Copilot version. Inherited `.claude` compatibility
  input is classified by the dispatcher but does not load policy or call the
  evaluator. Capability and version-floor probes must prove native activation
  before this wiring lands.
- **Enforcement:** extend the existing
  [`pretooluse-guard-routing`](../../../agent-tools/src/validators/pretooluse-guard-routing)
  validator to cover the new adapter family and the single-evaluation invariant.

The adapters are **generated and validated projections** of canonical content —
never a second hand-maintained source of truth **[I]**.

## Cross-tool hook coexistence

Because Copilot reads the `.claude` settings subset **[D]**, adding native
Copilot hooks alongside the existing Claude hooks risks **double or cross-shape
execution** of the same policy — and Finding 3 shows cross-shape execution is not
harmless **[V][I]**. The invariant: **exactly one policy evaluation per tool
call**. This is achieved by a static ownership rule: native `.github`
`preToolUse` is the sole Copilot evaluation source, while the central dispatcher
recognises the inherited compatibility activation and returns its host-valid
pass-through without loading policy or invoking the evaluator. Individual
Claude shims do not learn the platform matrix, and no unstable request
fingerprint is used. Unknown or unmatched input **fails closed with a clear
platform/schema error** (Finding 4), never a **false policy violation**.
Separate-process tests and a live supported-version probe must prove this
boundary before activation lands **[I]**.

## Candidate implementation slices (historical exploration)

These report-era slices did not themselves authorise work. Owner ratification
now releases only work governed by the linked strategic node and its delivery
plans; the hook-enforcement landing shape is defined by the ratified
[`first-class-copilot-hook-enforcement`](../../plans/delivery/first-class-copilot-hook-enforcement.plan.md)
node. The broader exploration candidates remain:

- **Slice A — Identity.** Native `sessionStart` adapter emitting honest,
  model-visible Copilot identity via documented `additionalContext`.
- **Slice B — Native instructions and agents.** Generated instruction
  activation projections and a validated `.github/agents` family from canonical
  templates.
- **Slice C — Communications and wake.** The three-layer event-driven comms
  design (one-shot watcher -> `shell_completed` -> `notification` -> re-arm),
  with turn-boundary safeguard and paired liveness detection.
- **Slice D — Truth and enforcement.** Validators (including the extended
  `pretooluse-guard-routing` single-evaluation check), version floors, capability
  probes, and the coexistence de-duplication boundary. The ADR-125 amendment was
  co-ratified with the strategic and delivery nodes rather than deferred to
  this slice.

## Build versus buy

Use the **first-party repository surfaces directly** **[I]**. The official
surfaces reviewed here provide no generator that projects this repository's
canonical `.agent` corpus into Copilot adapter metadata **[V]**, so
**repo-owned generation is the narrow glue** that remains — validated
projection logic, and nothing more **[I]**. A Copilot **plugin** is useful for
multi-repository distribution, but for one repository it adds a packaging and
per-developer installation lifecycle without a corresponding benefit **[D][I]**.
Reconsider a plugin only if a **measured** multi-repository distribution need
appears later — not speculatively.

## Assumptions, falsifiers, and unresolved evidence

| Assumption | Falsifier | Status |
| --- | --- | --- |
| Native `sessionStart` returning `additionalContext` delivers context to the model. | A native adapter runs but the model shows no injected context. | Documented **[D]**; not yet natively verified here. |
| One-shot watcher -> `shell_completed` -> `notification` re-arm is a reliable primary transport. | A delivered event fails to wake a turn, or the durable handoff drops events. | Probe confirmed the shell-completion conversion **[V]**; full loop unverified. |
| Native `.github` activation can be the sole Copilot evaluator while inherited `.claude` compatibility activation is classified without loading policy. | Both activation sources still evaluate the same request, or a supported input cannot be classified without guessing. | Design **[I]**; unproven. |
| A tested CLI version floor plus capability probes gate every relied-upon surface. | A supported-floor build fails a required probe, or an unprobed surface is wired. | Skew observed at 1.0.74 **[V]**; floor and probes unset. |

**Evidence resolved at delivery pickup [V][D]:**

- The live Copilot 1.0.74 session event stream confirms that the inherited
  compatibility hook receives `{ sessionId, cwd, toolCalls }`; `toolCalls` is a
  real batch, each entry carries `id`, `name`, and serialised `args`, `create`
  arguments decode to `path` plus `file_text`, and `apply_patch` carries a patch
  document string rather than a Claude edit pair **[V]**.
- The current official hooks reference documents native `preToolUse` as a
  single-call camelCase event (`toolName`, `toolArgs`) and documents the
  PascalCase compatibility event separately **[D]**. Native and inherited
  activation therefore require explicit adapter context rather than one
  permissive schema.
- OpenAI's current Hooks reference documents Codex `PreToolUse` common fields,
  `tool_name`, `tool_use_id`, and `tool_input`, plus the native
  `hookSpecificOutput` deny contract **[D]**. The tracked `.codex/config.toml`
  currently activates only `SessionStart`, so Codex enforcement is new delivery
  scope rather than an existing protection **[V]**.

**Unresolved evidence to gather during delivery [I]:**

- Whether a supported Copilot build fires both tracked activation sources in a
  form that the proposed static authority boundary can classify and suppress
  without a second evaluation.
- The exact **durable watcher event-handoff shape** across the wake path.
- The **batch and idempotency semantics** of the wake path: whether one wake
  **drains or coalesces** a burst, plus proof of **at-least-once delivery**,
  **cursor advancement**, **ordering**, **duplicate handling**, and **re-arm
  gap** behaviour.
- The **CLI version floor** at which the relied-upon surfaces are all present.
- The **status/footer value** the identity should surface to the contributor.

## Free-play and concept exploration record

A short divergent pass ran alongside the review **[I]**:

- **Surviving associations.** *Citizenship by proxy* — the alias experiment
  granted a name by borrowing another tool's badge; useful as a diagnosis of
  what honest identity must **not** be. *The door to the wrong room* — Finding 3,
  where a valid write knocked and was turned away by a guard speaking another
  dialect. *The one-shot watcher as edge adapter* — the insight that a single
  `--max-events 1` completion is the clean edge that turns comms into an
  event, not a poll.
- **Discarded forced association.** *An MCP server as a universal bridge*
  between every tool's conventions — discarded: it centralises a translation
  layer the native surfaces already make unnecessary, and adds a runtime
  dependency where generated projections suffice.
- **Frame change.** The framing moved from **feature parity** ("match the other
  tool's files") to **named, addressable participation through native
  asymmetry** — Copilot becomes first-class by being honestly itself on its own
  surfaces, not by mimicking another tool.

## Official sources

All URLs are first-party documentation **[D]**:

- Adding custom instructions —
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions>
- Adding agent skills —
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills>
- Creating and using custom agents for the CLI —
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli>
- Custom agents configuration reference —
  <https://docs.github.com/en/copilot/reference/custom-agents-configuration>
- Using hooks —
  <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks>
- Hooks reference —
  <https://docs.github.com/en/copilot/reference/hooks-reference>
- Configuration directory reference —
  <https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference>
- Command reference —
  <https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference>
- Comparing customization features (customization cheat sheet) —
  <https://docs.github.com/en/copilot/reference/customization-cheat-sheet>
- OpenAI Codex hooks and `PreToolUse` contract —
  <https://learn.chatgpt.com/docs/hooks>
