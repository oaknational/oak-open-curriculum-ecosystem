---
name: Patterns Taxonomy Restructure
overview: Rename `.agent/memory/code-patterns/` to `.agent/memory/patterns/`, establish a formal category taxonomy with governance thresholds, broaden discoverability, and define when patterns are primary documentation versus when they graduate to permanent docs.
todos:
  - id: rename-directory
    content: Rename .agent/memory/code-patterns/ to .agent/memory/patterns/ (git mv for history preservation)
    status: pending
  - id: update-readme
    content: "Rewrite patterns README: new taxonomy, category-grouped index, tag governance thresholds, promotion model, updated frontmatter schema"
    status: pending
  - id: reclassify-patterns
    content: Update category frontmatter in all 29 pattern files to use the new taxonomy
    status: pending
  - id: rename-skill
    content: Rename .agent/skills/code-patterns/ to .agent/skills/patterns/ and broaden trigger conditions
    status: pending
  - id: update-references
    content: "Update all files referencing code-patterns: consolidate-docs, artefact-inventory, practice-index, README, platform adapters, practice-context files"
    status: pending
  - id: validate
    content: Run fitness, subagents:check, portability:check
    status: pending
isProject: false
---

# Patterns Directory Restructure and Taxonomy

## Problem

The `code-patterns` directory name and skill create an unintended bias toward code patterns. The consolidation workflow already extracts all types of patterns ("code patterns, process patterns, architecture patterns, structural observations, agent operational concerns, behavioural rules, domain-specific gotchas"), but the destination directory name signals that only code patterns belong there. Several existing patterns -- "README as Index", "Current Plan Promotion", "Agentic Surface Separation", "Check Driven Development" -- are not code patterns at all.

The `memory/` hierarchy is correct: it houses short-term memory (napkin), medium-term memory (distilled, patterns), and the repo itself is long-term memory (ADRs, governance docs, source code).

## Design Decisions (Confirmed)

- **Location**: Stay under `.agent/memory/`, rename `code-patterns/` to `patterns/`
- **Structure**: Flat now, split into subdirectories when any category exceeds ~10 patterns
- **Tags**: Formal taxonomy with governance thresholds for creating/retiring tags

## 1. Category Taxonomy

Replace the current 6 categories (`type-safety | validation | architecture | testing | error-handling | process`) with 5 broader categories that remove the code bias:

- **`code`** -- How to write implementation code. Type-safety, validation, error-handling, module structure, schema handling.
- **`architecture`** -- How to structure systems, boundaries, and dependencies. Component relationships, layer separation, API design.
- **`process`** -- How to approach engineering decisions and workflows. Evaluation methods, documentation practices, plan management, development methodology.
- **`testing`** -- How to design and structure tests. Test patterns, assertion approaches, fake construction.
- **`agent`** -- How to design and operate agent infrastructure. Surface separation, reviewer patterns, operational rules, agent behaviour.

### Tag Governance

- **New tag**: Requires at least 3 existing patterns that do not fit any existing tag, AND the new tag must be meaningfully distinct from (not a subset of) existing tags. Approved during consolidation step 5 or by the user at any time.
- **Subdirectory threshold**: When any tag exceeds 10 patterns, that category becomes a subdirectory. The top-level README remains the aggregated index.
- **Tag retirement**: When a tag has 0 patterns remaining after reclassification. Retired tags are removed from the schema.

### Reclassification of Existing Patterns

Based on the new taxonomy, the following patterns change category:

| Pattern | Current | Proposed | Reason |
|---|---|---|---|
| readme-as-index | architecture | process | Documentation practice, not system structure |
| current-plan-promotion | architecture | process | Plan lifecycle management |
| agentic-surface-separation | architecture | agent | Agent infrastructure design |
| source-first-adopt-or-explain | process | process | No change |
| check-driven-development | process | process | No change |
| additive-only-schema-decoration | architecture | code | Implementation pattern |
| narrow-re-exports-at-boundaries | architecture | code | Implementation pattern |
| explicit-di-over-ambient-state | architecture | code | Implementation pattern |
| generic-factory-for-di-composition | architecture | code | Implementation pattern |
| pure-leaf-extraction | architecture | code | Module structure |
| indexed-access-subtype-derivation | architecture | code | Type-safety (was misclassified) |
| json-loader-for-large-datasets | architecture | code | Implementation workaround |
| rate-limit-upstream-amplification-vectors | architecture | architecture | Stays |
| sdk-owned-retriever-delegation | architecture | architecture | Stays |

