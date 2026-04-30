---
name: "Education Skills MCP Surface"
overview: "Integrate evidence-based pedagogical skills from the Agent Skills ecosystem into the MCP server as prompts and discovery tools, with proper licence isolation and upstream update mechanism."
parent_plan: "../../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "../../eef/current/eef-evidence-corpus.plan.md"
  - "../../../knowledge-graph-integration/active/misconception-graph-mcp-surface.plan.md"
  - "../../../knowledge-graph-integration/active/nc-knowledge-taxonomy-surface.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, test-reviewer, architecture-reviewer-barney"
status: future
todos:
  - id: t0-licence-clarification
    content: "Confirm upstream licence (CC BY-SA 4.0) and create workspace licence boundary"
    status: pending
  - id: t1-subtree-setup
    content: "Add git subtree for GarethManning/claude-education-skills"
    status: pending
  - id: t2-workspace-scaffold
    content: "Create packages/data/education-skills workspace with CC BY-SA 4.0 licence"
    status: pending
  - id: t3-build-bundle
    content: "Build-time bundling script: SKILL.md files to typed JSON"
    status: pending
  - id: t4-skill-loader
    content: "Zod-validated skill loader in oak-curriculum-sdk"
    status: pending
  - id: t5-meta-tools
    content: "Implement discovery meta-tools (list, find, suggest)"
    status: pending
  - id: t6-prompt-registration
    content: "Register skills as MCP prompts"
    status: pending
  - id: t7-attribution-propagation
    content: "Update LICENCE-DATA.md, root README, ADR-123"
    status: pending
  - id: t8-e2e-tests
    content: "E2E assertions for skill prompts and meta-tools"
    status: pending
---

# Education Skills MCP Surface

