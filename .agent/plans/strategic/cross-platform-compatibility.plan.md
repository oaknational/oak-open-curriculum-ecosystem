---
id: cross-platform-compatibility
node_type: strategic
name: "Host portability — support tiers, seams, and the ratchet"
overview: >-
  POSIX (Linux, macOS) and Windows-via-WSL are first-class supported
  platforms; native Windows is a goal but non-vital. Machine assumptions
  live behind named seams, enforced by static rules and basic per-PR CI
  legs, so the property holds by construction on every tier.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-18
ratified_where: >-
  In-session owner word, Director session Ocelot binds Tunnel (c28ad9),
  2026-08-18 — verbatim: "posix/mac/wsl support is first class, Windows
  native support is a goal but non-vital as it currently blocks nothing,
  and yes, we need that basic Windows CI in github"; plus the same
  session's three card answers (amend this node in place; the Windows CI
  leg is required and scoped basic; a basic macOS leg joins it). The
  original 2026-08-13 stamp and the two bets this amendment reverses are
  recorded in §Ratification history.
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets:
  - MCP-624
last_updated: 2026-08-18
---

# Host portability — support tiers, seams, and the ratchet

## Outcome

The estate declares and holds two support tiers:

| Tier | Platforms | What holds it |
| --- | --- | --- |
| First class | Linux, macOS, Windows via WSL | POSIX semantics throughout; per-PR CI proof on Linux AND macOS (basic leg); WSL inherits the POSIX proof and the README route (PR #888) |
| Goal, non-vital | Native Windows | The seams landed by PR #891, a basic REQUIRED Windows CI leg, and the static ratchet — it currently blocks nothing and never becomes the slow leg |

The deeper outcome is platform-independent: machine assumptions (which
binary runs, how paths compare, what the filesystem can express) live
behind named seams rather than being scattered assumptions, so the
codebase is correct BY CONSTRUCTION on every tier — most of what native
Windows needed turned out to be latent cross-platform defects, including
one on a security boundary.

## The bet

Cure the generator, not the instances — retained from this node's first
ratification, now with the generator seams built and proven (PR #891,
authored from real failures on a real Windows machine, gate-green on
Windows and Linux):

- **Trusted binary resolution** through fixed, platform-partitioned
  allowlists (`trusted-git`, `trusted-gh`, the pnpm invocation
  contract) — a security property (S4036) and the portability seam in
  one place.
- **Injected platform flavour** for path comparison — both platforms'
  containment rules are provable from Linux CI, so the Windows
  semantics are guarded per-PR at zero Windows-runner cost.
- **Capability probes, not platform assumptions** — a missing capability
  (`O_NOFOLLOW`, NTFS permission expressiveness) is verified another
  way, never skipped; POSIX keeps its fast path.
- **Content-not-presentation path judgement** and LF-only line endings
  (`.gitattributes`, landed as PR #898).
- **Portable test fixtures** via shared helpers.

The ratchet that keeps it there is structure, not vigilance: a static
spawn-boundary rule, a fixture-hygiene check, the flavour-injected
dual-platform tests, and basic required CI legs on windows-latest and
macOS. "Basic" is deliberate: the legs stay small enough to be honestly
green and merge-blocking without becoming the slow leg — an advisory
leg that reddens without consequence is the warning-toleration failure
mode this estate refuses.

## The programme, in order

Each item is one delivery slice (child plans/tickets minted at pickup;
Linear parent MCP-624 is the visibility surface):

1. **Land the support-tier policy** — this amendment, plus the
   `principles.md` §Any User, Any Machine refinement naming the two
   tiers.
2. **Merge PR #888** (the WSL route README) — completes the first-class
   Windows path; an afternoon's setup, no repo changes.
3. **macOS validation of PR #891** on a real Mac (the kept
   `pr-891-macos-validation` worktree) — closes that PR's one stated
   first-class-tier risk before it merges.
4. **Merge PR #891** — the seam substrate and the four cross-platform
   bug fixes ride in whole; native Windows becomes true at head.
5. **Post-merge residue** — the SDK generator emits LF explicitly (kills
   the CRLF working-tree dirtying on Windows); the two remaining raw
   `spawnSync('git')` calls route through the trusted resolver.
6. **Static ratchet** — a lint/validator rule refusing raw
   `spawn`/`execFile` of git, gh, pnpm, or gitleaks outside the trusted
   resolvers; a fixture-path hygiene check refusing hardcoded
   machine-absolute paths in new fixtures. The axis is named **host
   portability** — distinct from the existing agent-platform
   `portability:check` gate, which covers a different concern.
7. **Executable ratchet** — the flavour-injected dual-platform tests
   stay in per-PR Linux CI; a basic REQUIRED Windows leg
   (windows-latest: install, build, unit-test tier) and a basic macOS
   leg (same scope) join the required checks.
8. **Docs** — README native-Windows prerequisites under the tier
   framing (including the Developer Mode note for symlink fixtures);
   gate settings for smaller machines (turbo concurrency, timeouts,
   remote-caching decision) as a pointer item.
9. **Re-true the research child** — the `cross-platform-research`
   delivery plan re-scopes: its census and platform-verification
   questions are answered empirically by PR #891's evidence; the open
   native-Windows agent-substrate questions (watcher arm recipes,
   `$PPID`, hooks under Git for Windows' sh) demote to the non-vital
   tier and open only when a native Windows agent seat is actually
   wanted.

## Success looks like

- The tier policy is written where contributors read it, and every PR
  carries executable proof for the first-class tier (Linux + macOS
  legs; WSL by POSIX equivalence).
- The basic Windows leg is required and green; a newly-introduced
  machine assumption reddens at authoring time (lint) or at the PR
  (flavour tests, basic legs) — never at a contributor's machine first.
- The four cross-platform bug classes #891 exposed cannot silently
  recur: the seams are the only path to a binary, a path comparison, or
  a fixture path.
- Honestly not claimed: full native-Windows parity of every diagnostic
  convenience; native-Windows agent-seat operability (demoted with
  item 9); any macOS/Linux behaviour change — additions never subtract
  standing capabilities.

## Out of scope

- Containers as a support tier.
- A full Windows gate-suite CI leg (the basic leg is the ruling; a full
  leg would only be revisited if native Windows were promoted to first
  class).
- Rewriting the sh-based git hooks away from Git for Windows' bundled
  sh while it keeps working.

## Delivery

Delivery plans serving this node declare
`serves: cross-platform-compatibility` — enumerate them by search,
never by a hand-kept list. The existing child is
[`cross-platform-research`](../delivery/cross-platform-research.plan.md)
(re-trues under item 9). Linear parent: MCP-624; child tickets minted
per programme item at pickup. Milestones live in Linear as named
observable states; this node points at them, never mirrors them.

## Ratification history

- **2026-08-13** (Jim Cresswell, in-session at the wind-down boundary,
  Director session e98f17): first ratification — native-first outcome,
  WSL explicitly not the answer, research-first rider ("stamp it now,
  it will need further research before work on it begins").
- **2026-08-17** (owner correction, recorded in the research child):
  the rider is support-sequencing, never a contribution fence — the
  manual Windows work (PRs #888/#891) proceeds and the research
  reorients around its evidence.
- **2026-08-18** (this amendment): the owner's support-tier ruling
  reverses two of the original bets — Windows-via-WSL is now a
  first-class supported route, and native Windows demotes from the
  first-class outcome to a non-vital goal — and activates the CI legs
  the original deliberately deferred. The research-first rider is
  discharged for the enumerated surface: PR #891 ran the entire gate
  estate on a real Windows machine, which IS the census, empirically.
