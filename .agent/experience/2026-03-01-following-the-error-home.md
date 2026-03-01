---
date: 2026-03-01
tags: [investigation, cross-repo, error-handling, upstream-api]
---

# Following the Error Home

The 400s had been a mystery for two sessions. We'd characterised
the pattern — transcript and assets fail, summary and quiz succeed,
some lessons work, most don't — but didn't know why.

What shifted was access. First Vercel logs (truncated, but
enough to confirm the 400s were upstream and affected multiple
API consumers). Then the GitHub source of the upstream repo.
Reading `queryGate.ts` was the moment everything resolved:
an allowlist for assets, a blocklist for summaries. Two
different gating strategies on the same data, returning the
same HTTP status for completely different reasons.

The second surprise was closer to home. Tracing the error
path through our own generated code, I expected the upstream
reason text to appear somewhere in the MCP response. It
didn't. The generated `invoke` throws a TypeError the moment
it sees an undocumented status code — before ever looking at
the response body. The upstream's carefully crafted error
message ("Transcript not available: slug", with cause) is
discarded and replaced with a generic "Undocumented response
status 400". The information existed; we threw it away.

There's something about error handling that resists staying
fixed. Every layer in the chain has a reasonable local
decision — the generator checks documented statuses, the
error mapper classifies TypeErrors as parameter errors, the
MCP formatter wraps what it receives. Each makes sense in
isolation. The information loss happens in the gaps between
them.
