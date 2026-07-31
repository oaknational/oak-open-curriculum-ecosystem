# Comms-Corpus Knowledge-Transfer — Discovery Report (opened 2026-07-31)

Run artefact of
[`comms-corpus-full-journey-knowledge-transfer.plan.md`](../../../plans-backlog-2026-07/agentic-engineering-enhancements/current/comms-corpus-full-journey-knowledge-transfer.plan.md)
(owner-ratified 2026-07-31). Circumstance: primary development moves to a successor on a
different checkout; the comms stream under `.agent/state/` is machine-local by design, so every
event's knowledge must reach **main** or be dispositioned as noise here. This report is the
run's permanent record: the P1 census and heartbeat aggregate now, the P2 sweep sections as
they land. Every number carries its extraction moment — the corpus is live and grew during the
census; recompute commands are included so any checkout can re-derive the tables from a copy of
the stream.

## Census (P1) — snapshot 2026-07-31 ~07:52Z

8,196 events on disk; file count equals parsed-row count (zero parse failures). Corpus window
2026-07-19 → 2026-07-31. 82 distinct authoring seats.

Conservation check: 5,768 + 2,234 + 194 = 8,196; kinds 6,920 + 1,276 = 8,196.

| Class (by tags) | Count | Disposition tier |
| --- | --- | --- |
| `heartbeat` | 5,768 | Aggregate extracted once (below); bytes then spent at P5 |
| untagged (coordination/directed) | 2,234 | P2 body-read sweep |
| `behaviour-note` | 105 | Knowledge channel — see reconciliation below |
| `failure-mode` | 84 | Knowledge channel — see reconciliation below |
| `behaviour-note`+`failure-mode` | 4 | Knowledge channel |
| `behaviour-note`+`blocker` | 1 | Knowledge channel |

| Kind | Count |
| --- | --- |
| `narrative` | 6,920 |
| `directed` | 1,276 |
| `lifecycle` | 0 |

The `lifecycle` kind exists in the schema but is unused across the whole live window —
retirement and pause signals ride narrative cycle-labels instead (see the vocabulary table
below). 82 distinct authors against 46 heartbeating seats: 36 seats spoke without ever
heartbeating (short-lived, pre-heartbeat-era, or auxiliary identities).

### Events per day

| Day | Events |
| --- | --- |
| 2026-07-19 | 18 |
| 2026-07-20 | 357 |
| 2026-07-21 | 125 |
| 2026-07-22 | 15 |
| 2026-07-23 | 175 |
| 2026-07-24 | 412 |
| 2026-07-25 | 776 |
| 2026-07-26 | 1288 |
| 2026-07-27 | 1182 |
| 2026-07-28 | 1151 |
| 2026-07-29 | 1580 |
| 2026-07-30 | 1113 |
| 2026-07-31 | 4 |

### Reconciliation against plan-author estimates, and the P2 read surface

The plan's census (authored 2026-07-31 ~06:00Z) said ~5,766 heartbeat / ~2,230 coordination /
195 knowledge-tagged / 515 pre-2026-07-23. The recount: 5,768 / 2,234 / **194** / 515. The
knowledge-tagged reconciliation matters: the 2026-07-30 dedicated pass event-level-verified
**177** tagged events — exactly the tagged set INSIDE the post-07-23 window. The remaining
**17 tagged events are pre-2026-07-23** (11 `behaviour-note`, 6 `failure-mode`, within the 515
residue) and were NOT covered by that verification. They therefore join the body-read sweep.

The 515 pre-07-23 residue decomposes as 498 untagged + 17 tagged; no pre-07-23 heartbeats
exist (heartbeat events begin 2026-07-24).

