---
id: claim-freshness-and-guard-degraded-states
node_type: delivery
name: "Claim freshness pilot and guard degraded-state evolution"
overview: "Perishable platform claims carry dated freshness metadata and a closed pin declaration under a clock-free integrity validator; a separately carried SessionStart landing will enforce expiry and pin drift. The PreToolUse guard's availability failures degrade to a permission ask with a durable log, never a silent allow or a bricked session."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-08-11
ratified_where: "Owner answered 'Yes — ratify via merge-drive word' on the #745 ratification card, recorded by Director session Plover lifts Troposphere (b10c37)"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets:
  - MCP-476
  - MCP-477
depends_on: []
owner_gates: []
last_updated: 2026-08-11
---

# Claim freshness pilot and guard degraded-state evolution

## Owner ruling this plan implements

Owner direction, 2026-08-03 (verbatim in ADR-223 and on MCP-476/477):
perishable claims carry a decay model in metadata plus a validator; the
review-value horizon is a convolution of falsification likelihood and
reliance risk, ~100% at 30 days for the fast class; and the failure
posture — **"fail open and noisy for tools, fail hard and fast and
noisy for product code so we can fix it."** Scope note, load-bearing:
the tools arm governs a tool's *availability* failures, never its
*verdicts* — a matched blocked pattern, a doctrine block, or a
deliberate arbitration refusal still denies hard.

## Goal

(1) Every recorded platform-capability claim in the piloted surface
carries when it was grounded, a closed declaration of whether a
version is pinned or deliberately not tracked (with a reason), and
when it must be re-verified. Landing 1 makes that record structurally
complete and exposes its monitoring inventory, but does **not** yet
prevent invisible expiry: the separately carried landing 2 adds the
SessionStart consumer and enforcement. (2) The
PreToolUse guard's availability failures — missing or broken artefact,
unreadable or malformed policy file, unreadable hook input, an
unrecognisable payload with no tool-call shape — surface as a
permission **ask** with a fixed instructive reason and a durable log
line, so a human can wave through the very command that repairs the
guard. Verdicts and refusals of recognisable-but-malformed tool
payloads stay hard.

## Mechanism

