# Landscape survey — round 1b briefs (walker-visible instrument texts)

Every word a round-1b agent sees, committed BEFORE launch. Round 1a's
walker-visible texts lived only in the session-persisted workflow script
and were lost to the archive; this document is the cure — the committed
instrument, reviewable and reproducible. The operational spec (arms,
tiers, budget, execution) is
`landscape-survey-round1b-fleet-design-2026-08-17.md`; the reasoning is
`landscape-survey-round1b-design-rationale-2026-08-17.md`.

Owner rulings governing these texts (2026-08-17, verbatim anchors in
`fleet-design-lessons-2026-08-17.md`): Haiku takes constraints only,
never persona; persona depth scales Sonnet → Opus → Fable; round 1b
"properly challenges 1a, that we don't get stuck with the 1a lens".

## 1. The task statement (all walkers, all arms)

> You are designing how a TypeScript monorepo estate should be
> organised into units of code — what makes two things separate units,
> where units live, how they are named, and how the rules are enforced.
> You have never seen this estate's current plans or analyses, and you
> must not seek them out.
>
> FORBIDDEN (reading any invalidates your run — say so in `notes` if
> you do): anything under ANY dot-directory (`.agent`, `.claude`,
> `.cursor`, `.github`, and every other), anything under `docs/` or
> `research/`, ANY Markdown file anywhere in the repository
> (`README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` included), any
> worktree checkout, any file whose name mentions census, inventory,
> basis, reorganisation, taxonomy, survey, or deconstruction; PR
> bodies and git log messages.

This list is the 2026-08-17 review cure, twice over. The
frame-challenger found ADR-041 stating the ratified tiered layout
verbatim with README routing agents to it — readable by every
repo-direct walker under the old list (a leak live in round 1a too;
its explanatory power there is capped by the 1a grounding-invariance
probe, but for 1b it is closed outright). The assumptions review then
showed an enumerated deny-list cannot be closed over ~10,900 files —
`.agent/plans/` does not match `.agent/plans-backlog-2026-07/` and its
siblings — so the list now bans WHOLE CLASSES (dot-directories, docs,
research, all Markdown), and every walker with any grounding other
than repo-direct additionally carries: "READ NOTHING from the
repository or filesystem — reading any file invalidates your run; the
text above is your entire world."
>
> TASK: produce a complete organisational proposal — the questions your
> design answers, the minimal set of independent classifications it
> rests on, the concrete carrier for each (directory level, name
> convention, manifest field, enforcement rule, derived from the
> dependency graph), the layout it implies, and your placement of each
> case in the probe set below. In `notes`, state how many repository
> files you read (zero if none), and name any question you believe this
> task statement should have asked but did not.

Baseline walkers receive the task statement and their grounding — and
NOTHING else. No persona, no constraint, no revision instruction.

### 1a. The free-form task statement (D-free arm only)

The de-ontologised control: the standard task statement DEMANDS
classifications-with-carriers, which is itself the 1a dominant
ontology. Four seats receive this instead (schema `{proposal, notes}`,
no probe set):

> You are deciding how a TypeScript monorepo estate should be
> organised — whatever "organised" should turn out to mean. [same
> FORBIDDEN list] TASK: say how this estate should be organised, in
> whatever terms you think are the right terms. Do not assume the
> answer is a classification scheme, a directory tree, or any
> particular kind of structure — if it is, argue for that; if it is
> something else, produce that instead. State what determines where
> any given piece of code lives and how anyone (human or machine)
> would check the organisation is being followed. In `notes`, state
> how many repository files you read (zero if none).

Seeded walkers additionally receive one or both of:

> YOUR STARTING FRAME: {PERSONA}.
> YOUR CONSTRAINT (binding — a design that violates it is invalid):
> {CONSTRAINT}.

## 2. Groundings

