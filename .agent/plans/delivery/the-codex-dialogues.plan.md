---
id: the-codex-dialogues
node_type: delivery
name: "The Codex dialogues — direct cross-vendor reflective dialogue for a live seat"
overview: "A live Claude seat opens a bounded multi-turn reflective dialogue with a Codex interlocutor over a direct MCP connection to a read-only-defaulted codex mcp-server (a launch default, not an enforced cap — the restriction is skill discipline); one structured close record per dialogue — emitted as a comms event and conserved in the tracked trial tally — is the analysis record. First step toward invoking third-party agents as ordinary in-session capability."
status: ratified
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-01
ratified_where: 'Decision cards, Director session 52841f, 2026-08-01 (recorded in §Direction and in the former mechanical gate below); stamp completed 2026-08-07 when the ticket-existence obligation was removed (plan-node schema §2026-08-07 amendment, PR #817)'
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
# The former mechanical gate (its record, conserved): the substance was
# RATIFIED by owner word 2026-08-01 (decision cards, Director session
# 52841f) — the direct-first v1 shape, the close-event record, the
# theory-of-change structures, and the trial values, with the concrete
# decision rule inscribed in §Theory of change item 2 (12 dialogues or
# 14 days, whichever first; fewer than 3 position-changed closes fires
# the two-armed falsifier review), alongside the serves correction and
# the agent-platform-citizenship widening. The gate held ONLY the
# ticket mint (the removed anchoring rule + the since-lifted Linear
# embargo); both premises dissolved, so the stamp completed 2026-08-07
# with the 2026-08-01 word as its record. A visibility ticket may still
# be minted as working practice.
last_updated: 2026-08-07
---

# The Codex dialogues — direct cross-vendor reflective dialogue for a live seat

## Direction (owner word, 2026-08-01)

This capability is the first step toward invoking third-party agents from
within a session as ordinary capability. Two independent axes govern the
whole space (owner framing, 2026-08-01):

- **Vendor locus** — same-vendor vs cross-vendor. This is where the
  framework's intrinsic value lives: cross-vendor calling brings
  diversity of thought and approach that no same-vendor instrument can,
  however well-stanced. Cricket wrappers typically run the same vendor
  as the parent session, so its diversity is stance-diversity.
- **Interaction arity** — one-shot vs multi-turn. This is an
  architecture choice matched to an instrument's purpose, not a
  ranking: Cricket's one-shot shape is purposeful (a bounded conscience
  check), and other legitimate one-shot instruments can exist —
  including future CROSS-VENDOR one-shot instruments on this same
  substrate (same registration, same authority doctrine, same
  close-event record; a one-shot is a dialogue with an exchange budget
  of one).

The general framework this instrument rides — the invocation doctrine
plus its per-binding annexes — is named the **Subagent Invocation
Framework (Sif)** (owner-named 2026-08-01, "as in Sif, Norse god of the
earth"). Sif is the framework; `the-codex-dialogues` is its first
instrument. This plan builds the cross-vendor MULTI-TURN cell first
because nothing serves it; it is NOT a replacement for or alternative
to Cricket, and the overlap in intention is partial and deliberate. Owner rulings already given, encoded here and not
re-opened: the name is `the-codex-dialogues`; v1 is DIRECT (no conduit
wrapper); the record exists for later analysis of what is explicitly an
experimental setup, and one structured comms event at dialogue close is
its mechanism.

## Priors and lineage

Sif names and generalises what the estate's prior agent-invoking-agent
experiments did ad hoc. Placed on Sif's own axes:

- **Same-vendor one-shot** (the most-travelled cell): the expert-reviewer
  fleet, Cricket's conscience checks, and every Workflow-fleet leg —
  purpose-built dispatch-and-return instruments.
- **Same-vendor multi-turn**: named background agents continued via
  SendMessage, and session forks — native plumbing, never yet designed
  as a dialogue instrument.
- **Cross-vendor one-shot** (the working precedent): the Cricket Codex
  legs — the 2026-07-29 quartet tally ran both model families in one
  panel, with the `.codex/agents` TOMLs pinning sandbox/approval, the
  exact authority precedent this plan cites — and the informal
  `codex exec` helper recipe. Both hand-rolled their own safety and
  recording; neither shared a doctrine.
- **Cross-vendor multi-turn**: empty until this instrument.

Inheritances, by source: from ADR-114's three-layer subagent
architecture, Sif's authoring shape (general doctrine + per-binding
annex is canonical-plus-adapters applied one level up); from Cricket,
the bounded context packet, the recording convention, the sandbox-pin
precedent, and the measured supply-side compression loss that became
the verbatim-dissent contract; from the Workflow experiments,
schema-forced returns and topology lessons; from the idle-wake work,
the verified Codex transport facts and the probe-answers-authority
discipline; from PDR-029's perturbation framing, the warrant itself.

