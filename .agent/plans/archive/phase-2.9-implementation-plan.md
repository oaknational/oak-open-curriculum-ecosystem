# Phase 2.9 Implementation Plan: Architectural Review & Modularization

## Overview

This plan outlines the systematic approach to analyzing the oak-notion-mcp codebase to identify generic MCP server components that can be extracted into a reusable library, and to map Node.js API usage for edge runtime compatibility.

## Objectives

1. **Identify and categorize** all modules as generic MCP, Notion-specific, or mixed
2. **Map all Node.js API usage** to enable edge runtime compatibility
3. **Create actionable extraction plan** for `oak-mcp-core` library
4. **Document findings** with clear metrics and recommendations
5. **No code changes** - analysis and documentation only

## Timeline: 5 Days

### Day 1: Environment Setup & Initial Analysis

**Goal**: Set up analysis tools and generate initial dependency graphs

**Tasks**:

1. Install analysis tools (madge, ts-morph)
2. Generate dependency graphs
3. Create initial module inventory
4. Set up analysis directory structure

**Deliverables**:

- Dependency graph visualization
- Initial module list with file paths
- Analysis tools configuration

### Day 2: Module Classification

**Goal**: Categorize every module as generic, specific, or mixed

**Tasks**:

1. Analyze each module's imports and exports
2. Identify MCP protocol usage vs Notion API usage
3. Document coupling between modules
4. Calculate complexity metrics

**Deliverables**:

- Complete module classification spreadsheet
- Coupling matrix between modules
- Complexity scores per module

### Day 3: Node.js API Audit

**Goal**: Map all Node.js-specific API usage

**Tasks**:

1. Scan for fs, path, process, crypto usage
2. Identify stdio and transport patterns
3. Analyze replaceability of each API
4. Create runtime compatibility matrix

**Deliverables**:

- Node.js API usage report with locations
- Runtime compatibility matrix
- Replaceability analysis

### Day 4: Extraction Planning

**Goal**: Create detailed plan for extracting generic components

**Tasks**:

1. Design oak-mcp-core API surface
2. Plan extraction phases
3. Identify refactoring requirements
4. Create migration guide outline

**Deliverables**:

- Extraction plan with phases
- API design document
- Migration guide template

### Day 5: Documentation & Review

**Goal**: Compile all findings into comprehensive reports

**Tasks**:

1. Create architecture overview document
2. Generate metrics dashboard
3. Write edge compatibility report
4. Review and refine all deliverables

**Deliverables**:

- Complete analysis report set
- Executive summary
- Recommendations document

## Analysis Methodology

### 1. Static Analysis Tools

```bash
# Install analysis dependencies (dev only)
pnpm add -D madge ts-morph cloc

# Generate dependency graph
npx madge src/ --circular --image .agent/analyses/dependency-graph.svg

# Find circular dependencies
npx madge src/ --circular > .agent/analyses/circular-dependencies.txt

# Generate file structure
find src -name "*.ts" -not -path "*/node_modules/*" | sort > .agent/analyses/file-inventory.txt

# Count lines of code by directory
npx cloc src --by-file --json > .agent/analyses/loc-metrics.json
```

### Analysis Scripts

Create `scripts/analyze-modules.ts`:

```typescript
import { Project } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
});

// Analyze imports for each file
project.getSourceFiles().forEach((sourceFile) => {
  const imports = sourceFile.getImportDeclarations();
  const path = sourceFile.getFilePath();

  const analysis = {
    path,
    imports: imports.map((i) => ({
      module: i.getModuleSpecifierValue(),
      isNodeBuiltin: i.getModuleSpecifierValue().startsWith('node:'),
      isNotionSDK: i.getModuleSpecifierValue().includes('@notionhq'),
      isMCPSDK: i.getModuleSpecifierValue().includes('@modelcontextprotocol'),
    })),
    exports: sourceFile.getExportDeclarations().length,
  };

  console.log(JSON.stringify(analysis));
});
```

### 2. Module Classification Criteria

**Classification Scoring Rubric**:

| Criteria     | Generic (1 point)      | Mixed (0.5 points)       | Specific (0 points)        |
| ------------ | ---------------------- | ------------------------ | -------------------------- |
| Imports      | Only MCP/Node/utility  | Some integration imports | Mostly integration imports |
| Types        | Generic interfaces     | Mixed types              | Integration-specific types |
| Logic        | Protocol/utility logic | Some domain logic        | Domain-specific logic      |
| Dependencies | No integration deps    | Few integration deps     | Heavy integration deps     |
| Reusability  | Any MCP server         | Some adaptation needed   | Not reusable               |