**Freshness pilot (MCP-476), split into two independently reviewable
landings.** Each `platform_support` row in `.agent/hooks/policy.json`
gains `grounded_at` (that row's own evidence date, never back-stamped),
a required closed `pin` declaration, and `review_by` (`grounded_at` +
30 days; fast-referent × high-reliance ceiling). `pin` is exactly one
of `{ kind: "pinned", version: <bare x.y.z version> }` or
`{ kind: "not-tracked", reason: <non-empty string> }`; legacy
`pinned_to`, nulls, mixed arms, and extra keys are integrity defects.
`not-tracked` is an evidence-bounded declaration, not a pin obligation
and not a permanent exemption from review.

Landing 1 is carried by PR #745:

- `validate-claim-freshness` (agent-tools, wired into
  `repo-validators:check`): deterministic, clock-free. Missing fields,
  malformed dates, `review_by` not after `grounded_at`, or interval
  over the surface's registered ceiling fail hard. Pure rule functions;
  a pure `decideFreshnessOutcome(assessment)` returns
  `{ exitCode, reportLines }`. Integrity defects exit 1 with lines
  naming the field. A valid surface exits 0 and emits a bounded
  inventory: pinned monitoring obligations, declared-not-tracked rows
  with their reasons, and an explicit statement that SessionStart
  enforcement arrives in landing 2. This report-only inventory is the
  owner-directed staging exception to the earlier no-warning design;
  neither this plan nor ADR-223 treats it as prevention or enforcement.
  The ceiling is a
  registry parameter injected into the rules (tests probe with a
  non-default value; no config pinning). Separate from
  `validate-policy-reappraisal` (different remit: decay contract vs
  content doctrine; the registry carries per-surface risk class);
  existing JSON/object helpers are reused while the strict calendar-date
  and interval rules remain local to this validator.
- README guidance, ADR-223, and this plan are trued in the same landing,
  so the schema and its current enforcement boundary have live
  consumers and no misleading completeness claim.

Landing 2 is a concrete successor PR under MCP-476, carried on
`jimcresswell/mcp-476-claim-freshness-session-instrument`:

- **Session-open drift instrument** `check-claim-freshness` (clock and
  environment arm): expired `review_by` and pin-drift among `pinned`
  rows
  inject repeating session-open context and surface via a pure
  health-probe extension. Delivered through a **generic parameterised
  SessionStart shim** — `.claude/hooks/session-drift-alert.mjs
  <checker-dist-path> <label>` — registered twice in
  `.claude/settings.json` `hooks.SessionStart` (migrating the existing
  `plan-gate-drift-alert.mjs` registration to it, timeout 15, and
  adding the claim-freshness registration, timeout 15): the
  consolidate-at-second-consumer cure. Registrations use the
  execution-mode-independent form the PreToolUse guard already uses —
  `node "${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/session-drift-alert.mjs"
  <checker> <label>`. Round 3 found the then-current
  `plan-gate-drift-alert.mjs` registration bare-path and non-executable.
  **Dated correction (2026-08-11):** commit
  `SHA:e9ac696362120153757f3046b776e91829570e52`
  restored mode `100755` on 2026-08-06, so the hook no longer exits 126
  and Landing 2 does not revive an inert registration. The generic
  `node ...` migration remains required for execution-mode independence
  and second-consumer consolidation. The checker
  treats an unreadable or malformed policy file as its own alert
  condition ("the freshness surface itself cannot be read"), never a
  silent failure — the tamper case must not silence the instrument
  named as its compensating control. At landing no row is expired, so
  the first observable conditions are expiry and drift among pinned
  rows; declared-not-tracked rows remain named inventory with their
  reasons and are not passed to the version collector.
- **Pin-drift collector spec** (security-reviewed shape): no shell; an
  explicit allow-list of binary names resolved against a fixed list of
  absolute candidate directories (no PATH search; skipped when
  resolution lands inside the repo or a world-writable directory);
  scrubbed spawn env; `stdio: ['ignore','pipe','ignore']`; short
  timeout with `SIGKILL` and a hard byte cap on captured stdout (cap
  hit ⇒ child killed, no pin reported); version extracted by a strict
  `\d+\.\d+\.\d+` match; only the extracted version plus fixed prose is
  ever injected — never raw child output. Unit proofs feed
  adversarial-stdout, unbounded-stream, and never-exits fixtures and
  assert nothing beyond the matched version is injected.

Landing 2 also extends the health probe and records its first live
SessionStart observation. It also adds a mirror-census proof over the
known residual version-stamped surfaces (`.codex/README.md`,
`agent-tools/docs/agent-identity.md`, the cross-platform surface matrix,
and `policy.json` row notes): dated historical observations may remain,
but any prose claiming a current pin must either match the canonical
`platform_support.*.pin` value or point to it. Until Landing 2 lands,
expiry and pin drift are not enforced and the landing-1 inventory is
informational only.

**Slice 2 — guard degraded states (MCP-477).** Child-process + dist
architecture retained (D11). Changes:

- **Dispatcher**: failures are classified by a **closed set of tagged
  error types thrown at their source** — `PolicyUnavailableError`
  (snapshot read/parse/schema), `HookInputUnreadableError` (stdin
  stream/JSON failure),
  `NoRouteError` with the **fail-closed default inverted round-3-wise**:
  a zero-route payload REFUSES hard (exit 2 — the two pinned Copilot
  lifecycle-batch tests keep their assertions and comment) unless it is
  **provably actionless** by a closed predicate: not a JSON object, or
  an object carrying no string value under any command/content/path-ish
  key (`command`, `content`, `new_string`, `new_source`, `file_text`,
  `file_path`, `path`, `args`, `arguments`, `edits`) in any
  tool-argument container — only that actionless class is availability
  drift → ask, because every PreToolUse payload IS a tool call and an
  unrecognised envelope is the vendor-drift case, not a non-tool case.
  `PolicyUnavailableError` is tagged at BOTH failure sites — the
  read/`JSON.parse` arm inside `loadPolicySnapshot` AND the schema
  rethrow in `unwrapPolicySection` — with message text preserved. The
  catch boundary tests `instanceof`; **any untagged throw defaults
  fail-closed (exit 2)** — message inspection never classifies.
  Availability classes write their durable record through an injected
  `appendDegradedLog` seam on `RunPreToolUseDispatchOptions`. Availability outcomes render as
  one `ask` decision line with a **fixed, hand-written, per-class
  reason** (class + repair instruction; the policy-load reason names
  the tamper hypothesis: "the hook policy failed to load — the guard is
  down; check for an unexpected edit to .agent/hooks/policy.json before
  approving"); raw diagnostics go only to the durable log,
  path-redacted to repo-relative. The renderer/dispatcher stdout seam
  carries a written-flag: the catch boundary emits its ask only when no
  decision byte has been written; otherwise stderr + exit 2.
- **Shim** (`run-pretooluse-guard.mjs`, name and PreToolUse wiring
  unchanged): spawns with `stdio: ['inherit','pipe','inherit']`,
  buffers the child's stdout, and applies a **content predicate, not a
  byte count**: a decision is present when the buffer ends in a newline
  and its last line parses as JSON — present ⇒ forward verbatim and
  exit 0 regardless of child exit/signal; absent (zero bytes or a
  partial/unparseable buffer) ⇒ discard the partial bytes and emit
  exactly one shim ask line + log + exit 0. The dispatch entry point
  gains flush discipline (`process.exitCode` + drain, never a hard exit
  racing a piped stdout write). The pure surface is
  `decideShimEmission({ bufferedStdout, code, signal })`; spawn wiring
  is proven at smoke tier only.
  Every shim exit is enumerated with a posture: missing artefact ⇒
  ask + log; missing argv ⇒ ask + log; spawn error ⇒ ask + log; child
  signal/exit-1 (or any exit outside {0,2}) ⇒ ask + log; child exit 0/2
  with output ⇒ pass-through. The degraded-decision functions stay in
  committed, unit-tested TS, but the shim carries an **inline literal
  last-resort ask** in its import catch, so the failure path performs
  no type stripping and no repo imports (D7 made true). The ADR-167
  durable log write is retained on every degraded path; reasons remain
  payload-free (redaction proven with secret-shaped discriminating
  fixtures on the TWO inputs that can carry hostile text — the child
  `error.message`, and the stdin JSON-parse diagnostic, whose V8
  message quotes the input head, so the stdin class logs a fixed line
  plus non-content facts only — never the parse error text — alongside
  the child
  `error.message`).
- **`.claude/settings.json` changes are scoped and named**: the
  SessionStart registrations (freshness landing 2) and, if the D8
  timeout probe confirms discard-and-proceed, a raised PreToolUse
  `timeout` with the measured cold-start margin. The PreToolUse matcher
  **commands** do not change.

Consumers re-cut in-slice: dispatcher integration tests (tagged-type
discrimination via the injected `loadSnapshot`/route seams, which must
reject with UNTAGGED production-shaped errors so the proof exercises
production's tagging sites, never the mock's),
`policy-snapshot.integration.test.ts` (its error-identity and
`SyntaxError` assertions re-cut in the same commit as the tagged
types), shim decision unit tests, the cold-start smoke (pass-through fidelity: reads
one live `pattern` from the policy file at spawn — no policy content
hardcoded — plus the degraded case asserting one ask line AND one
appended `hook-errors.log` entry under a `mkdtemp`
`CLAUDE_PROJECT_DIR`), hook README (failure semantics AND the porting
contract's zero/multi-route clause), ADR-167 Limitation §6, surface
matrix, hook-activation research note, `claude_code` row re-ground, and
a dated supersession note in
`first-class-copilot-cli-policy-enforcement.plan.md`.

## Decision record (decision-complete)

- **D1 — posture mapping.** Availability → open + noisy (ask + durable
  log); record/product defects at edit time → hard + fast + noisy.
  Owner ruling 2026-08-03.
- **D2 — explicit dates; registry-held classification; no decay
  engine.**
- **D3 — expiry is a session-open concern, never a gate concern.**
  Gate validator clock-free; expiry/pin-drift at session open + health
  probe. Landing 1's bounded inventory is a dated, owner-directed
  staging exception: it names the missing landing-2 enforcement and
  must not be described as a prevention mechanism. The originally
  proposed free-standing expiry warning remains rejected.
- **D4 — verdicts never degrade.** Deny, multi-route ambiguity,
  matched-route extraction failures, and tool-shaped zero-route
  refusals all stay hard.
- **D5 — broken guard becomes ask, not block** (supersedes the
  fail-closed-broken posture here and its proof row in the Copilot
  enforcement plan, dated note there). Owner ruling (tools arm).
- **D6 — availability taxonomy, honest producibility.** Ask classes:
  policy snapshot load failure, hook stdin unreadable, shapeless
  zero-route, and the shim's own environmental exits (missing artefact
  / argv / spawn error / child crash). Producibility stated honestly:
  policy-load failure can also be produced by a repo edit the guard
  permits — the compensating controls are the ask interlock, the
  tamper-naming reason, the durable log, and the session instrument.
  Classification is by tagged error type at the source; **untagged
  throws default fail-closed**.
- **D7 — vendor hook contract (v2.1.220, dated 2026-08-03, one clause
  CONTESTED).** `permissionDecision` ∈ {allow, deny, ask, defer}; `ask`
  floors auto-mode to a prompt (changelog 2.1.218). Exit 1: proceeds,
  and per ADR-167 is effectively silent — hence the durable log and the
  shim's plain-`.mjs`, zero-import failure path. **Timeout: docs say
  blocks; the installed harness carries "hook timed out — output
  discarded", implying proceed.** Contested → probed in D8; until
  probed, treated as a possible silent-allow availability residual.
- **D8 — pre-merge probes with pre-agreed outcome mapping.** Probe
  `ask` under (a) headless `claude -p`, (b) `bypassPermissions`, (c) a
  Task subagent, and (d) the timeout behaviour (slow hook + blocked
  command). Mapping, agreed now: ask ≡ silent allow somewhere → merge
  proceeds, durable log + health probe are the named compensating
  record, posture noted to the owner at the ratification gate; ask ≡
  refusal in unattended contexts → merge proceeds with ONE class
  re-split: missing-artefact reverts to today's loud logged allow (the
  install/rebuild catch-22 argument is untouched and the tools arm
  points open), remaining ask classes accept unattended refusal (rare,
  tamper-suspicious, durably logged); timeout ≡ discard-and-proceed →
  raise the PreToolUse timeout with measured margin and record the
  residual. Any outcome outside this mapping (ask errors, hangs) →
  Slice 2 holds and a conditional owner gate is added. All results
  dated in the verification record and on the `claude_code` row pin.
- **D9 — Copilot CLI, corrected exposure.** Degraded ask on a host
  that ignores the field = allow + log. For Copilot that reproduces
  today's behaviour for the missing-artefact class but moves the
  policy-load / stdin / shapeless-zero-route classes from block to
  allow+log — as do the shim's own classes (spawn error, child
  crash/signal/non-{0,2} exit, decision-module import failure). That is
  the tools arm applied to Copilot, recorded here as an owner-visible
  choice at the ratification gate, and the README failure-semantics
  rewrite carries the same per-host exposure; zero-route refusals
  (including the actual observed Copilot lifecycle batches)
  stay exit-2. First Copilot session after landing records observed
  handling in the surface matrix.
