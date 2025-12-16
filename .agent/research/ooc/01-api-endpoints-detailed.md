# Oak OpenAPI - Detailed API Endpoint Analysis

## Endpoint Structure

All endpoints follow the pattern: `https://open-api.thenational.academy/api/v0/{endpoint}`

## Authentication Pattern (All Endpoints)

```http
GET /api/v0/...
Authorization: Bearer {api-key}
```

**Response Headers:**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
Server-Timing: blockLessonForCopyrightText;dur=12.3, getLesson graphql;dur=45.6
```

## Endpoint Catalog

### 1. Key Stages

**Handler:** `src/lib/handlers/keyStages/keyStages.ts`

#### GET /keystages

Lists all available key stages in the curriculum.

**Response:**

```json
{
  "keyStages": [
    {
      "slug": "ks1",
      "title": "Key Stage 1"
    },
    {
      "slug": "ks2",
      "title": "Key Stage 2"
    }
  ]
}
```

**Data Source:** Hardcoded from `src/lib/keyStageAndSubjects.json`

**Implementation Notes:**

- No database query required
- Data generated via `pnpm build-subjects` script
- Committed to repository for fast responses

---

### 2. Subjects

**Handler:** `src/lib/handlers/subjects/subjects.ts`

#### GET /subjects

List all subjects across all key stages.

**Query Parameters:**

- `keyStage` (optional): Filter by key stage slug
- `phase` (optional): Filter by phase (primary/secondary)
- `ks4Option` (optional): Filter by KS4 exam board option

**Response:**

```json
{
  "subjects": [
    {
      "slug": "maths",
      "title": "Maths",
      "keyStages": ["ks1", "ks2", "ks3", "ks4"],
      "phases": ["primary", "secondary"],
      "ks4Options": ["foundation", "higher"]
    }
  ]
}
```

**Data Source:**

- Primary: `published_mv_subject_phase_options_0_11` (Hasura view)
- Fallback: `src/lib/keyStageAndSubjects.json`

**Variants:**

- `getAllSubjects` - All subjects
- `getSubjectsByKeyStage` - Filtered by key stage
- `getSubjectsByPhase` - Filtered by educational phase
- `getSubjectsByKs4Option` - Filtered by exam board track

**Copyright Gating:**

- Subjects marked with `blockedSubjects` array filtered out
- Currently blocks: `english`, `financial-education`

---

### 3. Units (Sequences)

**Handler:** `src/lib/handlers/sequences/sequences.ts`

#### GET /sequences

Get curriculum sequences (units) with optional filters.

**Query Parameters:**

- `keyStageSlug` (optional)
- `subjectSlug` (optional)
- `phase` (optional)
- `examBoard` (optional)
- `year` (optional)

**Response:**

```json
{
  "sequences": [
    {
      "slug": "maths-primary-year-1-number-place-value",
      "title": "Number and Place Value",
      "keyStage": "ks1",
      "subject": "maths",
      "phase": "primary",
      "year": "1",
      "lessonCount": 12,
      "planned_number_of_lessons": 15
    }
  ]
}
```

**Data Source:** `published_mv_curriculum_sequence_b_13_0_17`

**Implementation Details:**

- GraphQL query with complex filtering
- Supports exam board filtering for KS4
- Returns both actual and planned lesson counts
- Includes unit options for differentiated content

#### GET /sequences/{sequenceSlug}/units

Get detailed unit information for a sequence.

**Response:**

```json
{
  "sequence": {
    "slug": "maths-primary-year-1-number",
    "title": "Number",
    "description": "...",
    "why_this_why_now": "...",
    "units": [
      {
        "slug": "unit-1",
        "title": "Place Value",
        "description": "...",
        "order": 1,
        "lessons": [
          {
            "slug": "lesson-1",
            "title": "Understanding place value",
            "order": 1,
            "state": "published"
          }
        ]
      }
    ],
    "threads": [
      {
        "slug": "number-thread",
        "title": "Number",
        "order": 1
      }
    ]
  }
}
```

**Data Source:** Same materialized view with expanded fields

**Special Features:**

- Includes curriculum threads
- National curriculum content mappings
- Unit options (differentiated pathways)
- Prior knowledge requirements

---

### 4. Lessons

**Handler:** `src/lib/handlers/lesson/lesson.ts`

#### GET /lessons/{lessonSlug}/summary

Get comprehensive lesson metadata.

**Response:**

```json
{
  "lessonTitle": "Understanding fractions",
  "unitSlug": "maths-ks2-fractions",
  "unitTitle": "Fractions",
  "subjectSlug": "maths",
  "subjectTitle": "Maths",
  "keyStageSlug": "ks2",
  "keyStageTitle": "Key Stage 2",
  "lessonKeywords": ["fraction", "numerator", "denominator"],
  "keyLearningPoints": [
    "A fraction represents part of a whole",
    "The numerator shows how many parts"
  ],
  "misconceptionsAndCommonMistakes": ["Students may confuse numerator and denominator"],
  "pupilLessonOutcome": "I can identify and name simple fractions",
  "teacherTips": ["Use visual representations"],
  "contentGuidance": [],
  "downloadsAvailable": true,
  "supervisionLevel": "independent"
}
```

**Data Source:** `published_mv_lesson_openapi_1_2_3`

**Copyright Gating:**

- Checks `blockLessonForCopyrightText()` before returning data
- Returns 404 if lesson blocked
- Gating based on subject, unit, and specific lesson allowlists

#### GET /search/lessons

Full-text search for lessons by title.

**Query Parameters:**

- `q` (required): Search query
- `unit` (optional): Filter by unit slug
- `subject` (optional): Filter by subject slug
- `keyStage` (optional): Filter by key stage slug

**Response:**

```json
{
  "results": [
    {
      "lessonSlug": "fractions-introduction",
      "lessonTitle": "Introduction to Fractions",
      "similarity": 0.89,
      "units": [
        {
          "unitSlug": "maths-ks2-fractions",
          "unitTitle": "Fractions",
          "examBoardTitle": "",
          "keyStageSlug": "ks2",
          "subjectSlug": "maths"
        }
      ]
    }
  ]
}
```

**Data Source:** PostgreSQL with `SIMILARITY()` function

**Implementation:**

- Uses PostgreSQL trigram similarity search
- Raw SQL query (⚠️ SQL injection risk - inputs are escaped)
- Results sorted by similarity score descending
- Automatically excludes `financial-education` subject
- Limit: 20 results

**SQL Query Pattern:**

```sql
SELECT * from (
  SELECT "lessonSlug", SIMILARITY("lessonTitle", '{query}')
  FROM published.mv_lesson_openapi_1_2_3
  WHERE "isLegacy" = false
    AND "subjectSlug" <> 'financial-education'
  GROUP BY "lessonSlug", "similarity"
) as a
ORDER BY a.similarity DESC
LIMIT 20
```

---

### 5. Questions (Quizzes)

**Handler:** `src/lib/handlers/questions/questions.ts`

#### GET /questions/lesson/{lessonSlug}

Get all quiz questions for a specific lesson.

**Response:**

```json
{
  "starterQuiz": [
    {
      "questionId": 12345,
      "questionUid": "uuid-here",
      "questionType": "multiple-choice",
      "questionStem": [
        {"type": "text", "text": "What is 2 + 2?"}
      ],
      "answers": {
        "multiple-choice": [
          {
            "answer": [{"type": "text", "text": "4"}],
            "answer_is_correct": true
          },
          {
            "answer": [{"type": "text", "text": "5"}],
            "answer_is_correct": false
          }
        ]
      },
      "hint": "Think about counting on your fingers",
      "feedback": "2 + 2 equals 4",
      "active": true
    }
  ],
  "exitQuiz": [...]
}
```

**Question Types Supported:**

- `multiple-choice` - Single correct answer from multiple options
- `match` - Match items from two columns
- `order` - Arrange items in correct sequence
- `short-answer` - Open-ended text response
- `explanatory-text` - Information only (no answer)

**Data Source:** Denormalized JSON within `published_mv_lesson_openapi_1_2_3`

**Copyright Gating:** Same as lessons

#### GET /questions/keystage/{keyStageSlug}/subject/{subjectSlug}

Get all questions for a key stage + subject combination.

**Query Parameters:**

- `keyStageSlug` (required)
- `subjectSlug` (required)

**Response:** Array of all questions from all lessons in that scope.

**Use Case:** Bulk question extraction for analysis or alternative quiz generation.

#### GET /questions/sequence/{sequenceSlug}

Get all questions for all lessons in a sequence.

**Response:** Similar to key stage/subject endpoint but scoped to single sequence.

---

### 6. Assets

**Handler:** `src/lib/handlers/assets/assets.ts`

#### GET /lessons/{lessonSlug}/assets/{type}

Get download URL for a specific asset type.

**Asset Types:**

- `intro-quiz-questions` - Starter quiz JSON
- `intro-quiz-answers` - Starter quiz answers JSON
- `exit-quiz-questions` - Exit quiz JSON
- `exit-quiz-answers` - Exit quiz answers JSON
- `worksheet-pdf` - Pupil worksheet PDF
- `worksheet-pptx` - Editable worksheet PowerPoint
- `slide-deck` - Lesson presentation PowerPoint
- `video` - MP4 video file
- `supplementary` - Additional resources (PDF/PPTX)

**Response:**

```json
{
  "exists": true,
  "type": "video",
  "format": "mp4",
  "url": "https://stream.mux.com/..."
}
```

**Implementation:**

- Returns 307 redirect to actual asset URL
- For videos: Queries Mux API for MP4 rendition
- For files: Generates signed Google Cloud Storage URL
- Copyright gating applied per lesson

**Data Sources:**

- Metadata: `published_mv_openapi_downloads_1_0_0`
- Videos: Mux API
- Files: Google Cloud Storage with signed URLs

**Special Handling:**

- Videos: Prefers highest quality MP4 available
- Worksheets: Converts Google Docs to PDF on-the-fly (legacy)
- Slide decks: Specifically fetches `PowerPoint.pptx` from GCS folder

---

### 7. Transcripts

**Handler:** `src/lib/handlers/transcript/transcript.ts`

#### GET /lessons/{lessonSlug}/transcript

Get video transcript for a lesson.

**Response:**

```json
{
  "transcript": [
    {
      "start": 0.0,
      "end": 3.5,
      "text": "Welcome to today's lesson on fractions."
    },
    {
      "start": 3.5,
      "end": 7.2,
      "text": "We'll be learning about numerators and denominators."
    }
  ],
  "vtt": "WEBVTT\n\n00:00:00.000 --> 00:00:03.500\nWelcome to today's lesson...",
  "lessonSlug": "fractions-intro"
}
```

**Data Sources:**

- Primary: `published_mv_lesson_content_published_5_0_0` (Hasura)
- Fallback: PostgreSQL Prisma query (for search-indexed content)

**Formats Provided:**

- JSON array with timestamps
- WebVTT format string (for video players)
- Plain text (HTML tags stripped)

#### GET /search/transcripts

Search within video transcripts.

**Query Parameters:**

- `q` (required): Search query
- `keyStage` (optional)
- `subject` (optional)

**Response:**

```json
{
  "results": [
    {
      "lessonSlug": "fractions-intro",
      "lessonTitle": "Introduction to Fractions",
      "keyStage": "ks2",
      "subject": "maths",
      "matches": [
        {
          "snippet": "...understanding the numerator and denominator...",
          "timestamp": 125.5
        }
      ]
    }
  ]
}
```

**Data Source:** PostgreSQL full-text search on `Snippet` table

**Implementation:**

- Uses Prisma ORM with full-text search
- Snippets are pre-processed chunks of transcripts
- Indexed by lesson, key stage, and subject

---

### 8. Threads

**Handler:** `src/lib/handlers/threads/threads.ts`

#### GET /threads

Get all curriculum threads.

**Response:**

```json
{
  "threads": [
    {
      "slug": "number-operations",
      "title": "Number Operations"
    }
  ]
}
```

#### GET /threads/{threadSlug}/units

Get units within a curriculum thread.

**Response:**

```json
{
  "thread": {
    "slug": "number-operations",
    "title": "Number Operations",
    "units": [
      {
        "slug": "addition-year1",
        "title": "Addition Year 1",
        "order": 1
      }
    ]
  }
}
```

**Data Source:** `published_mv_curriculum_sequence_b_13_0_17` with thread relationships

**Purpose:** Threads show progression of a topic across years/key stages.

---

### 9. Units (Alternative Endpoint)

**Handler:** `src/lib/handlers/units/units.ts`

#### GET /units/{unitSlug}/lessons

Get all lessons within a unit.

**Response:**

```json
{
  "unit": {
    "slug": "maths-ks2-fractions",
    "title": "Fractions",
    "lessons": [
      {
        "lessonSlug": "lesson-1",
        "lessonTitle": "Introduction to Fractions",
        "keyStage": "ks2",
        "subject": "maths",
        "orderInUnit": 1,
        "yearSlug": "year-4",
        "optionality": null
      }
    ]
  }
}
```

**Data Source:** `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0`

**Special Features:**

- Supports unit variants (numbered units like `unit-1-2`)
- Includes optionality field for differentiated lessons
- Year-based organization

#### GET /units

Get all units across the curriculum.

**Query Parameters:**

- `keyStage` (optional)
- `subject` (optional)
- `phase` (optional)
- `year` (optional)

**Response:** Array of units matching filters.

---

### 10. All Units (Comprehensive)

**Handler:** `src/lib/handlers/allKeyStageAndSubjectUnits/allKeyStageAndSubjectUnits.ts`

#### GET /units/keystage/{keyStageSlug}/subject/{subjectSlug}

Get all units for a key stage and subject with full lesson details.

**Response:**

```json
{
  "units": [
    {
      "unitSlug": "maths-ks2-fractions",
      "unitTitle": "Fractions",
      "lessons": [
        {
          "lessonSlug": "lesson-1",
          "lessonTitle": "Introduction",
          "yearSlug": "year-4",
          "orderInUnit": 1
        }
      ]
    }
  ]
}
```

**Data Source:** `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0`

**Use Case:** Comprehensive data dump for a subject/key stage combination.

---

### 11. Rate Limit Info

**Handler:** `src/lib/handlers/rate/rate.ts`

#### GET /rate-limit

Get current rate limit status for the authenticated user.

**Response:**

```json
{
  "limit": 1000,
  "remaining": 987,
  "reset": 1702123456
}
```

**Special Feature:** This endpoint is marked with `noCost: true` so checking your rate limit doesn't consume a request.

---

### 12. Changelog

**Handler:** `src/lib/handlers/changelog/changelog.ts`

#### GET /changelog

Get all API version changes.

**Response:**

```json
{
  "versions": [
    {
      "version": "1.2.0",
      "date": "2024-03-15",
      "changes": ["Added transcript search endpoint", "Fixed asset URL generation"]
    }
  ]
}
```

#### GET /changelog/latest

Get only the most recent changelog entry.

**Data Source:** Hardcoded in handler (should be externalized to CMS or config file).

---

## Common Response Patterns

### Success Response

```json
{
  "data": {...}
}
```

### Error Response

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Lesson not found"
  }
}
```

