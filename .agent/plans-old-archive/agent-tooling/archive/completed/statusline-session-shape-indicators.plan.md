---
name: "Statusline Enhancements — Oak Mark + Session-Shape Indicators"
overview: "The unified Claude Code statusline lane. Part one — the Oak acorn logo-column mark — has LANDED (see §Landed). Part two adds dense, glanceable session-coordination indicators to the statusline: a Director demark on the identity, a team-shape icon (directed team vs peer team vs solo), and an ArcAngel-active wing — resolved from the claims registry and the ARC experiments directory only (never the comms corpus), enabled by an additive optional role field on the claim schema that also lands the long-pending structural claim-schema cure for singleton roles."
status: "COMPLETE — reconciled on feat/comms-research (2026-06-13). The WS1–WS5 base previously landed on main via PR #203 (merge 00c1f758d, by Flame rides Temper); feat/comms-research then re-fit WS1/WS2/WS3 onto the 4-row Oak-mark layout, completed WS4 glyph terminal verification (all five verified in the owner's terminals — peer swapped 👥→🤝, solo 🧍 added), and added a resolver correctness fix making an unreadable registry resolve to 'unknown' (no icon) rather than a false 'solo'. The reconcile merge (origin/main → feat/comms-research) unified the two lineages, taking best-of-both on the statusline files (branch four-row + main two-line on the logo:'none' path; main's clock-skew ARC guard restored onto branch's resolver). Archived as part of that merge."
todos:
  - id: ws1-claim-role-field
    content: "WS1 (DONE): optional `role` field on the active-claims schema + `--role` on `claims open`; additive, existing readers unaffected. Authored on feat/statusline-enhancements (ac2901fe1), brought onto feat/comms-research this session. Lands the structural claim-schema cure for singleton roles. NOTE: the schema test was renamed from .unit to .integration (it reads the real schema via a fixture)."
    status: completed
  - id: ws2-session-shape-resolver
    content: "WS2: a pure session-shape resolver beside the statusline identity gatherer — inputs: own identity tuple, parsed active-claims.json, experiments-dir listing; outputs { ownRole, teamShape: solo|peer|directed, arcActive }. Fresh-claim filtering via each claim's freshness_seconds; live-peer count = distinct fresh identity tuples; directed = any fresh claim with role director; ARC = experiments/*.md mtime-fresh AND filename contains the agent's name (per the per-pair filename convention). Worktree seats resolve the PRIMARY checkout root via `git worktree list` (first entry) — no machine-local paths. HARD RULE: never read the comms directory (statusline ticks constantly; the 5k-file scan class killed three watchers on 2026-06-11/12)."
    status: completed
    depends_on: [ws1-claim-role-field]
  - id: ws3-render-integration
    content: "WS3 (DONE, re-fit): render the indicators in BOTH layouts. Director demark suffixed to the identity; team-shape icon (directed/peer; nothing when solo); ArcAngel wing while a relevant channel is live. In the 4-row layout the indicators trail the identity on row 0 (`joinPresent([identity, indicators])`); in the `logo:'none'` path they sit on the coordination line of the two-line layout. Authored single-line on feat/statusline-enhancements (4270ea49d), re-fit onto the 4-row layout on feat/comms-research this session; the reconcile merge folded main's #206 two-line layout into the `logo:'none'` path."
    status: completed
    depends_on: [ws2-session-shape-resolver]
  - id: ws4-glyph-verification
    content: "WS4 (DONE): all five glyphs verified rendering in the owner's terminals 2026-06-13 — Director 🧭 U+1F9ED, directed-team 👪 U+1F46A, peer-team 🤝 U+1F91D (replaced 👥 U+1F465, which rendered nowhere), solo 🧍 U+1F9CD, ArcAngel wing 🪶 U+1FAB6. ASCII fallbacks ([D]/[T]/[P]/[S]/[A]) pinned in the statusline-render.ts glyph comment. Client-visibility discipline satisfied: no glyph shipped without rendering evidence."
    status: completed
  - id: ws5-tests
    content: "WS5 (DONE for the landed scope): resolver unit tests over explicit fixture inputs (no global state, no process.env), render tests for every shape combination crossed with logo present vs none (two-line AND 4-row placement), boundary tests for claim freshness including the clock-skew future-mtime guard. 1075+ agent-tools tests green. Continues to ride any future glyph swap from WS4."
    status: completed
