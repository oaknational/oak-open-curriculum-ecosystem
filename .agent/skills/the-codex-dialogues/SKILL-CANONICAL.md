---
name: the-codex-dialogues
classification: active
description: >-
  From a live CLAUDE seat only: open a bounded multi-turn reflective
  dialogue with a Codex interlocutor over a direct MCP connection, to
  probe a stated uncertainty against a different vendor's prior. On a
  Codex host this instrument does not run (same-vendor dialogue defeats
  its premise — see the host check). Use mid-task at a genuine fork or
  uncertainty; not for task delegation (codex-helper), not for a fast
  one-shot conscience check (cricket), not for live-peer collaboration
  (a second seat + ArcAngel). Every dialogue closes with one structured
  close record — a comms event plus a tracked trial-tally row.
---

# The Codex dialogues

A live Claude seat, mid-task, opens a bounded multi-turn reflective
dialogue with a Codex-family model: it restates an uncertainty, is
probed against a different vendor's prior over several genuine turns,
and conserves a synthesis quoting Codex's final position — without a
second Practice seat being live. This is the first cross-vendor
multi-turn instrument riding the
[Subagent Invocation Framework (Sif)](../sif/SKILL-CANONICAL.md); the
general doctrine (authority layering, version gates, close-event
telemetry, conservation, data contract, pre-registered prior) lives
there, and this skill states each plank concretely for the
`codex mcp-server` binding (Sif Annex A). v1 is DIRECT: the seat holds
the dialogue and adjudicates first-hand — no conduit wrapper.

This is an experimental instrument inside a pre-committed trial window
(below). The records exist for later analysis of the experiment.

## When to use — and when not

Open a dialogue when you hold a genuine, articulable uncertainty at a
decision point — a design fork, a suspicious consensus, a
confident-but-unpressured plan — and a different vendor's prior probing
it over real exchanges could change your position.

Route elsewhere when:

- you want a fast bounded second opinion on priority, framing, or
  proportion — [`cricket`](../cognition/cricket/SKILL-CANONICAL.md) (one-shot
  conscience panel; its rubber-ducking triggers are NOT this skill's);
- you want a task done and a result returned —
  [`codex-helper`](../codex-helper/SKILL-CANONICAL.md) (`codex exec`
  delegation, one-shot);
- you want sustained collaboration on a lane — that is membership, not
  invocation: a live peer seat, with an ArcAngel channel for pairwise
  dialogue.

## Setup — MCP registration (per user, local)

`.mcp.json` is gitignored in this repository (local MCP config; only
`plugins/*/.mcp.json` release artefacts are tracked), so the
registration cannot land as a tracked file. This block is the TRACKED
TEMPLATE — a complete `.mcp.json`; if you already have one, merge the
`codex` entry into your existing `mcpServers` map:

```json
{
  "mcpServers": {
    "codex": {
      "type": "stdio",
      "command": "codex",
      "args": [
        "mcp-server",
        "-c",
        "sandbox_mode=read-only",
        "-c",
        "approval_policy=never"
      ]
    }
  }
}
```

The launch pins are the process DEFAULT for every disciplined call —
deliberately not claimed as a cap: the tool schema accepts per-call
authority parameters (probe-verified; see Authority below). Tool
schemas are deferred by the harness, so the registration's ambient cost
to unrelated sessions is names-only.

## Dialogue-open checks (all four, in order, every dialogue)

0. **Host check.** This instrument is the Claude→Codex binding: it runs
   from a live CLAUDE seat. The generated cross-tool adapter makes the
   trigger visible on every platform, so state the guard where it
   fires: on a Codex host, STOP — a Codex seat dialoguing with a Codex
   interlocutor is same-vendor and cannot deliver this instrument's
   cross-vendor value (its close event would also mis-record
   `harness_version`). The reverse binding (Sif Annex B, `claude mcp
   serve`) is its own gated experiment, not this skill.
1. **Registration check.** If the `codex` MCP server is absent from the
   session's MCP set (no `mcp__codex__*` tools resolvable via
   ToolSearch), STOP with the setup instruction above — never fail
   obscurely or fall back to another transport. Presence is not
   conformance: before proceeding, read the live registration's `codex`
   entry (the local `.mcp.json`) and compare the COMPLETE entry
   against the tracked template VERBATIM — every field equal AND no
   extra fields. `command`/`args` equality alone is not conformance: an
   added `env` (e.g. `env.PATH` steering the launch to a different
   `codex` binary than the one `codex --version` gates) or `cwd`
   changes what actually runs while a partial check still passes, and
   a legacy or user-level `codex` entry without the launch pins runs
   every "disciplined" call under broader process defaults — either
   way the authority evidence is silently invalidated. Any mismatch or
   extra field is a STOP: bring the registration to the template,
   restart the session, re-run this check.
