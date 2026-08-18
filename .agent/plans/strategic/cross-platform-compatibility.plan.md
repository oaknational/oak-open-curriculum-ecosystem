---
id: cross-platform-compatibility
node_type: strategic
name: "Cross-platform compatibility — the estate works on Windows"
overview: >-
  Any user or agent on any operating system — Windows first among the
  currently-unserved — can clone, install, build, test, contribute to, and
  operate this repository without a POSIX environment.
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-13
ratified_where: >-
  In-session owner word at the wind-down boundary, Director session Smith
  hunts Obsidian (e98f17), 2026-08-13 evening — verbatim: "stamp it now, it
  will need further research before work on it begins"; the rider is
  binding and carried in §Delivery.
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-08-13
---

# Cross-platform compatibility — the estate works on Windows

## Outcome

A contributor or agent seat on Windows has the same first-class experience
the estate already promises for any user on any machine (`principles.md`
§Any User, Any Machine): clone → install → build → gates → tests → commit →
push all work; the agent tooling, hooks, and collaboration substrate
operate; nothing load-bearing assumes a POSIX shell, POSIX userland tools,
or Unix-only path semantics.

## The bet

The estate's portability principle is already doctrine, but its enforcement
grew up on macOS/Linux and encodes POSIX assumptions in a thin, enumerable
layer — not in the architecture. The 2026-08-13 commissioning survey found
the incompatibilities concentrated in four classes, all mechanical:

1. **Inline environment-variable prefixes in npm scripts**
   (`SDK_CODEGEN_MODE=online turbo …`, `LOG_LEVEL=debug node …`) — POSIX
   shell syntax that fails under `cmd.exe`.
2. **POSIX userland in scripts** — `rm -rf` in the root clean script and
   repeated across workspace `clean` scripts; `for …; do` loops and
   `bash -n`/`sh -n` in `lint:shell:syntax`.
3. **Hook invocation shapes** — Claude hooks invoked as bare `.mjs`
   (shebang-dependent) or via `.sh` wrappers and `${VAR:-default}`
   parameter expansion; the husky hook family is `#!/usr/bin/env sh`
   (served on Windows by Git's own sh — an ally, but currently unverified
   as a supported path rather than an accident).
4. **POSIX-assuming operational recipes** in agent rules and skills
   (watcher arm blocks using `$PPID`, `command -v timeout`, `exec`) — the
   agent-practice surfaces that make a seat operable.

The bet: cure the generator, not the instances — a portability conformance
guard (the same shape as the existing `portability:check`,
`validate-lifecycle-scripts`, and machine-local-path guards, which are this
outcome's proven allies) that makes a new POSIX-ism observable at
authoring time, plus a one-time remediation of the enumerated classes,
buys Windows support durably instead of as a sweep that rots. We are
deliberately NOT betting on: containers/WSL as the answer (that serves
users who already have a POSIX environment — the outcome is native
first-class support); rewriting the sh-based git hooks away from Git for
Windows' bundled sh if verification proves that path supported; or
cross-platform CI runners before the local developer path works.

## Success looks like

- A cold Windows machine (no WSL, no git-bash-as-shell assumption beyond
  what Git for Windows itself installs) completes the README quick start
  and `pnpm check` — the works-for-any-machine lens run for real, and
  re-run in CI on a Windows runner once the local path holds.
- An agent session on Windows completes the start-right ceremony: identity
  preflight, watcher arm, heartbeat, claims, commit — the collaboration
  substrate's shell recipes have Windows-true forms or platform-neutral
  replacements.
- A guard reddens on newly-introduced POSIX-only constructs in
  package.json scripts and hook definitions, so the property holds without
  vigilance.
- Honestly not claimed: platform parity of every diagnostic convenience
  (e.g. the shell-script linting of sh files may legitimately run only
  where sh exists), and no claim about macOS/Linux behaviour changing at
  all — additions never subtract standing capabilities.

## Delivery

**Ratification rider (owner, 2026-08-13, verbatim): "it will need further
research before work on it begins."** The first delivery plan serving this
node is therefore a RESEARCH plan — the full census of the four classes,
the platform-verification questions (is Git for Windows' sh a supported
hook path; how do the agent platforms shell out on Windows), and the guard
design. No remediation work opens before that research lands and is read.

Delivery plans serving this node declare `serves:
cross-platform-compatibility` — enumerate them by search, never by a
hand-kept list. The commissioning survey (2026-08-13, this node's §The
bet) is the research plan's evidence seed. Milestones live in Linear as
named observable states; this node points at them, never mirrors them.