**Score Interpretation**:

- 4-5 points: Generic MCP component
- 2-3.5 points: Mixed (refactoring candidate)
- 0-1.5 points: Integration-specific

**Priority Files to Analyze First**:

1. `src/index.ts` - Entry point
2. `src/server.ts` - Core server setup
3. `src/server-setup.ts` - Server initialization
4. `src/errors/error-handler.ts` - Error handling
5. `src/logging/logger.ts` - Logging infrastructure
6. `src/types/dependencies.ts` - Dependency interfaces
7. `src/config/environment.ts` - Configuration
8. `src/mcp/resources/handlers.ts` - Resource handlers
9. `src/mcp/tools/handlers.ts` - Tool handlers
10. `src/notion/*` - All Notion-specific code

### 3. Complexity Metrics

- **Lines of Code**: Raw size metric
- **Cyclomatic Complexity**: Code path complexity
- **Coupling Score**: Dependencies between modules
- **Cohesion Score**: How well module parts work together

### 4. Node.js API Categories

**File System**:

- `fs.writeFileSync`, `fs.mkdirSync`
- Used in: logging, file reporter

**Process**:

- `process.env`, `process.cwd()`
- Used in: configuration, environment

**Path**:

- `path.join`, `path.dirname`
- Used in: file operations, imports

**Streams**:

- stdio transport
- Used in: MCP communication

## Deliverable Templates

### 1. Module Classification Report

```markdown
# Module Classification Report

## Summary

- Total modules: X
- Generic MCP: Y (Z%)
- Notion-specific: A (B%)
- Mixed: C (D%)

## Detailed Classification

### Generic MCP Components

| Module                | Purpose             | LoC | Complexity | Dependencies |
| --------------------- | ------------------- | --- | ---------- | ------------ |
| src/logging/logger.ts | Logging abstraction | 54  | Low        | consola      |

### Notion-Specific Components

| Module                   | Purpose            | LoC | Complexity | Dependencies     |
| ------------------------ | ------------------ | --- | ---------- | ---------------- |
| src/notion/formatters.ts | Format Notion data | 350 | High       | @notionhq/client |

### Mixed Components (Refactoring Candidates)

| Module        | Generic % | Specific % | Refactoring Strategy |
| ------------- | --------- | ---------- | -------------------- |
| src/server.ts | 70%       | 30%        | Extract base class   |
```

### 2. Node.js API Usage Report

```markdown
# Node.js API Usage Audit

## File System APIs

| API              | Location                        | Purpose    | Edge Alternative  |
| ---------------- | ------------------------------- | ---------- | ----------------- |
| fs.writeFileSync | src/logging/file-reporter.ts:52 | Write logs | KV store or fetch |

## Process APIs

| API         | Location                     | Purpose     | Edge Alternative |
| ----------- | ---------------------------- | ----------- | ---------------- |
| process.env | src/config/environment.ts:15 | Read config | Config injection |
```

### 3. Extraction Plan

```markdown
# oak-mcp-core Extraction Plan

## Phase 1: Pure Utilities (Week 1)

- No breaking changes
- Copy shared types and interfaces
- Create npm package structure

### Modules to Extract:

1. Error handling base classes
2. Type definitions
3. Validation utilities

## Phase 2: Interfaces (Week 2)

- Minor refactoring required
- Extract interfaces from implementations
- Add adapter patterns

### Modules to Extract:

1. Logger interface
2. Configuration interface
3. Test utilities
```

## Quality Assurance

### Validation Checklist

- [ ] Every source file has been classified
- [ ] All Node.js APIs have been documented
- [ ] Dependency graph shows no unexpected cycles
- [ ] Metrics support conclusions
- [ ] Extraction plan is actionable
- [ ] No code changes were made

### Review Process

1. Self-review against objectives
2. Validate metrics accuracy
3. Check documentation completeness
4. Ensure actionability of recommendations

## Risk Mitigation

1. **Analysis Paralysis**: Time-boxed activities, focus on actionable outcomes
2. **Scope Creep**: No code changes, documentation only
3. **Tool Issues**: Manual fallback analysis methods
4. **Missing Context**: Document assumptions clearly

## Success Metrics

1. **Coverage**: 100% of modules classified
2. **Clarity**: Clear extraction path identified
3. **Reusability**: >60% code identified as generic
4. **Actionability**: Concrete next steps defined
5. **Quality**: All deliverables pass review

## Next Steps After Phase 2.9

1. Review findings with team
2. Prioritize extraction work
3. Create oak-mcp-core repository
4. Begin Phase 1 extraction
5. Update oak-notion-mcp to use shared library