- **D10 — PDR-133 §8 alignment** (pins, honest holes, drift
  short-circuit; ADR-223 cites it).
- **D11 — source-direct execution: considered and falsified**
  (adversarial round 1, 2026-08-03: `zod` + `@oaknational/result`
  dist-only exports; `esm-import-extensions` gate; ungated `.ts` entry;
  PATH-Node silent-open). Revisit only as a separately-priced
  dependency-free-graph design.
- **D12 — honest grounding dates**; minting-already-expired passes the
  clock-free gate and fires the session instrument next open (stated
  residual).
- **D13 — prose mirrors: pointer dedup now; registry follow-up owns
  mirror validation.**
- **D14 — no bypass surfaces; no-caller-payload invariant on every
  degraded reason.**
- **D15 — one generic SessionStart drift shim, parameterised**, two
  registrations in landing 2 (consolidate-at-second-consumer applied
  at the second consumer, migrating the first).
- **D16 — single-decision-line invariant by mechanism** (piped child
  stdout + zero-byte condition at the shim; written-flag at the
  dispatcher catch).
- **D17 — fixed per-class reason strings**; diagnostics only in the
  durable log, repo-relative; never an interpolated raw
  `error.message` in a reason.

## First-principles check (plan-body-first-principles-check)

1. **Shape** — pure rule/outcome/decision functions over literal
   fixtures (no `.agent/**` reads in tests); dispatcher integration
   tests discriminate by tagged type through injected seams; spawn
   proofs at smoke tier; no wall-clock ceilings in gated tests (the
   cold-start timing is a one-off measured record); discriminating
   fixtures named (malformed dates `'2026-02-30'`, `'2026-8-3'`,
   `'2026-13-01'`; secret-shaped redaction fixture; two-key/two-pin
   notice fixtures; adversarial collector stdout).
