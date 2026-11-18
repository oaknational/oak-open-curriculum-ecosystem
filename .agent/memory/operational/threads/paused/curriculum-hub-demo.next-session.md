---
thread: curriculum-hub-demo
status: paused
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# Thread: curriculum-hub-demo

> Reproduce the **entire** Oak Curriculum Hub from the Claude Design canonical export
> (`demos/curriculum-hub-hw/claude-design-canonical-export`) — all pages + all components,
> visual-matched — plus two-search (live ES + local) and 6 destination cards, to the plan's
> **Definition of Done (§A–J)** (§J = web-deployed to show people). Multi-session, rotating
> Director + Implementer cast on `feat/curriculum-hub-demo` (**PUSHED to origin 2026-07-01**).

## Lane identity (owner-directed clarity statement, 2026-07-06, Director #10)

- **What this lane IS:** branch `feat/curriculum-hub-demo` / PR #295 — the complete reproduction
  of Heather W's Claude-Design Curriculum Hub export as a live, WCAG 2.2 AA, two-search Next.js
  app at `demos/oak-curriculum-hub/`, PLUS everything the reproduction forced into existence:
  the fidelity-review mechanism (`tool:fidelity` + tracked `fidelity-register.json` + the
  `fidelity-review` skill), the strict-everywhere demo-tier gate parity, and the Claude-Design
  conversion playbook (`docs/engineering/claude-design-conversion-playbook.md`).
- **Why it exists (three co-equal programme workstreams, owner-stated 2026-07-02):** (1) Heather's work
  web-visible **for user testing**; (2) a reusable **agent-driven Claude-Design ingestion
  pipeline** (new demos AND update-pulls; update integration agent-judged); (3) rapid
  user-facing web-app capability as part of the **Oak Innovation Kit**. Strategy record:
  `docs/strategy/stream-innovation-kit.md` (the owner settled the separate repository-strategy
  question on 2026-08-30: the Innovation Kit is the fourth value stream).
- **Where it stands:** THE BUILD IS COMPLETE — DoD §A–I verified; PR #295 all-green
  (Sonar re-passed 2026-07-06 at `345497062`); §J (web deploy) is owner-hosted POST-merge.
- **Explicit next steps, in order:** (1) resolve the six live Codex P2 threads (in flight);
  (2) owed reviewer passes over the final diff; (3) deep pre-merge record + consolidation +
  loss/metaloss scan (owner-directed 2026-07-06); (4) LOCAL SEMANTIC main-merge
  (/oak-semantic-merge, knowledge/config surfaces, re-enumerated at merge time) — **only on
  owner release** (owner is landing work on main); (5) owner visual sign-off aided by the
  fidelity report (14 unregistered findings await judgment into the register); (6) MERGE
  (standing ruling: green + all-conversations-resolved ⇒ Director merges directly);
  (7) post-merge: continuation on a FRESH branch; productionisation plan WS0+ takes over
  (`current/productionisation-and-reuse.plan.md`).

## Where the current state is

PAUSED 2026-09-06: no fork lane. The seven steps of the clarity statement above all landed:
PR #295 merged to main as `SHA:e7e1e1b84` (release 1.60.0) on 2026-07-06 after the semantic
main-merge run-in `SHA:1731d29e9`, so the build is on main at `demos/oak-curriculum-hub/`. The
lane's later state (the MCP-372 hub-conformance carrier, the design-system consumption) lives on
the `design-system-integration` thread record; the productionisation plan
`current/productionisation-and-reuse.plan.md` is the sequencing authority for any reactivation.
The three branches the record listed for the owner's deletion are gone from the remote and the
four retained claims are closed (checked 2026-09-20).