- **(a) repo-direct** (ALLOWLIST, not blocklist — the leak cure):
  "Ground your design by reading the live repository at the current
  checkout, under a strict ALLOWLIST: you may read ONLY workspace
  manifests (package.json at any level), pnpm-workspace.yaml,
  turbo.json, tsconfig files, the lockfile, and source or test files
  under src/ or tests/ directories — never any Markdown file, never
  anything inside a dot-directory. Every other path is out of bounds
  even if not individually named above. READ BUDGET: at most 30 file
  reads AND at most 5 directory listings or searches; never list or
  glob the whole repository (a full path listing of this estate is
  roughly 800,000 characters — half a walker budget in one call). In
  `notes`, list EVERY path you read and state both counts." (Path
  lists make leaks measurable; the LISTINGS cap prices what the 1a
  overshoot's per-file counting missed — one full-tree listing is
  ~204k tokens and zero "files read".)
- **(b) facts-sheet**: the walker receives §6 verbatim, nothing else
  about the estate.
- **(c) requirements-only**: the walker receives ONE of THREE prose
  requirement variants in §7, assigned explicitly and balanced —
  cycling A/B/C over grounding-c seats in build order (6/6/6; index
  parity proved unbalanced, 13/4/1). The variants deliberately differ
  in CONCERN CARDINALITY (3 / 7 / 12): if walkers' classification
  counts track the concern count they were shown, rubric leakage is
  measured, not assumed absent. No mechanism facts.

## 3. The probe set (canonical for 1b; identities P1–P12, S1–S8 stable with 1a)

Hard cases:

- **P1**: A machine-readable interface-specification snapshot fetched
  from an external service, and a large bulk dataset from the SAME
  service, refreshed on different schedules by different mechanisms.
- **P2**: Four collections of machine-regenerated artefacts, each
  rebuilt in response to a different event class.
- **P3**: Byte-preserved third-party vendor files that must never be
  hand-edited, alongside hand-written styling that changes freely.
- **P4**: One tooling area whose code serves several distinct consumers
  on different rhythms (interactive commands, commit-time guards,
  scheduled jobs).
- **P5**: Hand-curated reference data carrying a content licence
  different from the code around it.
- **P6**: Trademark image assets whose reuse terms differ from
  everything else in the estate.
- **P7**: Research-study evidence code — quality-gated like product
  code but never shipped to users.
- **P8**: Operational scripts that run against live systems and sit
  outside the product quality gates.
- **P9**: A deployed product application and a demonstration
  application with near-identical structure but different audiences and
  support promises.
- **P10**: Generic machinery, reusable against any similar datastore,
  currently embedded inside a product-specific pipeline.
- **P11**: A browser-built interactive widget whose BUILT OUTPUT is
  embedded and served by a different unit than its source.
- **P12**: Commit-hook guard code and repo-state validator code — the
  same change rhythm, different consumers and failure modes.

Stratified current-unit sample:

- **S1**: An error-handling primitive — tiny, zero dependencies,
  imported nearly everywhere.
- **S2**: A path-safety utility born from a security incident — small,
  security-critical.
- **S3**: A large graph-data library exposing ~74 public symbols.
- **S4**: A typed client for the external curriculum service, published
  publicly.
- **S5**: A design-token pipeline whose output is generated CSS
  consumed by several surfaces.
- **S6**: A search-retrieval library over a commodity datastore.
- **S7**: The estate's largest unit — a codegen pipeline mixing
  spec-fetch, generated types, corpus mining, and hand curation.
- **S8**: An observability adapter for a commodity vendor.

## 4. Walker output shape (all arms; schema-forced at dispatch)

```json
{
  "design": "the proposal in prose: the questions it answers, the classifications, the layout it implies",
  "organisingRules": [{ "name": "", "rule": "", "carrier": "" }],
  "probePlacements": [{ "probe": "P1", "placement": "", "forcedFit": false }],
  "notes": "files read count; anything the task statement should have asked; anything else"
}
```

No self-scores. No trajectory. Rubric escapes travel in `notes`.

## 5. Seed tables

### 5.1 Haiku arm — constraint grades (NO persona), 3 grades × 3 groundings

- **Grade 1 (mild)**: "At most ONE of your classifications may be
  expressed by directory position; every other classification must live
  in machine-readable metadata."
- **Grade 2 (moderate)**: "Directory depth at most 1 below the
  repository root, AND every organising rule must be enforceable by a
  machine check you name."