2. **Landing path** — validator in `repo-validators:check`; smokes in
   `agent-tools/smoke-tests/` wired via `test:e2e`
   (`smoke:codex-session-alert-bootstrap` shape for the SessionStart
   shim: build, spawn against a `mkdtemp` fixture root); shim stays
   `.mjs` thin IO with decision logic in tested TS.
3. **Vendor literal / locus** — D7 values dated and one clause marked
   contested with its probe; PDR-133 §8 / ADR-167 / the pinned Copilot
   tests read first-hand; artefact/command constants unchanged.
4. **Optionality** — probe outcomes pre-mapped (D8); follow-ups are
   named pointers; no bare deferrals.
5. **Record consumer** — in landing 1, freshness metadata is read by
   the gate validator and row editors; the gate changes the decision
   from accept to repair on malformed or incomplete records and emits
   a report-only monitoring inventory on valid records. Landing 2 adds
   the SessionStart and health-probe consumers that change the
   rely-or-reverify decision for expiry and pin drift.
6. **Rules tier** — screened: `no-warning-toleration` (the bounded
   report-only landing-1 inventory is a dated owner-directed staging
   exception and explicitly names its absent enforcement consumer);
   `never-disable-checks`; `replace-dont-bridge`;
   `no-escape-hatches-in-enforcement`; `validators-must-recompute`;
   `test-immediate-fails`; `hook-policy-substring-discipline` (fire/no-
   fire probe A9); **`consolidate-at-second-consumer`** (D15).

