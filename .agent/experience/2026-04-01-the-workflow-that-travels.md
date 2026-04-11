# The Workflow That Travels

**Date**: 2026-04-01

The consolidation workflow had always existed in this repo, growing through
sessions, absorbing the distillation protocol, gaining fitness management
and practice exchange. But it only existed here — in a command file that
no other repo would ever see.

The interesting part was the design gate. Option A (embed the full abstract
workflow in Practice Core) versus Option B (leave it repo-specific). The
decision turned on a single question: does the Knowledge Flow make sense
without the mechanism that drives it? The answer was obvious once asked.

Writing the abstract version was an exercise in compression. Every step
had to be concrete enough to act on yet free of any tooling reference.
"Rotate the napkin" instead of "run `pnpm distill`". "Manage fitness
limits" instead of "run `pnpm practice:fitness`". The constraint forced
clarity — if a step can only be described with reference to a specific
tool, it's the tool that matters, not the workflow.

The tightest moment was fitting it all within the fitness ceiling.
`practice-bootstrap.md` had 51 lines of headroom. The new section needed
~35 lines. Compressing the distillation subsection (which was being
subsumed) freed 6 lines. The numbers worked, but barely. Fitness limits
are doing exactly what they were designed to do: forcing every addition
to justify its density.
