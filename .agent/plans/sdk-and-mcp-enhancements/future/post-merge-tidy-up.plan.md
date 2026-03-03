---
name: "Post-merge tidy-up"
overview: "Non-blocking follow-ups collected from ws1, error handling, resource pattern, and release review work."
todos:
  - id: openapi-issue
    content: "Open issue on oaknational/oak-openapi requesting error responses in OpenAPI spec metadata"
    status: pending
  - id: no-console-cleanup
    content: "Clean up 231 pre-existing console calls flagged by new no-console lint rule"
    status: pending
  - id: resource-tests
    content: "Fix resource pattern tests (direct source comparison instead of JSON re-parsing)"
    status: pending
  - id: widget-metadata-casts
    content: "Migrate 3 pre-existing as casts in widget-metadata.e2e.test.ts to Zod"
    status: pending
  - id: type-cycle
    content: "Evaluate latent type-only cycle: tool-guidance-types → universal-tools/types → definitions"
    status: pending
  - id: workflow-duplication
    content: "Address workflow duplication in combined payload (domainModel.workflows + toolGuidance.workflows)"
    status: pending
  - id: resources-read-e2e
    content: "Add E2E resources/read test for curriculum://model"
    status: pending
  - id: adr-error-handling
    content: "Write ADR for upstream error response parsing and handling (UndocumentedResponseError, three-way classification, app-layer logging)"
    status: pending
  - id: m1-gates
    content: "M1 engineering/ops gates: G5 UX contract, G6 Clerk migration, G7 Sentry, G8 comms, rate limiting"
    status: pending
  - id: refactor-markers
    content: "Fix 4 REFACTOR-tagged no-restricted-properties disables across logger, search CLI, and stdio test helpers"
    status: pending
  - id: test-fake-isp
    content: "ISP refactor for 12 test fake as casts across 5 test helper files"
    status: pending
  - id: max-lines-extraction
    content: "Extract 3 max-lines search CLI modules: index-oak-helpers, index-batch-helpers, cache-wrapper"
    status: pending
  - id: eliminate-flat-to-nested
    content: "Evaluate eliminating the flat-to-nested transform by making the SDK use flat args directly (remove path/query nesting)"
    status: pending
isProject: false
---

# Post-Merge Tidy-Up

**Last Updated**: 2026-03-01
**Status**: Not started — these items are deferred until after merge to `main`.

---

## Items

### From upstream error handling work

1. **Open issue on `oaknational/oak-openapi`** — Feature request to include
   error responses (400/4XX) in OpenAPI spec metadata (`errorResponses`
   arrays). Currently all endpoints have `errorResponses: []`, so our
   SDK-codegen cannot generate proper error handling at compile time.
   Use `gh issue create --repo oaknational/oak-openapi`.

2. **ADR for error response parsing and handling** — Document the
   architectural decision for how the SDK handles undocumented upstream
   error responses. Covers: `UndocumentedResponseError` generated class,
   three-way classification (`UPSTREAM_SERVER_ERROR`, `CONTENT_NOT_AVAILABLE`,
   `UPSTREAM_API_ERROR`), pattern matching for copyright-blocked content,
   the principle that the SDK classifies but does not log (app layer owns
   observability), and the structured WARN logging contract at the app
   boundary. This is a durable architectural pattern that will apply to
   all future upstream API error handling.

3. **`no-console` cleanup** — The `no-console: 'warn'` rule was added to
   shared ESLint config. 231 pre-existing violations exist across the
   monorepo. Sweep and replace with proper logger calls.

### From resource pattern work

4. **Resource pattern test fixes** — `prerequisite-graph-resource` and
   `thread-progressions-resource` tests need architectural fix: direct
   source function comparison instead of JSON re-parsing with Zod.

### From WS5 review (not blocking)

5. **`widget-metadata.e2e.test.ts`** — 3 pre-existing `as` casts should
   migrate to the Zod validation pattern used by sibling E2E test files.

