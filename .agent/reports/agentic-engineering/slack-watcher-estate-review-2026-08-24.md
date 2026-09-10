# Slack Watcher estate review — working report

**Owner-commissioned review of the Slack Watcher organ** (plan:
`.agent/plans/archive/slack-watcher-estate-review.plan.md` — ratified,
executed, and archived complete 2026-08-24; commissioning word 2026-08-24: "a review
of the skills, guidance and mechanisms behind the The Watcher of Slack
and agents communicating with or via The Watcher"). Author: Raven stirs
Murmur (`c4031b`), reviewing seat. **All five legs are complete** (one
session, 2026-08-24): leg 1's discovery-swept inventory read in full
with drift findings; leg 2's instrument-vs-prose classification; leg
3's routing-coherence rows under the owner's comparative frame (Watcher
needs ≈ estate comms needs, medium swapped: Slack channel for
coordination branch); leg 4's configuration verdicts; leg 5's
per-surface verdicts and six routed proposals. Method: discovery-based
projection sweep (published in §Leg 1) plus full end-to-end reads of
every inventoried surface; every claim carries its file evidence and
was observed first-hand this session. Mid-review owner ruling
(2026-08-24): the account-synced `oce-slack-watcher` skill is RETIRED
in favour of the repo skill — removed from this container in-session;
account-side deletion was proposal P6, and the owner completed it
account-side the same day (recorded in the thread record and the
continuity row; the adoption record below carries the arc).

**Review contract.** Purpose: give the owner grounds to trust — or
distrust, with specifics — the Watcher as the estate's comms organ: can
a fresh Watcher seat start, run, and hand off from the written surfaces
alone, and can agents communicate with or via it without drift,
double-delivery, or silent loss? Questions a review of THIS record
should test: does the leg-1 inventory really enumerate every projection
the published sweep method would find; is each drift finding
reproducible from the named files; are severity readings warranted by
the evidence rather than the prose? Evidence standard: every finding
re-derivable from named files at named paths (castr paths are in the
read-only clone at commit `89914b4`). Authority boundary: this record
AUTHORISES NOTHING — verdicts and proposals land in leg 5 and their
adoption is the owner's consolidation decision. Non-goals: amending
Watcher skills or rules (out of scope for this lane); the castr loop
review's territory (cross-estate findings route there as pointers).
A successful review either confirms the findings against their files or
names the specific finding, file, and mismatch.

## Leg 1 — primary-source inventory (COMPLETE, this session)

### Sweep method (published, per the ratified plan's leg 1)

1. Filename sweep for watcher-named artefacts across every projection
   tier in this repo: `ls`/glob over `.agent/skills/`, `.agent/rules/`,
   `.agents/skills/`, `.agents/rules/`, `.claude/skills/`,
   `.claude/rules/`, `.cursor/rules/` for `*watcher*`, `*liveness*`,
   `*silence*`.
2. Permission sweep: `grep -i "watcher\|slack"` over
   `.claude/settings.json`.
3. Consumer sweep: `grep -rln "SLACK_WATCHER"` over the whole repo
   (node_modules excluded) and over the castr clone.
4. Out-of-repo store sweep: `find ~/.claude` for watcher-named skills
   (caught the account-synced store at `/root/.claude/skills/synced/`)
   and the plugin registry (`installed_plugins.json` — empty).
5. Castr twin sweep: the same filename sweep over the castr clone, plus
   `diff` of every twin against its OCE counterpart.

### Inventory (every surface read in full this session)

| # | Surface | Tier | Notes |
| --- | --- | --- | --- |
| 1 | `.agent/skills/slack-watcher/SKILL-CANONICAL.md` | canonical | mantle protocol, tenure-bound vacancy validity rule, watch loop, exit criteria, fallback pairing |
| 2 | `.agent/skills/talk-to-slack-watcher/SKILL-CANONICAL.md` | canonical | correspondent protocol, silence-is-never-liveness reading, never-take-mantle |
| 3 | `.claude/skills/oak-slack-watcher/SKILL.md` + `oak-talk-to-slack-watcher/SKILL.md` | Claude adapter | thin pointers; descriptions verbatim-synced; drift gate-checked by `skills:check` (pre-push) |
| 4 | `.agents/skills/oak-slack-watcher/SKILL.md` + `oak-talk-to-slack-watcher/SKILL.md` | cross-tool adapter | thin pointers, same descriptions |
| 5 | `.claude/settings.json:79-82` | permissions | `Skill(oak-slack-watcher)`, `Skill(oak-talk-to-slack-watcher)` + `:*` forms pre-approved |
| 6 | `.agent/rules/comms-all-channels-watcher.md` (+ `.agents/rules/` pointer, `.claude/rules/` pointer, `.cursor/rules/*.mdc`) | rule + 3 projections | the incoming-visibility organ; F-95 gates; PDR-133 class model |
| 7 | `.agent/rules/liveness-heartbeat-cron.md` (+ same 3 projection tiers) | rule + projections | outgoing visibility; PDR-078/ADR-186; consumer-absent exemption |
| 8 | `.agent/rules/silence-is-never-liveness.md` (+ same 3 projection tiers) | rule + projections | positive-deadman invariant |
| 9 | `.agent/skills/comms-channels/SKILL-CANONICAL.md` | canonical (overlay) | delivery lanes; agent-collaboration-channels card named as routing authority |
| 10 | `.agent/claude-harness-integrations/cloud-environment.md` §Environment settings | ops doc | `SLACK_WATCHER_CHANNEL_ID` + `SLACK_WATCHER_WORKSPACE` live in the write-only environment dialog; "not secrets"; probed live this session: both set (`C0B9AQ2BK5E` / `engraph-workspace`) |
| 11 | `.agent/plans-backlog-2026-07/slack-assistants/` (README, roadmap, `current/ask-oisin.plan.md`, `future/ask-oak.plan.md`) | backlog | adjacent Slack-assistant organ (Ask Oisín/Ask Oak); shares Slack coupling, does not define Watcher behaviour |
| 12 | `.agent/plans-backlog-2026-07/speculative/watcher-liveness-self-heal.md` | speculative idea | honest "do NOT build yet" status; names the unowned-restart gap on Claude Code |
| 13 | `.agent/research/outreach/slack-assistant-logging-observability-design.md` | research note | resolved 2026-07-08; assistant-scoped observability topology, not Watcher-scoped |
| 14 | `/root/.claude/skills/synced/oce-slack-watcher/SKILL.md` | **account-synced, out-of-repo** | a second, live, older Watcher playbook in every session's roster — see finding L1-F6 |
| 15 | castr `.agent/skills/slack-watcher/` + `talk-to-slack-watcher/` canonicals; `.claude/skills/engraph-*` + `.agents/skills/engraph-*` wrappers; `.agents/rules/` + `.cursor/rules/` watcher rules (clone `89914b4`) | castr twins | see findings L1-F1..F4 |

Plugin marketplaces: `~/.claude/plugins/installed_plugins.json` is empty
— no plugin-delivered watcher skill exists (PR #14's letter confirmed;
but see L1-F6 for its spirit).

### Drift findings

- **L1-F1 — castr `talk-to-slack-watcher` canonical: one-character
  whitespace drift.** Line 40 lost its three-space continuation indent
  (`<account holder>'s Slack):`). Semantically nil; evidences that twin
  sync is prose-discipline only — no instrument diffs cross-repo skill
  twins (the cloud-environment twins have a declared byte-identical
  doctrine; the skill twins have no equivalent check).
- **L1-F2 — castr `comms-all-channels-watcher` rule is doctrinally
  behind OCE.** Castr's canonical mandates "self-exclusion only" against
  the `(agent_name, platform, session_id_prefix)` tuple; OCE's mandates
  self-exclusion via the PDR-076a `sameAgentRoutingKey` comparator PLUS
  the sanctioned F-146 `--exclude-tag` mechanism with its
  mandatory F-75 peer-liveness pairing. A castr seat following its own
  rule is out of contract with the OCE fleet's standby economics; the
  two estates' watcher obligations have silently forked. (Routes as a
  pointer to the castr estate; recorded here as cross-estate drift
  evidence.)
