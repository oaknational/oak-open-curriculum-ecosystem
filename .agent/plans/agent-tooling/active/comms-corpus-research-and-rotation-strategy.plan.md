---
name: "Comms-Corpus Research and Rotation Strategy"
overview: "Dedicated research pass over the preserved .agent/state/collaboration/comms/ corpus (4,978 events as of 2026-06-12T15:45Z, fully git-tracked since 567bf0f1a — re-derive at WS0): blind cold read, automated survey, failure-mode taxonomy, prioritised theme deep-dives, mechanism recommendations routed to the comms/coordination plan cluster, a ratification-ready non-held rotation strategy that ends the preservation hold without losing unprocessed signal, and (owner-amended 2026-06-12) the owner-gated execution of the ratified end-state: .agent/state/ untracked, experiments/ preserved, comms events beyond the retention window MOVED TO AN UNTRACKED ARCHIVE post-absorption (owner direction 2026-06-13: archived not deleted, while Fable is unavailable, to preserve the option of later research). Companion to the agent-collaboration-research thread record, which owns the hypothesis, analysis vectors, and seeded themes."
status: "WS0–WS6 COMPLETE (2026-06-13, Bluebell mends Mulch / c2ef19, successor to Kayak herds Ballast): research first-hand-verified across all three lenses; the §11 re-verify list closed first-hand (6 anchors promoted to FH, 4 stale figures corrected); WS5 rotation-strategy proposal authored, two-round adversarially reviewed, and put to the owner as a decision; WS6 comprehensive synthesis authored fronting the full artefact set. WS7 (archive-not-delete execution) is OWNER-GATED — fires only on owner ratification of the WS5 proposal. Plan claims complete only at ws0–ws7."
todos:
  - id: ws0-grounding
    content: "WS0: read the agent-collaboration-research thread record (resume contract) EXCEPT its two Candidate Themes sections, which are deferred until the WS1 surprises log is recorded (blind-pass exception in the record's Resume Contract); read the comms-event schema and this plan; confirm corpus size/span first-hand."
    status: completed
  - id: ws1-open-discovery
    content: "WS1: open-discovery cold read — executed via delegated fresh-context blind readers (owner-decided 2026-06-12 after the successor seat's start-right contamination, disclosed in comms events 37523113/8cefbe36): eight readers briefed only on the three lenses + date windows, thread record / plans / patterns / memory surfaces fenced. COMPLETE 2026-06-13: all 8 surprises logs (R1-R8) carry full five-section structure incl. the mandatory we-did-not-expect-this; all 8 corroboration verdicts landed under ws1-cold-reads/corroboration/ (R1 verifier 49/49 confirmed, 0 refuted, independently corroborating the citation correction); R2/R3 completed on Opus 4.8 after a Fable model outage killed their Fable runs. The WS1 artefact (fronting synthesis under the contamination-and-delegation preamble) is the remaining synthesis step, folding the corrected findings. Surprises outrank seeded-theme confirmation downstream."
    status: completed
  - id: ws2-automated-survey
    content: "WS2: automated corpus survey — scripted counts by kind/tag/author/day (partitioned by the three event-schema shapes BEFORE aggregating), burst and silence windows, response-linkage reconstruction (in_response_to is unpopulated across the corpus as of 2026-06-12 — reconstruct chains from body-text event-id citations, subject threading, and temporal adjacency), heartbeat-volume share, PLUS an anomaly scan (outlier events, unexplained clusters, chains fitting no known shape); emit the survey report with a prioritised shortlist that draws from BOTH the WS1 surprises log and the seeded catalogue."
    status: completed
  - id: ws3-failure-mode-taxonomy
    content: "WS3: failure-mode taxonomy — read every failure-mode and behaviour-note tagged event plus untagged failure captures WS1/WS2 surface; cluster by class (substrate-failure vs agent-failure per theme 2); emit the taxonomy report with cure-shape patterns and doctrine-grade vs note-grade verdicts."
    status: completed
  - id: ws4-theme-deep-dives
    content: "WS4: deep-dives — for each prioritised item (WS1 surprises outrank seeded-theme confirmations at equal evidence), produce a research artefact with worked instances, classified by lens (deficit / strength / emergent behaviour) and carrying a steering verdict: fix, encourage, discourage, or observe-only. Cure- and steering-bearing artefacts route a recommendation to the named consumer plan in the comms/coordination cluster; understanding-only conclusions are legitimate."
    status: completed
    depends_on: [ws1-open-discovery, ws2-automated-survey]
  - id: ws5-rotation-strategy
    content: "WS5: non-held rotation strategy — evaluate the candidate shapes in the thread record's rotation section against WS1-WS4 evidence and the five invariants; produce a ratification-ready proposal (PDR-class portable contract + ADR-class repo phenotype outline) and put it to the owner. NO deletion executes inside WS5 or any workstream before it — execution belongs exclusively to the owner-gated WS7, strictly after ratification."
    status: completed
    depends_on: [ws2-automated-survey, ws3-failure-mode-taxonomy]
  - id: ws6-consolidation-closeout
    content: "WS6: consolidation and closeout — produce the comprehensive synthesis report under .agent/reports/agentic-engineering/ fronting the full artefact set (discoveries, emergent patterns, insights, what-worked-well findings, routed recommendations, future-enhancement proposals, with links to the WS1-WS5 artefacts); run the consolidation workflow over research outputs; update the thread record (what was processed, what remains, new themes discovered, identity row); archive or queue follow-ons per lifecycle triggers."
    status: completed
    depends_on: [ws4-theme-deep-dives, ws5-rotation-strategy]
  - id: ws7-ratified-execution
    content: "WS7 (owner-gated: fires only on owner ratification of the WS5 proposal): execute the ratified rotation end-state — (a) relocate load-bearing contract surfaces out of .agent/state/collaboration/ to tracked homes first (the five *.schema.json files consumed by agent-tools source, the test fixtures/ tree; default homes unless the WS5 proposal argues otherwise: schemas and fixtures into the agent-tools workspace, consumers updated, gates green); (b) PRESERVE everything under .agent/state/collaboration/experiments/ — owner direction 2026-06-12: experiments content is conserved, never purged. Interim safety landed in the planning session (gitignore policy flipped, five machine-local records committed in place); WS7 still routes the content to a durable tracked home OUTSIDE the untracked-by-design boundary, because step (c) would otherwise re-untrack it; (c) gitignore .agent/state/ as untracked-by-design (uniform classification with the .agent/state/onboarding/ precedent; the tracked README.md anchor remains in git). DERIVED ARTEFACTS ARE NOT PRESERVATION TARGETS (owner, PR 201 review): shared-comms-log.md is an ephemeral rendering rebuilt from the event stream — it goes untracked with no relocation and no disposition ledger entry; rotation invariant 3 (provenance) attaches to the comms events themselves, never to the rendered log; (d) MOVE comms events older than the ratified retention window (owner default 2026-06-12: 7 days; class-tiering permitted where WS2-WS4 evidence argues it) to an untracked archive directory (off the watcher's live drain path, gitignored, retained on disk) — NOT delete them — only after absorption/disposition is recorded per invariant 1. OWNER DIRECTION 2026-06-13 (supersedes the original delete clause): while Fable is unavailable, the raw comms records are ARCHIVED not destroyed, so the option of further research later is preserved; the operational goal (shrink the live comms/ dir so the watcher drain stays healthy) is met by moving events out of the watched path, and deletion is no longer part of WS7. No step here runs before ratification."
    status: pending
    depends_on: [ws5-rotation-strategy, ws6-consolidation-closeout]