### Error Codes

- `UNAUTHORIZED` (401) - Invalid or missing API key
- `TOO_MANY_REQUESTS` (429) - Rate limit exceeded
- `BAD_REQUEST` (400) - Invalid parameters
- `NOT_FOUND` (404) - Resource not found
- `INTERNAL_SERVER_ERROR` (500) - Server error

## OpenAPI Schema Location

**Generated Schema:** GET `/api/v0/swagger.json`

This endpoint returns the full OpenAPI 3.0 specification with:

- All endpoints documented
- Request/response schemas
- Example data
- Authentication requirements
- Parameter descriptions

## Performance Characteristics

### Fast Endpoints (<100ms)

- `/keystages` - Hardcoded data
- `/rate-limit` - Simple Redis lookup

### Medium Endpoints (100-300ms)

- Subject listings - Single GraphQL query
- Lesson summary - Cached GraphQL query

### Slow Endpoints (300ms-1s)

- Search queries - Full-text search in Postgres
- Complex sequences with many lessons

### Very Slow Endpoints (1s+)

- Asset endpoints - External API calls to Mux/GCS
- Bulk question extractions - Large dataset processing

## Rate Limit Consumption

All endpoints consume 1 request except:

- `/rate-limit` - 0 requests (noCost: true)

## Caching Headers

Currently, the API does not set cache-control headers. All responses are treated as fresh.

**Recommendation:** Add cache headers for:

- Key stages (1 week)
- Subjects (1 day)
- Lessons (1 hour)
- Assets (1 hour with validation)

## Pagination

**Current State:** No pagination implemented.

All list endpoints return full result sets. This could be problematic for:

- `/search/lessons` - Limited to 20 results (hardcoded)
- `/questions/*` - Could return hundreds of questions

**Recommendation:** Implement cursor or offset pagination for large result sets.





