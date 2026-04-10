# Agent Lifecycle Automation Plan

**Status**: FUTURE (Low Priority)  
**Priority**: Nice to have - improves DX but not critical  
**Created**: 2025-11-11  
**Owner**: Engineering

## Purpose

Create an automated agent lifecycle plugin that maintains repository hygiene by:

1. **Detecting** when uncommitted changes exceed a threshold
2. **Capturing** current progress and goals to planning documents
3. **Running** quality gates to ensure repo is in good state
4. **Tidying** any issues found
5. **Committing** changes with meaningful commit messages

**Goal**: Prevent "chaotic repo state" by keeping the number of changed files small and ensuring regular, high-quality commits.

## Problem Statement

**Current Challenge**: During extended agent sessions:

- Many files accumulate changes (10+, sometimes 50+)
- Quality gates get skipped in favor of "just one more feature"
- Commit messages become vague ("wip", "updates", etc.)
- Context switches become expensive (what was I doing?)
- Recovery from errors is harder (more state to reconstruct)

**Impact**:

- Harder to review changes
- Harder to bisect issues
- Harder to resume work after interruption
- Lower overall code quality

## Vision

**Small Threshold** → **Minimal Cleanup** → **Frequent Commits** → **Clean Repo State**

Example flow:

1. Agent makes 8 file changes
2. Threshold triggered (e.g., 10 files changed)
3. Plugin captures: "Implementing OAuth middleware - added Clerk integration, updated tests"
4. Plugin runs: `pnpm check`
5. Plugin finds 2 linting issues, fixes them
6. Plugin commits: "feat(auth): implement Clerk OAuth middleware
   - Add Clerk auth middleware with JWT verification
   - Update CORS configuration for OAuth flows
   - Add integration tests for auth scenarios
   - Fix linting issues in security.ts and middleware.ts"

7. Repo returns to clean state
8. Agent continues work

## Design Principles

1. **Non-Intrusive**: Plugin observes, doesn't interrupt critical work
2. **Intelligent**: Understands context from file changes and recent messages
3. **Safe**: Never commits if quality gates fail
4. **Transparent**: Logs all actions clearly
5. **Configurable**: Threshold and behavior adjustable per project

## Architecture

### Trigger Mechanism

**Option A: File Watcher** (Recommended)

- Watch `git status --porcelain` output
- Count modified/staged/untracked files
- Trigger when count exceeds threshold

**Option B: Command Hook**

- Intercept tool calls
- Count cumulative file operations
- Trigger after N file edits

**Option C: Time-Based**

- Check every N minutes of agent activity
- Trigger if changes detected

### Context Capture

**Sources**:

1. **Recent user messages**: Last 3-5 messages to understand goals
2. **File diffs**: Summary of what changed (not full diffs)
3. **Plan documents**: Check if any plan was being followed
4. **Commit history**: Recent commits for context

**Output**:

- Commit message (conventional commits format)
- Optional: Update to relevant plan's "Current State" section

### Quality Gate Execution

**Sequence**:

1. `pnpm install` (if package.json changed)
2. `pnpm sdk-codegen` (if OpenAPI schema changed)
3. `pnpm build` (ensure no build errors)
4. `pnpm type-check` (ensure type safety)
5. `pnpm lint -- --fix` (auto-fix linting issues)
6. `pnpm format` (format code)
7. `pnpm test` (run unit tests)

**Failure Handling**:

- If any step fails: Capture error, report to user, DO NOT commit
- User can override: "commit anyway" or "let me fix this"

### Commit Message Generation

**Format**: Conventional Commits

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, refactor, test, docs, chore, style, perf

**Scope**: Inferred from file paths

- `apps/oak-curriculum-mcp-*` → `mcp`
- `packages/sdks/oak-curriculum-sdk` → `sdk`
- `packages/libs/logger` → `logger`
- `.agent/plans` → `plans`
- `docs` → `docs`

**Subject**: Extracted from user messages and code changes

**Body**: Bulleted list of key changes

**Example**:

```
feat(mcp): add OAuth 2.1 support with Clerk integration

- Implement Clerk auth middleware with JWT verification
- Add PKCE flow support for secure authorization
- Configure CORS for OAuth redirect flows
- Add integration tests for authenticated requests
- Update landing page with OAuth documentation links

Closes #42
```

### Integration Points

**As Cursor Extension** (if possible):

- Use Cursor Extension API to hook into agent lifecycle
- Access file system, git, and terminal
- Minimal user config in settings

**As Standalone Tool** (fallback):

- Separate process monitoring workspace
- Communicate with agent via MCP protocol
- Requires manual setup

**As Agent Prompt** (simplest):

- Add to system prompt: "After modifying 10 files, run quality gates and commit"
- Relies on agent following instructions
- No code needed, but less reliable

## Implementation Plan

### Phase 1: Proof of Concept (2-3 days)

**Goal**: Validate the concept with a simple script

**Tasks**:

1. Create `scripts/agent-lifecycle-check.ts`
2. Implement file change detection via `git status`
3. Implement simple commit message generation
4. Test with manual trigger
5. Gather feedback

**Acceptance**:

- ✅ Script detects changed files
- ✅ Script generates reasonable commit messages
- ✅ Manual trigger works

### Phase 2: Quality Gate Integration (2-3 days)

**Goal**: Integrate with existing quality gates

**Tasks**:

1. Add quality gate execution to script
2. Implement error handling and reporting
3. Add dry-run mode for testing
4. Test with various failure scenarios
5. Document usage

