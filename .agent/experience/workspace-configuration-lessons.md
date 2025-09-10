# Workspace Configuration Lessons

## Date: 2025-08-05

### pnpm Workspace Dependencies

**Learning**: When configuring workspace dependencies for dual-mode operation (local development vs published packages), use `workspace:^` instead of `workspace:*`.

**Context**:

- `workspace:*` locks to exact local version
- `workspace:^` allows version range, automatically replaced with actual version during publish
- This enables local development with source code while published packages use versioned dependencies

**Implementation**:

```json
// In oak-notion-mcp/package.json
"dependencies": {
  "@oaknational/mcp-core": "workspace:^"  // Not workspace:*
}
```

### Turbo Behavior Without --continue

**Learning**: Turbo stops at first task failure by default. Use `--continue` flag to see all errors across workspaces.

**Context**: User was accustomed to `--continue` behavior where all tasks run despite failures. Without it, turbo exits on first error, which can hide issues in other workspaces.

**Best Practice**:

- For development: Use `--continue` to see all issues at once
- For CI: Default behavior (stop on first failure) is often preferred

### Test Script Philosophy

**Learning**: Prefer unified test execution over split commands when tests should always run together.

**Context**: Removed separate `test:unit` and `test:integration` scripts in favor of single `test` command that runs both.

**Rationale**:

- Files still use `.unit.test.ts` and `.integration.test.ts` naming for clarity
- But execution is unified to ensure comprehensive coverage
- Prevents accidentally running only one type of test

**Exception**: E2E tests remain separate (`test:e2e`) because they:

- Use real credentials
- Call real external services
- Should only run when explicitly intended
- Could incur costs or rate limits

### ESLint Exit Codes Are Not "Throwing"

**Learning**: ESLint exiting with code 1 when finding errors is normal behavior, not a crash.

**Context**: Initial confusion about "workspace throwing" vs "finding errors" - ESLint returns non-zero exit codes when it finds lint errors, which is expected behavior, not a configuration problem.

### Semantic Release Version Convention

**Learning**: Use `"version": "0.0.0-development"` for packages that will be published with semantic-release.

**Context**: Both workspace packages use this version as semantic-release will manage actual versioning based on commit messages during the publish process.

## Key Takeaways

1. **Workspace protocols matter**: Choose the right workspace protocol for your publishing strategy
2. **Test organization vs execution**: Organize tests by type, but consider unified execution for comprehensive coverage
3. **Explicit E2E separation**: Keep tests with side effects manually triggered
4. **Tool behavior understanding**: Distinguish between tool exit codes (normal) and actual errors (problems)
5. **Version automation**: Let semantic-release handle versioning rather than manual updates