What no prior had, and Sif adds: a named doctrine layer (authority
layering, version gates, close-event telemetry, conservation
contracts) where each prior hand-rolled its own; the vendor-locus axis
made explicit as the value axis (the Cricket Codex legs were
cross-vendor as incidental plumbing, not thesis); and the
instrument/citizen boundary drawn deliberately. The essential contrast
is not a cell at all: the Codex seats (Plover, Possum, Spectre,
Caracal) are membership — identity, claims, comms, their own clocks —
not invocation. Sif is the complement: peers for sustained lanes,
instruments for bounded perturbation, and a clean line between them so
neither erodes the other.

## Goal

A live Claude seat, mid-task, opens a bounded multi-turn reflective
dialogue with a Codex-family model — restates an uncertainty, is probed
against a different vendor's prior over several genuine turns, and
conserves a synthesis quoting Codex's final position — without a second
Practice seat being live. What exists today serves adjacent needs, not
this one: Cricket is single-shot; the `codex exec` helper recipe is
one-shot with no thread state; ArcAngel needs a second live seat; the
standing second-opinion grant is permission, not mechanism.

Falsifier (trial-window), on the two axes separately: if close events
show cross-vendor dissent never changes decisions, the CROSS-VENDOR
value claim itself has failed and the experiment reports that honestly.
If dissent changes decisions but dialogues routinely complete in ONE
exchange, that falsifies only the arity choice — the evidence then
warrants a cross-vendor ONE-SHOT sibling instrument on this same
substrate, and this instrument reshapes rather than the capability
retiring. There is no fold-into-Cricket disposition on either arm,
because Cricket is not this instrument's alternative.

Thread persistence, stated truthfully (review-verified against CLI
0.146.0): Codex persists each thread's rollout locally by default
(`Config.ephemeral` defaults to `false`), so a closed dialogue is
resumable in principle and its transcript survives under the Codex
home. The protocol NEVER resumes a closed thread (discipline, below) —
but persistence is not fought: for an experiment whose records exist
for later analysis, the Codex-side rollout is a free third analysis
source alongside the close event and the seat's own transcript.
Because that third source is otherwise open-ended retention of task
context, the skill carries a data contract with three clauses:
(a) minimisation at source — the dialogue packet is a bounded,
composed frame (the Cricket packet shape), never a context dump, and
no exchange may carry secrets, credentials, or personal data;
(b) locality — rollouts live under the machine-local Codex home and
are never committed or transmitted; (c) bounded retention with a
deterministic handle — the skill keeps a LOCAL-ONLY cleanup mapping
(dialogue id → Codex thread id) beside the Codex home, machine-local,
never committed and never transmitted, existing solely so the
close-out pass can select exactly the trial dialogues' rollouts; at
the trial window's close-out, the analysis pass extracts what the
rollouts teach, deletes those rollouts, and deletes the mapping with
them (knowledge is retained, bytes are not; the tracked trial tally
and conserved syntheses remain the durable record — close events are
untracked instance-tier transport; the close EVENT still never
carries the thread id, and neither does its tally row).

## Theory of change and impact — and the structures that keep them honest

Audited 2026-08-01 at the owner's question. The falsifiers above give the
plan a PARTIAL theory of change; this section closes the gaps found, and
the owner gate ratifies these structures with the shape.

**Theory of change** (mechanism → behaviour): a genuinely different
vendor's prior, probing a seat's stated uncertainty over real exchanges,
will change seat decisions at a rate that repays the instrument's cost.
Three structures make this falsifiable rather than felt:

1. **Pre-registered prior.** The dialogue packet records the seat's
   position AND confidence BEFORE the first exchange; the close event
   records the delta. Without this, the outcome flag
   (position-changed / dissent-unresolved / confirmed) is post-hoc
   self-report — unfalsifiable vibes with a bias toward justifying the
   instrument.
2. **Pre-committed trial window.** The trial's size and decision rule
   are fixed AT RATIFICATION, before the first dialogue — the
   loop-exit-criteria discipline applied to the experiment itself, so
   goalposts cannot move under momentum. The ratified concrete rule:
   the trial is 12 dialogues or 14 days from the first dialogue,
   whichever comes first; if FEWER THAN 3 dialogues close
   position-changed, the two-armed falsifier review runs — either
   dissent changed decisions but dialogues stabilised in a single
   exchange (the arity arm: build the cross-vendor one-shot sibling
   and reshape) or dissent did not change decisions (the value arm:
   the instrument retires with the honest report); 3 or more
   position-changed closes and the instrument continues beyond the
   trial. Missing close events do NOT count toward any threshold —
   at trial close the events are reconciled against the seat
   transcripts and Codex-side rollouts (the second and third analysis
   sources), and an unexplained gap is a TELEMETRY FAILURE to
   investigate, never evidence of non-use.
3. **Diversity null hypothesis.** The vendor-locus value claim carries
   its own falsifier: over the trial window, compare dissent/agreement
   rates against a same-vendor baseline (Cricket legs on comparable
   question classes). Shared training corpora make convergence a real
   possibility; if cross-vendor dissent is statistically
   indistinguishable from same-vendor stance-diversity, the value axis
   has failed its test however pleasant the dialogues felt.

**Theory of impact** (behaviour → who is helped), stated as the
FRAME-1 effect vocabulary this estate adopted 2026-08-01 — Sif is its
second consumer:

- **Effect hypothesis**: beneficiary — the seats whose decisions
  improve, and through them the product surfaces those decisions shape
  (the mission strand: teachers meet fewer wrong turns shipped);
  intended outcome — wrong-course decisions caught before they land;
  harm class — dialogue-induced churn (a seat over-updating on
  confident-but-wrong dissent) and attention cost; assumptions — the
  diversity null hypothesis above, and that decision-changes surface in
  close events honestly.
- **Feedback contract** (reporting into the
  `outcome-informed-practice-learning` strategic strand): the close
  event is the signal; its provenance
  is the emitting seat; its custody is the tracked trial tally (the
  comms stream is its transport);
  its expiry is the trial window's decision point; its PERMISSIBLE
  DECISIONS are about THIS INSTRUMENT only — close events evaluate the
  instrument, never seat performance, and any reading of them as
  seat-evaluation converts learning into surveillance and is out of
  contract (the FRAME-1 boundary, made structural here); a missing
  signal is classified before it is read — reconciliation against the
  seat transcript and rollout distinguishes genuine non-use from a
  telemetry failure (a dialogue that ran without its close event), and
  only the former reads as "unused".
- **Absorption discipline**: dialogue conclusions get the
  verify-before-absorb leg like any cross-model claim (the estate's
  calibration precedent) — dissent is perturbation to be tested, never
  authority to be obeyed.

## v1 decided shape — direct connection

