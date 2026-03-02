# Commit Current Work

Create a well-formed commit for the current changes.

## Process

1. **Check status**: Run `git status` to see all changes
2. **Review diff**: Run `git diff` to understand what's being committed
3. **Verify quality gates**: Confirm gates have passed (or run them now)
4. **Stage selectively**: Add relevant files — do NOT blindly `git add .`
   - Never stage `.env`, credentials, or `bulk-downloads/`
   - Review each file being staged
5. **Formulate message**: Use Conventional Commit format, lines under 99 chars
6. **Commit**: Execute the commit
7. **Verify**: Run `git status` to confirm success
8. **Push**: Push to remote (confirm branch first)

## Commit Message Format

```text
type(scope): concise description

Optional body explaining why, not what.
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`

## Safety Rules

**Do NOT modify git history or discard changes.** Prohibited operations:

- `git stash` - can lose uncommitted work
- `git reset` - can discard commits or changes
- `git checkout -- <file>` - discards uncommitted changes
- `git clean` - deletes untracked files
- `git rebase` - rewrites history
- `--no-verify` - bypasses git hooks
- `--force` / `-f` on push - overwrites remote history

If any of these would be helpful, **MUST discuss with the user first**. When in doubt, do not touch the files.

**Additional prohibitions**:

- **Never** force push to main/master
- **Never** amend commits already pushed to remote
- If pre-commit hooks fail, fix the issue properly — no shortcuts

## If Issues Arise

Fix them **properly**. No shortcuts, no disabling checks, no bypassing hooks.

@.agent/directives/rules.md
@.agent/directives/testing-strategy.md
