# v0, Claude Code, and the Practice

**Date:** 29 August 2026  
**Status:** Research and design report — evidence-backed where possible; candidate mechanisms are explicitly marked  
**Primary subjects:** v0 by Vercel, Claude Code, and the OCE Practice in `EngraphCode/oak-open-curriculum-ecosystem`

## Executive summary

v0 and Claude Code are not redundant agents. They occupy different but increasingly overlapping parts of an agentic software-development system.

v0 is strongest when the work benefits from a first-class application sandbox, live browser-visible feedback, product and UI iteration, Vercel integration, automatic Git branching/commits, and a unified environment in which the editor, terminal, preview, v0 agent and pre-installed coding agents share one project filesystem. Claude Code is strongest as a general engineering agent with mature repository instruction loading, project hooks, agent skills, resumable sessions, worktree-oriented parallelism, specialist agents and a richer existing OCE Practice phenotype.

The most useful architecture is therefore not "pick one". It is to let them work together around the repository while preserving clear authority and coordination boundaries.

v0 also exposes a valuable weakness in the current conceptual boundary of the Practice. The Practice correctly states that agent-work capabilities belong to the Practice while host files, tools, hooks and adapters are phenotype. In practice, however, a mature Claude-heavy phenotype can make a particular implementation mechanism feel synonymous with the capability it implements. v0 is a useful counterexample because it lacks some Claude-shaped surfaces — notably an automatically-read repository instruction entry point comparable to `AGENTS.md`/`CLAUDE.md`, and a documented agent lifecycle hook system comparable to Claude Code or Codex — while offering different native mechanisms such as per-chat sandboxes, command permissions, asynchronous message ingress, project skills, browser interaction and automatic branch/commit management.

That contrast suggests a productive refactoring lens:

> **The genotype should specify the required behavioural property, its authority, its firing moment and its proof obligations. The phenotype should select the simplest host mechanism that genuinely supplies that property.**

This is not permission to drop capabilities. First-class Practice citizenship requires **capability parity, not mechanism parity**. If a constitutive Practice capability cannot be realised on v0, that is a blocker to citizenship.

There is nevertheless a plausible path to a first-class v0 Practice phenotype. The strongest candidate shape is a thin **v0 Practice adapter/controller** around a v0 chat, with canonical Practice doctrine and state remaining in the repository. Such a controller could provide deterministic Practice bootstrap, stable Practice identity, activation of canonical/project skills, state and coordination integration, and message ingress. The v0 sandbox could host a separately identified Claude Code Practice seat in the same VM. Canonical Practice communication would remain the semantic source of truth, while platform-specific relays would only wake or resume the recipient agent.

That architecture is promising, but should not yet be treated as settled. Current v0 Platform API v2 is explicitly beta; important behaviours such as idle-chat activation, exact project-skill discovery, linked-worktree behaviour in the sandbox, and any candidate write-time guard need direct experiments.

The recommended next step is therefore a **small executable compatibility experiment**, not a broad adapter implementation.

---

# 1. Purpose, framing and method

## 1.1 Goal

The goal is to understand how v0 should fit into a mature agentic engineering environment built around the Practice, and to identify a credible, testable path by which the v0 agent could become a first-class Practice citizen without weakening the Practice to accommodate platform limitations.

The report has four required outcomes:

1. describe how v0 and Claude Code can work together;
2. use v0 as a new lens on the Practice's doctrine/tooling seam;
3. state good working practice for v0 both without additional coding agents and with additional agents;
4. propose a strictly evidence-backed path toward first-class v0 Practice citizenship, including direct v0 ↔ Claude collaboration inside one v0 sandbox VM.

## 1.2 Problem frame

The problem is not "how do we port Claude Code configuration to v0?"

That framing would begin with a solution shape and would tend to reproduce Claude-specific implementation details.

The underlying problem is:

> The Practice needs the same important behavioural, governance, coordination, continuity and assurance properties to remain true when the active engineering agent is v0, even though v0 exposes a materially different platform surface.

Who is harmed if this is solved badly:

- developers, because two agents can silently operate under different governance;
- future agents, because authoritative state may leak into vendor chat history or account settings;
- maintainers, because duplicated vendor-specific doctrine drifts;
- the Practice itself, because platform mechanisms can become confused with portable doctrine;
- product users, because assurance properties may become weaker on one host while still being described as equivalent.

Success therefore means:

- repository authority remains clear;
- v0-native strengths are used rather than suppressed;
- Practice guarantees are not silently weakened;
- unsupported properties remain explicit blockers;
- proposed mechanisms are testable and falsifiable;
- speculative mechanisms are not presented as settled design.

## 1.3 Cognitive and planning disciplines used

This report is structured using the OCE Practice's own cognitive and planning disciplines:

- **Start Right (Thorough):** ground architecture/planning work in the Practice, live repo doctrine and platform reality before proposing a design.
- **Metacognition:** inspect inherited shapes and ask whether the obvious porting approach still serves the requested impact.
- **Concept Exploration:** separate raw observations from the problem definition, reopen the solution space, then synthesise.
- **Proportionality:** distinguish what requires a new architecture from what only requires a thin adapter or experiment.
- **Reason:** name the kind of problem, ground claims, surface warrants and falsifiers, and prefer direct reversible trials when they can answer the question more cheaply than further analysis.
- **Plan:** organise future work around goal, mechanism, acceptance evidence, out-of-scope boundaries and owner-visible decision points.

Relevant Practice sources include PDR-009 (canonical-first cross-platform architecture), PDR-013 (grounding before framing), PDR-035 (agent-work capabilities belong to the Practice), PDR-038 (stated principles require structural enforcement), PDR-044 (memetic immune system), PDR-051 (vendor-agnostic skills), PDR-056 (inter-agent collaboration), PDR-082 (n=2 collaboration mode), PDR-092 (mechanical firing moments), PDR-110 (repo-state enforcement proof), PDR-118 (agent work-state model), PDR-133 (liveness classes) and PDR-139 (provider-independent capability composition).

## 1.4 Evidence labels used in this report

To avoid over-committing from incomplete vendor documentation, claims are implicitly divided into four classes:

**Documented** — directly stated in current official vendor documentation or current OCE doctrine.

**Observed in OCE** — recorded as an exercised local Practice phenotype or explicit empirical finding in the repository.

**Strong inference** — follows from documented primitives but has not yet been tested in the proposed composition.

**Candidate mechanism** — an engineering proposal which must be experimentally validated before becoming architecture.

Where an important claim is only a candidate, this report says so.

---

# 2. Ground truth: what v0 is today

The following current facts are important because the design should begin from v0's real composition root rather than from older "UI generator" assumptions.

## 2.1 Per-chat sandbox VM

Current v0 documentation says every chat runs inside its own isolated Vercel Sandbox VM. That sandbox hosts the project code, dev server, terminal and agent tools. The built-in editor is attached to the same filesystem, so editor changes, v0 changes and terminal changes all see the same files.