isProject: false
---

# Statusline Session-Shape Indicators

**Created**: 2026-06-12 (owner direction in-session: dense glanceable information about the
session's coordination state — directed-team vs peer-team icons, an ArcAngel-active wing,
and a Director demark; exact icons flexible). Feasibility was assessed and the plan shape
ratified in the same exchange; this file records it for pickup.

**Unified 2026-06-13** (owner-directed): the Oak-mark statusline work was folded
into this lane, because the mark and the indicators both render through the same
`renderStatusline` and share the statusline's physical layout — they cannot be
designed independently. See §Landed (what shipped) and §Pickup (what is left and
how to resume cleanly).

## Landed: Oak acorn mark (2026-06-13)

The first half of this lane shipped. The Claude Code statusline now renders the
Oak acorn as a four-row left logo-column, with the identity / model / status /
location segments flowing to its right.

- **Commit**: `40ef58a06` (`feat(agent-tools): tune the statusline Oak mark to a
  4-row braille acorn`) — UNPUSHED, on `feat/comms-research`. The mark landed on
  a different branch from the indicators' `feat/statusline-enhancements`; see
  §Pickup for reconciliation. (Predecessor `4be070c27` added the first 3-row
  version and is already on origin.)
- **Style switch**: `OAK_STATUSLINE_LOGO` selects the mark — `braille-sharp`
  (default, owner-tuned: a sharper lower-left nut-to-cup shoulder + crisper
  sprout), `braille` (plain conversion), `quad` (universal block elements),
  `sextant` (needs the Legacy Computing font block), or `none` (original single
  line).
- **Files**: `agent-tools/src/claude/oak-logo.ts` (new — glyph data + the
  `resolveLogoStyle` resolver), `statusline-render.ts` (logo composition + the
  four-row segment distribution), `statusline-identity.ts` (env-driven style),
  plus `tests/claude/oak-logo.test.ts` and the `statusline-render` test additions.
  The mark is a verified conversion of the acorn SVG; recipe + provenance live in
  `.agent/research/developer-experience/statusline-logos/statusline-logos.md`.
- **Renderer shape**: `renderStatusline(parts, { logo })` is pure; `logo: 'none'`
  reproduces the original single line byte-identically. Segments are built once
  (`buildSegments`), then either joined (single line) or composed against the
  logo rows (`composeWithLogo`). This is the surface the indicators must extend.

## End goal

A glance at any session's statusline answers: *am I in a team, what shape is it, am I (or
is someone) directing, and is a rapid channel live?* — without opening a single
coordination surface. Builds directly on the 2026-06-12 statusline redesign (glance-ordered
segments, context warning colours) landed in the same lane.

## Mechanism

Every desired signal has a cheap repo-file truth source except role, which today lives only
as prose in claim intents — so WS1 makes role structured (additive claim-schema field), and
the resolver then needs exactly two small reads per tick: `active-claims.json` (team shape,
roles, freshness) and the experiments directory listing (ArcAngel liveness via mtime +
participant-bearing filenames). The comms corpus is structurally excluded from the read
path: the statusline ticks constantly and the large-flat-directory scan class has a
documented body count (eight watcher deaths, three sessions, 2026-06-11/12). Glyphs ship
only with terminal-rendering evidence — the same discipline that caught the
structuredContent invisibility.

## Means

The five frontmatter workstreams. WS1 unblocks WS2; WS4 (glyph evidence) and WS2 jointly
unblock WS3; WS5 rides every cycle rather than trailing.