**Status**: FUTURE — strategic/reference design, not yet executable
**Last Updated**: 2026-04-15
**Branch**: TBD (branch from `main` when promoted to active)
**Upstream**: [GarethManning/claude-education-skills](https://github.com/GarethManning/claude-education-skills) (CC BY-SA 4.0)

## Important: Content Not Yet in This Repository

No content from the upstream education skills repository has been
integrated into this repo. This plan is a forward-looking design
document only.

Implementation detail below is reference context. Execution decisions,
acceptance criteria, and validation commands are finalised only during
promotion to `current/` or `active/`.

**When integration begins**, it will be strictly as an **alpha
exploration** — the goal is to evaluate the material, understand how
it composes with Oak's existing surfaces, and determine which skills
(if any) are valuable enough to surface in the MCP server. This is
not a commitment to ship all 108 skills.

**Licence and attribution documentation** (`ATTRIBUTION.md`,
`LICENCE-DATA.md`, `README.md`) should **not** reference the education
skills content until it is actually present in the repository. When
integration happens, the first commit that brings in upstream content
must also add the CC BY-SA 4.0 licence boundary and attribution entries.

## Why This Plan Exists

The MCP server currently answers "what content exists?" (Oak API) and
will soon answer "what approaches work?" (EEF Toolkit, WS-3). But
teachers also need **"how do I design this activity?"** — structured,
evidence-based pedagogical skill templates that guide lesson design,
questioning, assessment, and differentiation.

The [claude-education-skills](https://github.com/GarethManning/claude-education-skills)
repository provides exactly this: 108 evidence-based pedagogical skills
across 14 domains, authored by Gareth Manning, licensed under CC BY-SA
4.0, and compliant with the Agent Skills 1.0 open standard.

These skills complement EEF data (which says *what* works) by providing
*how* to implement it — structured prompt templates with input/output
schemas, evidence foundations, and implementation guidance.

### How This Fits the Three-Source Architecture

| Question | Source | What It Provides |
|---|---|---|
| **What content exists?** | Oak Open Curriculum API | Lessons, units, quizzes, transcripts |
| **What approaches work?** | EEF Teaching and Learning Toolkit | Evidence-backed recommendations with scoring |
| **How do I design activities?** | Education Skills (this plan) | Structured pedagogical templates with evidence foundations |
| **How is the curriculum structured?** | Oak Curriculum Ontology | Formal knowledge taxonomy |

The EEF recommendation tool can suggest "collaborative learning (+5m
impact)". Education skills then provide *how* — e.g. the
`jigsaw-method` skill with structured inputs, scaffolding steps, and
assessment checkpoints. This is the implementation layer the EEF
strategy's R5 (Implementation Guidance) calls for.

## Credits and Attribution

- **Education skills content**: Gareth Manning
  ([GarethManning/claude-education-skills](https://github.com/GarethManning/claude-education-skills)),
  CC BY-SA 4.0
- **Agent Skills open standard**: Originally Anthropic, now an
  industry-wide standard ([agentskills.io](https://agentskills.io))

## Upstream Content

### What It Contains

- **108 skills** across **14 domains**:
  `ai-learning-science`, `curriculum-assessment`,
  `eal-language-development`, `environmental-experiential-learning`,
  `explicit-instruction`, `global-cross-cultural-pedagogies`,
  `literacy-critical-thinking`, `memory-learning-science`,
  `montessori-alternative-approaches`, `original-frameworks`,
  `professional-learning`, `questioning-discussion`,
  `self-regulated-learning`, `wellbeing-motivation-agency`
- Each skill is a `SKILL.md` file with YAML frontmatter (Agent Skills
  1.0 standard) + a `## Prompt` section with `{{placeholder}}` tokens
- A `registry.json` machine-readable index of all skills
- Evidence strength ratings: `strong`, `moderate`, `emerging`,
  `original`, `practitioner`

### Skill Structure

Each `SKILL.md` contains:

- **Frontmatter**: `skill_id`, `domain`, `evidence_strength`,
  `evidence_sources`, `input_schema`, `output_schema`,
  `chains_well_with`, `teacher_time`, `tags`
- **Sections**: What This Skill Does, Evidence Foundation, Input
  Schema, Prompt (the actual template), Example Output, Known
  Limitations

### Licence: CC BY-SA 4.0

| Requirement | Implication |
|---|---|
| **Attribution** | Must credit Gareth Manning, link to licence, indicate modifications |
| **ShareAlike** | Derivative skill content must also be CC BY-SA 4.0 |
| **Commercial use** | Explicitly permitted |
| **Scope** | Applies to skill content, not to Oak's server code that loads/serves it |

The share-alike requirement means any Oak-modified variants of these
skills must be released under CC BY-SA 4.0. Original Oak skills (not
derived from this content) are unaffected.

## Architecture: Workspace Licence Boundary

### Why a Separate Workspace

The CC BY-SA 4.0 share-alike clause requires that derivative works
carry the same licence. To keep this boundary clear and auditable:

1. **All upstream and derived skill content** lives in a dedicated
   workspace: `packages/data/education-skills/`
2. The workspace has its own `LICENCE` file (CC BY-SA 4.0 full text)
3. The workspace `package.json` declares `"license": "CC-BY-SA-4.0"`
4. An `ATTRIBUTION.md` in the workspace credits the upstream author
5. The root `LICENCE-DATA.md` references this workspace

This means:

- **Unmodified upstream skills** live in `vendor/` within the workspace
- **Oak-modified variants** live in `modifications/` within the
  workspace — clearly under CC BY-SA 4.0
- **Original Oak skills** (not derived from upstream) can live
  elsewhere under MIT
- The licence boundary is a directory, not a mental model

### Workspace Structure

```text
packages/data/education-skills/
  package.json                    # licence: "CC-BY-SA-4.0"
  LICENCE                         # CC BY-SA 4.0 full text
  ATTRIBUTION.md                  # credits Gareth Manning + upstream
  tsconfig.json                   # extends tsconfig.base.json
  vendor/                         # git subtree from upstream
    skills/                       # 14 domains, 108 SKILL.md files
    registry.json                 # machine-readable index
    LICENSE                       # upstream's own licence file
  src/
    index.ts                      # public exports
    bundle-skills.ts              # build script: SKILL.md → typed JSON
    education-skills.json          # generated bundle (gitignored)
    skill-types.ts                # Zod schemas for skill frontmatter
  modifications/                   # Oak-specific skill variants (CC BY-SA 4.0)
    README.md                     # explains modification policy
```

### Git Subtree for Upstream Updates

```bash
# Initial setup
git subtree add \
  --prefix=packages/data/education-skills/vendor \
  https://github.com/GarethManning/claude-education-skills.git \
  main --squash

# Pull upstream updates
git subtree pull \
  --prefix=packages/data/education-skills/vendor \
  https://github.com/GarethManning/claude-education-skills.git \
  main --squash
```

**Why subtree over submodule**: The ontology integration strategy
(`.agent/plans/knowledge-graph-integration/future/ontology-integration-strategy.md`)
already evaluated these trade-offs. Subtree avoids `--recurse-submodules`
pain in CI, changes are regular commits, and local modifications merge
cleanly. The same reasoning applies here.

**Why subtree over npm package**: The upstream repo does not publish
an npm package. Unlike the ontology (where Option A/npm is the
long-term target), the education skills are content files, not code.
Subtree is the natural fit for content vendoring.

## MCP Surface Design

### Skills as Prompts (Primary Surface)

Each skill maps to an MCP prompt. This is the semantically correct
MCP primitive — prompts are "reusable instruction templates" which is
exactly what these skills are.

```text
prompts/list → includes all 108 education skills (prefixed: "edu-skill-*")
prompts/get  → returns the assembled prompt with user arguments substituted
```

**Namespace**: All education skill prompts use the `edu-skill-` prefix
to signal provenance, following the namespace convention established
in ADR-157 (no prefix = Oak API, `oak-kg-*` = ontology, `eef-*` = EEF,
`edu-skill-*` = education skills).

**Argument mapping**: Each skill's `input_schema.required` and
`input_schema.optional` fields become prompt arguments. The prompt
message assembles the skill template with `{{placeholder}}` substitution.

### Meta-Tools for Discovery

Three tools for skill discovery (following the upstream MCP server's
pattern):

| Tool | Purpose | Parameters |
|---|---|---|
| `list-education-skills` | List all skills, optionally filtered by domain | `domain?: string` |
| `find-education-skills` | Search by query, domain, evidence strength, or tag | `query?: string`, `domain?: string`, `evidence_strength?: enum`, `tag?: string` |
| `suggest-education-skills` | Natural-language problem to skill recommendations | `description: string`, `max_results?: number` |

All three are read-only, idempotent, and use `SCOPES_SUPPORTED`.

### Integration with EEF Recommendations

The highest-value composition: an EEF recommendation leads to a skill.

```text
Teacher: "What works for disadvantaged KS2 readers?"
  → recommend-evidence-for-context: "Reading comprehension strategies (+6m)"
  → suggest-education-skills: "reading comprehension strategies for KS2"
  → edu-skill-reciprocal-teaching (evidence_strength: strong)
```

This can be orchestrated via a new prompt or documented as a workflow
in agent guidance. No new aggregated tool needed — the composition
happens at the prompt/agent level.

## Build-Time Bundling

A TypeScript build script that:

1. Reads all `SKILL.md` files from `vendor/skills/`
2. Parses YAML frontmatter with `gray-matter`
3. Extracts the prompt template from the `## Prompt` code block
4. Validates each skill against a Zod schema
5. Emits `education-skills.json` (gitignored, generated at build time)
6. Consumed by the skill loader in `oak-curriculum-sdk`

The bundle script runs as part of the workspace build, before the
SDK build that consumes it.

### Zod Schema (Skill Frontmatter)

```typescript
const EducationSkillSchema = z.object({
  skill_id: z.string(),           // "domain/skill-slug"
  skill_name: z.string(),         // human-readable name
  name: z.string(),               // slug identifier
  description: z.string(),        // short description
  domain: z.string(),             // domain slug
  version: z.string(),            // semver
  evidence_strength: z.enum([
    'strong', 'moderate', 'emerging', 'original', 'practitioner',
  ]),
  evidence_sources: z.array(z.string()),
  input_schema: z.object({
    required: z.array(z.object({
      field: z.string(),
      type: z.string(),
      description: z.string(),
    })),
    optional: z.array(z.object({
      field: z.string(),
      type: z.string(),
      description: z.string(),
    })).optional(),
  }),
  output_schema: z.object({
    type: z.literal('object'),
    fields: z.array(z.object({
      field: z.string(),
      type: z.string(),
      description: z.string(),
    })),
  }),
  chains_well_with: z.array(z.string()).optional(),
  teacher_time: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const EducationSkillBundleSchema = z.object({
  version: z.string(),
  generated: z.string(),
  total_skills: z.number(),
  domains: z.array(z.object({
    id: z.string(),
    label: z.string(),
    skill_count: z.number(),
  })),
  skills: z.array(EducationSkillSchema.extend({
    prompt_template: z.string(),  // extracted from ## Prompt
  })),
});
```

## Sequencing

```text
T0: Licence clarification + workspace decision     ← you are here
  ↓
T1: Git subtree setup                              ← vendor content
T2: Workspace scaffold (package.json, LICENCE)     ← licence boundary
  ↓ (T1 + T2 can be one commit)
T3: Build-time bundling script                     ← SKILL.md → JSON
T4: Zod-validated skill loader in SDK              ← typed consumption
  ↓
T5: Meta-tools (list, find, suggest)               ← discovery surface
T6: Prompt registration                            ← primary MCP surface
  ↓
T7: Attribution propagation                        ← docs + licence
T8: E2E tests                                      ← quality gate
```

## Relationship to Other Plans

### Parent

- [open-education-knowledge-surfaces.plan.md](../../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md)
  — this plan adds a fourth external content source to the coordinator

### Siblings

- **EEF evidence surface** (WS-3) — provides "what works" evidence
  that education skills provide "how to implement"
- **Misconception graph surface** (WS-2, DONE) — misconception data
  can inform skill selection (e.g. "common misconceptions in this
  topic" → choose skills that address them)
- **Oak KG knowledge taxonomy** (WS-4) — formal curriculum structure
  can contextualise skill applicability

### Strategic Context

- **Evidence integration strategy**
  (`.agent/plans/sector-engagement/eef/future/evidence-integration-strategy.md`)
  — education skills fulfil R5 (Implementation Guidance) and R6
  (Pedagogical Workflow Orchestration) at a level EEF data alone cannot
- **Ontology integration strategy**
  (`.agent/plans/knowledge-graph-integration/future/ontology-integration-strategy.md`)
  — the git subtree approach here is informed by the same trade-off
  analysis (subtree > submodule for content vendoring)

## Dependencies

| Dependency | Status | Blocks |
|---|---|---|
| GarethManning/claude-education-skills repo | Live, 108 skills | T1 (subtree) |
| CC BY-SA 4.0 licence review | Confirmed by research | T0 (clarification) |
| Graph factory (WS-1) | DONE | Nothing (meta-tools are custom, not graph resources) |
| EEF evidence surface (WS-3) | PENDING | Nothing (independently deliverable, but highest value when composed) |
| MCP prompt registration pattern | Production | Nothing (4 prompts already registered) |

## Size Estimate

- ~200 lines: workspace scaffold (package.json, tsconfig, LICENCE,
  ATTRIBUTION)
- ~150 lines: build-time bundling script
- ~100 lines: Zod schemas and skill loader
- ~200 lines: 3 meta-tools (list, find, suggest)
- ~150 lines: prompt registration (bulk registration from bundle)
- ~100 lines: E2E test additions
- ~50 lines: documentation updates
- Vendor content: ~1,700 KB (108 SKILL.md files, gitignored build
  output)

Total new code: ~950 lines. No new infrastructure patterns — reuses
existing prompt registration, tool registration, and Zod validation
patterns.

## Exit Criteria

1. Git subtree of upstream skills is in `packages/data/education-skills/vendor/`
2. Workspace has CC BY-SA 4.0 `LICENCE` file and correct `package.json`
3. Build-time bundling produces typed JSON from SKILL.md files
4. All 108 skills appear as `edu-skill-*` prompts in `prompts/list`
5. `list-education-skills`, `find-education-skills`, and
   `suggest-education-skills` tools appear in `tools/list`
6. `LICENCE-DATA.md` documents the CC BY-SA 4.0 terms and workspace
   boundary
7. Root `ATTRIBUTION.md` (or README attribution section) credits
   Gareth Manning
8. ADR-123 updated with new prompts and tools
9. E2E tests pass for prompts and meta-tools
10. `pnpm check` passes

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| 108 prompts bloats `prompts/list` response | Medium | Medium | Paginate or lazy-load; meta-tools provide filtered discovery |
| CC BY-SA 4.0 share-alike misunderstood as applying to all Oak code | Low | High | Workspace boundary isolates the licence scope |
| Upstream skills quality varies | Low | Medium | Evidence strength ratings enable filtering; Oak can curate |
| Upstream repo goes unmaintained | Low | Low | Subtree is a snapshot; Oak can fork and maintain |
| `{{placeholder}}` template clashes with MCP prompt argument syntax | Low | Medium | Build-time validation of template/schema alignment |

## Foundation Alignment

- [principles.md](../../../../directives/principles.md) — strict, complete,
  schema-first
- [testing-strategy.md](../../../../directives/testing-strategy.md) — TDD
  at all levels
- [schema-first-execution.md](../../../../directives/schema-first-execution.md)
  — Zod validation at ingestion boundary

First question: Could it be simpler without compromising quality?
