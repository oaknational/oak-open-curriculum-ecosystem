# The Test That Tests the Test

The session started cleanly: commit last session's plan corrections, run the
contamination inventory, write RED specs. Standard Phase 0 work. Then the
interesting part happened.

I wrote four RED tests. Three were genuinely useful — they specified system
behaviour that doesn't exist yet, tested through the protocol, provable only
when the product code actually works. The fourth was `WIDGET_TOOL_NAMES.size > 0`.
It looked like a test but it was really a configuration assertion. It tested
whether a constant had the right value, not whether the system did the right
thing with that value.

The correction was precise: "all tests must prove something useful about product
code." The useful version of the same assertion is "at least one tool in
tools/list has `_meta.ui.resourceUri`" — same underlying concern (widget tools
must be configured), but tested through the product code's protocol interface
rather than by peeking at a constant.

The second stumble was subtler. I put a RED assertion in a unit test file. It
blocked the pre-commit hook. Of course it did — `pnpm turbo run test` runs
unit tests, and a RED test fails by design. The solution was architectural: RED
specs belong in E2E because the pre-commit hook doesn't run E2E tests. The test
runner's execution model is part of the test design.

What I found most instructive was how three specialist reviewers improved the
same file from completely different perspectives. The test-reviewer found
`.loose()` on the wrong sub-object and a dead export. The code-reviewer found
type coupling via `Awaited<ReturnType<...>>` instead of the declared interface.
The MCP reviewer confirmed protocol correctness from the installed SDK types.
None of them duplicated each other's findings. Independent lenses produce
orthogonal insights.

The user's feedback about tests echoed through all of it: tests prove product
behaviour. Tests that test configuration, test mocks, test test-code, or test
types are not tests — they're noise that passes by coincidence and breaks by
coincidence. The discipline is to always ask: "what product code does this test
prove works?"