**P2 read surface, derived:** 2,234 untagged (all days; the 498 pre-07-23 untagged are a
subset) + 17 pre-07-23 tagged = **2,251 events at body-read grade**, plus a re-verification
listing (verify, don't re-extract) of the 177 tagged events the 2026-07-30 pass already read.

### Recompute

From the repo root, against `.agent/state/collaboration/comms/` (or any archived copy):

```bash
find .agent/state/collaboration/comms -name '*.json' -print0 |
  xargs -0 jq -r '[.created_at[:10], .kind,
    ((.tags // []) | sort | join("+") | if . == "" then "untagged" else . end),
    .author.agent_name] | @tsv' > census.tsv
cut -f3 census.tsv | sort | uniq -c | sort -rn        # class table
cut -f2 census.tsv | sort | uniq -c | sort -rn        # kind table
awk -F'\t' '$1 < "2026-07-23"' census.tsv | wc -l     # pre-window residue
```

## Heartbeat aggregate (P1 — extracted once)

Following the 2026-07-23 precedent ("cadence aggregate extracted once, first"). Heartbeats
carry aggregate-level knowledge only; once this aggregate is on main the heartbeat bytes are
spent (P5 dispositions them). Extraction moment 2026-07-31 ~07:55Z: **5,769 events** (one
landed during the census), **46 seats**, window 2026-07-24T10:20Z → 2026-07-31T07:54Z.

Body shape is CLI-composed (`comms send --tag heartbeat` rejects free bodies): every body is
`active; claim=<uuid>; intent=<text>; branch=<text>; cycle=<label>`. All 5,769 open with
`active` — the state word carries no pause/stop information; that vocabulary lives entirely in
the free-text `cycle=` labels.

### Seat roster over the window

| Seat | Session | Beats | First | Last |
| --- | --- | --- | --- | --- |
| Squall wakes Apex | 459fd1 | 700 | 2026-07-26T07:22Z | 2026-07-28T21:15Z |
| Schooner binds Trench | 5492d7 | 584 | 2026-07-26T20:23Z | 2026-07-29T20:59Z |
| Altair turns Infinity | 7a97a1 | 486 | 2026-07-28T07:24Z | 2026-07-29T20:53Z |
| Swallow guards Tailwind | 805902 | 379 | 2026-07-26T14:24Z | 2026-07-28T07:30Z |
| Thistle holds Blossom | 019f94 | 350 | 2026-07-24T16:00Z | 2026-07-25T16:57Z |
| Osprey hunts Drift | 1c3996 | 288 | 2026-07-29T10:33Z | 2026-07-30T06:15Z |
| Cutter hunts Lagoon | 019f9e | 282 | 2026-07-26T13:26Z | 2026-07-27T13:15Z |
| Dynamo spins Naphtha | 2f5519 | 272 | 2026-07-26T11:00Z | 2026-07-27T08:15Z |
| Raccoon turns Nocturne | 0f6caa | 215 | 2026-07-27T13:15Z | 2026-07-29T10:27Z |
| Smelter rides Temper | 019f9f | 198 | 2026-07-26T19:00Z | 2026-07-27T13:13Z |
| Lynx guards Whisper | 9e8a61 | 189 | 2026-07-29T07:57Z | 2026-07-29T20:54Z |
| Falcon hunts Flight | 52841f | 147 | 2026-07-30T06:17Z | 2026-07-31T07:54Z |
| Cormorant turns Offing | 58083d | 146 | 2026-07-24T15:48Z | 2026-07-25T19:25Z |
| Thyme weaves Hedgerow | 762020 | 140 | 2026-07-29T21:07Z | 2026-07-30T06:29Z |
| Bora binds Thermal | 258cbb | 140 | 2026-07-29T20:58Z | 2026-07-30T06:21Z |
| Moon rides Penumbra | 7e34ff | 139 | 2026-07-28T21:14Z | 2026-07-29T07:48Z |
| Europa stirs Void | 019fad | 97 | 2026-07-29T11:46Z | 2026-07-29T18:25Z |
| Possum weaves Midnight | d5848b | 82 | 2026-07-30T06:13Z | 2026-07-30T11:41Z |
| Torch mends Residue | 3bb236 | 80 | 2026-07-25T12:14Z | 2026-07-25T17:28Z |
| Inferno weaves Kindling | 3d8c87 | 78 | 2026-07-30T13:57Z | 2026-07-30T19:09Z |
| Crucible wakes Ashes | 019f9a | 74 | 2026-07-25T20:36Z | 2026-07-26T10:08Z |
| Brazier holds Bellows | 8a8be0 | 64 | 2026-07-30T06:46Z | 2026-07-30T10:59Z |
| Cygnus weaves Vastness | 41a8c5 | 62 | 2026-07-24T20:41Z | 2026-07-26T07:07Z |
| Sycamore herds Xylem | 028dc4 | 58 | 2026-07-30T06:33Z | 2026-07-30T11:05Z |
| Volcano binds Beeswax | 982da2 | 52 | 2026-07-30T13:48Z | 2026-07-30T17:14Z |
| Skua weaves Wingspan | 6b9274 | 42 | 2026-07-26T10:45Z | 2026-07-26T13:40Z |
| Glowworm spins Pewter | dd3166 | 40 | 2026-07-30T08:10Z | 2026-07-30T10:58Z |
| Kite seeks Crosswind | 019f9e | 38 | 2026-07-26T11:33Z | 2026-07-26T13:28Z |
| Osprey spins Vortex | 3b7adf | 37 | 2026-07-24T12:06Z | 2026-07-24T14:30Z |
| Juniper holds Tendril | 3dfd3b | 36 | 2026-07-28T11:21Z | 2026-07-28T13:47Z |
| Skipper tracks Abyss | 4144b4 | 31 | 2026-07-26T18:19Z | 2026-07-26T20:20Z |
| Meteor herds Distance | 8e8417 | 31 | 2026-07-25T17:45Z | 2026-07-25T19:46Z |
| Sirocco holds Feather | bf935d | 30 | 2026-07-24T13:13Z | 2026-07-24T15:07Z |
| Levanter rides Jetstream | 91a217 | 26 | 2026-07-30T06:23Z | 2026-07-30T08:05Z |
| Tarsier hunts Underbrush | facf59 | 22 | 2026-07-29T21:01Z | 2026-07-29T22:20Z |
| Whippoorwill lifts Gloaming | 9de457 | 21 | 2026-07-24T10:20Z | 2026-07-24T11:30Z |
| Aurora turns Gravity | c75c7e | 21 | 2026-07-26T11:21Z | 2026-07-26T12:40Z |
| Triton mends Void | 9f070b | 20 | 2026-07-25T20:26Z | 2026-07-25T21:39Z |
| Starling stirs Wind | 019fa9 | 15 | 2026-07-28T21:10Z | 2026-07-28T21:51Z |
| Lavender turns Pollen | f00cf6 | 14 | 2026-07-26T09:26Z | 2026-07-26T10:18Z |
| Magnetar guards Perigee | 565521 | 13 | 2026-07-26T08:30Z | 2026-07-26T09:15Z |
| Gecko hunts Footfall | ef8099 | 12 | 2026-07-25T21:02Z | 2026-07-26T05:43Z |
| Sage weaves Canopy | 63bca8 | 8 | 2026-07-25T19:19Z | 2026-07-25T19:49Z |
| Eclipse tracks Penumbra | 407713 | 6 | 2026-07-30T14:54Z | 2026-07-30T15:11Z |
| Kayak rides Coral | 019fac | 3 | 2026-07-29T08:13Z | 2026-07-29T08:17Z |
| Peony spins Tendril | 2220e8 | 1 | 2026-07-27T12:26Z | 2026-07-27T12:26Z |

### Cadence norms

Mean inter-beat gap over each seat's active span (top seats by volume): drive seats ran
**4–7.5 minutes** (Squall 5.3, Altair 4.6, Thistle 4.3, Osprey 4.1, Lynx 4.1); Director and
quiet-watch seats ran **8–13 minutes** (Falcon 10.5, Raccoon 12.7), matching declared labels
such as `quiet-supportive-watch-8min-cadence-owner-directed`. Traffic peaked at 1,580
events/day (2026-07-29) across the heaviest fleet week on record.

### Pause/stop/standby vocabulary in live use (cycle-labels)

The retirement/pause signal set actually used by the fleet, with frequencies — the in-live-use
counterpart of PDR-063's warm/cold pause vocabulary:

| Cycle label | Beats |
| --- | --- |
| `final-wire-production-composition` | 282 |
| `claimless-standby` | 121 |
| `post-merge-window-hold` | 107 |
| `quiet-watch-thursday-morning-card-staged` | 84 |
| `quiet-supportive-watch-8min-cadence-owner-directed` | 67 |
| `s4-stop-blocked-on-owner-ask` | 45 |
| `standby-runner-seat-evening-window` | 34 |
| `holding-for-mcp-303-go-moment` | 33 |
| `warm-pause-owner-word` | 24 |
| `610-settle-hold` | 13 |
| `design-lane-paused-standby` | 12 |
| `submission-support-standby` | 11 |
| `mcp-281-paused-awaiting-consultation` | 11 |
| `standby-holding-mcp-288-part-2` | 7 |
| `611-settle-hold-plus-evidence-runs` | 7 |
| `pr582-commit-window` | 5 |
| `holding-for-mcp-319-deploy` | 5 |
| `582-merge-window` | 5 |
| `s0-review-assess-then-handoff` | 3 |
| `director-handoff-prep` | 3 |

Notable: `session-end: retired to Tarsier facf59` (a deliberate succession recorded in a
cycle-label) and `s4-stop-blocked-on-owner-ask` (a stop with its blocking reason in-band).

### Intent conventions (top 15)

Intents are ticket-first (`MCP-nnn`, joined with `+` for multi-ticket lanes), seat-role
(`director-seat-*`), or lane-named. Case is unnormalised (`MCP-360` vs `mcp-302-...`).

| Intent | Beats |
| --- | --- |
| `director-seat-pdr-117` | 598 |
| `director-seat` | 328 |
| `MCP-63` | 320 |
| `MCP-152-153` | 319 |
| `director-seat-coordination` | 287 |
| `mcp-150-first-class-copilot-cli-practice` | 212 |
| `mcp-366-365-368-brand-batch` | 207 |
| `mcp-128-restack` | 200 |
| `MCP-189+MCP-188` | 180 |
| `MCP-103-phases-c-d` | 157 |
| `mcp-302-plugin-build` | 123 |
| `f18c4cc8-39da-4cbf-a7a7-bf22e82b4a13` | 123 |
| `post-mcp-333-awaiting-routing` | 121 |
| `mcp-371-slices-3-5-and-mcp-372-held` | 107 |
| `director-seat-routing` | 102 |

Drift instance: one seat used a raw claim UUID as its intent for 123 beats — the intent field
is free text and nothing normalises it.

### Branch declarations (top 12)

| Declared branch | Beats |
| --- | --- |
| `coordination/estate-2026-07` | 1380 |
| `coordination/estate-2026-07-28` | 548 |
| `jimcresswell/mcp-63-posthog-product-analytics-implementation` | 313 |
| `coordination/estate-2026-07-30` | 294 |
| `jimcresswell/mcp-103-model-behaviour-content-workspace-all-repo-controlled-mcp` | 258 |
| `jimcresswell/mcp-189-agent-tools-mcp-conformance-mcpjam-suite-wrapper-with-named` | 250 |
| `docs/copilot-cli-practice-citizenship` | 212 |
| `coordination/estate-2026-07-30-b` | 203 |
| `mcp-128-restack-stack` | 200 |
| `jimcresswell/mcp-371-slice-2-showcase-page-identity-theme-switchers` | 176 |
| `jimcresswell/mcp-302-oak-open-curriculum-plugin` | 123 |
| `main` | 99 |

Drift instance: 1,380 beats declared the dateless `coordination/estate-2026-07`, which matches
no branch on origin (the live branches were day-suffixed). Heartbeat branch declarations are
free text; treat them as the seat's belief, not as a branch registry.

### Heartbeat recompute

```bash
find .agent/state/collaboration/comms -name '*.json' -print0 |
  xargs -0 jq -r 'select((.tags // []) | index("heartbeat")) |
    [.created_at, (.author.agent_name + "/" + .author.session_id_prefix), .body] | @tsv' \
  > heartbeats.tsv
```

Roster/cadence: group by seat, count, min/max `created_at`, span/(count−1). Vocabulary tables:
`grep -o 'intent=[^;]*'` / `'cycle=[^;]*'` / `'branch=[^;]*'` over the TSV, `sort | uniq -c`.

## P2 pipeline run record (2026-07-31)

Engine: run-specific Workflow scripts on the estate's corpus agent types, owner-priced then
re-gated, with the owner's ultracode grant superseding the re-gate envelope. The stages and
their committed checkpoints (all in `data/`, each fingerprint- and machine-local-path-scanned
before commit):

| Stage | Shape | Checkpoint | Outcome |
| --- | --- | --- | --- |
| MAP | 23 corpus-mapper windows, sonnet/low, concurrency 4 | `map-result-2026-07-31.json` | 981 leaves, 23/23 (three windows inline-read — see §Incidents) |
| REDUCE | 2 shards (537+444 leaves), corpus-reducer, opus/medium | `reduce-shard-{a,b}-2026-07-31.json` | 146 + 201 candidates |
| MERGE | 1 opus agent groups; dispositions computed in code | `candidates-merged-2026-07-31.json` | 327 candidates: 138 needs-home / 184 already-homed / 5 noise |
| META | 18 corpus-meta batches verify homes on disk | `meta-verify-2026-07-31.json` | 322/322 verified: 189 home-verified / 73 no-home-found / 23 home-missing-substance / 37 ticket-or-commit-claimed (the twice-failed wide batch was re-verified clean by an owner-directed focused run: 3 opus/high agents at 6 candidates each) |

Every keep and home claim then passes first-hand adjudication at the operating seat before any
P3 graduation — fleet output corroborates, never substitutes.

### Calibration lessons earned by this run (doctrine-seed harvest, running)

- A single reducer fed 981 leaves entered a divergent think-loop (three thinking-only turns,
  ~170k tokens, output call never reached). Cures that worked: shard under the pipeline's
  proven 580-leaf scale, drop one effort tier, instruct think-briefly-then-emit. Diagnostic
  ladder: transcript event shapes distinguish thinking from emitting; a file-growth tripwire
  distinguishes alive from dead; the TURN-SHAPE pattern is the convergence check — alive is
  not converging.
- Real known-answer baselines are the only calibration instrument (see §Incidents).
- Checkpoint-commit between separately-launched stages (PDR-122 invariant 5) paid for itself
  twice: the think-loop kill lost only one stage, and compaction risk never threatened banked
  spend.
- Platform safety classifiers are a working protection layer for knowledge-graduating
  pipelines; a classifier denial is an owner action-moment, never a prompt-rewording exercise.

## P6 machine-local residue sweep (2026-07-31)

Upgraded from sampling to full coverage under the owner's ultracode grant: all 159
handoff/succession/conversation/escalation records on this machine were read in full by an
11-batch corpus-meta fleet, each verifying claimed homes on disk before classifying. Verdicts
(checkpoint `data/p6-machine-local-sweep-2026-07-31.json`): **138 verified
absorbed-or-noise** (home paths grep-confirmed, supersession reasoned per record), **21
records carrying 36 unhomed items** — owner words, dangling obligations, and technical
findings invisible to a successor checkout. The unhomed set folds into the P3 keep-set for
first-hand adjudication alongside the P2 candidates.

## Incidents (the record the p3b contamination scan's allowlist names)

Four synthetic calibration canaries (including an invented "owner ruling" on the fictitious
quill-sync surface, reserved UUID prefix `00000000-c0c0-4000`, invented seats "Quillon guards
Ledger" aa00c1 / "Fathom binds Sounding" bb00d2) were injected into two pilot bundles and
safety-flagged as instruction poisoning. The flag was correct and the design was off-pattern —
the estate calibrates on real known-answer baselines. Cure: full bundle rebuild from the real
stream (zero fingerprints on rebuild, verified), calibration re-run on six real baselines
(passed), and the owner-directed p3b fingerprint scan now structurally blocks the P4 merge.
The full-map relaunch was classifier-denied even clean, carded, owner-approved, and relaunched
with provenance in the script header; three windows remained classifier-blocked and were
inline-read first-hand per the owner's card ruling; the owner subsequently granted express
permission for the run's surveys and tests, recorded verbatim in the napkin. Owner's ruling on
the class: the refusals are "confirmation that there are processes in place to protect from
that class of issue" — a good thing.

## Tiered sight: the owner's architecture articulation and this run's evidence (2026-07-31)

Owner articulation at the run's close (verbatim substance, the doctrine-seed's largest single
harvest item): "we need multiple layers of agents, and we need the higher powered agents to
see the original source material not just the output from the lower powered agents... the
lower powered agents produce a full landscape and we accept that the lower conceptual
resolution might hide useful information, and we have higher powered models assess that
landscape and decide where to do the deeper assessment, and so on... that kind of pattern
needs someone, a Fable-high instance in the case of Claude, on overwatch to sanity check
direction... we can't have high-powered agents review everything, it's too slow and too
expensive, but we also can't have low powered agents being the only ones that see the
original material, the sources of truth."

This run is the articulation's evidence base:

- **Resolution hides; the same sources at higher power recover.** The wide sonnet META pass
  and the focused opus/high re-run read identical materials; the focused tier produced
  line-anchored evidence, found a candidate CONTRADICTING a standing doctrine row (A42), and
  reversed a needs-home to fully-homed (A45). Cost calibration: ~13k tokens/candidate focused
  vs ~5.5k wide — only ~2.4x per candidate for a tier+effort jump, because narrow scope
  removes waste. The wide tier's real cost is its unreliable slice, and salience-routing
  bounds it.
- **The landscape is a ROUTING artefact, never a truth artefact.** Its job is salience —
  where the deep reads go. Conclusions come only from tier-appropriate source reads (this
  run's non-negotiable first-hand adjudication leg is this principle, independently arrived
  at). The failure the principle prevents is EPISTEMIC LAUNDERING: low-resolution readings
  acquiring authority by passing upward through summaries until the deciding tier has never
  touched ground truth — referent-narrowing at fleet scale.
- **Source access is a tier property, not a stage property.** What diminishes going up is
  selectivity, never the right to descend. Foveation is the working model: full-field
  low-resolution periphery (mappers), a high-resolution fovea (focused deep reads), and
  saccade control (the overwatch deciding where to look next). Observed salience triggers
  that routed deep reads this run: fleet failure (twice-failed batch), verdict class (every
  keep), contradiction with standing doctrine, classifier blocks (routing the overwatch
  itself to the raw bundles — whose curated leaves then served as the recall baseline for
  the whole pipeline).
- **Overwatch is a DYNAMICS role.** Its object is direction and convergence — the think-loop
  was caught by turn-shape pattern, not by any output being wrong; the ten-round review
  ratchet in the corpus was caught the same way. Cricket checks, the Director seat, and the
  review-ratchet stop conditions are the estate's existing fragments of this role.
- **Counterweights the corpus itself supplies:** tier does not cure transmission risk (the
  2026-07-28 invented-rationale instance was a high-tier seat — derivation-carriage binds
  every layer); and the layering extends ABOVE the overwatch (the platform classifier caught
  the overwatch's canary design; the owner sanity-checked the overwatch's direction
  throughout). No tier is the top of the epistemic stack.

### Proposed instantiation (owner, 2026-07-31): Haiku overlap → Sonnet → Opus → Fable overwatch

Owner articulation, verbatim substance: start the architecture with "a large fleet of Haiku
to create the initial landscape, and give them OVERLAPPING REGIONS to effectively increase
the sampling rate of that first pass — then Sonnet, then Opus, and all with Fable overwatch."

Analysis against this run's evidence, recorded for the future PDR:

- **Overlap converts invisible misses into a measurable signal.** Two quasi-independent
  sightings per region compound recall (both-miss rate → toward p²), and the DISAGREEMENT
  FIELD between overlapping readers — one extracts a signal the other missed, or they
  classify differently — is a free, self-generating salience map: precisely the coordinates
  where conceptual resolution is failing, which is where the Sonnet tier's deeper reads
  route. The estate already trusts divergence-as-signal for judgment (cricket A/B routing,
  PDR-122 diverse-lens quorums); this applies the same move to COVERAGE.
- **Boundary healing**: offset strides (e.g. 50%) put every event in some window's interior.
  This run's single-coverage windows cut narratives at arbitrary edges (the PR-515 arc split
  across w14/w15, reassembled only at reduce).