- **Grade 3 (severe)**: "Directories may not carry ANY classification —
  a flat namespace of units; classifications live in manifest fields or
  a name grammar you define; machine-regenerated artefacts may not live
  in version control at all."

### 5.2 Sonnet arm — one-line persona + soft constraint (6 draws, groundings a b c a b c)

| # | Persona (one line) | Soft constraint |
| - | ------------------ | --------------- |
| 1 | an actuary who prices the risk of future change | favour classifications that survive a doubling of the estate |
| 2 | a rail-network signalling engineer | no classification may exist without a named enforcement instrument |
| 3 | a seed-vault archivist | optimise first for a collaborator who has never seen the estate |
| 4 | a customs officer classifying goods at a border | the whole organisation must be explainable in one page |
| 5 | a hospital pharmacist running a formulary | at most one concept may be borrowed from mainstream monorepo convention |
| 6 | a printing-house imposition planner | treat "who edits these bytes" as the FIRST question, everything else second |

### 5.3 Opus arm — fuller persona + soft constraint (3 draws, one per grounding)

1. **Persona**: "A national-archive chief cataloguer who has migrated
   three legacy classification systems and is professionally suspicious
   of any scheme that mirrors the previous one — you have watched
   inherited structure masquerade as design."
   **Constraint**: "Your design must name what it deliberately does NOT
   classify, and why."
2. **Persona**: "A container-port terminal designer who thinks in
   flows, dwell time, and crane economics — everything is priced by how
   often it moves and who must touch it."
   **Constraint**: "Prefer the smallest rule-set whose violations are
   mechanically detectable."
3. **Persona**: "A constitutional lawyer drafting a charter for a small
   federation — obsessed with which powers are enumerated, which are
   reserved, and how amendments are ratified."
   **Constraint**: "Any rule a newcomer cannot discover from the
   artefacts themselves is a defect."

### 5.4 Fable arm — rich persona, no constraint (2 draws)

1. **Grounding a (read cap 30)**: "A polymath urban historian turned
   city planner, rebuilding a city after an earthquake. You have seen
   what survives such rebuilds: street grids outlive buildings, zoning
   outlives councils, and the decisions people regret are the ones
   that preserved a familiar shape because it was familiar. You write
   in decisions and regrets — what you kept, what you razed, and what
   it cost to know the difference."
2. **Grounding b**: "A theatrical production manager running a
   repertory house: the same stage hosts different shows nightly.
   Your world is turnover cost, labelling, and who may touch which
   props — and above all the difference between the house's permanent
   fabric and each production's transient assets. You have struck too
   many sets at 2am to trust any scheme that confuses the two."

### 5.5 Codex MCP arms (parser relay, §8)

- **Baselines ×3**: groundings b, c(A), c(B).
- **Seeded ×4**: grade-2 constraint × groundings b and c(A); grade-3 ×
  grounding b; grade-1 × grounding c(B). No persona (cross-vendor prior
  is the treatment; constraints give the perspectives).

### 5.6 Codex CLI arms (owner-directed addition 2026-08-17: "A few Sol ultra, many Terra medium... Not instead of but in addition to")

Invoked headlessly via `codex exec` (§8a), read-only sandbox, verified
live this session (`gpt-5.6-terra` medium smoke: clean schema'd
extraction).

- **Terra medium (`gpt-5.6-terra`, effort medium) ×12** — "many":
  3 unseeded baselines (groundings a, b, c) + 9 constraint-graded (the
  §5.1 grades ×3 groundings — an EXACT mirror of the haiku arm, so the
  constraint-grade response is comparable across vendors seat-for-seat).
  No persona (Terra sits at the constraint end of the uptake gradient
  until measured otherwise — the mirror tests that assumption).
- **Sol ultra (`gpt-5.6-sol`, effort ultra) ×3** — "a few": 1 unseeded
  baseline (grounding b); 1 rich-persona walker (grounding b) — the
  cross-vendor test of top-tier persona uptake; 1 falsifier seat
  (§9). Sol persona, verbatim:

  > A lighthouse-service chief engineer from the age of automation: you
  > spent a career converting crewed lighthouses to unmanned ones —
  > deciding what must be visible from the sea, what must run without a
  > keeper, and what a rare visiting engineer must understand in the
  > first hour, because there is nobody to ask. Unstaffed reliability
  > and first-hour legibility are your twin obsessions, and you
  > distrust any structure that needs a resident expert.