The filesystem persists between sessions of the same chat. The sandbox can stop when idle and resume later. New chats receive new sandboxes.

This makes a v0 chat an execution environment, not just a conversational frontend.

## 2.2 Bash and command permissions

The v0 agent has a Bash tool that runs in the sandbox. Each command starts in a fresh shell at project root.

v0 currently provides three permission modes:

- Ask;
- Auto;
- Full.

It also provides user- and team-scoped JSON command rules with explicit `allow`, `ask` and `deny` sets, plus system-level denies that apply in every mode.

This is important because v0 lacks a documented general lifecycle hook system, but it does have a deterministic pre-execution policy surface for **Bash commands**.

It does **not** establish equivalent mediation for arbitrary file Edit/Write operations.

## 2.3 Git model

When GitHub is connected:

- GitHub becomes the source of truth;
- a v0 chat works on a dedicated branch such as `v0/main-abc123`;
- every user message that changes code creates an automatic commit;
- v0 does not push directly to `main`;
- work is normally integrated through a pull request.

Existing GitHub repositories, including monorepos, can be imported.

This makes v0 far more compatible with long-lived repository engineering than its earlier product model.

## 2.4 Skills and instructions

v0 has reusable **Instructions**, but current documentation describes them as account-level reusable prompts that are applied on demand. That is not equivalent to an automatically-read repository instruction entry point.

v0's API supports skills of three kinds:

- `memory` — saved user/team skills;
- `remote` — public skills;
- `project` — skills defined in the connected repository.

The API can force-attach up to three skills to a message.

This is a promising Practice adapter surface, but it should not be confused with deterministic session bootstrap.

## 2.5 Pre-installed Claude Code

v0 officially documents pre-installed coding agents in the sandbox and specifically documents invoking Claude Code using the provided `claude` wrapper.

The Claude process:

- runs inside the same v0 sandbox;
- can read, edit and create project files;
- sees the sandbox environment available to terminal processes;
- is expected to use Vercel's supported wrapper and AI Gateway routing.

This is the key primitive that makes same-VM v0 + Claude collaboration more than a theoretical integration.

## 2.6 Browser-visible agent capabilities

v0's agent can:

- search the web;
- operate the application in a browser;
- capture screenshots;
- inspect and debug user flows;
- run terminal commands;
- use MCP servers and Marketplace integrations;
- automatically fix some errors.

This native browser/application feedback loop is one of v0's strongest differentiators from a conventional CLI-only agent.

## 2.7 External control plane

v0 Platform API v2 and the v0 MCP server can:

- create chats;
- find/get chats;
- list messages;
- send messages;
- resolve tasks/approvals;
- retrieve previews.

The asynchronous chat/message endpoints process work in the background and expose a completion state.

Important limitation: v0 API v2 is explicitly **beta and not yet production-ready**.

---

# 3. How v0 and Claude Code can work together

There are several useful collaboration shapes. They should not be collapsed into one.

## 3.1 Shape A — independent agents coordinated through Git

This is the lowest-coupling model.

```text
Claude Code                    v0
    │                           │
    ├── branch/worktree         ├── v0 chat branch
    │                           │
    └──────── GitHub / PR ──────┘
```

Claude Code owns engineering work on its own branch/worktree. v0 owns a UI/product lane on its own v0 chat branch. Integration happens through PRs.

This is currently the easiest reliable model for mature repositories because it uses Git as the convergence substrate.

### Good fit

- v0 iterating on a visual/product slice;
- Claude performing architecture, refactoring, test design or cross-repo changes;
- limited need for live back-and-forth;
- changes can be reviewed and integrated asynchronously.

### Advantages

- minimal new infrastructure;
- natural fault isolation;
- low filesystem collision risk;
- straightforward auditability;
- v0 auto-commit behaviour remains native.

### Limitation

It does not create a collaborative agent team. It creates two independent workers whose work converges through Git.

That distinction matters for the Practice.

---

## 3.2 Shape B — Claude orchestrates v0 through MCP/API

```text
Claude Code
    │
    ├── Practice
    │
    └── v0 MCP / API
           │
           ↓
        v0 agent
           ↓
     v0 sandbox/preview
```

Here Claude is the Practice seat and v0 is a specialised product/visual implementation capability.

This can be valuable immediately because v0 exposes its own MCP/API control surface.

### Best uses

- ask v0 to propose or implement a UI;
- ask v0 to visually inspect a running screen;
- use v0 for quick product exploration while Claude retains architectural control;
- obtain a v0 preview as evidence;
- iterate in v0, then review the resulting Git diff from Claude.

### Important semantic boundary

In this shape, **v0 is not yet a Practice citizen**. It is a tool/secondary agent invoked by a Practice-aware Claude seat.

That is a legitimate and useful mode; it should not be described as parity.

---

## 3.3 Shape C — v0 agent uses Claude Code inside the sandbox

```text
v0 agent
   │
   └── Bash / terminal
          │
          ↓
        claude
          │
          ↓
     same project files
```

This is supported at the physical platform level: Claude Code is a documented pre-installed agent in the v0 VM.

### Useful bounded pattern

v0 could ask Claude to:

- review a difficult refactor;
- analyse a failing test;
- review architectural implications;
- perform a constrained engineering task;
- produce an independent second opinion.

### Risk

If Claude is simply invoked ad hoc with one prompt, it is a subordinate tool, not an independent Practice seat.

That may be exactly what is wanted for a bounded task. It should not be confused with team collaboration.

---

## 3.4 Shape D — two Practice seats in one v0 sandbox

This is the most interesting target.

```text
                 v0 sandbox
┌──────────────────────────────────────────┐
│                                          │
│  v0 Practice seat       Claude seat      │
│        │                    │             │
│        ├──── shared repo ───┤             │
│        │                    │             │
│        └─ canonical Practice state ──────┤
│                                          │
└──────────────────────────────────────────┘
```

The intended semantic properties are:

- v0 and Claude have **distinct Practice identities**;
- both ground in the same canonical Practice;
- both participate in canonical claims and communication;
- neither is merely a hidden subprocess of the other;
- either may still invoke the other as a tool for explicitly bounded work;
- their mutable work is isolated when necessary;
- the canonical repository remains authoritative.

### Candidate refinement: separate worktrees

Because both agents can mutate the same sandbox filesystem, the cleanest candidate arrangement is:

```text
sandbox
├── root worktree               # v0-owned lane
├── .worktrees/claude-peer/     # Claude-owned lane
└── canonical coordination home
```

This is a **candidate mechanism**, not yet proven in v0.

Claude Code itself has mature worktree support, and v0 provides a real filesystem/Git environment. The missing evidence is whether ordinary linked-worktree operation behaves cleanly inside Vercel Sandbox and alongside v0's own automatic Git synchronisation.

---

