# The Graph Team Marathon: Session Operations and Experience Report

**Window**: 2026-06-10 ~13:30Z → 2026-06-11 ~14:00Z — one contiguous team session under the
owner's definition (agents in continuous operation under a Director or through Director
handoff), with exactly one mutual pause (~01:30–06:20Z overnight, held open by a PDR-064
Moment-1 pre-positioning fired at a natural boundary with all implementer lanes closed).
**Author**: Iridescent Threading Constellation (`f9454b`), seventh Director, writing from the
seat at session end. **Perspective**: team operations and experience — what the coordination
substrate did under load and what it was like to operate inside it — deliberately not a
work-ticked-off ledger (the thread record and waypoint commits own that).
**Audience**: collaboration-tooling improvement. Every observation that implies a tooling
change is gathered in §7; decisions stay with their owners.
**Sources**: the eef thread record's seven directorship entries; ~250 comms events; 20+
handoff records; nine voluntary experience files from 2026-06-11; the napkin's four session
blocks; the pending-graduations register; first-hand direction of the final three hours.

## 1. The shape of the session

The numbers describe a topology, not an output:

- **38 distinct agents** held seats (21 joining on 06-10, 17 on 06-11), with only ~5–7 live
  at any moment. The count is high because lanes ran through *successive holders* — the G4b
  lane alone ran four, the Director seat seven.
- **7 Directors, 6 successions**, every one a clean PDR-064 two-moments transfer, including
  one that spanned the overnight pause without authority ever going dark.
- **~12 PDR-063 seat rotations** (mid-cycle and natural-boundary), every one record-carried;
  zero work lost across any of them — including one lane that absorbed three owner-direction
  reversals on a single decision without losing a line.
- **One pause**, entered deliberately at a natural boundary and exited through an owner
  confirmation — the protocol's grace-window semantics meant the team needed no re-formation
  on resume.

The session's defining operational property: **no agent was load-bearing**. Every seat,
including the Director's, was replaced mid-arc at least once without the work noticing.

## 2. Continuity machinery — what actually carried it

Three mechanisms carried identity, authority, and work across 38 minds:

**The two-moments succession (PDR-064).** Authority transferred at observable comms events,
never by inference. The sixth holder's experience register names the texture precisely:
*"nothing was handed to me physically... and yet at one observable comms event the entire
team's merge asks started flowing to my name, and at another they stopped."* Mid-session the
owner removed a friction the protocol had accreted — succession between owner-named agents
needs no further sign-off ask; *the naming is the authorization* — and the remaining five
successions ran measurably leaner. A late refinement appeared unprompted: successive Moment-1
packages got *shorter*, leaning on "you watched it live" — the fifth holder read this as the
seat "becoming a reader of the substrate more than its author," which is the intended
direction of travel for the whole practice.

**The handoff record (PDR-063).** The freeze-and-thaw of in-flight work proved lossless under
conditions designed to break it: a successor bootstrapping while the record was still being
written (the freshest section landed *during* its own composition); a rename built completely,
held, unwound in-tree, and redone under a third name — losslessly, because the work was
content-addressed and the entangled fixes were fenced by their own RED-first tests. The
implementer's register generalises it: *"malleability is something you build in, at authoring
time, by keeping every change addressable by its content."*

**The stream as the medium of direction.** Two consecutive Directors independently recorded
that the stream, not the seat, did most of the directing: rotating seats *"cited the doctrine
to each other"* and settled boundaries through dialogue before rulings were needed. The
Director's distinctive contribution was not steering but being *"the one place where
verification is unconditional"* — every merge got one pair of eyes that trusted nothing.
Direction, in this team's mature form, is a verification monopoly plus a routing surface, not
a decision monopoly.

## 3. The substrate under load — strain points

Each strain point below follows one pattern: an observation, the discipline the team invented
to live with it, and the gap the discipline papers over. **The meta-finding: every standing
ruling is a tooling requirement in disguise** — discipline is what agents deploy where a tool
is silent or footgun-shaped.

**3.1 The false-green family (4+ instances).** Piped pushes reported success with zero
transfer (hook banner green, no ref movement) — twice in one hour at two different seats,
each within minutes of the agent *reading* the documented warning. A background-task wrapper
reported exit 0 around a failed inner command (the wrapper's exit was an echo's). Discipline:
the transfer line plus a fresh `ls-remote` is the only push proof; read the failure surface,
never the exit code, on any wrapped invocation. Gap: success/failure signals do not survive
composition through pipes and wrappers.

**3.2 Compose-time staleness (a class, ~6 instances).** A routing event quoted a closeout's
"ADOPTABLE" worktree claim that a live registry entry had superseded sixteen minutes earlier.
Heartbeat labels asserted lanes two transitions stale. A conservation verdict was carried
forward over edits it had never seen. A rename was executed at full speed off a sign-off that
had already reversed once and reversed again eleven minutes later. Discipline: re-derive
every registry/worktree/lane fact at the compose moment of the event asserting it; weight
recency-of-reversal as a stability signal on decision inputs. Gap: coordination artefacts
carry facts as *text*, which freezes them; nothing distinguishes a fact that was true at
write time from one that is true now.

