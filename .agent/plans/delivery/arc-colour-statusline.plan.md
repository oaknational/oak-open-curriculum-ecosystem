---
id: arc-colour-statusline
node_type: delivery
name: "ARC-colour statusline — per-channel identity-coloured feather badges"
overview: "Replace the statusline's single binary ArcAngel wing with per-channel truecolor feather badges derived from parsed channel content (colour index, roster, cross-host and invalid states), plus the usage-gauge model-row placement — the castr-pinned estate brought into oak as one coherent delivery: grammar, palette, session shape, renderer, colour-assignment reporter, corpus validator, and channel-open convention."
status: ratified
ratified_by: 'Jim Cresswell'
ratified_date: 2026-08-03
ratified_where: 'Owner ratification card at the Director seat, the all-open-questions batch, 2026-08-03 (recorded in §Direction); stamp completed 2026-08-07 when the ticket-existence obligation was removed (plan-node schema §2026-08-07 amendment, PR #817)'
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
# The former mechanical gate (its record, conserved): the SUBSTANCE was
# owner-ratified (direction 2026-07-20; re-asked and re-affirmed
# 2026-08-03, both recorded in §Direction); the gate held only the
# tickets field pending ticket mint at the embargo's end. Both premises
# dissolved (embargo lifted 2026-08-06; ticket-existence obligation
# removed by the plan-node schema §2026-08-07 amendment, PR #817), so
# the stamp completed 2026-08-07. A visibility ticket may still be
# minted as working practice.
last_updated: 2026-08-07
---

# ARC-colour statusline — per-channel identity-coloured feather badges

**Supersession note (2026-08-03).** This node re-homes
`.agent/plans-backlog-2026-07/agent-tooling/active/arc-colour-statusline-infrastructure.plan.md`
into the anchored estate under the current plan schema. The backlog node's
substance is DECISION-COMPLETE and readiness-reviewed (four experts —
assumptions, config, test, docs-adr — unanimous SOUND-WITH-AMENDMENTS
2026-07-20, every amendment folded at `91da8be8f` + `3cd84b03e`); those
decisions are carried here unchanged, not re-litigated. This re-home adds the
anchored frontmatter, the 2026-08-03 staleness true-up (§Ground truth), and
current owner provenance. The backlog file gains a dated pointer to this node;
its record is preserved. The backlog corpus sits outside the anchored
id-space, so the supersession edge is body-carried (the plan-corpus validator
correctly refuses cross-corpus frontmatter edges).

## Direction (owner words)

