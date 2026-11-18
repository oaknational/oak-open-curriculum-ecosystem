# Work list: seven defects carried in with the 1.181.2–1.181.3 sync — to be cured HERE

> **Owner correction, 2026-09-16 — this file's purpose has changed; its items have not.**
> There is no "upstream". There are TWO FORKS of OCE, and this fork will eventually merge back
> to the Oak fork. So a defect in code that arrived with a sync is **cure-worthy here**, and it
> reaches the Oak fork when this fork syncs back — not before, and not as a note.
>
> This file was drafted as a paste-ready letter for another project's maintainers. That framing
> was wrong and is withdrawn. **Nothing here is to be sent.** The seven items below are accurate
> findings against the tree at `c67d33c8a`, and each is now a local work item.
>
> What the correction invalidates, recorded so the reasoning is not repeated: fork PR #147's
> round dispositions read "cure-worthy count: 0; every item concerns upstream-authored code or
> data" and routed each finding here. That count was wrong. The findings were cure-worthy on this
> fork, and the merge-back is the delivery mechanism.
>
> The file's path still reads `upstream-sync/` and its name still reads `upstream-report-draft`.
> Both retain the withdrawn model; renaming them is a separate change and has not been made.

**Review contract.** Purpose: carry seven defects, found by review rounds over the code that
arrived with releases 1.181.2 and 1.181.3 (PR #147, 2026-09-15), as a work list for this fork.
Intended impact: each is cured here and travels to the Oak fork at the merge-back. Questions for
a reviewer: is each finding stated accurately against the tree at `c67d33c8a`, and does any of
them describe code this fork has since changed? Evidence standard: each cites the file and line
the reviewer named and reproduces at that tip. Non-goals: no cure proposals beyond the reviewers'
own words; no claim about severity beyond what the code shows. A successful review confirms that
each finding reproduces, or removes it.

## The seven items

Found while integrating 1.181.2 → 1.181.3, by automated review rounds and this line's own read,
on files that came in with those releases.

1. `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts` (around line
   40): the new closed widget-address vocabulary is typed `readonly string[]`, which discards the
   exact literal union. Keeping the source tuple literal with `as const` would let consumers keep
   the finite contract, as `docs/governance/typescript-practice.md` asks.
2. `packages/sdks/oak-sdk-codegen/code-generation/typegen/generate-widget-constants.ts` (around line
   56): the generator emits the same widened list in its public output even if the source tuple is
   exact. Emitting the generated list with `as const` would preserve the literal vocabulary in the
   generated API.
3. `packages/sdks/oak-sdk-codegen/eslint.config.ts` (around line 120): the typegen environment guard
   does not ban every direct `process` route it describes. `globalThis['process'].env.VERCEL` has no
   `Identifier[name="process"]`, import or `require`, so it stays lint-clean while making generated
   output deployment-dependent. Covering computed `globalThis` access, with a regression test, or
   narrowing the "whole route" wording to what the selectors guarantee, would close it.
4. `docs/operations/production-debugging-runbook.md` (around line 546): the instruction compares
   status codes, but status equality does not distinguish route handling from an edge block. If the
   edge rejects both requests, both can be 403 without `x-vercel-id`. The preceding text already
   names `x-vercel-id` as the discriminator, so comparing that header would match it.
5. `apps/oak-curriculum-mcp-streamable-http/e2e-tests/mcp-app-composition.e2e.test.ts` (around line
   192): the retired-address checks run several protocol reads inside one test case, so a failure
   on the first retired address stops every later address being exercised or reported. The same
   loop shape appears in the newly added router test. Parameterised cases (`it.each` over the
   retired addresses) would isolate each one, as the repository's immediate-fail list for loops
   with side effects in test functions asks.
6. `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts` (around line
   37): `RETIRED_WIDGET_URIS` lists `oak-curriculum-app-899803c6` and `oak-curriculum-app-5ce56c4b`,
   but the production UAT report `apps/oak-curriculum-mcp-streamable-http/docs/uat-reports/2026-08-04-prod.md`
   (around lines 69 to 73) records `ui://widget/oak-curriculum-app-85820fb2.html` as an address a
   production `resources/list` advertised. A client that kept that list would still meet the
   authentication challenge the allowlist exists to avoid. Inventorying every production address
   clients may have retained, rather than the two most recent, would close it.
7. `.agent/reports/mcp-agent-facing-content-audit/registry.json` (item C479, `BASE_WIDGET_URI`,
   around line 10978): the `behavioural_intent` still reads "the cache-busting hash forces hosts to
   reload a fresh bundle", while the constant is now the fixed `oak-curriculum-app-v1` address and
   ADR-141 describes versioned, never hashed, addresses. Regenerated audit pages therefore show the
   `-v1` excerpt beside a purpose that contradicts it. Correcting the intent at its source would
   make the regenerated surfaces agree.

## Provenance

Items 1 to 5 come from fork PR #147's review round one at head `c67d33c8a`: Copilot review threads
on items 1 to 4, and a Codex review thread on item 5. Each thread is dispositioned on the pull
request as routed to this draft. Items 6 and 7 come from the round-two Copilot review of the
integration head `15de4bc69`; the same round re-raised item 3.