## Acceptance criteria (each with a proof)

1. Freshness rules — **repo-safe**: unit tests over literal fixtures
   incl. the named malformed-date set and an injected non-default
   ceiling: missing field / malformed date / `review_by` ≤
   `grounded_at` / interval > ceiling ⇒ integrity findings. `pin` is a
   strict closed union: missing/scalar/null/unknown kind/empty or
  whitespace or prefixed version/wrong-arm extra/legacy `pinned_to` ⇒ integrity;
   pinned ⇒ monitoring obligation; not-tracked ⇒ named non-obligation
   with its required reason.
2. Exit posture — **repo-safe**: `decideFreshnessOutcome` unit tests:
   integrity ⇒ `{ exitCode: 1, reportLines: [names the field] }`;
   valid inventory ⇒ exit 0 with pinned obligations,
   declared-not-tracked count/names/reasons, and the landing-2
   enforcement boundary.
3. Estate state — **repo-safe**: wired `validate-claim-freshness` run
   green inside `repo-validators:check`.
4. Session instrument — **landing-2 repo-safe proof**: unit tests
   (injected clock, injected binary inventory) for expiry selection,
   pin-drift, and the adversarial-stdout collector proof; **plus** a
   smoke spawning the registered generic shim with `CLAUDE_PROJECT_DIR`
   at a `mkdtemp` fixture root asserting SessionStart
   `additionalContext` (fixture expired row) and `{}` (none); **plus**
   an owner-visible line on the MCP-476 PR recording the first live
   session-open observation.