2. **Version gate.** Compare `codex --version` against the
   `codex_cli_version` pin in
   [`probe-record.md`](./references/probe-record.md). On ANY mismatch, STOP and run
   [`scripts/probe-codex-mcp-server.mjs`](./scripts/probe-codex-mcp-server.mjs)
   `--candidate` first — candidate mode runs every leg against the
   installed version while the old pin stands; the dialogue proceeds
   only after that run passes and the record is updated with the new
   version's verbatim evidence in a reviewed change (which turns the
   default, gated mode green again). After the pin updates, RESTART
   the Claude session before dialoguing: the session's stdio server
   was launched by the pre-upgrade binary and keeps serving it —
   `codex --version` and the candidate run inspect a freshly launched
   binary, not the session's live server — then re-run checks 1 and 2
   in the new session. An installed upgrade is a loud stop, never a
   silently unverified surface.
3. **Pre-registered prior.** Write down your position AND confidence on
   the question BEFORE the first exchange — it goes in the packet and
   the close event records the delta. No prior, no dialogue.

## The dialogue packet

Compose a bounded frame — reuse Cricket's field vocabulary, do not
re-mint it:

1. **OBJECTIVE FRAME** — the controlling objective and its source.
2. **INTENT** — what you are doing and why the fork matters now.
3. **QUESTION** — the uncertainty, stated neutrally, with your
   pre-registered position and confidence.
4. **RECENT ACTIONS** — the last few concrete actions bearing on it.

Minimisation at source is a hard rule: the packet is a composed frame,
never a context dump, and no exchange may carry secrets, credentials,
or personal data.

## Protocol

- **Open**: one `codex` call carrying the packet as the initial prompt.
  Capture `structuredContent.threadId` from the result, and APPEND the
  cleanup-mapping row for it immediately — before the first reply turn
  (the exact path and format are in the Data contract's bounded-
  retention clause; a dialogue with no mapping row is invisible to the
  trial close-out pass).
- **Continue**: every subsequent turn is a `codex-reply` call to that
  EXACT `threadId`. One `codex` initialisation per dialogue, one thread
  per dialogue, never a second initialisation mid-dialogue.
- **Budget**: default SIX exchanges. Stop earlier when positions have
  stabilised (nothing new in the last exchange) or are irreconcilable
  with reasons already on the table.
- **Authority discipline (hard rule)**: a dialogue call NEVER passes
  ANY recorded per-call authority parameter — `sandbox`,
  `approval-policy`, `cwd`, `model`, `config`, `base-instructions`,
  `developer-instructions`, or `compact-prompt`: the full recorded
  authority surface, canonical in
  [`probe-record.md`](./references/probe-record.md) and machine-pinned by the
  probe's tool-contract check, which updates this list in the same
  reviewed change if the surface ever reshapes. Disciplined calls ride
  the launch pins. This is skill discipline, not machine enforcement —
  the schema accepts those parameters; passing any of them is out of
  contract.
- **Never resume a closed thread.** A closed dialogue stays closed; a
  new question is a new dialogue with a fresh thread. (Codex persists
  rollouts locally regardless — see Data contract.)
- **Close**: conserve the synthesis, QUOTING Codex's final position
  verbatim (direct mode holds the raw turns, so fidelity is by
  construction), then compose and append the close event, then append
  the same canonical `key=value;` line as a row to the tracked trial
  tally
  ([`the-codex-dialogues-trial-tally-2026-08.md`](../../reports/agentic-engineering/the-codex-dialogues-trial-tally-2026-08.md))
  in the same close sequence — the comms event is transport; the
  tally row is the durable copy the trial window reads, and it is
  conserved only when it LANDS (committed and pushed with the close,
  on whichever lane carries the dialogue's work — a row that exists
  only in a working tree is not yet durable, and the comms event may
  have rotated by the time anyone looks). A row COUNTS toward the
  trial thresholds only once its commit is integrated on main — the
  sole integration point (`no-parallel-long-lived-branches`); until
  then it is in-flight, and the trial window's counts are always read
  from MAIN's copy of the tally, so concurrent closes on separate
  lanes reconcile through the ordinary merge flow, never a bespoke
  reconciliation step.

