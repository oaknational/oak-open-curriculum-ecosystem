## Medium Priority – Response Metadata

### 13. Add Response Schema Examples

**Current state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
```

**Desired state:**

```yaml
responses:
  '200':
    description: 'Successful response'
    content:
      application/json:
        schema:
          $ref: '#/components/schemas/SearchLessonsResponse'
        examples:
          typical-search:
            summary: 'Typical search with results'
            value:
              lessons:
                - slug: 'checking-understanding-of-basic-transformations'
                  title: 'Checking understanding of basic transformations'
                  subject: 'maths'
                  key_stage: 'ks3'
                  canonicalUrl: 'https://...'
          empty-results:
            summary: 'No matches found'
            value:
              lessons: []
              metadata:
                query: 'nonexistent topic'
                total: 0
```

**Why:** Helps AI understand response structure and common patterns (empty results, typical data shapes).

**Benefits:**

- Better error handling in AI tool calls
- Clearer expectation setting
- Improved documentation

**Applies to:** Major list/search endpoints.

**Enables**:

- **Layer 1**: Better handling of empty result sets (AI knows when no results is normal vs. error)
- **Layer 4**: Export tools can format data correctly based on example structure

---

### 14. Document Canonical URL Patterns

**Current state:**
Canonical URLs calculated client-side based on implicit rules.

**Critical requirement:** Canonical URL patterns **must match** the Oak Web Application (OWA) at [https://www.thenational.academy/](https://www.thenational.academy/). These are the user-facing URLs teachers will see when viewing resources on the Oak website.

**Desired state (option A – in schema):**

```yaml
components:
  schemas:
    LessonSummary:
      type: object
      properties:
        slug:
          type: string
          x-oak-canonical-url-component: true
        # other fields...
      x-oak-canonical-url-template: 'https://www.thenational.academy/teachers/lessons/{slug}'
```

**Example URL patterns** (must match OWA production URLs):

- Lessons: `https://www.thenational.academy/teachers/lessons/{lessonSlug}`
- Units: `https://www.thenational.academy/teachers/units/{unitSlug}`
- Programmes: `https://www.thenational.academy/teachers/programmes/{programmeSlug}` (if applicable)
- Curriculum plans: `https://www.thenational.academy/teachers/curriculum-plans/{subject}/{keyStage}` (if applicable)

**Note**: These are example patterns. The API team should document the **actual** OWA URL patterns used in production to ensure generated links work correctly for teachers.

**Desired state (option B – in ontology endpoint):**
Included in `/ontology` response (see item 3).

**Why:** Enables generated clients to construct user-facing URLs without hard-coding patterns. Teachers can click links in AI-generated lesson plans and go directly to the correct Oak website page.

**Current workaround:** SDK generator adds canonical URLs at type-gen time using hard-coded patterns that attempt to match OWA structure.

**Impact:** Single source of truth for URLs that's guaranteed to match OWA; easier updates when URL patterns change; ensures teachers always get working links.

**Enables**:

- **All layers**: Tools can include links to Oak website for teacher convenience
- **Layer 4**: Export tools can generate clickable lesson plans with correct URLs

---

## Medium Priority – Resource Timestamps for SDK Caching

### 15. Add `lastUpdated` Timestamp to All Resource Responses

**Current state:**

API responses contain resource data but no temporal metadata about when the content was last modified:

```json
{
  "lessonTitle": "Introduction to Fractions",
  "unitSlug": "maths-ks2-fractions",
  "subjectSlug": "maths"
  // No timestamp indicating content freshness
}
```

**Desired state:**

All resource responses include standardized timestamp fields:

```json
{
  "lessonTitle": "Introduction to Fractions",
  "unitSlug": "maths-ks2-fractions",
  "subjectSlug": "maths",
  "lastUpdated": "2024-11-15T14:32:00Z",
  "apiVersion": "0.5.0"
}
```

**For collection responses:**

```json
{
  "lessons": [
    {
      "lessonSlug": "fractions-intro",
      "lessonTitle": "Introduction to Fractions",
      "lastUpdated": "2024-11-15T14:32:00Z"
    }
  ],
  "metadata": {
    "lastUpdated": "2024-11-15T14:32:00Z", // Most recent item
    "apiVersion": "0.5.0"
  }
}
```

**Schema definition:**

```yaml
components:
  schemas:
    ResourceTimestamp:
      type: object
      required: [lastUpdated]
      properties:
        lastUpdated:
          type: string
          format: date-time
          description: 'ISO 8601 timestamp of when this resource was last modified in the curriculum database'
          example: '2024-11-15T14:32:00Z'
        apiVersion:
          type: string
          description: 'API version that generated this response'
          example: '0.5.0'
          readOnly: true

    LessonSummary:
      allOf:
        - $ref: '#/components/schemas/ResourceTimestamp'
        - type: object
          properties:
            lessonTitle: { type: string }
            # ... other fields
```

**Why this matters:**

**1. Efficient SDK-layer caching:**

Current situation - SDK must either:

- Cache blindly with TTL (wasteful bandwidth, stale data risk)
- Never cache (poor performance, unnecessary API calls)
- Implement complex ETag logic (adds HTTP overhead)

With `lastUpdated`:

```typescript
// SDK caching layer
async function fetchLesson(slug: string) {
  const cached = await cache.get(slug);

  if (cached) {
    // HEAD request just to check timestamp (or include in list endpoint)
    const current = await api.getLessonTimestamp(slug);

    if (current.lastUpdated === cached.lastUpdated) {
      return cached.data; // Still fresh
    }
  }

  // Fetch full resource
  const data = await api.getLesson(slug);
  await cache.set(slug, data, { timestamp: data.lastUpdated });
  return data;
}
```