5. Health-probe freshness surface — **landing-2 repo-safe proof**: unit
   tests on the pure `...FromInputs` extension with a fixed fixture
   clock; plus a mirror-census fixture proving that dated historical
   version evidence is accepted while a mismatched unqualified current
   pin fails with the residual surface named.
6. Dispatcher taxonomy — **repo-safe**: re-cut integration tests via
   injected seams: snapshot load failure ⇒ one ask line + exit 0;
   unreadable stdin ⇒ ask; provably-actionless zero-route ⇒ ask; unrecognised tool-shaped
   zero-route — both pinned Copilot envelopes, a
   `{tool_name, tool_input:{notebook_path, new_source}}` payload, and a
   `{sessionId, tool_name:'create', tool_input:{path, file_text}}`
   payload — ⇒ exit 2 with no ask line and comments intact; multi-route ⇒ exit 2; malformed `apply_patch` on the
   matched compat route ⇒ exit 2; an injected **untagged** evaluator
   throw ⇒ exit 2, no ask line; deny unchanged; each availability class emits exactly one captured
   record through the injected `appendDegradedLog` seam with
   repo-relative paths; ask reasons and log lines proven payload-free
   and path-free against secret-bearing stdin, secret-bearing command,
   and home-path fixtures.
7. Shim decisions — **repo-safe**: unit tests: every enumerated exit
   maps to its posture (missing artefact/argv, spawn error, signal,
   exit-1, exit 0/2 pass-through); child-writes-then-dies ⇒ forwarded
   line, no second line; zero-bytes ⇒ exactly one shim ask line;
   redaction proven on the child-error-message path with a
   secret-shaped fixture.
8. Cold-start and degraded smoke — **repo-safe** (smoke tier,
   `test:e2e`): pass-through fidelity against a `mkdtemp` fixture root (sentinel
   `pnpm-workspace.yaml` + fixture policy file with a fixture deny
   pattern — zero live-tree reads, zero live policy content); the
   degraded arm names its class (shim missing-artefact) and asserts one
   ask line + exit 0 **and** exactly one appended `hook-errors.log`
   entry under the fixture root.
9. Live-harness probe — **owner-visible, recorded on the MCP-477 PR
   before merge**: fire / no-fire / degraded-ask dialog in a fresh
   session, plus the D8 probe set (headless, bypass, subagent,
   timeout) with outcomes mapped per D8.
10. Gates green on both PRs — **repo-safe**: CI.
11. Owner ratification — **owner-held**: the frontmatter gate.

## Todos

