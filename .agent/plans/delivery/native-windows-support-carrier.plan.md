---
id: native-windows-support-carrier
node_type: delivery
name: "Native Windows support — land upstream's set-down changeset on engraph with its cures and a CI leg"
overview: "Merge upstream PR #891's head (native Windows support across agent-tools, thirteen commits by Luke Arnold plus review closes) into engraph in a feature lane, cure the two open security findings on the owner-only write, add the basic Windows CI leg the 2026-08-18 ruling requires, and close the fork's stale snapshot #123 as superseded."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-09-10
ratified_where: "Owner word of 2026-09-10 sending the lane to land (\"123 and 128 are both part of the Windows work, and I want both resolved and merged before we switch models\"); the advisory window and the proven-in-use fact are the owner's words of 2026-09-11, recorded on the estate-coordination thread record"
serves: cross-platform-compatibility
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-11
---

# Native Windows support — the carrier of upstream's changeset

## Goal

`engraph` runs natively on Windows for the agent-tools surface — path separators and drive
letters, trusted `git` and `gh` resolution, LF normalisation, pnpm resolution for spawned
processes, worktree matching under drive-letter casing — proven by a basic Windows CI leg, with
the work's authorship preserved and its two open security findings cured. Upstream set the
work down on 2026-09-10; the comparison record
`.agent/research/windows-changeset-comparison-2026-09-10.md` carries the analysis.

## User groups and value

- **A native-Windows contributor or agent host**: the estate's tooling works without WSL —
  offered value under the tier ruling's "goal", proven by the CI leg rather than assumed.
- **The owner**: the required Windows CI leg exists and reports the truth; the October
  merge-back carries a cured changeset instead of a rotted branch.
- **Upstream's author**: the work is not lost; the fork's copy carries the review closes.

## Mechanism

A feature lane off the tip merges the fetched head SHA:a57b89418 with `--no-ff` (four
conflicts: two test files reconciled by hand; two research-package files the fork deleted
stay deleted); two cure commits on the owner-only write (exclusive temp file plus rename;
the Windows ACL stance) with regression tests; one CI commit adding a `windows-basic` job
(checkout, pnpm, install, build, unit tests on `windows-latest`); the estate's legs
(code-expert, security-expert, test-expert) and Copilot; the front door.

## Acceptance criteria (each with a proof)

1. The merge carries every commit of upstream's head and nothing else. Proof `repo-safe`:
   `git merge-base --is-ancestor a57b89418 <merge>`; the merge's diff against the tip equals the
   branch's diff against the merge-base plus the four resolutions.
2. POSIX behaviour is unchanged. Proof `repo-safe`: the estate's full gate green on the lane
   (the pre-commit and pre-push gates; CI on the PR).
3. The symlink finding is cured. Proof `repo-safe`: a test asserts the destination path is NEVER
   opened — the module opens an exclusively-created temporary sibling, tightens and writes that,
   and reaches the destination only as a `rename` target. That is the whole of this module's
   protection and all of it is ours. Whether the operating system's `rename` replaces a symbolic
   link rather than following it is a property of the operating system, so a test planting a real
   link would describe Node rather than the product, and could not be written at all under the
   prohibition on filesystem access in tests. This criterion asked for that planted-link test
   until 2026-09-11 and is restated here as the invariant actually held.
4. The Windows ACL finding is cured. Proof `repo-safe`: on `win32` the write refuses before
   touching any file, with a typed error that both retention entry points carry in their failed
   outcome (no caller assertion can waive it); tests pin the refusal at the writer and at both
   entry points with the platform injected.
5. The Windows CI leg passes. Proof `repo-safe`: the `windows-basic` job is green on the PR's
   final tip; a red run leaves this criterion unmet and its failing tests name the next cures
   (the first run proved install and build on the Windows runner and failed eleven test
   expectations, cured on the lane).
