---
id: cross-platform-research
node_type: delivery
name: "Cross-platform research — census delta, platform verification, guard design"
overview: >-
  Discharge the cross-platform node's research-first rider in support of the
  live manual Windows work: measure the commissioned census against what
  PR #891 actually found on a real Windows machine, answer the
  platform-verification questions, design the portability guard, and deliver
  first the decision briefs the manual lane needs (.gitattributes, Windows CI
  leg, gate settings for smaller machines).
status: sketch
serves: cross-platform-compatibility
impact_areas:
  - practice-and-estate
tickets:
  - MCP-607
depends_on: []
owner_gates: []
last_updated: 2026-08-17
---

# Cross-platform research — census delta, platform verification, guard design

## Why this node exists

The strategic node
([`cross-platform-compatibility`](../strategic/cross-platform-compatibility.plan.md))
was ratified 2026-08-13 carrying the owner's rider verbatim: "it will need
further research before work on it begins". The owner's 2026-08-17
correction, verbatim: "I intended our Windows work to go in first in order
to support the manual windows work" — the rider is support-sequencing,
never a contribution fence. The manual Windows work (PR #891, the native
estate fix; PR #888, the WSL route) arrived before this research did, which
is to its author's credit. The research therefore reorients around that
fact: its evidence base is the manual work itself, and its first outputs
are the decisions that keep that work unblocked.

## Goal

The remediation plan that follows this node can be authored from evidence
rather than assumption: the commissioned census corrected against reality,
the platform questions answered with version-pinned sources, the guard
designed, and the manual Windows lane supported — not queued behind us —
throughout.

## Evidence corpus

Read before executing any todo:

- The strategic node's §The bet — the 2026-08-13 commissioning survey and
  its four incompatibility classes.
- PR #891 — the one-problem-per-commit series (twelve commits at
  2026-08-17) from a real Windows machine; four cross-platform bugs (a
  no-follow file read silently following symlinks, two never-matching
  path comparisons, a smoke test reporting the silence it guards
  against); a follow-ups list that is itself research input
  (`.gitattributes`, gate settings, Windows CI leg, remaining
  `spawnSync('git')` calls).
- PR #888 — the WSL route: an afternoon, no changes outside the README —
  the route needs no code or tooling changes; toolchain resolution
  learnings (the hooks' pnpm allowlist vs a corepack shim; gitleaks
  install; WSL NAT timeouts; VM memory caps).
- The review rounds on both PRs — the finding classes open as of
  2026-08-17: spawn environment contract propagation, NTFS per-directory
  case sensitivity vs whole-path case folding, and drive-root boundary
  guards. Read the live threads, not this list.
- Estate defects verified 2026-08-17: `.husky/pre-push` line 13 suggests
  `go install github.com/gitleaks/gitleaks/v8@latest`, but the gitleaks
  module declares its path as `github.com/zricethezav/gitleaks/v8` (read
  at source), so the suggested command fails on a clean host; and the main
  README's Install-and-verify section may need a build step before its
  lint command (unverified — todo 2).
- Version-pinned capability facts verified 2026-08-17: turbo 2.10.9 reads
  `TURBO_CONCURRENCY` (bogus value rejected by the flag parser); vitest
  4.1.10 parses `VITEST_MAX_WORKERS` into `maxWorkers`.

## Research questions

1. **Census delta.** The commissioned four classes vs the classes #891
   actually found (trusted-binary resolution, pnpm-as-script spawning,
   owner-only-file proof on NTFS, e2e-tier latent assumptions, and the
   platform-neutral bugs). Name what the survey missed and why — the delta
   calibrates how much unknown-unknown remains before remediation scopes
   itself.
