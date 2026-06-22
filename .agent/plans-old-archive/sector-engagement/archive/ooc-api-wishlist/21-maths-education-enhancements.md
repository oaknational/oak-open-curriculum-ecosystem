## Maths Education - Targeted Enhancement Requests

These items are derived from:

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-original.json`
- `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/maths-primary.json`
- `reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/maths-secondary.json`

They focus on maths-specific improvements that unlock better progression mapping, assessment, and tooling for the SDK and MCP servers.

---

### 1. Add a sequence bundle endpoint for progression mapping

**Priority:** High
**Impact:** High
**Effort:** A sprint

**Current state:** `/sequences/{sequence}/units` returns minimal unit metadata (title/order/options). The bulk export contains richer unit summaries and lesson metadata needed for progression tooling.

**Maths example (bulk export):**

```json
{
  "unitSlug": "review-strategies-for-adding-and-subtracting-across-10",
  "year": 3,
  "priorKnowledgeRequirements": [
    "Recall number bonds to 10 and 20",
    "Use partitioning and recombining to make 10"
  ],
  "whyThisWhyNow": "This first unit in Year 3 revisits and reviews single digit addition and subtraction facts...",
  "unitLessons": [
    {
      "lessonOrder": 1,
      "lessonSlug": "add-3-numbers-together-using-doubles-and-near-doubles",
      "lessonTitle": "Add 3 numbers together using doubles and near doubles",
      "state": "published"
    }
  ]
}
```

**OpenAPI change (example):**

```yaml
/sequences/{sequence}/bundle:
  get:
    summary: "Sequence bundle (units + lesson summaries)"
    parameters:
      - name: sequence
        in: path
        required: true
        schema:
          type: string
      - name: year
        in: query
        schema:
          type: number
    responses:
      "200":
        description: "Sequence bundle"
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SequenceBundleResponseSchema"

components:
  schemas:
    SequenceBundleResponseSchema:
      type: object
      required: [sequenceSlug, units, lessonSummaries]
      properties:
        sequenceSlug:
          type: string
        units:
          type: array
          items:
            $ref: "#/components/schemas/UnitSummaryResponseSchema"
        lessonSummaries:
          type: array
          items:
            $ref: "#/components/schemas/LessonSummaryResponseSchema"
```

**Why:** Maths tools need ordered sequences plus the pedagogy fields (prior knowledge, why-this-why-now) and lesson learning points to build coherent learning paths.

**Benefits:**

- One call delivers progression context for maths pathways
- Fewer N+1 calls for SDK/MCP tooling
- Clearer sequencing for lesson planning and gap analysis

**User impact:** SDK/MCP engineers can build progression tools without stitching multiple endpoints; teachers and curriculum leaders see clearer maths learning pathways.

---

### 2. Add lesson-level thread tags and richer thread metadata

**Priority:** Medium
**Impact:** Medium
**Effort:** Days

**Current state:** Threads are available on units and via `/threads`, but lessons do not expose thread tags and `/threads` provides only slug/title.

**Maths example:** In maths, threads like `number`, `algebra`, and `geometry-and-measure` are essential for filtering and cross-year progression. A lesson such as `place-value-in-decimals` should surface `threadSlugs: ["number"]`.

**OpenAPI change (example):**

```yaml
components:
  schemas:
    LessonSummaryResponseSchema:
      type: object
      properties:
        threadSlugs:
          type: array
          items:
            type: string
          description: "Threads associated with the lesson"

    ThreadResponseSchema:
      type: object
      required: [slug, title]
      properties:
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        progressionSummary:
          type: string
        yearCoverage:
          type: array
          items:
            type: number

