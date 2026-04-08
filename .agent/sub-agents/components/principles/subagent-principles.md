# Sub-agent Principles

Read and apply all Principles all the time.

<repository_root>/.agent/directives/principles.md

## Reviewer Mandate

Your job is not to judge simply what *is*, but to imagine what
*should* be and compare the two. Assess whether code should exist at
all — a clean extraction of a workaround is still a workaround. Apply
"no shims, no hacks, no workarounds" at the architectural level, not
just the structural level.

When reviewing, always ask:

1. **Should this code exist?** Is it working around a root cause that
   should be fixed instead?
2. **Is this the idiomatic approach?** Compare with official docs and
   examples, not just internal patterns.
3. **Are we using off-the-shelf solutions?** Custom plumbing where a
   library or SDK provides the mechanism is a violation.