2. **Platform verification.** (a) Is Git for Windows' bundled sh a
   supported hook path or an accident? (b) How do the agent platforms
   shell out on Windows? (c) NTFS semantics that broke assumptions this
   week: per-directory case sensitivity, junctions vs symlinks, Developer
   Mode. (d) Drive-relative path semantics as a security-boundary class —
   `path.isAbsolute('/usr/bin/git')` is true on win32 yet the path
   resolves into user-plantable space (#891's central trap).
3. **Guard design.** What the portability conformance guard checks, where
   it runs, and which generator classes it covers (npm-script POSIX-isms,
   hook invocation shapes, path-semantics traps); its relationship to the
   proven allies (`portability:check`, `validate-lifecycle-scripts`, the
   machine-local-path guard). Design only — the build belongs to the
   remediation plan.
4. **Support-sequencing.** Which decisions unblock the manual lane first:
   `.gitattributes` (line endings bite every Windows contributor at first
   push; the SDK generator's CRLF output shares the root cause), a Windows
   CI leg (without one, native support drifts — #891's own risk register
   says so), and gate settings for smaller machines (capped WSL VMs and
   native alike).

## Acceptance criteria

1. A research report committed under `.agent/research/` answering
   questions 1–4, each claim carrying its evidence and a falsifier.
   Proof: repo-safe.
2. The three decision briefs (question 4) delivered at an owner card, each
   with a recommendation and named trade-offs. Proof: owner-held — card
   answers recorded in this plan's amendment trail.
3. The guard design consumable by a remediation-plan author: checks
   enumerated, generator classes mapped, landing path named. Proof:
   repo-safe.
4. The decision briefs reach the owner card while the manual-lane PRs are
   still open — support delivered during the lane, never after it. Proof:
   owner-held — card timestamps against PR states, recorded in the
   amendment trail.

## Out of scope

- Class-level remediation of the census classes — the rider holds: it
  opens after this research lands and is read. Single verified-defect
  fixes that support the manual lane ship independently
  (`ship-independent-coordinate-dependent`) and are named in the todos.
- The merge disposition of #891 and #888 — the owner's decision.
- WSL documentation — PR #888 owns it.
- Building the guard — design here, build in the remediation plan.

## Todos

Tranche A first — the manual lane's needs; tranche B never blocks it.

1. (A) Ship independently now (verified defect, does not wait for the
   report): fix the `.husky/pre-push` gitleaks install suggestion.
2. (A) Verify or refute the main README Install-and-verify
   build-before-lint claim; fix or record.
3. (A) Decision briefs (question 4) → owner card.
4. (B) Census delta (question 1) over #891's commit set.
5. (B) Platform verification (question 2), sources version-pinned.
6. (B) Guard design (question 3).
7. (B) Research report committed; remediation-plan authoring unblocked.

## Amendment trail

- Born 2026-08-17 (warrant: the owner's resume order — "start with our
  Windows work" — and the strategic node's rider; ticket MCP-607, which
  carries the execution state). Frontmatter status corrected
  `active`→`sketch` the same hour by the survey seat (Nautilus calls
  Plankton): `active` is outside the plan-corpus status enum and was
  failing the shared pre-commit gate; execution state lives in Linear,
  never in the corpus enum.
- Assumptions-expert pass absorbed 2026-08-17 (one blocking, four
  advisory, all cured): todos re-tranched so the decision briefs never
  queue behind census work; open-set phrasing on live counts; the
  #888 claim trued to docs-only; out-of-scope fences class-level
  remediation only; acceptance criterion 4 restated as an observable.
- Tranche A progress 2026-08-17, same seating: todo 1 SHIPPED and MERGED
  as PR #897 (the hook line and CONTRIBUTING's repeat of it — both
  broken-suggestion sites; code-expert approved, mantagen approved,
  merge sha `fa0604aa3`). Todo 2 REFUTED with evidence: turbo's
  `lint` and `test` tasks declare `dependsOn: ["^build"]` (turbo.json),
  so a fresh clone's documented verify sequence builds dependencies at
  its first step — no README change needed; this record answers the
  corresponding Copilot suppressed finding on #888.