- **L1-F3 — castr `liveness-heartbeat-cron`: formatting-only drift**
  (`*emphasis*` vs `_emphasis_` throughout — different formatter
  passes). Cosmetic; same no-instrument evidence class as L1-F1.
- **L1-F4 — `silence-is-never-liveness` is absent from castr
  entirely** (no canonical, no projections), while castr's
  `slack-watcher` canonical — byte-identical to OCE's — states "silence
  is never liveness" as load-bearing doctrine (§3, the fallback-pairing
  paragraph). A castr Watcher seat is told to obey a rule its estate
  does not carry. (Pointer to castr; drift evidence here.)
- **L1-F5 — OCE `.cursor/rules/comms-all-channels-watcher.mdc`
  description is stale doctrine.** It says "self-exclusion only" while
  the canonical it points at sanctions `--exclude-tag` (F-146). The
  body is a pointer so behaviour routes to canonical, but the
  description is the trigger surface a Cursor session reads first.
  Observed fact: `portability:check` and the full pre-push gate ran
  green three times this session with this drift present — rule-adapter
  description drift is not instrument-checked (skills adapters are, via
  `skills:check`).
- **L1-F6 — the account-synced `oce-slack-watcher` skill is a second,
  weaker, live Watcher protocol.** `/root/.claude/skills/synced/
  oce-slack-watcher/SKILL.md` appears in this session's skill roster
  alongside `oak-slack-watcher`, with a near-identical trigger surface
  ("become the Slack Watcher", "take over the Watcher mantle"). It
  hard-codes what the repo canonical forbids hard-coding ("Channel and
  workspace come from the environment … never from this repo"): channel
  `C0B9AQ2BK5E`, `#remote-coding`, engraph-workspace, and the first
  holder's name. Protocol-wise it predates the canonical's hardening:
  no mantle-state validity resolver, no tenure-bound vacancy sign-off,
  no gap-sweep on relief (baseline is its own intro), no exit criteria,
  no independent fallback pairing. PR #14's round-2 cure correctly
  removed the claim that this exists as a *plugin* skill; the synced
  copy survives outside the repo where no repo gate or PR can touch it.
  A session whose skill router matches the `oce-` name runs the weaker
  protocol against the same live channel — a routing-collision and
  double-delivery hazard on the very organ under review.
- **L1-F7 — inventory-shape finding (already cured in the ratified
  plan): the pre-refinement leg-1 enumeration missed four projection
  tiers.** The PR #14-cured list named only the canonicals, the
  `.claude/skills/oak-*` wrappers, and castr twins; the sweep found
  `.agents/skills/`, `.agents/rules/`, `.cursor/rules/`, the
  `.claude/settings.json` permission entries, and the out-of-repo
  synced store besides. Recorded as evidence for the discovery-sweep
  refinement the owner ratified 2026-08-24.

### Leg-1 observations carried forward to later legs (not findings yet)

- The watcher skill's liveness story (§3: self-re-arming `send_later`
  chain + "a separate long-interval scheduled check (an hourly cron
  routine or equivalent)" + on-turn overdue checks) reads as
  instrument-shaped prose; leg 2 must classify each element
  instrument-backed vs prose-only against the 2026-08-24 retrospective's
  lens, and against `watcher-liveness-self-heal.md`'s named gap (a dead
  Claude Code Monitor stays dead; the restart step is unowned).
