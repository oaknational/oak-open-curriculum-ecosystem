# Next-Session Record — estate-coordination (the Director lane)

The Director lane's thread record: journal, lane state, and seat chain for
the estate-coordination thread (the thread name every Director claim since
2026-07 has carried). Founded 2026-08-13 by the
`director-continuity-surface-redesign` plan: before this record existed, the
Director was the one lane with no thread record, and
[`director-handoff.md`](../director-handoff.md) absorbed the journal job —
the accretion that plan cures. The handoff file keeps the role brief and the
single live snapshot block; **this record carries the journal and lane
state**, under the same conventions as every other thread.

## Current Continuation — MAKE-SAFE PAUSE (owner word 2026-08-13 ~19:40Z; multi-day quiet; NOT a closeout)

- State at pause: fleet wind-down executed at owner word ("no work will
  happen over the next few days … everything safe and trivial to pick back
  up"). The coordination branch folded to main (fold PR referenced in the
  Journal's wind-down entry); successor branch cut from post-fold main;
  the primary resides there.
- Invocation pointer at pickup: `oak-start-right-team continue
  estate-coordination` from this record. Read the
  [rulings ledger](../director-rulings-ledger.md) §Homing queue +
  §Census addenda before S3.
- Controlling plan:
  [`director-continuity-surface-redesign`](../../../plans/delivery/director-continuity-surface-redesign.plan.md)
  serving
  [`coordination-substrate`](../../../plans/strategic/coordination-substrate.plan.md)
  (ratified 2026-08-07). Plan status at pause: check its frontmatter —
  sketch unless the ratification stamp landed at the wind-down card; a
  sketch governs no work, so S3–S6 open only after the stamp.
- Next safe steps at pickup, in order: (1) re-ground per start-right (live
  claims, comms, git — this record is a hypothesis, not truth); (2) if the
  plan is unstamped, present it (the assumptions-expert verdict is recorded
  in the Journal wind-down entry if it landed, else re-run); (3) S3 homing
  queue (six unhomed + census addenda first-hand reads); (4) S4
  one-live-block rebuild with byte-conserved relocation; (5) S5 validator
  lane PR; (6) S6 consolidation routing.
- Claims at pause: `a2286c53` (Director) retained stopped-seat-held — the
  successor adopts via `claims adopt` per the brief's readiness gate.
  `dd3f640f` closed 2026-08-13 (premise complete as PDR-136).
- Fleet at pause: Skua (e2b222) was live driving #846 at the wind-down
  write — their close broadcast is the authoritative record of their exit;
  Nautilus (c6d48b) cold-paused, claim `95a0678d` retained, survey
  owner-HELD (gates expire 2026-09-02).
- Open-PR disposition at pause: #846 owner-worded to merge (Skua drove);
  #774 illustrative never-merge (owner verbatim); #772/#761 Clerk-stack
  gated on the production promotion settling; #867 and #750 are draft
  lanes owned by their threads (sentry-docs truing; docs-pnpm setup) —
  pickup at those threads' next touch; #880–#883 emgeebot (Matt's agent)
  lanes — never ours to chase.
- Acceptance bar: the controlling plan's six acceptance criteria.

## Standing tenure posture (owner words, 2026-08-13)

- "Question the assumptions and authority of decisions handed to you by the
  previous seats and plans" — issued to this seat twice (emphasis) and to
  the design seat the same evening. Inherited decisions are hypotheses
  until their authority is traced (whose word, dated, competent for the
  claim class).
- "Make sure knowledge is conserved at all times, and properly homed" —
  the governing constraint of the redesign; additive before subtractive.
- Fleet concurrency: at most two subagents at a time while the
  tighter-quota constraint stands (owner, 2026-08-13, "for now").
- Warden arrangement (2026-08-13 morning, joint on the design arc channel,
  root-caused from the three-writer index collision): the Director is sole
  commit-warden of the primary checkout's `git:index/head`; implementers
  hand commit intents via channel or directed events; worktrees stay
  implementer-owned.

## The live board (authoritative restatement, adopted 2026-08-13 from Plover's closeout)

