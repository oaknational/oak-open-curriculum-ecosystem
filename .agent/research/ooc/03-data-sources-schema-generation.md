# Oak OpenAPI - Data Sources & Schema Generation

## Data Sources Architecture

The API aggregates data from multiple backend systems:

```
                                    ┌─────────────────┐
                                    │   Oak OpenAPI   │
                                    │   (Next.js)     │
                                    └────────┬────────┘
                                             │
                     ┌───────────────────────┼───────────────────────┐
                     │                       │                       │
            ┌────────▼────────┐     ┌────────▼────────┐    ┌────────▼────────┐
            │  OWA Hasura     │     │  PostgreSQL     │    │  External APIs  │
            │   (GraphQL)     │     │  (via Prisma)   │    │                 │
            └─────────────────┘     └─────────────────┘    └─────────────────┘
                     │                       │                       │
         ┌───────────┼───────────┐          │              ┌────────┼────────┐
         │           │           │          │              │        │        │
    Lessons     Sequences    Subjects  Transcripts      Mux API   GCS      │
                                       (Search)                             │
                                                                         Sanity
```

---

## 1. Oak Web Application (OWA) - Hasura GraphQL

**Purpose:** Primary data source for curriculum content  
**Access:** GraphQL API via `graphql-request`  
**File:** `src/lib/owaClient.ts`

### Configuration

```typescript
export function getClient() {
  return new GraphQLClient(`${process.env.OAK_GRAPHQL_HOST}/v1/graphql`, {
    headers: {
      'x-oak-auth-key': process.env.OAK_GRAPHQL_SECRET as string,
      'x-oak-auth-type': 'oak-admin',
    },
  });
}
```

### Materialized Views Consumed

#### Lessons: `published_mv_lesson_openapi_1_2_3`

**Content:** Complete lesson data including metadata, quizzes, transcripts  
**Versioning:** `1_2_3` indicates schema version  
**Table Reference:** `published.mv_lesson_openapi_1_2_3`

**Fields Include:**

- Lesson metadata (title, slug, cohort, legacy flag)
- Unit/Subject/KeyStage relationships
- Quiz questions (starter and exit)
- Learning outcomes and keywords
- Teacher tips and common misconceptions
- Content guidance and supervision level
- TPC (Third Party Content) attributions

#### Lesson Content: `published_mv_lesson_content_published_5_0_0`

**Content:** Video transcripts and captions  
**Versioning:** `5_0_0` schema version

**Fields:**

- `transcript_sentences` - JSON with timestamps
- `transcript_vtt` - WebVTT format for video players

#### Sequences: `published_mv_curriculum_sequence_b_13_0_17`

**Content:** Curriculum units (sequences) with full hierarchy  
**Versioning:** `b_13_0_17` (b = beta, version 13.0.17)

**Complex Structure:**

- Sequence metadata (title, slug, description)
- Educational context (key stage, subject, phase, year)
- `unit_options` - Differentiated learning pathways
- `lessons` array - All lessons in sequence
- `threads` - Cross-sequence curriculum threads
- `national_curriculum_content` - Standards alignment
- `prior_knowledge_requirements`
- Exam board details (for KS4)
- Feature flags (e.g., PE swimming)

#### Subject/Phase: `published_mv_subject_phase_options_0_11`

**Content:** Subject catalog with educational contexts

**Fields:**

- Subject title and slug
- Available key stages
- Educational phases
- KS4 exam board options
- Display order

#### Downloads: `published_mv_openapi_downloads_1_0_0`

**Content:** Asset metadata for downloadable resources

**Fields per lesson:**

- Video (Mux stream/download URLs)
- Slide deck (GCS bucket path)
- Worksheets (PDF and PPTX)
- Quiz PDFs (starter and exit with answers)
- Supplementary resources

#### Unit Variant Lessons: `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0`

**Content:** Lessons organized by unit variants and years

**Purpose:** Alternative view for year-based navigation  
**Includes:** Optionality flags for differentiated lessons

### Raw SQL Access

Some endpoints bypass GraphQL and query directly:

**File:** `src/lib/owaClient.ts`

