# Draft for the owner: findings on upstream's 1.179.1–1.181.1 changes, surfaced by the fork's sync review

> **Owner correction, 2026-09-16 — this file's framing is withdrawn; its findings are not yet
> re-read.** There is no "upstream": there are two peer forks of OCE, and this fork merges back
> to the Oak fork. A defect in carried code is cure-worthy here and reaches the Oak fork at the
> merge-back, so **nothing here is to be sent**. The six findings below were recorded as another
> project's to cure; they have not been re-read against this fork's current tree under the
> peer-fork model. The next seat that touches carried code re-reads each one and moves every
> finding that still reproduces into a local work list, as the 1.181.3 set was
> (`upstream-report-draft-1.181.3-sync-2026-09-15.md`).

The two sections below keep the withdrawn framing's wording as the record of what was
first written; neither is an instruction, and the six findings are the only live content.

**Review contract (withdrawn 2026-09-16).** Purpose: give the owner one paste-ready note for upstream's maintainers,
naming the findings a downstream review round surfaced on upstream-authored files while
integrating releases 1.179.1 to 1.181.1 (fork PR #127, 2026-09-10). Intended impact: upstream
decides whether to cure; the fork cures none of these (it never diverges upstream code on a
sync). Questions for a reviewer: are the six findings stated accurately against upstream's code
at `216e64c15`, and is anything fork-specific mislabelled as upstream's? Evidence standard: each
finding cites the file and line the reviewer named and is reproducible from upstream's tree at
that tip. Authority boundary: this note is the owner's to send, edit or drop; it names no fork
surface, branch or organisation. Non-goals: no cure proposals beyond the reviewer's own words;
no claim about severity beyond what the code shows. A successful review confirms each finding
reproduces or marks it withdrawn.

## The findings, in the withdrawn note's wording (nothing here is sent)

Hi — while integrating 1.179.1 → 1.181.1 downstream, an automated review round raised six
points on files that came in with those releases. None were changed on our side; passing them
on in case they are useful.

1. `apps/oak-curriculum-mcp-streamable-http/scripts/fetch-with-timeout.ts` (around line 50): the
   abort timer is cleared as soon as `fetch()` returns headers, but the callers then read the
   body with `response.json()` / `response.text()`. A peer that sends headers and stalls the body
   can hold the registry gate past its documented 10-second bound. Keeping the abort active
   through body consumption (read the body inside the timed scope) would close it; a
   headers-without-body test would pin it.
2. `apps/oak-curriculum-mcp-streamable-http/src/mcp-registry/server-json-constraints.ts` (around
   line 81): the `catch` around `new URL()` returns `false`, which lets a malformed HTTPS-looking
   string such as `https://%` satisfy `PUBLISHABLE_ENDPOINT_PATTERN` and both endpoint
   constraints, so `buildServerJsonDocument` can emit an invalid registry document. Parsing the
   URL inside `endpointIsPublishable` and rejecting parse failures (with a malformed-URL test)
   would close it.
3. `agent-tools/src/mcp-content-current-source/current-misconception-order-item-anchor-overrides.ts`
   (around line 21): the C234 anchor keeps two short fragments where it previously covered the
   whole tool description, so the regenerated tool-description page presents the fragments as
   the full "what it says now" text with no partial marker, while the stated intent still
   includes the omitted anchor rules, caveats and examples.
4. `agent-tools/src/mcp-content-current-source/current-registration-item-anchor-overrides.ts`
   (around line 80): the two narrow C408 anchors no longer represent the whole item; the
   regenerated `engineering-structural.md` shows a syntactically incomplete function (a
   signature followed only by the registration and scopes tail) without a partial marker, and
   the issuer, authorization and token rewriting disappear from the reviewer-visible evidence.
5. `apps/oak-curriculum-mcp-streamable-http/docs/middleware-chain.md` (around line 114): the
   diagram shows the new OpenAI domain-verification challenge route reaching `ClerkAuth`, but
   `setupOAuthAndCaching()` registers it before `setupGlobalAuthContext()` installs Clerk and its
   handler terminates the request, so the diagram contradicts the implementation and lines
   59–61 of the same document.
6. `docs/architecture/architectural-decisions/README.md`, the ADR-229 row: the sentence "decides
   the transport's `Origin` MUST the other way" is missing a verb, which leaves the recorded
   conflict with ADR-122 unclear.

Also for information: the code-scanning rule `js/missing-rate-limiting` fires on
`apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (around line 127, the
authorization-server metadata route) in addition to four existing routes; downstream we keep
that class excluded by tracked analyser configuration under our own rate-limiting decision, so
this is a heads-up rather than a request.

## Provenance

Raised by the Copilot review on the fork's sync pull request (two rounds, 2026-09-10), read
against upstream `main` at `216e64c15` (release 1.181.1). Each thread on that pull request
carries the reviewer's full text and the routing disposition.
