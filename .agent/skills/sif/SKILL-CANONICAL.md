---
name: sif
classification: active
description: >-
  The Subagent Invocation Framework (Sif): general doctrine for invoking
  another agent — any vendor, any arity — as bounded in-session capability,
  plus per-binding annexes carrying each binding's transport,
  tool-contract, and authority facts. Read before building or using any
  agent-invoking instrument; route to a concrete instrument
  (the-codex-dialogues, cricket, codex-helper) for the actual invocation
  workflow.
---

# Sif — the Subagent Invocation Framework

Sif (owner-named 2026-08-01, "as in Sif, Norse god of the earth") is the
framework layer for agent-invokes-agent capability: one general doctrine,
plus per-binding annexes that carry each concrete transport's facts at
their stated evidence grade (probe-verified, or an explicitly labelled
observation-grade candidate). Instruments ride Sif; Sif is not itself an instrument. The
first instrument is [`the-codex-dialogues`](../the-codex-dialogues/SKILL-CANONICAL.md).

## The two axes

Two independent axes govern the whole space (owner framing, 2026-08-01):

- **Vendor locus** — same-vendor vs cross-vendor. This is where the
  framework's intrinsic value lives: cross-vendor calling brings
  diversity of thought and approach that no same-vendor instrument can,
  however well-stanced. Same-vendor wrappers offer stance-diversity at
  most.
- **Interaction arity** — one-shot vs multi-turn. An architecture choice
  matched to an instrument's purpose, never a ranking. A one-shot is a
  dialogue with an exchange budget of one, and legitimate one-shot
  instruments exist on both vendor loci.

The cell map, with the estate's instruments placed on it:

| | One-shot | Multi-turn |
| --- | --- | --- |
| **Same-vendor** | expert-reviewer fleet, [`cricket`](../cognition/cricket/SKILL-CANONICAL.md), Workflow-fleet legs | named background agents via Agent + SendMessage; session forks |
| **Cross-vendor** | Cricket Codex legs, [`codex-helper`](../codex-helper/SKILL-CANONICAL.md) | [`the-codex-dialogues`](../the-codex-dialogues/SKILL-CANONICAL.md) |

## Instrument, not citizen

Invocation and membership are different relationships, and the boundary
is deliberate. A Practice **citizen** (for example a Codex seat) has
identity, claims, comms, and its own clock; it participates in
coordination as a peer. A Sif **instrument** is bounded perturbation: it
is opened, exchanged with under a budget, closed, and recorded. Peers
for sustained lanes; instruments for bounded perturbation; a clean line
between them so neither erodes the other. An instrument invocation never
registers identity, opens claims, or emits comms in the interlocutor's
name — the record belongs to the invoking seat.

## Doctrine — what every instrument carries

Every Sif instrument states these six planks in its own skill; the
framework defines what each plank must contain. The contract binds at
adoption:
[`the-codex-dialogues`](../the-codex-dialogues/SKILL-CANONICAL.md) is
the first conforming instrument.
[`cricket`](../cognition/cricket/SKILL-CANONICAL.md) and
[`codex-helper`](../codex-helper/SKILL-CANONICAL.md) PRE-DATE the
framework and do not yet state all six planks — the cell map above
routes to them as invocation instruments, but they are not claimed as
six-plank-conforming; migrating them is a routed follow-on of this
framework, never a silent grandfathering.

1. **Authority layering, probe-evidenced.** State the authority layers
   in order of real strength. In this estate that order is: the same-UID
   trust ruling (the calling seat already holds full user authority, so
   an instrument adds no new authority class); the instrument's hard
   rule that an invocation never passes per-call authority parameters
   (sandbox, approval, escalation flags); and the launch or configured
   defaults for every disciplined call. What a transport actually
   enforces is settled by a recorded probe outcome, never by reading
   vendor source or documentation — probe answers authority. Broadened
   authority modes (for example `danger-full-access`) are owner-held
   per ADR-180: explicit owner authorisation per invocation, externally
   isolated disposable workspace, bounded sentinel target.
2. **Version gates.** Each probe-verified binding is pinned to the
   version its probe evidence was recorded against; a candidate annex
   carries a dated observation stamp instead, and no instrument opens
   on it. At instrument-open, the installed version is compared to the
   recorded pin; a mismatch is a loud stop until the probe re-runs and
   the record is re-ratified. An unverified upgrade must never become
   a silently trusted surface.
3. **Close-event telemetry.** One structured comms event at each
   invocation-close is the analysis record — narrative event, canonical
   `key=value;` body encoding, schemas untouched. Close events evaluate
   the INSTRUMENT, never the invoking seat; any reading of them as
   seat-evaluation converts learning into surveillance and is out of
   contract (the FRAME-1 boundary). A missing close event is classified
   before it is read: reconcile against the seat transcript and any
   vendor-side record, and only genuine non-use reads as "unused" — an
   unexplained gap is a telemetry failure to investigate.
4. **Conservation contract.** The conserved synthesis quotes the
   interlocutor's final position verbatim. Where the invoking seat holds
   the raw turns (direct mode), fidelity is by construction; where a
   conduit intervenes, the verbatim-dissent contract must be explicit.