## Prerequisites

- **Blocking**: none external — the statusline redesign this builds on merged via PR #198's
  branch lineage.
- **Beneficial**: the era-pinning identity cure (cleaner identity resolution) — minimum
  shippable without it is unchanged; the resolver consumes whatever tuple the identity CLI
  yields today.

## Acceptance criteria and proof contract

| Id | Acceptance | Proof |
| --- | --- | --- |
| ws1 | `claims open --role director` writes the field; schema validates; existing readers and tests unaffected; start-right claim steps name the flag | unit + schema validation + doc diff |
| ws2 | Resolver returns correct `{ownRole, teamShape, arcActive}` for fixture matrices (solo / peer / directed; stale vs fresh claims; arc file present-fresh / present-stale / absent; worktree-seat primary-root resolution) | unit |
| ws3 | Rendered statusline shows the indicators in BOTH layouts — single-line (second segment) and 4-row (trailing the identity on row 0) — for every shape combination; absent segments drop cleanly | unit (render) — DONE |
| ws4 | A recorded rendering matrix for ≥3 terminals over the candidate set, with the shipped set + fallbacks pinned in the source comments | non-code: matrix in the cycle's commit body + source comment |
| ws5 | Full agent-tools suite green at every commit; no skipped/conditional tests | unit suite |

## Non-goals

- No comms-corpus reads, ever, from the statusline path (performance class, named above).
- No new liveness machinery — claim freshness is the proxy; PDR-078 heartbeat precision is
  out of scope for a glance surface.
- No role enforcement — the role field is honest-by-convention, the same trust model as
  every other claim field.
- No cross-platform statusline (Claude Code only; Cursor/Codex equivalents are future
  owner-directed work).

## Risks

- **Stale-claim windows** mis-shape the icon for up to `freshness_seconds` — acceptable for
  a glance surface; one docstring sentence records it.
- **ZWJ glyph fragmentation** — cured structurally by WS4's evidence gate and the ASCII
  fallback set.
- **ARC mtime approximation** — a conserve-at-close copy can refresh mtimes; filtered by
  participant-name-in-filename, and a false wing for a few minutes is harmless.
- **Worktree primary-root derivation** — `git worktree list` ordering is the contract;
  WS2's fixtures pin it.

## Foundation alignment

`principles.md` simplicity-first (two small reads, no daemon, no cache layer until evidence
demands one); `testing-strategy.md` (pure resolver + render functions, fixture-driven, no
global state); no-machine-local-paths (primary-root derived, never written);
plan-body first-principles check fires at WS3 (do WS4's rendering facts still hold for the
terminals in actual use?). Lifecycle per `templates/components/lifecycle-triggers.md`;
completion archives this plan with the glyph matrix mined into the statusline source docs.

## Pickup for the next session

WS1–WS3 are done and the 4-row re-fit landed on `feat/comms-research` (Skylark
wakes Summit, 2026-06-13). The reconcile-the-branches and re-fit steps that used
to live here are complete: the indicators were brought onto `feat/comms-research`
(where the pushed Oak mark already lives) and re-fit into the 4-row layout, so a
single branch now owns `renderStatusline`. The old WS1 sdk-codegen "blocker" was
mis-attributed (the role-field commit touches no sdk/keywords files).

Remaining, in order:

1. **WS4 glyph terminal verification (owner gate).** Run the built statusline in
   the owner's iTerm2 / Terminal.app / VS Code across the shape combinations (the
   re-fit commit body carries the render-evidence sample). Swap any glyph that
   tofus to its pinned ASCII fallback (`[D]`/`[T]`/`[P]`/`[A]`, in the
   `statusline-render.ts` glyph comment). Tofu risk: `ARC_WING` (U+1FAB6) and the
   family emoji. Record the terminals checked in the swap commit.
2. **Push** the re-fit commit (coordinate the window if the comms-research lane is
   still active on the shared branch).
3. **Open / refresh the PR** for the unified lane.