Patterns currently tagged `type-safety`, `validation`, `error-handling` all map to `code`. Patterns tagged `testing` stay as `testing`.

Post-reclassification distribution estimate: `code` (~17), `architecture` (~3), `process` (~4), `testing` (~2), `agent` (~1). Note: `code` is well above the 10-pattern subdirectory threshold from day one, which is expected and fine -- the threshold triggers when a category becomes hard to scan, not immediately upon creation.

## 2. Discoverability

### Broaden the Skill

Rename `.agent/skills/code-patterns/SKILL.md` to `.agent/skills/patterns/SKILL.md`. Broaden the trigger conditions from type-safety/validation/assertion pressure to include:

- Process decisions (how to approach a workflow, evaluation method)
- Agent infrastructure changes (designing skills, rules, reviewers)
- Testing strategy questions (how to structure a test, what to fake)
- Architecture boundary decisions (where to draw module boundaries)

Keep `use_this_when` as the primary discovery mechanism. The skill's step 1 remains "read the README.md to discover available patterns."

### README Structure

Restructure `.agent/memory/patterns/README.md` to group the Pattern Index by category with clear section headings. Each category section gets a one-line description. The flat list of all patterns remains scannable within each section.

### Practice Index Reference

Update `.agent/practice-index.md` `memory/` row from "code patterns" to "patterns (code, process, architecture, testing, agent)".

## 3. Promotion Model: Patterns as Documentation

Patterns that pass the four-criteria barrier (broadly applicable, proven by implementation, prevents a recurring mistake, stable) ARE primary documentation. They do not need to graduate to another format to be authoritative. The barrier IS the quality gate.

However, patterns can evolve into other documentation forms through the existing consolidation cycle:

- **Pattern crystallises into a decision** -> becomes an ADR (the pattern documents how; the ADR documents why we chose this approach). Example: "Agentic Surface Separation" could spawn an ADR recording the decision to separate surfaces.
- **Pattern becomes so fundamental it is a rule** -> becomes a principle in `principles.md` or a standalone rule. Example: if "Infrastructure Never Masks Business" became a universal invariant.
- **Pattern remains a "how-to"** -> stays a pattern. This is the common case and is correct.

Add a "Promotion" section to the README explaining this model. Update consolidation step 7 ("Graduate settled content") to explicitly mention patterns as candidates for graduation alongside distilled.md entries.

## 4. Reference Updates

Files that reference `code-patterns` and need updating:

**Core files** (must update):

- `.agent/memory/code-patterns/README.md` -> rename directory, update content
- `.agent/skills/code-patterns/SKILL.md` -> rename directory, broaden triggers
- `.agent/commands/consolidate-docs.md` -> step 5 path reference
- `.agent/directives/artefact-inventory.md` -> table row
- `.agent/practice-index.md` -> memory row description
- `.agent/README.md` -> if it references code-patterns path

**Platform adapters** (must update):

- `.cursor/skills/code-patterns/SKILL.md` -> rename to `patterns/SKILL.md`
- Any `.claude/`, `.agents/`, `.gemini/` adapters that wrap the skill

**Practice Core / Context** (update references):

- `.agent/practice-core/practice-bootstrap.md` -> if it references code-patterns
- `.agent/practice-context/outgoing/code-pattern-schema-for-discoverability.md` -> rename to reflect broader scope
- `.agent/practice-context/incoming/code-pattern-schema-for-discoverability.md` -> same

**Other files** (grep and update):

- Napkin archives, plan files, experience files that reference `code-patterns` in prose -- update path references where they appear in active (not archived) files

## 5. Frontmatter Schema Update

Update the README's documented schema:

```yaml
category: code | architecture | process | testing | agent
```

Add a "Tag Governance" section documenting the three thresholds (new tag creation, subdirectory promotion, tag retirement).

## 6. Validation

- Run `pnpm practice:fitness` after all changes
- Run `pnpm subagents:check` (skill rename may affect portability)
- Run `pnpm portability:check`
- Verify the skill is correctly discovered by all platform adapters
