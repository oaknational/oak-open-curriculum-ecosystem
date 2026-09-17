# Mutation-canary survivor dispositions — `@oaknational/type-helpers`

Ledger required by
`.agent/plans/delivery/mutation-testing-core-canary.plan.md` (ratified
2026-08-09). Governing doctrine (owner, 2026-08-05, binding): mutants are
killed through higher-quality testing, never through highly-targeted
testing. A surviving mutant routes to (a) classification as equivalent or
unreachable under the public contract, or (b) an assessment that the
suite's description of the public behavioural contract is incomplete —
cured, if at all, by a behaviour-describing test that would have been
correct to write anyway, authored against the contract, not against the
mutant. The mutation score is evidence, never a target.

## Run provenance

- Date: 2026-08-09. Stryker `@stryker-mutator/core` 9.6.1 with the
  vitest runner, config `stryker.config.mjs` (auto-discovered, bare
  `stryker run`), report-only (`thresholds.break: null`).
- First full pass: `run.log.txt` — 1 file mutated, 18 mutants, 10 tests;
  **17 killed, 1 survived, 0 timeout, 0 no-coverage, 0 errors** (score
  94.44).
- Post-cure pass: `run-post-cure.log.txt` — same mutant set, 11 tests;
  **18 killed, 0 survived** (score 100.00). `report.json` reflects this
  final pass and is the report of record; the HTML projection is not
  banked — it is regenerable from the json via Stryker's report app
  (owner-ruled 2026-08-09; grounds in the canary plan's dated amendment).

## Survivor 1 of 1 — `ConditionalExpression`, `src/index.ts:21:9`

```diff
-       if (isOwnStringKey(obj, key)) {
+       if (true) {
```

The guard sits inside `typeSafeKeys`'s `for...in` loop. `for...in`
enumerates enumerable string keys **including inherited ones**; the
`isOwnStringKey` guard (`Object.hasOwn`) is the filter that restricts the
result to own keys. The mutant removes that filter.

### Disposition: (b) — suite's description of the public contract was incomplete

- **Not equivalent, not unreachable.** The mutant observably diverges for
  any object carrying enumerable inherited string properties (e.g. one
  whose prototype is a plain object with data properties): the original
  returns own keys only; the mutant also returns the inherited keys.
- **The behaviour is publicly contracted.** The module's own docstring
  says "Typed **own**-key helpers", and the sibling doc comments promise
  "**own** enumerable string keys" (`typeSafeValues`,
  `typeSafeEntries`). Own-keys-only is documented contract, not
  implementation detail.
- **The gap, cited independently of the mutant.** The suite already
  described the inherited-properties facet for `typeSafeHasOwn`
  ("returns false for inherited properties") but never for
  `typeSafeKeys`, the function whose loop is the one place the
  own-vs-inherited distinction does observable work. Every existing test
  object was a flat literal with no enumerable prototype chain, so the
  contract's exclusion clause was undescribed.

### Cure

`src/index.unit.test.ts` — `typeSafeKeys` › "returns own keys only,
excluding inherited enumerable properties": a prototype-carrying input
(`Object.setPrototypeOf(ownObject, { inherited: ... })`) whose expected
result is the own key alone. It is the same contract facet the suite
already described for `typeSafeHasOwn`, now described at the function
where it is load-bearing — a test that was correct to write regardless of
mutation testing. The post-cure pass (`run-post-cure.log.txt`) shows the
mutant killed as a consequence.

## Score note

94.44 → 100.00 is recorded as evidence of the run, never as a target met:
no threshold gates anything in this canary, and no future run should
treat 100 as a bar to preserve (owner doctrine above).
