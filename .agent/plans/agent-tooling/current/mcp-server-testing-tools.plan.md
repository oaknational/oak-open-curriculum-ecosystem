---
name: "MCP Server Testing Tools — inspector-smoke harness + SDK-suite validation"
overview: "Deliver a vendor-agnostic agent-tools subcommand, `agent-tools:mcp-inspector-smoke`, that lets an agent (or human/CI) drive ARBITRARY MCP interactions against any running MCP server via the MCP Inspector CLI — tools/list, tools/call, resources/read, prompts/get with custom headers — plus an optional `--uat` checklist profile that mirrors the manual UAT guide's substantive checks. Server-generic by URL; for local runs it can boot the dev server with auth disabled. Records the already-validated SDK-based e2e suite (130 green, pre-push gated) as the regression layer and scopes the boundary between the two so they do not duplicate. Mechanism is npx-pinned, NOT a dependency: the Inspector is a heavyweight UI app, so depending on it to use its --cli would bloat agent-tools."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: pure inspector-argv builder. Test buildInspectorArgs(opts) returns the exact `--cli <url> --transport <t> --method <m> [--tool-name --tool-arg k=v ...] [--resource-uri] [--prompt-name --prompt-args ...] [--header 'K: V' ...]` argv for fixture option objects, including the arbitrary passthrough cases. Pure, one commit, tree green."
    status: pending
  - id: ws2-cycle-1
    content: "WS2 cycle 1: result parsing. Test parseInspectorOutput(stdout) returns a typed Result — Ok(parsed JSON) for a tools/list/tool-call fixture, Err for non-JSON / inspector error text (e.g. the `{\"error\":\"Unauthorized\"}` / `Failed to connect` shapes observed 2026-06-08). Pure, one commit, tree green."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws3-cycle-1
    content: "WS3 cycle 1: UAT checklist profile (data + pure evaluator). Define the checklist as data (mirroring the manual UAT guide §B/§C/§H substance: orientation present, EEF inspect-strand returns a known strand's verbatim corpus values, evidence-for-move multi-strand, no-selector isError, learning-styles floor-only omission, eef://interpretation resource, adapt-lesson prompt) and test evaluateChecklist(results) against fixture inspector outputs → pass/fail report. Engineering smoke only — NOT a value-proof (owner 2026-06-08: value is proven by release-and-observe). Pure, one commit, tree green."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws4-cycle-1
    content: "WS4 cycle 1: no-auth local server lifecycle (pure parts). Test the pure helpers — free-port selection and the healthz-ready predicate — against fakes. The actual spawn of `dev:observe:noauth` with a PORT override + teardown is the thin integration boundary exercised in WS5. Pure, one commit, tree green."
    status: pending
  - id: ws5-cycle-1
    content: "WS5 cycle 1: CLI integration + dispatch + script + dependency attestation. Register `mcp-inspector-smoke` in dispatchTopic; the runner spawns the pinned `npx @modelcontextprotocol/inspector --cli` with WS1 argv and parses via WS2; support arbitrary-passthrough mode, `--uat` profile (WS3), and `--start-local-noauth` (WS4). Integration test boots the no-auth curriculum MCP on a free port, runs tools/list + a get-eef-evidence call, asserts a parsed result, tears down. Add the workspace pnpm script. Record the npx-not-dep attestation (D2). One commit, tree green."
    status: pending
    depends_on: [ws3-cycle-1, ws4-cycle-1]
  - id: ws6-docs
    content: "WS6: documentation slice. agent-tools/README.md subcommand entry; cross-link from the manual UAT guide (the harness is its automated companion) and a back-cite in this plan §Existing Capabilities. One commit, no behaviour change."
    status: pending
    depends_on: [ws5-cycle-1]
isProject: false
status: current
lane: current
type: executable
thread: agent-tooling
date: 2026-06-08
---

# MCP Server Testing Tools

> Authored 2026-06-08 (Galactic Drifting Twilight) under owner direction: build a tool that
> lets agents run **arbitrary** tests against an MCP server (the UAT script being one option),
> named to make the inspector mechanism clear, with the local dev server started auth-disabled.
> Decision-complete enough for `current/`; an `assumptions-expert` readiness review is a
> pre-execution gate (see §Readiness Reviewers), and execution is queued behind the EEF PR merge.

## Context

### Problem statement

