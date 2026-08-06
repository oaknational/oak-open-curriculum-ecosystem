---
boundary: B1-Governance
doc_role: register
authority: model-behaviour-content-review
status: active
last_reviewed: 2026-08-06
---

# legal-licensing — content review view

> **Generated file — do not edit by hand.** It is rebuilt from the content registry by `pnpm --filter @oaknational/agent-tools build-mcp-content-workspace`. Editing a page here changes nothing an agent sees; change the source file each item names.
>
> **Nothing here has been approved yet.** This workspace exists so the content *can* be reviewed. Wording that appears here is what the system says today, not what anyone has signed off.

Attribution, Open Government Licence v3.0 notices, trademark, and EEF citation obligations.

**20 items.** Of those, 0 are traced to a surface an agent can reach today, 2 to a surface that is retained but switched off, and 1 no longer exist in the codebase. The rest live in code that ships, but this pass has not traced which registered surface carries them — each says so.

[Back to the workspace index](../README.md)

<details>
<summary>How to read an item, and how to see every change made to it</summary>

Each item is quoted at the passage the audit recorded for it. For some items that is a whole document; for others it is one sentence inside a larger file, because that sentence is what was catalogued as a separate piece of content. When an item reads as a fragment, open the file named against it to see it in place — and say so, because a passage that cannot be judged without its surroundings is a finding in itself.

Each item names the file its words live in. To read that file's full history — every change, who made it, and when — run this at the root of the repository, replacing the path with the one the item names:

```bash
git log -p --follow -- packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts
```

</details>

## Words owned in this repository (16)

These are ours to change. An edit here is a normal change to this repository, reviewed like any other.

### C008 — OAK\_API\_ATTRIBUTION

**What it says now:**

```text
export const OAK_API_ATTRIBUTION: SourceAttribution = {
  source: 'Oak Open Curriculum API',
  sourceUrl: 'https://open-api.thenational.academy/',
  licence: 'Open Government Licence v3.0',
  licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  attributionNote:
    'Contains Oak National Academy open curriculum data licensed under the Open Government Licence v3.0.',
};
```

**What it is for:** Machine-readable provenance/licence record placed in \_meta for all unprefixed API-derived resources (thread-progressions, bulk model component) and corpus graph tools; tells agents/users the source, OGL v3.0 licence, and required attribution wording.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C009 — OAK\_KG\_ATTRIBUTION

**What it says now:**

```text
export const OAK_KG_ATTRIBUTION: SourceAttribution = {
  source: 'Oak Curriculum Ontology',
  sourceUrl: 'https://github.com/oaknational/oak-curriculum-ontology',
  licence: 'Open Government Licence v3.0 (data) + MIT (code)',
  licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  attributionNote:
    'Contains data from the Oak Curriculum Ontology by Oak National Academy, licensed under OGL v3.0 (data) and MIT (code).',
};
```

**What it is for:** Provenance/licence record for all oak-kg-\* prefixed resources; states dual OGL v3.0 (data) + MIT (code) licensing and that the ontology is Oak-developed, aligned to the National Curriculum for England (2014) and NOT an official DfE publication.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C010 — EEF\_ATTRIBUTION

**What it says now:**

```text
export const EEF_ATTRIBUTION: SourceAttribution = {
  source: 'EEF Teaching and Learning Toolkit',
  sourceUrl:
    'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
  licence: 'Attribution required',
  licenceUrl:
    'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
  attributionNote:
    'Contains evidence data from the Education Endowment Foundation Teaching and Learning Toolkit. Citation required.',
};
```

**What it is for:** Provenance/licence record for all eef-\* prefixed resources; flags 'Attribution required' and that citation of the EEF Teaching and Learning Toolkit is mandatory.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C206 — recurring source-attribution block (Oak / OGL v3.0)

**What it says now:**

```text
published under the Open Government Licence v3.0

credit Oak National Academy and link to the
relevant thread or unit

credit Oak
National Academy under the Open Government Licence v3.0 for any reproduced
Oak material
```

**What it is for:** Requires the agent to attribute reproduced Oak material to Oak National Academy under Open Government Licence v3.0 with a link, and notes the Oak name/logo are trademarks not covered by OGL.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/continue-progression.md`, `docs://oak/guidance/curriculum-mapping.md`
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/continue-progression.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts`).
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C209 — recurring pedagogy citations (six curriculum principles / Mary Myatt / EEF authors)

**What it says now:**

```text
The approach follows Oak's curriculum threads (after Mary Myatt) and
Oak's six curriculum principles