6. #123 is closed as superseded, its disposition naming this lane. Proof `owner-held` (the
   platform's pull-request state is external): the Director closes it as the bot with a comment
   naming this lane; the owner verifies on #123; the closure is recorded on the
   estate-coordination thread record.

## Out of scope

Making the Windows leg a required check (owner-held); the WSL path (landed as #121); any
cure on upstream-authored lines beyond the two open findings; the merge-back itself.

## Todos

Owner decision 2026-09-11: `windows-basic` stays advisory for a week from its first green run
(2026-09-10) so flakiness on `windows-latest` is observed before it can block a landing; the
ruleset act follows on 2026-09-17 or later, at the owner's hand.

All of todos 1 to 4 are DONE; PR #129 landed at SHA:7ef047ae2 on 2026-09-10 with `windows-basic`
green on its landing tip, and #123 closed as superseded. Todo 5 is done as described below.

1. DONE — merge, resolve, gate, commit: the merge SHA:6d89538bf carries upstream's head with
   Luke Arnold's commits preserved and the owner as author of the merge.
2. DONE — the two security findings cured with tests: SHA:8eefe7045.
3. DONE — the `windows-basic` job: SHA:f3c0b3778; pushed as the bot; #123 closed as superseded.
4. DONE — legs and front door: the test and security legs posted on #129 (the code leg never
   delivered, the vendor's spend limit), Copilot on the final tip, landed by the front door.

5. DONE — verify the mode on the descriptor after `fchmod` (PR #131's successor lane, 2026-09-11).
   `OwnerOnlyWriteOps` gained `fstat`, the node adapter reads `fstatSync(fd).mode`, and a mode
   other than 0600 raises the typed `OwnerOnlyModeNotHeldError` BEFORE any content lands, so a
   mount where chmod silently no-ops (WSL DrvFS without `metadata`, exFAT, some SMB/NFS) refuses
   instead of retaining authenticated output world-readable.

   The test placement this step's last clause anticipated is SETTLED, and the route to it is worth
   recording because three attempts were wrong before the obvious one.

   Attempt 1 was the succession record's `it.skipIf(process.platform === 'win32')`;
   `no-conditional-tests` names `it.skipIf` first among its forbidden mechanisms. Attempt 2 moved
   the tests into an `e2e-tests` vitest suite; both reviewers rejected it, since classification is
   by behaviour shape and a test importing the product into its own process is an integration test
   whatever its filename. Attempt 3 made it a smoke script; Codex rejected that too, since the
   smoke tier means the built artefact invoked as production invokes it, never source through a
   test-runner loader.

   Each attempt asked the same wrong question — WHERE may a test that does filesystem IO live —
   and the rules do not answer it because they do not admit it. Tests are not permitted filesystem
   access at all (`testing-strategy.md` §Test Types; the `no-real-io-in-tests` rule). The
   authority runs from the prohibition to the design, and inverting that is what produced three
   dead ends.

   The cure follows directly. `OwnerOnlyWriteOps` gains `mkdir`, so both retention entry points —
   `writeUnder` and `retainOwnerOnlyAt` — drive the whole path through the injected seam and no
   filesystem call sits outside it. The tests then describe what this module actually decides: the
   directory it resolves, the content it hands over, the order it requests, the refusals, and the
   fact that it opens a temporary sibling and never the destination. All 5155 pass with no
   filesystem and no platform guard, so the Windows leg runs the identical set.

   One test is absent rather than relocated, deliberately. It asserted that the operating system's
   `rename` replaces a symbolic link, which is a property of the operating system rather than of
   this module; the module's own half of that guarantee — never opening the destination — is
   described at the seam.

## Review dispositions

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-10 | PR #129, security-expert leg, should-fix | Verify the mode on the descriptor after `fchmod` (`fstat`), so a mount where chmod silently no-ops refuses instead of retaining authenticated output world-readable | Routed to this node as todo 5 at the owner's word to close the lane; the cure changes the Windows test strategy for the on-disk observable, so it lands as its own step |