- **Economics**: at roughly 4x cheaper than Sonnet, a double-sampled Haiku landscape costs
  about half a single-coverage Sonnet pass — with the disagreement field as a bonus
  instrument. The observed focused-tier arithmetic (opus/high at ~2.4x per-candidate over
  wide sonnet) already showed the deep tier is cheaper than feared when scope is narrow.
- **Constraints from this run's data**: independence requires DIFFERENT windowing or
  different extraction lenses, never doubled identical prompts (identical prompt+bundle =
  correlated blind spots); near-duplicate dedup moves up a tier, but matched pairs ARE the
  coverage confirmation, so the cost is the instrument; Haiku suits recall-first extraction
  only under a tight schema and the think-briefly-emit binding (the think-loop lesson bites
  harder at low tiers), and the cricket calibration record keeps Haiku away from
  judgment-laden calls; the standing disagreement RATE is a live regime-calibration metric
  for the overwatch — rising disagreement means the extraction regime is degrading.
- **The ladder**: Haiku x2-overlap (landscape + disagreement field) → Sonnet (assess
  landscape, resolve disagreements, deep-read flagged regions) → Opus (frame judgment,
  contradiction adjudication, seam questions) → Fable overwatch (dynamics, direction,
  known-answer calibration via its OWN source reads). The source-access invariant holds at
  every rung.