```typescript
export function querySQL(sql: string) {
  return fetch(`${process.env.OAK_GRAPHQL_HOST}/v1/query`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-oak-auth-key': process.env.OAK_GRAPHQL_SECRET as string,
      'x-oak-auth-type': 'oak-admin',
      'x-hasura-role': 'admin',
    },
    body: JSON.stringify({
      type: 'run_sql',
      args: { source: 'Oak DB', sql, read_only: true },
    }),
  });
}
```

**Used By:**

- `searchByTextSimilarity` in lesson handler (PostgreSQL `SIMILARITY()` function)

**Security Concern:** ⚠️ SQL is constructed with string interpolation. Inputs are sanitized by replacing `'` with `''`, but this is fragile.

### GraphQL Query Pattern

**Example from lesson handler:**

```typescript
const query = gql`
  query ($slug: String!) @cached(ttl: 300) {
    ${lessonView}(
      where: { lessonSlug: { _eq: $slug }, isLegacy: { _eq: false } }
    ) {
      lessonTitle
      unitSlug
      subjectSlug
      keyStageSlug
      lessonKeywords
      keyLearningPoints
    }
  }
`;

const res: LessonView = await client.request(query, { slug });
```

**Features:**

- `@cached(ttl: 300)` - Hasura caches for 5 minutes
- Typed responses via Zod schemas
- Variables for parameterization

### View Versioning Strategy

**Pattern:** Views include version numbers in their names

**Example:** `published_mv_lesson_openapi_1_2_3`

- `published` - Schema/namespace
- `mv` - Materialized View
- `lesson_openapi` - View purpose
- `1_2_3` - Version (major.minor.patch)

**Update Process:**

1. New view created with updated schema
2. API code updated to reference new view
3. Old view deprecated after transition period
4. Allows zero-downtime schema migrations

---

## 2. PostgreSQL via Prisma

**Purpose:** Transcript search and snippet storage  
**Access:** Prisma ORM with Accelerate extension  
**File:** `src/lib/db.ts`

### Configuration

```typescript
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prisma = new PrismaClient().$extends(withAccelerate());
```

**Schema:** `schema.prisma`

### Data Models

#### Snippet

```prisma
model Snippet {
  id            String   @id @default(cuid())
  lessonId      String   @map("lesson_id")
  transcriptId  String?  @map("transcript_id")
  questionId    String?  @map("question_id")
  index         Int?
  timestamp     Int?
  sourceContent String   @map("source_content")
  content       String
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  keyStageSlug  String?  @map("key_stage_slug")
  subjectSlug   String?  @map("subject_slug")
  keyStageId    String?  @map("key_stage_id")
  subjectId     String?  @map("subject_id")
  Lesson        Lesson   @relation(fields: [lessonId], references: [id])

  @@map("snippets")
}
```

**Purpose:** Chunked transcript text for full-text search

#### Lesson

```prisma
model Lesson {
  id               String   @id @default(cuid())
  title            String
  slug             String   @unique
  keyStageName     String   @map("key_stage")
  keyStageId       String?  @map("key_stage_id")
  subjectId        String?  @map("subject_id")
  content          Json?
  newLessonContent Json?    @map("new_lesson_content")
  captions         Json?
  isNewLesson      Boolean  @default(false) @map("is_new_lesson")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  snippets Snippet[]

  @@map("lessons")
}
```

**Purpose:** Lesson metadata for search indexing

### Prisma Accelerate

**What it is:** Connection pooling and caching layer for Prisma  
**Benefits:**

- Reduces serverless cold start database connections
- Global edge caching for read queries
- Connection pooling across invocations

**Connection String Format:**

```
prisma://accelerate.prisma-data.net/?api_key=...
```

**Usage in Code:**
Transparent - no code changes needed beyond initialization

---

## 3. Mux API

**Purpose:** Video streaming and MP4 file generation  
**Access:** REST API  
**File:** `src/lib/handlers/assets/helpers.ts`

### Video URL Resolution