- The Slack Watcher's mantle/liveness machinery (channel-post state
  resolution) is entirely disjoint from the estate's comms-stream
  liveness machinery (heartbeat events, F-95 asserts, PDR-133 classes)
  — the Slack channel is its own substrate with no PDR-133 class
  declaration. Leg 2/leg 3 territory.
- `cloud-environment.md` singles-sources SLACK_WATCHER_* in the
  write-only dialog (leg 4's subject); the repo reference file is the
  only readable authority, per the 2026-08-24 outage lessons.
- Both canonical skills tell an unset-variable session to "ask the
  owner — never hard-code or guess" (fail-fast posture); what a
  *partially* broken configuration does (set but wrong channel id)
  is undefined anywhere. Leg 4.

## Leg 2 — liveness and lifecycle mechanics (COMPLETE)

Every liveness/lifecycle claim in the Watcher surfaces, classified
instrument-backed (a runnable mechanism exists and was verified) or
prose-only (the claim's execution is a reader's discipline). The
2026-08-24 retrospective's lens applies throughout: instruments that
exist as prose and never fire are the measured failure class of
unattended organs.

| # | Claim (source) | Class | Evidence |
| --- | --- | --- | --- |
| 1 | Identity derivation before posting (skill §1) | **instrument-backed** | `pnpm agent-tools:agent-identity` exists; run this session (`Raven stirs Murmur`) |
| 2 | Mantle-state resolution — latest valid mantle-state post, tenure-bound vacancy validity, void-post skipping (skill §2, §5) | **prose-only** | A precise algorithm (races, legacy vacancies, post-vacancy classification) with no resolver implementation and no tests; every fresh reader re-derives it from ~90 dense lines |
| 3 | Baseline custody + takeover gap-sweep (skill §2) | **prose-only** | The baseline `ts` lives in session memory between ticks; it becomes durable only when embedded in a sign-off post. No cursor artefact (contrast: the comms watcher's seen-file) |
| 4 | Tick re-arm via `send_later` (skill §3) | **instrument-backed** | Platform Routine primitive; pending reminders inspectable/deletable via the Routines surface |
| 5 | The independent fallback — "a separate long-interval scheduled check (an hourly cron routine or equivalent) that verifies the last tick ran on cadence" (skill §3) | **prose-only, and unimplementable as written** | There is no observable for it to check: quiet ticks leave no trace anywhere (the one-line report goes to the holder's own transcript), the baseline is session state, and a self-bind Routine records no `last_run` (the Routines API omits it when a trigger wakes its own bound session). The named check has nothing to read — the retrospective's exact class |
| 6 | On-turn overdue catch-up (skill §3) | prose-only by nature | A behavioural discipline; fine, but it is vigilance, not structure |
| 7 | Exit criteria — five-idle default, supersession, owner teardown (skill §3) | **prose-only** | Nothing counts idle ticks or recomputes the criteria (`loop-exit-criteria-required` is satisfied on paper only) |
| 8 | Watcher liveness as seen by others (talk-to §Receiving: two stated poll intervals of silence → report to owner) | **prose-only active probe; no passive deadman** | Quiet ticks post nothing to the channel, so channel silence is ambiguous between healthy-quiet and dead. `silence-is-never-liveness` step 1 ("pair every watcher with a positive deadman signal") is NOT satisfied for the Watcher organ itself; the only detection is a correspondent choosing to probe |
| 9 | Push-notify the owner on ticks with new messages (skill §3) | **instrument-backed, one-way** | Platform push exists; but absence of pushes cannot distinguish quiet channel from dead loop |
| 10 | PDR-133 liveness-class declaration for the Slack + Routine substrate | **absent** | The estate's class model (PROCESS/CURSOR/DELIVERY/NOTIFY/INTEGRITY/…) is declared for the comms substrate and undeclared here; NOTIFY (does a Routine firing actually wake the reasoning loop?) and INTEGRITY (can a tick read a gap?) are exactly the classes the coordinator-dark-window incidents showed can fail while emitters look healthy |
| 11 | Loop-death restart ownership | **prose-only, honestly declared** | `watcher-liveness-self-heal.md` names the gap (a dead loop stays dead; restart unowned) and correctly holds at do-not-build-yet pending go/no-go |

Summary: the protocol's *state semantics* (mantle validity, tenure
binding, gap-sweeps) are unusually well specified — better than most
prose in this class — but of eleven liveness/lifecycle claims, only
three ride instruments, and the skill's own single-point-of-failure
mitigation (claim 5) cannot fire because the organ emits no durable
tick evidence for it to verify.

## Leg 3 — communication routing coherence (COMPLETE)

### The comparative frame (owner-supplied, 2026-08-24, tested here)

The owner's framing: the Watcher's needs are the estate's normal comms
needs; the main difference is the medium — instead of a coordination
branch there is a Slack channel. Tested need-by-need:

| Need | Estate comms organ (repo medium) | Watcher organ (Slack medium) |
| --- | --- | --- |
| Shared durable substrate | Comms event stream on the coordination branch: append-only JSON events, schema-validated at write, folded to main on the 24h ceremony | Slack channel history: server-ordered by `ts` — ordering, not immutability (edits and deletions mutate history: the tenure status message is edited every tick, and race-voided vacancy posts may be deleted). Slack's server is the serialiser — it does for free what the coordination branch does by ceremony (no merge races, no fold needed) but admits no schema, no gates, no estate-controlled versioning |
| Identity | PDR-076a routing key, boundary-validated by the CLI | A prose attribution marker in message text (three facts); nothing validates it |
| Who-holds-what state | Claims registry: CLI-guarded, TTL freshness, F-95 mechanical refusals | Mantle state resolved from the latest valid channel post: rich algorithm, executor is each reader, no refusal mechanics |
| Wake / delivery | Monitor primitive + notification path, PDR-133-classified | `send_later` chain + owner push; PDR-133 undeclared (leg 2 #10) |
| Liveness | Heartbeat events, peer-liveness classifier, staleness gates, deadman files | No passive signal; correspondents' two-interval probe (leg 2 #8) |
| Cursor / baseline | Seen-file: atomic, tool-owned, survives restarts | Baseline `ts` in session memory; durable only inside sign-off posts |
| Gap-sweep | Mandated post-arm/post-restart foreground sweep, tool-assisted | Mandated takeover sweep, hand-executed (well specified) |
| Self-exclusion | `sameAgentRoutingKey` comparator in the CLI | The medium provides it (Slack does not notify you of your own posts) — with the shared-credential twist that the OWNER is also un-notified of Watcher-directed traffic |
| Conservation | Decision-bearing fast-lane content mirrors to durable homes at occurrence; the fold conserves the branch into main | **No mirroring clause exists for Slack.** Nothing conserves channel-borne decision content into the estate's record |
| Audience | Agents (owner via the rendered log) | Humans natively, agents via MCP — the Watcher is the bridge organ between the two substrates |

Where the frame holds: every estate comms need has a Watcher
counterpart, and the Slack channel genuinely occupies the
coordination-branch role — including inheriting its serialisation duty
without the fold ceremony's cost. Where it strains, one generator
explains all of it: **the repo medium is instrumentable and Slack is
not** — gates, CLIs, and validators run on git files, so every comms
mechanism that is instrument-backed estate-side degrades to prose when
its counterpart crosses to Slack; and the conservation boundary (the
fold) has no Slack analogue at all.

### Per-flow routing-coherence rows (plan acceptance 3)

| Flow | Owning surface | Mirror-to-durable | Double-delivery / silent-drop windows |
| --- | --- | --- | --- |
| agent → Watcher | `talk-to-slack-watcher` | **None stated.** The `comms-channels` mirroring obligation names s2s and ARC, never Slack; a decision-bearing message to the Watcher lives in Slack only | Silent-drop: a down Watcher leaves the message unread; detection exists only if the correspondent runs the two-interval probe |
| Watcher → agent (reply) | `slack-watcher` §4 + `talk-to` §Receiving | None (thread-durable in Slack) | Drop: correspondent stops polling before the reply lands; peer-message-never-authority correctly mirrored on both sides |
| agent via Watcher → Slack (relay egress) | **No owning surface.** The plan names the flow; no skill defines it. The Watcher's reply policy would classify a relay ask "consequential → draft and notify the owner, don't act" — a de facto refusal, coherent but nowhere stated as the flow's disposition | n/a | n/a — the gap is the finding |
| Slack → Watcher → estate (inbound news) | `slack-watcher` §3 (summarise, push-notify) | **None.** Summaries live in the holder's transcript and push notifications; nothing lands in the comms stream, thread records, or any durable home — session end erases the organ's memory of what it saw | Silent-loss: a Slack-borne fact or decision reaches the estate only via the owner's manual relay |
| Watcher ↔ Watcher (succession) | `slack-watcher` §2/§5 | The channel itself is the durable record (intros, reliefs, sign-offs) | Analysed in-skill to an unusual depth (race-window vacancy voiding, post-vacancy classification). Residual: enforcement is each holder's compliance — a stale holder double-replies until its next tick re-check; bounded by cadence, not mechanics |

## Leg 4 — configuration and environment coupling (COMPLETE)

Single-sourcing verdicts per variable (plan acceptance 4):

- **`SLACK_WATCHER_CHANNEL_ID`** — single-sourced in the cloud
  environment dialog; every repo surface (both canonical skills,
  `cloud-environment.md`) points there and none carries a value. Live
  probe this session: set (`C0B9AQ2BK5E`). One violator existed — the
  account-synced skill hard-coding the id — **owner-ruled RETIRE
  2026-08-24 and removed from this container**; residual: the synced
  store can re-sync from the claude.ai account, so the durable removal
  is the owner deleting it account-side.
- **`SLACK_WATCHER_WORKSPACE`** — same verdict, same violator, same
  disposition (live probe: `engraph-workspace`).
- Caveats on both: the dialog is write-only (the 2026-08-24 outage's
  lesson — the repo reference file is the only readable authority, and
  no instrument can diff dialog against reference; drift is detectable
  only at runtime), and non-cloud sessions have no stated source for
  these variables at all — "ask the owner" is the only local-session
  path.

Fail-fast or silent limp:

- **Unset** → both skills mandate "ask the owner — never hard-code or
  guess": fail-fast in posture, prose-only in mechanism (no preflight
  probes the variables at stand-up).
- **Set but wrong** (stale channel id after a migration; wrong
  workspace) → **silent limp, undefined everywhere**: the Watcher would
  post its intro into the wrong channel and diligently watch it. No
  stand-up step validates the id against the live workspace or
  echoes the resolved channel NAME back to the owner.

Metered-surface bearing: `oak-chrome-session-is-metered` binds the
Oak-account Chrome seat, which the Watcher's Slack-MCP path does not
touch — no direct constraint. Its economics generalise: browser
fallback is reach-for-last, and tick cadence is quota spend on the
holder's session with no consumer on quiet channels (the same
economics the owner priced for the heartbeat-firehose standby); the
intro's stated cadence is where that price is declared.

## Leg 5 — synthesis: verdicts and routed proposals (COMPLETE)

### Verdicts per surface (plan acceptance 1)

| Surface | Verdict | Grounds |
| --- | --- | --- |
| `slack-watcher` canonical | **KEEP** (with FIX proposals P1/P3/P4) | State semantics unusually strong; liveness observables missing (leg 2) |
| `talk-to-slack-watcher` canonical | **KEEP** (with FIX proposal P2) | Coherent correspondent protocol; conservation gap is `comms-channels`' to close |
| `oak-*` wrappers, both adapter tiers | **KEEP** | Thin, description-synced, gate-checked (`skills:check`) |
| `.claude/settings.json` watcher permission entries | **KEEP** | Consistent with the wrappers |
| `comms-all-channels-watcher`, `liveness-heartbeat-cron`, `silence-is-never-liveness` rules | **KEEP** | The comparison baseline; out of this lane's amendment scope |
| `comms-channels` skill | **FIX** (P2) | Slack lane absent from the delivery-lane table and the mirroring obligation |
| `.cursor/rules/comms-all-channels-watcher.mdc` description | **FIX** (P5) | Stale doctrine line ("self-exclusion only"); gate-tolerated (L1-F5) |
| `cloud-environment.md` § environment variables | **KEEP** | Single-sourcing holds (leg 4) |
| Account-synced `oce-slack-watcher` | **RETIRE — owner-ruled 2026-08-24** | Removed from this container this session; account-side deletion is the owner's remaining act (re-sync residual) |
| `watcher-liveness-self-heal.md` | **KEEP** as gated speculative | Its go/no-go honesty held; this review's leg 2 is new evidence for its "ground" step |
| `slack-assistants` backlog + observability research note | **KEEP** | Adjacent organ; no Watcher authority; no drift found |
| castr twins (watcher rule behind; `silence-is-never-liveness` absent) | **Pointer to castr** (L1-F2/F4) | ship-independent-coordinate-dependent; never absorbed here |

### Proposals (each: warrant, falsifier, PDR-130 lane)

**Adoption record (2026-08-24, owner word in-session to this seat:
"agreed to all").** All six proposals adopted; P1–P5 executed the same
session by this seat: P1 as the tenure status message
(`slack-watcher` §2/§3/§5 — one threaded reply under the intro, edited
every tick, the deadman + durable baseline in one artefact; consumed
by `talk-to-slack-watcher` §Receiving), P2 as the Slack-via-Watcher
lane in `comms-channels` (table row, bridge bullet, mirroring
obligation extended across the Slack boundary both directions, relay
egress stated owner-mediated), P3 as `slack-watcher` §6 (the PDR-133
declaration table for the Slack + reminder substrate), P4 folded into
`slack-watcher` §2 (the stand-up echo-back), P5 as the trued
`.cursor/rules/comms-all-channels-watcher.mdc` description (the
rule-adapter drift-gate question stays routed to the skills-estate
lane). P6 — the account-side deletion — was completed by the owner during
the same arc (2026-08-24).

- **P1 — give the Watcher a durable tick anchor.** Each tick (or tick
  batch) records baseline `ts` + timestamp somewhere durable and
  estate-readable — a small state file, or a comms lifecycle event.
  One anchor cures three leg-2 findings at once: the fallback check
  (claim 5) gains the observable it currently lacks, the organ gains a
  passive deadman (claim 8), and baseline custody survives session
  death (claim 3). *Warrant*: leg 2 — the skill's own mandated
  mitigation cannot fire today. *Falsifier*: a demonstrated instrument
  that reads tick cadence from existing surfaces (Routines `last_run`
  is recorded absent for self-bind triggers, so today none is known).
  *Lane*: fast — operational fix, route to a follow-up ticket/lane.
- **P2 — add the Slack lane to `comms-channels`.** A delivery-lane
  table row (Slack-via-Watcher) and a Slack clause in the mirroring
  obligation: decision-bearing content crossing the Slack boundary in
  either direction mirrors to its durable estate home at occurrence.
  Also states the relay flow's disposition (leg 3: today a de facto
  owner-mediated draft, written nowhere). *Warrant*: leg 3's
  conservation gap — the only delivery lane with no mirror clause is
  the only one humans use natively. *Falsifier*: evidence that
  Slack-borne decision content reliably re-enters via the owner's
  relay, making the clause redundant ceremony. *Lane*: fast.