### 5.6a Replication and high-tier carrier-ban arms (assumptions-review cures)

- **B2 ×6** (haiku, sonnet, opus, fable, codex MCP, terra): a SECOND
  unseeded grounding-b baseline per tier. Grounding b exists in every
  tier, so it is the attractor test's balanced headline column — n=2
  per tier, sol excepted (n=1, priced as "a few"; the comparator's
  caveats name it). Without this, every "this tier's prior is X"
  sentence rests on one draw.
- **O-grade3 / F-grade3 ×2** (opus, fable; grounding b): the grade-3
  directory ban previously ran only on the low tiers, where the
  unseeded attractor may never appear — leaving "the attractor
  survives where its carrier is forbidden" untestable at exactly the
  tiers that produce the attractor.

### 5.7 Free-form arm (D-free ×4 — haiku, opus, fable, terra-medium)

The de-ontologised control (§1a): task statement without the
classification demand, schema `{proposal, notes}`, grounding b, no
probe set. If these seats still return classifications-with-carriers
unprompted, that is territory evidence stronger than anything the
structured arms can produce; if they return something else, the round
has found the lens.

### 5.8 Decoy-estate controls (D-decoy ×4 — haiku, sonnet, opus, terra-medium)

The stimulus-side control (§7a): standard task statement (minus
probes), decoy facts sheet, schema `{design, organisingRules, notes}`.
Outputs go to the comparator only.

## 6. The neutral facts sheet (grounding b — carried verbatim from round 1a)

Scale: ~10,800 tracked files, TypeScript ESM, pnpm + turbo build
graph, ~5,900 commits/year, 308 multi-unit commits/year. External
services: one proper-noun curriculum platform (spec + bulk + live
queries, one credential, measured refresh rates 29/7/year), one
commodity search cluster, auth/observability/deploy commodities.
Licence classes: MIT code, OGL curriculum content, reserved brand
assets — coexisting, never mixable in one unit. Workforce: primarily
AI agents under human ownership. Product surfaces: an MCP curriculum
server, a search CLI, two demo apps, agent tooling, design system.
Generated artefact classes: spec-derived types (regenerates ~29×/yr),
search contracts (~16×/yr), bulk schemas (~7×/yr), mined corpus data
(24MB, ~19×/yr), an embedded widget (~18×/yr). Measured co-change
pair data and clock rates available on request as raw numbers.
(No directory names, no workspace counts, no axis vocabulary.)

## 7. Requirements prose (grounding c) — three variants differing in concern cardinality, never an enumerated list

The 2026-08-17 frame-challenger cure: the original A/B pair varied
VOICE while carrying the same seven concerns — a leakage test built to
return a null. The three variants now carry **3 / 7 / 12** concerns;
classification count tracking concern cardinality is the positive,
falsifiable leakage measurement.

**Variant A (3 concerns — the working day, minimal):**

> The people and machine collaborators who work here keep needing
> answers to three questions. When I change this thing, what else must
> change with it, and will anything tell me? Who may edit these bytes —
> a person deciding, or a machine that will overwrite my edit on the
> next rebuild? And when the organisation itself turns out to be wrong
> somewhere — because it will be — what does it cost to change it? The
> estate this serves: roughly ten thousand eight hundred tracked files,
> around five thousand nine hundred commits a year of which three
> hundred and eight touch several units at once, a workforce that is
> mostly machine collaborators under human ownership, and an
> expectation of substantial growth within two years.

**Variant B (7 concerns — the failure stories):**

> Design against the ways such estates fail. An edit lands in a file a
> machine owns, and the next rebuild silently erases it. Two things
> that always change together live far apart, and one of them is
> forgotten until production notices. Something whose reuse is legally
> reserved gets copied as if it were open, because nothing at the point
> of copying said otherwise. A newcomer reads the wrong thing first and
> builds a week of work on it. A machine collaborator, which pays for
> every file it opens, burns its whole budget just discovering where
> things are. A rule exists only in a document nobody re-reads, so it
> is violated with confidence. And the reorganisation everyone agrees
> is needed is priced so high by the current layout that it simply
> never happens. The estate in question holds roughly ten thousand
> eight hundred tracked files under version control, sees about five
> thousand nine hundred commits a year — three hundred and eight of
> them touching several units in one change — is worked mostly by
> machine collaborators under human ownership, and is expected to grow
> substantially within two years.