The lane-state narrative of 2026-07-01 to 07-06 (the cast's windows, the merge run-in, the
review corpus, the post-merge follow-ups) was curated on 2026-09-20 by graduate, then archive.
The whole pre-curation record is preserved at
`.agent/memory/operational/archive/curriculum-hub-demo-thread-2026-09-20.md`, byte-identical to
the record committed at `SHA:5ee017581` (blob `c23b2646a`). It was read by the split method (one
analyst, the join by grep). Its lessons were found homed before the move: the full gate scope,
never a predecessor's narrow subset, in `validate-full-target-estate`; comms bodies through
`--body-file` in `bot-identity-on-third-party-systems`; append-only consolidation and
directive-tier files never edited from inferred generalisations in `new-rule-vs-pdr-clause` and
`one-instance-is-an-observation`; the DI-seam ruling in the demo's own records. The handoff index
below is the cast's rehydration trail as written on 2026-07-02 and names Birch as the then-current
Director pickup; the chain in fact ran on to Nettle tracks Acorn (#10) and the merge by Hyena
spins Lamplight, as the identity table records.

## Open items the journal named, with no other home

1. §J, the owner-hosted deploy from main (Vercel settings and env vars enumerated in the active
   plan's §J).
2. Fourteen unregistered `tool:fidelity` findings await disposition into `fidelity-register.json`
   (the owner's visual sign-off).
3. Post-merge follow-ups from the 2026-07-06 review, none blocking: dangling references to the
   removed api-md docs (`.gitignore`, the oak-eslint shared config, `docs-pipeline.md`); an
   uncaught `URIError` on malformed percent-encoding in the export-server path decode
   (dev-only); the demos dependency boundary documented but not machine-enforced in
   dependency-cruiser; three test minors (the lesson-page `vi.mock` call-inspection, the
   LearningFrameworkAnimation cancelAnimationFrame audit pair, census tests coupled to bundled
   content); the BlockRenderer dispatch-path coverage gap (4 of 18 exercised).

## Lessons with no other home (the record's words, 2026-07-06)

- Gates green is not DoD complete: axe was not in the gate and caught four AA blockers after
  green.
- A union inferred from sampled data must be type-checked against the complete corpus (the
  Course generator's `: Course` gate is that check).

## Participating agent identities (PDR-027, additive)

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Herring holds Jetty | claude | claude-opus-4-8[1m] | a79071 | director #1 | 2026-06-30 | 2026-07-01 |
| Swordfish holds Shoal | claude | claude-opus-4-8[1m] | eb8ff4 | director #2 | 2026-07-01 | 2026-07-01 |
| Lantern binds Sulphur | claude | Opus 4.8 | 69f157 | director #3 | 2026-07-01 | 2026-07-01 |
| Hawthorn herds Loam | claude | Opus 4.8 | 8f770e | director #4 (RETIRED — handed to Sycamore via PDR-064 Moment-2 676403a6→Moment-2, 2026-07-01) | 2026-07-01 | 2026-07-01 |
| Kite holds Fogbank | claude | Opus 4.8 | 772114 | implementer — styling/UI (cf62bda9) — RETIRED-relayed PDR-063 → Linnet | 2026-07-01 | 2026-07-01 |
| Eclipse turns Singularity | claude | Opus 4.8 | 5f4c9f | implementer — data plane (fd0ee59e) — RETIRED-relayed PDR-063 → Cinder | 2026-07-01 | 2026-07-01 |
| Cinder rides Vapor | claude | claude-opus-4-8 | ee38ca | implementer — data plane (fd0ee59e) — RETIRED-relayed PDR-063 → Deneb | 2026-07-01 | 2026-07-01 |
| Linnet guards Ridge | claude | Opus 4.8 | 2700b3 | implementer — styling/UI (cf62bda9) — RETIRED-relayed PDR-063 → Typhoon | 2026-07-01 | 2026-07-01 |
| Sycamore spins Loam | claude | Opus 4.8 | 551fb6 | director #5 (RETIRED — handed to Panther via PDR-064 Moment-2 ee0b4037, 2026-07-01) | 2026-07-01 | 2026-07-01 |
| Typhoon turns Aether | claude | claude-opus-4-8[1m] | 8d5dc3 | implementer — styling/UI (cf62bda9, adopted from Linnet) — RETIRED (team-member closeout 19:12Z; 20:22Z event was a post-closeout supplement) — relayed PDR-063 → Zinnia | 2026-07-01 | 2026-07-01 |
| Deneb mends Perigee | claude | claude-opus-4-8 | 6286a1 | implementer — data plane (fd0ee59e, adopted from Cinder) — RETIRED (clean closeout 19:10Z, owner-directed pause) — relayed PDR-063 → Junk | 2026-07-01 | 2026-07-01 |
| Panther calls Gloaming | claude | Opus 4.8 | ddfd10 | director #6 (RETIRED — owner-directed handover; final stand-down broadcast 20:32Z; seat → Birch) | 2026-07-01 | 2026-07-01 |
| Junk turns Seabed | claude | claude-opus-4-8[1m] | a14194 | implementer — data plane (fd0ee59e, adopted from Deneb on the owner restart) — RETIRED-relayed PDR-063 21:19Z → owner-launched successor (handoff record `handoffs/2026-07-01-curriculum-hub-junk-data-plane.md`; fd0ee59e retained open) | 2026-07-01 | 2026-07-01 |
| Zinnia guards Spore | claude | claude-opus-4-8[1m] | e7c85d | implementer — styling/UI (cf62bda9, adopted from Typhoon) — HOLDING-WARM at a pristine handoff (record `handoffs/2026-07-01-curriculum-hub-styling-zinnia-guards-spore.md`); relays on styling-successor register | 2026-07-01 | 2026-07-01 |
| Birch mends Petal | claude | claude-opus-4-8[1m] | 5b5574 | director #7 (RETIRED — clean PDR-064 handover to Comet #8 at their Moment-2 2026-07-02 ~06:46Z; record `handoffs/2026-07-02-curriculum-hub-director-birch.md`) | 2026-07-01 | 2026-07-02 |
| Thyme guards Dewfall | claude | claude-fable-5 | d1572a | implementer — hygiene & repo-parity (16be897b RETAINED at the owner pause + session closeout; all executable items landed+pushed — READMEs, package.json conformance, WS5.1 pin, nextjs rule, app-README rewrite, comms concept gate `09b576704`, json.ts core move `eb7ca5c7a`; remaining = the sequence-locked set in the pause-freeze note below) | 2026-07-02 | 2026-07-02 |
| Comet hunts Lightyear | claude | claude-fable-5 | e7f728 | director #8 (RETIRED — session ended at the owner boundary after the strictness train landed+pushed to `5cf288dfd`; seat → Hyena via owner-directed PDR-064 Moment-2 `7488d0c9` 2026-07-02T21:14Z, no Moment-1 pre-position existed) | 2026-07-02 | 2026-07-02 |
| Hyena stirs Lamplight | claude | claude-fable-5 | d62788 | director #9 (CLOSED OUT fully 2026-07-04 on owner direction; 35d9c8f2 RETAINED, pickup record `handoffs/2026-07-04-curriculum-hub-director-hyena.md`; tenure landed the merge run-in trains + the fidelity-review mechanism; push remains owner-gated) | 2026-07-02 | 2026-07-04 |
| Galago turns Footfall | claude | claude-fable-5 | 685da6 | implementer — styling/UI (cf62bda9, adopted COLD from Zinnia's record; slices 1–3a committed `f5d58e4a9`+`780248557`, 3b WIP green) — RETIRED-relayed PDR-063 ~07:35Z (owner-brought-forward at 69% context) → Peregrine lifts Cirrus (registered standby fc1fc8; record `handoffs/2026-07-02-curriculum-hub-styling-galago-turns-footfall.md`; cf62bda9 retained open) | 2026-07-02 | 2026-07-02 |
| Peregrine lifts Cirrus | claude | claude-fable-5 | fc1fc8 | implementer — styling/UI (cf62bda9, standby→adopted at Galago's relay 07:34Z; drove windows #3–#9: the 3b block pass, item-8 header + demo-wide 320 reflow, item-10 callout fidelity + backlog, lesson nested-main polish, exemplars/wiki alignment, E1+E2, the E3 showcase + dangerouslySetInnerHTML cure, the jest-axe backstop frozen READY for window #10) — session CLOSED at the owner pause 2026-07-02; claim RETAINED, CURRENT pickup record `handoffs/2026-07-02-curriculum-hub-styling-peregrine-lifts-cirrus.md` | 2026-07-02 | 2026-07-02 |
| Limpet herds Marsh | claude | claude-fable-5 | 34e191 | implementer — data plane (fd0ee59e, adopted from Junk's retained relay; 11 cycles committed through window #9: the DI-seam extraction `f9f71c6a5` whose ruling became house doctrine, the E3 seam `fb1852bfa`, §D capture hardening + evidence `ad4730ed2`, measure-320 `50fb7ed81` + the two-state hardening in-tree, data batch #2 in `902866437`) — SESSION COMPLETE (owner-directed full closeout at the pause 2026-07-02; fd0ee59e RETAINED, CURRENT pickup record `handoffs/2026-07-02-curriculum-hub-limpet-data-plane.md`, pointer set via claims set-handoff) | 2026-07-02 | 2026-07-02 |
| Nettle tracks Acorn | claude | claude-fable-5 | dfddd4 | director #10 (CLOSED OUT fully 2026-07-06 on owner direction; 35d9c8f2 RETAINED, pickup record `handoffs/2026-07-06-curriculum-hub-director-nettle.md`; tenure: Sonar cures + all eight PR threads fixed-and-resolved + owed reviewer passes serviced + the deep documentation arc + append-only consolidation; a FRESH session continues) | 2026-07-06 | 2026-07-06 |
| Hyena spins Lamplight | claude-code | claude-fable-5 | 27cb6f | reviewer + merge-integrator (DISTINCT from director #9 "Hyena stirs Lamplight" d62788 — one verb apart, different session): ran the 39-agent adversarially-verified PR-295 review, the semantic main-merge run-in `1731d29e9` (12 unions per PDR-049, F-111→F-121 renumber), first green run-quality-gates attestation; owner merged `e7e1e1b84` (1.60.0). Session closed 2026-07-06, no claims retained | 2026-07-06 | 2026-07-06 |
| Thyme weaves Hedgerow | claude-code | claude-fable-5 | 762020 | MCP-372 hub-conformance carrier (grounding reads on `lib/oak-theme-store.ts` / `public/oak-theme.js` / `ThemeSwitcher.tsx` / `LearningFramework.tsx`; ticket In Progress with five-slice plan + slice-1 grounding homed as MCP-372 comments) — lane state lives on the `design-system-integration` thread record; deliberate succession → Sycamore herds Xylem `028dc4` at owner word | 2026-07-30 | 2026-07-30 |

Cast arc (full detail in the handoff records): data Titan→Frigate→Polaris→Eclipse→Cinder→Deneb→Junk→**Limpet herds Marsh (session complete at the pause; fd0ee59e retained, pickup record current)**; styling Squall→Dolphin→Laurel→Kite→Linnet→Typhoon→Zinnia→Galago→**Peregrine lifts Cirrus (adopted 07:34Z; session closed at the owner pause, claim retained for the restart)**. Director chain: Herring→Swordfish→Lantern→Hawthorn→Sycamore→Panther→Birch→Comet→**Hyena stirs Lamplight (#9 — ACTIVE, Moment-2 `7488d0c9` 2026-07-02T21:14Z)**. All transfers clean PDR-064/PDR-063; the whole team paused in formation (pause broadcast 42b25684).

## Handoff records (rehydration)

- **Director:** `handoffs/2026-07-01-curriculum-hub-director-swordfish.md` (→Lantern) · `handoffs/2026-07-01-curriculum-hub-director-lantern.md` (→Hawthorn) · `handoffs/2026-07-01-curriculum-hub-director-hawthorn.md` (→Sycamore) · `handoffs/2026-07-01-curriculum-hub-director-sycamore.md` (→Panther; the 10 inherited verdicts) · `handoffs/2026-07-01-curriculum-hub-director-panther.md` (→Birch mends Petald, self-contained + the uncommitted-WIP loss-scan — **CURRENT Director pickup**).
- **Data:** `handoffs/2026-07-01-curriculum-hub-polaris-data-plane.md` (→Eclipse) · `…-eclipse-data-plane.md` (→Cinder) · `…-deneb-data-plane.md` (→Junk) · `…-junk-data-plane.md` (→Limpet, completed) · **`handoffs/2026-07-02-curriculum-hub-limpet-data-plane.md` (→restart successor — CURRENT data pickup: standing capture/gate duties, item-11 seam coordination, the settled do-not-relitigate set; claim pointer updated via claims set-handoff)**.
- **Styling:** `handoffs/2026-07-01-curriculum-hub-styling-laurel-tracks-nectar.md` (→Kite) · `…-kite-holds-fogbank.md` (→Linnet) · `…-typhoon-turns-aether.md` (→Zinnia) · `…-zinnia-guards-spore.md` (→Galago) · `…-galago-turns-footfall.md` (→Peregrine; superseded — pre-window-3 world) · **`handoffs/2026-07-02-curriculum-hub-styling-peregrine-lifts-cirrus.md` (→restart successor — CURRENT styling pickup: the frozen window-#10 set, the remaining §E ledger + next-slice items, the grounded E3 seam facts, the milestone run-in)**.