isProject: false
---

# Comms-Corpus Research and Rotation Strategy

**Created**: 2026-06-12 under owner direction (in-session to Director Firefly seeks Temper).
**Substrate home**: the
[`agent-collaboration-research` thread record](../../../memory/operational/threads/agent-collaboration-research.next-session.md)
owns the hypothesis, the four analysis vectors, seventeen seeded candidate themes, the
preservation boundary, the rotation-strategy framing, and the dedicated-session profile. This
plan does not duplicate that substance — it is the dispatch vehicle and execution contract.
**Cluster registration**: the comms/coordination cluster index is
[`agent-tooling/future/README.md` §Comms / coordination cluster](../future/README.md#comms--coordination-cluster);
overlapping-plan disposition routes through the rightsizing keystone's M4.

## End goal

Two user-impact outcomes:

1. **Understanding that improves the mechanisms — across three lenses, not one.** This is
   explicitly NOT a find-and-fix-problems pass (owner direction, 2026-06-12). The lenses:
   - *Failure modes* — what went wrong, clustered with cure-shapes;
   - *What worked well* — practices and substrate behaviours that succeeded, named so they
     can be protected and propagated rather than accidentally regressed;
   - *Surprising emergent behaviour* — most valuable of all: behaviours nobody designed,
     surfaced by the corpus, that can be **encouraged or discouraged by tuning activation
     enthalpy** — nudges in comms tool design, defaults, affordances, and ceremony cost that
     make a desired behaviour cheaper to do and an undesired one costlier, rather than
     mandating or forbidding it.
   Findings land as routed recommendations in the named consumer plans
   (cost-of-collaboration, comms-watch trilogy, liveness plans, rightsizing M4).
2. **A ratified steady-state for the comms stream**: the preservation hold ends through an
   owner-ratified non-held rotation strategy, restoring watcher drain health permanently
   without losing unprocessed signal.
3. **The ratified end-state executed (owner-amended scope, 2026-06-12)**: once the owner
   ratifies the WS5 proposal, WS7 executes it inside this plan — load-bearing contract
   surfaces relocated to tracked homes, `.agent/state/collaboration/experiments/` content
   preserved into a durable tracked home (owner direction: never purged), `.agent/state/`
   gitignored as untracked-by-design (tracked README anchor remains), and comms events older
   than the ratified retention window (owner default: 7 days) **moved to an untracked archive
   (NOT deleted)** after recorded absorption — owner direction 2026-06-13: while Fable is
   unavailable, retain the raw corpus on disk (off the watcher's live drain path) so the
   option of further research later is preserved rather than destroyed. The owner decision
   moment between WS5 and WS7 is the gate; nothing executes before it.

## Mechanism

The corpus is structured enough for cheap automated triage (events come in three schema
shapes — `narrative` with `author`/`title`, `directed` with `from`/`to`/`subject`, and
`lifecycle`; all carry `created_at`, `kind`, `body`, and optional `tags`; the survey must
partition by shape before aggregating, and `in_response_to` is unpopulated corpus-wide —
linkage lives in body-text citations) and rich enough that qualitative agent
reading adds value beyond extraction. **Discovery is protected structurally**: the cold read
(WS1) runs blind to the seeded theme catalogue and BEFORE the survey, so the researcher's
priors cannot anchor what counts as interesting — the owner's direction is that the corpus
holds surprises not yet recognised, and the seeded themes are a floor, never a fence. The
survey (WS2) then makes expensive reading targeted; the taxonomy (WS3) and deep-dives (WS4)
produce evidence; the rotation strategy (WS5) is determined from evidence rather than
speculation, which is what makes it ratifiable.

## Means

The workstreams in the frontmatter todos (WS0–WS7). WS1 runs first among analysis passes
(blind); WS2 and WS3 follow; WS4 depends on WS1+WS2 prioritisation; WS5 depends on WS2+WS3;
WS6 closes; WS7 is owner-gated execution.

## Execution strategy (owner-directed 2026-06-12, ultracode multi-wave)

The owner amended the execution profile mid-session: workflow-orchestrated agent fan-out at
scale, statistical AND semantic methods, repeated passes ("if in doubt, do it again"), with
critical validation of every finding. Initial waves value **numbers of agents over power**;
later waves value **power**; every breadth wave seats one or two Fable 5 instances on the
same task to catch what cheaper readers miss. This section is the execution contract for
WS1–WS4 under that direction; acceptance criteria and the WS5/WS7 boundary are unchanged.

- **Wave 0 — statistical index (local, no agents).** A metadata pass over the full corpus
  produces the shared per-event index (one JSONL row per event: id, created_at, shape, kind,
  tags, author tuple, recipient, title, body length, body-cited event ids/SHAs, title genre)
  plus the WS2 quantitative skeleton: day/kind/tag/author distributions, burst and silence
  windows, heartbeat cadence statistics, directed-pair matrix, body-citation linkage graph,
  title-genre taxonomy, naming-era distribution, growth curve. Later waves consume the index
  instead of re-scanning ~5,000 files. Commands recorded in the WS2 report for
  reproducibility; the index itself is derived scratch, never a preservation target.
- **Wave 1 — breadth (many cheap agents + Fable catchers).** (a) R2/R3 blind cold readers
  complete WS1 (Fable — they are WS1 instruments). (b) Slice extractors sweep every
  non-heartbeat event in chronological slices, emitting structured per-event annotations
  (subject category, coordination-act type, entities, anomaly flags, candidate-pattern
  nominations) — cheap models for breadth, plus two Fable catchers running the identical
  brief on sampled slices; the catcher-vs-cheap delta is itself a recorded quality signal.
  (c) Corroboration verifiers re-read each landed WS1 log's cited events and adjudicate
  every top finding (confirmed / refuted / unverifiable) — input-to-verify applied to the
  blind readers themselves.
- **Wave 2 — power (Fable, adversarial).** WS3 taxonomy clustering over all tagged events
  plus wave-1 anomaly nominations; WS4 deep-dives per prioritised item with ≥2 worked
  instances; every cure- or steering-bearing claim passes an independent adversarial
  verification (a refuter re-reads the cited events; load-bearing claims cross-checked
  against git/GitHub/claims archives). Statistical-semantic joins (act sequences, response
  latencies, cadence-vs-outcome) run where the wave-1 annotations support them.
- **Wave 3 — synthesis + completeness.** Cross-wave synthesis with a corroboration matrix
  (which findings are multiply-attested across independent readers and methods); a
  completeness critic asks what window, method, or claim remains uncovered — what it finds
  becomes the next round (loop-until-dry, the owner's "do it again" rule made structural);
  then WS5 proposal and WS6 report assemble from the corroborated evidence.
- **Finding provenance discipline.** Every finding carries how it is known:
  `blind-arisen` (WS1 logs), `seeded-confirmed` (catalogue theme corroborated),
  `statistically-derived` (wave 0/joins), and/or `cross-attested` (independent
  reader/method agreement). The provenance matrix is what keeps the synthesis trustworthy
  given the executing seat's recorded WS1 contamination.
- **Quota resilience.** Heavy fan-outs batch (the 8-wide Fable fan-out died on the session
  window, 2026-06-12); every long-running agent writes its output file incrementally from
  the first finding; capacity is probe-verified before each wave.

## Prerequisites

- **Blocking**: owner marks this plan ready (readiness reviewers run; see §Readiness).
- **Blocking for WS4 ratification only**: owner decision on the proposal — the research
  workstreams complete WS4 by *putting the proposal to the owner*; ratification gates the
  owner-gated WS7, whose execution (now an archive-move, not deletion — owner direction
  2026-06-13) is inside this plan per the 2026-06-12 scope amendment.
- **Beneficial**: `comms-watch-storage-redesign` direction known (the rotation proposal must
  state composition with it either way; minimum shippable shape without it is a
  directory-level rotation proposal with an explicit storage-shape contingency note).

## Execution profile

Per the thread record's §Dedicated-Session Profile: reflective research profile, not execution
profile. The receiving agent follows the record's Resume Contract **including its blind-pass
exception**: the record is read end to end EXCEPT the two Candidate Themes sections, which are
opened only after the WS1 surprises log is recorded. The sequencing composes an open cold read
first, then the record's shapes 1 (corpus survey), 4 (failure-mode taxonomy), and 2 (theme
deep-dives), then the rotation determination.

### WS2 survey commands (reference, deterministic)

From the repo root; no new machinery — recorded one-liners only:

```bash
# Events are a 3-way oneOf (narrative author/title, directed from/to/subject, lifecycle);
# segment by shape before interpreting kind/tag distributions.
ls .agent/state/collaboration/comms | wc -l
for f in .agent/state/collaboration/comms/*.json; do node -e "
  const e=require('./$f');
  console.log([e.created_at,e.kind,(e.tags||[]).join('+')||'-',
    (e.author?.agent_name||e.from?.agent_name||'?')].join('|'))
" ; done > <scratch>/corpus-index.psv
cut -d'|' -f2 <scratch>/corpus-index.psv | sort | uniq -c | sort -rn   # by kind
cut -d'|' -f3 <scratch>/corpus-index.psv | sort | uniq -c | sort -rn   # by tag
cut -d'|' -f1 <scratch>/corpus-index.psv | cut -dT -f1 | sort | uniq -c # by day
```

(One `node` process per file is slow but dependency-free; the agent may batch with a single
node script in `/tmp` — analysis scratch, not product code.)

## Execution log (2026-06-13, Katydid hunts Roost + Myrtle weaves Thicket)

- **ArcAngel relocation — owner-directed early WS7 slice.** Owner directed (2026-06-13) that
  the ArcAngel / ARC AnGels channel (`agent-rapid-communication-and-gellings/`) be moved from
  the untracked-bound `.agent/state/collaboration/experiments/` to a tracked durable home so a
  two-agent pair could use it for efficient comms. Relocated via `git mv` to
  `.agent/collaboration/rapid-comms/` (history preserved; the two top-level `rendezvous`/
  `session-close` experiment records remain in `experiments/` for full WS7). This is a clean
  pilot of WS7 step (b) experiments-preservation and a **WS5 input**: ArcAngel (one file,
  `tail -F`, append-only, zero ceremony) is the activation-enthalpy contrast to the
  comms-event stream (≈45–74% heartbeats, repeated watcher drain-wedges, zero structured
  threading). The steady-state question for WS5 is therefore not only "how to rotate the heavy
  stream" but "which substrate for which coordination shape." `.agent/collaboration/` is the
  chosen tracked home (parallel to the untracked-bound `.agent/state/collaboration/`); WS7/owner
  may refine the path. The full `.agent/state/` untracking and the 7-day archive-move (NOT
  purge — owner direction 2026-06-13, see §End goal #3 and ws7 todo (d): archive not delete
  while Fable is unavailable) remain owner-gated.
- **Fable model outage (2026-06-13) → Opus 4.8 re-dispatch.** WS1 recovery sub-agents seated on
  Fable died during a temporary Fable outage (misread first as a token cap; owner-corrected —
  the same-wave Sonnet verifiers succeeded, confirming a model-specific, not session-wide,
  cause). Owner lifted the normal Opus concurrency cap; the Fable-killed work (R2/R3 complete
  cold reads, catchers 6/19, R1/R4/R5/R6 verifiers, then R2/R3 verifiers) re-dispatched on
  Opus 4.8. R7/R8 Sonnet verdicts already landed and are retained. Standing dispatch rule
  added: seat fan-outs on a healthy model, never Fable until the outage clears; incremental
  output-file writes mandatory (the universal safety net that saved every disk-writing agent).
- **Peer pair on the lane.** Myrtle weaves Thicket (Opus 4.8, claim `eb94d37c`) joined as a
  peer and owns WS3 (failure-mode taxonomy) on a clean file boundary; working coordination runs
  on the ArcAngel channel. Katydid retains WS1 close-out + WS2 + the prioritised shortlist.

## Execution log (2026-06-13, Juno mends Plasma — dedicated consolidation session)

Owner ratified WS5 "as proposed" (2026-06-13) and directed a dedicated consolidation session
before WS7 (rationale: consolidating under research load is an M2 instance). That session landed:

- **The ratified rotation decision is homed:** PDR-094 (portable contract) + ADR-199 (repo
  phenotype) authored and indexed. ADR-199 carries inline-quote provenance for the events it cites
  (`86e94e54`, `3cc1fb93`, `2ff03ded`), so **WS7 step (1) [author the rotation ADR] and step (2)
  [populate cited-event provenance] are SATISFIED.** WS7's remaining steps — (3) run the
  pre-archive-move provenance check, (4) archive-move by class, plus the schemas/fixtures relocation
  (step a) and `.agent/state/` untracking (step c) — stay `pending` and are gated on owner go AND
  coordination with the statusline/agent-tools lane (WS7 step a shares `agent-tools/`).
- **Findings routed:** M2 + SC1 into the rightsizing keystone M4 (reconcile-not-mint); the WS6 §5
  recommendations into their six consumer plans. **First-hand routing correction:** the §5 table
  named `comms-event-write-integrity` as an SC1 consumer, but that plan is complete + scope-frozen
  ("no schema migration, no event-semantics change") and does not own the authoring-affordance
  surface — SC1 routed to M4 instead. One PDR-089-evidence finding buffered in pending-graduations.

The plan's completion bar is unchanged: it claims complete only at ws0–ws7; ws7 remains open.

## WS7 Execution Contract (routed from machine-local DoD, 2026-06-14, Gull spins Stratus)

**De-orphaning note:** this section conserves the substance of the machine-local contract
`~/.claude/plans/ah-very-good-in-quizzical-whisper.md` into the repo, per the repo/instance
content-boundary principle below (instance-tier / out-of-repo knowledge must be curated up before the
instance ends). It is the authoritative WS7 execution spec; a non-same-checkout instance can complete WS7
from here. Owner-approved 2026-06-14 (Gull session).

### State at routing (verified first-hand 2026-06-14)

- **Phase 0 reconcile DONE** — `feat/comms-research` 0 behind `origin/main`, 59 ahead; PR #208 OPEN +
  MERGEABLE (single PR landing research + statusline + WS7). 2 local commits unpushed (Rosemary closeout).
- **Phase 1 (schema/fixture relocate + validator decouple) DONE** (`6d1e45f35`). **Carryover:**
  `memory-state-substrate-contracts.manifest.json` still points 4× `schema_or_parser` + `fixture_roots[0]`
  at the old `.agent/state/collaboration/` homes — repoint (verify gate-loaded vs descriptive first).
- `comms-archive/` exists and is **already gitignored** in the working tree (`comms-archive/*` +
  `!.gitkeep`) — a `mv` in lands untracked. The `.gitignore` edits are uncommitted owner edits (commit at
  Phase 3). `.agent/state/` files remain git-tracked (gitignore present, no `git rm --cached` yet).
- **6 cited events uncovered** (need digest): `02fa64cf`, `1e2c83eb`, `5fbf6f92`, `92183937`, `952e329b`,
  `c7d65a58` (all present in `comms/`). ADR-199 inline-quotes the other 3: `2ff03ded` / `3cc1fb93` /
  `86e94e54`.

### Ratified spec (ADR-199 §Decision — do not re-derive)

- **Archive home:** `.agent/state/collaboration/comms-archive/` (off the watcher drain path, gitignored, on
  disk). **Manifest:** `comms-archive/manifest.jsonl`, one row/event
  (`event_id, created_at, kind, tags, archived_at, disposition`) = the disposition ledger (Inv-1 operative
  gate). **Provenance survivor:** inline-quote-first; fallback digest `.agent/reference/comms-cited-events.md`;
  a pre-archive-move provenance check scans ADRs/PDRs/patterns for 8-hex tokens and refuses to move a cited
  event lacking coverage (Inv-3).
- **Class tiers** (hygiene targets, NOT drain-derived — Inv-4; README/ADR say so): heartbeat **48h** (cadence
  aggregate extracted ONCE first); diagnostic/test/noise **immediate** (body-read first — `3cc1fb93`
  falsifier); coordination + directed **7d**; research-precious (`failure-mode` + genuine `behaviour-note`)
  **until graduated** (absorbed before move). Retention windows CONFIRMED by owner 2026-06-14.
- `shared-comms-log.md` (~7MB) goes untracked, no relocation, no ledger entry (derived). `experiments/`
  never deleted — relocates to a tracked home. Schemas + fixtures relocate into `agent-tools/` (done).

### The real risk (schema relocation is NOT "edit 5 path constants")

Schema location was resolved by THREE mechanisms all assuming `.agent/state/collaboration/`:
(1) `live-types.ts` `*_SCHEMA_PATH` constants → `live-json-support.ts` (the `practice:substrate:check`
loader); (2) `collaboration-json-validation.ts` own `SCHEMA_FILENAMES` + `collaborationJsonSurface()`
deriving the schema dir from the DATA file's path (the behaviour-preserving decouple); (3) compile-time JSON
imports + `test-helpers/temp-collaboration-state.ts` copy-source + `practice-substrate.unit.test.ts`
assertion strings. **Corrected decouple:** resolve the schema dir **repo-root-relative** to
`agent-tools/src/collaboration-state/schemas/` (NOT module-relative — `tsc` ships no JSON to `dist/`, so
`import.meta.url`→`dist/.../schemas` is a dead path from the built CLI; repo-root-relative works from `tsx`
AND `dist`). `tdd-for-refactoring`: the agent-tools suite is the characterisation harness, green before +
after. (This Phase-1 work is landed; recorded here for the decouple rationale + the manifest carryover.)

### Phases (0 + 1 DONE; 2 / 3 / 4 remaining)

- **Phase 2:** pre-archive-move provenance check authored as a **TESTED agent-tools module** (not a throwaway
  script); the **heartbeat-cadence aggregate** durable artefact written BEFORE moving any heartbeats (source:
  WS2 survey stats); run the provenance check over all permanent docs; archive-move by class into
  `comms-archive/` with a `manifest.jsonl` disposition row per event; bulk routine/noise classification
  **body-reads a sample + EVERY over-length body** (`3cc1fb93` falsifier — title genre never sufficient);
  byte-preservation: `count(comms/) + count(comms-archive/) == pre-move`.
- **Phase 3:** commit the pre-staged `.gitignore` rules (`.agent/state/*` + `!.agent/state/README.md`;
  resolve the redundant `onboarding/` line); `git rm -r --cached .agent/state/` then re-add `README.md`
  (index-only — verify zero working-tree deletion); relocate `experiments/` →
  `.agent/collaboration/experiments/` + repoint `statusline-identity.ts listExperiments`; rewrite
  `.agent/state/README.md` (untracked-by-design + archive location + rotation-contract pointer + the boundary
  - standing curation obligation; fix `comms-events/`→`comms/` drift); update ADR-199 status. **Atomic** (see
  hard gate below).
- **Phase 4:** full `pnpm check`; real-time reviewers (architecture / test / config / code / docs-adr) +
  release-readiness for #208; single PR #208 to merge-ready; **merge owner-gated**.

### The repo/instance content boundary + atomic-propagation HARD GATE (owner, 2026-06-14)

Untracking `.agent/state/` crystallises a **repo tier** (versioned, shared by every clone: memory, docs,
ADRs, PDRs, patterns, plans) vs an **instance tier** (one checkout's comms/claims/heartbeats/channels/
seen-state). Committing comms state to git was an accidental knowledge-preservation safety net; the untrack
removes it. So curation of comms-log knowledge (PDR-066 failure-mode / behaviour-note / decisions /
what-worked) into repo-tier homes becomes a **MANDATORY STANDING obligation** — the safety net the untrack
relies on. **WS7 Phase 3 untrack is UNSAFE unless the obligation lands ATOMICALLY across PDR-094 + ADR-199 +
the `session-handoff` SKILL + the `consolidate-docs` SKILL + the Phase-3 README** — a protocol change
recorded only in the decision record but absent from the operational surfaces agents read is an invisible
half-way broken state. DoD additions: PDR-094 + ADR-199 amended to name the boundary + standing curation;
the lifecycle skills wired to require comms-log knowledge assessment + curation as an explicit non-optional
step (rides the PDR-014 / PDR-080 / PDR-081 pipeline); the Phase-3 README states it. (Owner-resolved: the
skill-wiring IS a WS7 completion gate, not a companion tranche.)

**Owner extension (2026-06-14, Gull session):** the same standing curation obligation covers **out-of-repo
platform plans** (`~/.claude/plans/` and files like them) as instance/individual-tier knowledge sources —
wired into the same skill step. This session processes the comms-research + agent-collaboration ones and
records the rest in a curation-backlog plan. The obligation is **knowledge** curation; it must NOT impose
any obligation, quota, or ritual on the voluntary, self-framed `.agent/experience/` register.

### Open owner decisions (carried)

Retention windows = DoD defaults (CONFIRMED 2026-06-14). Provenance scan scope = ADRs/PDRs/patterns
(ADR-199); optional broaden to `reference/` + `reports/` (flag at execution). Untrack boundary =
owner-delegated (keep tracked: README + `conversations/` + `escalations/` + lean `sidebars/`; untrack
preserve-on-disk: `comms/` + `comms-seen/` + claims + `shared-comms-log.md` + `comms-archive/` +
`comms-draft/` + `handoffs/`; relocate out: schemas/fixtures [done] + `experiments/`).

### Lessons carried

(1) A relocation completes its reader-repoint AND rebuild in ONE window (git-mv-then-pause ENOENT-broke team
comms — Whippoorwill). (2) Verify peer/own status via the actual runtime path (the `dist` CLI), not a
source-run proxy (`tsx`) — Whippoorwill. (3) Opening an ArcAngel channel ≠ being in standard comms; register
on the canonical surfaces — Clipper. (4) A protocol change must propagate atomically to every affected-reader
surface or it is an invisible broken state.

## Acceptance criteria and proof contract

All proof levels are `non-code` (research artefacts) unless stated.

| Id | Acceptance | Proof |
| --- | --- | --- |
| ws0 | Record (minus deferred themes sections) + schema read; corpus size/span re-derived first-hand and recorded | non-code: WS2 report's grounding section cites the re-derived counts and attests the blind-pass order was honoured |
| ws1 | A surprises log exists recording the cold read: date-windows covered, everything surprising/unexplained/unclassifiable noted with event ids, written BEFORE the themes sections were opened. A mandatory "we did not expect this" section — it may be empty only alongside evidence the blind pass genuinely ran (windows covered, time spent) | non-code: surprises log file; its timestamp/ordering attested in WS2's report |
| ws2 | Survey report exists under `.agent/reports/agentic-engineering/` with kind/tag/author/day distributions, burst/silence windows, heartbeat-volume share, anomaly scan, and a prioritised shortlist drawing from BOTH the surprises log and the seeded catalogue, with selection rationale | non-code: report file; distributions reproducible from the recorded commands |
| ws3 | Taxonomy report clusters every tagged failure-mode/behaviour-note event (count derived at execution time per the disposition-ledger discipline) into named classes with cure-shape patterns; each class carries a doctrine-grade vs note-grade verdict and a routing decision (PDR draft / pending-graduations / note) | non-code: report file + disposition ledger covering all tagged events |
| ws4 | Each prioritised item has a research artefact with ≥2 worked instances (event ids cited), a lens classification (deficit / strength / emergent), and a steering verdict (fix / encourage / discourage / observe-only); cure- and steering-bearing artefacts carry a recommendation routed to a named consumer plan; understanding-only conclusions are explicitly legitimate; the deep-dive set as a whole must not be deficit-only unless the evidence genuinely is | non-code: artefact files + routing records |
| ws5 | A ratification-ready rotation proposal exists naming: mechanism, trigger, owner-role, archive home, heartbeat-class handling, the five invariants' satisfaction, storage-redesign composition, and the migration path for the current held corpus (item-level disposition); proposal surfaced to the owner as a decision | non-code: proposal artefact + owner-decision surfacing |
| ws6 | Comprehensive synthesis report exists under `.agent/reports/agentic-engineering/` fronting the full artefact set (discoveries, emergent patterns, insights, routed recommendations, future-enhancement proposals); consolidation run; thread record updated (processed/remaining, new themes discovered, identity row); follow-ons queued | non-code: synthesis report file + record diff + consolidation evidence |
| ws7 | Owner ratification recorded FIRST; then: schemas + fixtures relocated to tracked homes with consumers updated (agent-tools gates green); `experiments/` content preserved to a durable tracked home (nothing under it deleted); `.agent/state/` gitignored with tracked README anchor; comms events older than the ratified window MOVED to an untracked archive (NOT deleted — owner direction 2026-06-13, Fable-unavailable preserve-for-later-research) with absorption/disposition recorded per event class; the archive directory is off the watcher's live drain path | code + non-code: gitignore diff, relocation + archive-move commits, disposition ledger, post-archive-move watcher drain health observation |

Completion language: this plan claims complete only when ws0–ws7 are proven as above.
WS5's own bar remains "proposal put to owner" per research-outputs-name-decisions discipline —
the research names the decision, the owner makes it. WS7 then executes the ratified decision;
if the owner declines or reshapes the proposal, WS7 executes the reshaped ratification, and a
declined proposal closes the plan at ws6 with the decline recorded.

## Non-goals

- **No deletion, archival movement, or rotation execution before owner ratification of the
  WS5 proposal** — WS1–WS5 are determination only; WS7 is the sole execution surface in this
  plan and fires exclusively on recorded ratification (amended 2026-06-12 from the original
  successor-slice shape, under owner direction, so the plan owns the full arc).
- **Nothing under `.agent/state/collaboration/experiments/` is ever deleted** — owner
  direction 2026-06-12; WS7 preserves it into a durable tracked home.
- **No new coordination machinery** (CLIs, watchers, hooks) — recommendations route to the
  cluster's owning plans; the rightsizing keystone's anti-accretion stance governs.
- **No doctrine changes** — doctrine-grade findings become PDR drafts or pending-graduations
  entries, ratified through the normal pipeline.
- **No re-litigation of cluster plan overlap** — disposition routes through rightsizing M4.

## Risks

- **Anchoring on the seeded catalogue** — seventeen pre-named themes can convert discovery
  into confirmation; the owner's direction is that the corpus holds unrecognised surprises.
  Mitigated structurally: the WS1 cold read runs blind and first, the WS2 shortlist must draw
  from the surprises log, surprises outrank seeded-theme confirmation at equal evidence, and
  ws1's acceptance demands a "we did not expect this" section.
- **Corpus volume swamps the session** — mitigated by WS2 triage and the record's
  date-window/theme-scoped session shapes; a session that exhausts budget mid-WS retires per
  PDR-063 with the survey index as the handoff asset.
- **Convenient-claim drift in qualitative reading** — every claimed pattern must cite event
  ids; ground-convenient-claims discipline applies (verify against the artefact before
  asserting).
- **Live-stream movement during analysis** — the corpus grows while being analysed; counts
  are derivation-anchored ("N as of <date/command>") per the disposition-ledger discipline.
- **Rotation proposal forecloses the storage redesign** — the proposal must state its
  composition with `comms-watch-storage-redesign` explicitly (beneficial prerequisite above).

## Foundation alignment and first-principles check

- `principles.md`: simplicity-first — no new machinery; evidence before mechanism.
- `testing-strategy.md` / `schema-first-execution.md`: no product code in scope; if any
  follow-on tooling is recommended, it lands via its consumer plan under full TDD discipline —
  never inside this research pass.
- Plan-body first-principles check (`plan-body-first-principles-check`): fires at WS4 before
  the proposal is drafted (is rotation still the right cure given what WS1–WS3 found?) and at
  WS3 before any cure-shape recommendation is routed (does the consumer plan still exist and
  own that surface?).

## Readiness

`assumptions-expert` readiness review RAN 2026-06-12: verdict READY-WITH-AMENDMENTS; all four
Important findings applied in-place (response-linkage reconstruction wording, three-shape
schema partitioning, derivation-anchored corpus counts, the active-patterns blind-pass fence).
Its confirmations: proportionality sound (six workstreams, none ceremony), blocking
relationships genuine, ratification boundary correct. Remaining gate: owner marks ready and
confirms the WS5 decision boundary.

## Learning loop and lifecycle

WS5 runs the consolidation workflow (`oak-consolidate-docs`) over the research outputs and
updates the thread record. Lifecycle touch points per
[`templates/components/lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
plan completion archives this file with its outputs mined into permanent homes; the rotation
proposal's ratification spawns the successor execution slice in this collection.