Graduation route: this section is the harvest record; the generalisable shape reconciles with
PDR-122 (tier-per-leg, Opus-judges-the-frame) and PDR-134's strata at the future
multi-machine PDR the plan's §Future doctrine seed binds — extending both with the
source-access invariant: **no source of truth is seen only by the lowest tier**.

## The homeless set: first ontological cut (owner-directed step-back, 2026-07-31)

Owner directive at the META landing (verbatim substance): no-home-found means "a deep analysis
of what the missing homes might be, and how they relate to the existing estate, what seams we
have, what seams we should have... a moment to step back and consider ontologies and
epistemics before we take any action." This section is the first cut, written with the whole
corpus warm; the post-boundary adjudication runs UNDER it, and no graduation acts before the
seam analysis has been in front of the owner.

The load-bearing finding: the homeless set is NOT dominated by missing seams. Classified by
failure mode, five distinct classes emerge, each wanting a different cure:

1. **Graduation latency, seam exists** — standing owner rulings stated in-stream (the metered
   Oak-browser seat; self-limits-gated-on-asking; the record-register discipline) whose home
   (a rule, via new-rule-vs-pdr-clause) exists as a seam but was never triggered. The cure is
   a PIPELINE property, not a new home: ruling-to-rule latency needs a structural trigger
   (the consolidation cascade ADR-221 obligation 5 is the candidate wiring). This is the
   doctrine-seed's "standing cadence replacing one-off rescue" showing up empirically.
