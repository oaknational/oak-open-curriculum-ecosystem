---
name: "Test Coverage Review Lens"
polarity: pattern
use_this_when: "Reviewing the test surface around a product feature — auditing an `.e2e.test.ts` or `.integration.test.ts` file, triaging a flaky test suite, or deciding what coverage to keep when collapsing a feature's tests after refactor"
category: testing
proven_in: "apps/oak-curriculum-mcp-streamable-http/e2e-tests/get-curriculum-model.e2e.test.ts and public-resource-auth-bypass.e2e.test.ts — 18 tests across 2 files reviewed against the lens; 17 deletable or demote-to-unit, root cause of cross-test flake surfaced as a by-product (tests booting full app to prove pure-function decisions)."
proven_date: 2026-05-17
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Inheriting/accumulating test files that prove constants, stub content, or registration facts at the wrong level — silently inflating shared-state surface and producing flakes that look like infrastructure problems"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure
> mode to avoid. The shape is a five-question review lens applied test-by-test
> to a feature's existing coverage.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Test Coverage Review Lens

## The Lens

For every test in a feature's coverage, answer five questions in order. The
answers compose into a verdict: **keep**, **demote** (move to a lower level),
**fold** (collapse with sibling tests proving the same invariant), or
**delete**.

| # | Question | What "no" means |
| --- | --- | --- |
| 1 | **Is the test useful?** Does it prove something about behaviour, or does it assert a constant / configuration / registration fact? | Asserting a constant or a registration entry is configuration, not behaviour. Delete or demote to a unit test on the data itself. |
| 2 | **Does it prove something about *product* code, not test code or stub data?** | If the test asserts properties of stub fixtures (e.g. `useStubTools: true` paths) through the product surface, it is testing the stub. The proof belongs in the stub's unit tests, never re-asserted through the server. See [`testing-strategy.md` §Test Assertion Placement](../../../directives/testing-strategy.md#test-assertion-placement). |
| 3 | **Could it be tested at a lower level?** | If a pure function maps `(input → decision)`, the proof belongs at unit level on the function with an `it.each` table — not by booting the entire app to exercise one branch via supertest. |
| 4 | **Is it using live infrastructure where a simple fake would enable the same proof?** | Booting the full Express app + OAuth + MCP server to prove one middleware decision is the live-infrastructure-for-fake-job anti-pattern. The proof costs a flake-surface; the fake costs nothing. |
| 5 | **Do we need the test *at all*?** Is the same invariant already proved elsewhere (lower-level unit test, higher-level system-transport-invariant test, type system)? | Repeated proofs are forbidden by [`testing-strategy.md` §Rules](../../../directives/testing-strategy.md#rules) ("Each proof should happen ONCE"). Delete the duplicate. |

## Composite Verdicts

| Answers | Verdict |
| --- | --- |
| Q1 = no → | **delete** (constant/registration assertion is not a test) |
| Q2 = no → | **delete** (asserting stub content via server violates placement rule) |
| Q3 = yes (lower level applies) AND Q4 = yes (live infra unnecessary) → | **demote** to unit/integration at the named lower level |
| Q5 = no (proof already exists) → | **delete** as duplicate |
| All five yes (useful, product code, right level, fake unavailable, novel proof) → | **keep** |

## Anti-Patterns Surfaced by the Lens

The lens catches recurring shapes that quietly accumulate around a feature:

- **Asserting constants via the system surface.** A test that boots the app to
  check `description.includes("Use this when")` is asserting a string constant.
  Q1 fails.
- **Server-as-stub-validator.** A test that calls a tool with `useStubTools:
  true` and asserts the stub's static data shows up in the response is
  validating the stub. Q2 fails. Named violation of the placement rule.
- **Variant duplication for one rule.** Three tests proving "URI A bypasses
  auth", "URI B bypasses auth", "URI C bypasses auth" prove one rule three
  times. Q5 fails. Collapse to one `it.each` row table at unit level on the
  rule function.
- **Full-app boot for pure-function proof.** Booting createApp + middleware
  chain + OAuth + MCP server to exercise a branch of a pure function that maps
  `(uri → bypass | enforce)` is Q3 + Q4 failing together. Demote to a unit
  test on the function with the URI table.
- **Misclassified e2e via supertest.** A test that imports product code and
  calls it via in-memory supertest is an integration test by behaviour shape
  (see [`testing-strategy.md` §Test Types](../../../directives/testing-strategy.md#test-types)),
  even when filed under `e2e-tests/`. The misclassification routes the test
  through e2e setup files (global `fetch` mutation, network-block setup) and
  schedules it alongside Playwright loads — inflating shared-state surface for
  no proof gain. Q4 fails; the cure is to move the file to `*.integration.test.ts`.

## Flake-Surface Corollary

When a feature shows flaky tests, the lens often surfaces the cure as a
by-product. Tests at the wrong level cross more shared-state surface
(module-level singletons, global carriers, monkey-patched server methods) than
tests at the right level. The flake is not always a process-isolation
infrastructure bug — it is frequently a test-design bug where dozens of tests
re-enter the same shared-state code path to prove decisions that a single
unit test could prove without entering that path at all.

**Diagnostic ordering**: when investigating a flaky test suite, apply the
lens to the failing tests *first*. If most fail Q3 or Q4, the rewrite removes
both the flake and a class of wasted boot cost. If they pass the lens, the
shared-state hunt is justified.

## Worked Instance (2026-05-17)

Applied to two `*.e2e.test.ts` files in
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/`. Headline numbers:

| File | Tests | Keep | Demote | Fold | Delete | System-transport proof retained |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `get-curriculum-model.e2e.test.ts` | 10 | 0 | 0 | 0 | 10 | already exists in `tool-call-success.e2e.test.ts` |
| `public-resource-auth-bypass.e2e.test.ts` | 8 | 0 | 1 (wiring) | 7 (one unit table) | 0 | wiring proof at integration level |

Same 18-test → 0-test-at-this-level outcome from one consistent application
of the lens. Both file deletions also remove their test-design contribution
to the cross-test shared-state flake in `pnpm check`.

## When NOT to Apply

The lens is for *review*, not for *initial test authoring*. Author tests by
TDD at the level the behaviour is being designed at. The lens runs *after*
coverage exists, when shape and accumulation need auditing.

## Related

- [`circular-test-justification.md`](circular-test-justification.md) — sibling anti-pattern: tests that justify themselves rather than proving product code.
- [`dont-test-sdk-internals.md`](dont-test-sdk-internals.md) — sibling: SDK-internal tests proving the SDK rather than the consumer.
- [`test-complexity-signals-wrong-level.md`](test-complexity-signals-wrong-level.md) — sibling: complexity in test infrastructure as a level-wrong signal.
- [`test-claim-assertion-parity.md`](test-claim-assertion-parity.md) — sibling: tests must assert what they claim.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — authoritative doctrine the lens enforces.
- [ADR-078](../../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md) — DI rationale the lens leans on at Q4.
