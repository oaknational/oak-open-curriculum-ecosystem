---
fitness_line_target: 190
fitness_line_limit: 260
fitness_char_limit: 16000
fitness_line_length: 100
split_strategy: 'Split recipes by test level if this grows'
---

# Testing TDD Recipes

This is the worked-example companion to
[Testing Strategy](../../.agent/directives/testing-strategy.md). The strategy
is the authoritative doctrine; this file shows how to apply the doctrine at
unit, integration, and E2E levels.

## TDD At All Levels

TDD applies to unit, integration, and E2E tests. Each level specifies the
desired behaviour before implementation changes at that same level.

### Unit Test TDD

Cycle: Red, Green, Refactor.

1. Red: write a unit test for a pure function that does not exist yet. Run it;
   it must fail.
2. Green: write the minimal implementation. Run the test; it must pass.
3. Refactor: improve the implementation without changing behaviour. The test
   stays green.

Example:

```typescript
// 1. Red: write the test first.
describe('calculateTotal', () => {
  it('sums array of numbers', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
// Run test -> fails because calculateTotal does not exist.

// 2. Green: minimal implementation.
function calculateTotal(numbers: number[]): number {
  return numbers.reduce((sum, n) => sum + n, 0);
}
// Run test -> passes.

// 3. Refactor if needed; the test stays green.
```

### Integration Test TDD

Cycle: Red, Green, Refactor.

1. Red: write an integration test specifying how code units work together. Run
   it; it must fail.
2. Green: implement the units and wiring. Run it; it must pass.
3. Refactor: improve integration without changing behaviour.

Example:

```typescript
// 1. Red: write the integration test first.
describe('createSearchWorkflow', () => {
  it('returns normalised lesson slugs from the retriever', async () => {
    const retrieveLessons = async () => [{ lesson_slug: 'solving-linear-equations' }];
    const workflow = createSearchWorkflow({ retrieveLessons });

    const slugs = await workflow.searchLessons('linear equations');

    expect(slugs).toEqual(['solving-linear-equations']);
  });
});
// Run test -> fails because createSearchWorkflow does not exist.

// 2. Green: implement the integration point.
export function createSearchWorkflow(options: SearchWorkflowOptions) {
  return {
    async searchLessons(query: string): Promise<readonly string[]> {
      const lessons = await options.retrieveLessons(query);
      return lessons.map((lesson) => lesson.lesson_slug);
    },
  };
}
// Run test -> passes.
```

### E2E Test TDD

E2E tests specify system behaviour. When system behaviour changes, update the
E2E test first and run it against the old system to prove the red phase.

Example:

```typescript
// Scenario: all MCP methods should require auth.
describe('MCP Server E2E', () => {
  it('returns 401 for tools/list without authentication', async () => {
    const response = await request(server).post('/mcp').send({ method: 'tools/list' });

    expect(response.status).toBe(401);
  });

  it('returns 401 for tools/call without authentication', async () => {
    const response = await request(server)
      .post('/mcp')
      .send({
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

    expect(response.status).toBe(401);
  });
});
// Run E2E test -> fails while the old system allows unauthenticated discovery.
// Implement the router and middleware changes, then rerun -> passes.
```

Wrong sequence:

```typescript
// 1. Implement new behaviour first.
// 2. Run E2E tests; they fail because they specify old behaviour.
// 3. Update E2E tests after implementation.
```

The test became a regression patch, not a specification.

## Rule Summary

| Test Level  | Specifies                   | Write Before             | Red Phase       |
| ----------- | --------------------------- | ------------------------ | --------------- |
| Unit        | Pure function behaviour     | Before function exists   | No function     |
| Integration | Code units working together | Before units are wired   | Units not wired |
| E2E         | System behaviour            | System behaviour changes | Old behaviour   |

If tests lag behind code at any level, TDD was not followed at that level.

## Red Specs And File Naming

Write red-phase specs that describe not-yet-implemented system behaviour in
`*.e2e.test.ts` files, not `*.unit.test.ts` files. The pre-commit hook runs
type-check, lint, and the `test` task, so red in-process specs block commits
until they go green. E2E specs are outside pre-commit, but pre-push and CI run
`test:e2e`; they must be green before push/merge unless the owner explicitly
authorises staged WIP.

## Common Violations And Fixes

### Writing Code Before Tests

Wrong:

```typescript
function add(a: number, b: number) {
  return a + b;
}

it('adds numbers', () => expect(add(1, 2)).toBe(3));
```

Correct:

```typescript
it('adds numbers', () => expect(add(1, 2)).toBe(3));
// Run -> fails because add does not exist.

function add(a: number, b: number) {
  return a + b;
}
// Run -> passes.
```

### Updating E2E Tests After Implementation

Wrong:

```typescript
// 1. Implement new feature.
// 2. Run E2E tests; they fail because they specify old behaviour.
// 3. Update E2E tests to match implementation.
```

Correct:

```typescript
// 1. Update E2E tests to specify new behaviour.
// 2. Run E2E tests; they fail because the feature is absent.
// 3. Implement the feature.
// 4. Run E2E tests; they pass.
```

### Tests That Only Pass With The Current Implementation

Wrong:

```typescript
it('calls internal method', () => {
  const spy = vi.spyOn(service, '_privateMethod');
  service.doThing();
  expect(spy).toHaveBeenCalled();
});
```

Correct:

```typescript
it('produces the expected result', () => {
  const result = service.doThing();
  expect(result).toBe(expectedValue);
});
```

The correct test survives refactoring because it proves behaviour, not the
private route to that behaviour.