5. **Data contract.** Three clauses, stated per binding: minimisation at
   source (the packet is a bounded, composed frame — never a context
   dump; no secrets, credentials, or personal data in any exchange);
   locality (vendor-side artefacts such as rollouts or thread state stay
   machine-local, never committed, never transmitted); bounded retention
   (a deterministic, local-only cleanup handle maps instrument ids to
   vendor-side artefacts so a close-out pass can extract what they teach
   and then delete them — knowledge is retained, bytes are not).
6. **Pre-registered prior, bounded budget.** Before the first exchange,
   the invoking seat records its position AND confidence on the question
   it brings; the close event records the delta. Every instrument names
   its exchange budget and its early-stop conditions. Without the prior,
   outcome flags are post-hoc self-report; without the budget, dialogue
   momentum sets the scope.

Absorption is the seventh plank, owned by the estate rather than any one
instrument: dialogue conclusions get the verify-before-absorb leg like
any cross-model claim. Dissent is perturbation to be tested, never
authority to be obeyed.

## Routing — which instrument

- A fast conscience check on priority or framing, one bounded exchange,
  same session: [`cricket`](../cognition/cricket/SKILL-CANONICAL.md).
- Delegating a self-contained task for a result:
  [`codex-helper`](../codex-helper/SKILL-CANONICAL.md) (`codex exec`).
- A bounded multi-turn reflective dialogue that perturbs the seat's own
  stated uncertainty against a different vendor's prior:
  [`the-codex-dialogues`](../the-codex-dialogues/SKILL-CANONICAL.md).
- Sustained collaboration with its own clock and claims: that is
  membership, not invocation — a live peer seat and, for pairwise
  dialogue, an ArcAngel channel.

## Annex A — binding: `codex mcp-server` (stdio)

**Probe-verified.** Evidence recorded first-hand 2026-08-02 against
the pinned `codex_cli_version` in
[`the-codex-dialogues/probe-record.md`](../the-codex-dialogues/references/probe-record.md)
(the record is the sole holder of the version literal; the runnable
probe lives beside it at
[`the-codex-dialogues/scripts/probe-codex-mcp-server.mjs`](../the-codex-dialogues/scripts/probe-codex-mcp-server.mjs)):

- Transport: stdio MCP server via
  `codex mcp-server -c sandbox_mode=read-only -c approval_policy=never`;
  the `-c` launch pins are accepted and act as the process default for
  calls that omit authority parameters.
- Tools: `codex` (required `prompt`; returns
  `structuredContent.threadId` + `content`) and `codex-reply`
  (`threadId` + `prompt` continues the exact thread; `conversationId`
  is deprecated).
- Authority surface: the `codex` tool schema ACCEPTS per-call
  `sandbox` (including `danger-full-access`), `approval-policy`, `cwd`,
  `model`, `config`, `base-instructions`, `developer-instructions`, and
  `compact-prompt` — the full recorded set; disciplined calls pass none
  of them. The disciplined-call rule (plank 1) is
  therefore skill discipline, not machine enforcement; the probe proves
  a disciplined call's requested write produced NO SENTINEL on disk
  (the interlocutor's refusal self-report is corroborating — the probe
  does not observe the sandbox's internals). Whether launch pins cap a
  per-call broadening override remains OPEN pending the owner-held
  negative control (ADR-180).
- Persistence: Codex persists thread rollouts locally by default
  (machine-local, under the Codex home) — embraced as an analysis
  source under the plank-5 data contract, never committed or
  transmitted.

## Annex B — candidate reverse binding: `claude mcp serve` (stdio)

**Observation-grade CANDIDATE, not probe-verified.** Observed
first-hand 2026-08-01 (Claude Code 2.1.220, server `claude/tengu`) in a
live manual session; no probe script or probe record exists for this
binding yet, so nothing re-verifies these facts across a Claude Code
version bump — treat them as dated observations awaiting their probe.
The observed surface: serves the full Claude Code toolset over stdio,
including `Agent` + `SendMessage` — spawn a named Claude interlocutor,
then continue it with context intact (state continuation keyed by agent
name rather than thread id). This is the named second experiment
(owner word, 2026-08-01) and is NOT yet an instrument: the serve
surface hands the caller `Bash`/`Edit`/`Write` — full Claude Code
authority — so the reverse direction needs a read-only story
(permission mode or allowed-tools of the serving process) proven by its
own probe before any dialogue runs. Authority: OPEN. No dialogue on
this binding until its probe records otherwise; the annex graduates to
a verified binding when that probe script and record land beside it.

## Adding a binding or instrument

A new binding enters as an annex here carrying only probe-verified
facts (transport, tool contract, authority surface, persistence), with
its probe script and record landing beside the instrument that uses it.
Until that probe evidence exists, an annex may hold ONLY as an
explicitly labelled observation-grade candidate (Annex B is the worked
instance) — the label is part of the fact set, and "verified" is
reserved for probe-backed annexes. A new instrument is a skill of its
own that states the six planks concretely and names its routing
boundaries against the instruments above. One probe-verified binding
plus one observed candidate was this framework's factoring trigger;
keep the doctrine general and the annexes factual.
