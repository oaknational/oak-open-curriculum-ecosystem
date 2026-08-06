---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# tool-param-description — part of the tool-usability review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.

This page holds only the **tool-param-description** items of that view, so it can be reviewed in one sitting.

**101 items.** Of those, 0 are traced to a surface an agent can reach today, 0 to a surface that is retained but switched off, and 0 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the tool-usability view](./tool-usability.md) · [Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (51)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C069 — SEARCH\_INPUT\_SCHEMA.query (description + examples)

**What it says now:**

```text
query: z
    .string()
    .optional()
    .describe(
      'Search query. Required for all scopes except threads — for threads scope, omit query and provide subject or keyStage to browse all threads matching the filter.',
    )
    .meta({
      examples: ['photosynthesis', 'adding fractions', 'the Romans', 'electricity and circuits'],
    }),
```

**What it is for:** Tells the agent query is required for all scopes except threads (threads may browse via subject/keyStage), and seeds phrasing with examples (photosynthesis, adding fractions, the Romans, electricity and circuits).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C070 — SEARCH\_INPUT\_SCHEMA.scope (description + examples)

**What it says now:**

```text
scope: z
    .enum([...SEARCH_SCOPES])
    .describe(
      'Which index to search. "lessons" for specific lessons, "units" for topic groups, "threads" for cross-year progressions, "sequences" for programme structures, "suggest" for typeahead.',
    )
    .meta({ examples: ['lessons', 'units', 'threads'] }),
```

**What it is for:** Guides which index to search by mapping each scope value to its purpose (lessons/units/threads/sequences/suggest).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C071 — SEARCH\_INPUT\_SCHEMA.subject (description + examples)

**What it says now:**

```text
subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug (e.g. "maths", "science", "english")')
    .meta({ examples: ['maths', 'science', 'english'] }),
```

**What it is for:** Tells the agent to pass a subject slug and gives example slugs (maths, science, english).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C072 — SEARCH\_INPUT\_SCHEMA.keyStage (description + examples)

**What it says now:**

```text
keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage (ks1, ks2, ks3, ks4)')
    .meta({ examples: ['ks2', 'ks3'] }),
```

**What it is for:** Constrains keyStage to ks1-ks4 and gives examples ks2, ks3.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C073 — SEARCH\_INPUT\_SCHEMA.size

**What it says now:**

```text
size: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe('Maximum number of results to return (1-100, default 25)'),
```

**What it is for:** States the result cap range and default (1-100, default 25) to shape pagination/result-size choices.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C074 — SEARCH\_INPUT\_SCHEMA.from

**What it says now:**

```text
from: z.number().int().min(0).optional().describe('Offset for pagination (default 0)'),
```

**What it is for:** Explains pagination offset semantics and default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C075 — SEARCH\_INPUT\_SCHEMA.unitSlug (description + examples)

**What it says now:**

```text
Filter lessons whose `units[]` contains an entry with this unit slug.
```

**What it is for:** Repo-authored conceptual model: a lesson may belong to multiple units across programme variants, so this filter matches if any unit entry has the slug; lessons scope only. Examples fractions, the-romans.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C076 — SEARCH\_INPUT\_SCHEMA.tier (description + examples)

**What it says now:**

```text
tier: z
    .string()
    .optional()
    .describe(
      "Filter to lessons available in this KS4 tier (foundation/higher). Tier is a programme-factor on the lesson's units; matching a lesson means at least one of its unit entries has this tier. Lessons scope only, KS4.",
    )
    .meta({ examples: ['foundation', 'higher'] }),
```

**What it is for:** Repo-authored conceptual model: tier is a programme-factor on a lesson's units; matches if any unit entry has the tier; KS4 lessons only. Examples foundation, higher.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C077 — SEARCH\_INPUT\_SCHEMA.examBoard (description + examples)

**What it says now:**

```text
examBoard: z
    .string()
    .optional()
    .describe(
      "Filter to lessons offered by this exam board. Exam board is a programme-factor on the lesson's units; matching a lesson means at least one of its unit entries is tagged with this exam board. Lessons scope only.",
    )
    .meta({ examples: ['aqa', 'edexcel', 'ocr'] }),
```

**What it is for:** Repo-authored conceptual model: exam board is a programme-factor on a lesson's units; matches if any unit entry is tagged with it; lessons scope only. Examples aqa, edexcel, ocr.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C078 — SEARCH\_INPUT\_SCHEMA.year (description + examples)

**What it says now:**

```text
year: z
    .union([z.string(), z.number().int().min(1).max(11)])
    .optional()
    .describe('Filter by year group number. Lessons scope only.')
    .meta({ examples: ['3', '7', 10] }),
```

**What it is for:** Constrains year filter to lessons scope and shows numeric/string examples (3, 7, 10).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C079 — SEARCH\_INPUT\_SCHEMA.threadSlug

**What it says now:**

```text
threadSlug: z
    .string()
    .optional()
    .describe('Filter by curriculum thread slug. Lessons scope only.'),
```

**What it is for:** Constrains thread-slug filter to lessons scope.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C080 — SEARCH\_INPUT\_SCHEMA.highlight

**What it says now:**

```text
highlight: z
    .boolean()
    .optional()
    .describe('Include highlighted text snippets in results. Lessons and units scopes.'),
```

**What it is for:** States that highlighted snippets are available for lessons and units scopes only.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C081 — SEARCH\_INPUT\_SCHEMA.minLessons

**What it says now:**

```text
minLessons: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe('Minimum number of lessons a unit must contain. Units scope only.'),
```

**What it is for:** Constrains the minimum-lesson-count filter to units scope only.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C082 — SEARCH\_INPUT\_SCHEMA.phaseSlug (description + examples)

**What it says now:**

```text
phaseSlug: z
    .string()
    .optional()
    .describe('Filter by phase slug. Sequences scope only.')
    .meta({ examples: ['primary', 'secondary'] }),
```

**What it is for:** Constrains phase-slug filter to sequences scope; examples primary, secondary.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C083 — SEARCH\_INPUT\_SCHEMA.category

**What it says now:**

```text
category: z.string().optional().describe('Filter by category. Sequences scope only.'),
```

**What it is for:** Constrains the category filter to sequences scope only.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C084 — SEARCH\_INPUT\_SCHEMA.limit

**What it says now:**

```text
limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of suggestions. Suggest scope only.'),
```

**What it is for:** States the suggestion cap (1-50) applies to suggest scope only.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C103 — EXPLORE\_INPUT\_SCHEMA.query

**What it says now:**

```text
query: z
    .string()
    .describe(
      'The topic to explore. Use descriptive terms like "photosynthesis", "the Romans", "fractions".',
    )
    .meta({ examples: ['volcanos', 'fractions', 'electricity', 'the Romans'] }),
```

**What it is for:** Tells the agent to pass a descriptive topic term and shows canonical example values (volcanos, fractions, electricity, the Romans) shaping how queries are formed.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C104 — EXPLORE\_INPUT\_SCHEMA.subject

**What it says now:**

```text
subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Optional subject filter applied to all scopes')
    .meta({ examples: ['maths', 'science', 'history'] }),
```

**What it is for:** Signals subject is an optional filter applied to all scopes, with examples maths/science/history to steer valid slug selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C105 — EXPLORE\_INPUT\_SCHEMA.keyStage

**What it says now:**

```text
keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Optional key stage filter applied to all scopes')
    .meta({ examples: ['ks2', 'ks3'] }),
```

**What it is for:** Signals keyStage is an optional filter applied to all scopes, examples ks2/ks3 steer valid key-stage selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C124 — USER\_SEARCH\_INPUT\_SCHEMA.query

**What it says now:**

```text
query: z
    .string()
    .describe('Search query text.')
    .meta({ examples: ['photosynthesis', 'adding fractions', 'the Romans'] }),
```

**What it is for:** Describes query as search text with examples (photosynthesis, adding fractions, the Romans) to shape query formation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C125 — USER\_SEARCH\_INPUT\_SCHEMA.scope

**What it says now:**

```text
scope: z
    .enum([...USER_SEARCH_SCOPES])
    .describe('Which index to search: lessons, units, threads, or sequences.')
    .meta({ examples: ['lessons', 'units'] }),
```

**What it is for:** Requires and explains scope as the index to search, enumerating lessons/units/threads/sequences.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C126 — USER\_SEARCH\_INPUT\_SCHEMA.subject

**What it says now:**

```text
subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug.')
    .meta({ examples: ['maths', 'science'] }),
```

**What it is for:** Describes optional subject slug filter with examples maths/science.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C127 — USER\_SEARCH\_INPUT\_SCHEMA.keyStage

**What it says now:**

```text
keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage.')
    .meta({ examples: ['ks2', 'ks3'] }),
```

**What it is for:** Describes optional key stage filter with examples ks2/ks3.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C128 — USER\_SEARCH\_INPUT\_SCHEMA.size

**What it says now:**

```text
size: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of results to return (1-50, default 25).'),
```

**What it is for:** Describes size as max results, communicating the 1-50 bound and default 25 to steer pagination requests.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C129 — USER\_SEARCH\_QUERY\_INPUT\_SCHEMA (query/scope/subject/keyStage/size, grouped duplicate)

**What it says now:**

```text
export const USER_SEARCH_QUERY_INPUT_SCHEMA: z.ZodRawShape = {
  query: z
    .string()
    .describe('Search query text.')
    .meta({ examples: ['photosynthesis', 'adding fractions'] }),
  scope: z
    .enum([...USER_SEARCH_SCOPES])
    .describe('Which index to search: lessons, units, threads, or sequences.')
    .meta({ examples: ['lessons', 'units'] }),
  subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug.')
    .meta({ examples: ['maths', 'science'] }),
  keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage.')
    .meta({ examples: ['ks2', 'ks3'] }),
  size: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Maximum number of results to return (1-50, default 25).'),
};
```

**What it is for:** Second copy of the same five param descriptions for the app-only tool; identical guidance except the query examples drop 'the Romans' (['photosynthesis','adding fractions']).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C140 — BROWSE\_INPUT\_SCHEMA.subject

**What it says now:**

```text
subject: z
    .enum([...SUBJECTS])
    .optional()
    .describe('Filter by subject slug to see what units and lessons are available')
    .meta({ examples: ['maths', 'science', 'english'] }),
```

**What it is for:** Tells the agent the optional subject slug filter narrows the faceted view; examples meta ('maths','science','english') seed likely values in JSON schema.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C141 — BROWSE\_INPUT\_SCHEMA.keyStage

**What it says now:**

```text
keyStage: z
    .enum([...KEY_STAGES])
    .optional()
    .describe('Filter by key stage to see what subjects and content are available')
    .meta({ examples: ['ks2', 'ks3'] }),
```

**What it is for:** Tells the agent the optional keyStage filter narrows to subjects/content at a level; examples meta ('ks2','ks3') seed likely values.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C160 — FETCH\_INPUT\_SCHEMA.id

**What it says now:**

```text
Canonical identifier in format "type:slug" (e.g., "lesson:add-fractions-with-the-same-denominator"
```

**What it is for:** Defines the id parameter as 'type:slug' with five worked examples spanning lesson/unit/subject/sequence/thread, teaching the agent the exact id grammar; examples meta seed JSON-schema examples.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/flat-zod-schema.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C164 — DOWNLOAD\_ASSET\_INPUT\_SCHEMA.lesson (.describe + .meta example)

**What it says now:**

```text
.describe('Lesson slug (e.g. "add-fractions-with-the-same-denominator")')
```

**What it is for:** Tells the agent the 'lesson' arg is a lesson slug and gives a concrete example slug so it formats the value correctly.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C165 — DOWNLOAD\_ASSET\_INPUT\_SCHEMA.type (.describe + .meta examples)

**What it says now:**

```text
type: z
    .enum([...ASSET_TYPES])
    .describe('Asset type to download')
    .meta({ examples: ['slideDeck', 'worksheet', 'video'] }),
```

**What it is for:** Tells the agent the 'type' arg is an asset type and offers example enum values (slideDeck, worksheet, video) to guide selection.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C223 — KEYWORD\_GRAPH\_INPUT.subject

**What it says now:**

```text
.describe('Anchor subject slug (corpus key), e.g. "maths". Required, with keyStage.')
```

**What it is for:** Tells agent subject is a required corpus-key slug (with keyStage), giving an example.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C224 — KEYWORD\_GRAPH\_INPUT.keyStage

**What it says now:**

```text
.describe('Anchor key-stage slug (corpus key), e.g. "ks2". Required, with subject.')
```

**What it is for:** Tells agent keyStage is a required corpus-key slug paired with subject.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C225 — KEYWORD\_GRAPH\_INPUT.unitSlugs

**What it says now:**

```text
unitSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional narrowing: unit slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownUnitAnchors, not errored.',
    ),
```

**What it is for:** Explains optional narrowing and that unknown slugs are reported (not errored).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C226 — KEYWORD\_GRAPH\_INPUT.lessonSlugs

**What it says now:**

```text
lessonSlugs: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional narrowing: lesson slugs (corpus keys) within the anchor. Unknown slugs are reported in unknownLessonAnchors, not errored.',
    ),
```

**What it is for:** Explains optional lesson-level narrowing and unknown-slug reporting.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C227 — KEYWORD\_GRAPH\_INPUT.limit

**What it says now:**

```text
limit: z
    .number()
    .int()
    .min(1)
    .max(MAX_KEYWORD_LIMIT)
    .optional()
    .describe(
      `Optional top-N bound for the ranked keyword page: integer in [1, ${String(MAX_KEYWORD_LIMIT)}], default ${String(DEFAULT_KEYWORD_LIMIT)}.`,
    ),
```

**What it is for:** States the valid top-N range and default for the ranked page.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C235 — MISCONCEPTION\_INPUT.lessonSlugs

**What it says now:**

```text
Lesson anchor: lesson slugs (corpus keys). Each lesson carries at most two misconceptions.
```

**What it is for:** Defines the lesson anchor, states at most two misconceptions per lesson, enforces one-anchor rule.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C236 — MISCONCEPTION\_INPUT.unitSlugs

**What it says now:**

```text
Unit anchor: unit slugs (corpus keys). Returns each unit with every placed lesson
```

**What it is for:** Defines the unit anchor returning every placed lesson with misconceptions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C237 — MISCONCEPTION\_INPUT.threadSlug

**What it says now:**

```text
Thread anchor: one thread slug (corpus key). Returns a unit-granular window
```

**What it is for:** Defines the thread anchor with unit-granular windowed coverage and honest totals.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C238 — MISCONCEPTION\_INPUT.unitOffset

**What it says now:**

```text
unitOffset: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Thread anchor only: index of the first unit in the window. Default 0.'),
```

**What it is for:** States unitOffset is thread-anchor-only with default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C239 — MISCONCEPTION\_INPUT.unitLimit

**What it says now:**

```text
unitLimit: z
    .number()
    .int()
    .min(1)
    .max(MAX_THREAD_UNIT_LIMIT)
    .optional()
    .describe(
      `Thread anchor only: units per window. Default ${String(DEFAULT_THREAD_UNIT_LIMIT)}, maximum ${String(MAX_THREAD_UNIT_LIMIT)}.`,
    ),
```

**What it is for:** States thread-only window size, default and max.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C248 — PRIOR\_KNOWLEDGE\_INPUT.unitSlugs

**What it says now:**

```text
Anchor unit slugs (corpus keys, e.g. from search/fetch results). The result is the bounded
```

**What it is for:** States the anchor is corpus-key unit slugs with unknown-slug reporting.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C249 — PRIOR\_KNOWLEDGE\_INPUT.depth

**What it says now:**

```text
depth: z
    .number()
    .int()
    .min(0)
    .max(MAX_PREREQUISITE_DEPTH)
    .optional()
    .describe(
      `Prerequisite-traversal depth: how many predecessor levels to include. Default ${String(DEFAULT_PREREQUISITE_DEPTH)}, maximum ${String(MAX_PREREQUISITE_DEPTH)}.`,
```

**What it is for:** Explains predecessor traversal depth with default and max.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C254 — THREAD\_PROGRESSIONS\_INPUT.threadSlug

**What it says now:**

```text
threadSlug: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Detail anchor: one thread slug (corpus key). Returns that thread’s full year-ordered unit progression. Exactly one anchor mode per call.',
```

**What it is for:** Defines the detail anchor returning one thread's full year-ordered progression.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C255 — THREAD\_PROGRESSIONS\_INPUT.subject

**What it says now:**

```text
Discovery anchor (with keyStage): a subject slug, e.g. "maths". Returns bounded thread descriptors
```

**What it is for:** Defines the discovery anchor (with keyStage) returning bounded thread descriptors.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C256 — THREAD\_PROGRESSIONS\_INPUT.keyStage

**What it says now:**

```text
Discovery anchor (with subject): a key-stage slug, e.g. "ks2". Returns bounded thread descriptors
```

**What it is for:** Defines the discovery keyStage anchor (with subject).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C430 — decorateObjectWithOakUrl: thread null oakUrl field description

**What it says now:**

```text
const oakUrlField: SchemaObject = useNullType
    ? {
        type: 'null',
        description:
          'Threads are data concepts without Oak URLs on the website. Always null for thread resources.',
      }
```

**What it is for:** Authored OpenAPI response-property description injected on thread schemas explaining that oakUrl is always null for threads, so agents do not expect or fabricate a URL for thread resources.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C431 — decorateObjectWithOakUrl: standard oakUrl field description

**What it says now:**

```text
: {
        type: 'string',
        format: 'uri',
        description:
          'The Oak URL for this resource — a direct, slug-based URL generated by the SDK. Distinct from canonicalUrl, which encodes full curriculum context.',
```

**What it is for:** Authored response-property description injected on non-thread schemas explaining oakUrl is a direct slug-based URL generated by the SDK, distinct from canonicalUrl which encodes full curriculum context — steering agents to pick the right URL field.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C432 — decorateObjectWithOakUrl: oakUrl example value

**What it says now:**

```text
example: 'https://www.thenational.academy/teachers/lessons/example-lesson',
      };
```

**What it is for:** Authored example URL attached to the oakUrl property, showing agents the concrete shape of a generated Oak lesson URL.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C464 — PARAM\_DESCRIPTION\_OVERRIDES['/key-stages/{keyStage}/subject/{subject}/lessons:offset'].correctDescription

**What it says now:**

```text
'/key-stages/{keyStage}/subject/{subject}/lessons:offset': {
    correctDescription: 'Offset applied to lessons within each unit (not to the unit list).',
```

**What it is for:** Replace a swapped/wrong upstream param description so the agent understands `offset` applies within each unit, not to the unit list.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-description-overrides.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C465 — PARAM\_DESCRIPTION\_OVERRIDES['/key-stages/{keyStage}/subject/{subject}/lessons:limit'].correctDescription

**What it says now:**

```text
'/key-stages/{keyStage}/subject/{subject}/lessons:limit': {
    correctDescription:
      'Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.',
```

**What it is for:** Replace the swapped upstream description so the agent understands `limit` caps lessons per unit and empties are omitted.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-description-overrides.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C466 — normaliseParamName

**What it says now:**

```text
/**
 * Normalise an OpenAPI parameter name for MCP-facing schemas.
 *
 * Strips the `Slug` suffix so AI agents see cleaner parameter names
 * (e.g. `threadSlug` becomes `thread`). The canonical OpenAPI name is
 * preserved in internal SDK types and the flat-to-nested transform
 * maps back from the normalised name to the canonical one.
 */
export function normaliseParamName(openApiName: string): string {
  return openApiName.endsWith('Slug') ? openApiName.slice(0, -4) : openApiName;
}
```

**What it is for:** Strip the `Slug` suffix so agents see cleaner MCP param names (threadSlug -> thread) in the input schema; canonical name preserved internally.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-metadata.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

## Words owned elsewhere (50)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C505 — get-key-stages-subject-assets param keyStage

**What it says now:**

```text
/** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
```

**What it is for:** Tell agent allowed key-stage slugs and lowercase casing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C506 — get-key-stages-subject-assets param subject

**What it says now:**

```text
/** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
```

**What it is for:** Tell agent allowed subject slugs and lowercase casing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C507 — get-key-stages-subject-assets param type

**What it says now:**

```text
/** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
```

**What it is for:** Tell agent how the asset type filter maps to a signed download URL endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text, possible-defect-reported
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C508 — get-key-stages-subject-assets param unit

**What it says now:**

```text
/** Optional unit slug to additionally filter by */
```

**What it is for:** Tell agent the optional unit-slug filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C514 — get-key-stages-subject-lessons param keyStage

**What it says now:**

```text
/** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
```

**What it is for:** Allowed key-stage slugs, lowercase casing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C515 — get-key-stages-subject-lessons param subject

**What it says now:**

```text
/** Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
```

**What it is for:** Allowed subject slugs, lowercase casing (variant: 'filter by, e.g. english').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C516 — get-key-stages-subject-lessons param unit

**What it says now:**

```text
/** Optional unit slug to additionally filter by */
```

**What it is for:** Optional unit-slug filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C517 — get-key-stages-subject-lessons param offset

**What it says now:**

```text
/** Offset applied to lessons within each unit (not to the unit list). Default: 0 */
```

**What it is for:** Explain offset applies per-unit, not to the unit list; default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C518 — get-key-stages-subject-lessons param limit

**What it says now:**

```text
/** Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted. Default: 20 */
```

**What it is for:** Explain per-unit limit; units emptied by limit are omitted; default 10.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-lessons.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C524 — get-key-stages-subject-questions param keyStage

**What it says now:**

```text
/** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
```

**What it is for:** Allowed key-stage slugs, lowercase casing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C525 — get-key-stages-subject-questions param subject

**What it says now:**

```text
/** Subject slug to search by, e.g. 'science' - note that casing is important here Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
```

**What it is for:** Allowed subject slugs, casing note (variant: no 'always lowercase').

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C526 — get-key-stages-subject-questions param offset

**What it says now:**

```text
/** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
```

**What it is for:** Explain result offset for pagination; default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C527 — get-key-stages-subject-questions param limit

**What it says now:**

```text
/** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */
```

**What it is for:** Explain result cap; default 10.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C528 — get-key-stages-subject-questions param filter

**What it says now:**

```text
/** Optional filter for question results. Use `images` to return only questions with a question image or image answer. Allowed values: images */
```

**What it is for:** Explain images-only filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C534 — get-key-stages-subject-units param keyStage

**What it says now:**

```text
/** Key stage slug to filter by, e.g. 'ks2' Allowed values: ks1, ks2, ks3, ks4 */
```

**What it is for:** Allowed key-stage slugs (short variant: no casing note).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C535 — get-key-stages-subject-units param subject

**What it says now:**

```text
/** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
```

**What it is for:** Allowed subject slugs, lowercase casing.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C554 — get-lessons-assets param lesson

**What it says now:**

```text
/** The lesson slug identifier */
```

**What it is for:** Tell agent to pass a lesson slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C555 — get-lessons-assets param type

**What it says now:**

```text
/** Optional asset type specifier

Available values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers Allowed values: slideDeck
```

**What it is for:** Explain asset-type filter → signed download URL endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text, possible-defect-reported
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C561 — get-lessons-quiz param lesson

**What it says now:**

```text
/** The lesson slug identifier */
```

**What it is for:** Tell agent to pass a lesson slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C562 — get-lessons-quiz param filter

**What it says now:**

```text
/** Optional filter for question results. Use `images` to return only questions with a question image or image answer. Allowed values: images */
```

**What it is for:** Explain images-only filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-quiz.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C568 — get-lessons-summary param lesson

**What it says now:**

```text
/** The slug of the lesson */
```

**What it is for:** Tell agent to pass a lesson slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C574 — get-lessons-transcript param lesson

**What it says now:**

```text
/** The slug of the lesson */
```

**What it is for:** Tell agent to pass a lesson slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-transcript.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C582 — get-programmes-assets param programme

**What it says now:**

```text
/** The programme slug identifier */
```

**What it is for:** Tell agent to pass a programme slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C583 — get-programmes-assets param offset

**What it says now:**

```text
/** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
```

**What it is for:** Explain result offset for pagination; default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C584 — get-programmes-assets param limit

**What it says now:**

```text
/** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */
```

**What it is for:** Explain result cap; default 10.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C585 — get-programmes-assets param type

**What it says now:**

```text
/** Use this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/assets/\{type\} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
```

**What it is for:** Explain asset-type filter → signed download URL endpoint.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text, possible-defect-reported
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C591 — get-programmes-questions param programme

**What it says now:**

```text
/** The programme slug identifier */
```

**What it is for:** Tell agent to pass a programme slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C592 — get-programmes-questions param offset

**What it says now:**

```text
/** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
```

**What it is for:** Explain result offset for pagination; default 0.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C593 — get-programmes-questions param limit

**What it says now:**

```text
/** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */
```

**What it is for:** Explain result cap; default 10.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C594 — get-programmes-questions param filter

**What it says now:**

```text
/** Optional filter for question results. Use `images` to return only questions with a question image or image answer. Allowed values: images */
```

**What it is for:** Explain images-only filter.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C600 — get-programmes-units param programme

**What it says now:**

```text
/** The programme slug identifier */
```

**What it is for:** Tell agent to pass a programme slug.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C605 — params.programme.describe

**What it says now:**

```text
/** The programme slug identifier */

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ programme: z.string().describe("The programme slug identifier") }) }) });
export const toolMcpFlatInputSchema = z.strictObject({ programme: z.string().describe("The programme slug identifier").meta({ examples: ["english-secondary-year-10-edexcel"] }) });
```

**What it is for:** Tells the agent what to pass for the required programme argument; example 'english-secondary-year-10-edexcel' advertised via .meta.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C614 — params.sequence.describe

**What it says now:**

```text
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") })

sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.").meta({ examples: ["maths-primary"] })
```

**What it is for:** Tells the agent to pass a sequence slug including the KS4 option; example 'english-primary'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C615 — params.year.describe

**What it says now:**

```text
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") })

sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.").meta({ examples: ["maths-primary"] })
```

**What it is for:** Explains the optional year filter and the physical-education-primary all-years special case.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C616 — params.type.describe

**What it says now:**

```text
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") })

sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.").meta({ examples: ["maths-primary"] })
```

**What it is for:** Lets the agent narrow to one asset type and enumerates the allowed values inline in the description.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C621 — params.sequence.describe

**What it says now:**

```text
The sequence slug identifier, including the key stage 4 option where relevant.
```

**What it is for:** Sequence slug argument guidance; example 'english-primary'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C622 — params.year.describe

**What it says now:**

```text
The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.
```

**What it is for:** Optional year filter guidance with physical-education-primary all-years case.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C623 — params.offset.describe

**What it says now:**

```text
If limiting results returned, this allows you to return the next set of results, starting at the given offset point
```

**What it is for:** Explains offset paging semantics (default 0).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C624 — params.limit.describe

**What it says now:**

```text
Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20

Limit the number of lessons, e.g. return a maximum of 300 lessons
```

**What it is for:** Explains the limit param (default 10); note the prose says 'lessons' though the endpoint returns questions.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text, possible-defect-reported
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C625 — params.filter.describe

**What it says now:**

```text
Optional filter for question results. Use `images` to return only questions with a question image or image answer.
```

**What it is for:** Explains the images-only filter option.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-questions.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C630 — params.sequence.describe

**What it says now:**

```text
/** The sequence slug identifier, including the key stage 4 option where relevant. */

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") }), query: z.object({ year: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const).describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.").meta({ examples: ["english-primary"] }), year: z.preprocess((val) => typeof val === 'number' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const)).describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional() });
```

**What it is for:** Sequence slug argument guidance; example 'english-primary'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C631 — params.year.describe

**What it says now:**

```text
/** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. Allowed values: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, all-years */
  readonly year?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | 'all-years';

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") }), query: z.object({ year: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const).describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.").meta({ examples: ["english-primary"] }), year: z.preprocess((val) => typeof val === 'number' && Number.isInteger(val) && val >= 1 && val <= 11 ? String(val) : val, z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const)).describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional() });
```

**What it is for:** Optional year filter (enum 1-11/all-years) with physical-education-primary case.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C636 — params.sequence.describe

**What it says now:**

```text
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier") }) }) });

sequence: z.string().describe("The sequence slug identifier").meta({ examples: ["english-secondary-aqa"] })
```

**What it is for:** Sequence slug argument guidance; example 'english-secondary'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-sequences.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C641 — params.subject.describe

**What it says now:**

```text
/** The slug identifier for the subject Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The slug identifier for the subject") }) }) });
export const toolMcpFlatInputSchema = z.strictObject({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The slug identifier for the subject").meta({ examples: ["art"] }) });
```

**What it is for:** Constrains the subject argument to a closed enum of 17 subject slugs; example 'art'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subject-detail.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C646 — params.subject.describe

**What it says now:**

```text
/** The subject slug identifier Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The subject slug identifier") }) }) });
export const toolMcpFlatInputSchema = z.strictObject({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The subject slug identifier").meta({ examples: ["art"] }) });
```

**What it is for:** Constrains subject argument to the 17-slug enum; example 'art'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-key-stages.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C651 — params.subject.describe

**What it says now:**

```text
/** The subject slug identifier Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The subject slug identifier") }) }) });
export const toolMcpFlatInputSchema = z.strictObject({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("The subject slug identifier").meta({ examples: ["english"] }) });
```

**What it is for:** Constrains subject argument to the 17-slug enum; example 'english'.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-programmes.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C656 — params.subject.describe

**What it says now:**

```text
/** Subject slug to filter by Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';

export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by") }) }) });
export const toolMcpFlatInputSchema = z.strictObject({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by").meta({ examples: ["cooking-nutrition"] }) });
```

**What it is for:** Constrains subject argument to the 17-slug enum; example 'cooking-nutrition'. Note wording 'Subject slug to filter by' differs from siblings.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects-years.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C665 — params.thread (no describe; example only)

**What it says now:**

```text
"thread":{"type":"string","description":"The thread identifier for a given unit","examples":["number-multiplication-and-division"]}

thread: z.string().describe("The thread identifier for a given unit").meta({ examples: ["number-multiplication-and-division"] })
```

**What it is for:** The only agent-facing hint for the required arg is an example; there is NO description text. The flat MCP param is named 'thread' while the SDK path param is 'threadSlug' — a name divergence.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C674 — params.unit.describe

**What it says now:**

```text
export const toolMcpFlatInputSchema = z.strictObject({ unit: z.string().describe("The unit slug").meta({ examples: ["programming-subroutines"] })

examBoard: z.enum(["aqa", "edexcel", "eduqas", "ocr", "wjec", "edexcelb"] as const).describe("Optional exam board slug to narrow the unit to a specific programme variant, e.g. 'aqa'.").meta({ examples: ["aqa"] }).optional()
```

**What it is for:** Guidance for the required unit slug arg; example 'programming-subroutines'. The four optional query params (examBoard/pathway/tier/childSubject) carry NO description — only enum constraints.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** upstream-owned-base-text
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-units-summary.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact

### C714 — McpParameterError describeToolArgs() (PARAMETER\_ERROR)

**What it says now:**

```text
return async (name: ToolName, args: unknown): Promise<ToolExecutionResult> => {
    const descriptor = getToolFromToolName(name);
    const validation = descriptor.toolMcpFlatInputSchema.safeParse(args ?? {});
    if (!validation.success) {
      return err(
        new McpParameterError(descriptor.describeToolArgs(), name, undefined, undefined, {
          code: 'PARAMETER_ERROR',
        }),
      );
    }
```

**What it is for:** On input-schema validation failure the caller receives an McpParameterError whose body is descriptor.describeToolArgs() — the tool's argument description, guiding the caller to correct params.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/stub-tool-executor.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** tool-param-description · **Impact tier:** high-impact