cite EEF for the evidence
(organisation, the EEF page link, and the named authors)
```

**What it is for:** Grounds the workflow in named Oak pedagogy sources (Emma McCrea's six curriculum principles, Mary Myatt threads) and, in adapt-lesson, requires citing EEF organisation/page/named authors.

- **Can an agent see it?** Dormant — retained in the codebase but not registered, so no agent sees it
- **Reaches an agent through:** `docs://oak/guidance/adapt-lesson.md`, `docs://oak/guidance/curriculum-mapping.md`
- **Flagged for a closer look:** pii-adjacent
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/adapt-lesson.ts`, `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts`).
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C213 — getGettingStartedMarkdown — Documentation link pointer

**What it says now:**

```text
## Documentation

For detailed API documentation, visit: <${serverOverview.documentation}>
```

**What it is for:** Points the reader to external API documentation for detailed reference, interpolating serverOverview.documentation as the destination URL.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-content.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C220 — CURRICULUM\_MODEL\_RESOURCE.\_meta.attribution (OAK\_API\_ATTRIBUTION)

**What it says now:**

```text
_meta: { attribution: OAK_API_ATTRIBUTION },
```

**What it is for:** Attaches Oak API source-attribution metadata to the model resource so consumers can cite/attribute the curriculum source; the attribution copy itself is imported from source-attribution.ts.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C276 — citeSource()

**What it says now:**

```text
function citeSource(): string {
  const { source, licence, coverage } = corpusMeta;
  return [
    '### Source and attribution',
    '',
    `- **Source**: ${source.name} (${source.organisation})`,
    `- **EEF page**: ${source.url}`,
    `- **Authors**: ${source.original_authors.join('; ')}`,
    `- **Licence**: ${licence.name}`,
    `- ${licence.attribution_note}`,
    `- **Coverage**: ${coverage.age_range}; ${coverage.jurisdiction_focus}; ${coverage.evidence_scope}`,
  ].join('\n');
}
```

**What it is for:** Emits full EEF source attribution: source name/organisation, EEF page URL, named authors, licence, licence attribution note, coverage.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Flagged for a closer look:** user-input-interpolation, pii-adjacent, boundary-owner-call
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C289 — officialDocs + oakUrls

**What it says now:**

```text
officialDocs: 'https://open-api.thenational.academy/docs/about-oaks-data/glossary',

oakUrls: {
    description: 'URL patterns for linking to Oak Web Application',
    patterns: {
      lesson: 'https://www.thenational.academy/teachers/lessons/{lessonSlug}',
      unit: 'https://www.thenational.academy/teachers/curriculum/{sequenceSlug}/units/{unitSlug}',
      programme: 'https://www.thenational.academy/teachers/programmes/{programmeSlug}',
      threadFilter:
        'https://www.thenational.academy/teachers/curriculum/{subject}-{phase}/units?threads={threadSlug}',
    },
    examples: [
      'https://www.thenational.academy/teachers/lessons/add-fractions-with-the-same-denominator',
      'https://www.thenational.academy/teachers/programmes/biology-secondary-ks4-foundation-aqa',
      'https://www.thenational.academy/teachers/curriculum/maths-primary/units?threads=geometry-and-measure',
    ],
  },
```

**What it is for:** Points to the official glossary and gives Oak Web Application URL patterns/examples for linking lessons/units/programmes/thread filters.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C351 — curriculum-API doc link sentence

**What it says now:**

```text
For details about the underlying curriculum data, see the

Oak Curriculum API documentation
```

**What it is for:** Points the reader to the Oak Curriculum API documentation for details about the underlying data, attributing the data source.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C352 — GitHub source link sentence (WORKSPACE\_GITHUB\_URL)

**What it says now:**

```text
Browse the MCP server implementation:

code on GitHub
```

**What it is for:** Offers the reader the MCP server implementation source on GitHub (transparency / open-source attribution) via a hardcoded repo path.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/landing-page/components/page-sections.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Moved since the audit baseline (it was in `apps/oak-curriculum-mcp-streamable-http/src/landing-page/render-landing-page.ts`).
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C378 — OAK\_WHO\_WE\_ARE\_URL

**What it says now:**

```text
const OAK_WHO_WE_ARE_URL = 'https://www.thenational.academy/about-us/who-we-are';
```

**What it is for:** Public-site framing source for Oak's official positioning and pillars; carried in oakSources so the agent frames orientation with Oak's official wording.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C379 — OAK\_STRATEGY\_DOCS\_URL

**What it says now:**

```text
const OAK_STRATEGY_DOCS_URL = 'https://www.thenational.academy/about-us/meet-the-team#documents';
```

**What it is for:** Public-site framing source for Oak's strategy, annual plan and impact evaluations; on-interest depth carried in oakSources for the agent's orientation.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C390 — OAK\_URL brand link target

**What it says now:**

```text
const OAK_URL = 'https://www.thenational.academy';
```

**What it is for:** Destination of the brand banner link; where the human is taken when clicking 'Oak National Academy' (via host openLink or native href fallback).

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/BrandBanner.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C489 — renderSources

**What it says now:**

```text
function renderSources(sources?: TDSource[]): string {
  if (!Array.isArray(sources) || sources.length === 0) {
    return '';
  }
  const s = sources[0];
  const loc = `${s.fileName}:${String(s.line)}`;
  if (typeof s.url === 'string' && s.url.length > 0) {
    return `Source: [${loc}](${s.url})`;
  }
  return `Source: ${loc}`;
}
```

**What it is for:** Emit a 'Source: file:line' attribution (optionally a markdown link) for each symbol in the AI doc.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/code-generation/lib/ai-doc-render.ts`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Unchanged since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C717 — app shell experimental-service disclaimer

**What it says now:**

```text
This service is experimental. It uses Oak National Academy content, but AI can make
```

**What it is for:** Tells the human at first widget render that the service is experimental and that AI-assembled output from Oak content is not an official Oak resource — the expectation-setting/trust boundary for the MCP App. Service-scoped, so it lives in the app shell's main content, not the brand banner component.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Added after the audit baseline.
- **Kind of surface:** widget-ui-content · **Impact tier:** high-impact

## Words owned elsewhere (3)

These reach agents through this system but are authored somewhere else. Each item names the repository that owns it; raise changes there, not here.

### C501 — get-key-stages-subject-assets licensing/attribution sentence

**What it says now:**

```text
licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
```

**What it is for:** Instruct agent that lesson content is OGL v3.0 and attribution is required; links to Oak terms.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-key-stages-subject-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C551 — get-lessons-assets licensing/attribution sentence

**What it says now:**

```text
licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
```

**What it is for:** Instruct agent that lesson content is OGL v3.0 and attribution is required; links to Oak terms.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-lessons-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

### C579 — get-programmes-assets licensing/attribution sentence

**What it says now:**

```text
licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms.
```

**What it is for:** Instruct agent that lesson content is OGL v3.0 and attribution is required; links to Oak terms.

- **Can an agent see it?** Not separately traced — the words are in live code, but this pass has not traced which registered surface carries them
- **Where it lives:** `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-programmes-assets.ts`
- **Who owns the words:** The Oak Open Curriculum API spec, in the `oaknational/oak-api` repository. The copy here is generated from it, so editing this repository would be overwritten — change the spec.
- **Since the audit baseline:** The wording has changed since the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact

## Retired (1)

These existed at the audit baseline and have since been removed. They are listed so nothing disappears without a trace.

### C377 — CANONICAL\_SKILL\_URL

**What it said at the audit baseline** (the current wording could not be located automatically — read the source file):

```text
https://raw.githubusercontent.com/oaknational/oak-open-curriculum-ecosystem/main/.agent/skills/under-the-hood/SKILL-CANONICAL.md
```

**What it is for:** Repo-controlled pointer to the canonical orientation method (under-the-hood SKILL-CANONICAL.md on public GitHub main); the agent fetches and follows it. Appears in both the resource\_link and structuredContent so it is model-visible regardless of rendering.

- **Can an agent see it?** Retired — the words no longer exist in the codebase
- **Where it lives:** nowhere — retired (it was in `apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts`).
- **Who owns the words:** This repository — the words are authored here.
- **Since the audit baseline:** Retired — these words were removed from the codebase after the audit baseline.
- **Kind of surface:** source-attribution · **Impact tier:** high-impact