1. **MCP registration.** The registration surface, stated against repo
   policy: `.mcp.json` is GITIGNORED here (local MCP config, verified
   `.gitignore` — only `plugins/*/.mcp.json` release artefacts are
   tracked), so PR 1 cannot ship the entry as a tracked file. PR 1
   therefore ships a TRACKED registration template (the exact entry
   below, carried in the skill's setup section as a copy-paste block)
   plus a registration check at dialogue-open: if the `codex` server is
   absent from the session's MCP set, the skill stops with the setup
   instruction instead of failing obscurely. The local `.mcp.json`
   gains this entry per user:

   ```json
   {
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
   ```

   The launch pins are the process DEFAULT — deliberately not claimed
   as a cap. Review evidence from the upstream source (codex-rs
   `mcp_server/codex_tool_config.rs`: per-call `sandbox` values include
   `danger-full-access`, and `into_config` builds a fresh config from
   per-call overrides without carrying the launch overrides) says a
   caller passing per-call authority parameters can BROADEN a thread
   past these pins, and `approval_policy=never` suppresses prompts
   rather than denying execution. The pre-build probe settles this
   empirically (below) rather than inscribing either reading as fact.
   Authority therefore rests on three layers stated in order of real
   strength: the estate's same-UID trust ruling (the calling seat is
   already trusted with full user authority — this tool adds no new
   authority class); the skill's hard rule that a dialogue call NEVER
   passes per-call sandbox/approval parameters; and the launch-arg
   defaults for any call that omits them. Tool schemas are deferred by
   the harness, so the registration's ambient cost to unrelated
   sessions is names-only.

2. **Dialogue-protocol skill.** A canonical skill (three-layer:
   `.agent/skills/the-codex-dialogues/SKILL-CANONICAL.md` plus generated
   platform adapters) owns the protocol: when to open a dialogue (and
   when to route to Cricket — single-shot second opinion — or ArcAngel —
   live-peer dialogue), the bounded context packet (Cricket's
   OBJECTIVE FRAME / INTENT / QUESTION / RECENT ACTIONS shape, reused
   not re-minted), the exchange budget (default six, stop earlier on
   stabilised or irreconcilable positions), the one-thread discipline
   (one `codex` initialisation, every reply via `codex-reply` to that
   exact `structuredContent.threadId`), never resuming a closed thread,
   the rollout data contract (minimisation / locality / bounded
   retention, stated with the thread-persistence truth above),
   NEVER passing per-call sandbox/approval parameters (the authority
   discipline above), and — before opening any dialogue — checking
   `codex --version` against the probe's recorded version and running
   the landed probe script first on any mismatch (the version gate that
   makes an unverified CLI upgrade a loud stop instead of a silent
   drift). The conservation contract: the conserved synthesis QUOTES
   Codex's final position — in direct mode the seat holds the verbatim
   turns, so fidelity is by construction, not by discipline.

3. **The record (owner-stated purpose: later analysis of an
   experiment).** One canonical comms event at each dialogue close.
   Encoding, stated against the real schemas: the strict comms event
   schemas reject unknown top-level properties (narrative events carry
   only a free-form `body`; lifecycle events fix their own fields), so
   dialogue fields never ride as event properties. The close event is
   a NARRATIVE event whose body is the canonical `key=value;` line
   the skill composes — the same body-encoding discipline the
   heartbeat substrate already uses — and field completeness is
   enforced by the skill's composer at close time; the analysis-side
   parser that re-checks the corpus lands with the trial close-out
   pass (it has nothing to read before dialogues exist), so the
   composer's check is the only PR-1 enforcement, and the comms
   schemas stay untouched in PR 1.
   Fields: dialogue id (the Codex thread id is NOT carried in the
   event — it is closed, never protocol-resumed, and operationally
   sensitive; a fresh opaque id is, and the thread id survives only in
   the local-only cleanup mapping named in the data contract), question
   class, turn count, stop reason,
   harness and Codex CLI versions, outcome flag (position-changed /
   dissent-unresolved / confirmed), and a pointer to the conserved
   synthesis on a DURABLE SHARED surface — a tracked report, a
   repo-tier record surface, or the PR record, never a machine-local
   path and never an untracked comms event — so the pointer outlives
   the trial rollouts' deletion and resolves from any checkout. The
   event rides the comms substrate — no
   bespoke store, no hooks, no CLI (owner ruling 2026-08-01, superseding
   the sketch's ledger machinery; the seat's session transcript and the
   Codex-side rollout that persists by default under the Codex home are
   free second and third analysis sources in direct mode). Comms events
   are untracked instance-tier state under ADR-199/PDR-094 (the
   substrate is transport, not storage), so each close line is also
   conserved at occurrence in the tracked trial tally — the durable,
   greppable copy the trial window reads — keeping the no-machinery
   ruling intact.

## Invariants — stated honestly

