# Semantic Search Archive

This directory contains completed and superseded planning documents. These plans have either been finished and closed, or their content has been consolidated into active planning documents.

## Directory Structure

- **completed/** - Plans that have been successfully implemented and closed
- **superseded/** - Plans that have been replaced by newer, consolidated documents

## Archive Organization

### Completed Plans (Successfully Delivered)

Plans in the `completed/` directory represent work that has been:

- Fully implemented
- Validated through testing
- Closed with documented outcomes
- No longer requiring updates or tracking

### Superseded Plans (Consolidated or Replaced)

Plans in the `superseded/` directory have been:

- Consolidated into newer, more comprehensive documents
- Replaced by updated strategies or approaches
- Extracted and distributed to more specific implementation plans
- Kept for historical reference and context

## Accessing Active Plans

For current planning documentation, see:

- [Semantic Search Plans Index](../index.md)
- [High-Level Overview](../semantic-search-overview.md)
- [Search Service Plans](../search-service/)
- [Search UI Plans](../search-ui/)

## Document History

### 2025-12-04: Schema-First Migration Complete

Schema-first migration completed. Obsolete planning documents archived:

**Superseded Plans Archived**:

- search-schema-inventory.md (runtime schemas now generated via `pnpm type-gen`)
- search-migration-map.md (migration sequence complete, all schemas in SDK)

### 2025-11-11: Initial Archive Creation

Reorganization of semantic search plans to create clean, navigable structure:

**Completed Plans Archived**:

- snagging-resolution-plan.md (OpenAI connector alias retirement, closed 2025-10-24)
- snagging-resolution-ui-plan.md
- snagging-system-foundations.md
- snagging-ui.md
- semantic-search-phase-1-ux-plan.md
- semantic-search-phase-1-functionality.md
- semantic-search-phase-1-functionality-context.md
- continuation_prompt_functionality.md

**Superseded Plans Archived**:

- context.md (consolidated into semantic-search-overview.md)
- semantic-search-high-level-plan.md (consolidated into semantic-search-overview.md)
- semantic-search-phase-2-3-plan.md (extracted into search-service and search-ui plans)
- semantic-search-documentation-plan.md (extracted into implementation plans)
- semantic-search-playwright-baseline.md (extracted into search-ui plan)
- fixture-toggle-coverage-matrix.md (extracted into search-ui plan)
- semantic-search-sentry-proposal.md (extracted into observability sections)
- semantic-search-caching-plan.md (extracted into search-service plan)
- oak-components-theme-extensions.md (extracted into search-ui plan)
- semantic-theme-inventory.md (extracted into search-ui plan)
- semantic-theme-spec.md (extracted into search-ui plan)
- semantic-search-responsive-layout-architecture.md (extracted into search-ui plan)
- snagging_files/ (historical working files)

## Notes

When referencing archived plans:

- Use for historical context and decision rationale
- Do not update or extend archived plans
- Create new plans in the active directories if work resumes
- Link to archived plans when documenting evolution of decisions
