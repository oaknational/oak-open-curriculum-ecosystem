# Recovery Instructions

**Created**: 2025-11-05  
**Purpose**: Document how to recover from failed rescue operations

## Safety Snapshot Available

Before beginning the rescue operation, a complete safety snapshot was created.

### Quick Recovery

If the rescue goes wrong and you need to restore the pre-rescue state:

```bash
# WARNING: This will discard any changes on your current branch
git checkout safety/pre-rescue-2025-11-05
```

### Safety Snapshot Details

- **Branch**: `safety/pre-rescue-2025-11-05`
- **Commit**: `66e6115` (or run `git log safety/pre-rescue-2025-11-05` to see latest)
- **Contains**:
  - Rescue plan document (`.agent/plans/rescue-plan-2025-11-05.md`)
  - Updated context files showing RESCUE MODE
  - All recovered work from the 2025-11-04 git disaster
  - HTTP server in working state
  - Logger package in working state
  - Stdio server logging modules (new, awaiting integration)
  - Stdio server wiring.ts (old logger, needs replacement)

### Alternative Recovery Methods

#### Option 1: Create a new branch from safety snapshot

```bash
# If you want to keep your failed attempt and start fresh
git checkout -b rescue-attempt-2 safety/pre-rescue-2025-11-05
```

#### Option 2: Cherry-pick specific files

```bash
# If you only need specific files restored
git checkout safety/pre-rescue-2025-11-05 -- path/to/file
```

#### Option 3: View differences

```bash
# Compare your current state to the safety snapshot
git diff safety/pre-rescue-2025-11-05
```

### What State Is Preserved

The safety snapshot preserves:

1. ✅ **Rescue Plan**: Complete plan with all tranches and acceptance criteria
2. ✅ **Context Docs**: Updated to reflect RESCUE MODE status
3. ✅ **HTTP Server**: Working runtime-config and logger integration
4. ✅ **Logger Package**: Complete browser/node entry point split
5. ✅ **Stdio Logging Modules**: New modules created (need integration)
6. ⚠️ **Stdio Wiring**: Old logger still in use (what needs fixing)

### When to Use Recovery

Use recovery if:

- Rescue operations introduce new errors
- Type system becomes more broken
- Tests start failing in unexpected ways
- Git state becomes corrupted again
- You want to retry the rescue with a different approach

### After Recovery

If you restore the safety snapshot:

1. **Assess what went wrong** in the failed attempt
2. **Update the rescue plan** if needed
3. **Try a different approach** or ask for help
4. **Document the failure** so future attempts can learn

---

## Additional Safeguards

### Git Stash

A stash was also created before the branch:

```bash
# View all stashes
git stash list

# The safety stash should be visible with message:
# "SAFETY_SNAPSHOT_PRE_RESCUE_2025-11-05: Complete state before rescue operation"
```

### Verification

To verify the safety snapshot is intact:

```bash
# Check branch exists
git branch --list safety/pre-rescue-2025-11-05

# Check commit message
git log safety/pre-rescue-2025-11-05 -1

# Check file count (should show 66 files changed)
git show --stat safety/pre-rescue-2025-11-05
```

---

**Remember**: The safety snapshot is your lifeline. Don't delete it until the rescue is complete and validated!
