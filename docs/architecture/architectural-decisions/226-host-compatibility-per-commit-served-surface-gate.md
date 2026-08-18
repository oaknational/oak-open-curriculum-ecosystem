# ADR-226: MCP Apps widget compatibility as a per-commit served-surface gate, judged by the vendor's pinned capability catalogue

**Status**: Proposed
**Date**: 2026-08-15
**Related**:
[ADR-041](041-workspace-structure-option-a.md) — workspace tiers and
dependency direction (apps are leaves; `agent-tools` cannot import them);
[ADR-141](141-mcp-apps-standard-primary.md) — the MCP Apps `_meta` contract
the evaluation reads;
[ADR-147](147-browser-accessibility-as-blocking-quality-gate.md) — precedent:
a vendor engine as a blocking quality gate;
[ADR-159](159-per-workspace-vendor-cli-ownership.md) — vendor CLI ownership
(covers the CLI-wrap consumption mode, not this SDK-import mode);
[ADR-161](161-network-free-pr-check-ci-boundary.md) — the network-free CI
boundary this gate complies with. Mechanism, flags, owner gates, and routed
findings live in the delivery plan (`mcp-compat-host-checking`), which
references this ADR — plans cite ADRs, never the reverse (PDR-105).

## Context

Whether Oak's served MCP surface works inside the AI hosts teachers reach it
through (Claude, ChatGPT, Cursor, and the rest) is the release bet's own
success condition, and until this decision nothing in the repository answered
it. MCPJam ships two consumption modes for the same host-compatibility
capability: a CLI (`mcpjam compat`) that needs a running server, and an
importable engine (`@mcpjam/sdk/host-compat`) documented for building
compatibility checks into CI. The repository already wraps the vendor's CLI
for conformance suites (MCP-189, under the ADR-159 pattern); that landing
carried no architecture record, so nothing permanent records MCPJam as a
compatibility instrument at all. This ADR records the whole posture,
covering the MCP-189 CLI-wrap half by reference.

## Decision

**The app's served surface is evaluated against MCPJam's host-capability
catalogue on every commit, inside the app's own test suite, using the
vendor's engine imported directly.**

### Placement: the gate lives in the app

The evaluation runs over the app's real composition root (`tools/list` and
`resources/read` through an in-memory transport, with the committed generated
widget bytes injected) because the composition root is the only non-drifting
definition of what is served. Dependency direction makes `agent-tools`
placement impossible (ADR-041: apps are leaves), and re-deriving the served
surface outside the app is exactly the drift the gate exists to catch — an
earlier attempt read the raw tool registry and confidently evaluated a
dormant widget the server never serves.

### The vendor edge: test-only, pinned, silent

`@mcpjam/sdk` enters the app as an exactly-pinned devDependency with no
runtime import path (verified against the build graph's entry points). The
evaluation uses the catalogue bundled with the resolved SDK, so a verdict
moves only on a deliberate dependency upgrade, never on an upstream publish.
The evaluation is network-free by construction (ADR-161), and every spawn of
the vendor's CLI elsewhere in the estate sets the vendor's telemetry
kill-switch env vars, so no vendor channel reports from Oak runs.

### What the gate asserts — and deliberately does not

The gate's scope is **MCP Apps / widget compatibility**: the tools and widget
lanes of the vendor's model — what a CONNECTED host would do with what Oak
serves. The evaluation supplies no connection facts, so the vendor's
protocol-negotiation lane is not evaluated: a host that cannot initialise
against the server's supported MCP protocol versions is outside this gate's
sight (review-narrowed 2026-08-18; the per-host protocol check is a named
follow-up on MCP-605, and passing the generic test client's negotiated
version would not be a substitute — a server can accept several versions at
once, so a modern client's success says nothing about an older host's).

Per-commit assertions: no host `blocked`, no verdict `unknown`, exactly one
tool carrying `_meta.ui`, and no text-fallback in Claude or ChatGPT. The
vendor's `capability_unsupported` findings are deliberately excluded, because
the mechanism cannot work for a widget of this shape. The vendor derives them
by regex over widget HTML; a self-contained MCP Apps widget inlines its SDK,
and the scanned strings live in that SDK's Zod schema definitions — the
protocol vocabulary, including `.describe()` copy such as "Host supports file
downloads via ui/download-file". Tree-shaking cannot remove them: the widget
needs those schemas to speak to a host at all. Measured on this widget, all
seven patterns match the built bundle and none match the authored source, so
every correctly-built widget reports as needing every capability. NOT yet
reported upstream (as of 2026-08-17); the cure is the vendor's — scope the
scan to authored code, or read declared needs from `_meta`. Those findings
are degraded-severity, so the exclusion cannot mask a blocking regression.

### The qualification/regression split

A catalogue verdict is a claim about a capability model, not about a
rendered widget — nothing in the bundled catalogue carries `observed`
provenance. The static gate is therefore the ongoing regression guard;
whether release claims additionally require one-time live-render evidence
per bar host is an owner gate recorded in the delivery plan, and the release
host bar, once ruled, is recorded here or referenced from here rather than
in a plan field alone.

## Rationale

- The composition root is the served surface; asking anything else answers a
  different question.
- A pinned bundled catalogue keeps the gate deterministic: the only varying
  input between runs is Oak's own surface.
- The engine-import mode is the vendor's documented route for CI checks and
  removes the server, credentials, and network the CLI mode needs.
- Every load-bearing assertion is mutation-checked: app-only visibility
  fails the blocked assertion; a stale widget resource URI fails the
  determinate-verdict assertion; the wrapper's exit-code gate, target
  identity check, and strict schemas each have a demonstrated failing
  mutant.

## Alternatives rejected

### A baseline-comparison gate on the live capture

Built and removed deliberately. The static check already gates every commit;
a second gate would mean a committed snapshot to maintain, a re-seed decision
every time it moved, and adjudicating the vendor scan's false reds — for a
question the per-commit test already answers. The test IS the baseline. The
on-demand `--compat` capture (agent-tools) therefore reports and retains but
never judges.

### Evaluating the tool registry instead of the composition root

Tried first; it evaluated a dormant widget the server never serves. A
confident answer about something unreachable is worse than no answer.

### Re-deriving the served surface in agent-tools

Impossible without inverting the dependency direction (ADR-041), and any
re-derivation drifts from the app by construction.

### Wrapping the CLI for the per-commit check

The CLI mode needs a running server and credentials, which puts it outside
the network-free CI boundary (ADR-161); it remains the right mode for the
attended deployed-surface capture, where proving what the deployment serves
is the point.

## Consequences

- An `@mcpjam/sdk` version bump can legitimately fail the app's suite: a
  catalogue update that changes a host's capabilities changes verdicts. That
  is the gate working — the failure names the host, and the dependency
  maintainer adjudicates deliberately instead of a teacher discovering it.
- The app carries a large third-party dev tree (security-reviewed
  2026-08-15: no runtime edge, no import-time side effects on the test
  path, install scripts closed by the workspace allowlist).
- The vendor's widget-HTML capability scan stays untrusted until the
  upstream bug is fixed; any future assertion on `capability_unsupported`
  findings must first re-verify the scan against authored source.

## Compliance questions

- Does any runtime module of the app import `@mcpjam/sdk`? (Must stay no.)
- Does the per-commit evaluation reach the network or need credentials?
  (Must stay no.)
- Did a catalogue-bearing dependency bump change any host verdict, and was
  the change adjudicated in the PR rather than absorbed silently?
