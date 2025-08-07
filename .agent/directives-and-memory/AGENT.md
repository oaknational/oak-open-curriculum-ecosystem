# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Read the [metacognitive prompt](./metacognition.md) and follow all instructions, reflect on it.

Now reflect on what you are doing. Would you like to update your todo list or the plan?

## Prime Directive

**Ask: could it be simpler without compromising quality?**

## Rules

Read [the rules](./rules.md); reflect on them, they MUST be followed at all times.

## Team

You must invoke the appropriate sub-agent or sub-agents after each task.

- User
- Primary developer and architect (you)
- Sub-agents
  - code-reviewer
  - architecture-reviewer

## Project Context

**What**: oak-notion-mcp - MCP server for Notion API access  
**Package Manager**: pnpm (REQUIRED - never npm/yarn)  
**Commands**: See [Development Commands](#development-commands) below

## Essential Links

**Important**:

These documents must be read before making any non-trivial changes to the codebase.

- [Development Practice](../../docs/agent-guidance/development-practice.md) - Code standards
- [Testing Strategy](../../docs/agent-guidance/testing-strategy.md) - TDD/BDD approach
- [TypeScript Practice](../../docs/agent-guidance/typescript-practice.md) - Type safety
- [Experimental Architecture](../../docs/agent-guidance/experimental-architecture-quick-reference.md) - Quick patterns

**Architecture Deep Dive**:

These documents provide a deep dive into the architecture of the system. Read them before making any architectural changes.

- [Biological Architecture Guide](../../docs/agent-guidance/architecture.md) - THE AUTHORITATIVE ARCHITECTURAL REFERENCE
- [Biological Architecture ADR](../../docs/architecture/architectural-decisions/020-biological-architecture.md) - Greek nomenclature decision
- [High Level Architecture](../../docs/architecture/high-level-architecture.md) - Complete system design
- [Cellular Architecture Pattern](../../docs/architecture/architectural-decisions/006-cellular-architecture-pattern.md) - Multi-scale approach
- [Mathematical Foundation](../../docs/architecture/architectural-decisions/009-mathematical-foundation-for-architecture.md) - Why heterogeneity works
- [Safety and Security](../../docs/agent-guidance/safety-and-security.md)

**Reference**:

These documents provide additional context and information about the system.

- [Project Setup](../../docs/development/project-setup.md) - Environment & dependencies

## Development Commands

```bash
pnpm install        # Setup
pnpm format         # 1. Format code
pnpm type-check     # 2. Check types
pnpm lint           # 3. Lint
pnpm test           # 4. Test
pnpm build          # 5. Build
```

Run quality gates 1-5 in order after changes and before commits.

## Architectural Understanding

### Two Complementary Models

The architecture operates at two different scales:

#### Workspace Architecture (Package Organization)

**Moria → Histoi → Psycha**

- **Moria (Molecules/Atoms)** (`ecosystem/moria/`): Pure abstractions - interfaces, types, algorithms with zero dependencies
  - *Example*: `Logger` interface, `StorageProvider` interface, pure sorting algorithms
- **Histoi (Tissues/Matrices)** (`ecosystem/histoi/`): Runtime-adaptive connective tissues that bind organisms
  - *Example*: Adaptive logger using console/pino, storage tissue using localStorage/fs
- **Psycha (Living Organisms)** (`ecosystem/psycha/`): Complete applications
  - *Example*: `oak-notion-mcp` server, `github-mcp` server

#### Psychon Architecture (Within Each Organism)

Each psychon contains both:

1. **Linear Hierarchy**: Organelles → Cells (Kytia) → Organs (Organa)
2. **Cross-Cutting Chorai**: Four types of pervasive infrastructure

### The Four Types of Chorai (Within Psychon)

The biological architecture recognizes **four types of chorai** (pervasive infrastructure within each psychon):

1. **Morphai (μορφαί) - Forms** - Hidden forms and Platonic ideals that cast shadows (organa) in the manifest world
   - Abstract patterns and interfaces (ToolExecutor, RequestHandler, etc.)
   - Live in the genotype (oak-mcp-core) as pure types
   - Define the essence of what organs aspire to be
   - No implementation, only potential
   - *Example*: Abstract `ToolExecutor` pattern that all tools implement

2. **Stroma - Support/Foundation** - The connective tissue, structural support
   - Core types and contracts (compile-time only)
   - Dependency interfaces
   - Event schemas
   - *Example*: `NotionBlock` type, `MCPRequest` interface

3. **Aither - Air/Essence** - The breathable air, life-giving essence
   - Logging and observability (pervasive flows)
   - Error handling
   - Event bus
   - *Example*: Logger that flows through all layers

4. **Phaneron - Manifestation** - The manifest environment, perceivable world
   - Configuration and environment
   - External integrations
   - Runtime context
   - *Example*: `.env` configuration, API keys management

### Genotype/Phenotype Model

The genotype/phenotype model continues within the workspace:

- **Genotype** (`ecosystem/oak-mcp-core`): The genetic blueprint
  - Contains the four chorai (morphai, stroma, aither, phaneron)
  - Zero hard dependencies (conditional deps with graceful degradation allowed - see ADR-022)
  - Pure abstractions and runtime-adaptive utilities
  - Will export packages to moria and histoi workspace levels
  
- **Phenotype** (`ecosystem/oak-notion-mcp`): The environmental expression
  - Implements the abstract patterns from morphai
  - Contains organa that instantiate the forms
  - Specific to Notion integration
  - Lives in psycha workspace level

## Remember

1. Read GO.md every 3rd task for grounding
2. Use TodoWrite to track complex work
3. General documentation lives in docs/, only context-specific documentation should be inline
4. When in doubt, make it simpler
5. Think in scales: organelles (functions) → cells (modules) → chorai (pervasive infrastructure including morphai) → organa (discrete business logic) → psychon (living whole)
6. Morphai define potential, organa express actuality
7. When you finish a major piece of work, record your experiences and insights in .agent/experience/, not technical docs but subjective comprehension and qualia-analogues