One initialisation per dialogue, reply-to-exact-thread, no resumption of
closed threads, and no per-call authority parameters are ALL skill
discipline, not machine enforcement. The thread-discipline violations
cost wasted spend and a muddled dialogue, made visible by the close
event's turn count. The authority discipline sits inside the estate's
recorded same-UID trust ruling — the calling seat already holds full
user authority, so a seat electing to pass a broadening parameter is
the same trust question as every other tool it holds; the launch-arg
defaults cover every disciplined call, and the probe records what the
harness actually enforces. No guard hooks in v1; the verified hook
primitives (PreToolUse deny, PostToolUse capture, SubagentStop) are the
named hardening path if misuse is observed.

## Evidence-gated follow-on — the conduit wrapper (pointer, not spec)

A thin subagent conduit (dialogue outside the parent's context, synthesis
returned) becomes worth building only on measured evidence: close events
showing dialogues long enough that parent-context cost hurts. It carries
its own deferred questions — the child model tier coupled to a
verbatim-passthrough contract, per-child cost ceiling — none of which
exist in v1, where the parent holds the dialogue and adjudicates
first-hand. Do not build it speculatively.

## Pre-build verification

Before authoring the skill: run `codex mcp-server` locally WITH the
launch `-c` pins, drive one bounded codex → threadId → codex-reply
exchange end-to-end, and prove a write attempt is refused on a
disciplined call. The broadening NEGATIVE CONTROL — explicitly passing
`sandbox: danger-full-access` on a call to record which layer wins,
the launch pins or the per-call override — is OWNER-HELD, not a
repo-safe probe: ADR-180 permits `danger-full-access` only with
explicit owner authorisation per invocation inside an externally
sandboxed environment, so this leg runs at the owner's word in an
externally isolated disposable workspace (a throwaway directory
outside every estate checkout, secrets-free environment) against a
bounded sentinel write target — one marker file whose
creation-or-refusal IS the recorded outcome. That recorded outcome,
not any source reading, is the plan's authority evidence. Record the tested
Codex CLI version. PR 1 lands this probe as a RUNNABLE script wired to
the recorded version; the skill's version gate (dialogue-open check
above) runs it on any CLI version mismatch, so an installed upgrade is
a loud stop rather than a silently unverified surface. The vendor's MCP
reference has drifted (the original sketch's URL no longer documents
the tools), so the probe is the durable contract evidence.

## Acceptance criteria (each with a proof)

- Registration exact: the tracked registration template carries the
  process-level pins verbatim, and the skill's dialogue-open check
  detects an absent `codex` server. Proof: repo-safe — template
  lint/pin test (the live `.mcp.json` is untracked local config by
  repo policy and is checked at runtime, not in CI).
- Dialogue round-trip: one live dialogue completes within budget; the
  synthesis quotes Codex's final position; the close event appears on
  the canonical stream with every field present in the canonical body
  encoding. Proof: owner-held — one real
  seat, one real uncertainty, linked from the implementation PR.
- Authority evidenced: a disciplined call's write-request turn leaves
  the sentinel path absent on disk (the reply's refusal report is
  corroborating only — the probe does not observe the sandbox's
  internals), AND the per-call broadening attempt's outcome is
  recorded (cap or default — whichever the harness proves). Proof:
  repo-safe probe output for the no-write leg; the broadening negative
  control is owner-held per ADR-180 — explicit authorisation per
  invocation, externally isolated disposable workspace, bounded
  sentinel write.
- Version gate live: the skill's dialogue-open step detects a CLI
  version mismatch against the probe record and stops until the probe
  re-runs. Proof: repo-safe — skill text + probe-record pin test.
- Routing stated: the skill names the Cricket / ArcAngel / here
  boundaries so keyword routing does not misfire against Cricket's
  rubber-ducking triggers (the rename to `the-codex-dialogues` kills
  the worst collision at source; the routing language closes the rest).
  Proof: repo-safe — skill text review + adapter regeneration checks.
- Host contract first-hand: pinned Claude Code and Codex CLI versions
  with the probe script's recorded output. Proof: repo-safe script +
  owner-held run record.

## Delivery

