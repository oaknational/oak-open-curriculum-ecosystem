---
fitness_line_target: 120
fitness_line_limit: 180
fitness_char_limit: 12000
fitness_line_length: 100
drain_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
merge_class: curated-learning-register
fitness_content_role: drainable-buffer
fitness_rationale: >-
  Lowered 2026-05-25 after owner-requested `distilled.md` processing through
  `oak-consolidate-docs`: the 2026-05-14 multi-agent deep-dive and 2026-05-17
  gate-stack entries graduated to permanent behavioural homes. The active file
  now carries only the conservation role, graduation pointers, and held
  validation entries; the larger 2026-05-17 envelope has served its purpose.
  Falsifiability: if future napkin rotations add high-signal learning that has
  no stable permanent home, preserve it first and revise the envelope by
  substance rather than trimming the lesson.
---

## 2026-06-02 — assertion-time checks, projection provenance, and visible proof

Several June 2 entries sharpen one shared discipline: a claim becomes true only
when the proving surface is current and visible. Run the cheap check at assertion
time, not after a later metacognition pass: grep the residue, read the status,
verify the cited label's liveness. For data-as-source-of-truth work, the
principle is projection provenance, not generator location — a hand-authored
mirror inside codegen is still a mirror; the durable shape is static data
projected through one type-strict Zod call with `satisfies` tying it to the
structured content. For no-commit sessions, a newly written untracked file is
evidence to the agent but invisible to the owner; report the path with `git
status` so the claim is falsifiable.

## 2026-06-02 — mechanical sweeps need live routing and set confirmation

Mechanical text sweeps cannot distinguish use from mention, generated snapshot
from source, or record-class evidence from live prose. Before running one, read
the newest napkin and scan reports as live routing, then state the intended
change/revert set before broad action when peer edits or record surfaces are
involved. A future-safe wording should also survive the sweep itself: when naming
a token being removed, phrase the statement so a later replacement pass cannot
turn a true sentence into a false one.

## 2026-06-02 — dependency refreshes also need planning-truth cleanup

Dependency updates can widen beyond the initially named package because shared
workspace ranges move together. After manifests and lockfiles are current, check
the plan estate too: a clean `pnpm -r outdated` table is not proof that old
dependency-update plans no longer advertise completed work.

## 2026-06-02 — contamination scans: perimeter from git, probes for recall, author-applied standards

Three sharpened edges from the mandate-1 scan (Stellar Waning Planet). (1) A
scan brief is inside its own scan perimeter and structurally cannot enumerate
itself — re-derive the perimeter from git at grounding; the brief is the first
artefact scanned (this caught a mis-dated commit and the excluded handoff
commit). (2) Withhold one already-known finding from reviewer briefs as a
known-answer probe: the fleet missing it (which happened) converts a known
answer into a recall measurement — zero-finding groups then carry calibrated,
not absolute, confidence. (3) Verifier fleets apply inconsistent standards to
identical defect classes (one upheld a heading/body count contradiction;
another refuted the same class as "labelling imprecision") — author-level
synthesis is where one standard gets applied; validate refutations with the
same rigour as findings. Extends independent-eyes-catch-what-self-review-cannot.
Method ledger: `.agent/reports/mandate-1-contamination-scan-2026-06-02.md`.
Graduated 2026-06-02 to
`patterns/contamination-scan-method.md`; the pending-graduations entry now
records the durable route.

## 2026-06-01 — one law, three faces (EEF thread synthesis)

Three disciplines are one principle seen from different sides:
derive-from-the-single-source-of-truth-never-bridge (code — derive from the
fixed corpus, never glue), seams-compose-never-reconciled (architecture —
friction at a junction means an input drifted from the root; fix upstream at the
source, never bridge at the seam), and state-what-is-no-monuments (writing —
opening statements, handoffs, `no-tombstones-for-removed-ideas`). The tell:
whenever a frame slips (conservation reflex, tombstone reflex, gap-hunting
inversion, remediation-voice), the cure is the same shape — return to the source
of truth, fix upstream, state what is. Graduation candidate: a PDR naming the
unifying principle (owner-surfaced).

## 2026-06-01 — opening statements and handoff artefacts teach by their form

