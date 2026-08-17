/**
 * Help text for `agent-tools mcp-conformance` (MCP-189).
 *
 * Its own module because the entrypoint sits near the file-length ceiling and
 * this text is the part that grows: every option added, and every worked
 * example the CLI-help contract asks for, lands here rather than crowding the
 * command's logic out of its own file.
 */

/**
 * The CLI truth-set requires at least one COMPLETE, runnable invocation, not
 * only a usage template — an operator running `--help` must be able to copy a
 * line and have it work. Both operations get one, since the flags compose
 * differently for each.
 */
export const HELP_TEXT = `Usage: pnpm -s mcp:conformance --target <url> [options]
(the -s keeps stdout pure JSON: without it, pnpm's own failure reporter
appends to stdout when a failing run exits 1)

Runs MCPJam conformance suites (lockfile-installed @mcpjam/cli) against a
deployed MCP surface. Four operations:

VERDICT (default): each suite is compared BY NAME against its committed
baseline — pass requires a usable baseline, retained raw evidence, no
duplicate check ids, zero unexpected failures, and the observed skip/fail
sets exactly matching the baseline. Baselines are validated UP FRONT: a
missing or unusable baseline fails the run immediately, with no network
contact, naming the --seed path.

SEED (--seed): capture-only. Runs the suites live, retains each raw
json-summary report verbatim (the observation seed for authoring
baselines), performs no comparison, and exits 0 iff every capture
succeeded. Without --unattended, the plan drives all three suites LIVE
against the target (the oauth leg is interactive), bounded at 120s/suite.

DRIVE (--drive, MCP-303): enumerates every tool the server advertises,
invokes each once with its ADVERTISED example inputs (derived from the
wire schemas, never guessed), retains each call's raw output under
<report-dir>/tools/, and renders the reviewer walkthrough pack as a
traceable projection of the run. Exits 0 iff the tool list was usable
(non-empty, single page), every advertised tool was exercised
successfully, AND both documented outputs (summary + pack) were
written. Only tools advertising readOnlyHint: true are invoked. Takes
no --suite/--unattended (it enumerates from the server); needs
--credentials-file against an authed surface.

COMPAT (--compat): CAPTURES a per-host compatibility report for the DEPLOYED
surface — each catalogue host's verdict (works | degraded | blocked |
unknown) and the provenance grading how far that verdict can be trusted.
Pins --offline (the catalogue bundled with the resolved SDK) so the only
varying input is Oak's own surface, and --no-telemetry. ATTENDED ONLY:
reading the tool surface needs the authed surface, so it takes
--credentials-file and no --unattended, and takes no --suite (it evaluates
hosts, not suites) and no --seed/--baseline-dir (it keeps no baseline at
all — the per-commit test is the gate; this route only captures).

It reports; it does not judge. The per-commit GATE is a separate, cheaper
thing — an in-repo test that evaluates the served surface directly with no
server (apps/oak-curriculum-mcp-streamable-http/src/served-surface/
host-compatibility.integration.test.ts). This route exists to prove what the
DEPLOYMENT actually serves, which is the one question that test cannot
answer.

NOTE on compat exit semantics. The inversion is in the MCPJam CHILD, not in
this wrapper: a failed child writes NOTHING to stdout and puts a structured
error envelope on stderr (exit 1 operational, 2 usage), where a failing suite
would still emit its full report. That is why compat carries its own evidence
gate — reusing the suites' would read a failed run as a passing one. This
wrapper always emits its own aggregate JSON to stdout and to summary.json,
whatever the outcome; read its "verdict" field, never stdout's emptiness.

The wrapper's aggregate report goes to stdout AND <report-dir>/summary.json.

Examples (verdict, seed, drive, then compat):
  pnpm -s mcp:conformance --target https://mcp.example.test/mcp --unattended
  pnpm -s mcp:conformance --target https://mcp.example.test/mcp --unattended --seed
  pnpm -s mcp:conformance --target https://mcp.example.test/mcp --drive --credentials-file tmp/creds.json
  pnpm -s mcp:conformance --target https://mcp.example.test/mcp --compat --credentials-file tmp/creds.json

Options:
  --target <url>             MCP server URL (required), e.g. https://<host>/mcp
  --unattended               Headless credential-free plan (protocol + oauth DCR
                             discovery legs); forbids --credentials-file
  --seed                     Capture-only operation (no baseline verdicts)
  --suite <name>             protocol | apps | oauth (repeatable, no duplicates;
                             default: the mode's full plan)
  --credentials-file <path>  OAuth credentials file for authed suites
  --report-dir <path>        Raw-report dir, absolute or repo-root-relative
                             (default tmp/mcp-conformance/<utc-stamp>)
  --baseline-dir <path>      Baseline dir (default: the committed baselines)
  --drive                    Drive operation: exercise every advertised tool,
                             render the reviewer pack
  --compat                   Compat operation: capture per-host compatibility
                             verdicts for the deployed surface. Reports; does
                             not judge. Attended only; takes no
                             --suite/--unattended/--seed
  --pack-out <path>          Reviewer-pack output path (drive only; default
                             <report-dir>/reviewer-pack.md)
  --preamble-file <path>     JSON with the pack's owner-approved preamble
                             sentences (drive only; unmistakable placeholders
                             otherwise)
  -h, --help                 Show this help
`;