# 4. What v0 reveals about the Practice

## 4.1 The Practice already contains the correct conceptual direction

PDR-035 states the central distinction clearly:

- the Practice owns agent-work behavioural contracts, vocabulary, lifecycle, governance and portability;
- hosts own concrete files, state instances, tools, hooks, wrappers, schemas and scripts.

PDR-009 separately distinguishes canonical policy from platform activation.

So the underlying doctrine is already aiming in the right direction.

## 4.2 Where confusion can still arise

A mature phenotype accumulates mechanisms. In OCE today these include:

- root entrypoints;
- generated skill adapters;
- rule adapters;
- Claude project hooks;
- Codex project hooks/config;
- agent-tools CLIs;
- claims JSON;
- comms event streams;
- watcher machinery;
- heartbeats;
- commit queue;
- worktrees;
- CI validators;
- Git hooks.

When a mechanism repeatedly and successfully enforces an invariant, it is easy to start describing the invariant in terms of that mechanism.

For example:

- "agents must have a `PreToolUse` hook" may actually mean "the dangerous action must be mechanically mediated before it occurs";
- "agents must run a comms watcher" may actually mean "a directed coordination event must reliably reach and activate the intended seat";
- "agents must use a worktree" may actually mean "concurrent mutable work must be isolated or explicitly negotiated";
- "agents must be continuously heartbeating" may actually mean "peers need truthful evidence for the particular liveness decision they are about to make";
- "every commit follows the commit skill" may hide an ambiguity between a vendor-generated implementation snapshot and a Practice-governed integration/landing event.

v0 makes these distinctions visible because it supplies different substrate primitives.

## 4.3 A clearer four-part seam

A useful future vocabulary is:

### Doctrine

What property must hold, why it matters, who has authority, and what counts as success/failure.

### Firing moment

When the property must be checked or activated.

Examples:

- session start;
- before a dangerous Bash action;
- immediately after a write;
- before staging;
- before merge;
- when a directed event arrives;
- at handoff.

### Mechanism

The platform/host implementation.

Examples:

- `AGENTS.md`;
- a project skill;
- a lifecycle hook;
- Bash permission rules;
- filesystem watcher;
- CI validator;
- API message ingress;
- Git worktree;
- external review agent.

### Proof

How we know the mechanism actually supplies the doctrine at the firing moment.

PDR-092's "untested mechanism is prose in costume" principle is especially valuable here.

## 4.4 The key rule: capability parity, not mechanism parity

v0 should not need Claude's exact mechanisms.

It does need the same constitutive properties.

Therefore:

> A missing Claude-shaped surface is not automatically a blocker; a missing Practice capability is.

Examples:

- no v0 `PreToolUse` hook is acceptable **only if** the required pre-action property can be mechanically enforced another way;
- no automatically-loaded `AGENTS.md` is acceptable **only if** deterministic grounding is supplied another way;
- no local filesystem wake hook is acceptable **only if** directed events reliably activate the v0 reasoning loop through another path.

This is a harder standard than feature parity and a cleaner one.

---

# 5. Working effectively with v0 without additional coding agents

This section covers v0 as the principal AI development agent, with the human using v0's own editor, terminal, preview, browser and Git workflow rather than adding Claude/Codex/etc. as peer agents.

## 5.1 Keep GitHub authoritative

For any non-disposable codebase, connect/import the actual GitHub repository and let GitHub remain the source of truth.

Avoid building important long-lived work only in an unconnected v0 chat.

## 5.2 Use one chat as one bounded lane

Because every chat receives an isolated sandbox and Git branch, the natural unit of work is a bounded feature/problem per chat.

Use a new chat/branch for work which would conventionally deserve an independent engineering lane.

This reduces context contamination and makes PR integration clearer.

## 5.3 Exploit browser evidence

v0's strongest native advantage is the browser-visible feedback loop.

For UI/product work, ask it to:

- run the app;
- interact with the affected flow;
- inspect multiple states;
- capture screenshots;
- check responsive behaviour;
- verify error and loading states;
- compare against explicit visual references.

Do not accept "code looks right" where the claim is visual or interactive.

This aligns closely with Practice PDR-138's principle that design verdicts should be visually verified.

## 5.4 Use terminal permissions deliberately

For ordinary engineering work:

- prefer **Auto** or **Ask**;
- reserve Full for disposable/non-sensitive experiments;
- encode repeated risky operations as `ask` or `deny`;
- encode known safe repo gates as `allow`.

Do not treat v0's permission system as a substitute for repository policy where it does not cover the relevant action type.

## 5.5 Treat automatic commits as vendor workflow, not proof of correctness

A v0 commit records that v0 changed code after a message.

It does not prove:

- acceptance criteria;
- correctness;
- architectural fitness;
- test validity;
- review completion;
- Practice compliance.

Keep the semantic distinction explicit.

## 5.6 Keep durable knowledge in the repository

Do not allow important design intent, decisions or operational learning to live only in:

- v0 chat history;
- account Instructions;
- team memory;
- untracked sandbox files.

Long-lived technical truth should remain in normal repository surfaces.

## 5.7 Prefer repository project skills to account-local workflow prompts when possible

If a reusable workflow matters specifically to one codebase, a repository-defined project skill is a more appropriate candidate than a personal Instruction.

The exact v0 project-skill discovery/format contract should be verified before assuming compatibility with existing OCE generated adapters.

## 5.8 Use project Instructions conservatively

Current v0 Instructions are reusable prompts selected by the user. They are useful for preferences and repeated working modes, but they are not a reliable substitute for mandatory repository governance.

## 5.9 Use v0 as a product-development environment, not only a code generator

High-value v0 use includes:

- design exploration;
- Figma/reference-driven UI work;
- browser-visible debugging;
- visual QA;
- product experiments;
- frontend interaction work;
- quick full-stack prototypes;
- integrated Vercel preview/deployment inspection.

Trying to make it behave exactly like a terminal-native coding agent discards much of its value.

---

# 6. Working effectively with v0 and other agents

## 6.1 Give each agent a reason to exist

Avoid two general agents simultaneously editing the same undefined problem.

Good role boundaries include:

**v0**
- visual/product implementation;
- interaction and browser testing;
- design-system application;
- narrow full-stack feature experiments;
- preview-driven iteration.

**Claude Code**
- architecture;
- repo-wide reasoning;
- refactoring;
- difficult test/CI work;
- cross-workspace changes;
- independent review;
- long-lived implementation requiring mature Practice integration.

These are defaults, not rigid job descriptions.

## 6.2 Prefer isolated mutable lanes

The safest current composition is separate branches/worktrees and PR-based convergence.

If agents share one sandbox, use separate worktrees if a direct trial proves the v0/Git integration behaves correctly.

## 6.3 Keep a single semantic communication substrate

If two Practice-aware agents collaborate, do not create:

- one copy of the task in chat;
- another in a sidecar queue;
- another in an MCP message;
- another in a JSON comms file.

The **canonical Practice communication event** should carry the substance.

Platform channels should carry only the activation pointer required to make the recipient notice it.

## 6.4 Distinguish invocation from collaboration

`v0 → claude -p "review this"` is invocation.

`v0 seat → canonical directed event → separately identified Claude seat → canonical reply` is collaboration.

Both are useful. They solve different problems.

## 6.5 Use independent review where independence matters

If v0 authored the change, a distinct Claude Code seat can be a materially better reviewer than asking the same v0 conversation to review itself.

Review should be grounded in repository doctrine and the actual diff, not only in the v0 chat transcript.

## 6.6 Avoid shared-chat memory as team state

Team decisions, claims, continuity and handoff should remain in Practice state rather than in whichever agent's chat happened to contain the conversation.

---

# 7. Requirements for first-class Practice citizenship

A first-class v0 Practice citizen should be defined by required capabilities, not by matching Claude configuration.

A working definition is:

> A first-class v0 Practice citizen is an independently identified v0 agent session that deterministically enters the Practice, has access to the canonical doctrine and repo state it needs, participates directly in Practice coordination and continuity, is mechanically constrained by the required assurance mechanisms at the required firing moments, can collaborate as a peer with other Practice seats, and carries empirically proven platform capability/liveness declarations.

This does **not** require every agent to expose identical native features.

It does require every constitutive property to have a real implementation.

---

# 8. Candidate v0 Practice phenotype

This section proposes usable mechanisms but intentionally does not ratify them.

## 8.1 Platform adapter/controller

### Problem

v0 currently has no documented always-read repository instruction file and no documented general agent lifecycle hook system.

### Candidate mechanism

Introduce a small external **v0 Practice adapter/controller** which creates or resumes a v0 chat through the v0 API.

The controller would:

1. allocate/resolve a Practice seat identity;
2. create/resume the v0 chat;
3. inject minimal system-level bootstrap context;
4. force-load a Practice bootstrap/project skill where supported;
5. point the v0 agent into root `AGENTS.md` and the canonical start-right workflow;
6. record the chat ID only as platform correlation metadata;
7. observe turn completion;
8. trigger required post-turn state verification;
9. provide message ingress for directed Practice events.

### Evidence

v0 API v2 documents:

- system-level prompt context;
- project skills;
- asynchronous chat/message processing;
- chat IDs and completion status.

### Important limitation

API v2 is beta.

### Assumption

v0's system prompt and/or forced project skill is strong enough to cause deterministic bootstrap before substantive work.

### Falsifier

A clean-room session can make substantive code changes without completing the required bootstrap.

If that happens, the controller does not supply deterministic grounding and cannot serve as the first-class entry mechanism.

---

## 8.2 Deterministic identity

### Candidate mechanism

The v0 Practice adapter generates a UUID/Practice identity before creating the chat and passes the stable seed into the bootstrap.

Extend the host identity preflight to recognise `platform=v0`.

The v0 `chatId` is platform metadata, not the Practice routing identity.

### Why

PDR-027 requires agent identity to be stable and explicit. Relying on display names or account identity would collapse concurrent chats/agents.

### Open question

Does v0 expose a sufficiently stable native conversation identifier inside the sandbox itself, or must the controller inject it?

The latter is acceptable if mechanically guaranteed.

---

## 8.3 Grounding and canonical entry

### Candidate mechanism

A small generated v0 bootstrap skill points only to:

- `AGENTS.md`;
- `.agent/directives/AGENT.md`;
- the appropriate start-right skill.

Substance remains canonical.

Because v0 has no documented automatic repo entrypoint, the adapter/controller is responsible for loading the bootstrap.

### Rejected path

**"Just create a v0 Instruction saying read AGENTS.md."**

Assumption: humans will remember to enable it and v0 will retain it consistently.

Rejected because mandatory Practice entry becomes recall-dependent and account-local.

---

## 8.4 Skills

### Candidate mechanism

Investigate whether existing `.agents/skills/` generated adapters are directly usable as v0 project skills.

If yes, v0 should consume the same generated cross-tool surface.

If not, add the smallest generated v0 adapter compatible with PDR-009/PDR-051.

### Evidence

v0 Platform API supports `project` skills defined in the connected repository.

### Open question

Current docs establish project skills as a concept, but the exact repository path/discovery/precedence contract needs direct verification before OCE should claim compatibility.

### Rejected path

**Copy canonical skill bodies into v0 account/team memory.**

Rejected because it moves authoritative Practice workflow substance out of the repository and creates a driftable vendor-owned copy.

---

## 8.5 Bash pre-action policy

### Candidate mechanism

Generate v0 Agent Permission rules from the relevant canonical Practice policy:

- safe deterministic repo commands → `allow`;
- operations requiring owner approval → `ask`;
- irreducibly destructive/bypass commands → `deny`.

Practice operation should use Ask or Auto rather than Full unless a disposable experiment explicitly chooses otherwise.

### Evidence

v0 documents persistent `allow` / `ask` / `deny` Bash rules at user/team scope plus system-level denies.

### Limitation

These rules are not repository-scoped tracked infrastructure in the same way `.claude/settings.json` is.

### Open question

Can the v0 API, team configuration, or another supported mechanism install/manage project-specific Agent Permissions deterministically?

If not, this may remain a significant portability/administration defect.

---

## 8.6 Write-time Edit/Write immunity

This is one of the hardest capability gaps.

PDR-044 requires the mature Practice's innate layer to scan relevant Edit/Write/Bash/staged-diff actions. PDR-092 says a mechanical firing moment should fire at the failure point where a seam exists.

v0 has no documented Edit/Write hook equivalent.

### Candidate mechanism: filesystem-mediated guard

Run a small watcher in the sandbox which:

1. snapshots or hashes the v0-owned mutable lane at turn start;
2. watches close-write/rename events;
3. runs the canonical content/fingerprint scanner immediately;
4. emits a canonical detection;
5. on an irreducible hard block, restores the pre-turn permitted version;
6. triggers a v0 message containing only the detection/event pointer and reappraisal instruction.

### Why this is only a candidate

It depends on several unproven assumptions:

- v0 writes produce observable filesystem events;
- detection runs before an unsafe change can escape through v0 auto-sync/auto-commit;
- restoring files does not conflict with v0's editor/state reconciliation;
- atomic rename/save patterns are fully covered;
- the watcher remains correctly bound to the v0 seat;
- rollback can be scoped safely.

### Required proof

Use founding blocked patterns as RED cases. A guard that cannot stop/undo the exact known attack shape is not an enforcement mechanism.

### Rejected path

**Rely only on CI or PR review.**

Rejected because it moves the firing moment from write-time to integration-time and does not satisfy the current innate-immunity doctrine.

### Rejected path

**Put "before writing, run the scanner" in a skill.**