/threads:
  get:
    responses:
      "200":
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: "#/components/schemas/ThreadResponseSchema"
```

**Why:** Maths progression is domain-led (number, algebra, geometry). Thread-aware lesson queries allow tools to keep coherence across years and key stages.

**Benefits:**

- Lesson filters by domain and sub-domain
- Easier vertical progression analysis
- Better mapping to maths taxonomies

**User impact:** API consumers and SDK/MCP engineers can build domain-specific maths tooling; teachers and curriculum leaders can track concept coverage and gaps.

---

### 3. Support structured maths answers and marking metadata

**Priority:** High
**Impact:** High
**Effort:** A sprint

**Current state:** Quiz answers are text-only; there is no marking metadata for numeric tolerance or algebraic equivalence.

**Maths example:** A question asking for `0.1` should accept `1/10` or `0.10`. An algebra question should accept `2x + 3` and `3 + 2x` as equivalent.

**OpenAPI change (example):**

```yaml
components:
  schemas:
    QuizAnswer:
      oneOf:
        - $ref: "#/components/schemas/TextAnswer"
        - $ref: "#/components/schemas/NumericAnswer"
        - $ref: "#/components/schemas/ExpressionAnswer"

    NumericAnswer:
      type: object
      required: [type, value]
      properties:
        type:
          type: string
          enum: [numeric]
        value:
          type: number
        tolerance:
          type: number
          description: "Absolute tolerance for marking"

    ExpressionAnswer:
      type: object
      required: [type, latex]
      properties:
        type:
          type: string
          enum: [expression]
        latex:
          type: string
        equivalenceRule:
          type: string
          enum: [symbolic, numeric]

    QuizQuestion:
      type: object
      properties:
        markingGuidance:
          type: string
```

**Why:** Maths assessment needs equivalence, tolerance, and formal expressions. Text-only answers are insufficient for automated validation and feedback.

**Benefits:**

- Accurate marking for numeric and algebraic responses
- Enables adaptive practice and diagnostics
- Unlocks reliable validation in SDK/MCP tooling

**User impact:** Teachers and learners receive accurate feedback; SDK/MCP engineers can implement maths practice tools without brittle heuristics.

---

### 4. Return image and diagram-based quiz items explicitly

**Priority:** High
**Impact:** High
**Effort:** Days

**Current state:** Quiz endpoints omit image-based questions silently, which disproportionately affects maths (graphs, diagrams, number lines).

**Maths example:** A geometry question requiring a diagram should include the image with alt text and attribution, plus image-based answer options where needed.

**OpenAPI change (example):**

```yaml
components:
  schemas:
    QuizAnswer:
      oneOf:
        - $ref: "#/components/schemas/TextAnswer"
        - $ref: "#/components/schemas/ImageAnswer"

    ImageAnswer:
      type: object
      required: [type, image]
      properties:
        type:
          type: string
          enum: [image]
        image:
          $ref: "#/components/schemas/QuestionImage"

    QuestionImage:
      type: object
      required: [url, width, height]
      properties:
        url:
          type: string
        width:
          type: number
        height:
          type: number
        alt:
          type: string
        attribution:
          type: string
```

**Why:** Maths assessment is visual. Excluding image-based items removes a large portion of valid content.

**Benefits:**

- Complete quiz coverage for maths
- Fairer assessment of spatial reasoning
- Enables visual practice tools

**User impact:** Students and teachers get full access to maths quizzes; SDK/MCP engineers can build robust practice workflows without missing items.

---

### 5. Add maths representation tags at lesson and unit level

**Priority:** Medium
**Impact:** Medium
**Effort:** Days

**Current state:** There is no structured way to identify representations (number line, bar model, Gattegno chart), despite being core to maths pedagogy.

**Maths example:** A lesson on decimals that uses a place value chart should advertise that representation for filtering and progression.

**OpenAPI change (example):**

```yaml
components:
  schemas:
    LessonSummaryResponseSchema:
      type: object
      properties:
        representations:
          type: array
          items:
            type: string
          example: ["place-value-chart", "number-line"]
```

**Why:** Representation-based filtering is critical for concrete-pictorial-abstract progression and inclusive teaching.

**Benefits:**

- Representation-aware lesson planning
- Better support for scaffolding and intervention
- Enables tools that recommend alternative representations

**User impact:** Teachers and curriculum leaders can plan representation progression; learners benefit from varied approaches; SDK/MCP engineers can surface targeted resources.

---

### 6. Provide transcript segments with maths normalisation

**Priority:** Medium
**Impact:** Medium
**Effort:** Days

**Current state:** `/lessons/{lesson}/transcript` returns a single `transcript` string and `vtt` text. Maths transcripts use spoken forms (“one tenth”) which are hard to normalise downstream.

**Maths example:** In a decimals lesson, “one tenth” should optionally normalise to `0.1` for search and tool use.

**OpenAPI change (example):**

```yaml
/lessons/{lesson}/transcript:
  get:
    parameters:
      - name: format
        in: query
        schema:
          type: string
          enum: [text, segments]
          default: text
    responses:
      "200":
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TranscriptResponseSchema"