1. Design lane: ratified plan governs, W1→W2. At the wind-down write Skua
   (e2b222) was live driving #846 to merge at owner word; their close
   broadcast (or its absence) is the authoritative close record —
   re-ground from the claims registry and comms at pickup, never this row
   (Copilot thread on fold PR #884 caught the earlier
   anticipatory/adopted-verbatim incoherence here).
2. MCP-590 tail: error-envelope PR (`formatError` + two callers,
   `{code,message,upstreamMessage}` via `structuredContent.error` +
   `content[1]` mirror, NOT `_meta`; contract test). Question A1 first.
3. MCP-590 tail: operational rebuild stage→verify→promote — PROBE ENV
   ACCESS FIRST (A2).
4. MCP-590 tail: demo-default flip to primary (2 lines:
   `demos/oak-curriculum-hub/.env.example` + README) — sequenced after (3);
   verify A3 first.
5. Route Swordfish's five-item non-design-lane handoff (directed event
   2026-08-13 14:33Z; synthesis at
   `.agent/reports/governance/development-practice-review-2026-08-13/`) —
   A9: the ordering is expert-synthesis, not owner word.
6. Route skills groups 2–6.
7. Route authority-class tagging as a plan-schema candidate
   (`new-rule-vs-pdr-clause`, at a lull) — A10 applies.
8. Estate expect-then-if sweep + test-expert §Diagnosis-5 true-up — A15:
   re-read both texts before sweeping.
9. Comms archive sweep (5,600+ events, drain-cost class).
10. Route the 19 outgoing-identity carriers via the rename plan's slices —
    A8: census first.
11. Route the lowest-effective-level principle as a doctrine candidate —
    A10 applies.