Agents and humans need to drive an MCP server programmatically — list and call tools, read
resources, get prompts — against a **running** server (local dev, or a deployed preview/prod URL),
both for ad-hoc probing and for a repeatable smoke walkthrough. Today this is done by hand
(`npx @modelcontextprotocol/inspector --cli …`) or not at all. There is no agent-tools surface
that makes "exercise this MCP server" a one-command, server-generic capability.

### Existing capabilities (do not duplicate)

- **SDK-based e2e suite** — `apps/oak-curriculum-mcp-streamable-http/e2e-tests/*.e2e.test.ts`
  drives the server in-process with the official `Client` + `StreamableHTTPClientTransport`
  (auth disabled by DI, stubbed search). **Validated 2026-06-08: 19 files, 130 tests green**, and
  wired into pre-push (ADR-121). This is the **regression** layer and stays the home for
  automated CI assertions. This plan does NOT reimplement it.
- **MCP Inspector CLI** — demonstrated 2026-06-08 driving the local server end-to-end
  (`tools/list`, `tools/call get-eef-evidence`, `resources/read`, `prompts/get adapt-lesson`).
  Its edge over the in-process suite: it hits a **real HTTP server by URL** (any server, incl. a
  deployed preview), which the in-process suite structurally cannot.
- **Manual UAT guide** —
  [`apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md`](../../../../apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md)
  is the human walkthrough; the `--uat` profile here is its automated companion.

## End Goal

An agent can run `pnpm agent-tools:mcp-inspector-smoke -- --url <url> …` to drive arbitrary MCP
interactions against any running server, or `--uat` to run the substantive checklist and get a
pass/fail report — with `--start-local-noauth` booting the local dev server auth-disabled for
local runs.

## Mechanism

A thin, typed agent-tools subcommand wraps the **pinned** `npx @modelcontextprotocol/inspector
--cli`. Pure functions (argv build, output parse, checklist evaluate, port/health helpers) carry
the logic and the tests; the subprocess spawn and the server lifecycle are thin integration
boundaries. The Inspector is the maintained, official MCP testing tool, so wrapping it (buy)
beats re-implementing protocol-driving orchestration (build).

## Means

The six workstreams in the frontmatter todos: argv builder (WS1), output parser (WS2), UAT
checklist + evaluator (WS3), no-auth server lifecycle helpers (WS4), CLI integration + dispatch +
script + attestation (WS5), docs (WS6). WS1–WS4 are independent pure-logic cycles; WS5 integrates
them; WS6 documents.

## Settled Decisions

- **D1 — Name `mcp-inspector-smoke`.** The mechanism (inspector) is explicit in the name
  (owner, 2026-06-08).
- **D2 — npx-pinned, NOT a dependency (build-vs-buy attestation).** The Inspector ships a full
  React UI + proxy; depending on it to use its `--cli` would bloat agent-tools. The runner
  invokes a version-pinned `npx @modelcontextprotocol/inspector@<pin> --cli`. Acceptable because
  this is an agent/human-invoked interactive tool, not a network-free CI gate (ADR-161); if a
  gated use ever arises, revisit. Alternative considered: the MCP client SDK directly (lighter,
  already used by the e2e suite) — viable, but the owner asked specifically for the inspector
  mechanism, and the SDK path is already covered by the e2e suite for regression.
- **D3 — Arbitrary-first; UAT is a profile.** The primary surface is generic passthrough of
  `--method`/`--tool-name`/`--tool-arg`/`--resource-uri`/`--prompt-name`/`--header` so agents do
  arbitrary tests; `--uat` is one built-in profile, not the only mode (owner, 2026-06-08).
- **D4 — Server-generic by `--url`; `--start-local-noauth` for local.** The tool works against any
  MCP server URL. For local testing it boots `dev:observe:noauth` on a free `PORT` override, waits
  healthz, runs, tears down — auth disabled, per owner direction (2026-06-08).
- **D5 — `--uat` is engineering smoke, NOT a value-proof.** Per owner (2026-06-08), EEF/teacher
  value is proven by release-and-observe, not a codified test. The checklist asserts the surface
  *works* (substance present, isError paths, floor-only omission), never that it *delivers value*.

## Acceptance Criteria and Proof Contract