- **Freshness landing 1 (MCP-476, PR #745)** — schema rules +
  `decideFreshnessOutcome` red-first, validator script + root wiring,
  the five rows' honest metadata, report-only inventory, README
  contract/guidance, ADR-223, and this trued plan node. Mergeable
  independently with zero claim that expiry is enforced.
- **Freshness landing 2 (MCP-476 successor PR,
  `jimcresswell/mcp-476-claim-freshness-session-instrument`)** — generic
  SessionStart shim + both registrations + `check-claim-freshness`
  instrument + pinned-version collector + health-probe extension +
  residual-mirror census + tests + smoke. This is the sole expiry/pin-drift enforcement
  consumer and must land before the goal may claim invisible decay is
  prevented.
- **Guard slice (MCP-477, one PR, round budget ≤2; opens after both
  MCP-476 freshness landings merge)** — commits, each green: (1) tagged
  error types + dispatcher discriminated outcome + written-flag +
  renderer ask + fixed reasons + re-cut integration tests; (2) shim
  revision (piped stdout, enumerated exits, inline last-resort, log
  retention) + unit tests + smoke re-cut; (3) docs (README failure
  semantics + porting contract, ADR-167 note, matrix, research note,
  Copilot-plan supersession) + `claude_code` row re-ground; then D8
  probes + A9, recorded before merge.

## Out of scope

- Source-direct guard execution (D11).
- Estate-wide perishable-claim registry; scheduled ticket-minting
  sweeps; prose mirror-agreement validation (D13 residual).
- Codex PreToolUse enforcement vertical.
- Product-code posture changes (doctrine already; recorded in ADR-223).

## Verification record (dated)

- 2026-08-03 — Node/TS probes (mooted by D11); Claude Code v2.1.220
  docs contract (D7; timeout clause contested by the installed
  harness's "output discarded" string — probe pending).
- 2026-08-03 — Adversarial round 1 (six opus reviewers): falsified
  source-direct; surfaced availability taxonomy, ADR-167 regression,
  PDR-133 §8, vigilance-shaped expiry, test-doctrine violations.
- 2026-08-03 — Adversarial round 2 (three opus reviewers): confirmed
  the frame; hardened mechanism — piped-stdout single-line invariant,
  tagged-error classification with fail-closed default, zero-route
  split preserving pinned Copilot refusals, fixed redacted reasons,
  collector security spec, generic SessionStart shim, Slice-1 proof
  and sequencing corrections, timeout contradiction. This revision is
  the adjudicated fold-in.
- 2026-08-03 — Adversarial round 3 (two opus reviewers): spec-precision
  fold — zero-route default inverted to fail-closed with a closed
  actionless allow-list; both PolicyUnavailableError tagging sites
  named; D16 content predicate replacing byte count plus flush
  discipline; dispatcher log seam; SessionStart registration made
  execution-mode-independent (also reviving the inert landed
  gate-drift alert, exit-126 defect found first-hand); collector byte
  cap/env scrub/fixed candidate dirs; stdin parse-text as second
  hostile carrier; smoke fixtures moved off the live tree. Loop
  convergence: round 1 broke the frame, round 2 the mechanisms, round
  3 only predicates and fixtures — plan-level loop closed; residual
  review continues per-slice in PR rounds.
- 2026-08-11 — Owner ratified the plan via the #745 merge-drive card
  ("Yes — ratify via merge-drive word", recorded by Director session
  Plover lifts Troposphere, b10c37). Pre-merge review found that the
  branch contained only the first implementation landing while the
  plan claimed its SessionStart consumer. The owner-directed
  reconciliation split MCP-476 explicitly: PR #745 carries the strict
  pin union, clock-free integrity gate, and report-only inventory;
  `jimcresswell/mcp-476-claim-freshness-session-instrument` carries the
  sole expiry/pin-drift consumer and enforcement. No freshness-
  prevention claim is valid before that successor lands.
- Pending (Slice 2, pre-merge): D8 probe set with pre-agreed mapping;
  A9; one-off cold-start timing against the configured timeout.
