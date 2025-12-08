# Oak MCP Response Standardisation & Orchestration Spec

This write‑up pulls together:

- What we saw **by actually calling** the Preview MCP tools.
- What the **official OpenAPI spec** says those endpoints return. :contentReference[oaicite:0]{index=0}
- The fact you currently have **two classes of MCP tools**:
  - _Generated_ tools: thin pass‑through wrappers over `/lessons/*`, `/key-stages/*`, `/search/*`, etc.
  - _Aggregated_ tools: hand-written tools such as `search`, `fetch`, `get-help` that compose or decorate API calls.

Goal:  
Define a **single, unified interface shape** for _all_ MCP tools (generated + aggregated) so that:

- Widgets can treat every `toolOutput` the same way.
- The model has a predictable schema to reason over.
- You can add more aggregated tools without multiplying shapes.

---

## 1. What’s non‑standard today? (With concrete examples)

### 1.1 Different envelope patterns per tool

From MCP behaviour + OpenAPI:

- `get-lessons-summary` (MCP) typically returns something like:

  ```jsonc
  {
    "status": 200,
    "data": {
      // LessonSummaryResponseSchema
      "lessonTitle": "...",
      "unitSlug": "...",
      "subjectSlug": "...",
      "keyStageSlug": "...",
      "lessonKeywords": [...],
      "keyLearningPoints": [...],
      "downloadsAvailable": true
    },
    "oakContextHint": "..."
  }
  ```

- `get-lessons-quiz` (MCP) returns:

  ```jsonc
  {
    "status": 200,
    "data": {
      // QuestionForLessonsResponseSchema
      "starterQuiz": [...],
      "exitQuiz": [...]
    },
    "oakContextHint": "..."
  }
  ```

- `get-key-stages-subject-units` returns:

  ```jsonc
  {
    "status": 200,
    "data": [
      {
        "yearSlug": "year-3",
        "yearTitle": "Year 3",
        "units": [
          { "unitSlug": "fractions", "unitTitle": "Fractions" },
          ...
        ]
      },
      ...
    ],
    "oakContextHint": "..."
  }
  ```

- `search` (aggregated MCP tool) combines two endpoints (`/search/lessons` + `/search/transcripts`) and returns something closer to:

  ```jsonc
  {
    "status": "success",
    "q": "fractions",
    "lessonsStatus": 200,
    "lessons": [
      /* LessonSearchResponseSchema[] */
    ],
    "transcriptsStatus": 200,
    "transcripts": [
      /* SearchTranscriptResponseSchema[] */
    ],
    "summary": "Short natural-language summary",
    "oakContextHint": "...",
  }
  ```

- `fetch` (aggregated) is polymorphic — depending on `id` (`lesson:slug`, `unit:slug`, `subject:slug`, `thread:slug`) the payload shape differs. Errors like a missing lesson come back as:

  ```jsonc
  {
    "text": "Undocumented response status 404 for getLessons-getLesson. Documented statuses: 200",
    "is_error": true,
  }
  ```

**What’s non‑standard about this?**

- Sometimes the payload sits under `data`, sometimes it is split (`lessons`, `transcripts`, `summary`, ...).
- Status can be `status: 200`, `status: "success"`, or an undocumented `text` + `is_error`.
- `fetch`’s shape is the least predictable because it’s a free union of multiple underlying schemas.

For widgets and model code, this means you can’t just write:

```ts
const { data } = toolOutput;
```

You need to know, per tool, which keys to look at.

---

### 1.2 Inconsistent parameter naming and ID forms

Using the OpenAPI spec as reference:

- The underlying API endpoints typically take **path parameters like `lesson` or `unit`**:
  - `/lessons/{lesson}/summary` (param: `lesson`)
  - `/lessons/{lesson}/quiz`
  - `/lessons/{lesson}/assets`
  - `/lessons/{lesson}/transcript` :contentReference[oaicite:1]{index=1}