Rejected because it is vigilance, not mechanical enforcement.

---

## 8.7 Git and automatic commits

v0 auto-commits every code-changing user message.

This may conflict with the current host commit workflow, which assumes staging/commit are explicit governed moments.

### Candidate interpretation

Treat v0 chat commits as **vendor work snapshots**, not automatically as Practice-accepted integration commits.

A later Practice-controlled promotion step would:

- inspect the complete diff;
- run required validators/gates;
- verify claims/coordination state;
- obtain required review;
- integrate through the repo's accepted PR/merge route.

### Assumption

Current Practice doctrine may have accidentally conflated all Git commits with governed delivery commits.

### Open question

Does existing PDR/ADR doctrine explicitly require every intermediate Git commit from every tool to satisfy the same commit ceremony, or is the actual invariant about accepted history / integration / delivery?

This must be answered from doctrine before the snapshot interpretation is adopted.

### Rejected path

**Fight v0's automatic commit system by trying to interpose normal staging manually.**

Rejected provisionally because it works against a platform-level workflow and may add fragility without changing the actual assurance property.

### Rejected path

**Declare v0 auto-commits equivalent to Practice commits.**

Rejected because commit creation alone proves none of the Practice acceptance properties.

---

## 8.8 Canonical coordination state

### Candidate mechanism

Use the existing Practice state model and host tooling where possible:

- claims;
- comms events;
- conversations;
- handoff;
- escalation;
- work-state projection.

Because both agents run against the same repository, canonical state can remain repo-based.

### Constraint

Shared state must not become coupled to one sandbox-local untracked path that disappears when the chat is replaced.

The OCE host's existing coordination-home model needs explicit treatment in a v0 sandbox experiment.

---

# 9. Direct v0 ↔ Claude collaboration in one VM

## 9.1 Principle

The communication **substance** should be canonical Practice events.

Transport and activation may be platform-specific.

This gives three layers:

```text
semantic event       -> Practice
transport pointer    -> host mechanism
reasoning activation -> platform mechanism
```

This avoids a second source of truth.

## 9.2 v0 → Claude

### Candidate path

1. v0 writes a canonical directed Practice event addressed to the Claude seat.
2. A local relay observes the event.
3. The relay resumes a named/stable Claude Code session.
4. Claude reads the canonical event and current Practice state.
5. Claude replies through a canonical Practice event.

### Evidence

Claude Code officially supports:

- explicit session IDs;
- `--resume`;
- programmatic/headless operation;
- persisted sessions;
- worktree-associated sessions.

### Strong candidate

A seat runner could capture the Claude `session_id` once and later use:

```text
claude -p --resume <session-id> "<activation pointer>"
```

The activation prompt should contain the event ID/path, not duplicate the full comms event.

### Required experiment

Prove:

- session resumes in the expected worktree;
- project settings/Practice entry still load correctly;
- event reaches Claude;
- Claude produces a content-bearing canonical reply;
- no concurrent-resume corruption occurs.

---

## 9.3 Claude → v0

### Candidate path

1. Claude writes a canonical directed Practice event addressed to the v0 seat.
2. A v0 relay calls the existing v0 chat's asynchronous message endpoint.
3. The message says that Practice event `<id>` awaits the v0 seat.
4. v0 processes the message.
5. v0 reads the canonical event and responds canonically.

### Evidence

v0 documents asynchronous messages to an existing chat which are processed in the background.

### Critical unknown

Does an async message reliably activate an otherwise idle chat/sandbox and reasoning loop with the semantics required for team participation?

Documentation makes this plausible but the exact PDR-133 `NOTIFY`/`ABSORB` property must be observed, not inferred.

---

## 9.4 n=2 collaboration

The existing Practice has an n=2 mode, but its current adopted form assumes both agents are visible in a shared owner-chat context.

A v0 + Claude same-VM team has a different topology.

Therefore existing n=2 reductions must **not** be copied automatically.

Some retained ideas are likely still valid:

- distinct identities;
- claims;
- substantive cross-agent events;
- handoff;
- explicit coordination where mutable lanes overlap.

But "owner chat substitutes for directed comms" clearly does not apply when v0 and Claude are expected to communicate directly.

This is a good example of doctrine whose **precondition** matters more than its surface analogy.

---

# 10. Liveness and event-driven seats

v0 sandboxes stop when idle and resume later. That suggests an event-driven agent model rather than assuming a continuously present CLI process.

This is potentially valuable, but must not be allowed to weaken PDR-133.

## 10.1 Candidate model

A v0 Practice seat can remain durably addressable while not actively claiming to be running.

Conceptually:

```text
quiescent identity
      ↓ directed event
v0 message ingress
      ↓
active reasoning turn
      ↓
claim / work / reply
      ↓
turn completion
      ↓
quiescent identity
```

## 10.2 Why this may be cleaner than fake heartbeats

A sidecar can continue running after a reasoning loop stops. PDR-133 explicitly warns that process/watcher activity must not be over-read as evidence that the reasoning seat is alive or absorbing coordination.

Therefore a daemon heartbeat that says "v0 is alive" may be worse than no heartbeat if it describes the sidecar rather than the reasoning loop.

## 10.3 What must remain true

The platform still needs an empirically established declaration for the liveness classes relevant to decisions:

- dispatch;
- substrate;
- process;
- binding;
- cursor;
- integrity;
- delivery;
- notify;
- loop;
- absorb;
- capability;
- emit;
- registry;
- progress.

The correct mechanism may differ from Claude's.

The evidence standard does not.

## 10.4 Open doctrine question

Does the Practice currently define a "seat" too strongly in terms of continuous process presence?

If so, v0 may expose a useful generalisation toward **durable identity + addressability + activation + observed absorption**.

That question should be explored separately from v0 implementation rather than silently changing doctrine to make v0 fit.

---

# 11. Assurance and review

## 11.1 Structural enforcement remains mandatory

PDR-038 and PDR-092 mean important Practice rules cannot degrade into "the v0 agent was told about them."

Mechanisms must remain mechanical where the doctrine requires mechanical firing.

## 11.2 Repo-state validators remain first-class

PDR-110 requires repo-state checks to prove repository shape and to be RED-proven against broken states.

v0 can run those same validators in its sandbox.

A second independent integration gate outside the v0 agent's own turn is still valuable.

## 11.3 Independent review

A separately identified Claude Code seat is a strong candidate for independent review of v0-authored code because:

- it can ground in canonical Practice doctrine;
- it can inspect the actual diff;
- it can use the mature Claude specialist-agent phenotype;
- its conversation/context is not identical to the authoring v0 seat.

This is stronger than asking the v0 authoring chat to self-review.

---

# 12. Best-practice architecture for a mature repository

The strongest current default is:

```text
                         GitHub
                    canonical source
                           │
            ┌──────────────┴───────────────┐
            │                              │
      Claude Code lane                v0 chat lane
     branch / worktree               v0/* branch
            │                              │
  architecture / tests /            UI / product /
  cross-repo engineering             visual iteration
            │                              │
            └────────── PRs ───────────────┘
                           │
                       integration
```

Use same-VM direct collaboration when there is a clear benefit that independent Git lanes do not provide.

Do not make same-VM multi-agent operation the default merely because it is possible.

---

# 13. Assumptions

The following assumptions carry material weight and must remain visible.

## A1 — v0 has no automatic repository entrypoint

Current public documentation describes Instructions as user-applied reusable prompts and does not document automatic `AGENTS.md`/`CLAUDE.md` loading.

**Effect if false:** the bootstrap/controller may be simpler than proposed.

## A2 — v0 has no general Edit/Write lifecycle hook equivalent

Current public documentation establishes Bash permissions but not a general pre/post tool hook system.

**Effect if false:** a native v0 hook should replace the filesystem-guard candidate.

## A3 — project skills can carry a thin Practice adapter

The API documents project skills but does not, from the evidence reviewed here, fully establish the repository discovery/format details required to assert current OCE adapter compatibility.

**Effect if false:** a v0-specific generated adapter may be required.

## A4 — v0 asynchronous message ingress can activate an idle seat

The API documents background processing. Exact team-liveness semantics are unproven.

**Effect if false:** direct Claude → v0 peer messaging may require polling or may be blocked for unattended participation.

## A5 — linked worktrees behave normally in v0 Sandbox

Plausible from the full Git filesystem environment, not yet directly proven.

**Effect if false:** same-VM peer seats need different mutation isolation, possibly separate v0 chats/sandboxes.

## A6 — a filesystem guard can fire quickly enough

This is the weakest major mechanism in the report.

**Effect if false:** write-time innate immunity remains a blocker unless another interception seam exists.

## A7 — v0 automatic commits can be semantically treated as snapshots

This is a doctrine interpretation, not an established fact.

**Effect if false:** either v0's Git flow needs deeper integration or current first-class citizenship may be blocked.

## A8 — Claude Code's supported wrapper inside v0 retains the project features needed by the Practice

Claude is officially supported, but exact project settings/hooks/plugin behaviour in the v0 wrapper environment should be verified.

**Effect if false:** the "Claude peer inside v0 VM" topology may be more limited than a normal local Claude Code seat.

---

# 14. Open questions

## Platform questions

1. Does v0 automatically inspect any repository instruction file that is not currently documented?
2. What exact filesystem path and schema define a v0 `project` skill?
3. What skill-discovery precedence does v0 use when multiple skill surfaces exist?
4. Can project/team Agent Permissions be provisioned reproducibly rather than manually in account settings?
5. Does `send message async` wake a fully idle v0 chat/sandbox?
6. What happens to long-running sandbox sidecars when the sandbox idles/stops?
7. Can a background process or integration safely trigger v0 chat activity without an external always-on service?
8. Do linked Git worktrees operate normally alongside v0's Git synchronisation?
9. At what exact point relative to agent file writes does v0 create its automatic Git commit?
10. Can a filesystem watcher modify/revert a file during a v0 turn without confusing v0's internal edit state?
11. Are v0 file edits atomic renames, direct writes, patches, or a mixture?
12. Is there any undocumented/native file-edit policy surface which would make a sidecar unnecessary?

## Practice questions

13. Which Practice properties are genuinely constitutive for every first-class seat versus optional host capabilities?
14. Does current commit doctrine govern every intermediate Git commit or the accepted integration/landing path?
15. Is the current innate-immunity requirement intentionally universal across all agent hosts, or should the genotype name the firing property more abstractly while keeping write-time equivalence mandatory?
16. Does the Practice need an explicit event-driven/quiescent seat lifecycle?
17. Can a Practice seat remain addressable while not counted as live/active?
18. What is the correct n=2 mode when agents communicate directly rather than through one owner-visible chat?
19. Should platform capability declarations extend beyond liveness into bootstrap, enforcement, skills, review and continuity?
20. Which parts of `agent-tools` are merely this host's TypeScript implementation and which currently contain behavioural contracts that should be promoted into clearer Practice capability descriptions?

## Product/working questions

21. Which classes of work genuinely benefit from same-VM v0 + Claude collaboration versus separate Git lanes?
22. Does direct collaboration improve outcomes enough to justify its coordination machinery?
23. How should visual evidence produced by v0 be attached to Practice review/acceptance records?
24. How should v0's product-native Plan Mode relate to OCE's planning discipline without creating two plan authorities?

---

# 15. Rejected or deferred paths

## 15.1 "v0 lacks hooks, therefore hook capabilities do not apply"

**Rejected.**

Hidden assumption: Claude's mechanism defines the capability.

Correct framing: determine the required behavioural property and firing moment, then find an equivalent mechanism or record a blocker.

## 15.2 "Just tell v0 to read AGENTS.md"

**Rejected as first-class bootstrap.**

Hidden assumption: remembered/manual invocation is sufficiently reliable for mandatory governance.

It may be useful during an experiment, but it is not deterministic citizenship.

## 15.3 "Put the whole Practice into v0 Instructions"

**Rejected.**

Hidden assumption: vendor account settings are an acceptable authoritative home.

This would create drift, weak repository portability and unclear authority.

## 15.4 "Copy Practice skills into v0 team memory"

**Rejected as canonical architecture.**

Hidden assumption: skill portability is more important than source authority.

Use repository canonical source plus the thinnest proven project adapter.

## 15.5 "CI can replace all missing v0 hooks"

**Rejected.**

Hidden assumption: enforcement time does not matter.

PDR-044/PDR-092 make write/action-time firing load-bearing for some guarantees.

## 15.6 "Both agents should edit the same checkout"

**Rejected as the default.**

Hidden assumption: shared physical environment implies safe shared mutable ownership.

Use separate worktrees/branches where possible; shared checkout requires much stronger coordination.

## 15.7 "v0 should always be subordinate to Claude"

**Rejected as a general architecture.**

Hidden assumption: Claude's mature Practice phenotype means it must remain the permanent orchestrator.

v0 has distinct product/browser capabilities and may be a useful peer seat once the required Practice properties exist.

## 15.8 "Claude inside the v0 VM automatically makes v0 Practice-aware"

**Rejected.**

Hidden assumption: a Practice-aware neighbour confers governance onto another agent.

Each seat requires its own entry, identity, authority and assurance.

## 15.9 "Use v0 chat messages as the cross-agent source of truth"

**Rejected.**

Hidden assumption: the host conversation is sufficiently portable and inspectable.

Practice communication should remain canonical; host messages should carry activation pointers.

## 15.10 "Treat all v0 automatic commits as accepted Practice history"

**Rejected.**

Hidden assumption: Git commit creation is equivalent to governed delivery.

The proper semantics remain an open doctrine question.

