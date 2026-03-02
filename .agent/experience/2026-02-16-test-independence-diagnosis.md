# Two symptoms, one cause

**Date**: 2026-02-16  
**Tags**: testing, diagnosis, MCP, transport

17 E2E tests were failing across 6 files. The initial analysis categorised them into two groups: "HTTP 500 errors" (10 tests) and "SSE parsing failures" (7 tests). Two different root causes were hypothesised — missing environment configuration, and SSE transport reconnection issues.

What actually happened was simpler. One reproduction script — three requests to the same Express app, checking status codes — showed the pattern immediately. First request: 200. Second request: 500. Third request to a fresh app: 200.

The MCP `StreamableHTTPServerTransport` serves one client per instance. The tests were sharing app instances through `beforeAll`. The first test consumed the transport; every subsequent test got a 500 that manifested differently depending on what the test was checking.

The interesting part was how readily the "two separate issues" framing took hold before any reproduction. The symptoms genuinely looked different — different HTTP status codes, different error messages, different test files. The categorisation felt productive. But it was wrong. The reproduction took less time than the categorisation did.

The fix was mechanical once the cause was clear. Each test gets its own app. The principle is older than MCP: tests must be independent and idempotent.
