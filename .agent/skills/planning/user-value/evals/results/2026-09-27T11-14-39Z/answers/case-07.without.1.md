The working directory is empty, so I don't have your API, schema, tests or the consuming tool's mapping code. What follows is a framework to apply to your system, not findings about it. The subject names and failure modes are examples to check against, not observed facts.

## The intended use value, one level at a time

| Level | What "working" means | What proves it | Where the gap usually is |
|---|---|---|---|
| **Teacher task** | A teacher searching for "Year 8 algebra" (in their own words) gets resources they would actually use, in the first results, without knowing internal codes. | Task-based tests: real queries → expected resources. Search success rate, zero-result rate, how often teachers rephrase, support tickets. | Nobody owns this outcome. Every other level can "pass" while it fails. |
| **Consuming tool** | It maps its own subject labels to the API's subject identifiers without losing meaning. No collapsing (Physics → Science loses detail), no widening (Science → Physics+Chemistry+Biology drops Earth Science), no silent drops, no string-matching that breaks when a name changes. | Mapping coverage report: every source subject maps, or is flagged unmapped. Round-trip tests. A logged count of items that fell back to "Other" or were dropped. | **Most likely where this failure starts**, based on your description. |
| **API contract** | Subject is a stable, documented identifier with defined meaning: its scope, parent/child relations, aliases and deprecations. A consumer can tell what "maths.algebra" includes. | Contract docs and a published vocabulary (e.g. SKOS or a versioned taxonomy endpoint). Consumer-driven contract tests. | Schema tests check **shape** (field is a string, enum is valid), not **meaning** (`"science"` means the same to both sides). |
| **Implementation** | Stored data uses the identifiers correctly and consistently. Search and filtering respect the hierarchy, so a query for a parent includes its children. | Data-quality checks: distribution of resources per subject, orphaned codes, records tagged with deprecated values. | Right shape, wrong or inconsistent values. Hierarchy ignored in search. |

## Where the evidence belongs

1. **Teacher level:** a small set of golden tasks (query → acceptable results), agreed with teachers. This is the acceptance test the whole chain answers to, so it belongs to the product/curriculum owner, not to either codebase.
2. **Tool level:** the tool's own mapping tests and runtime counters for unmapped, defaulted and many-to-one mappings. The evidence lives in the tool because only the tool knows its source vocabulary.
3. **Contract level:** consumer-driven contract tests (e.g. Pact-style). The consuming tool states "I send X meaning Y and expect Z", and the API verifies it. This is the missing link between "schema passes" and "meaning is preserved".
4. **Implementation level:** data-quality assertions on real records, plus search tests that exercise the hierarchy and aliases.

## Where changes belong (starting guesses; check them against the evidence above)

- **Consuming tool (primary fix):** replace any label or string mapping with an explicit, versioned mapping table to API subject IDs. Fail loudly or report on unmapped subjects instead of defaulting them. Don't flatten the hierarchy.
- **API contract (enabling fix):** publish the subject vocabulary with definitions, hierarchy, aliases and deprecation policy, so correct mapping is possible and checkable. Without this, the tool has to guess.
- **Implementation (conditional):** change it only if the data-quality or search evidence shows problems, e.g. search that ignores child subjects or inconsistent tagging. A passing schema suite is not evidence either way.
- **Shared ownership:** the teacher golden tasks and the contract tests should run in CI on both sides. Then a change to the tool's mapping, the vocabulary or the search logic breaks a test that names the teacher outcome.

## Diagnosis order

1. Take 10–20 real failed teacher searches and trace each one: teacher term → tool subject → mapped API value → stored tags → results.
2. Note where each trace first loses meaning. The distribution tells you who owns the fix. Don't assume it all traces back to the API or all to the tool.
3. Turn each failure into a test at the level where it first broke, plus one golden task at the teacher level.

If you point me to the API repo and the consuming tool's mapping code, I can do the trace and put the tests and changes in the right places.