**Variant C (12 concerns — the working day, exhaustive):**

> The people and machine collaborators who work here keep needing
> answers while they work. When I change this thing, what else must
> change with it, and will anything tell me? Who may edit these bytes,
> and what regenerates them? May this piece import that one, and how
> would a wrong import be noticed? Under what terms may this leave the
> estate — freely, under a content licence, or never? Where does a
> newcomer look first, and does the path they guess exist? What does
> it cost a machine collaborator, paying for every file it opens, to
> find one unit? To read it? To edit it safely? Which rules are
> checked by a machine, and which exist only as good intentions? How
> does the organisation absorb a doubling of the estate without
> re-rooting? How would two units be merged, or one split, without a
> week of ceremony? And when the organisation itself turns out to be
> wrong somewhere, what does it cost to change? The estate this
> serves: roughly ten thousand eight hundred tracked files, around
> five thousand nine hundred commits a year of which three hundred and
> eight touch several units at once, a workforce that is mostly
> machine collaborators under human ownership, and an expectation of
> substantial growth within two years.

## 7a. The decoy-estate facts sheet (D-decoy stimulus controls only)

Four seats receive the STANDARD task statement (minus the probe set)
with THIS estate instead — a place where the prior round's dominant
shape would be manifestly wrong. If they emit it anyway, the shape is
a convention prior, not territory. Decoy outputs go to the comparator
only; they never enter the reduction corpus.

> THE ESTATE (all you know about it): Scale: ~300 tracked files,
> TypeScript ESM, single package manager, ~400 commits/year, almost
> all touching one area at a time. External services: none — the code
> is self-contained. Licence: everything MIT, no exceptions.
> Workforce: one human maintainer with occasional AI-agent help.
> Product surfaces: one small web application. Generated artefacts:
> none — everything is hand-written source.

## 8. The codex parser-relay contract

The relay agent's instruction, verbatim skeleton:

> Load the codex dialogue tool. Send it EXACTLY the brief between the
> BRIEF markers — add nothing, reframe nothing. Require it to answer
> with ONE fenced JSON block matching this shape: {design,
> organisingRules[{name,rule,carrier}], probePlacements[{probe,
> placement,forcedFit}], notes}. Extract that block VERBATIM — you are
> a parser, not an editor: no summarising, no restructuring, no
> vocabulary of your own. Validate it is well-formed JSON with those
> keys. If the tool is unavailable, the reply has no valid block, or
> validation fails after one re-ask, return {"shortfall": "<exact
> reason>"} instead. Never substitute your own design.

### 8a. The codex CLI relay contract

The relay agent writes the walker's prompt and the output JSON Schema
to scratchpad files, then runs from the repository root:

```bash
codex exec -s read-only -m <gpt-5.6-terra|gpt-5.6-sol> \
  -c model_reasoning_effort="<medium|ultra>" --color never \
  --output-schema s.json -o out.txt - < p.txt
```

It parses `out.txt`, validates the required keys, and returns the
object VERBATIM; one re-run on failure, then a named shortfall. The
read-only sandbox mechanically prevents writes; READS remain
honour-bound to the FORBIDDEN list, the same epistemic status as every
native tool-holding walker.

## 9. The falsifier briefs (5 agents; the design-falsifiers are the ONLY free seats shown any 1a material)

**Design falsifiers (×4 — opus, fable, codex MCP, codex CLI sol):**

> A prior survey of this design space produced the design in the
> attached packet as its strongest candidate. Your job is to test it
> to destruction — and to report honestly what survives. First: audit
> it adversarially against the estate described below — find where it
> is wrong, vague where it must be precise, expensive where it claims
> to be cheap, or quietly dependent on the very structure it claims to
> redesign. Every defect needs evidence from the design's own text or
> the grounding, and a severity (high/medium/low). Second: give your
> verdict — "refuted", "sound-with-defects", or "sound". If your
> verdict is refuted or sound-with-defects with high-severity
> findings, produce a complete alternative design that cures your
> highest-severity defects (your fix, not a patch of theirs), placing
> every probe case. If after honest effort you judge the design sound,
> SAY SO — set fixDesign to null; a forced fix is worth less than an
> honest verdict.

(The verdict field and nullable fixDesign are the 2026-08-17
frame-challenger cure: the original schema REQUIRED defects and a
replacement, which made the arm structurally unable to disconfirm.)

Attachments: the walker-35 packet INLINED VERBATIM in the prompt
(build-time substitution from the committed
`round-1b-falsifier-packet.json` — no falsifier holds repository
access, which also closes the assumptions review's leak where a seat
given a Read path could list the packet's directory and find the full
1a archive beside it) + facts sheet (§6) + requirements variant A
(§7) + the READ-NOTHING seal. Falsifier fix-designs enter the
reduction corpus tagged `origin=falsifier`; the comparator reports
basin mass both WITH and WITHOUT them, because they are the most
1a-anchored designs in the corpus by construction.

**The instrument falsifier (×1 — opus):** the only seat doing directly
what the owner asked of the whole effort — attacking the instrument,
not a design:

> You are auditing a survey INSTRUMENT, not a design. A fleet of
> agents will each receive the texts below (task statement, probe set,
> requirement prose, output schema) and produce organisational designs
> for a real estate; the survey's owners fear the instrument teaches
> the answers it then measures. Attack the instrument: what answers
> does its wording foreclose? What structure does it presuppose (in
> the task statement's nouns, the schema's required keys, the probe
> set's minimal pairs)? What would an agent who disagreed with the
> instrument's framing be UNABLE to express? Evidence every defect
> from the instrument's own text, with severity. Then sketch a better
> instrument in prose.

Attachments: both task statements, the probe set, all three
requirement variants, the walker schema. No 1a material, no estate
grounding — the instrument is the entire subject.

## 10. Reducer, comparator, and scorer briefs

**Reducer (×2 — run independently; each sees ONLY the corpus):**

> Here is a corpus of organisational designs for one estate, each with
> arm, tier, and grounding metadata. Derive YOUR OWN descriptor
> dimensions from what actually varies in this corpus — do not import
> a scheme from anywhere. Assign every design to a cell in your
> descriptor space, name the strongest member of each cell and why,
> and name the designs too singular for any cell. Output: {descriptors:
> [{name, values}], cells: [{coordinates, memberIds, eliteId,
> whyElite}], outliers: [{id, why}], notes}.

**Comparator (sees both reductions + the 1a descriptor tuple + the
baselines + the decoy outputs):**

> Two independent reductions of one corpus, the descriptor scheme a
> PRIOR round derived over a different corpus, the unseeded baseline
> designs, and a set of DECOY-estate control outputs. Report: (1)
> where the two reductions agree and disagree — a disagreement is a
> finding about the instrument, not an error to fix; (2) the attractor
> test as PER-OBSERVATION rows — one row per unseeded baseline, n=1
> per (tier, grounding) cell, with an explicit caveat that tier,
> grounding, and sampling variance are not separable; (3) basin mass
> around the dominant shape, reported twice — with and without
> `origin=falsifier` entries; (4) decoy analysis — do the decoy
> outputs reproduce the prior dominant shape where it is manifestly
> wrong? If yes, that shape is evidence of a convention prior, not
> territory; (5) variant leakage — variants A/B/C carry 3/7/12
> concerns; does classification count track concern cardinality? (6)
> whether the prior round's descriptors would have fit this corpus.

**Scorer (sees reducer X's elites + the measured record):**

> Score each elite against the measured record only: the 12-month
> co-change pairs, the regeneration clock rates, and the live-mechanism
> facts. Boundary fitness: would this design's minting rule split any
> ≥85% co-change pair across boundaries? Governance answerability: can
> import direction, edit rights, licence, regeneration, and membership
> each be answered by reading ONE declared thing? Score 0–5 each with
> the specific evidence, per elite. Never score against any prior
> round's solutions.
