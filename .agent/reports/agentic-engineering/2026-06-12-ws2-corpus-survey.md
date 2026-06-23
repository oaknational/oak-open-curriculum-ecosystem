# WS2 — Comms-Corpus Automated Survey

**Plan**: [`comms-corpus-research-and-rotation-strategy.plan.md`](../../plans/agent-tooling/active/comms-corpus-research-and-rotation-strategy.plan.md)
**Author**: Katydid hunts Roost (claude-code / Fable 5 / a4314f)
**Status**: DRAFT — quantitative sections complete; extraction histograms, catcher-delta, and
the prioritised shortlist land after Wave 1 completes.
**Derivation anchors**: every count names its derivation moment; the stream moves while it is
analysed. Primary derivation: 2026-06-12T20:49Z–21:05Z over 5,014 events (an earlier WS0 pass
at 20:13Z saw 5,003 — the corpus grew 11 events in 36 minutes of analysis, itself a live-stream
fact).

## Grounding and blind-pass order attestation

WS0 ran first-hand: thread record read per the Resume Contract (with the executing seat's
contamination — the full record including both Candidate Themes sections was read during
start-right grounding BEFORE the opener could fence it; disclosed in comms events `37523113` /
`8cefbe36`); schema read; corpus size/span re-derived first-hand (below). The WS1 blind pass
was preserved by the owner-decided cure: eight fresh-context Fable 5 delegate readers briefed
only on the three lenses + date windows, with the thread record, plans, prompts, patterns,
memory surfaces, and decision records fenced. Six surprises logs were recorded
(`ws1-cold-reads/`: R1, R4–R8) BEFORE this survey's qualitative interpretation began; R2/R3
re-ran after a session-quota kill. The shortlist in this report draws from BOTH the surprises
logs and the seeded catalogue, with selection rationale, per the plan's ws2 acceptance row.

## Corpus shape (as of 2026-06-12T20:49Z, n=5,014)

| Fact | Value |
| --- | --- |
| Events | 5,014 (0 unparseable) |
| Span | 2026-05-20T11:38:38Z → 2026-06-12T20:49:18Z (24 days) |
| Shapes | narrative 3,923 / directed 1,091 / **lifecycle 0** |
| Tags | heartbeat 2,245 / behaviour-note 303 / failure-mode 41 / untagged 2,431 |
| Distinct author tuples | 218 (name + session prefix) |
| `in_response_to` populated | **0** corpus-wide |
| `naming_schema_version` | absent 4,786 / `override` 228 / `v1`+`v2` **0** |
| Total body text | 6.06 M chars (≈1.5 M tokens); medians: heartbeat 149, narrative 1,679, directed 1,719 chars |

Three structural absences are findings in their own right:

1. **The lifecycle event kind has never been used.** The schema's third `oneOf` shape has
   zero instances in 24 days. Heartbeat-end, session-close, and claim-lifecycle moments are
   all expressed as `narrative` events with title conventions instead (ADR-186 names
   `lifecycle + event_type='heartbeat'` as the canonical forward shape; the corpus shows the
   migration has not begun).