Tickets are optional visibility metadata (plan-node schema §2026-08-07
amendment: plan validity is repo-internal — the former
anchoring-consistency rule is removed, and the 2026-08-01 Linear
embargo lifted 2026-08-06). `tickets: []` is a valid resting state at
every status; when this lane's work is tracked in Oak's Linear, mint a
thin pointer ticket as working practice and name it here.

- PR 1 (single story): the `.mcp.json` registration, the canonical
  skill + generated adapters, the runnable probe script with its
  recorded evidence, and the routing/usage documentation. Owner-held
  acceptance run linked before merge.

Done-test: one real seat runs one real dialogue whose close event lands
on the stream and whose synthesis is conserved with Codex's position
quoted.

## Out of scope

- The conduit wrapper (evidence-gated pointer above; its model-tier and
  cost questions travel with it).
- Any lineage store, guard hooks, or lineage CLI (owner ruling
  2026-08-01 — the close event is the record).
- Unprompted Codex wake or shared long-lived Codex processes (the
  deliberately-deferred `codex-app-server-idle-wake` plan's space, and
  the speculative `codex-upstream-idle-wake-contribution` exploration).
- Reusing or resuming Codex threads across dialogues.
- Pinning the Codex model; the CLI's configured default stays outside
  this contract.
- A Codex-initiated Claude dialogue — out of v1 scope but no longer an
  UNOBSERVED asymmetry: `claude mcp serve` (observed first-hand
  2026-08-01, Claude Code 2.1.220, server `claude/tengu` — an
  observation-grade candidate binding: no probe script or record yet,
  see Sif Annex B) exposes the
  full Claude Code toolset over stdio, including the `Agent` +
  `SendMessage` pair — spawn a named Claude interlocutor, then continue
  it with context intact — i.e. layer-B state continuation keyed by
  agent name rather than thread id. This is the named SECOND EXPERIMENT
  (owner word, 2026-08-01), and it meets the factoring trigger: the
  dialogue doctrine is now general across one probe-verified binding
  plus one observed candidate, so the
  skill is authored two-layer from day one — the Subagent Invocation
  Framework (Sif) general doctrine + per-binding annexes. Its own open question is authority:
  the serve surface hands the caller Bash/Edit/Write — full Claude Code
  authority — so the reverse direction needs a read-only story
  (permission mode / allowed-tools of the serving process) proven by
  its own probe before any dialogue runs.
- Changes to Cricket or ARC.

## External contract references (verification status)

- `codex mcp-server` stdio; `codex` / `codex-reply` tools;
  `structuredContent.threadId` round-trip; per-call approval/sandbox
  parameters: VERIFIED 2026-08-01 against the grounding record, with the
  original reference URL drifted — the runnable probe against the
  installed CLI is the durable evidence.
- `codex mcp-server -c sandbox_mode=read-only -c approval_policy=never`
  accepted at launch: VERIFIED first-hand against codex-cli 0.146.0,
  2026-08-01. Whether launch pins CAP per-call overrides: OPEN — review
  evidence from the upstream source says per-call `sandbox` builds a
  fresh config that ignores launch overrides; the pre-build probe's
  recorded broadening attempt is the deciding evidence.
- `Config.ephemeral` defaults `false` — Codex persists thread rollouts
  locally across process exit: review-verified against CLI 0.146.0;
  embraced by this plan as the third analysis source rather than
  fought.
- Claude Code MCP registration and deferred tool schemas: VERIFIED
  2026-08-01 at <https://code.claude.com/docs/en/mcp>.
- `claude mcp serve` (the reverse binding): OBSERVED first-hand
  2026-08-01 in a live manual session — Claude Code 2.1.220 serves its
  full toolset over stdio (`Agent`, `SendMessage`, `Bash`, `Read`,
  `Edit`, `Write`, and the rest); `Agent` + `SendMessage` provide
  named-agent multi-turn continuation. Observation-grade candidate
  facts (no probe script or record exists for this binding — Sif Annex
  B carries the label). Authority pinning on this surface: OPEN — its
  own probe gates the reverse experiment.
- Claude Code hooks (the named hardening path only): VERIFIED 2026-08-01
  at <https://code.claude.com/docs/en/hooks>.
