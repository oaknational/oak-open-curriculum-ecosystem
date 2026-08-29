---
id: mcp-compat-host-checking
node_type: delivery
name: "MCPJam MCP Apps widget compatibility checking"
overview: "Check whether Oak's MCP Apps widget works in the AI hosts teachers reach the served surface through — on every commit, and on demand against the deployment. Covers the tools and widget lanes; protocol-version negotiation is a named follow-up."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - conformance-and-standards
  - served-surface
tickets:
  - MCP-605
depends_on: []
owner_gates: []
last_updated: 2026-08-29
---

# MCPJam MCP Apps widget compatibility checking

Lineage: extends the `agent-tools mcp-conformance` harness landed under
MCP-189, which wraps the lockfile-pinned `@mcpjam/cli`. The architecture
decision — app-side gate placement, the vendor-catalogue oracle, the
rejected baseline gate — is recorded in
[ADR-226](../../../docs/architecture/architectural-decisions/226-host-compatibility-per-commit-served-surface-gate.md);
this plan carries the mechanism.

## Goal

Nothing currently tells us whether Oak's served surface works in Claude,
ChatGPT, Cursor or the rest. When this lands, a change that puts a host
beyond use — or leaves the engine unable to reach a verdict — fails a check
on the commit that makes it, with the host named.

Scope (review-narrowed 2026-08-18): the gate judges MCP Apps / widget
compatibility — the tools and widget lanes of the vendor's model, for a host
that has already connected. It supplies no connection facts, so
protocol-version negotiation is not evaluated; the per-host protocol check
is a named follow-up on MCP-605.

Stated precisely, because the gate is narrower than "any degradation fails".
It fails on: a `blocked` verdict anywhere, an `unknown` verdict anywhere, the
widget-bearing tool set changing, a paginated tool list, and Claude or
ChatGPT dropping to a text fallback. A NEW degradation in another host does
not fail it — degradation is the expected state for the seven hosts that
render no widgets at all, and a threshold that fired on it would be red from
the first run.

## Mechanism

Two checks. They answer different questions and neither replaces the other.

### Static — every commit, no server

An in-repo test at
`apps/oak-curriculum-mcp-streamable-http/src/served-surface/host-compatibility.integration.test.ts`,
beside the other served-surface proofs. It asks the in-memory composition
root for its tool list and its widget, evaluates them against MCPJam's host
catalogue, and asserts: no host is blocked, no verdict is `unknown`, exactly
one tool serves a widget, and the widget renders in Claude and ChatGPT.

