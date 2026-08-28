# Output-schema truth fleet — verdict ledger and evidence record (2026-08-19)

Commissioned by the owner (in-session word, 2026-08-19: verify all
output-schema claims, gap-analyse them, apply counterfactual and
adversarial lenses — "go deep", built on proven truth). Executed as a
14-leg workflow fleet from the Director seat (Ocelot binds Tunnel,
c28ad9): a 2-leg design review (assumptions + frame-challenge) whose
calibrations fed the fan-out, 5 claim-verification legs over a 22-claim
ledger, 3 gap legs, 4 adversarial/counterfactual lenses. ~1.9M subagent
tokens, 12.5 minutes wall-clock, 14/14 legs returned.

**Pins.** Repository HEAD `7935f4174` on `coordination/estate-2026-08-17`
(one napkin commit ahead of the design-review calibration's `c0547d0ce`).
Vendor semantics version-pinned to the INSTALLED
`@modelcontextprotocol/sdk@1.30.0` and `@modelcontextprotocol/ext-apps@1.7.5`
(v2 SDK packages present in the store are transitive, not consumed).
Live-wire observations were made against the production MCP server and
the live upstream spec the same day. The fleet's raw journal was
session-local; this report is the durable distillation, and the operative
facts are also embedded in the `mcp-output-contracts` plan family this
evidence produced.

## The headline truth

No MCP tool on the served surface advertises `outputSchema` on any wire
path, while every SUCCESS path returns `structuredContent` — so the
server emits structured output no client has a declared contract for.
The schemas needed to change that already exist at codegen time but are
not forwardable as they stand: the emitted `toolOutputJsonSchema`
describes the wrong object (the pre-envelope upstream response), in the
wrong representation (JSON Schema, where registration takes a Zod
shape), often at the wrong root (19 of 29 are array-rooted). "The gap is
forwarding" — the prior record's framing — is refuted on four
independent grounds; the envelope composition layer the ratified July
plan designed is the correct cure, corrected for the facts below.

## Claim verdicts (the 22-claim ledger)

Verdicts by the five verification legs; every verdict was file:line-cited
and quote-anchored at the pinned HEAD. Site enumerations for universal
negatives were published per calibration (e.g. all four production
`new McpServer(` sites for C1).

**TRUE**: C1 (no outputSchema on any wire path), C3 (42 universal
definitions: 29 generated + 13 hand-built; 39 live, 3 dormant —
`get-eef-evidence`, `user-search`, `user-search-query`), C4 (single
registration loop, config `{title, description, inputSchema,
annotations}` + `_meta`), C5, C6 (codegen emits `toolOutputJsonSchema` +
`zodOutputSchema`), C7 (upstream-response validation only; zero
`outputSchema:` assignments in served source), C9 (`formatToolResponse`
carries nothing schema-shaped), C10 (oak-under-the-hood separate
registration; absence pinned by test), C12 (June record's content as
described), C14 (ADR-196 defers graph-unit wire declaration), C15
(ADR-193 vendor evidence), C18 (strict-everywhere ruling with dated
tolerance), C19 (schema-first directive had no output-schema content —
cured the same day), C20a–c, C20e–m (supporting corpus as described),
C21c (MCP-319 fence), C22 (grep false-positive classes — with the
refinement that the named classes carry a capital O and only fire on
case-insensitive search).

**PARTIAL** (claim held with corrections):

- C2 — structuredContent is on every SUCCESS path; error paths
  (`formatError`) carry none, which is load-bearing for the isError
  exemption.
- C8 — the descriptor contract omits only `_meta`, so it structurally
  inherits the protocol `Tool.outputSchema` slot (never populated);
  verified against the installed SDK's type, not ADR-193's older capture.
- C11 — the ratified plan's substance as described, but its start
  condition self-contradicts: frontmatter `depends_on: []` vs body
  prose "gated on the MCP-303 live captures" (resolved below).
- C13 — the audit's numbers hold; the forwarding-gap statement is the
  audit's CORRECTED column for claim c38, not the June plan's own claim
  (which asserted creation was needed and was graded FALSE).
- C16 — ADR-055 locations correct with a minor descriptive correction.
- C20d — the graph-tool output-schemas plan is marked ABSORBED (into the
  substrate-migration plan), not "completed"; it lives under
  `archive/completed/` regardless.
- C21a — MCP-332 is In Progress, not Done; its acceptance section is a
  forward-looking checklist, not captured evidence.
- C21b — MCP-303 is genuinely Done as a ticket, but the drive artefacts
  write to a gitignored machine-local `tmp/` path: ticket-done is not
  in-repo-referent-done, and the captures' absence in-repo is not proof
  of absence (they may be owner-held).

**FALSE**:

- C17 — ADR-058 contains no `outputSchema` mention and records no
  decision about oak-under-the-hood's schema. The durable record of that
  deliberate absence lives in the completed tool plan
  (`oak-under-the-hood.plan.md` §"No outputSchema"); ADR-058's actual
  contribution is the client-variability probe — and the content-only
  client in that probe is **Cursor**, not ChatGPT as the sweep claimed.

## What the gap legs added

- **Mismatch consequence at the installed SDK**: a declared-schema
  mismatch converts a SUCCESSFUL call into an error result for the
  client (validateToolOutput; the served surface shows it as failure) —
  green transport, silent degradation. Conformance must therefore
  assert `isError !== true` plus content on REAL calls.
- **The SDK silently drops non-object-rooted schemas from `tools/list`**
  (no else branch after `normalizeObjectSchema`) while still enforcing
  them at call time — so a registration-config assertion can half-pass
  invisibly; proof must read the serialised wire.
- **`registerAppTool` (ext-apps 1.7.5) delegates to the same
  `registerTool`** — one server-side semantics, no second validation
  path.
- **`serialiseArg` is a type-lossy transform** (bigint → string) between
  `zodOutputSchema` and the wire; contracts compose over the
  post-serialisation type.
- **`get-curriculum-model` is post-mutated** by the served-boundary
  guidance filter into an untyped record with a two-way fallback; its
  contract must model the post-filter projection and the filter should
  be made total.
- **The envelope root is data-dependent** (empty-object payload flips
  root-spread into `{data:{}}`) and **`summary`/`status` spread last**,
  clobbering same-named payload keys — two wire-correctness defects to
  fix before composing.
- **`formatData` is dead code** (zero non-test callers) carrying a
  divergent envelope shape — delete.
- **Docs gap**: the stale audit-workflow generator
  (`.agent/state/output-schema-plan-audit.workflow.js`) hardcoded a
  dead plans root; retired with a comment. Index truing list as executed
  the same day (backlog roadmap/READMEs, repo-continuity, report links).
- **Test-doctrine sweep** (the owner's absence-pin ruling): exactly one
  output-schema absence pin exists (the oak-under-the-hood
  `not.toHaveProperty('outputSchema')`) — verdict DELETE, carve-out
  inapplicable; sibling config-literal pins in the same file are the
  same shape (secondary); two adjacent negative-space tests are
  genuinely behavioural and KEPT; codegen `.toContain()` string-pin
  tests flagged as a separate, lower-severity audit-shaped concern.

## What the lenses proved

**Adversarial refuter** (target: "the only gap is forwarding") —
REFUTED on four independent grounds: (a) the served structuredContent is
an envelope, not the response (live observation:
`get-rate-limit` → `{"status":200,"data":{...},"summary":"..."}`);
(b) 19/29 generated schemas are array-rooted and would be silently
dropped from the wire; (c) the emitted JSON Schema cannot be handed to
the Zod-taking registration APIs; (d) the object-rooted generated
schemas are `.strict()`, so the injected `summary` alone would fail
every call if raw schemas were forwarded.

**Three envelope shapes on the live wire** (called first-hand):
generated `{status: <number>, data: {...}, summary}` (executor
pre-wraps); aggregated payload-at-root + `summary` + optional
`status: 'success'` (a STRING — `status` is polymorphic across the
surface under one name); app-local bespoke. The June record's
`envelope(payloadSchema)` single-composer doctrine is falsified by
served reality; two composers plus one bespoke schema are required.

**Ship-consequences (measured, not estimated)**: tools/list grows
+78.5% (75,096 → 134,010 bytes) from the generated tools alone; the
Zod→`toJsonSchemaCompat` route is 2.05× smaller than serialising the
raw JSON field (58,914 vs 120,935 bytes) — the emission-route choice is
itself a ~62KB wire decision. Cost is per CONNECTION (stateless
transport re-discovers), the advertised payload alone would exceed the
ratified 25K-token p95 response bar, and the nearest owner precedent
(ADR-058 update, 2026-07-29, MCP-366) removed a ~45-token-per-response
item on cost grounds — different units, so the honest statement is
per-session. Mitigating finding: the missing-structuredContent and
isError failure branches are largely unreachable through current
producers.

**Frame-challenge**: the plan's MECHANISM survives (the two-field
Zod-valued carrier design is vindicated by installed-SDK mechanics; the
envelope doctrine survives as corrected); its WARRANT is
client-segmented (no empirical outputSchema consumer found in the
evidence base — enforcement is the warranted value; only
structuredContent-consuming clients gain from advertisement, and the
content-only client observed is Cursor); its TIMING was wrong in one
specific way — **two served-live tools are dead on the deployed server
today** (`get-changelog`, `get-changelog-latest`: upstream removed
`/changelog` and `/changelog/latest`; 404 vs 401 discrimination proves
absence, not auth), which both outranks schema work as a defect and
mechanically blocks the 39/39 witness drive.

**Sequencing (mechanical, evidence-based)**: the 0.7.0→0.11.0 cache
staleness is NOT a schema-correctness threat — after ref-resolution and
prose-stripping, the 200-response schemas of all 32 shared paths are
byte-identical; the refresh is contract-neutral and its real content is
removing the two dead paths. MCP-303 is acceptance evidence, never a
start gate (the ratified plan's own body exempts carrier/producer
authoring; the stale "remains gated" prose was the contradiction).
The error-envelope plan is INDEPENDENT-BENEFICIAL, recommended first
(isError early-return verified at the installed SDK; adjacent functions
in one file are custody, not coupling). PR #895 owns the
registration-proof instrument custody (`connected-client.ts`, ADR-226)
that the conformance ratchet extends — WITH/soft-BEFORE. The v2 SDK
spike (MCP-506, sketch) must not open mid-carrier-landing.

## Corrections this evidence forced on the prior record

1. The June design record's single-envelope doctrine: falsified;
   archived with a supersession banner.
2. The ratified July plan: superseded by
   `mcp-output-contracts-implementation` (three-shape envelope,
   Zod-valued carrier, wire-level proof, resolved start condition,
   behavioural re-expression of its absence-pin acceptance clause per
   the owner's 2026-08-19 testing ruling).
3. The document sweep that seeded the ledger: two errors (C17's ADR
   attribution and client name) — corrected here and in the plans.
4. The fleet's own first premise ("stale cache ⇒ wrong contracts") —
   retracted by its own measurement; the calibration discipline (design
   review before fan-out; live observation over source-reading) is what
   caught it.

## Method notes for future fleets

- A 2-leg design review before the fan-out caught the single highest-
  impact gap (no leg chartered to observe a real payload) at trivial
  cost; two legs then called the live server and the synthesis pivoted
  on what came back. Source-reading cannot settle wire questions.
- `rg` skips dotdirs: documentary absence claims over `.agent/**` need
  `rg --hidden` or `git grep`, plus a published enumeration of sites
  searched. Plain `grep -r` from root traverses 40+ duplicate worktree
  checkouts.
- Universal negatives are evidence only with published enumerations;
  conjunction claims verdict per conjunct; "document says X" and "X is
  correct" are separate axes (refute-by-default kills true
  judgement-class claims).

## Where the consequences live

The `mcp-output-contracts` strategic node and its two delivery plans
(`mcp-served-surface-truth`, MCP-630; `mcp-output-contracts-implementation`,
MCP-332) — all three owner-ratified 2026-08-19 — plus the same-day
directive amendments (`testing-strategy.md` absence-pin rule;
`schema-first-execution.md` §Output Contracts) and the owner's
advertisement ruling (measure `$defs`-deduplicated emission first,
posture leans accept at the measured figure).