6. **Latent type-only cycle** — `tool-guidance-types` → `universal-tools/types`
   → `definitions`. No runtime impact (erased at compile). Consider breaking
   if value imports are ever added.

7. **Workflow duplication** — `domainModel.workflows` and `toolGuidance.workflows`
   both carry workflow data in the combined `get-curriculum-model` payload.
   Evaluate whether to deduplicate.

8. **E2E `resources/read` for `curriculum://model`** — Integration tests
   cover registration, but an E2E read test would fully lock the contract.

### M1 gates (invite-only alpha)

9. **G5**: Accept invite-only alpha experience contract (product owner).
10. **G6**: Clerk production migration (engineering/ops).
11. **G8**: Release communications (product owner).

Deferred to later milestones:

12. **G7**: Sentry observability verification (M3 tech debt and hardening).
13. **Rate limiting**: Verify active on deployment target (M3).

### From MCP prompts rationalisation

14. **Export `PromptArgs` from SDK** — `PromptArgs` type is duplicated
    inline in `register-prompts.ts`. Export from SDK public API and import.

15. **Verify `explore-topic` tool name** — The `explore-curriculum`
    prompt references `explore-topic` in its messages. Confirm this is a
    registered tool name; if not, update the prompt message.

16. **Consider "adapt a lesson" prompt** — Evaluate post-alpha whether a
    fifth prompt for lesson adaptation serves a distinct user intent.

### From onboarding eslint-disable audit (2026-03-01)

17. **4 REFACTOR markers** — `no-restricted-properties` disables explicitly
    tagged `-- REFACTOR`: `logger/log-levels.unit.test.ts:21`,
    `elastic-http.ts:213`, `ingest-harness-ops.ts:77`,
    `zero-hit-api.unit.test.ts:66`, `create-stubbed-stdio-server.ts:50`.

18. **12 test fake `as` casts** — Express Request/Response/NextFunction and
    MCP SDK type mocks across 5 test helper files. The ISP refactor pattern
    (already proven in the SDK) would eliminate these.

19. **3 extractable `max-lines` modules** — `index-oak-helpers.ts`,
    `index-batch-helpers.ts`, `cache-wrapper.ts` in the search CLI. Split
    by responsibility.

### Flat-to-nested transform elimination (medium priority)

20. **Evaluate eliminating `transformFlatToNestedArgs`** — The SDK currently
    maintains two schema layers: flat (MCP-facing) and nested (`params.path` /
    `params.query`). Every generated tool has a `transformFlatToNestedArgs`
    function bridging them. The nested structure exists because the OpenAPI
    client (`openapi-fetch`) uses `{ params: { path, query } }`, but MCP
    clients naturally send flat args. The transform is pure entropy: it adds
    code to generate, maintain, and type-check. Research doc
    `mcp-sdk-type-reuse-investigation.md` Option B flagged this. The fix
    would be to make the SDK invoke layer accept flat args directly and
    perform path/query splitting internally (or switch to a flat-native
    HTTP client). This is a significant refactor touching the generated
    tool pipeline, but removes an entire layer of generated code and the
    type-widening bugs it causes (e.g. the `z.union` → `z.preprocess`
    migration for year parameters).

### Deferred snags

21. **M1-S007**: Prerequisite sub-graph fetching — deferred.

---

## Provenance

Collected from:

- [ws1-get-curriculum-model.plan.md](../active/ws1-get-curriculum-model.plan.md) — WS5 review follow-ups
- [merge-readiness.plan.md](../archive/completed/merge-readiness.plan.md) — post-gate items
- [release-plan-m1.plan.md](../../archive/completed/release-plan-m1.plan.md) — M1 gates
- Session: [Error handling](7e822a76-e479-4943-90f1-ddb496e63e57)
- Session: [MCP prompts rationalisation](c227c7a7-7c6d-48ee-8eab-0e5e766fc78e)
- Session: [MCP server validation](fa8f4abf-9c53-4823-9d01-8b61b0cb2e38) — flat-to-nested entropy, year normalisation
