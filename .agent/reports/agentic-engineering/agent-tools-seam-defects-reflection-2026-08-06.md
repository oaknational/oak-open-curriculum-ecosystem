# The seam-defect reflection — PR #790's foundational lesson (2026-08-06)

Owner-commissioned ("the tooling problems discovered in 790 are
foundational. Stop everything else and reflect on the nature and source
of the issues") and owner-ratified the same hour ("Your findings are
correct and we should follow them"). This record conserves the
reflection verbatim in substance and routes its cures.

## The defect corpus

PR #790 (MCP-508 slices 1+1.5: `merge-bot merge` + `merge-bot push`)
carried, across two Copilot rounds, eight second-round findings — two
visible threads and six suppressed low-confidence findings, every one
of which reproduced as real. Three were cured in-lane before the seat
closed (readable-5xx→UNKNOWN, schema-invalid-200→UNKNOWN, push token
off the environment into a 0600 tempfile). Five remained at the tip
(`SHA:69be3844b`), with mechanical reproduction traces in the
disposition record: the first-poll deadline bypass; the unclosed
askpass fallback; the bare-URL remote degrading the pre-push scan to a
5,009-commit superset; the spawnSync 1 MiB buffer against a measured
1,852,962-byte green-run gate output (the hard blocker — the push
command could not complete a normal push); and a hand-rolled ref
grammar admitting four shapes `git check-ref-format` rejects.

## The nature: every defect is a seam defect

Not one of the eight is a logic error inside the code's own model. Each
is the code's MODEL of an adjacent system diverging from that system's
reality: git's credential-resolution chain has fallbacks the env-scrub
never enumerated; git owns a ref grammar and the code re-derived a
lookalike regex; the pre-push hook has a real output volume no one held
as a fact; GitHub's post-PUT semantics include "the gateway failed
after the upstream succeeded"; the hook's remote-name parameter had a
meaning a bare URL silently broke. The defects live exactly where our
code touches systems we did not author.

## Why seven examination instruments missed them

The PR was examined more than anything the estate has built:
pre-execution Opus review, TDD with mutation proofs, three expert
reviews, an owner simplification pass, Cricket 8-0, two Copilot rounds
— and 4,126 green tests coexisted with a push command that cannot
push. The reason is structural: THE TESTS AND THE CODE SHARE ONE AUTHOR
AND ONE MODEL, so the tests certify the model, not the world. This is
the oracle-independence finding from the capability-floor debate ("the
witness can certify its own shared mistake") appearing in the tooling
estate the same day the doctrine cured it in the design estate. Every
instrument run was static or simulated; the only instrument that could
see the divergence was execution against reality — and the one time it
ran (the reproduction round), it found the blocker in minutes.

## The source, traced

1. **agent-tools crossed from scripts to infrastructure without
   acquiring infrastructure's verification ladder.** The MCP app has a
   field-use register (deploys, preview-serves, healthz, browser
   tests); the tooling estate had simulation only, because tooling
   "isn't deployed" — except its production is our own machines and its
   downtime is the fleet's throughput.
2. **The closed-set discipline was not applied to external
   contracts.** The credential chain, the ref grammar, the buffer limit
   — each had an owning oracle available and each got a partial hand
   model instead (the query-the-value pattern, in contract form).
3. **Review-round economics priced out the one cheap check.** Rounds
   were the scarce resource (a correct owner call), so the lane
   optimized for review economy; nothing in that economy priced a
   live-fire run, which costs minutes and consumes no round.
4. **Doctrine and practice are not yet one substrate.** The estate
   ratified the cure for this exact failure class in the morning
   (v2's defeaters, oracle independence, the external sensor) and the
   adjacent lane shipped the violation by lunchtime. A lesson landing
   in a design record does not bind the engineering lane next door —
   even the same day, even with the same Director watching both. The
   last line of defense that caught it all was the owner's curiosity
   (one question about suppressed findings) — a structure-over-
   vigilance estate found its most load-bearing component was
   vigilance, and it was the owner's.

## The ratified cures and their routes

1. **Live-fire acceptance legs** for every front-door agent-tools
   command — the command proves itself against the real repo at
   landing; the tooling twin of the floor's domestic-renewal-in-CI.
   Route: requirement R8 in
   [`docs/engineering/agent-tools-operational-requirements.md`](../../../docs/engineering/agent-tools-operational-requirements.md);
   binds the S1–S5 cure round and every future command.
2. **External-contract closure** — where an adjacent system owns an
   oracle, query it or enumerate its whole set in a reviewable table;
   never a hand-derived lookalike. Route: requirement R9, same home.
3. **A doctrine-propagation step** — when a lesson lands anywhere, a
   named step asks WHICH LIVE LANES DOES THIS BIND TODAY. Route: open
   practice question (new-rule-vs-pdr-clause decision owed); pointer
   held here, not co-designed.

The owner additionally commissioned performance, bandwidth, and latency
requirements for agent tools the same hour — authored as the
requirements document above, grounded in this corpus's measured
evidence.