- **P3 — declare PDR-133 liveness classes for the Slack + Routine
  substrate.** Which classes each Watcher check reaches, and which
  nothing reaches (NOTIFY and INTEGRITY are the known-dangerous ones).
  *Warrant*: PDR-133's per-platform declaration obligation; the
  coordinator-dark-window class showed emitters healthy while
  reasoning is dark. *Falsifier*: the declaration exercise finds every
  class already covered by existing prose. *Lane*: fast (the
  declaration); slow-lane register only if it exposes a
  constitutional-class gap in PDR-133 itself.
- **P4 — stand-up echo-back probe.** At mantle take-up, read the
  channel's live metadata once and state the resolved channel NAME and
  workspace in the intro post, converting the leg-4 silent limp
  (wrong-value config) into an owner-visible fact at the moment it is
  cheapest to catch. *Warrant*: leg 4 — set-but-wrong is undefined
  everywhere. *Falsifier*: Slack MCP scopes cannot read channel
  metadata. *Lane*: fast.
- **P5 — true the Cursor rule-adapter description** (and decide
  whether rule-adapter descriptions deserve the same drift gate skills
  have). *Warrant*: L1-F5 — the gate ran green with doctrine-bearing
  drift present. *Falsifier*: the description is found to be
  deliberately frozen (no evidence of that was found). *Lane*: fast
  for the truing; the gate question routes to the skills-estate lane.