- The MCP tools mix:
  - `lesson: string` (slug only) on:
    - `get-lessons-summary`
    - `get-lessons-quiz`
    - `get-lessons-assets`
    - `get-lessons-transcript`
  - `id: "lesson:slug"` on:
    - `fetch`
  - `keyStage` + `subject` + optional `unit` on:
    - `get-key-stages-subject-lessons`
    - `get-key-stages-subject-units`
    - `get-key-stages-subject-questions`
  - `sequence: string` on:
    - `get-sequences-*`
  - `threadSlug: string` on:
    - `get-threads-units`

This is all reasonable from the API standpoint, but from the **widget’s perspective** it means:

- You cannot write one generic `loadLesson(slug)` that always works; you need different callers for `fetch("lesson:slug")` vs `get-lessons-summary({ lesson: slug })`.
- The canonical ID for a lesson (the `"lesson:slug"` form) is implicit rather than explicit across all tools.

---

### 1.3 Index tools vs single-resource tools aren’t aligned

From the spec:

- `/lessons/{lesson}/quiz` returns a **single lesson’s quiz** (`QuestionForLessonsResponseSchema`).
- `/key-stages/{keyStage}/subject/{subject}/questions` returns **all quiz questions in a subject+keyStage**, grouped by lesson (`QuestionsForKeyStageAndSubjectResponseSchema`). :contentReference[oaicite:2]{index=2}

From actual MCP calls:

- `get-key-stages-subject-questions` returns a subset of lessons with quizzes (e.g., KS2 maths, some lessons).
- `get-lessons-quiz` still returns quizzes for lessons that **didn’t appear in that index**.
- So the “index of all lessons with quizzes in KS2 maths” is not in strict sync with the per-lesson quizzes.

For widgets, this means:

- You cannot safely infer “lesson has no quiz” just because it’s not present in the subject-level questions tool.
- You must treat the per-lesson quiz tool as the source of truth — another bit of mental mapping your client needs to encode.

---

### 1.4 Different shapes for “resource” vs “collection” vs “search results”

OpenAPI makes this distinction clear:

- Lesson summary: `LessonSummaryResponseSchema` (one object).
- Unit summary: `UnitSummaryResponseSchema` (one object).
- Lesson search: `LessonSearchResponseSchema` (array of objects).
- Transcript search: `SearchTranscriptResponseSchema` (array of objects).
- Key stage + subject units: `AllKeyStageAndSubjectUnitsResponseSchema` (array grouped by year). :contentReference[oaicite:3]{index=3}

In MCP:

- Some generated tools preserve that directly (good!).
- Aggregated tools (e.g., `search`) combine collections and additional summary text in one object.
- `fetch` multiplexes across several resource types.

From a consuming client’s perspective, each tool has to be treated as a one‑off, even when conceptually similar (“give me a list of things”, “give me one thing”).

---

## 2. What does “good” look like? A unified envelope

You’ve already conceptualised two classes of MCP tools:

1. **Pass‑through tools** (generated): thin wrappers over individual `/api/v0/...` endpoints.
2. **Aggregated tools** (hand-written): combine multiple endpoints or add guidance, such as:
   - `search` (lessons + transcripts)
   - `fetch` (lesson/unit/subject/thread)
   - `get-help` (tool usage + workflows)
   - `get-ontology` (domain model)
   - `get-knowledge-graph` (concept graph)

The proposal is: **both classes should share the same external envelope**.

### 2.1 Proposed unified envelope type

Think of a single top‑level schema:

```ts
type OakToolKind =
  | 'lessonSummary'
  | 'lessonQuiz'
  | 'lessonAssets'
  | 'lessonTranscript'
  | 'unitSummary'
  | 'unitListForKeyStageAndSubject'
  | 'lessonListForKeyStageAndSubject'
  | 'questionsForKeyStageAndSubject'
  | 'sequenceUnits'
  | 'sequenceAssets'
  | 'sequenceQuestions'
  | 'threads'
  | 'threadUnits'
  | 'subjects'
  | 'subjectDetail'
  | 'subjectKeyStages'
  | 'subjectYears'
  | 'search' // aggregated
  | 'fetch' // aggregated, polymorphic
  | 'help' // aggregated
  | 'ontology' // aggregated
  | 'knowledgeGraph'; // aggregated

type OakResourceType =
  | 'lesson'
  | 'unit'
  | 'subject'
  | 'sequence'
  | 'keyStage'
  | 'thread'
  | 'programme' // future
  | 'none'; // for purely informational tools

interface OakToolResponseBase {
  /** Discriminator for the tool's semantic function, not the HTTP path */
  kind: OakToolKind;

  /** High-level operation status, decoupled from HTTP codes */
  status: 'ok' | 'not_found' | 'invalid_input' | 'upstream_error';

  /** Underlying HTTP status, if applicable */
  httpStatus?: number;

  /** Canonical resource IDs that this response is “about” */
  resource?: {
    type: OakResourceType;
    id?: string; // e.g. "lesson:adding-fractions-with-the-same-denominator"
    slug?: string; // e.g. "adding-fractions-with-the-same-denominator"
  };

  /** Free-form info for the model, not the widget */
  hintForModel?: string;

  /** Human-facing summary for the chat transcript (optional) */
  summaryForUser?: string;

  /** Structured error info when status != "ok" */
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * TPayload is the “pure domain” payload – normally the exact OpenAPI response,
 * optionally normalised/merged when aggregated.
 */
interface OakToolResponse<TKind extends OakToolKind, TPayload> extends OakToolResponseBase {
  kind: TKind;
  data: TPayload | null;
}
```

Every MCP tool — pass‑through or aggregated — returns an `OakToolResponse<Kind, Payload>`.

---

## 3. Mapping existing pass‑through tools into the new envelope

Below are concrete examples of how current generated tools map to this schema. Payload types are directly from the OpenAPI spec. :contentReference[oaicite:4]{index=4}

### 3.1 `get-lessons-summary`

- Underlying API: `GET /lessons/{lesson}/summary`
- Response schema: `LessonSummaryResponseSchema`

**New MCP shape:**

```ts
type LessonSummaryPayload = LessonSummaryResponseSchema;

type GetLessonsSummaryResponse = OakToolResponse<'lessonSummary', LessonSummaryPayload>;
```

Example response:

```jsonc
{
  "kind": "lessonSummary",
  "status": "ok",
  "httpStatus": 200,
  "resource": {
    "type": "lesson",
    "id": "lesson:joining-using-and",
    "slug": "joining-using-and"
  },
  "data": {
    "lessonTitle": "Joining using 'and'",
    "unitSlug": "simple-sentences",
    "unitTitle": "Simple sentences",
    "subjectSlug": "english",
    "subjectTitle": "English",
    "keyStageSlug": "ks1",
    "keyStageTitle": "Key Stage 1",
    "lessonKeywords": [...],
    "keyLearningPoints": [...],
    "misconceptionsAndCommonMistakes": [...],
    "pupilLessonOutcome": "...",
    "teacherTips": [...],
    "contentGuidance": null,
    "supervisionLevel": null,
    "downloadsAvailable": true
  },
  "hintForModel": "Lesson summary suitable for planning.",
  "summaryForUser": "Summary for ‘Joining using and’ (KS1 English)."
}
```

Note: no extra `data` vs top-level confusion, no `oakContextHint` vs `summary` vs `text`.

---

### 3.2 `get-lessons-quiz`

- Underlying API: `GET /lessons/{lesson}/quiz`
- Response schema: `QuestionForLessonsResponseSchema`

```ts
type LessonQuizPayload = QuestionForLessonsResponseSchema;

type GetLessonsQuizResponse = OakToolResponse<'lessonQuiz', LessonQuizPayload>;
```

Example:

```jsonc
{
  "kind": "lessonQuiz",
  "status": "ok",
  "httpStatus": 200,
  "resource": {
    "type": "lesson",
    "id": "lesson:make-a-tonal-study-of-a-sculpture",
    "slug": "make-a-tonal-study-of-a-sculpture"
  },
  "data": {
    "starterQuiz": [...],
    "exitQuiz": [...]
  }
}
```

If a lesson has no quiz:

```jsonc
{
  "kind": "lessonQuiz",
  "status": "ok",
  "httpStatus": 200,
  "resource": { "type": "lesson", "id": "lesson:some-lesson", "slug": "some-lesson" },
  "data": {
    "starterQuiz": [],
    "exitQuiz": [],
  },
}
```

If the lesson doesn’t exist in API:

```jsonc
{
  "kind": "lessonQuiz",
  "status": "not_found",
  "httpStatus": 404,
  "resource": { "type": "lesson", "id": "lesson:non-existent", "slug": "non-existent" },
  "data": null,
  "error": {
    "code": "LESSON_NOT_FOUND",
    "message": "No quiz found for lesson:non-existent.",
  },
}
```

### 3.3 `get-lessons-assets`

- Underlying: `GET /lessons/{lesson}/assets`
- Schema: `LessonAssetsResponseSchema`

```ts
type LessonAssetsPayload = LessonAssetsResponseSchema;

type GetLessonsAssetsResponse = OakToolResponse<'lessonAssets', LessonAssetsPayload>;
```

Example:

```jsonc
{
  "kind": "lessonAssets",
  "status": "ok",
  "httpStatus": 200,
  "resource": {
    "type": "lesson",
    "id": "lesson:using-numerals",
    "slug": "using-numerals",
  },
  "data": {
    "attribution": ["Some licence text"],
    "assets": [
      {
        "type": "worksheet",
        "label": "Worksheet",
        "url": "https://open-api.thenational.academy/api/v0/lessons/using-numerals/assets/worksheet",
      },
      {
        "type": "video",
        "label": "Video",
        "url": "https://...",
      },
    ],
  },
}
```

### 3.4 `get-key-stages-subject-lessons`

- Underlying: `GET /key-stages/{keyStage}/subject/{subject}/lessons`
- Schema: `KeyStageSubjectLessonsResponseSchema` (array grouped by unit).

```ts
type KeyStageSubjectLessonsPayload = KeyStageSubjectLessonsResponseSchema;

type GetKeyStagesSubjectLessonsResponse = OakToolResponse<
  'lessonListForKeyStageAndSubject',
  KeyStageSubjectLessonsPayload
>;
```

Example:

```jsonc
{
  "kind": "lessonListForKeyStageAndSubject",
  "status": "ok",
  "httpStatus": 200,
  "resource": {
    "type": "subject",
    "id": "subject:english",
    "slug": "english"
  },
  "data": [
    {
      "unitSlug": "simple-compound-and-adverbial-complex-sentences",
      "unitTitle": "Simple, compound and adverbial complex sentences",
      "lessons": [
        { "lessonSlug": "four-types-of-simple-sentence", "lessonTitle": "Four types of simple sentence" },
        ...
      ]
    }
  ]
}
```

---

## 4. Mapping aggregated tools into the same envelope

### 4.1 `search` (aggregated)

Today, `search` calls both:

- `GET /search/lessons`
- `GET /search/transcripts` :contentReference[oaicite:5]{index=5}

and decorates with `summary`, `oakContextHint`, etc.

In the new model:

```ts
interface OakSearchPayload {
  query: string;
  keyStage?: string;
  subject?: string;
  unit?: string;

  lessonResults: LessonSearchResponseSchema; // array
  transcriptResults: SearchTranscriptResponseSchema; // array
}

type SearchResponse = OakToolResponse<'search', OakSearchPayload>;
```

Example:

```jsonc
{
  "kind": "search",
  "status": "ok",
  "httpStatus": 200,
  "resource": { "type": "none" },
  "data": {
    "query": "fractions",
    "keyStage": "ks2",
    "subject": "maths",
    "unit": null,
    "lessonResults": [
      {
        "lessonSlug": "adding-fractions-with-the-same-denominator",
        "lessonTitle": "Add fractions with the same denominator",
        "similarity": 0.92,
        "units": [ { "unitSlug": "fractions", "unitTitle": "Fractions", "keyStageSlug": "ks2", "subjectSlug": "maths", "examBoardTitle": null } ]
      },
      ...
    ],
    "transcriptResults": [
      {
        "lessonSlug": "fractions-on-a-number-line",
        "lessonTitle": "Fractions on a number line",
        "transcriptSnippet": "A fraction is part of a whole..."
      },
      ...
    ]
  },
  "summaryForUser": "I found 12 lessons and 5 transcript hits for 'fractions' in KS2 maths."
}
```

Now the widget only cares that:

- `kind === "search"`
- `data.lessonResults` & `data.transcriptResults` exist.

### 4.2 `fetch` (aggregated, polymorphic)

`fetch` hides the variety of:

- `/lessons/{lesson}/summary`
- `/units/{unit}/summary`
- `/subjects/{subject}`
- `/threads/{threadSlug}/units`
- Etc.

Define a **fetch payload union**:

```ts
type FetchLessonPayload = {
  type: 'lesson';
  summary: LessonSummaryResponseSchema;
  assets?: LessonAssetsResponseSchema;
  quiz?: QuestionForLessonsResponseSchema;
  transcript?: TranscriptResponseSchema;
};

type FetchUnitPayload = {
  type: 'unit';
  summary: UnitSummaryResponseSchema;
};

type FetchSubjectPayload = {
  type: 'subject';
  subject: SubjectResponseSchema;
};

type FetchThreadPayload = {
  type: 'thread';
  units: ThreadUnitsResponseSchema;
};

type OakFetchPayload =
  | FetchLessonPayload
  | FetchUnitPayload
  | FetchSubjectPayload
  | FetchThreadPayload;

type FetchResponse = OakToolResponse<'fetch', OakFetchPayload>;
```

Example for a lesson fetch:

```jsonc
{
  "kind": "fetch",
  "status": "ok",
  "httpStatus": 200,
  "resource": {
    "type": "lesson",
    "id": "lesson:adding-fractions-with-the-same-denominator",
    "slug": "adding-fractions-with-the-same-denominator",
  },
  "data": {
    "type": "lesson",
    "summary": {
      /* LessonSummaryResponseSchema */
    },
    "assets": {
      /* LessonAssetsResponseSchema */
    },
    "quiz": {
      /* QuestionForLessonsResponseSchema */
    },
    "transcript": {
      /* TranscriptResponseSchema */
    },
  },
}
```

The widget’s logic:

- If `toolOutput.kind === "fetch" && data.type === "lesson"` → render full lesson view.
- If `data.type === "unit"` → render unit view.
- Etc.

### 4.3 `get-help`, `get-ontology`, `get-knowledge-graph`

These are “agent support” tools but they should still conform:

```ts
type OntologyPayload = {
  // Whatever structure you currently return (key stages, subjects, canonical URLs, ID formats, etc.)
};

type HelpPayload = {
  tools: Array<{
    name: string;
    category: 'discovery' | 'browsing' | 'fetching' | 'progression' | 'agentSupport';
    description: string;
    usageExamples: string[];
  }>;
  workflows: Array<{
    id: string;
    title: string;
    steps: string[];
  }>;
};

type KnowledgeGraphPayload = {
  nodes: Array<{ id: string; type: string; label: string }>;
  edges: Array<{ from: string; to: string; relationship: string; inferred?: boolean }>;
};

type OntologyResponse = OakToolResponse<'ontology', OntologyPayload>;
type HelpResponse = OakToolResponse<'help', HelpPayload>;
type KnowledgeGraphResponse = OakToolResponse<'knowledgeGraph', KnowledgeGraphPayload>;
```

Now the model always sees:

- A `kind` discriminant (`"help"`, `"ontology"`, `"knowledgeGraph"`).
- A `data` payload, instead of slightly different top-level shapes per tool.

---

## 5. Error & absence handling: standard, predictable

### 5.1 Standardised error shape

Instead of ad‑hoc `text` / `is_error` / “Undocumented status 404…”, define:

```ts
interface OakError {
  code: string; // MACHINE-friendly, e.g. "LESSON_NOT_FOUND"
  message: string; // HUMAN-friendly, short
  details?: unknown; // Raw upstream error, if needed
}
```

Then:

- All failures set `status !== "ok"`.
- `error` is always present on error.
- `data` is always `null` on error.

Examples:

```jsonc
{
  "kind": "lessonSummary",
  "status": "not_found",
  "httpStatus": 404,
  "resource": {
    "type": "lesson",
    "id": "lesson:growing-in-the-garden-74wk0d",
    "slug": "growing-in-the-garden-74wk0d",
  },
  "data": null,
  "error": {
    "code": "LESSON_NOT_IN_API",
    "message": "This lesson is not exposed via the Oak Curriculum API (e.g. EYFS programme).",
  },
}
```

---

## 6. What this buys you at the widget/App layer

### 6.1 Widget code becomes trivial to reason about

In the widget, you can now write:

```ts
const output = toolOutput as OakToolResponse<any, any>;

switch (output.kind) {
  case 'search':
    renderSearch(output.data);
    break;
  case 'lessonSummary':
    renderLessonSummary(output.data);
    break;
  case 'lessonQuiz':
    renderLessonQuiz(output.data);
    break;
  case 'fetch':
    if (output.data?.type === 'lesson') {
      renderLessonExplorer(output.data);
    } else if (output.data?.type === 'unit') {
      renderUnitExplorer(output.data);
    }
    break;
  // ...
}
```

You no longer care whether the tool was “generated” or “aggregated” — only the `kind` discriminator and the shape of `data`.

### 6.2 The model has a single mental model

When the model inspects `widgetState` or `globals.toolOutput`, it sees:

- A predictable envelope.
- A clear `resource` link (type + id).
- A single place for error information.

This massively simplifies prompt engineering and tool-usage instructions, because you can say:

> When handling tool results:
>
> - If `status === "ok"` and `data` is not null, use it.
> - If `status !== "ok"`, read `error.code` and `error.message`, and explain it to the user.

---

## 7. Migration strategy (high-level)

1. **Define the TypeScript types** (`OakToolResponse`, `OakToolKind`, etc.) in your MCP server.
2. **Wrap all existing handlers** so they:
   - Call the existing generated clients.
   - Adapt the OpenAPI responses into the standard envelope.
3. **Refactor aggregated tools**:
   - `search`, `fetch`, `get-help`, `get-ontology`, `get-knowledge-graph` should be updated to emit the same envelope.
4. **Update widgets and prompts**:
   - Consume the new envelope (`kind`, `data`, `status`, `error`).
   - Drop tool-specific parsing logic.
5. **Optionally add a “compat layer”**:
   - Preserve old shapes behind an internal flag until your widgets and prompts are migrated.

---

## 8. Summary

What’s non-standard today?

- Response envelopes vary (`data` vs top-level fields vs custom statuses).
- Parameter & ID conventions differ between tools.
- Index vs per-lesson tools don’t agree on coverage.
- Aggregated tools like `search` and `fetch` have ad-hoc shapes.

What does “good” look like?

- A single, discriminated `OakToolResponse<Kind, Payload>` for **every** MCP tool.
- Payloads (`data`) that are either:
  - Direct OpenAPI schemas (for pass‑through tools), or
  - Clearly defined unions/objects (for aggregated tools).
- A standard error + status model.
- Canonical resource IDs surfaced in the envelope.

Result:

- Widgets can treat all tools identically and key off `kind`.
- The model sees one predictable structure, not a zoo of subtly different shapes.
- You can keep adding high-value aggregated tools without growing surface complexity.