components:
  schemas:
    TranscriptResponseSchema:
      type: object
      properties:
        transcript:
          type: string
        vtt:
          type: string
        segments:
          type: array
          items:
            type: object
            required: [startMs, endMs, text]
            properties:
              startMs:
                type: number
              endMs:
                type: number
              text:
                type: string
              mathsNormalisedText:
                type: string
```

**Why:** Maths tools need structured segments for retrieval, alignment to questions, and normalised search.

**Benefits:**

- Better transcript search for maths terms and symbols
- Cleaner alignment of explanations to questions
- Easier transformation into structured notes or flashcards

**User impact:** Learners and teachers get better searchable explanations; SDK/MCP engineers can generate maths-aware study tools.

---

### 7. Add filters and richer context to transcript search

**Priority:** Medium
**Impact:** Medium
**Effort:** Days

**Current state:** `/search/transcripts` only accepts `q` and returns minimal lesson context.

**Maths example:** Searching for “place value” should be filterable to KS3 maths and should return the unit context for lesson planning.

**OpenAPI change (example):**

```yaml
/search/transcripts:
  get:
    parameters:
      - name: q
        in: query
        required: true
        schema:
          type: string
      - name: subject
        in: query
        schema:
          type: string
          enum: [maths]
      - name: keyStage
        in: query
        schema:
          type: string
          enum: [ks1, ks2, ks3, ks4]
      - name: year
        in: query
        schema:
          type: number

components:
  schemas:
    SearchTranscriptResponseSchema:
      type: array
      items:
        type: object
        properties:
          lessonSlug:
            type: string
          lessonTitle:
            type: string
          unitSlug:
            type: string
          unitTitle:
            type: string
          keyStageSlug:
            type: string
          subjectSlug:
            type: string
          transcriptSnippet:
            type: string
```

**Why:** Without filters and context, maths search results are noisy and hard to action.

**Benefits:**

- Higher precision transcript discovery
- Immediate lesson context for planning
- Better search tooling for subject-specific assistants

**User impact:** Teachers and curriculum leaders find relevant maths content faster; SDK/MCP engineers can build dependable search tools.

---

### 8. Add a maths glossary endpoint and stable keyword IDs

**Priority:** Medium
**Impact:** Medium
**Effort:** Days

**Current state:** `lessonKeywords` are per-lesson with no stable identifiers and no subject-level glossary endpoint.

**Maths example:** The keyword “Decimal form” appears in a lesson but cannot be linked across units or years.

**OpenAPI change (example):**

```yaml
components:
  schemas:
    LessonKeyword:
      type: object
      required: [keywordId, keyword, description]
      properties:
        keywordId:
          type: string
        keyword:
          type: string
        description:
          type: string

/subjects/{subject}/keywords:
  get:
    summary: "Subject glossary"
    parameters:
      - name: subject
        in: path
        required: true
        schema:
          type: string
    responses:
      "200":
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: "#/components/schemas/LessonKeyword"
```

**Why:** Maths vocabulary progression benefits from stable identifiers and a glossary view.

**Benefits:**

- Cross-year vocabulary tracking
- Consistent glossary references in tools
- Better alignment with knowledge organisers

**User impact:** Teachers and learners can track maths vocabulary growth; SDK/MCP engineers can build glossary and revision tools without brittle string matching.

---

Effort estimates are very approximate and for orientation only. Every task needs proper sizing by the person doing the work.

**Related wishlist sections:** `05-medium-priority-requests.md` (thread enhancements), `11-assets-and-transcripts-examples.md` (transcript availability), `12-search-and-enums-examples.md` (search constraints), `13-quiz-content-examples.md` (quiz omissions), `17-ontology-and-threads-examples.md` (thread metadata).
