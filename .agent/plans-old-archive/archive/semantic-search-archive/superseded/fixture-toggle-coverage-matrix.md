# Fixture Toggle and Search Layout Coverage Matrix

## Purpose

Define the behavioural proofs required to execute the Phase 1 UX priority for the fixture toggle and search layout. Each scenario exercises deterministic fixtures across the preferred testing hierarchy: unit → integration → React Testing Library → Playwright. The matrix ensures success, empty, and error responses remain covered while verifying layout and accessibility requirements at all breakpoints.

## Scenario Overview

| Scenario      | Description                                                                    | Deterministic Input                                                           | Expected Outcome                                                                                                                            |
| ------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Success state | Search APIs return populated fixture payloads.                                 | `SEMANTIC_SEARCH_USE_FIXTURES=true` yields seeded results for all scopes.     | Toggle remains visible (unless env disables it), cookie persists choice, layout renders results with accessible headings and announcements. |
| Empty state   | Search APIs return an empty result set while remaining a 200 response.         | Fixtures expose a subject/key stage combination with zero matches.            | Toggle still visible, search panels display graceful empty messaging without layout collapse, announcements explain no results.             |
| Error state   | Fixture mode simulates upstream failure (e.g. 500) with deterministic payload. | Fixture route short-circuits to error payload or non-200 response via helper. | Toggle visible, UI surfaces apology tone, announcements fire, layout preserves structure and highlights retry guidance.                     |

## Coverage Matrix

| Layer                 | Success                                                                                                                                                                     | Empty                                                                                                                           | Error                                                                                                                                  | Additional Assertions                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Unit                  | `resolveFixtureToggleVisibility` trims/case-normalises env values, honours explicit disable list, defaults to visible; cookie helper pure functions map fixture/live state. | Unit helper returns layout messaging tokens for empty results.                                                                  | Error tone helper maps status codes to accessible copy and severity tokens.                                                            | Unit tests assert pure logic only, no I/O.                                                                    |
| Integration           | API route integration tests prove cookie precedence over env defaults, fixture payload wiring for success plus empty dataset fallback.                                      | Integration asserts empty fixtures return deterministic response shape and status 200 with correct metadata.                    | Integration covers simulated error payloads, ensuring structured error response reaches UI client.                                     | Uses simple fakes for headers/cookies; no network calls.                                                      |
| React Testing Library | Search page client tests ensure toggle renders, announces state changes, and persists cookie through `useEffect`.                                                           | RTL tests verify empty messaging cards and maintain layout containers at bp-xs/bp-md snapshots.                                 | RTL tests assert error banners, focus management, and aria-live messaging with deterministic fixtures.                                 | Utilises deterministic fixture providers and semantic tokens.                                                 |
| Playwright            | Responsive suite toggles fixture ↔ live mode, captures screenshots, and runs axe across bp-xs/md/lg/xxl while tracking helper notices.                                      | Playwright asserts empty-state copy and helper notice remain visible, no overflow, and axe remains zero violations post-search. | Playwright scenario forces error fixtures, verifying helper notice, the surfaced `Search failed` alert, and absence of console errors. | All runs export artefacts into `tests/results/semantic-search/` for review; capture xs/md/lg/xxl screenshots. |

## Breakpoint Notes

- Unit/integration layers remain breakpoint agnostic.
- RTL and Playwright scenarios must validate layout at `bp-xs`, `bp-md`, `bp-lg`, and `bp-xxl`, ensuring hero controls stay above the fold.

## Artefact Expectations

- Unit/integration logs stored via `pnpm qg` runs.
- RTL snapshots and Playwright artefacts archived per GO cadence.