- **P6 — account-side deletion of the synced skill** (owner's act; no
  agent can reach it). *Warrant*: L1-F6 + the owner's 2026-08-24
  ruling — and a measured probe: the in-container removal was undone
  by the account sync WITHIN THE SAME SESSION (deleted, then observed
  restored on disk minutes later; deleted again). Local removal is not
  a mitigation at all; the claude.ai account's skills surface is the
  only effective deletion point. *Falsifier*: none needed — the ruling
  is made. **Completed: the owner performed the account-side deletion
  during the same arc (2026-08-24); nothing remains open on this row.**

### Review-question answer (the plan's Goal, answered)

Can a fresh Watcher seat start, run, and hand off from the written
surfaces alone? **Start and hand off: yes** — the mantle protocol is
complete, precise, and self-contained (leg 2's classes 2, 3, 7 are
prose but *readable* prose). **Run unattended: not trustworthily** —
the organ has no passive liveness signal, its mandated fallback cannot
fire, and its memory of what it saw dies with the session. Can agents
communicate with or via it without drift, double-delivery, or silent
loss? **Drift and double-delivery: yes, within tick-cadence bounds**
(the validity rule is the strongest prose in the estate's watcher
corpus). **Silent loss: no** — two structural windows exist (unread
messages at a dead Watcher; inbound news conserved nowhere), and P1 +
P2 are their smallest cures.

*(The verdict above is the AS-REVIEWED answer, frozen before the
adoption record. Post-adoption state, same day: P1 supplies the
passive deadman and the fallback observable, and P2's mirroring
obligation closes the conservation window — both as-designed, no
tenure has yet run them (see `slack-watcher` §6's unverified rows).
The remaining unattended risk is the unverified `NOTIFY` wake and
traffic sent while the Watcher is down.)*