## 15.11 "Implement the entire v0 Practice adapter before testing"

**Rejected.**

Hidden assumption: static design evidence is cheaper than real composition evidence.

OCE's Reason/direct-trial discipline points to a bounded compatibility experiment first.

---

# 16. Evidence-backed path to first-class v0 citizenship

The path below deliberately separates **probe**, **prototype**, **admission evidence** and **productionisation**.

## Stage 0 — capability inventory

Before implementing adapters:

1. enumerate constitutive Practice capabilities;
2. state each capability as behaviour + firing moment + proof;
3. map current Claude/Codex phenotype mechanisms only as examples;
4. classify v0 platform primitives from current official docs;
5. do not yet change doctrine.

**Exit:** one capability matrix with no mechanism described as the capability itself.

## Stage 1 — clean-room v0 platform probes

Run the smallest possible tests in a disposable repository/chat:

- confirm project skill format/discovery;
- confirm systemPrompt persistence/precedence;
- confirm v0 async message behaviour from idle;
- confirm background process lifetime;
- confirm linked-worktree behaviour;
- measure v0 write/commit timing;
- inspect filesystem write event shapes;
- confirm supported Claude wrapper loads repository project settings and can resume a session.

**Exit:** observed facts replace assumptions A2–A8 where possible.

## Stage 2 — deterministic bootstrap prototype

Build the smallest `practice-v0` launcher/controller that:

- creates a v0 chat;
- assigns a Practice identity;
- injects a thin bootstrap;
- forces the start-right project skill;
- causes the v0 seat to read canonical Practice entrypoints;
- records a bootstrap-complete artefact.

Test a deliberately conflicting instruction to prove precedence/grounding rather than merely observing a happy path.

**Exit:** a fresh v0 seat cannot substantively work before grounded bootstrap completes.

## Stage 3 — canonical state participation

Add:

- identity preflight;
- active claim;
- comms send/read;
- thread/continuity read;
- closeout.

Do this with one v0 seat only before adding a peer.

**Exit:** all state is visible to another normal Practice seat from repository state alone.

## Stage 4 — two-seat same-VM experiment

Inside one v0 sandbox:

- v0 seat owns one lane;
- Claude Code owns a separate worktree/lane;
- both have independent Practice identities;
- both see the same canonical coordination home.

Prove:

### Test A — v0 → Claude

v0 creates a canonical challenge event. Claude is activated/resumed without owner relay and produces a content-bearing reply.

### Test B — Claude → v0

Claude creates a canonical challenge event. v0 async ingress activates the v0 seat without owner relay and v0 produces a content-bearing reply.

### Test C — claim coordination

Both attempt intentionally overlapping work. The Practice prevents silent concurrent ownership and the agents negotiate a resolution.

### Test D — independent work

Both perform non-overlapping work concurrently without unnecessary coordination overhead.

### Test E — handoff

One seat freezes a bounded lane; the other adopts it from canonical state, not from chat memory.

**Exit:** collaboration properties demonstrated in behaviour, not configuration.

## Stage 5 — enforcement experiment

Test each required mechanical firing class.

### Bash

Generate/instantiate v0 permission rules and prove:

- allowed command succeeds;
- approval command blocks pending approval;
- forbidden command cannot run;
- rule cannot be bypassed through a trivial wrapper form.

### Edit/Write

Test the chosen v0 write-time mechanism against founding Practice fingerprints.

The candidate filesystem guard is accepted only if it:

- catches every founding case;
- cannot be raced by auto-commit/sync;
- cannot silently lose edits;
- preserves legitimate owner-approved references;
- surfaces positive reappraisal direction.

If it fails, do not weaken the requirement. Return to mechanism design.

### Commit/integration

Resolve automatic-commit semantics and prove whichever integration boundary the doctrine selects.

**Exit:** no required structural rule relies only on prompt compliance.

## Stage 6 — platform liveness declaration

Run PDR-133 challenge tests from an external observer/peer.

Record class-by-class:

- certified primitive/path;
- latency;
- cannot-certify + proxy;
- residual risk;
- exact v0 version/date.

Do not infer one liveness class from another.

**Exit:** no team-participation decision depends on an unclassified v0 liveness path.

## Stage 7 — continuity and recovery

Test:

- sandbox idle/resume;
- v0 chat resume after time;
- Claude session resume;
- controller restart;
- process death;
- one seat disappearing mid-task;
- stale claims;
- handoff after interruption;
- canonical restoration without relying on chat memory.

**Exit:** recovery is repository/state driven.

## Stage 8 — product/visual evidence integration

Use a real bounded UI feature to test the capability v0 is actually being introduced for:

- design iteration;
- browser-visible test;
- screenshot evidence;
- Claude independent code/architecture review;
- normal repository gates;
- PR integration.

**Exit:** the combined system produces a better result or workflow than the simpler independent-lane alternative.

## Stage 9 — admission decision

Only after the above evidence should the repo decide whether v0 is:

1. **specialised external capability** — useful through MCP/API but not a Practice seat;
2. **restricted Practice seat** — supports a deliberately narrower non-team mode;
3. **first-class Practice citizen** — constitutive capability parity demonstrated;
4. **blocked** — one or more required capabilities cannot be realised on the current platform.

The decision should be evidence-driven, not aspirational.

---

# 17. Minimal first experiment

The highest-value next experiment is deliberately small:

```text
one disposable GitHub repo
one v0 chat
one v0 Practice identity
one Claude Code Practice identity
one v0 sandbox
two mutation lanes if worktrees prove viable
one canonical Practice comms substrate
```

Prove only:

1. deterministic v0 bootstrap;
2. v0 → canonical event → Claude activation → canonical content-bearing reply;
3. Claude → canonical event → v0 activation → canonical content-bearing reply;
4. one overlapping claim negotiation;
5. one known forbidden write detected at the required firing moment;
6. sandbox stop/resume without losing identity or canonical continuity.

Do not start by porting the entire OCE Practice phenotype.

That experiment has unusually high value of information because it attacks the most uncertain seams directly.

---

# 18. Implications for future Practice refactoring

Regardless of whether v0 achieves first-class citizenship, the investigation can improve the Practice.

Potential refactor targets include:

## 18.1 Capability declarations

For each agent-work capability, record:

- semantic guarantee;
- firing moment;
- authority;
- required evidence;
- permitted host implementation classes.

This would make platform onboarding more systematic.

## 18.2 Activation as a first-class concept

PDR-009 already distinguishes policy from activation.

v0 suggests extending that discipline consistently across:

- bootstrap activation;
- rule activation;
- coordination activation;
- reasoning-loop activation;
- review activation.

## 18.3 Seat lifecycle separate from process lifecycle

v0 may justify a general model in which an agent seat can be:

- addressable but quiescent;
- activated;
- reasoning;
- waiting for approval;
- retired;
- handed off.

This should be derived independently of v0 if adopted.