12. Route the pds-rename prose-tail doc drift (Skua's routing event
    2026-08-13 19:16Z, belongs to the `public-digital-service-identity`
    plan's estate-prose tail, not the design lane): (a)
    `packages/design/oak-design-system/studio-source/whitelabel/pds/BRAND.md`
    still titled with the outgoing identity name, stating
    distance-maximisation as the design goal — mis-weighted under owner ruling R15 (fidelity to GDS
    is the brief, distance a consequence); `DECISIONS.md` ~line 35 carries
    the same stale name. (b) The design-system-usage skill canonical still
    names the outgoing counter-brand directory (whats-where reference
    likewise, unverified).
13. Cure the `practice-index.md` §"Rules cited by Practice Core" framing —
    owner verdict 2026-08-14 (verbatim: "wow, that is deeply incorrect"):
    the section asserts portable Practice-Core PDRs cite host-local rule
    files as their enforcement, which inverts the reference-direction law
    (host surfaces cite the portable doctrine they operationalise, never
    the reverse; kin: the PDR-117 host-indirection truing). Cure shape:
    restate the section as host-rules-operationalising-core AND
    first-hand-audit the named PDR bodies (014, 028, 038, 003, 091, 138)
    for host-path citations — each found citation is its own truing.
    Bounded fix on the coordination branch; not absorbed into PR #886.
14. ADR-225 acceptance gate (critical-pass finding, PR #886, 2026-08-14):
    the §Supported-independent-compositions MUST binds EVERY provider a
    host profile selects — at acceptance this retroactively covers the
    existing estate (hosting, auth, search, telemetry) with no exercised
    compositions and no transition story. Safe while Proposed; the
    transition/scope decision is the owner's at the acceptance moment.
    Recorded on the PR at merge.

HELD STATES (not tasks): survey lane owner-HELD (machine-readable gates
expire 2026-09-02; Nautilus cold-paused, claim `95a0678d`); #774 =
ILLUSTRATIVE spike (owner verbatim 2026-08-13; content tracks MCP-143's
landing shape; migration waits on the Clerk production promotion);
pr-846-review-fleet node RATIFIED and W1-executed (MCP-591; report at
`.agent/reports/design/pr-846-review-fleet/report.md`) — W2+
owner-sequenced (A11: inference, verify the node body before acting).

## Assumptions register (A1–A15, owner-instructed; question each at pickup)

Adopted verbatim-in-substance from the 2026-08-13 closeout; dispositions
recorded as they are questioned:

- A1 error-envelope shape rests on a 2026-08-12 probe — re-probe against
  the CURRENT SDK before building. OPEN.
- A2 rebuild env access unverified from any live seat — probe first. OPEN.
- A3 demo-flip safety rests on owner word (consuming-app search read-only)
  — verify no other ES write path. OPEN.
- A4 Bucket-1 tail shape is ratified-plan-derived — re-derive warrant per
  item at pickup. OPEN (standing).
- A5 channels to d0274e dead; design contact is Skua — DISCHARGED
  2026-08-13 ~18:1xZ: ListAgents verified Skua live; Skua adopted claim
  `645b9e0b` at 18:08Z and acknowledged Director routing at 18:17Z.
- A6 worktree-isolation cure encodes current platform behaviour, not
  version-pinned — re-verify at any Claude Code update. OPEN (standing).
- A7 bot mint-token yields the bot only from primary-root cwd — echo
  `.user.login` in-band on every identity-bearing write. OPEN (standing
  tripwire).
- A8 the 19-carrier count is a census read, not first-hand — census before
  routing. OPEN.
- A9 five-item handoff ordering is expert-synthesis, not owner word. OPEN.
- A10 both doctrine candidates are seat framing, not owner asks — drop
  either if warrant fails. OPEN (one of them — lowest-effective-level — was
  since ratified by the owner 2026-08-13 per per-user memory; verify at
  routing).
- A11 "846-fleet W2+ owner-sequenced" is shape-inference — read the node
  body before acting. OPEN.
- A12 comms-drain tuning fits today's ~5,600-file stream — recompute after
  the archive sweep. OPEN.
- A13 R12/R13 verbatims are relayed; durable provenance is the ratified
  plan's rulings table — cite the plan. OPEN (standing citation rule).
- A14 "Vesta hunts Expanse" agent authorship is self-declared — verify if
  it matters. OPEN.
- A15 expect-then-if sweep presumes both texts still read as remembered —
  re-read before sweeping. OPEN.

## Inheritance audit outcomes (2026-08-13, fleet run `wf_c5bddb5d-466` — 81 rows, all homes opened first-hand)

Rulings verdicts live in the
[Director rulings ledger](../director-rulings-ledger.md). Lane-state
verdicts (board, held states, assumptions, plan-handed decisions):

- **Claim `dd3f640f` CLOSED at this audit** — its premise (author the
  MCP-491 step-2 PDR) completed 2026-08-04 as PDR-136 (owner-ratified),
  verified first-hand; the claim had been stale-held through three freeze
  blocks. Board consequence: the gate-ledger lane needs no routing.
- **BOARD-4 (demo-default flip)**: the underlying 2026-08-13 owner ruling
  has NO repo/ticket record — single-seat attestation only. Conservation
  act at S3: land the ruling on its ticket/thread before execution, or
  re-confirm at the execution card.
- **BOARD-8 + A15 (expect-then-if sweep)**: the presumed stale test-expert
  reading finds no file text — the board item reshapes to "verify the two
  texts first; drop the true-up half if nothing is stale". A15 moves to
  QUESTIONED with that finding.
- **HELD-3 (846-fleet "W2+ owner-sequenced")**: no gate exists in the node;
  the qualifier is inference — the plan's own owner card sits after W2
  synthesis. A11 vindicated.
- All other board items, held states, and A-rows: authority CONFIRMED and
  classified (owner-verbatim/paraphrase vs seat-inference recorded per row
  in the fleet output; decision-relevant classifications carried in the
  ledger and this section).
- Critic census-holes queued in the ledger §Census addenda (lines 342–371;
  line 971 "self-limits are gated on ASKING, never silent"; line 357 ESM
  ruling; the 690–1100 graph-tools scope fence; brief-embedded rulings).

## Journal

### 2026-08-13 ~18:2xZ–19:0xZ — Smith hunts Obsidian (e98f17): adoption and the redesign arc

Seat adopted from Plover lifts Troposphere (b10c37) via stopped-seat-held
claims after their owner-worded closeout (their heartbeat-end declaration
was the stand-down evidence; readiness gate run with the mechanical check
pasted). Owner mandate for the tenure: question inherited assumptions and
authority — the seat's opening assumption audit caught two false working
beliefs before any authority act ("Plover is dark": false; "no Moment-1
event exists": recall-gapped grep). The director-handoff accretion was
measured (daily commits since 2026-07-14; 174 banners; 1,631 lines against
a 320-line budget), diagnosed (three jobs in one volatile section; no
Director thread record; no drain ritual), and the redesign plan authored
and presented. Rulings inventory complete; verification fleet running under
the two-at-a-time throttle after a session-limit event killed 7 of 12 legs
(5 banked, resume from cache). This record founded as plan S1.

### 2026-08-13 ~20:3xZ — Smith hunts Obsidian (e98f17): wind-down fold executed

Owner wind-down word executed within the hour: fold PR **#884** (bot-authored,
jimbot label) merged to main at `c8586f477` — full condition held (four
required checks green by name; Copilot's seven-thread round read in full,
replied and resolved at the boundary; claude leg org-overage quota-skip,
recorded exclusion). Successor branch `coordination/2026-08-13-c8586f` cut
from post-fold main; primary resides there. moved for teachers: no
live-service change in the fold (the day's teacher-facing motion, the #871
lesson-search freshness slice, landed earlier). moved for the Practice: the
Director continuity-surface redesign S1/S2 durable on main — thread record,
81-row rulings ledger with authority classes, inheritance-audit outcomes
(stale claim closed against PDR-136), live-state banner, make-safe pause
state, formation letter. The plan-readiness verdict (READY-WITH-EDITS, 8
before-stamp findings) is conserved as bot comment 5285713690 on #884 —
applying findings 1–8 is the FIRST pickup act, before the ratification card.
Finding 1's claim-side cure executed at this entry: the Director claim
re-threaded to `estate-coordination` (close+reopen, new claim id in the
registry) so the claim→record path resolves. Copilot's three tonight-cures
landed in this commit (fleet-state truing, two plan `last_updated` fields,
one report label). #846 was in CI at Skua's seat at this write.

### 2026-08-14 ~06:3xZ — Smith hunts Obsidian (e98f17): COMPACTION FREEZE mid-PR-886 drive; seat continues

Owner word "prepare for compaction" (no stop-processes word — the #886
settle watch stays armed; the canonical comms watcher was deliberately not
re-armed this morning under the n=1 exemption). Drive state, durable and
resumable from the PR alone:

- PR #886 (owner-agent docs: capability architecture) at tip `d6f664036` —
  conflicts resolved, PDR renumbered 138→139 (main took 138 overnight),
  Copilot round-1 findings cured, my false be4ec15ba reply citations
  CORRECTED on both threads (staged-vs-worktree divergence: a git mv had
  staged pre-cure content, my pathspec omitted the file, verification read
  the tree — Copilot's re-round caught it; verify the INDEX, not the tree).
- Owner-ordered adversarial panel (2 legs, opus, max-different lenses):
  BOTH returned FINDINGS-BLOCK-MERGE, near-disjoint findings. Reports
  conserved verbatim as PR comments 5290506438 (assumptions lens) and
  5290514095 (failure-modes lens). Waves 2–3 deliberately held: verdict
  settled; fresh lenses go to the CURED text.
- THREE OWNER RULINGS (in-session, 2026-08-14): MUST forward-scoped +
  priors named (ADR-074/076, 219, 162 not retroactively bound); the
  no-vendor-structural-dependence constraint IS the owner's, ESTABLISHED
  in ADR-225 (owner-declared at review) — ledger row XPLAT-2; full cure
  in this PR now, acceptance residue on the checklist, fresh adversarial
  leg on cured text before merge.
- Cure state: NOT YET APPLIED — the first cure script died on a stale
  anchor BEFORE its write (all-or-nothing protected the tree; worktree
  verified clean). The full cure map + acceptance checklist is PR comment
  5290518682. Resume lesson: re-derive every anchor from LIVE file text.
- Resume order: (1) re-ground; (2) apply the cure map in the worktree
  `.claude/worktrees/pr-886-capability-architecture` (built, deps in);
  (3) commit+push; (4) fresh adversarial leg (architecture-expert-fred —
  both reviewers recommended it) on the cured text + Copilot re-request;
  (5) settle per the state machine; (6) bot merge at the fetched oid
  (owner word "fix and merge" stands, post-panel); (7) Phase 8 harvest;
  (8) worktree removal; (9) board items 13/14 remain routed, untouched.

## 2026-08-14 ~07:4xZ — three-body comparison recorded and homed (Smith hunts Obsidian, e98f17)

- Owner-invoked comparison of the PR-886 capability architecture, the
  web-app-deconstruction corpus, and the survey programme delivered and
  owner-agreed ("Thank you, I agree"), with the direction to record the
  findings everywhere they matter. Permanent home:
  `.agent/research/capability-deconstruction-survey-comparison.md`
  (six findings; stitches routed). Survey-design inputs banked at
  `survey-machinery-deconstruction.plan.md` §Banked inputs (pointer-carry,
  no scope change). Ledger row DECON-5 records the placement-doctrine
  scope verdict. Napkin harvest at `2ef203c1b` preceded this.
- RESUME-ORDER ADDENDUM for the PR-886 drive (extends step 2 above,
  owner-agreed 2026-08-14): during the cure application, also add one
  Related line to the PR's research doc
  (`.agent/research/provider-independent-capability-architecture.md`)
  citing the deconstruction meta-analysis's provider rows (negative-space
  "tested semantic portability, exit, restoration and retained options" +
  lens 30) — the convergence stitch. Conserved on the PR as a bot comment
  at this entry's commit.
- Deconstruction-side stitch deliberately deferred: log ADR-225/PDR-139
  as an evidence event in the deconstruction hypothesis register per its
  own review rule only AFTER #886 merges — Proposed doctrine is not yet
  evidence.

## Participating agent identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-fable-5 | e98f17 | Smith hunts Obsidian | Director — record founder, redesign executor | 2026-08-13 | 2026-08-13 |

Prior Director seats predate this record; their identities and tenures are
carried in the seat chain below and their full identity tuples in the
handoff file's historical blocks (relocating byte-conserved to the
operational archive at plan S4 — that archive is the provenance source, not
this table).

## Seat chain (reconstructed from the handoff record's block census, 2026-07-26 → 2026-08-13)

Squall wakes Apex → Moon rides Penumbra → Lynx → Bora → Falcon hunts Flight
→ Magnetar binds Oblivion → [Firefly ← vacant interval] → Petrel holds
Turbulence / Wisteria → Spark weaves Paraffin → Panther rides Midnight →
Plover lifts Troposphere (b10c37, closed 2026-08-13 18:13Z) → Smith hunts
Obsidian (e98f17, adopted 2026-08-13 ~18:2xZ). Numbered owner-ruling series
ran continuously across tenures (1–42 Falcon-era, 43–51 Spark-era) — the
instinct the rulings ledger (plan S2) formalises.

## Standing decisions this thread carries forward

- The rulings ledger (plan S2) is the capture-to-homing proof surface;
  rulings home in their proper durable surfaces, never inline in volatile
  blocks.
- Every append-accepting surface acquires its drain ritual at birth —
  doctrine candidate, routes via `new-rule-vs-pdr-clause` (A10 discipline
  applies to it too).
- The owner directs through the Director; blocking owner asks are cards,
  never prose; lens-gate before owner-surface.

## 2026-08-14 ~11:5xZ — PR-886 drive COMPLETE (Smith hunts Obsidian, e98f17)

- MERGED by the owner directly (jimCresswell, 2026-08-14T11:39:49Z, merge
  commit c0a6c08d3, branch tip ab608269b). Task 9 closed. Thirteen review
  rounds ran (adversarial panel x2 lenses, architecture-expert-fred,
  Copilot x10 content rounds, round 13 clean); 55 findings harvested
  including every suppressed comment; per-round dispositions are PR
  comments 5290506438 through 5292754030. Owner rulings in-drive beyond
  the original three: the provider-quantified invariant restatement
  (ledger XPLAT-3) and the hour-idle cold-pause policy (ledger
  COLD-PAUSE). The owner-directed comment-record audit found and cured
  the attribution-drift defect (owner-ruling heading over review-derived
  sentences; split at d3a9fa269) and restated checklist items as
  decision pointers.
- Board item 14 (ADR-225 acceptance gate) now carries the full
  acceptance checklist: original residue (cure-map comment 5290518682)
  plus ADR-042 amend/supersede/retain decision, PDR-139-first-or-joint
  ordering, and the constraint-wording residue — all owner decisions at
  the Proposed-to-Accepted flip, none predetermined.
- Post-merge follow-on executing at this entry: the deconstruction
  hypothesis-register evidence event (per its own review rule, deferred
  until merge). Worktree pr-886-capability-architecture removed after
  this entry's commit.

## 2026-08-17 ~11:0xZ — COMPACTION FREEZE (Smith hunts Obsidian, e98f17): fold mid-ceremony, 890 round conserved, two new owner directives routed

Owner word at the freeze: "prepare for compaction then stop all processes."
All monitors stopped; every in-flight surface conserved below. RESUME MAP,
in priority order (the owner's SKILLS-FIRST ruling governs):

- (a) FOLD PR #896 is OPEN mid-ceremony (branch coordination/2026-08-13-c8586f
  merged main in at 98a607bcc with the napkin union-resolved — 113/116
  branch-side entries verified in archive/napkin-2026-08-14.md, three carried
  under the fold-merge union note; Nautilus's staged research doc rode at
  their own 16c3a4e0c). Resume: settle per the four named checks, bot REST
  merge at the FETCHED sha (merge method merge), cut successor
  coordination/estate-<date> from post-fold main per the skill, refresh
  branch-labelled surfaces, broadcast rotation. The freeze commits below
  ride this PR.
- (b) SKILLS LANE FIRST (owner priority, ledger SKILLS-FIRST): PR #890 cure
  round conserved as PR comment 5314990205 (dead-SKILL.md-filename class x9
  plus three live-surface paths; sweep lesson: filename class, not only
  directory class); then wave 2 per PR #890 comments 5293457222 (link
  ledger) + 5293529733 (config additions) + task #10; then the eval
  programme to EVERY Practice skill (plan WS8 + pilot convention
  estate-wide). mantagen re-review stands requested; Copilot re-request at
  the cured tip.
