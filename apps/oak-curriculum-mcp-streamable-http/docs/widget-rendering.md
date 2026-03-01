# Widget Rendering

Widget rendering documentation for the Oak Curriculum MCP HTTP server.

## Widget Cache-Busting

The Oak JSON viewer widget uses a **hash-based URI strategy** to ensure ChatGPT always loads the latest widget version. This approach eliminates URI mismatches and aligns with OpenAI's best practice: "give the template a new URI" when widget content changes.

### How It Works

Widget cache-busting happens at **sdk-codegen time** (not runtime):

1. During `pnpm sdk-codegen`, a SHA-256 hash is generated from the current timestamp
2. The hash is embedded in the widget filename: `ui://widget/oak-json-viewer-<hash>.html`
3. All generated tool descriptors reference this hashed URI in `_meta['openai/outputTemplate']`
4. The widget resource is registered at the same hashed URI
5. ChatGPT sees a new URI → fetches fresh widget content (no stale cache)

**Example URIs:**

- Generated URI: `ui://widget/oak-json-viewer-aa744679.html`
- Next build: `ui://widget/oak-json-viewer-b3c9d412.html`

### Why This Approach

**Previous approach (query parameters):**

- Tool descriptors: `ui://widget/oak-json-viewer.html`
- Runtime registration: `ui://widget/oak-json-viewer.html?v=abc12345`
- **Problem**: URI mismatch caused ChatGPT to fail loading widgets (MCP error `-32602: Resource not found`)

**Current approach (hashed filename):**

- Tool descriptors: `ui://widget/oak-json-viewer-abc12345.html`
- Runtime registration: `ui://widget/oak-json-viewer-abc12345.html`
- **Result**: URIs match perfectly, no runtime logic needed

### Benefits

- **Eliminates URI mismatch**: Tools and resource use identical URI
- **Simpler architecture**: No runtime cache-busting logic
- **Aligns with OpenAI guidance**: New URI for new widget versions
- **Works identically** in local dev and production
- **Schema-first compliant**: No runtime modification of generated artifacts

### Trade-offs

- Every `pnpm sdk-codegen` produces a new widget URI (even if widget content unchanged)
- This is an acceptable simplicity trade-off; ChatGPT handles URI changes gracefully

### Implementation Details

**Hash generation** (`code-generation/typegen/cross-domain-constants.ts`):

```typescript
function generateWidgetUriHash(): string {
  const timestamp = Date.now().toString();
  const hash = createHash('sha256').update(timestamp).digest('hex');
  return hash.slice(0, 8); // First 8 chars
}

export const BASE_WIDGET_URI = `ui://widget/oak-json-viewer-${generateWidgetUriHash()}.html`;
```

**Runtime usage** (zero transformation):

```typescript
export function getToolWidgetUri(): string {
  return WIDGET_URI; // Direct passthrough from SDK
}
```

### Related Documentation

- [ADR-071: Widget URI Cache-Busting Simplification](../../../docs/architecture/architectural-decisions/071-widget-uri-cache-busting-simplification.md)
- [OpenAI Apps SDK: Build MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)

## Widget Branding

The widget header is a compact single line containing the Oak logo, the "Oak National Academy" wordmark, and the current tool name. The logo and wordmark link to `https://www.thenational.academy`.

The header is only shown on major tools (`search`, `browse-curriculum`, `explore-topic`, `fetch`). All other tools render without branding. Visibility is controlled by the `HEADER_TOOLS` set in `widget-script.ts`, which sets `display` on the `#hdr` element at render time.

> **Historical note**: The widget previously included a CTA button system (documented in [ADR-061](../../../docs/architecture/architectural-decisions/061-widget-cta-system.md), now superseded). CTA buttons have been removed from the widget output. Context grounding is handled through MCP resources and tools (`get-ontology`, `get-help`) rather than widget buttons.

## Widget Rendering Architecture

The widget renders MCP tool output inside a ChatGPT sandbox as pure JavaScript string templates concatenated into a single bundle. There is no server-side visibility into widget errors — a single syntax error in any renderer breaks ALL tools.

### Dispatch Pattern

```text
toolName (from window.openai)
  → TOOL_RENDERER_MAP (generated in WIDGET_STATE_JS)
  → rendererId
  → RENDERERS object in widget-script.ts
  → renderer function (from concatenated WIDGET_RENDERER_FUNCTIONS)
  → HTML output
```

Three renderers exist:

| Renderer        | Tool                | Data Convention               | Key Fields                                                                                 |
| --------------- | ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| `renderSearch`  | `search`            | snake_case (ES index docs)    | `lesson.lesson_title`, `unit.unit_title`, `thread.thread_title`, `sequence.sequence_title` |
| `renderBrowse`  | `browse-curriculum` | camelCase (SequenceFacet API) | `subjectSlug`, `keyStageTitle`, `phaseTitle`, `unitCount`, `lessonCount`                   |
| `renderExplore` | `explore-topic`     | snake_case (ES index docs)    | Reuses search field-extraction helpers across lessons/units/threads                        |

Non-search-family tools render without a branding header. The header (logo, wordmark, tool name) is shown only for tools in the `HEADER_TOOLS` set: `search`, `browse-curriculum`, `explore-topic`, and `fetch`.

### Renderer Registration (Four-Way Sync)

Adding a new renderer requires coordinated edits in four files:

1. `src/widget-renderers/{name}-renderer.ts` — the JS string template
2. `src/widget-renderers/index.ts` — import and include in `WIDGET_RENDERER_FUNCTIONS`
3. `src/widget-renderer-registry.ts` — `TOOL_RENDERER_MAP` and `RENDERER_IDS` entries
4. `src/widget-script.ts` — `RENDERERS` object entry