**Acceptance**:

- ✅ Quality gates run correctly
- ✅ Failures prevent commits
- ✅ Dry-run shows what would happen

### Phase 3: Context-Aware Commits (3-5 days)

**Goal**: Generate better commit messages using context

**Tasks**:

1. Implement diff summarization
2. Parse user messages for intent
3. Detect scope from file paths
4. Generate conventional commit format
5. Add tests for message generation

**Acceptance**:

- ✅ Commit messages follow conventions
- ✅ Messages accurately describe changes
- ✅ Scope detection works correctly

### Phase 4: Automation & Integration (5-7 days)

**Goal**: Automate the lifecycle plugin

**Tasks**:

1. Implement file watcher
2. Add threshold configuration
3. Integrate with agent workflow
4. Add user override options
5. Write comprehensive documentation

**Acceptance**:

- ✅ Plugin triggers automatically
- ✅ Threshold configurable
- ✅ User can override/skip
- ✅ Documentation complete

### Phase 5: Polish & Observability (2-3 days)

**Goal**: Make plugin production-ready

**Tasks**:

1. Add structured logging
2. Add metrics (commits per session, files per commit)
3. Create dashboard/summary
4. Optimize performance
5. Add telemetry (optional)

**Acceptance**:

- ✅ Logging comprehensive
- ✅ Metrics tracked
- ✅ Performance acceptable

## Configuration

### .agent/lifecycle.config.json

```json
{
  "enabled": true,
  "threshold": {
    "filesChanged": 10,
    "checkIntervalMinutes": 5
  },
  "qualityGates": {
    "required": ["build", "type-check", "lint", "format"],
    "optional": ["test"],
    "failureAction": "report"
  },
  "commit": {
    "autoCommit": false,
    "requireUserApproval": true,
    "conventionalCommits": true,
    "signCommits": true
  },
  "planning": {
    "updatePlans": true,
    "updateContext": true
  }
}
```

### Usage

**Manual Trigger**:

```bash
pnpm agent-lifecycle-check
```

**Automatic** (via watcher):

```bash
pnpm agent-lifecycle-watch
```

**Dry Run**:

```bash
pnpm agent-lifecycle-check --dry-run
```

## Example Scenarios

### Scenario 1: Feature Implementation

**State**: 12 files changed (threshold: 10)
**Context**: User message "Add OAuth support"
**Files**: auth-middleware.ts, security.ts, 8 test files, 2 config files

**Plugin Actions**:

1. Detects 12 files changed
2. Captures context: "Adding OAuth support"
3. Runs quality gates: ✅ All pass
4. Generates commit:

   ```
   feat(auth): implement OAuth 2.1 support

   - Add auth middleware with JWT verification
   - Update security configuration for OAuth flows
   - Add integration tests for auth scenarios
   - Update server configuration
   ```

5. Commits changes
6. Reports: "✅ Committed 12 files with message: feat(auth): implement OAuth 2.1 support"

### Scenario 2: Bug Fix

**State**: 3 files changed
**Context**: Below threshold
**Action**: No trigger, agent continues

### Scenario 3: Quality Gate Failure

**State**: 8 files changed (approaching threshold)
**Context**: Type errors detected
**Plugin Actions**:

1. Runs quality gates
2. `pnpm type-check` fails
3. Reports errors to agent
4. Does NOT commit
5. Agent fixes errors
6. Next trigger will succeed

## Success Criteria

1. ✅ Plugin detects file changes accurately
2. ✅ Threshold triggering works reliably
3. ✅ Quality gates run and enforce standards
4. ✅ Commit messages are clear and conventional
5. ✅ Failures prevent bad commits
6. ✅ User can override when needed
7. ✅ Performance impact minimal
8. ✅ Documentation complete

## Risks and Mitigation

**Risk**: Plugin commits at bad times (mid-feature)

- **Mitigation**: User approval required; dry-run mode; configurable threshold

**Risk**: Quality gates too slow

- **Mitigation**: Make optional tests opt-in; parallel execution where possible; timeout limits

**Risk**: Commit messages are poor quality

- **Mitigation**: User review before commit; learn from user corrections; configurable templates

**Risk**: Plugin causes more interruption than help

- **Mitigation**: Make entirely optional; extensive config options; easy disable

**Risk**: File watcher resource intensive

- **Mitigation**: Efficient polling; debounce checks; only watch git-tracked files

## Future Enhancements

- **AI-powered commit messages**: Use LLM to generate even better messages
- **Smart scope detection**: Learn from past commits
- **Branch management**: Auto-create feature branches
- **PR automation**: Create draft PRs for review
- **Stacking**: Support stacked PRs workflow
- **Team sync**: Coordinate with other agents/developers
- **Metrics dashboard**: Track commit quality over time
- **Learning mode**: Improve based on user feedback

## Related Plans

- `developer-experience/` - SDK publishing and docs tooling
- `developer-experience/sdk-publishing-and-versioning-plan.md` - Related to commit/release workflow
- `icebox/contract-testing-schema-evolution.md` - Quality gates (iceboxed)

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Cursor Extension API](https://docs.cursor.com/extensions) (if available)

## Notes

This is a **nice-to-have** feature, not critical for the project. Implement only if:

1. Time permits
2. Team finds manual process too burdensome
3. Value clearly demonstrated in PoC

For now, keeping the backlog item as a future idea is sufficient.