## 18.4 Commit semantics

The Practice may benefit from explicitly distinguishing:

- tool/vendor snapshots;
- authoring commits;
- reviewed integration commits;
- landed delivery.

If current doctrine already distinguishes these adequately, the investigation should simply document the mapping rather than invent new terminology.

## 18.5 Stronger capability portability tests

PDR-139's provider-independent capability framing is useful here even though it is currently Proposed.

A platform adapter should be judged by whether the capability remains true under a different provider mechanism, not by whether configuration files look similar.

---

# 19. Conclusions

The combined v0 + Claude Code opportunity is stronger than a simple "UI agent plus coding agent" pairing.

v0 provides:

- isolated application VMs;
- native visual/browser feedback;
- automated Git lanes;
- full terminal access;
- project skills;
- permission rules;
- external MCP/API control;
- a supported in-sandbox Claude Code agent.

Claude Code provides:

- mature repository instruction entry;
- lifecycle hooks;
- rich Practice skill integration;
- resumable named sessions;
- worktrees;
- specialist agents;
- a deeply exercised OCE phenotype.

Together they can form either:

- two independent Git-shaped engineering lanes;
- Claude plus a specialised v0 capability;
- v0 plus a bounded Claude worker;
- potentially, two genuine Practice seats in one sandbox.

The last topology is plausible but not yet proven.

The most important architectural lesson is independent of v0:

> **The Practice should make behavioural guarantees, activation/firing moments and proof obligations portable; platform mechanisms should remain replaceable phenotype.**

v0 should not be admitted by lowering requirements. It should be admitted only if concrete mechanisms can supply the same constitutive properties.

The current evidence suggests that many required mechanisms have credible candidates:

- controller-mediated deterministic bootstrap;
- project skill adapters;
- v0 Bash permission rules;
- canonical state and claims;
- v0 API ingress for reasoning activation;
- resumable Claude Code sessions for the peer seat;
- repository validators and independent review.

The hardest open area is mechanical Edit/Write enforcement in the absence of v0 hooks. A filesystem-mediated guard is worth a direct trial, but it remains speculative and should be treated as a potential blocker until proven.

The other major conceptual question is v0's automatic commit lifecycle. The Practice should determine what assurance property commit doctrine is actually protecting before deciding whether to adapt v0's Git flow or reinterpret intermediate commits as unaccepted snapshots.

The appropriate next move is therefore a **bounded experiment that forces the architecture to meet reality**.

---

# 20. Source register

## OCE Practice / Engraph fork

- Practice Core README  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/README.md
- Root `AGENTS.md`  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/AGENTS.md
- Canonical `AGENT.md`  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/directives/AGENT.md
- Start Right Quick  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/start-right-quick/SKILL-CANONICAL.md
- Start Right Thorough  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/start-right-thorough/SKILL-CANONICAL.md
- Start Right Team  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/start-right-team/SKILL-CANONICAL.md
- Metacognition  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/cognition/metacognition/SKILL-CANONICAL.md
- Concept Exploration  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/cognition/concept-exploration/SKILL-CANONICAL.md
- Proportionality  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/cognition/proportionality/SKILL-CANONICAL.md
- Reason  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/cognition/reason/SKILL-CANONICAL.md
- Plan  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/skills/plan/SKILL-CANONICAL.md
- Agent tools README  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/agent-tools/README.md
- Agent artefact inventory  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/memory/executive/artefact-inventory.md
- Cross-platform agent surface matrix  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/memory/executive/cross-platform-agent-surface-matrix.md
- PDR-009 Canonical-First Cross-Platform Architecture  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md
- PDR-013 Grounding and Framing Discipline  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-013-grounding-and-framing-discipline.md
- PDR-035 Agent Work Capabilities Belong to the Practice  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md
- PDR-038 Stated Principles Require Structural Enforcement  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md
- PDR-044 Memetic Immune System  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-044-memetic-immune-system.md
- PDR-051 Vendor-Agnostic Skills Standardisation  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md
- PDR-056 Inter-Agent Collaboration Protocol  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-056-inter-agent-collaboration-protocol.md
- PDR-082 n=2 Collaboration Mode  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-082-n2-collaboration-mode.md
- PDR-092 Mechanical Firing Moments  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-092-mechanical-firing-moments-over-vigilance-clauses.md
- PDR-110 Repo-State Enforcement  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-110-repo-state-enforcement-is-its-own-proof-layer.md
- PDR-118 Agent Work-State Model  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-118-agent-work-state-model.md
- PDR-133 Liveness Classes and Platform Declaration  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md
- PDR-139 Provider-Independent Capability Composition (Proposed)  
  https://github.com/EngraphCode/oak-open-curriculum-ecosystem/blob/main/.agent/practice-core/decision-records/PDR-139-provider-independent-capability-composition.md

## v0 official documentation

- Sandbox  
  https://v0.app/docs/sandbox
- Terminal commands and Agent Permissions  
  https://v0.app/docs/terminal-commands
- Instructions  
  https://v0.app/docs/instructions
- Pre-installed agents  
  https://v0.app/docs/pre-installed-agents
- Agentic features  
  https://v0.app/docs/agentic-features
- GitHub integration  
  https://v0.app/docs/github
- Git Import  
  https://v0.app/docs/git-import
- Projects  
  https://v0.app/docs/projects
- Platform API v2 — Create Chat Async  
  https://v0.app/docs/api/v2/reference/chats/create-chat-async
- Platform API v2 — Send Message Async  
  https://v0.app/docs/api/v2/reference/messages/send-message-async
- v0 MCP Server  
  https://v0.app/docs/api/v2/guides/mcp-server
- Platform API v2 — Design Systems / Skills  
  https://v0.app/docs/api/v2/guides/design-systems
- v0 changelog  
  https://v0.app/changelog

## Claude Code official documentation

- CLI reference  
  https://code.claude.com/docs/en/cli-reference
- Manage sessions  
  https://code.claude.com/docs/en/sessions
- Run Claude Code programmatically  
  https://code.claude.com/docs/en/headless
- Common workflows / worktrees  
  https://code.claude.com/docs/en/common-workflows

---

# 21. Evidence cautions

- v0 evolves rapidly. Platform/API claims in this report should be rechecked before implementation.
- v0 Platform API v2 is beta; no production dependency should be treated as stable without a version/failure strategy.
- Absence claims ("no hook", "no automatic instruction file") are claims about the **documented current platform surface reviewed here**, not proof that no undocumented internal mechanism exists.
- OCE's current phenotype is highly mature and historically evolved. A mechanism's presence in OCE is evidence that the host needed it, not automatically evidence that every host needs the identical mechanism.
- Conversely, a v0-native convenience is not evidence that the corresponding Practice capability can be removed.
- The candidate filesystem write guard and automatic-commit snapshot semantics are the two most speculative substantive mechanisms in this report. Both require direct trials before architectural adoption.