Absorption after close: dialogue conclusions get the
verify-before-absorb leg like any cross-model claim — dissent is
perturbation to be tested, never authority to be obeyed.

## The close event (one per dialogue, no exceptions)

One canonical comms event at dialogue close carries the analysis
record, and the same line is conserved at close time as a row in the
tracked trial tally (the Protocol's Close step): comms events are
instance-tier transport, untracked by design (ADR-199 / PDR-094), so
the tally row — which resolves from any checkout — is the durable
copy. The event is a NARRATIVE event — the strict comms schemas are
untouched; every dialogue field rides in the body as the canonical
`key=value;` line (the same body-encoding discipline the heartbeat
substrate uses):

```text
close_schema=1; dialogue_id=<fresh opaque id, e.g. dlg-YYYYMMDD-xxxx>; question_class=<design-fork|consensus-check|plan-pressure|other>; turn_count=<n>; stop_reason=<budget|stabilised|irreconcilable|aborted>; outcome=<position-changed|dissent-unresolved|confirmed|non-evaluable>; prior_confidence=<low|medium|high>; harness_version=<claude-code x.y.z>; codex_cli_version=<x.y.z>; synthesis_ref=<durable shared surface>;
```

A dialogue that ends without a semantic conclusion — a `codex-reply`
failure or timeout, the server exiting, an operator abort — still gets
its close event ("one per dialogue, no exceptions" includes broken
dialogues): `stop_reason=aborted; outcome=non-evaluable`, with
`synthesis_ref` pointing at whatever partial record exists. Non-evaluable
closes are EXCLUDED from the trial's dialogue count and its
position-changed threshold — they are reliability telemetry about the
instrument, not evidence on the value axis — and at trial close they
reconcile as accounted-for rather than missing.

Field rules:

- `dialogue_id` is a FRESH opaque id. The Codex thread id is NEVER
  carried in the event — it is closed, never protocol-resumed, and
  operationally sensitive; it survives only in the local-only cleanup
  mapping (Data contract).
- `synthesis_ref` must resolve from a DURABLE SHARED surface — a
  tracked report path, a repo-tier record surface, or the PR record.
  Never a machine-local path, and never an untracked comms event id
  (instance-tier under ADR-199 / PDR-094 — it does not resolve from
  another checkout): the pointer must outlive the trial rollouts'
  deletion and resolve from any checkout. A URL ref is
  a BARE permalink — v1 values carry no `=` or `;`, so a query-string
  URL is undecodable.
- **Compose-order check**: `synthesis_ref`'s target must EXIST —
  verified resolvable (the PR comment posted and its id known, the
  report path committed) — BEFORE the close
  event is composed. A predicted or placeholder ref is a protocol
  violation, not a convenience; conserve-then-compose is part of the
  close sequence itself (worked instance: trial dialogue 2's close
  event was composed ahead of its synthesis surface under completion
  pressure and needed a threaded correction event).
- Field completeness is enforced by the composing seat at close time,
  judged against the event's OWN decoded version (a pre-key event is
  complete without `close_schema`); a close event with missing fields
  is a telemetry defect to fix at source. The analysis-side parser that re-checks the corpus lands with
  the trial close-out pass (it has nothing to read before dialogues
  exist), so until then the composing seat's check is the only
  enforcement — deferred by the plan, not an oversight.