Missing any one causes `ReferenceError` in the ChatGPT sandbox, breaking ALL tools. Four-way sync tests in `widget-renderer-registry.unit.test.ts` verify the full chain: every `TOOL_RENDERER_MAP` value maps to a `RENDERER_IDS` entry, every `RENDERER_IDS` entry has a function in the `RENDERERS` object, and every ID has a corresponding `render{Id}` function in the concatenated JS string.

### Shared Helpers (`helpers.ts`)

Field-extraction helpers handle scope-specific field access:

- `esc(s)` — HTML entity escaping including single quotes (`&#39;`) for XSS prevention
- `scopeObj(r, scope)` — retrieves the nested scope object (`lesson`, `unit`, `thread`, `sequence`)
- `extractTitle(result, scope)` — scope-appropriate title field
- `extractSubject(result, scope)` — handles `subject_slugs` array for threads, `subject_slug` string for others
- `extractKeyStage(result, scope)` — handles absent key stage on threads, `key_stages` array on sequences
- `extractUrl(result, scope)` — scope-appropriate URL field

### Search Data Shapes

The search renderer handles five distinct data shapes:

| Scope       | Nested Property    | Title            | Subject                 | Key Stage              | URL            | Highlights |
| ----------- | ------------------ | ---------------- | ----------------------- | ---------------------- | -------------- | ---------- |
| `lessons`   | `.lesson`          | `lesson_title`   | `subject_slug`          | `key_stage`            | `lesson_url`   | Yes        |
| `units`     | `.unit` (nullable) | `unit_title`     | `subject_slug`          | `key_stage`            | `unit_url`     | Yes        |
| `threads`   | `.thread`          | `thread_title`   | `subject_slugs` (array) | —                      | `thread_url`   | Yes        |
| `sequences` | `.sequence`        | `sequence_title` | `subject_slug`          | `key_stages` (array)   | `sequence_url` | No         |
| `suggest`   | —                  | `label`          | `subject` (camelCase)   | `keyStage` (camelCase) | `url`          | No         |

Key gotchas:

- `thread.subject_slugs` is `string[]`, not `string` — joined with `/`
- `UnitResult.unit` is nullable — must null-check before field access
- `SequenceResult` has no `highlights` property
- Suggest uses camelCase (`keyStage`), search scopes use snake_case (`key_stage`)

### Sandbox Dependencies

The widget depends on these ChatGPT sandbox APIs. Changes break the widget with no server-side visibility:

- `window.openai.toolOutput` — tool JSON output
- `window.openai.toolResponseMetadata` — `_meta` fields
- `window.openai.toolInput` — tool input arguments
- `window.openai.setWidgetState(state)` — state persistence across invocations
- `window.openai.openExternal(url)` — external link opening
- `window.openai.safeArea` — safe-area insets
- `openai:set_globals` event — initial data load trigger

### Edge Cases

| Edge Case                             | Renderer         | Handling                           |
| ------------------------------------- | ---------------- | ---------------------------------- |
| `results: []`                         | Search           | "No results found"                 |
| `results: [{ unit: null }]`           | Search           | Null check before field extraction |
| `SequenceResult` without `highlights` | Search, Explore  | Field helpers handle absence       |
| `d.facets` undefined                  | Browse           | Optional chaining, default to `[]` |
| `suggestions: []`                     | Search (suggest) | "No suggestions found"             |
| `ok: false` per scope                 | Explore          | Error message shown                |
| Unknown scope value                   | Search           | Fail-fast: explicit error message  |
| Null DOM elements                     | `render()`       | Guards before `innerHTML`          |

### Contract Tests

Integration contract tests validate renderer output against SDK Zod schemas (`SearchLessonsIndexDocSchema`, `SearchUnitsIndexDocSchema`, `SearchThreadIndexDocSchema`, `SearchSequenceIndexDocSchema`). Fixtures use `Pick<SDKType, fields>` to couple test data to SDK type evolution. The renderer test harness (`tests/widget/renderer-test-harness.ts`) evaluates concatenated JS in a `new Function()` sandbox, mirroring the ChatGPT execution environment.

### Resilience Hardening (Phase 5)

All critical and important resilience gaps from architecture reviews have been fixed:

- **Error containment**: `renderer(fullData)` wrapped in try/catch; shows "Unable to display results" fallback on error.
- **String injection prevention**: All string fields use `JSON.stringify` for safe serialisation into generated JS.
- **Scope validation**: `scopeObj` returns `null` for unknown scopes; search renderer fails fast with explicit error messages for missing `scope`, `results`, or `total`.
- **Delegated click handling**: All external links use `data-oak-url` attributes with a single delegated `click` listener in `widget-script.ts`. No inline `onclick` handlers. A regression test in `renderer-contracts.integration.test.ts` enforces this invariant.
- **Tool renderer map**: `JSON.stringify(TOOL_RENDERER_MAP)` for safe serialisation.
- **Four-way sync enforcement**: Unit tests verify the full TOOL_RENDERER_MAP → RENDERER_IDS → RENDERERS → render functions chain.

## Development Gotchas

- **Zod schema fixtures**: Must use parent-level enum values (e.g. `'science'` not `'biology'` for `subject_parent`) — the generated `SUBJECTS` enum only contains top-level subjects.
- **Generic constraints and TS7053**: Generic `T extends SomeBase` constraints fail with TS7053 weak type detection when union members do not overlap sufficiently. Use per-type builder functions instead.
- **`expect.any(String)` returns `any`**: This triggers `no-unsafe-assignment`. Use `toHaveProperty` for structural checks on `unknown` values from `new Function()` sandbox execution.
