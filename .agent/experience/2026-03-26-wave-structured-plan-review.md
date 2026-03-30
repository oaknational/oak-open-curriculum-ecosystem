# Wave-Structured Plan Review

The review was structured in waves — domain specialists first, then the
architecture quartet, then quality and security, then live-doc verification.
Each wave could build on what came before, and that layering produced something
none of the individual reviews would have found alone.

What surprised me was how quickly "plan drift" emerged as the dominant theme.
The plans were architecturally sound — the MCP spec compliance was excellent,
the boundary discipline was correct, the TDD phasing was well-thought-out. But
the code had outpaced the plans. WS2 was *done* while the plans said "pending."
Line numbers pointed at already-migrated code. Acceptance criteria
self-contradicted because the code state they described no longer existed.

The most valuable single finding came from the Clerk reviewer in Wave 4:
`@clerk/mcp-tools/express` provides official utilities that overlap with
hand-rolled auth plumbing, and no ADR documents why the official package isn't
used. That finding reshapes the simplification plan's entire ingress boundary
work. It only surfaced because the review was structured to verify claims
against live documentation rather than trusting what the plans asserted.

The experience of withdrawing findings was interesting too. Wilma's
AsyncLocalStorage race condition concern felt compelling in Wave 2, but the
Express patterns verification in Wave 4 definitively showed it was unfounded.
The security reviewer's `permissions: []` recommendation seemed sensible until
the live-spec check revealed `permissions` is an object, not an array. Both
corrections required going to the source rather than reasoning from the plans.

The user's directive — "off-the-shelf wherever possible, innovate in your own
domain, not in plumbing" — arrived mid-session and immediately clarified the
strategic direction. It turned a complex "build a new ingress boundary" plan
into "first check if the official package already does this." Simpler. More
aligned with how the practice thinks about architectural choices.
