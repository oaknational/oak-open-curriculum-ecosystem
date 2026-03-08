# Implement Widget Playwright Tests

## Task

Implement the plan at `.agent/plans/sdk-and-mcp-enhancements/07-widget-playwright-tests-plan.md` to add Playwright tests for the ChatGPT widget.

## Context

The Oak Curriculum MCP server includes a ChatGPT widget (`apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`) that renders tool output in ChatGPT's UI. The widget reads data from `window.openai.toolOutput` and listens for `openai:set_globals` events.

Currently there are no automated tests for the widget rendering logic. This task adds Playwright tests that:

1. Serve the widget HTML via a test Express server
2. Inject mock `window.openai` data using Playwright's `addInitScript`
3. Verify the widget renders correctly for different output types

## Pre-requisites

Before starting, read these files to understand the context:

1. `.agent/directives/principles.md` - Development rules (TDD, type safety, etc.)
2. `.agent/directives/testing-strategy.md` - Testing approach
3. `.agent/plans/sdk-and-mcp-enhancements/07-widget-playwright-tests-plan.md` - The detailed implementation plan
4. `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` - The widget being tested
5. `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts` - Existing Playwright config
6. `apps/oak-curriculum-mcp-streamable-http/tests/visual/landing-page.spec.ts` - Example of existing Playwright tests

## Implementation Steps

Follow the plan exactly. Create these files in order:

1. `apps/oak-curriculum-mcp-streamable-http/tests/widget/fixtures.ts`
2. `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-test-server.ts`
3. `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts`
4. `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-accessibility.spec.ts`
5. Update `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts`
6. Update `turbo.json` if needed (add `tests/**/*.ts` to `test:ui` inputs)

## Verification

After implementation:

1. Run `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui` - all tests should pass
2. Run `pnpm type-check` - no type errors
3. Run `pnpm lint` - no lint errors
4. Commit with message: `test(widget): add Playwright tests for ChatGPT widget rendering`

## Key Points

- The `test:ui` script already exists and is wired to `test:all` - no new scripts needed
- Use `page.addInitScript()` to inject mock `window.openai` before the widget loads
- The widget test server should use port 0 (random available port) for isolation
- Tests should cover: help output, search results, generic JSON, empty state, async events
- Include accessibility tests using `@axe-core/playwright`

## Quality Gates

All quality gates must pass before committing:

- `pnpm type-check`
- `pnpm lint`
- `pnpm test:ui`