Close events evaluate THIS INSTRUMENT, never the seat that ran the
dialogue — any reading of them as seat-evaluation is out of contract
(the FRAME-1 boundary, structural in the plan's feedback contract).

### Close-event schema versions (immutable definitions)

`close_schema` names which definition below decodes the body.
Definitions are IMMUTABLE: a bump ADDS a new definition here and
changes the emitted literal; it never mutates an existing version's
meaning — each version's complete definition remains preserved in this
document. The bump rule fires on SEMANTICS-ONLY changes too: a field
whose meaning, vocabulary, or decoding shifts while every emitted byte
stays identical is exactly the drift a shape-triggered rule cannot
see, so any semantic change is a new version even when the line looks
the same. Close events emitted before the `close_schema` key existed
(the first two trial dialogues) decode as version 1. No
substrate-level version key exists or is planned — this versioning is
local to this instrument's close event.

**Version 1** (current; the emitted literal carries `close_schema=1`):

- Decoding mechanics: the body is one line of `key=value;` fields —
  fields separated by `;` (semicolon then space), a trailing `;`
  closes the line, keys are bare ASCII identifiers, values are literal
  text with no escaping mechanism and therefore MUST NOT contain `;`,
  `=`, or newlines. Field order follows the template above. An unknown
  key is a decode error, never an extension point — additions bump the
  version.
- Field set and meanings: `close_schema` — this definition's number
  (absent on pre-key events, which decode as 1) · `dialogue_id` —
  fresh opaque id, never the Codex thread id · `question_class` — one
  of `design-fork | consensus-check | plan-pressure | other`; the
  class of uncertainty brought to the dialogue · `turn_count` —
  integer count of completed exchanges · `stop_reason` — one of
  `budget | stabilised | irreconcilable | aborted` · `outcome` — one
  of `position-changed | dissent-unresolved | confirmed |
  non-evaluable`, judged against the pre-registered prior ·
  `prior_confidence` — one of `low | medium | high`, recorded before
  the first exchange · `harness_version` — `claude-code x.y.z` of the
  invoking seat · `codex_cli_version` — the installed CLI version the
  dialogue ran against · `synthesis_ref` — durable shared surface
  carrying the conserved synthesis (see the field rules).

## Data contract (rollouts and retention)

Codex persists each thread's rollout locally by default — a third
analysis source alongside the close event and the seat's own
transcript, embraced rather than fought, under three clauses:

- **Minimisation at source** — the packet rule above.
- **Locality** — rollouts live under the machine-local Codex home and
  are never committed or transmitted.
- **Bounded retention** — the seat keeps a LOCAL-ONLY cleanup mapping
  (`dialogue_id` → Codex thread id) at the CANONICAL path
  `~/.codex/sif-dialogue-cleanup-map.jsonl`: one JSON object per line,
  fields exactly `dialogue_id` and `thread_id`, appended at thread
  capture (the Protocol's Open step). Machine-local, never committed
  and never transmitted, existing solely so the trial close-out pass
  can select exactly the trial dialogues' rollouts — a seat that
  improvises a different location or format breaks that selection, so
  the path and shape above are the contract, not a suggestion. At the
  trial window's close-out: extract what the rollouts teach, delete
  those rollouts, delete the mapping with them. Knowledge is retained;
  bytes are not. The tracked trial tally (each close line conserved at
  occurrence — the Protocol's Close step) and the conserved syntheses
  remain the durable record; the close events themselves are untracked
  instance-tier transport (ADR-199 / PDR-094) and are never the only
  copy.

## Trial window (pre-committed at ratification — the decision rule)

The trial is **12 dialogues or 14 days from the first dialogue,
whichever comes first**. If FEWER THAN 3 dialogues close
`position-changed`, the two-armed falsifier review runs:

- **Arity arm**: dissent changed decisions but dialogues routinely
  stabilised in a single exchange — build the cross-vendor ONE-SHOT
  sibling instrument on this same substrate and reshape; the
  capability does not retire.
- **Value arm**: dissent did not change decisions — the cross-vendor
  value claim failed its test and the instrument retires with the
  honest report.

The two arms are hypotheses the review tests, not an exhaustive
partition: with a small evaluable corpus BOTH can come back false —
dissent DID change decisions in multi-turn dialogues, yet fewer than 3
such closes exist (e.g. the 14-day limit is reached with two evaluable
dialogues, both `position-changed`). That residual state is
pre-committed to ROUTING, not verdict: it surfaces to the owner as an
explicit scale/extension decision carrying the honest tally — never an
improvised reading of either arm, never a silent extension. This
clause only names where the both-arms-false state goes; the ratified
arms and trial values above are untouched by it.

Three or more `position-changed` closes and the instrument continues
beyond the trial. There is no fold-into-Cricket disposition on either
arm — Cricket is not this instrument's alternative.

The diversity null hypothesis rides the same window, with its data
contract pre-defined here so the comparison is COMPUTABLE at trial
close-out from records that already exist (a pre-registered criterion
with no measurement contract silently degrades into whatever the
close-out seat improvises):

- **Cross-vendor observations** — this instrument's close records, read
  from the tracked trial tally (the durable copy of every close line).
  Each carries `question_class` and `outcome`; a dialogue counts as MOVED
  when its outcome is `position-changed`, as STANDING DISSENT when
  `dissent-unresolved`, as AGREEMENT when `confirmed` (`non-evaluable`
  closes are excluded here exactly as they are from the primary
  threshold).
- **Same-vendor baseline** — CLAUDE-PLATFORM Cricket runs recorded in
  the cricket tally over the same window (Cricket defines per-platform
  panels, and only Claude-panel rows are same-vendor for this
  Claude-only instrument — its Codex legs are cross-vendor one-shot
  observations, never part of this denominator), judged over their
  DELIVERED legs only (the tally's own "among delivered" convention; a
  run with zero delivered legs is excluded). The tally records no question field, so
  classification into this instrument's `question_class` enum
  (`design-fork` | `consensus-check` | `plan-pressure` | `other`)
  happens at analysis time from the run's recorded seat/moment text; a
  row too ambiguous to classify is `other`. A run counts as MOVED when
  its row records the seat adopting a redirection, as STANDING DISSENT
  when any delivered leg returned a non-ON-TRACK verdict with no
  adopted redirection, as AGREEMENT when every delivered leg is
  ON-TRACK and no redirection was adopted. Movement is judged on the
  SAME axis as the cross-vendor side — did the perturbation move the
  seat — never on unanimity (a unanimous panel whose redirection the
  seat adopts is MOVED, not agreement; the tally already records
  per-leg verdicts and adopted redirections, so no new Cricket field
  is minted).
- **Decision rule** — compare the MOVED + STANDING-DISSENT rate per
  shared question class, stated qualitatively in the close-out report
  (the trial's n is small; no significance test). If the cross-vendor
  rate does not exceed the same-vendor rate in any shared question
  class, the value axis has failed however pleasant the dialogues
  felt. If the shared-class set is EMPTY, this comparison is
  NON-EVALUABLE and is reported as exactly that — never as a pass; the
  value-axis verdict then rests on the primary criterion alone.

Missing close events do NOT count toward any threshold: at trial close,
events are reconciled against seat transcripts and Codex-side rollouts,
and an unexplained gap is a TELEMETRY FAILURE to investigate, never
evidence of non-use.

## Authority — evidence, not assertion

Layers in order of real strength (Sif plank 1): the estate's same-UID
trust ruling (the calling seat already holds full user authority — this
tool adds no new authority class); this skill's hard rule that dialogue
calls never pass per-call authority parameters; the launch-arg defaults
for every call that omits them.

Probe-verified 2026-08-02 against the pinned `codex_cli_version` in
[`probe-record.md`](./references/probe-record.md) (the version literal lives ONLY
there — doctrine references it, never restates it): after a
disciplined call's write-request turn the sentinel path was ABSENT on
disk (ENOENT-only, checked after server termination — a final-state
check, so a transient create-then-remove during the turn is outside
this evidence; the interlocutor's refusal self-report is recorded
verbatim as corroboration, not proof of the sandbox's internals). The `codex` tool schema ACCEPTS
per-call `sandbox` values including `danger-full-access` — the
broadening surface exists; whether launch pins cap it is OPEN. The
broadening negative control is OWNER-HELD per ADR-180: explicit owner
authorisation per invocation, externally isolated disposable workspace
outside every estate checkout, bounded sentinel write target. Never
self-start that leg; its recorded outcome, not any source reading, is
the deciding authority evidence.

All protocol invariants (one thread, no resumption, no per-call
authority parameters) are skill discipline, not machine enforcement.
Thread-discipline violations cost wasted spend and a muddled dialogue,
made visible by the close event's turn count. The verified hook
primitives (PreToolUse deny, PostToolUse capture, SubagentStop) are the
named hardening path if misuse is observed; no guard hooks in v1.

## The probe

[`scripts/probe-codex-mcp-server.mjs`](./scripts/probe-codex-mcp-server.mjs)
is the runnable contract evidence (the vendor's MCP reference has
drifted; the probe against the installed CLI is the durable source). It
launches `codex mcp-server` WITH the launch pins in an isolated
temporary directory outside every checkout, verifies the tool contract
(`codex`, `codex-reply`, `structuredContent.threadId` round-trip),
drives one bounded two-turn exchange, proves the no-write leg (the
sentinel path absent on disk after the write-request turn, checked
after server termination; the refusal self-report is corroborating,
not observation), and compares the
installed CLI version against the pin in
[`probe-record.md`](./references/probe-record.md) — exiting non-zero on any
mismatch or failed leg. Run it at every version-gate stop and before
re-ratifying the record.