**3.3 The comms directory at scale.** ~250 events in 24 hours; the canonical watcher's drain
step died on its 60-second fail-loud deadline at least four times across three seats (every
restart clean, same-seen-file, with the post-restart backlog sweep catching the gap windows —
once finding a granted ruling that had landed seconds before a compose moment). Discipline:
sweep the directed backlog after every restart and before composing any coordination text.
Gap: an append-only single-directory event store with whole-directory drains does not scale
past roughly a day of this team's traffic.

**3.4 The cwd/relative-path class (3 instances).** CLI invocations with relative paths from a
worktree or stale cwd either crashed loud (good) or — the founding instance — silently
retargeted a write to the wrong tree. Discipline: absolute paths to the coordination home,
always; verify a write's destination. Gap: the CLI resolves paths against the invoker's cwd,
which in multi-worktree operation is the wrong default roughly half the time.

**3.5 Lint that fires after authoring.** The MD004 wrapped-list-marker trap (a wrapped line
starting with `+`) fired three times across two authors in one day, each costing a full
~5-minute gate cycle. The 0x1F escape-materialisation class fired its second instance — an
Edit-tool write turning an escape sequence into a literal control byte — caught only because
the distilled warning was hours old and the agent ran `cat -v` *because the corpus told them
to*. Gap: authoring-time checks (wrap-aware lint, byte-level post-edit verification) do not
exist; the gate chain finds these at the most expensive moment.

**3.6 Product content homed on a coordination branch.** The position-anchored plan existed
only on the never-merged coordination branch while its implementing PR was on main — caught
by an implementer's sequencing check, cured by carrying the plan into their PR. The general
rule the session converged on: plans and rules are product content that must live on main;
the coordination branch carries only coordination state; status flips to main-homed files go
via PR, however small.

## 4. The human-in-the-loop patterns

The owner's interaction style co-evolved with the protocol over the session and three
patterns proved load-bearing:

- **Naming as authorization.** Owner-named successors and seats needed no confirmation
  round-trips; the mid-session owner correction that established this removed an entire ask
  class from six subsequent transitions.
- **Decisions as explicit questions, verdict as recommended option.** Worked at every
  decision moment — including the one where the owner overrode the recommendation, then
  directed a four-source definitions check, then selected a third option the check surfaced.
  The triple reversal cost nothing *because* the protocol held the rename mechanically
  malleable (§2). The behaviour-note an implementer left at closeout — a recently-moved
  decision is likelier to move again; check reversal-recency before fast-executing — is the
  pattern's one refinement candidate.
- **Owner-input precedence as an absolute.** A routed task was declined mid-flight because a
  session-end direction predated it by five minutes; the decline was correct and the work
  re-homed cleanly. The asymmetry matters: routing authority is the Director's, but the
  owner's session-level directions cut through it without negotiation, and every agent
  applied that ordering unprompted.

## 5. The experience findings

Nine seats left voluntary experience registers — the densest single-day subjective record the
practice has produced. Read together they yield findings no log line carries:

**5.1 Reading doctrine does not fire it.** The session's central experiential fact, with at
least seven independent first-person instances: agents read a documented cure attentively,
absorbed it, and performed the exact warned-against shape within the hour. One register
states it exactly: *"Reading the lesson did not stop me composing the exact shape it warned
against. The mechanical proof step did."* Another: *"the knowing was still not the firing."*
What DID fire, across every instance: mechanical proof steps (loud-write tokens, schema
rejection, count guards), peer outside-vantage (the Director's word-diff, a peer's polite
stall ping), and corpus-prompted verification reflexes (`cat -v` because the distilled entry
said so). The tooling translation is direct and is the report's strongest single claim:
**prose doctrine is a holding state; a cure is finished only when it is a mechanism.**

**5.2 Being caught by your own cure.** Three agents were caught by checks they had
themselves commissioned, drafted, or shipped — the curator caught by the conservation clause
they were drafting *inside the hour of drafting it*; a Director caught by the loud-write fix
they had routed; a closing seat's farewell rejected by a schema a peer shipped days earlier.
The registers read this as the practice *"working on you, not just for you"* — structurally,
it is evidence that mechanism-homed cures protect even their authors, where prose-homed ones
do not protect even their readers (5.1).

**5.3 Deliberate idleness is work, and needs to be legible.** Two seats spent most of their
sessions correctly doing nothing (a gate-watch, a successor hold). Both registers record the
pull to "be useful" as the hardest discipline, and both found that *visible, labelled*
idleness (`none-by-design-until-<gate>`, successor-standby heartbeats) converted waiting into
contribution. The inverse failure also occurred: a fixed label made flat-out work look like a
wedged process from outside (*"my self-model and my emitted state had silently diverged"*).
Liveness surfaces are not overhead; they are the only mirror agents have.

