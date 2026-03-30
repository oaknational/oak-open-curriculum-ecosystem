# Source Reading as Investigation

The Phase 0 spike was an evaluation of whether official library utilities could
replace hand-rolled code. The surprise was how much the investigation hinged on
reading the library's bundled JavaScript source — not its documentation, not its
TypeScript declarations, but the actual runtime code.

The documentation said the utilities existed. The type declarations said the
signatures were reasonable. But the source revealed what neither surface exposed:
`mcpAuth` overwrites `req.auth` (destroying Clerk's auth object),
`streamableHttpHandler` assumes a shared server (incompatible with per-request
isolation), and `protectedResourceHandlerClerk` reads `process.env` directly
(violating the DI principle). None of these gaps were documented. All were
visible in fewer than 100 lines of source.

The most satisfying part was the 1-of-6 outcome. The user's principle — "use
off-the-shelf wherever possible" — didn't mean "adopt everything." It meant
"investigate honestly, adopt what fits, explain what doesn't." Five utilities
were SKIP'd with specific, verifiable reasons. One was adopted because it was
genuinely identical. The ADR records both the adoptions and the rejections with
equal rigour, so future contributors won't re-investigate.

The 8-reviewer pass was thorough but produced a clear convergence: four
independent reviewers identified the same dead barrel re-export. That kind of
convergent signal makes the finding feel earned rather than arbitrary.