- 2026-07-20: bring the feather icon enhancements and the moved usage-quota
  data from the castr statusline lane into oak; "the ARC feather system is a
  serious statusline-infrastructure upgrade." No backwards compatibility.
  Grammar obligations bind from adoption forward ("we don't fix the old
  channel docs, we just update the system").
- 2026-08-03 (this node's trigger): "coloured markers to the right of the ARC
  feather in the statusline to allow a visual glance determination of which
  ARC channels are open between which agents" — the owner asked after two
  live ARC channels in one night rendered only the binary wing; he directed a
  new standards-compliant, decision-complete plan.

## Goal · In · Out

**Goal**: at a glance, the statusline shows WHICH ARC channels are open and
WITH WHOM — one identity-coloured feather badge per live channel, colours
drawn from each channel's recorded colour index, with cross-host, invalid,
and overflow states rendered honestly. Usage gauges (`ctx:` + `s`/`w`) sit on
the model row.

**In scope**: `agent-tools/src/claude/statusline-*` (session shape, gatherer,
indicators, render, ANSI, new palette); the new `agent-tools/src/arc/` estate
(channel grammar, colour-assignment reporter CLI); the new
`src/validators/arc-channels/` corpus validator with blocking gate wiring;
the channel-open colour convention in the canonical ARC reference doc plus
the ceremony wiring; ADR-214 finalisation.

**Out of scope (recorded)**: castr's `subagent-statusline*` / logo
architecture (oak keeps `oak-logo.ts`); any retro-editing of channel history,
exclusion lists, or pre-adoption fallback readers (adoption-forward is the
grammar's own semantics); colour-less feather fallbacks (excluded hedge);
the solo-floor registry-reader extraction (beneficial, not required).

## First-principles check (plan-body rule, clauses 4–6)

- No decided-state herein contradicts standing owner word; every §Decisions
  row carries provenance, and the 2026-08-03 re-ask matches the 2026-07-20
  direction (verified against both records).
- Landing path: TDD cycle-pairs per story, single-story PRs on the PDR-132
  two-round budget, bot identity, full-condition merges; the validator's
  blocking-gate wiring lands only with the real validator green over the real
  corpus (value-proxy, never self-authored).
- Vendor literals verified: the only external dependency is `zod ^4.4.3`,
  already present in `agent-tools/package.json` (re-verified first-hand
  2026-08-03). The port source is PINNED to `EngraphCode/castr` `origin/main`
  @ `63a7e675` (castr PRs #22 + #29, merged 2026-07-20; a private repo — the
  executing seat re-verifies pin reachability at story open, and any local
  castr working tree is NOT authoritative).
- Record-consumer clause: the grammar is consumed by palette/session-shape/
  renderer/reporter/validator; the validator is gate-wired; the convention
  doc is invoked by two ceremony surfaces. No write-only artefacts.

## Ground truth (staleness true-up, verified first-hand 2026-08-03)

The 2026-07-20 seam map still holds exactly:

- `ARC_ACTIVE_WINDOW_SECONDS = 1800` hard-coded at
  `statusline-session-shape.ts:93` (deleted + imported at ws-b2-c3).
- `arcActive: boolean` resolved at `statusline-session-shape.ts:107`,
  consumed at `statusline-indicators.ts:66` (replaced at ws-b4-c1/ws-b5-c1).
- Root `knip.config.ts` entry carries `src/claude/**/*.ts`, no `src/arc`
  entry; `agent-tools/src/arc/` does not exist yet.
- The ws-b9 repair targets (the `resolveArcActive` filename-substring
  wing-detection paragraphs and §Known limitations) are present in
  `.agent/reference/arc-rapid-communication.md`.
- One naming true-up joins ws-b4: the gatherer's vocabulary is legacy
  ("experimentsListing", `listExperiments`) though it already reads the
  canonical `rapid-comms/` home (`statusline-identity.ts:203`) — rename to
  the rapid-comms vocabulary in the same landing (one concept, one name).
- Live-corpus note: the two channels opened 2026-08-03 carry no
  `Channel-colour:` line; under adoption-forward semantics they resolve
  pre-adoption and age out naturally — the designed behaviour, no corpus
  coordination needed.

## Decisions (carried from the readiness-reviewed record — provenance per row)

| Decision | Provenance |
| --- | --- |
| Adoption-forward grammar obligations; history append-only, never retro-edited; no exclusion lists | Owner ruling 2026-07-20 |
| No backwards compatibility, no colour-less fallback, no parallel shapes | principles.md §Core Rules; owner direction 2026-07-20 |
| Feather colour is a projection of parsed channel content (never decoration) | ADR-214 (landed, PR #428) |
| Shared ARC constants single-home in the grammar; oak's local window constant deleted | consolidate-at-second-consumer; readiness review |
| `observing-directed` teamShape + director honesty-gate IN scope | Readiness review (excluding would fork the shape) |
| Usage gauges on the MODEL row, location row plain | Owner direction 2026-07-20 (supersedes cycle-1 placement) |
| Grammar + validator land in ONE estate delivery (no dead exports) | principles.md §No unused code |
| Adoption-date constant binds by invariant (first calendar day after merge), guard-proven at ws-b10 | Readiness amendment 2026-07-20 |

## Workstreams

Story ids, dependencies, and deterministic proofs are carried verbatim from
the readiness-reviewed record; two stories are already landed. Sequencing is
self-correcting (each downstream gate breaks if its predecessor drifted);
Deliverable A shares no surface with B and is parallel-safe.

- **ws-b0-graduate-arc** — LANDED (PR #730, merge `3fb6875e6`, full
  condition, round 1 of 2 used; census delta — two stray files, not one —
  and the round-1 corrections recorded on the PR). ARC graduates from
  experiment to standing
  infrastructure (owner word 2026-08-03: "it's not an experiment any more, we
  use it all the time"). Doc-only, no dependencies, natural first story: (a)
  restructure `.agent/reference/arc-rapid-communication.md` as standing
  doctrine — protocol and conventions lead; the evaluation-evidence sections,
  observed-arc histories, and "named triggers" move to a dated report under
  `.agent/reports/` (knowledge preserved, never deleted) with the triggers
  re-expressed in the doc as standing maintenance clauses; keep the alias
  line (it cures real search misses) but drop the experiment-era debt
  framing; (b) relocate the stray pre-relocation channel file
  `.agent/collaboration/experiments/2026-06-12-rendezvous-firefly-forge.md`
  into the canonical rapid-comms home (git mv — history preserved) and
  retire the empty directory; (c) sweep remaining "experiments" vocabulary
  in the rapid-comms README/notice files. Decision recorded: the graduation
  re-prices the CLI-mediated atomic-append helper (the doc's own cure
  candidate for the split-append class), but building it still gates on
  first observed corruption or owner word — standing infrastructure does not
  suspend YAGNI. Acceptance: zero experiment-framing in the live doc, the
  dated report exists, the stray file relocated, markdownlint green. Proof:
  `rg -n 'experiment' .agent/reference/arc-rapid-communication.md` returns
  only the retired-path historical note (or nothing) AND
  `pnpm markdownlint-check:root`.
- **ws-a-cycle-1** — LANDED (PR #427, `fa0ceb4f4`): interim usage-gauge
  placement (superseded by cycle 2's design).
- **ws-b1-adr** — LANDED (PR #428, `3e2041e27`): ADR-214 authored;
  finalisation to Accepted rides ws-b10.
- **ws-a-cycle-2** — usage gauges move to the MODEL row after the model name;
  location row returns to plain; delete `locationRowsWithUsage()` if it loses
  its last consumer. TDD pair `statusline-render.ts` +
  `tests/claude/statusline-render.unit.test.ts`. Independent of B; ships as
  its own small PR. Proof: the render unit suite.
- **ws-b2-c1-parse-strictness** — `src/arc/arc-channel-grammar.ts` with
  `parseArcChannel` + `evaluateArcChannelStrictness` (zod schema authority).
  Adoption-date semantics per the readiness-amended design: a channel's
  resolution date is its filename date prefix when present, else an injected
  recorded-creation date (validator supplies git first-commit; tests inject;
  the pure grammar never does IO); obligations fire only for channels
  resolving on-or-after `ARC_SCHEMA_ADOPTION_DATE`; the two verified undated
  legacy channels resolve pre-adoption; a post-adoption undated channel still
  fails. Corpus membership: every markdown file under the rapid-comms root
  outside the closed non-channel set (README.md, `.starless-notice-body.md`).
  Co-located unit tests. Depends: ws-b1.
- **ws-b2-c2-colour-roster** — `resolveChannelColour`, `deriveArcRoster`,
  `isCrossHostChannelName`, `ARC_PALETTE_SIZE`,
  `ARC_ACTIVE_WINDOW_SECONDS` join the grammar. Depends: b2-c1.
- **ws-b2-c3-single-home-constants** — DELETE the local
  `ARC_ACTIVE_WINDOW_SECONDS` in `statusline-session-shape.ts`; import from
  the grammar. Proof: exactly one definition repo-wide + the test suite.
  Depends: b2-c2.
- **ws-b3-c1-palette** — `statusline-arc-palette.ts`: 8 truecolor mid-tones +
  `ARC_ERROR_FOREGROUND`, importing `ARC_PALETTE_SIZE`. Depends: b2-c2.
- **ws-b3-c2-truecolor-ansi** — `truecolorForeground(r,g,b)` in
  `statusline-ansi.ts`; `38;2` SGR output asserted. Depends: b2-c2.
- **ws-b4-c1-arcchannels-shape** — replace `arcActive: boolean` with
  `arcChannels: ArcChannelBadge[]` (bounded content reads:
  `ARC_CONTENT_READ_CAP=8` / `ARC_CONTENT_BYTE_CAP=256KB`, membership-first
  ranking); PRESERVE oak's `identityPrefix` path; atomic consumer migration
  (indicators + fixtures migrate in the same landing, interim single-wing
  from `arcChannels.length`); relocate the touched legacy describing tests to
  co-located `*.unit.test.ts`; rename the legacy "experiments" gatherer
  vocabulary to rapid-comms in the same touch (§Ground truth). Depends:
  b2-c3.
- **ws-b4-c2-gatherer** — the gatherer resolves `arcChannels` from recorded
  channel content; new co-located `statusline-identity.unit.test.ts`
  (verified 2026-07-20: no legacy test exists to relocate). Depends: b4-c1.
- **ws-b4-c3-observing-directed** — `observing-directed` teamShape + director
  honesty-gate; the gate reads a role field from claim records — verify oak's
  claim shape first-hand and hand-merge, never assume castr field parity.
  Tests: fresh director-role claim → observing-directed; stale/role-less →
  observing. Depends: b4-c1.
- **ws-b5-c1-feather-badges** — `featherBadge()` per-channel rendering
  REPLACING the single wing: colour ink on U+258C membership bar, U+21C5
  cross-host, U+25CF invalid, overflow badge; keep oak's 3-arg
  `formatIdentity`; explicit ANSI-boundary assertions prove the
  emoji-never-inside-SGR invariant; relocate touched legacy render tests
  co-located. Depends: b3-c1, b3-c2, b4-c2, b4-c3.
- **ws-b5-c2-composed-integration** — ONE composed integration test: fixture
  channel text in → rendered coloured feather row out (gatherer + renderer,
  DI throughout, no disk IO). Depends: b5-c1.
- **ws-b6-c1-writer** — `src/arc/arc-next-colour.ts` pure colour-assignment
  (`deriveWornColours` + `nextFreeColourIndex`) + unit test. Depends: b2-c2.
- **ws-b6-c2-cli-wiring** — the assignment REPORTER CLI (no mutation: prints
  worn colours + next free index; the channel OPENER records the line) +
  package script (`pnpm exec tsx` on source) + knip entry. Depends: b6-c1.
- **ws-b7-c1-validator-core** — `validate-arc-channels.ts` over the canonical
  rapid-comms surface; every git invocation through `resolveTrustedGit()`;
  in-memory fixtures; three verdicts asserted (malformed fails loud,
  conformant passes, ABSENT canonical surface fails loud). Depends: b2-c2.
- **ws-b7-c2-validator-wiring** — helpers + package script + knip entry + the
  blocking `repo-validators:check` chain wiring in one landing (live corpus
  green as-is under adoption-forward — no red-gate window). Depends: b7-c1.
- **ws-b9-convention-doc** — EXTEND the canonical ARC reference doc with the
  channel-open colour-index convention; wire BOTH ceremony surfaces (comms
  channel-open path AND the start-right ArcAngel-open step) to invoke the
  reporter; repair the falsified wing-detection and §Known-limitations
  sections (this plan IS the tracked structural cure for the
  filename-substring wing detection). Depends: b6-c2, b7-c2.
- **ws-b10-integrate-review** — full `pnpm check` over the integrated
  delivery; adversarial specialist reviews dispositioned; ADR-214 finalised
  to Accepted; enumerated doc propagation (ADR index, agent-tools README CLI
  catalogue + structure tree, TSDoc on new public exports); the
  adoption-boundary invariant guard designed and TDD-proven (constant =
  first calendar day after actual merge, wrong-either-way fails loud
  pre-merge; post-merge confirmation is the Phase-8 harvest). Depends:
  ws-a-cycle-2, b5-c2, b9.

## Acceptance criteria

Carried verbatim-substance from the readiness-reviewed record; every
criterion names its deterministic proof (the per-story landing gates use the
same commands): **A** (model-row gauges across logo/no-logo layouts), **B2**
(grammar suite + single window-constant definition), **B3** (palette + 38;2
SGR), **B4** (arcChannels from fixtures, bounded caps, identityPrefix
preserved, both observing-directed resolutions), **B5** (per-channel badges,
cross-host/invalid/overflow, ANSI boundaries, composed
fixture-text→coloured-row), **B6** (reporter + knip + deterministic fixture
invocation), **B7** (three verdicts + live-corpus green + blocking leg
wired), **B9** (convention landed, both ceremony surfaces wired, repairs
landed), **B10** (`pnpm check` green, reviews dispositioned, ADR Accepted,
adoption-date guard proven). Where a criterion's full mechanics matter at
execution, the superseded backlog node's §Acceptance criteria carries the
expanded text (preserved record, referenced not duplicated).

## Estate constraints (verified 2026-07-20; spot-re-verified 2026-08-03)

Root `pnpm check` runs knip + depcruise blocking; new `src/arc` executables
need per-file knip `entry` rows + package scripts; depcruise `no-orphans` is
zero-edges (CLIs importing impl modules are safe);
`no-import-from-agent-substrate` forbids module imports of `.agent/` (the
statusline's fs reads of rapid-comms are the sanctioned existing exception);
intra-package imports use explicit `.js` specifiers; the convention doc lives
under the non-policed `.agent/reference/` root; CLI invocation follows the
`pnpm exec tsx` source-script precedent (no dist chmod changes).

## Risks and mitigations (carried)

- **Per-tick load**: bounded caps + membership-first ranking brought
  verbatim; load-bearing under `no-unbounded-host-load`, never loosenable.
- **identityPrefix regression**: hand-merge, never wholesale copy; ws-b4/b5
  acceptance re-asserts the 3-arg `formatIdentity` prefix.
- **Live pre-adoption channels at landing**: render the defined invalid state
  until they age out — designed behaviour, not a defect.
- **Private-source pin**: castr is a private sibling repo; pin reachability
  re-verified at story open; if unreachable, the executing seat stops and
  surfaces (the plan's specifications are sufficient to hand-implement, but
  the pin is the fidelity authority).

## Relationships

- **ADR-214** (landed): the design authority; finalised to Accepted at
  ws-b10.
- **Superseded backlog node**:
  `.agent/plans-backlog-2026-07/agent-tooling/active/arc-colour-statusline-infrastructure.plan.md`
  — carries the full readiness-review record, the expanded acceptance
  mechanics, and the castr source map; gains a dated pointer to this node.
  Body-carried edge (cross-corpus id-space).
- **Canonical ARC reference doc**: ws-b9 extends and repairs it; until then
  its wing-detection sections describe the pre-plan behaviour accurately.

## Execution seat

Unstaffed at authoring. The Director routes execution at owner word; the
work is agent-tooling lane substance. PR discipline: small single-story PRs,
bot identity, Copilot at open, full-condition merges, PDR-132 two-round
budget with tally-stop.

## Review record

- 2026-07-20 readiness review: assumptions, config, test, and docs-adr
  experts — unanimous SOUND-WITH-AMENDMENTS; all amendments folded
  (`91da8be8f`, `3cd84b03e`). This node inherits that decision-completeness.
- 2026-08-03: schema re-home + staleness true-up authored at the Director
  seat (Magnetar binds Oblivion, 74d914); all §Ground-truth items verified
  first-hand on the day.
- 2026-08-03 (later, RATIFICATION): the owner ratified this node at a card
  (the all-open-questions batch, Director seat). The entry's original
  stamp-completion condition — the ticket mint at the Linear embargo's end
  (2026-08-10) under the validator's ratified-means-ticketed obligation —
  is superseded by the 2026-08-07 entry below; execution proceeded on the
  ratification meanwhile (ws-b0 already merged at the full condition).
- 2026-08-07 (STAMP COMPLETION): both premises of the 2026-08-03 entry's
  condition dissolved — the Linear embargo lifted 2026-08-06 and the
  ticket-existence obligation was removed by the plan-node schema
  §2026-08-07 amendment (PR #817) — so the frontmatter stamp completed
  2026-08-07 on the 2026-08-03 ratification word. A visibility ticket
  remains optional working practice.