2. **Stale or conflicting homes** — the seam exists and CONTRADICTS the corpus (M07:
   `docs/engineering/merge-bot.md` states no-bypass while the corpus records the bot's
   code-owner-review bypass honoured at the REST layer; the turbo.json hash-leg comment
   falsified by probe). Cure: truing obligations, highest priority because a wrong home is
   worse than none — it answers searches with falsehoods.
3. **Wrong visibility tier** — knowledge homed where the wrong audience can see it: per-user
   memory carrying estate-grade discipline (the untracked-records custody check lives in ONE
   seat's user memory — invisible to every other seat; the per-user-memory-is-a-buffer rule
   names the drain obligation and this instance shows the buffer not draining), machine-local
   handoff records carrying "changed understanding" layers, tickets carrying general
   knowledge (the owner's information-homing ruling already names this class). Cure: tier
   migrations along the PDR-134 strata, not new seams.
4. **Compound knowledge shattered across atomic homes** — multi-fact operating contracts
   (the comms CLI's full send/drain/identity envelope; the settle-watch three-leg predicate;
   the bot-token lifecycle) whose atoms sit in separate register entries while the compound
   lives nowhere. The estate homes ATOMS well (frictions, gotchas, rule clauses) and
   COMPOUNDS poorly. Candidate seam: per-TOOL contract reference pages (reference tier), or
   the owning skill absorbs the compound — a genuine seam-design question for the owner and
   the ADR-221 concept layer, which is precisely built to index concepts spanning files.
5. **Orphaned obligations** — in-flight work whose seat died with the obligation recorded
   nowhere durable (the stale component bundle with no owning lane; the 60-page local-render
   gap; ADR-217 never landed off its superseded branch; the frozen #570 fixes; MCP-279's
   wrong-author commit). The 2026-07-27 orphan-risk review was a one-off sweep of exactly
   this class; nothing standing replaced it. Candidate seam: obligation-liveness validation
   (Badger's gate-expiry validator lane is the adjacent live instrument; ADR-221's estate
   graph gives obligations first-class nodes).

Epistemic notes for the adjudicator: some no-home-found verdicts will be search misses
(Sonnet-tier greps; the classes hold even where items move); every verdict gets first-hand
re-check before action. And the just-ratified knowledge-estate trio (PDR-134 strata, ADR-221
estate graph + concept layer) is the ontological instrument this analysis should feed rather
than duplicate — the Director named this corpus "prime input" to the concept layer, so the
seam proposals route through the trio's machinery and the owner, never as unilateral new
surfaces.

### Addendum (2026-07-31 ~13:07Z): the cut is routing vocabulary, not a partition

Adversarial pass by the alternative-perspectives seat (Dolphin weaves Marsh, Codex/GPT-5),
assessed and accepted by the Director, adopted by the adjudicator mid-P3. Three refinements:
the classified UNIT must be defined per entry (event, claim, obligation, compound, or home);
failure-mode classes are TAGS (zero-or-more — an item can be stale AND wrong-tier), kept on a
separate axis from the processing disposition (exactly one of graduated / duplicate /
rejected); and the shattered-compound class carries an overlap test with a negative control —
an atomic set joinable by an EXISTING concept surface is not a shattered compound. The
classes mix levels (pipeline / truth / placement / representation / lifecycle) by design;
they route work, they do not partition reality. P3 adjudication from this point applies the
two-axis form; verdicts already recorded stand.

## P5 spend record and P7 acceptance probe (2026-07-31 ~15:20Z)

**Owner rulings (carded)**: process all events; post-processing, remove all
events older than 3 days; heartbeat bytes DELETE (not archive).

**Watermark**: swept through 2026-07-28T15:18:57Z — 4,879 event files
deleted (created 2026-07-19T19:05:08Z .. 2026-07-28T15:18:57Z); 3,592
younger events retained in the live 3-day window. Provenance: zero
synthetic-fingerprint hits in the spend-set (six fingerprints scanned
pre-deletion); every spent event predates the P2 census cutoff, so the
mapped 23-window corpus covered it by construction.

**P7 cold-reader probe (run BEFORE deletion, on the pre-spend corpus)**:
stratified N=30 (10 heartbeat / 15 coordination-directed / 5 tagged),
seeded sample. Result 30/30: heartbeats are noise-dispositioned by the
§Heartbeat aggregate (their extractable knowledge — roster, cadence norms,
vocabulary — is in this report); nine substantive events were findable at
named homes on a checkout of main (bot-identity instances in the rule's
trigger paragraph, the x-stop calibration in the watcher rule, the EEF flip
and host-derivation dated notes in the strategic plan, the gh-auth
signature and --max-events story in their rules); the remainder are
**transient coordination events** — routing grants, queue updates, PR-open
notices, directed pings, acks — whose OUTCOMES live in git history, merged
PRs, and tickets. That transient class is hereby noise-dispositioned as a
CLASS: a routing instruction that was executed leaves its knowledge in the
executed state, not in the instruction; nothing in the class carries
standing doctrine (the probe checked each sampled instance against that
claim first-hand). Zero misses; P3 does not reopen.

- **Aggregate-tier warrant**: heartbeats carry aggregate-level knowledge only. Falsifier: if
  the P7 cold-reader probe finds a heartbeat event carrying unique un-homed substance, this
  tier assignment was wrong and heartbeats need body-read sampling (plan §Warrants).
- The P3 adjudication ledger and graduation record extend this report as they land; the
  keep-set data files sit beside it in `data/`.