- (c) PROFANITY-FILTER in-repo plan node to AUTHOR (ledger PROF-FILTER,
  owner verbatim there): validator with fixed-hash target-word list (hashes
  so the repo never carries the wordlist; not secrecy), no Linear ticket.
  Author as born sketch AFTER the skills lane per SKILLS-FIRST; sequence
  its execution behind the evals completion.
- (d) PR-CLASH COMPARISON (owner ask 2026-08-17, NOT yet executed):
  compare our open PRs vs other contributors' new PRs for clashes.
  Inventory banked at the freeze: ours #890 (skills wave 1), #889
  (census, Nautilus), #774 (illustrative, never merges); theirs #891
  luke-arnold-oak NATIVE-WINDOWS ESTATE FIX — intersects the ratified
  cross-platform node's research-first rider (XPLAT row); FLAG at the
  comparison, verdict needed on rider-vs-contribution; #892 plugin skill
  feedback DRAFT — touches BUNDLED SKILL COPIES, direct WS7 clash
  candidate; #895 conformance DRAFT; #888 WSL docs; #883/#881/#880/#867
  emgeebot lanes; #772/#768/#761/#750 older gated lanes. Comparison =
  changed-file overlap + semantic clash verdicts, report to owner.
- (e) Redesign S3-S6 (task #7) queued behind the above.
- (f) Instrument notes: the claims CLI answered "unknown topic: claims" at
  2026-08-17 — its command surface changed over the gap; re-derive the
  liveness-check invocation from the CLI help at resume, never from
  memory. The worktree-isolation guard pins sessions by cwd: keep the
  shell at the primary root, use git -C for worktree git, plain commands
  (no pipes) for guarded operations, tokens via short-lived files with
  the wc -c length tripwire (an empty mint WAS caught by it this
  session).
- (g) Watch scripts .watch-890.sh (wave worktree) and .watch-896.sh
  (primary root) deleted at the freeze; re-create from the resume map's
  needs, actionable-transitions-only per COLD-PAUSE.

## 2026-08-17 ~11:2xZ — freeze addendum: three owner answers true the map (Smith hunts Obsidian, e98f17)

- XPLAT sequencing corrected by owner word: "I intended our Windows work
  to go in first in order to support the manual windows work" — the
  research-first rider is SUPPORT-SEQUENCING, not a contribution fence.
  Resume treatment of #891: supportive review, no rider adjudication; the
  cross-platform research node gains urgency behind SKILLS-FIRST.
- Resume-map (d) corrected: #892 is NOT a WS7 clash — verified against
  its file list, it touches only plugins/oak-open-curriculum/skills/oak-*
  (bundled PRODUCT skills), zero overlap with the Practice corpus; it
  even adds an evals/evals.json, consistent with the all-skills-evals
  ruling. Consistency glance at review only.
- Freeze-note (f) sharpened: the CLI's `claims` topic is absent from
  today's topic list (agent-identity, collaboration-state, commit-queue,
  branch-touched-files, context-cost, session-metadata, codex-exec,
  merge-bot, pr, pr-watch, spawn) — renamed/absorbed over the gap,
  likely into collaboration-state; re-derive the liveness invocation
  from `--help` at resume. No other agent-tools surface misbehaved this
  session.

