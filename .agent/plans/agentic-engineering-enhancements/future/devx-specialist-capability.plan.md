# Developer Experience Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

This repo has a rich set of internal packages, SDKs, CLIs, and development
workflows. The OOCE specialist answers "are you using the libraries correctly?"
and the architecture reviewers answer "is the structure sound?" — but nobody
asks **"how does it feel to work with this?"**

Developer experience is a distinct lens: ergonomics, discoverability, feedback
loops, error messages, documentation quality, CLI usability, SDK developer
journey, and friction points. Without a dedicated specialist, agents:

- Produce CLIs with inconsistent flags, poor help text, or missing progress
  indicators
- Create SDK interfaces that are technically correct but awkward to use
- Miss onboarding friction (confusing setup steps, unclear error messages,
  undiscoverable features)
- Don't consider the developer's journey through the codebase as a whole

## Scope

### Four Broad Areas

#### 1. Working with the Code

- Code readability and navigability
- Error message quality (actionable, specific, with next steps)
- Naming clarity (functions, variables, types, files)
- Import ergonomics and barrel file discoverability
- IDE experience (type-ahead, go-to-definition, hover docs)
- Build and test feedback loops (speed, clarity of failures)

#### 2. Working with the Repo

- Onboarding friction (first clone to first successful build/test)
- Documentation findability and accuracy
- Workspace navigation and discoverability
- Script naming consistency (`pnpm` task names, turbo tasks)
- Configuration ergonomics (env files, local dev setup)
- This area largely defers to the OOCE specialist for internal package
  correctness — DevX cares about the *experience* of using those packages,
  not whether the usage is technically correct

#### 3. Working with the SDKs

- Public API surface design (naming, consistency, progressive disclosure)
- Type ergonomics (are types helpful or obstructive?)
- Error handling developer journey (Result pattern discoverability,
  error type clarity)
- Documentation completeness (README, TSDoc, examples)
- Stub/test mode usability for consumers
- Breaking change communication

#### 4. Working with the CLIs

- Command naming and flag consistency
- Help text quality and discoverability
- Progress indicators and feedback during long operations
- Error output quality (structured, actionable, distinguishes user error
  from system error)
- Dry-run mode consistency and fidelity
- Output format options (human-readable vs structured JSON)
- Exit code semantics

### Out of scope

- Internal package API correctness (OOCE specialist owns this)
- Dependency direction and boundary structure (architecture reviewers own this)
- Security implications of error messages (security-reviewer owns this)
- Test structure and TDD compliance (test-reviewer / TDD specialist own this)
- Generic code quality (code-reviewer owns this)

## Doctrine Hierarchy

This specialist is unusual — it has no single external authority. Its doctrine
comes from established DX principles applied to this repo's specific context:

1. **This repo's existing conventions** — the primary authority for what
   consistency means here
2. **User feedback and friction reports** — direct evidence of DX issues
3. **Industry DX best practice** — CLI design (12-factor CLI), SDK design
   (stripe-style progressive disclosure), error message design
4. **Repository ADRs** — ADR-078 (DI), ADR-051 (logging), and others that
   have DX implications
5. **Onboarding reviewer findings** — evidence of where newcomers get stuck

## Deployment Context

**Monorepo with multiple consumer surfaces**. Key constraints:

- SDKs are consumed by MCP apps and potentially external consumers
- CLIs are used by developers (human and AI agent) in local and CI contexts
- The repo itself is worked on by both humans and AI agents — DX applies to
  both audiences
- AI agent DX is a first-class concern (clear error messages, structured
  output, deterministic behaviour all matter for agent consumers)

## Relationship to OOCE Specialist

| Specialist | Lens | Question |
|-----------|------|----------|
| **OOCE** | Correctness | "Are you using Result<T, E> correctly?" |
| **DevX** | Ergonomics | "Is the Result<T, E> pattern discoverable and pleasant to use?" |
| **OOCE** | Contracts | "Does this use the env resolution strategy?" |
| **DevX** | Friction | "Is the error message when env resolution fails helpful?" |

They complement each other. OOCE is the avatar of the repo's *contracts*;
DevX is the avatar of the repo's *users*.

## Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/devx-reviewer.md`
2. Canonical skill: `.agent/skills/devx-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-devx-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)
5. Discoverability updates
6. Validation

## Review Checklist (Draft)

### Code DX

1. Are error messages actionable (include what went wrong, why, and what to do)?
2. Are names self-documenting without requiring context lookup?
3. Is the import structure navigable (no deep relative paths, barrel files work)?

### Repo DX

4. Can a new developer go from clone to green tests in under 5 minutes?
5. Are `pnpm` scripts named consistently and documented?
6. Is configuration discoverable (env templates, example files)?

### SDK DX

7. Does the public API follow progressive disclosure (simple things simple,
   complex things possible)?
8. Are types helpful (guide the developer) rather than obstructive
   (require casting)?
9. Is stub/test mode easy to discover and use?

### CLI DX

10. Does `--help` provide enough information to use the command without
    other documentation?
11. Are progress indicators present for operations > 2 seconds?
12. Does error output distinguish user error from system error?
13. Is dry-run mode available and faithful to real behaviour?

## Overlap Boundaries

| Specialist | Owns | Does NOT own |
|-----------|------|-------------|
| **devx-reviewer** | Ergonomics, discoverability, feedback loops, error quality, CLI/SDK usability | Correctness of internal API usage, boundary structure, security |
| **ooce-reviewer** | Internal API correctness, composition patterns | How pleasant those APIs are to use |
| **onboarding-reviewer** | First-time onboarding journey | Ongoing daily DX friction |
| **code-reviewer** | General code quality, gateway triage | DX-specific ergonomic assessment |
| **architecture reviewers** | Structural correctness, dependency direction | Whether the structure is pleasant to navigate |

## Promotion Trigger

This plan promotes to `current/` when:

1. SDK or CLI work is scheduled that would benefit from DX review
2. No conflicting work is in progress on the agent artefact layer