2. **Event-to-event threading barely happens by ANY mechanism.** `in_response_to` is zero
   corpus-wide. A first instinct (this report's earlier draft) read the body-text UUID/8-hex
   tokens as a rich emergent "prose-citation convention" (≈1,835 edges). A first-hand
   resolution scan (2026-06-13T08:06Z; script preserved beside this report) **corrected that
   over-claim**: of 1,812 full-UUID tokens cited in bodies, only **115 resolve to a real
   comms event** — the other ~1,697 are `claim_id`s, PDR-027 agent `id`s (v5 `-5xxx-`),
   `intent_id`s, handoff-record ids, and PR/commit UUIDs, i.e. references to *other entities*,
   not prior events. The 8-hex space is the same story (5,894 tokens; 1,861 match a unique
   event-id prefix, but many of those are git SHAs / claim prefixes, not event→event links).
   The honest finding is therefore **stronger and cleaner than the original**: structured
   threading is unused AND genuine prior-event citation is a small minority of all the
   reference tokens agents emit. When agents cite, they cite claims, agents, intents, and
   commits far more than they cite prior events. (The naive "93.7% dangling" full-UUID
   metric that nearly shipped is itself a worked instance of the WS3 measurement-artefact
   class — recorded as such.)
3. **Era provenance is effectively unstamped** (95.5% absent) — consistent with the
   identity-era work being recent; the `override` rows are operator-named agents.

## Temporal structure

Daily volume, active authors, and tag counts (derived 20:55Z):

| Day | Events | Authors | Heartbeats | failure-mode | behaviour-note |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2026-05-20 | 3 | 2 | 0 | 0 | 0 |
| 2026-05-21 | 126 | 18 | 0 | 0 | 0 |
| 2026-05-22 | 343 | 23 | 0 | 0 | 0 |
| 2026-05-23 | 873 | **32** | 0 | 0 | 1 |
| 2026-05-24 | 565 | 19 | 190 | 13 | **138** |
| 2026-05-25 | 433 | 24 | 249 | 9 | 29 |
| 2026-05-26 | 260 | 8 | 176 | 0 | 4 |
| 2026-05-27 | 150 | 14 | 72 | 1 | 33 |
| 2026-05-28→06-08 (12 days) | 225 | 1–7/day | 89 | 3 | 73 |
| 2026-06-10 | 795 | 21 | 555 | 7 | 11 |
| 2026-06-11 | 1,112 | 26 | 821 | 5 | 9 |
| 2026-06-12 (to 20:49Z) | 129 | 10 | 93 | 3 | 5 |

- **Two intensive arcs** (05-21→27 ≈ 2,750 events; 06-10→12 ≈ 2,036) bracket a sparse
  fortnight. Peak concurrent population: 32 distinct authors in one day (05-23).
- **60 silences over one hour** (longest 45.3 h); densest burst **28 events in 5 minutes**
  (2026-06-11T08:50Z).
- **Heartbeat share of the stream rose era-over-era**: 0% (pre-05-24, before the contract
  existed) → ~34–58% (05-24→27) → **70–74%** (06-10/11). The liveness substrate increasingly
  dominates the stream — the single strongest quantitative argument for class-tiered
  retention in the WS5 rotation design.

## Conversation structure

- **Directed reply latency** (directed A→B followed by directed B→A within 4 h): n=710
  pairs, median **3.5 min**, p25 1.3, p75 11.2, p90 34.9 (derived 20:55Z). Inter-agent
  request/response is fast when it happens; the long tail is the interesting region for
  deep-dives (stalls, owner-mediated waits).
- **Top directed pairs**: Seaworthy Navigating Beacon ↔ Twilit Scattering Twilight (20+15),
  Flamebright Igniting Forge → Blustery Lifting Plume (15), Lacustrine Sailing Lighthouse →
  Seaworthy Navigating Beacon (13), Scorched Tempering Kiln → Ferny Fruiting Root (13).
  Hub-shaped traffic concentrates on Director-seat names.
- **Citation graph (corrected, derived 2026-06-13T08:06Z)**: of full-UUID tokens in
  bodies, only **115 resolve to a real comms event**; ~1,697 "dangling" full UUIDs are
  claim/agent/intent/handoff/PR references, not event citations. Literal unfilled-citation
  placeholders: **10 genuine instances** across 5,120 events (e.g. `bfa99e61`
  "[ID-of-shaded-event]", `357d04ff` "[shaded broadcast id]") + 11 CLI-usage false
  positives. Event→event threading is rare by every mechanism; "citation theatre" (citing
  events that do not exist) is a real but **rare** stream-hygiene phenomenon, not a
  pervasive convention.

## Liveness substrate statistics

- Median heartbeat cadence per agent clusters tightly at **4.0 min** (the PDR-078
  contract): e.g. Twilit Scattering Twilight 4.01, Breezy Anchoring Rudder 4.00, Sylvan
  Sprouting Petal 4.02.
- **Cadence anomalies**: Pelagic Cresting Pier median **1.19 min** and Estuarine Fathoming
  Sail **1.76 min** (over-emitting ~2–3× contract); Mistbound Hiding Threshold **8.35 min**
  (under-emitting ~2×). Deep-dive candidates: mis-armed loops vs deliberate cadence choices.
- **Convention preceded substrate**: "Heartbeat:" as a title prefix first appears
  2026-05-23T15:57Z; the first heartbeat-TAGGED event is 2026-05-24T10:18Z — the practice ran
  ~18 h on prose convention before the tag namespace carried it.

## Tag-adoption analytics (PDR-066 falsifiability evidence)

- First `behaviour-note`: 2026-05-23T10:16Z. First `failure-mode`: 2026-05-24T22:01Z.
- Adoption burst on activation (05-24: 13 fm + 138 bn), then **decline relative to
  volume**: the 06-10/11 arc produced 1,907 events but only 12 fm + 20 bn — roughly a
  five-fold drop in tag usage per event compared with the 05-24/25 era. Candidate readings
  (for WS3/WS4, not asserted here): capture moved to other channels (napkin, distilled,
  PR bodies), the novelty effect decayed, or the second-era teams worked in modes that
  surface fewer taggable moments. The raw trend is the falsifiability input PDR-066 names.

## Convention-emergence timeline (title-genre first-seen)

| First seen (UTC) | Convention |
| --- | --- |
| 2026-05-22T08:19 | `Team start` report |
| 2026-05-22T08:54 | `Coordinator role acknowledgement` |
| 2026-05-23T10:47 | `Coordinator pre-positioning` |
| 2026-05-23T15:57 | `Heartbeat:` title prefix |
| 2026-05-23T16:20 | `Heartbeat-end:` |
| 2026-05-23T17:12 | `Team member closeout` |

Genre population (top, of 2,324 Heartbeat-titled events total): Heartbeat (2,324),
no-prefix (385), Heartbeat-end (93), Team start (70), Team member closeout (45+31 across
two spellings — an unnormalised convention variant), coordinator pair (17+17). One agent
(`Ferny Spreading Blossom`, 25 events) used their own name as the title prefix — a
convention dialect.

## Statistical anomaly scan (inputs to Wave-2 deep-dives)

1. Zero lifecycle-kind events (schema shape never adopted).
2. Zero `in_response_to`; only 115 full-UUID tokens resolve to real events (most cited
   UUIDs are claims/agents/intents) — event→event threading is rare by any mechanism.
3. Heartbeat cadence outliers (1.19 / 1.76 / 8.35 min vs 4.0 contract).
4. `Team member closeout` vs `Team-member closeout` spelling fork (45 vs 31) — convention
   drift without normalisation pressure.
5. Heartbeat share trending toward three-quarters of all traffic.
6. Tag-usage decline relative to volume after the activation burst.
7. 218 author tuples in 24 days — population churn far exceeds any single team window;
   identity is predominantly single-session.

## Extraction histograms (Wave 1, 2,768 non-heartbeat events annotated)

Twenty per-slice extractors (haiku) annotated every non-heartbeat event with a subject
category, a communicative act, extracted entities, and an anomaly flag. Coverage: 2,768 of
2,769 non-heartbeat events (one annotation file per chronological slice; derived
2026-06-13T07:26Z). Distributions:

**Subject category** (what the event is about):

| Count | Category | | Count | Category |
| ---: | --- | --- | ---: | --- |
| 734 | commit-coordination | | 145 | review-dispatch |
| 400 | claim-coordination | | 41 | decision |
| 332 | liveness | | 35 | failure-capture |
| 259 | merge-pr | | 31 | planning |
| 175 | owner-direction | | 22 | identity |
| 160 | handoff | | 20 | watcher-tooling |
| ~230 | other:* (status-update 110, status 57, misc) | | 4 | experiment |

**Communicative act** (what the event does):

| Count | Act | Share |
| ---: | --- | ---: |
| 1,318 | **report** | **48%** |
| 323 | broadcast-fyi | 12% |
| 289 | ack | 10% |
| 274 | request | 10% |
| 101 | grant | 4% |
| 80 | correction | 3% |
| 78 | handoff | 3% |
| 74 | decision | 3% |
| 16 | question | 0.6% |
| 10 | escalation | 0.4% |

This is the survey's central quantitative finding for the cost-of-collaboration consumer:
**roughly half of all non-heartbeat traffic is one-way status reporting**, and once
heartbeats are included (2,245 of 5,014 events) the stream is dominated by
presence-and-status signal. Substantive two-way coordination — request/grant/decision/
correction — is a minority of traffic, and genuine **questions (16) and escalations (10)
are vanishingly rare**: agents overwhelmingly report and acknowledge rather than ask or
escalate. Whether that reflects healthy autonomy or under-surfacing of genuine forks is a
WS4 deep-dive question (it bears directly on the "few questions" reading of owner-direction
interpretation).

**Anomaly flags**: 76 events flagged by the extractors, concentrated in commit-coordination
(14), failure-capture (14), and decision (11) — these feed the WS3 taxonomy and the WS4
deep-dive shortlist alongside the WS1 surprises logs.

## Pending (later-wave outputs)

- Catcher-delta: Fable-vs-haiku extractor comparison on slices 6 and 19 (quality-control
  signal on the breadth pass) — re-running after a quota kill.
- Corroboration verdicts over all eight WS1 logs (confirmed/refuted/unverifiable per
  finding) — running.
- **Prioritised shortlist** drawing from the WS1 surprises logs AND the seeded catalogue,
  with selection rationale (surprises outrank seeded confirmation at equal evidence) —
  assembled at WS3/WS4 entry once the corroboration verdicts are in.

## Reproducibility

Counts derive from a single metadata pass (no bodies read by the orchestrating seat beyond
tag/title fields). The executed script is preserved byte-identical beside this report at
[`2026-06-12-ws2-corpus-survey.wave0-script.js`](2026-06-12-ws2-corpus-survey.wave0-script.js)
(run from the repo root with `node`); its outputs are the per-event index
`/tmp/katydid-corpus-index.jsonl` and the statistics object
`/tmp/katydid-corpus-stats.json` (derived scratch — recreate by re-running; the live stream
will have moved). The abridged listing below shows the index derivation only.

```javascript
// Wave 0 index + statistics (run from repo root: node wave0.js)
// Full script preserved here for reproducibility; see also the day-cuts one-liner variants
// recorded in the plan §WS2 survey commands.
const fs = require("fs");
const path = require("path");
const DIR = ".agent/state/collaboration/comms";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && !f.includes(".tmp-"));
const FULL_UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const HEX_TOKEN = /\b[0-9a-f]{7,12}\b/g;
const rows = [];
for (const f of files) {
  const e = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  const shape = e.author ? (e.kind === "lifecycle" ? "lifecycle" : "narrative") : e.from ? "directed" : "unknown";
  const author = e.author || e.from || {};
  const to = e.to || e.addressed_to || null;
  const body = e.body || "";
  const title = e.title || e.subject || "";
  const selfId = e.event_id || f.replace(/\.json$/, "");
  rows.push({
    id: selfId, file: f, created_at: e.created_at, shape, kind: e.kind, tags: e.tags || [],
    author_name: author.agent_name || "?", author_prefix: author.session_id_prefix || "?",
    naming_era: author.naming_schema_version || "(absent)",
    to_name: to ? to.agent_name || "?" : null,
    title, genre: title.includes(":") ? title.slice(0, title.indexOf(":")).trim().slice(0, 48) : "(no-prefix)",
    body_len: body.length,
    cited_uuids: [...new Set((body.match(FULL_UUID) || []).filter((u) => u !== selfId))],
    hex_tokens: [...new Set(body.match(HEX_TOKEN) || [])],
    has_in_response_to: Boolean(e.in_response_to || e.in_reply_to),
  });
}
rows.sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
// Distributions, silences (>1h gaps), max 5-min burst, per-author heartbeat cadence
// (median gap < 120 min), citation-edge resolution (full UUID + unique 8-hex prefix),
// directed-pair counts, and reply-latency pairing (A->B then B->A within 4h) follow
// mechanically from `rows`; the executed script is byte-preserved in the session
// transcript and its outputs in the two /tmp files named above.
```

No PII appears in this report; agents are identified only by their Practice codenames.