```typescript
export async function getVideoFromMux(playbackId: string): Promise<string> {
  const url = `https://stream.mux.com/${playbackId}.m3u8`;

  // Query Mux API for available renditions
  const muxData = await fetch(`https://api.mux.com/video/v1/assets/${assetId}/playback-ids`, {
    headers: {
      Authorization: `Basic ${Buffer.from(MUX_TOKEN + ':').toString('base64')}`,
    },
  }).then((res) => res.json());

  // Find highest quality MP4
  const mp4Renditions = muxData.renditions.filter((r) => r.format === 'mp4');
  const highest = mp4Renditions.sort((a, b) => b.bitrate - a.bitrate)[0];

  return highest.url;
}
```

**Fallback Strategy:**

1. Try to get static MP4 rendition
2. If not available, generate on-the-fly from stream
3. Return HLS stream URL as last resort

**Authentication:**

- Basic auth with Mux token (from `MUX_TOKEN` env var)
- Token includes both ID and secret

---

## 4. Google Cloud Storage

**Purpose:** Downloadable file assets (PDFs, PowerPoints)  
**Access:** `@google-cloud/storage` SDK  
**File:** `src/lib/bulk-data/data-stores.ts`

### Configuration

```typescript
export function getGoogleCloudStorage() {
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');

  return new Storage({ credentials });
}
```

**Bucket Structure:**

```
oak-prod-ldn-bulk-uploader/
├── sequence-slug-1/
│   ├── sequence-slug-1-videos.tar
│   ├── sequence-slug-1-worksheets.tar
│   ├── sequence-slug-1-slide-decks.tar
│   └── sequence.json
└── ...
```

### Signed URL Generation

**Purpose:** Time-limited access to private files

```typescript
const [url] = await storage
  .bucket(bucketName)
  .file(bucketPath)
  .getSignedUrl({
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
```

**Security:**

- URLs expire after 15 minutes
- Signature validated by Google
- No direct bucket access required

---

## 5. Sanity CMS

**Purpose:** Documentation pages and landing page content  
**Access:** Sanity GraphQL API  
**Directory:** `src/cms/`

### Configuration

```typescript
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

### Schema Types

**Documentation Pages:**

```typescript
// src/cms/schemaTypes/curriculumApiDocumentationPage.schema.ts
export default {
  name: 'curriculumApiDocumentationPage',
  title: 'Curriculum API Documentation Page',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'content', type: 'array', of: [{ type: 'block' }] },
    // ... more fields
  ],
};
```

### Query Pattern

**File:** `src/cms/queries/documentationBySlugQuery/documentationBySlugQuery.query.ts`

```typescript
import client from '@/cms/client';
import { QuerySchema } from './documentationBySlugQuery.schema';
import query from './documentationBySlugQuery.gql';

export const getDocumentationBySlug = async (slug: string) => {
  const res = await client.request(query, { slug });
  return QuerySchema.parse(res.curriculumApiDocumentationPage);
};
```

### Schema Generation from GraphQL

**Script:** `bin/zod-from-gql.ts`

**Process:**

1. Read `.gql` file
2. Generate Zod schema from GraphQL query
3. Output `.schema.ts` file
4. Provides type safety for CMS data

---

## OpenAPI Schema Generation System

**Purpose:** Automatically inject OpenAPI metadata into Zod schemas

### Architecture

```
Zod Schema (.schema.ts)
    ↓
Example JSON (.json)
    ↓
Babel AST Parser
    ↓
Find z.object() declarations
    ↓
Inject .openapi() methods
    ↓
Rewrite imports
    ↓
Generated Schema (.openapi.ts)
    ↓
Used in tRPC handlers
    ↓
Converted to OpenAPI spec
```

### Implementation

**Script:** `bin/zod-openapi-schema-gen/addExamplesToZodSchema.mjs`

**Process:**

1. **Find Schema Files**

```javascript
function findAllSchemaFiles(rootDir) {
  return getAllFiles(rootDir).filter(
    (file) => file.includes(`${path.sep}schemas${path.sep}`) && SCHEMA_PATTERN.test(file),
  );
}
```

2. **Match Example JSON**

```javascript
function getMatchingJson(schemaPath, allJsonFiles) {
  const baseName = path.basename(schemaPath).replace('.schema.ts', '');
  return allJsonFiles.find(
    (jsonPath) =>
      path.basename(jsonPath).startsWith(baseName) &&
      path.basename(jsonPath).endsWith('Example.json'),
  );
}
```

3. **Parse TypeScript with Babel**

```javascript
const ast = parser.parse(inputCode, {
  sourceType: 'module',
  plugins: ['typescript'],
});
```

4. **Find Zod Schema Declarations**

```javascript
traverse.default(ast, {
  VariableDeclaration(path) {
    const declarations = path.node.declarations;
    for (const decl of declarations) {
      if (t.isIdentifier(decl.id) && decl.id.name === originalSchemaName) {
        // Found schema declaration
      }
    }
  },
});
```

5. **Inject OpenAPI Metadata**

```javascript
// Add .openapi() call to schema chain
const openApiCall = t.memberExpression(schemaInit, t.identifier('openapi'));

const openApiArgs = t.objectExpression([
  t.objectProperty(t.identifier('example'), parseExampleJson(exampleJson)),
  t.objectProperty(t.identifier('description'), t.stringLiteral(description)),
]);

newInit = t.callExpression(openApiCall, [openApiArgs]);
```

6. **Add Type Inference**

```javascript
function createInferredTypeAlias(varName, aliasName) {
  return t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier(aliasName + 'OpenApi'),
      undefined,
      t.tsTypeReference(
        t.identifier('z.infer'),
        t.tsTypeParameterInstantiation([t.tsTypeQuery(t.identifier(varName))]),
      ),
    ),
  );
}
```

7. **Write Generated File**

```javascript
const output = generate.default(ast, {}, inputCode);
const outputPath = path.join(GENERATED_DIR, extractEndpointName(schemaFilePath), outputFileName);
fs.writeFileSync(outputPath, output.code);
```

### Generated Output Structure

**Input:** `src/lib/handlers/lesson/schemas/lessonSummaryResponse.schema.ts`

```typescript
import { z } from 'zod';

export const lessonSummaryResponseSchema = z.object({
  lessonTitle: z.string(),
  unitTitle: z.string(),
  subjectSlug: z.string(),
  // ...
});
```

**Example:** `src/lib/handlers/lesson/examples/lessonSummaryResponseExample.json`

```json
{
  "lessonTitle": "Introduction to Fractions",
  "unitTitle": "Fractions",
  "subjectSlug": "maths"
}
```

**Output:** `src/lib/zod-openapi/generated/lesson/lessonSummaryResponse.openapi.ts`

```typescript
import 'zod-openapi/extend';
import { z } from 'zod';

export const lessonSummaryResponseOpenAPISchema = z
  .object({
    lessonTitle: z.string(),
    unitTitle: z.string(),
    subjectSlug: z.string(),
    // ...
  })
  .openapi({
    example: {
      lessonTitle: 'Introduction to Fractions',
      unitTitle: 'Fractions',
      subjectSlug: 'maths',
    },
    description: 'Lesson summary response data',
  });

export type LessonSummaryResponseOpenApi = z.infer<typeof lessonSummaryResponseOpenAPISchema>;
```

### Integration with tRPC

**In Handler:**

```typescript
import { lessonSummaryResponseOpenAPISchema } from '@/lib/zod-openapi/generated/lesson';

export const getLessons = router({
  getLesson: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/lessons/{lesson}/summary',
        summary: 'Lesson summary',
      },
    })
    .input(lessonSummaryRequestOpenAPISchema)
    .output(lessonSummaryResponseOpenAPISchema)
    .query(async ({ input }) => {
      // Handler logic
    }),
});
```

### OpenAPI Generation Flow

```
tRPC Router with .meta() and schemas
    ↓
trpc-to-openapi library
    ↓
Introspects procedures
    ↓
Extracts Zod schemas
    ↓
Uses .openapi() metadata (examples, descriptions)
    ↓
Generates OpenAPI 3.0 JSON
    ↓
Served at /api/v0/swagger.json
    ↓
Consumed by Swagger UI (/playground)
```

### Why This Approach?

**Advantages:**

- ✅ Single source of truth (Zod schemas)
- ✅ Type safety throughout
- ✅ Examples guaranteed to match schemas
- ✅ Auto-validation of examples at build time
- ✅ No manual OpenAPI YAML editing

**Disadvantages:**

- ❌ Complex build process
- ❌ Requires understanding of Babel ASTs
- ❌ Generated files can be confusing
- ❌ Debugging is difficult
- ❌ IDE sometimes can't resolve imports

### Triggering Generation

**Command:**

```bash
pnpm generate:openapi
```

**Script:**

```json
{
  "scripts": {
    "generate:openapi": "node bin/zod-openapi-schema-gen/addExamplesToZodSchema.mjs"
  }
}
```

**When to Run:**

- After modifying any `*.schema.ts` file
- After updating example JSON
- Before committing schema changes
- As part of build process (not automated currently)

---

## Data Flow Example: Getting a Lesson

```
1. Client Request
   GET /api/v0/lessons/fractions-intro/summary
   Authorization: Bearer abc123

2. Next.js Route
   src/app/api/v0/[...trpc]/route.ts
   → createOpenApiFetchHandler()

3. Context Creation
   src/lib/context.ts
   → withUser(req)
   → findUserByKey('abc123') [Redis]

4. Handler Execution
   src/lib/handlers/lesson/lesson.ts
   → protectedProcedure (auth + rate limit)
   → blockLessonForCopyrightText() [GraphQL check]
   → getClient().request(query) [Hasura GraphQL]

5. Data Source Query
   Hasura: published_mv_lesson_openapi_1_2_3
   WHERE lessonSlug = 'fractions-intro'
   AND isLegacy = false

6. Response Validation
   lessonSummaryResponseOpenAPISchema.parse(data)

7. Serialization
   SuperJSON transforms (dates, etc.)

8. HTTP Response
   200 OK with JSON body
   X-RateLimit-* headers
   Server-Timing header
```

---

## Performance Considerations

### Caching Layers

1. **Hasura Query Cache**
   - TTL: 300 seconds (5 minutes)
   - Applied via `@cached(ttl: 300)` directive
   - Shared across all API requests

2. **Prisma Accelerate**
   - Connection pooling
   - Edge caching for read queries
   - Reduces cold start penalty

3. **No Application Cache**
   - Serverless functions are stateless
   - Each request queries fresh data
   - Could benefit from Redis cache layer

### Query Optimization

**N+1 Problem:**
Some endpoints query once per resource:

```typescript
for (const unitSlug of unitSlugs) {
  const lessonData = await getAllLessonData(unitSlug); // N queries
}
```

**Solution:** Could use GraphQL DataLoader or batch queries

**Materialized Views:**
Pre-computed joins and aggregations in Hasura views significantly improve performance vs raw table queries.

---

## Data Consistency

### Eventual Consistency

- Hasura views updated on database changes
- Update frequency varies (immediate to hourly)
- Cache means up to 5-minute lag possible

### No Transactions

- API reads only (no writes)
- No need for ACID guarantees
- Stale data acceptable for educational content

---

## Error Handling

### Data Source Failures

**GraphQL Errors:**

```typescript
try {
  const res = await client.request(query, variables);
} catch (error) {
  throw new TRPCError({
    message: 'Failed to fetch data',
    code: 'INTERNAL_SERVER_ERROR',
    cause: error,
  });
}
```

**Mux API Failures:**

```typescript
try {
  const url = await getVideoFromMux(playbackId);
} catch (e) {
  // Fallback to stream URL
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
```

**Graceful Degradation:**

- Missing assets return `exists: false`
- Copyright-blocked content returns 404
- Invalid queries return validation errors

---

## Future Improvements

1. **Caching Layer**
   - Add Redis cache for frequent queries
   - Reduce Hasura load
   - Faster response times

2. **DataLoader**
   - Batch and cache data source requests
   - Eliminate N+1 queries
   - Better performance for bulk operations

3. **GraphQL Code Generation**
   - Generate TypeScript types from Hasura schema
   - Replace manual type definitions
   - Automated updates on schema changes

4. **SQL Query Builder**
   - Replace raw SQL with typed query builder (Kysely)
   - Eliminate SQL injection risks
   - Better maintainability

5. **Observability**
   - Track data source latencies
   - Monitor error rates by source
   - Alert on slow queries

















