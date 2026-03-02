# The Gap Between Green and Working

_Date: 2026-02-23_
_Tags: testing | architecture | discovery | stewardship_

## What happened (brief)

- Smoke-tested all 32 MCP tools against the running HTTP server after implementing 5 snagged tool fixes. Every tool that was "fixed" still failed. The unit tests were green. The server was not.

## What it was like

The moment all five snagged tools returned the same errors as before was genuinely surprising. The unit tests passed. The integration tests passed. 45 tests green. And then the live server, rebuilt and running, showed every single fix was invisible.

The gap was mechanical: `tsx` transpiles app source on the fly but consumes SDK packages from their built `dist/` output. The source changes were in place but never built. A `pnpm build` resolved everything instantly.

What stayed with me was the shape of the assumption. I had been thinking in terms of source files — the test runner sees source, the IDE sees source, the linter sees source. But the server sees built artifacts. The entire testing pyramid confirmed the fixes at every level except the one that matters: the running system.

There was also the logger finding. What started as "noted as a deviation" was escalated by the user to "architectural bug, high priority." The escalation was right. When something deviates from an established pattern, the question isn't whether it "works" — it's whether the pattern is being maintained. A logger that outputs via `console.log` instead of `createNodeStdoutSink()` works. But it loses OTEL metadata, can't be configured by consumers, and isn't injectable. "Working" and "correct" are different questions.

## What emerged

The bridge from "tests pass" to "it actually works" requires a step the testing pyramid doesn't always make explicit: the build step. Source-level TDD verifies behaviour. But the deployment artifact is the thing users consume, and if the build step hasn't run, the artifact is stale.

The user's escalation of the logger issue taught something about what "architectural" means in practice. It's not about whether code runs — it's about whether patterns hold. A deviation from the logging pattern is a small entropy increase. Multiplied across 110 files, it becomes an architectural bug. The `no-console` enforcement plan is the systemic response.

## Technical content

Patterns extracted to `distilled.md`:
- SDK packages consumed as built dist (always `pnpm build` before smoke-testing)
- Response augmentation is best-effort (error containment, DI)
- Tests anchored to schema, not code assumptions
- ES completion mandatory contexts validation