Two decisions carry it. It uses MCPJam's engine **directly** — their
documented route for this (changelog 2026-06-26: "the shared
host-compatibility engine is now importable directly … to build your own
compatibility checks in CI or custom tooling") — so no server, no network, no
credentials. And it asks the **composition root**, never the raw tool
registry: an earlier attempt read the registry and evaluated a DORMANT widget
the server never serves, giving a confident answer about something
unreachable. Asking the composition root cannot drift from what is served,
because it is what is served.

It lives in the app because that is where the served surface is defined.
`agent-tools` cannot see it — apps are leaves in the dependency direction —
and reconstructing it there would reintroduce exactly the drift above.

### Live — on demand, against the deployment

`pnpm mcp:conformance --compat --credentials-file <path>` captures the
per-host report for the real deployed surface, retains it, and prints it. It
reports; it does not judge.

Attended only: reading the tool surface needs the authed surface, so it
cannot live in the credential-free CI workflow. It exists because the static
check proves what the code says should be served, and only a live run proves
what IS served.

The capture pins `--offline` (the catalogue bundled with the resolved SDK, so
an upstream publish cannot move a verdict underneath us) and
`--no-telemetry`.

### The inverted exit contract

Verified first-hand against the pinned CLI: a failed `compat` CHILD writes
ZERO bytes to stdout and a structured envelope to stderr, exiting 1
(operational) or 2 (usage). The three suites do the opposite — a failing
suite still writes its full report to stdout, so its exit code is
verdict-neutral. Reusing the suites' evidence gate would therefore read a
failed compat run as a passing one. Compat carries its own gate, and the
vendor's error code and message ride the failure reason — redacted, never
reinterpreted.

The inversion is the CHILD's, not this wrapper's. The wrapper always emits
its own aggregate JSON to stdout and `summary.json`, whatever the outcome;
its `verdict` field is the contract, and empty wrapper stdout means the
wrapper itself failed, not that the run did.

## Acceptance criteria (each with a proof — required)

1. **A change to the served surface that blocks a host fails a check on the
   commit that makes it.** Proof: `repo-safe` — the app's
   `host-compatibility.integration.test.ts`, mutation-checked (a wrong
   expectation fails it).
2. **A failed live capture can never read as a pass, and reports the
   vendor's own cause.** Proof: `repo-safe` — unit tests over the real
   captured failure envelope, mutation-checked against removing the
   exit-code gate.
3. **The static check evaluates exactly the served surface, never the raw
   registry.** Proof: `repo-safe` — the test asserts the widget-bearing tool
   set is exactly `['get-curriculum-model']`; a dormant widget going live
   fails it.
4. **A vendor report-shape change surfaces at the boundary rather than
   flowing into a verdict.** Proof: `repo-safe` — strict schema tests,
   mutation-checked against removing `.strict()`.
5. **The release bar and the evidence rule are recorded decisions.** Proof:
   `owner-held` — both ruled by the owner 2026-08-29, recorded in §Owner
   decisions: Gemini out of scope; the checker is a protective layer whose
   verdicts are never unequivocal, and platform testing owns the release
   claim.

## Owner decisions (both ruled — owner, 2026-08-29)

### Gemini, and the host bar

**Ruled: Gemini is out of scope.** Background that stands: the consumer
Gemini app carries no user-configurable MCP connection at all (checked
2026-08-15; custom MCP exists in Gemini Spark, and in Gemini Enterprise as
an admin-managed connector), so there was no mass-market Gemini surface to
test in any case.

The other half of the original question — naming a release-compatibility
host set — is dissolved by the second ruling: this checker underwrites no
release set, so there is no tool-backed bar to name. The bundled catalogue's
16 hosts (`mcpjam`, `claude`, `claude-code`, `chatgpt`, `mistral`, `goose`,
`slack`, `cursor`, `codex`, `copilot`, `vscode`, `agentcore`, `n8n`,
`perplexity`, `cline`, `notion`) remain what the checks evaluate, not what
Oak promises.

### Is a static verdict enough?

**Ruled: no — and it never will be.** The checker is not a substitute for
testing in the platforms; it is a layer of protection, and its verdicts must
never be read as unequivocal. Testing in the real platforms owns the
"works in X" claim; these checks are the regression tripwire behind it.

The data that motivated the question still grounds the ruling: every
catalogue host's facts carry a `provenance` grading, nothing in the
catalogue is `observed` (the 16 hosts grade 9 `probe`, 4 `vendor-doc`,
3 `assumed`; `claude` is `assumed`), so a static verdict is a claim about a
capability model, not about reality.

## Out of scope

- **A baseline-comparison gate on the live capture.** Built and removed
  deliberately: the static check already gates on every commit, and a second
  gate would mean a committed snapshot to maintain, a re-seed decision each
  time it moved, and adjudicating false reds from the vendor scan below. The
  test IS the baseline.
- **Trusting `capability_unsupported` findings.** The vendor derives them by
  regex over the widget HTML, and the scan cannot work for a self-contained
  widget. MCP Apps widgets ship as one document with the SDK inlined, and the
  scanned strings live in the SDK's own Zod schema definitions — the protocol
  vocabulary, including `.describe()` text such as "Host supports file
  downloads via ui/download-file". Tree-shaking cannot remove them: the widget
  needs those schemas to speak to a host at all. Measured on Oak's widget, all
  seven patterns match the built bundle and none match the authored source;
  the widget is a branding banner that calls none of them. So every
  correctly-built widget is reported as needing every capability. The cure is
  upstream — scope the scan to authored code, or read declared needs from
  `_meta`; not reported yet.
- **Gemini coverage** — see the gate.
- **Live-render qualification itself** — no capability in this repository
  renders an Oak widget inside a host and judges it. If the owner rules it
  in, that is a separate build.
- **A flag-level telemetry fix for the three existing suites** — their argv
  still omits `--no-telemetry`. The environment gate below already covers
  them in practice; aligning the flags is the suites' own story.

## Findings to route

Three, none blocking this work:

1. **The alpha refuses strict OAuth clients.** Its protected-resource
   metadata declares a resource indicator on the canonical host while the
   server answers on the alpha host; MCPJam refuses the cross-origin
   indicator, correctly. Production is unaffected — the indicator matches
   there — but the alpha cannot be used for spec-strict client testing.
2. **The MCPJam capability scan over-reports** (above). Unreported upstream
   as of 2026-08-15.
3. **The telemetry gate reaches further than this lane.** It lives in the
   shared spawn seam, so the three existing suites and `--drive` now launch
   with the kill-switch too. That is the right outcome and it was not this
   lane's to decide — recorded so the suites' owners know their runs changed.
   Nothing of ours was ever sent: the vendor's single `capture()` fires on an
   eval feature this repo never invokes.

## Where the first-principles check fires

- **Shape** — the criteria prove the wrapper's and the app's own behaviour,
  never "MCPJam did its job".
- **Landing-path** — the static check lands in the app's own test directory
  so it runs with the app's suite; the live command's smoke case joins the
  existing `test:e2e` chain.
- **Vendor-literal** — every vendor literal here (the compat flags, the
  verdict and provenance enums, the finding codes, the failure shape and
  exit codes, the 16 host ids, the engine's exported functions) was read
  first-hand from the lockfile-resolved CLI and SDK, and the failure shape
  was executed against the deployed surface.
- **Optionality-surface** — the two open questions are expiring owner gates
  with stated verdicts, not hedges in the mechanism.
- **Record-consumer** — no ledger is added; the checks' readers are the test
  runner and a human reading a capture.
- **Rules-tier** — screened; the live findings were `replace-dont-bridge`
  (compat as a suite), `never-disable-checks` (a CI variant with auth
  disabled, declined), and `strict-validation-at-boundary`.
