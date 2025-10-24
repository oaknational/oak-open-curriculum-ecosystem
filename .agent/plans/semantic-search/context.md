# Semantic Search Recovery – Context Log

_Last updated: 24 October 2025 21:15 BST_

---

## Current Snapshot

- **Snagging plan** – `snagging-resolution-plan.md` is now closed; remaining multi-status work is tracked in `../status-handling.plan.md`.
- **Schema decorations** – `schema-enhancement-404.ts` continues to inject documented transcript 404 payloads whilst leaving the original schema untouched.
- **Generator readiness** – `mcp-tool-generator` and schema separation suites are green and positioned to drive the new status-handling TDD effort.
- **Runtime surface** – `/mcp` remains the sole HTTP endpoint; smoke harnesses (stub/live/remote) are healthy and ready to verify multi-status behaviour.
- **Remote verification** – Preview URL `https://poc-oak-open-curriculum-mcp-git-feat-searchuxcontinuation.vercel.thenational.academy/mcp` stays green via the commander-based smoke runner.

---

## Focus: Status-Aware Response Handling

- Responses are defined by **method + path + status**; every branch must be generated at type-gen time from the decorated schema.
- Flow remains **original schema → decoration pipeline (with collision guards) → generated handling code**, keeping runtime a thin façade (`.agent/directives-and-memory/schema-first-execution.md`).
- No runtime type assertions or ad-hoc narrowing—generated artefacts expose readonly descriptors and discriminated unions.
- Detailed roadmap, acceptance criteria, and validation commands live in `../status-handling.plan.md`.

---

## Active Tasks

- [x] Emit status descriptor helper and supporting generator tests.
- [x] Enforce decoration collision protection for method/path/status tuples.
- [x] Generate status-aware invoke logic and multi-schema validation.
- [x] Prove behaviour through SDK tests, smoke suites, and fail-fast checks for undocumented statuses.
- [ ] Refresh documentation and run `pnpm make` / `pnpm qg`.

---

- 24 October 2025 23:40 BST — Phase 4 complete: SDK executor tests updated, smoke stub/live/remote runs verified 200/404 handling and fail-fast messaging across environments.
- 24 October 2025 23:10 BST — Phase 3 complete: generators emit multi-status invoke logic, validation aggregates attempted statuses, runtime/unit suites adjusted, and type-gen/lint/test commands rerun.
- 24 October 2025 22:20 BST — Phase 2 complete: added shared status guard, updated decorators, extended schema separation tests, and re-ran type-gen/lint successfully.
- 24 October 2025 21:55 BST — Phase 1 complete: generated frozen descriptor map keyed by operation/status, added generator unit coverage, regenerated artefacts, and confirmed lint/tests clean.
- Phase 7 wrapped on 24 October 2025 with schema decorations, smoke harness upgrades, and remote validation all green.
- Stub/live/REST payload captures remain available under `tmp/smoke-logs/analysis/` for regression analysis during status-handling delivery.