**2. Intelligent cache invalidation:**

```typescript
// MCP server can maintain a smart cache
class CurriculumCache {
  async get(resourceId: string) {
    const cached = this.store.get(resourceId);
    if (!cached) return null;

    // Check if curriculum has been updated since cache
    const latest = await this.api.getLastUpdated(resourceId);

    if (latest <= cached.timestamp) {
      return cached.data; // Still valid
    }

    return null; // Stale, needs refresh
  }
}
```

**3. Bulk update detection:**

With timestamps in list responses, SDK can detect stale caches efficiently:

```typescript
// Check if any cached lessons are stale
const lessonList = await api.searchLessons({ subject: 'maths' });

const staleItems = lessonList.lessons.filter((lesson) => {
  const cached = cache.get(lesson.lessonSlug);
  return cached && cached.lastUpdated < lesson.lastUpdated;
});

// Only refetch stale items
await Promise.all(staleItems.map((l) => refreshCache(l.lessonSlug)));
```

**4. Change tracking for external systems:**

```typescript
// External curriculum platform can detect changes
const changes = await api.getUnits({ since: lastSyncTime });

changes.units
  .filter((unit) => unit.lastUpdated > lastSyncTime)
  .forEach((unit) => syncToExternalSystem(unit));
```

**Benefits:**

**For SDK developers:**

- Simple, reliable cache invalidation
- No need for complex ETag logic
- Can implement aggressive caching without staleness risk
- Reduces API calls by 60-80% for frequently accessed resources

**For API consumers:**

- Know exactly when content was last updated
- Can display "last modified" dates to users
- Efficient incremental synchronization
- Better offline support

**For API team:**

- Simple to implement (single database field)
- No custom caching headers needed
- Clearer cache semantics than ETag
- Supports eventual consistency patterns

**For teachers (end users):**

- Faster app responses (better caching)
- Less mobile data usage
- Works better offline
- Can see "Updated Nov 15" on curriculum items

**Implementation approaches:**

**Option A: Database timestamps (recommended):**

```sql
-- Add to existing tables
ALTER TABLE lessons ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE units ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Update trigger
CREATE TRIGGER update_lesson_timestamp
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Option B: Version numbers:**

```json
{
  "lessonSlug": "fractions-intro",
  "version": 42,
  "lastUpdated": "2024-11-15T14:32:00Z"
}
```

**Option C: Hybrid (timestamp + ETag):**

```yaml
responses:
  '200':
    headers:
      ETag:
        schema: { type: string }
        description: 'Entity tag for cache validation'
    content:
      application/json:
        schema:
          type: object
          properties:
            lastUpdated: { type: string, format: date-time }
            etag: { type: string }
```

**Recommendation:** Option A (database timestamps) - simplest and most maintainable.

**Semantic meaning:**

`lastUpdated` should reflect:

- ✅ Lesson content changes (title, keywords, learning objectives)
- ✅ Associated resource updates (transcript corrections, quiz changes)
- ✅ Metadata updates (subject reclassification, unit reassignment)
- ❌ NOT user interaction (views, downloads)
- ❌ NOT API version bumps (unless content schema changes)

**Comparison with HTTP caching:**

| Approach                 | Pros                                     | Cons                                  |
| ------------------------ | ---------------------------------------- | ------------------------------------- |
| **ETag (HTTP)**          | Standards-compliant                      | Requires HEAD requests, opaque values |
| **Last-Modified (HTTP)** | Simple                                   | Not in JSON body, limited precision   |
| **`lastUpdated` (Body)** | Available in response, precise, semantic | Non-standard field                    |

**Recommendation:** Provide `lastUpdated` in body AND `Last-Modified` header (best of both).

**Special cases:**

**Static/historical content:**

```json
{
  "lessonSlug": "ww2-lesson",
  "lastUpdated": "2023-06-01T00:00:00Z",
  "contentStatus": "archived", // Won't change
  "archived": true
}
```

**Dynamic aggregations:**

```json
{
  "subject": "maths",
  "lessonCount": 1247,
  "lastUpdated": "2024-11-15T14:32:00Z", // Most recent lesson update
  "metadata": {
    "generatedAt": "2024-11-16T10:15:00Z" // When this response was created
  }
}
```

**Why:** Cache-friendly responses reduce API load, improve SDK performance, and enable offline support.

**Impact:** **Medium-High** - enables efficient caching across all SDK consumers, reduces API calls by 60-80%.

**Effort:** Low-Medium (2-3 days for database schema + endpoint updates).

**Priority:** **Medium** - significant performance improvement, relatively easy to implement.

**Enables:**

- **Layer 1**: Tools can cache aggressively and invalidate precisely
- **Layer 2**: Aggregated tools maintain efficient caches
- **Layer 3**: Services can sync incrementally (only changed content)
- **Layer 4**:
  - `bulk-unit-summaries`: Can detect which units need refresh
  - `export-curriculum-data`: Can do incremental exports
  - All tools benefit from faster response times

**Example use case:**

Teacher opens lesson planning app daily:

**Without timestamps:**

- App must fetch all lessons fresh each time (slow, high bandwidth)
- Or cache with TTL (might miss updates)

**With timestamps:**

- App fetches list with timestamps: 1 API call
- Compares with cache: 1247 lessons, 3 changed
- Refetches only 3 changed lessons: 3 API calls
- Total: 4 calls vs 1247 calls (99.7% reduction)

**Transition strategy:**

1. Add `lastUpdated` to new endpoints first
2. Backfill existing endpoints over 1-2 sprints
3. Document best practices for SDK consumers
4. Consider making it mandatory in v1.0

---