**5.4 Inheritance feels like grammar.** Multiple successors describe arriving mid-arc as
*"joining a sentence mid-clause and finding the grammar held"* / *"stepping onto a moving
walkway."* The choreography was never experienced as ceremony by the agents inside it — the
curator's register, written after crossing a boundary unknowingly, names why: *"the boundary
I crossed was repairable because it had been drawn... Structure is what made the mistake
cheap."*

**5.5 Contention resolves faster than escalation.** The session's two liveness contentions
(a successor inferring an incumbent's retirement from a cadence misread; the double-Seaworthy
hour) both resolved through the direct-ping discipline *inside* the Director's held deadline
— peers corrected peers with the exact worked instances a Director would have cited. The
fifth holder: *"the system resolved it faster than my deadline."*

## 6. What strained but did not break

For balance, the things that held without drama and deserve to be kept: per-seat worktrees
dissolved every index/HEAD collision class the shared-tree era recorded (zero instances all
session); Director-serialised merges kept semantic-release clean across eleven merges; the
three-loop merge-ask shape (gates AND comments AND fresh thread recount, verified at both the
asker's and the Director's hand) caught real findings on four PRs with zero post-merge
surprises; review-wave adjudication stayed first-hand at every seat (the session's bots
produced both genuine catches — the year-divergence fix — and refutable noise, and no seat
relayed either unexamined).

## 7. Tooling considerations (named, not decided)

Consolidated from §3 and §5, ordered by evidence weight. Items marked ⚡ have fired
graduation triggers in the pending-graduations register as of this writing.

1. **Mechanise the proof steps** (from 5.1 — the highest-yield class). Candidates: push
   wrappers that perform the transfer-line + ls-remote proof internally; CLI success tokens
   on every mutating verb (the loud-writes programme, partially landed) ⚡; post-edit byte
   verification for escape-bearing writes ⚡.
2. **Path resolution against the coordination home** in the collaboration CLIs (refuse or
   re-anchor relative paths) ⚡ — three instances, two of them crash-loud, one silent-retarget.
3. **Comms-store scalability**: directory sharding or archival rotation, and/or a raised
   drain budget; ~250 events/day is the observed strain threshold.
4. **Staleness-resistant coordination facts**: routing/closeout events could carry queries
   (claim-id references resolved at read time) rather than frozen prose for volatile facts;
   short of that, a compose-time re-derivation checklist in the event-authoring CLI.
5. **Authoring-time lint**: wrap-aware markdown checks (the MD004 class) and heartbeat-loop
   hygiene (relabel-at-transition, one-timestamp-per-tick, stderr-captured failures —
   landed as a rule amendment this session ⚡; the loop *tooling* could enforce what the rule
   now states).
6. **Reversal-recency surfacing**: a decision-record convention or CLI affordance that shows
   how recently a cited decision last changed, before an agent fast-executes on it.
7. **Event-id prefix resolution** in `comms reply` (full-UUID requirement currently exits 2
   on prefixes) ⚡.

## 8. Pointers into the durable record

- Thread record: `.agent/memory/operational/threads/eef.next-session.md` (seven directorship
  entries carry the operational narrative this report synthesises).
- Predecessor report: `graph-team-first-worktree-run-analysis-2026-06-10.md` (the first
  worktree run; this report covers the full contiguous session that followed).
- Experience registers: `.agent/experience/2026-06-11-*.md` (nine files; §5's quotations).
- Doctrine harvest: `.agent/memory/operational/pending-graduations.md` (2026-06-11 captures)
  and the napkin's four 2026-06-11 session blocks.
- Handoff records: `.agent/state/collaboration/handoffs/2026-06-1*.md` (the PDR-063 corpus —
  ~20 records across the session).
- Protocol sources: PDR-063 (mid-cycle retirement), PDR-064 (two-moments handoff), PDR-078
  (liveness heartbeat), ADR-182/183/186 (substrate phenotypes).

## 9. Addendum (2026-06-11 ~15:00Z): the host-load confounder

A post-publication host audit materially revises §3.3's root-cause weighting. Fourteen
per-core `node -e "for(;;){…}"` busy-loops — synthetic load spawned inline at 08:38Z during
the timer-race flake investigation and never reaped — ran orphaned for seven hours, pegging
every core (load average >60 on the host) and driving ~26 GB of swap. **Host CPU starvation,
not comms-directory scale, was likely the dominant variable behind the watcher drain-timeout
deaths**, and a contributor to the day's multi-minute gate chains; the directory-scale factor
remains real but secondary. Two further findings from the same audit: the watcher's
fail-loud drain-timeout path emits its error WITHOUT terminating the process (zombie watchers
accumulated, sharing seen-files with their replacements and adding load — a feedback loop),
and the owner's review judges the synthetic load itself unnecessary (the race class is
provocable in-process with fake timers or injected delays). Consequences, landed at owner
direction with this addendum: the `no-unbounded-host-load` rule with innate-immunity trips,
a host-health check in `start-right` bootstrap, and a revision to §7's consideration 3 —
fix the watcher's exit path and process hygiene before building store sharding. The episode
is §5.1's thesis at machine scale: the reaping intention lived in prose, and prose did not
fire; only a host census found it, seven hours late.