A handoff or opening statement is the next agent's first and most-attended
context, so its *form* trains them, not just its content. Written in
remediation/avoidance voice ("X re-opened because the sweep was wrong", "do not
expand scope", quoted dead negation-lists) it teaches the next agent to think
that way; written as positive construction — present truth + destination — it
teaches that. Keep the why and what-went-wrong in napkin, experience, ledger, and
commits (record); keep the loaded-first surfaces (opening statements, thread
records, repo-continuity, plan banners) as present-truth instruction. Test:
"would a first-time reader reconstruct the mistakes from this?" — if yes, it is a
monument. Worked twice across sessions (Shaded, then Windswept). Pairs with
`no-tombstones-for-removed-ideas`. Graduation candidate: a clause of no-tombstones
or continuity-practice (owner-surfaced).

## 2026-06-01 — independent eyes catch what self-review cannot

Self-review shares the author's blind spots: a careful re-read of my own EEF plan
missed a grounding error (`behind_the_average_by_phase` mis-described) that an
independent multi-lane grounding audit caught immediately. For
grounding/contamination checks, spawn independent eyes rather than relying on
re-reading your own work. Related scoping insight: distinguish "delete the fake
surfaces" (stubs with no real consumers — usually cleanly green) from "the full
total removal" (the genuinely red replacement window); they are different scopes
with different risk.

## 2026-06-01 — archived means archived: remove references, don't repoint (Hearthlit Stoking Cinder)

When quarantining a plan/doc to `archive/`, the live estate must STOP referencing
it — remove the references (delete frontmatter pointers; de-link prose to plain
text), never repoint them into the archive. Repointing N live references at the
archived copy is the "no redirects" anti-pattern: it keeps the archive
load-bearing in live navigation and dissolves the live/archived boundary. The
single sanctioned inbound pointer is ONE archive-index note (`completed-plans.md`)
recording where it went and what supersedes it. Caught mid-execution this session
(owner: "archived means archived … not a bunch of links that dissolve the meaning
of /archive/") after I had planned a uniform repoint. May merit a rule or PDR
("archive is a terminal sink; one index note; no live→archive redirects"). Source:
graph-spine quarantine, commit `5063456a`.

## 2026-05-31 — repair of invalid active-distilled archive move

The prior source-buffer pass moved this active register into
`archive/distilled-2026-05-31-eclipsed-source-processing.md`, replaced the active
file with a pointer, then deleted the failed archive copy during repair. That hid
live buffer content before an acceptable item-level disposition proof existed.
The content is restored here after owner correction. Do not archive or replace
this active buffer again unless every item has a valid `graduated`, `duplicate`,
`owner-gated`, or `stale-withdrawn` disposition under `consolidate-until-done`.

## 2026-05-31 — trace user value before tool design (EEF reframe, Fruited Regrowing Copse)

Trace the user journey and its value end to end before committing to a tool
design; ask "does the data support this value?" at each hop, not "can we build
this tool?" The EEF tools as first envisioned were impossible — they keyed on
curriculum subject/topic, but EEF strands carry no subject/topic axis, so the data
never supported the join. Months of data-shape engineering went into a tool that
could not deliver value: the data-shape work was the tail wagging the dog. Cure:
front-load the value/user-journey trace as a standing design-time guard (live
instance: `eef-value-trace.codex-brief.md`). Platform-memory mirror:
`feedback_trace_user_value_before_tool_design`.

**Deleting failed content is a contamination vector (2026-06-01, eef thread).**
When archiving or removing wrong/superseded work, default to saving NOTHING from
it; anything carried into a live doc must independently re-ground — cite a real
source-of-truth path, or be tagged agent-side — never trusted because it was in
the old artefact. A fabricated key-stage→phase concept rode out of a deleted EEF
prompt into the ratified plan, cross-cited to a real finding to look grounded,
caught only by chance. Pairs with no-tombstones: the corrective reframe must be
genuinely positive, not a negation of the removed thing (caught fixing a tombstone
with a tombstone this session). Auto-memory mirror:
`harvest-from-deleted-is-contamination-vector`.

**A label cited from a contaminated/in-flux artefact may itself BE the
contamination (2026-06-02, eef/graph threads).** When citing a label, section
number, increment, status, or structural name from a document known to be
contaminated or being rewritten, verify the *label's liveness* — not just that the
row contains the words you want. Proliferating a retired label (here `Inc.3`,
retired by ADR-173 yet cited as the migration owner) into another live plan spreads
the contamination the estate exists to remove. This is the third face of the
convenient-claim root in one session (surface fact grounded, load-bearing
meta-fact assumed); the others were asserting a "bespoke" MCP-registration topology
(graph tools are in fact universal tools) and over-specifying unsettled
output-schema mechanics. Corollary: seeded reviewer/workflow consensus is
amplification of your own premise, not corroboration — brief reviewers with
verifiable facts and invite refutation, never the conclusion. Auto-memory mirror:
`ground-convenient-claims` (2026-06-02 entries).