## 2026-08-17 ~11:5xZ — resume: XPLAT-4 head discharged (Smith hunts Obsidian, e98f17)

Owner resume order (ledger XPLAT-4) executed ahead of the freeze map's (a)/(b):

- REGROUND facts that moved over the freeze: the owner worked this branch
  directly — `ac23efc66` (workspace basis panel, his authorship) and
  `234450771` (the survey-lane landscape-survey born sketch; his authorship,
  bot committer, pushed 11:23Z from this checkout while this seat was
  resuming — the file this seat found staged and left untouched). Comms
  quiet since 2026-08-16; Nautilus's claims fresh (heartbeat 10:21Z);
  claims topic confirmed absorbed into `collaboration-state` (invocations
  re-derived from `--help`). Fold PR #896 checks re-running at the new tip;
  fold completes at a stable moment (owner mid-activity on the branch is
  not one).
- LUKE'S PRs reviewed warmly per the order (both reviews bot-posted,
  author echo verified): #891 review 4951157320 — centrepiece is
  first-hand macOS proof at his tip `299a33f1b` (Apple Silicon, macOS
  26.6, APFS case-insensitive default: `pnpm install --frozen-lockfile`
  clean; `pnpm check` green end to end, main turbo run 142/142), closing
  his named macOS-untested risk; plus goal-alignment (the ratified
  strategic node declines WSL-as-answer, so his "merge both" option is
  the doctrine-aligned path — final disposition the owner's). #888 review
  4951133339 — verified his tip cures the two unresolved threads; one
  real defect remains (the gitleaks `go install` route: module declares
  `zricethezav`, verified at source) and it is INHERITED FROM OUR OWN
  `.husky/pre-push:13` — generator fix is estate-side (micro-PR queued);
  Copilot's suppressed-comments were harvested and verified (the
  env-vars no-op claim REFUTED at pinned versions: turbo 2.10.9 reads
  `TURBO_CONCURRENCY`, vitest 4.1.10 reads `VITEST_MAX_WORKERS`; the
  nvm-before-clone ordering defect real; build-before-lint claim is a
  main-README matter taken estate-side).
- XPLAT RESEARCH NODE authored:
  `.agent/plans/delivery/cross-platform-research.plan.md` (status
  `sketch` per the plan-corpus enum — Nautilus corrected this seat's
  out-of-enum `active` in place, broadcast 11:42Z, absorbed; execution
  state rides ticket MCP-607, created this seating, related
  MCP-602/MCP-600, moved In Progress). Four research questions (census
  delta over #891; platform verification; guard design;
  support-sequencing decision briefs — `.gitattributes`, Windows CI
  leg, gate settings). Assumptions-expert pass absorbed pre-commit
  (blocking finding cured: briefs tranche never queues behind census).
- SCOPE CORRECTION to freeze-map (b), superseding its wording: every
  skills-lane quantifier — including the eval programme phrase "pilot
  convention estate-wide" — ranges over the Practice corpus
  `.agent/skills` ONLY, per the owner's 2026-08-17 word (ledger
  SKILLS-FIRST routing cell trued this entry). `plugins/oak-open-curriculum`
  is another lane's.
- Validation-worktree residue to clean at fold: `pr-891-macos-validation`
  (detached, untracked logs only) — prune after the #891 lane settles.