| Acceptance id | Proof level | Proof |
| --- | --- | --- |
| `ws1-cycle-1` | `unit` | `buildInspectorArgs` fixture tests for every mode (arbitrary + UAT) |
| `ws2-cycle-1` | `unit` | `parseInspectorOutput` Ok/Err fixtures incl. observed inspector error shapes |
| `ws3-cycle-1` | `unit` | `evaluateChecklist` over fixture inspector outputs → correct pass/fail |
| `ws4-cycle-1` | `unit` | free-port + healthz-ready predicate tests against fakes |
| `ws5-cycle-1` | `integration` | boots no-auth MCP, runs tools/list + get-eef-evidence, asserts parsed result, tears down; `pnpm agent-tools:mcp-inspector-smoke` registered |
| `ws6-docs` | `non-code` | README entry + UAT-guide cross-link present |

Each cycle is one commit; every commit ends with all tests passing and the relevant local gates
green; the final validation is the canonical aggregate gate per
[`../../templates/components/quality-gates.md`](../../templates/components/quality-gates.md).

## Prerequisites

- **EEF PR merged** — `beneficial`, not `blocking`. The harness is independent agent-tools work;
  minimum shippable shape without it is identical (it targets any MCP server by URL). Execution is
  queued behind the merge only for owner-sequencing, not technical dependency.
- **Network access for `npx`** — `blocking` for the WS5 integration test and real runs (pulls the
  pinned inspector). The pure WS1–WS4 cycles need no network.

## Non-goals

- **Not a value-proof for EEF or any surface** — value is release-and-observe (owner 2026-06-08).
- **Not a replacement for the SDK e2e suite** — that stays the in-process regression layer.
- **Not a deployed-preview auth-token helper** — sourcing a Clerk token for an authed remote
  target is out of scope; the tool accepts `--header` and the caller supplies the token.
- **Not depending on `@modelcontextprotocol/inspector`** — npx-pinned per D2.

## Risks and Unknowns

| Risk | Mitigation |
| --- | --- |
| A shallow checklist gives false confidence (the failure that retired `smoke:remote`, ADR-121) | D5 + WS3: the checklist asserts substance (verbatim corpus values, isError, floor-only omission), not liveness |
| Inspector CLI is a secondary surface of a UI-first tool; CLI stability/feature drift | Pin the version (D2); WS2 parses defensively and surfaces Err on unexpected output |
| Inspector CLI does not parallelise (internal proxy — observed 2026-06-08: batched runs emptied output) | Runner invokes sequentially; documented in WS5 |
| Cross-workspace coupling if the tool hard-codes the curriculum MCP start command | D4: server-start is parameterised (`--start-command`/`--port`/`--health-path`), defaulting to the curriculum no-auth script only as a convenience |
| npx runtime download in a gated path | D2: ad-hoc/agent-invoked only, never a network-free CI gate (ADR-161) |

## Foundation Alignment

- [`../../../directives/principles.md`](../../../directives/principles.md) — design for value;
  Strict and Complete (typed option + result shapes); build-vs-buy attestation (D2);
  vendor-agnostic agent capability.
- [`../../../directives/testing-strategy.md`](../../../directives/testing-strategy.md) +
  [`../../../directives/tdd-as-design.md`](../../../directives/tdd-as-design.md) — each cycle is a
  co-landed test+code pair; pure logic is unit-tested, the subprocess/lifecycle is the thin
  integration boundary.
- [`../../../directives/schema-first-execution.md`](../../../directives/schema-first-execution.md)
  — the harness consumes the inspector's JSON at a boundary; parse and narrow (WS2), do not widen.

## Plan-Body First-Principles Check

Per [`../../../rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md):
the **shape** is grounded in the inspector CLI behaviour verified first-hand 2026-06-08 (argv,
JSON output, error shapes, no-parallelism); the **landing path** is six co-landed TDD cycles, no
product code ahead of tests; the **vendor-literal clauses** assert only inspector CLI invocations
demonstrated to work, with the version pinned at WS5 time.

## Readiness Reviewers

Before execution starts, invoke `assumptions-expert` (plan-readiness/proportionality) and
`mcp-expert` (the inspector/MCP interaction surface). This plan is `current/` (ready-to-queue);
the review is a pre-execution gate, not skipped — it runs when the plan is picked up after the
EEF PR merge.

## Lifecycle Triggers

See [`../../templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).
Work shape: executable, queued. Touch points: start-right at session open; an active claim on
`agent-tools/src/mcp-inspector-smoke/` and `agent-tools/package.json` before the first edit;
session-handoff at boundaries; consolidation at completion (mine the README entry + retire this
plan to `archive/completed/`).
