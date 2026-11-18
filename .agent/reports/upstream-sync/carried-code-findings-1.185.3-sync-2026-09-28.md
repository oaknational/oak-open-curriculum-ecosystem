# Findings ledger: the 1.185.2 → 1.185.3 sync (carrier #284, 2026-09-28)

**Review contract.** The same as the 1.185.0 ledger's: every issue found while integrating the Oak
line's main `9772f3385` (release 1.185.3) into `engraph`, from any source. Owner's word
(2026-09-19): an issue that does not block the merge is recorded here and fixed in a separate pull
request; owner's ruling (2026-09-20, "Cure here only what misleads operators"): quality cures of
code the Oak line authored are held for that line and arrive here through a later carrier.

## A. Code authored on the Oak line (held for that line)

**A1 — a test that reads the committed tree.**
`agent-tools/tests/skills/plugin-listing-invariants.integration.test.ts` (added by `416f26424`,
MCP-760) reads committed files through `agent-tools/src/collaboration-state/test-helpers/repo-doc.ts`
(`readRepoDocument`, `readRepoBytes`, `listRepoDirectory`: real filesystem reads). This line's
`.agent/directives/testing-strategy.md` §Rules refuses it: "Tests never, under any circumstances,
use or create IO"; a committed-tree check belongs to a validator or an injected seam. Found by this
seat's reading at step 6 and by Copilot on #284 (thread 4123811116). It does not block the merge
(the suite runs green) and does not mislead operators, so it is held. It joins the known class of
tests reading committed files through that helper.

## B. This line's sync machinery

None found. The carrier workflow's receipt was accurate at its time; the mirror was at the upstream
tip at pickup; the generators changed nothing on the merged tree.

## Addendum, 2026-10-27 — the 1.186.1 sync removes the test

A1's subject, `agent-tools/tests/skills/plugin-listing-invariants.integration.test.ts`, left both
lines' trees when upstream moved the plugins to oaknational/oak-ai-plugins (MCP-775, 2026-10-21;
release 1.186.1); its last version is at release v1.186.0, and the plugin tests were ported to that
repository's CI (ADR-125's 2026-10-21 amendment). Nothing of A1 remains to cure here. The helper it
read through, `test-helpers/repo-doc.ts`, keeps `readRepoDocument` alone (`readRepoBytes` and
`listRepoDirectory` went with their one consumer); the class A1 named persists in that function's two
remaining test readers.
