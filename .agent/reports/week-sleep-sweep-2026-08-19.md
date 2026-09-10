# Week-sleep sweep — every piece of work pushed and PR-carried (2026-08-19)

Owner word (2026-08-19 ~15:2xZ, to the Director seat and, in parallel, to the
design and repo-architecture seats): *make sure that ALL work is pushed and
either in a draft or open PR* — the estate's preparation for a week of
dormancy. This record is the sweep's evidence: what was surveyed, what was
found, what was done, and what was deliberately left where it was. Run by the
Director seat (Avocet guards Updraft, `44e2ca`); the design lane swept its own
worktrees in parallel (draft PR #918) and the repo-architecture seat opened the
coordination branch's draft fold PR (#915).

## Method

1. Every git worktree of the primary checkout (47 at the time of the sweep,
   `git worktree list --porcelain`): branch, ahead/behind its remote, dirty
   file count. A branch with no remote counterpart was classified by
   `git rev-list origin/main..<branch>` AND `git cherry origin/main <branch>`
   (patch-equivalence) — never by name-status (`pre-merge-divergence-analysis`
   §Derive merge risk from content).
2. Every local branch without a worktree (`git branch -vv`).
3. Every remote branch carrying commits not in `origin/main`, mapped to the
   open-PR head list; PR-less ones checked for closed/merged PR history and
   author.
4. Every dirty worktree's files compared byte-for-byte against `origin/main`.
5. The object store's dangling commits (`git fsck --no-reflogs --lost-found`)
   sampled by date; the owner's second clone
   (`oak-open-curriculum-ecosyste-2`) inventoried read-only.

Exit codes were read in-band throughout; one self-caught false red (a zsh
shell reading `PIPESTATUS`) is in the napkin.

## Findings and dispositions

### Worktrees (47)

- **44 clean.** Every worktree branch is either pushed and in sync with its
  remote, or its remote is gone because the work is fully contained in
  `origin/main` (rev-list 0 AND cherry 0 for all 32 such branches — merged
  lanes whose branches were pruned; merged work is preserved, branches are
  not).
- **Primary** (`coordination/2026-08-19-1651ad`): clean, in sync at the
  remote tip, carried by draft fold PR **#915** (opened by Poppy at owner
  word; the Director's fold leg marks it ready and lands it — no second PR).
- **5 dirty at survey time**, each item inspected:
  - `w01-census` (`jimcresswell/design-w01-census`): untracked
    `W01-CYCLE-PLAN-v2.md` + `design-census/census-types.ts` — **preserved by
    the design lane** as report artefacts (`0e59bafa9`, pushed, draft PR
    **#918**). Worktree now clean.
  - `design-plan-truings` (`jimcresswell/design-plan-ratification-and-truings`):
    a STAGED copy of `.agent/reports/design/oak-components-capability-floor-2026-08-05.md`
    — an OLDER draft (73 lines, 2026-08-05) of a file that landed on `main`
    in evolved form (94 lines, `74cffbf85`, 2026-08-08 "absorb the PR-review
    findings"). Residue, no work to preserve. Left in place (design lane's
    worktree; nothing staged by this seat).
  - `pr-891-macos-validation` (`claude/objective-nightingale-b4ba25`, Luke's
    #891): untracked `.run-macos-validation.sh`, an 8-line local runner
    (install + `pnpm check` with logs) used for the macOS validation leg.
    Local tooling, not work product. Left in place.
  - `vitest-config-workspace` (`jimcresswell/vitest-config-workspace`,
    workspace-config-isolation lane, left 2026-08-09..13): two oak-eslint
    edits — enable `import-x/no-relative-packages: 'error'` for config files
    and drop the two `tsup.config` ignore hatches. **Red on its own base**
    (the worktree pre-commit gate fails: graph-core/graph-ingest/graph-project
    configs still import root bases by relative path there), so it cannot be
    committed as found without `--no-verify`. The intent survives the lane
    (the de-hatch arc is its recorded pickup) and the depcruise boundary
    rules now carry the relative-escape class on `main`. Preserved HERE as
    the full diff (§Appendix A); the worktree is left as found.
  - `mcp-567-vendor-symlinks` (`jimcresswell/mcp-567-vendor-skill-symlinks`):
    a 110-line test block appended to
    `carriage-hardening.integration.test.ts` describing vendored-projection
    behaviour through a `lockedIds` option. **Premise removed on `main`**:
    `lockedIds` was introduced at `8da3c7f50` and removed at `e18332bac`
    (#865, "scope skills validation to the Practice class it owns"), so the
    block is red by construction against current product code. Its three
    behaviours (lock-pinned symlink replaced by a real projected directory
    with the target surviving; every vendored byte carried, steady-state
    clean; executable bit preserved) are recorded verbatim in §Appendix B for
    whoever reopens vendored projection. Worktree left as found.

> **Addendum (2026-09-02, Finch calls Pinnacle, routed off PR #915's review):** the
> heading above says 47 worktrees; the section records 44 clean, the primary, and 5
> dirty at survey time (one of the five became clean during the sweep), without
> stating which rows the heading's total counts. The 44 are not enumerated here and
> the worktrees have since been pruned, so the total cannot be re-derived from the
> rows: read the heading as recorded and the per-class figures as the evidence. The
> 19 August text stands unedited.

### Pushed branches without a PR

- **Our fleet (jimbot-authored), now carried by drafts opened at this seat:**
  - `jimcresswell/mcp-103-content-workspace` (2 commits, 2026-08-06: the
    generated model-behaviour content review workspace) → draft **#916**.
  - `jimcresswell/mcp-475-preview-build-validation` (1 commit, 2026-08-03:
    fail the Vercel build on an invalid deploy environment) → draft **#917**.
- **Peer fleets — pushed, PR-less, NOT touched (their call, reported):**
  emgeebot branches `claude/mcp-143-clerk-guards-pr5` (1), `fix/mcp-143-guard-cascade`
  (2), `fix/mcp-507-oauth-facade` (5), `test/emgeebot-ambient-verify`
  (content already on main by patch); Luke's `docs/napkin-windows-arc-capture`
  (1 commit, 2026-08-18).
- **Closed-PR branches — pushed, dispositioned, NOT reopened:** branches whose
  PRs were deliberately closed (superseded or abandoned) remain on the
  remote: `chore/aip-131-primary-estate-snapshot` (#395),
  `docs/agent-operability-deferred-work-map` (#400/#264),
  `docs/copilot-cli-practice-citizenship` (#776/#707/#567),
  `docs/director-handoff-spark-tenure-record` (#816),
  `docs/first-class-copilot-agent-support` (#777/#708/#522),
  `docs/mcp-301-public-documentation` (#881), `feat/mcp-128-landing-public-beta`
  (#773), `fix/claude-hook-hardening` (#778/#705/#403),
  `jimcresswell/commit-queue-sameagent-id-routing` (#673, content on main),
  `jimcresswell/jim-next-2026-08-04` (#765), `jimcresswell/mcp-372-…` (#806/#779/#644),
  `jimcresswell/mcp-487-sanitise-numeric-input` (#752),
  `jimcresswell/mcp-506-sdk-v2-spike-plan` (#774, content on main).
  Re-opening them would reverse recorded dispositions; they are pushed.
- `refs/remotes/pr576` is a local alias of PR #576's head (closed; the frozen
  MCP-63 extraction source, still on GitHub as `refs/pull/576/head`).
  `gh-readonly-queue/main/pr-4xx` refs are GitHub merge-queue leftovers from
  merged PRs, not work.

### Open PRs at the sweep (all pushed by definition)

#913 #912 #911 #910 #908 #905 #900 #895 #894 #893 #892 #891 #890 #888 #867
#772 #768 #761 #750, plus the sweep's #915 #916 #917 #918. Design merge legs
(#908/#910/#912) sit at SETTLE-READY for the design successor or this seat
at settled; #911/#905 await binding rounds at this seat.

### Dangling commits

233 in the primary object store, sampled newest-first: amended-away
pre-images (the tango node commit ×4, ddr-010 ×2, …) and dropped autostash
"WIP on …" entries from merges. Normal; nothing load-bearing. The MCP-63
"product analytics port" pre-image `ae25b10c9` is patch-identical to
`3e0e5d556` on `main` (#573).

### The owner's second clone — `oak-open-curriculum-ecosyste-2` (report only)

Read-only inventory: on `main`, one dirty file (`napkin.md`), **8 stashes**
(2026-03-05 → 2026-05-06, on `feat/mcp_app*`, `feat/es_index_update`,
`fix/sonar_high_priority_issues`), ~20 local branches from March–June 2026
(`feat/mcp_app`, `feat/mcp_app_ui`, `feat/semantic_search_deployment`, …)
whose commits are not patch-matched in `main` (the pre-no-squash era — their
features shipped), `fix/sonar_high_priority_issues` (7 commits, 2026-05-04,
no upstream), `pre-merge-backup` (2026-03-31), and a detached worktree on
`claude/nifty-ramanujan-7b1623` (ITF spike closeout, pushed, PR #401 closed).
This is the owner's own historical clone; nothing here was pushed or PR'd by
the sweep. Recommendation: the stashes are the only state not represented on
GitHub in any form — the owner decides whether any of them is live.

## Appendix A — `vitest-config-workspace` staged diff (oak-eslint), preserved verbatim

```diff
diff --git a/packages/core/oak-eslint/src/configs/base.ts b/packages/core/oak-eslint/src/configs/base.ts
index dac265311..5ab2ab0e2 100644
--- a/packages/core/oak-eslint/src/configs/base.ts
+++ b/packages/core/oak-eslint/src/configs/base.ts
@@ -116,9 +116,13 @@ export function createGraphBaseConfig(
           tsconfigRootDir: thisDir,
         },
       },
+      // Boundary coverage for config files (previously absent — the old
+      // 'off' lines here suppressed rules that never bound to these
+      // paths): a workspace's config reaching outside the workspace by
+      // relative path is the violation class the root-base convention
+      // normalised. Imports cross packages only via declared dependencies.
       rules: {
-        'import-x/no-relative-packages': 'off',
-        'import-x/no-relative-parent-imports': 'off',
+        'import-x/no-relative-packages': 'error',
       },
     },
   );
diff --git a/packages/core/oak-eslint/src/shared.ts b/packages/core/oak-eslint/src/shared.ts
index 9e30e6ab4..65e2f64af 100644
--- a/packages/core/oak-eslint/src/shared.ts
+++ b/packages/core/oak-eslint/src/shared.ts
@@ -74,11 +74,9 @@ export const ignores = [
   'node_modules/',
   '**/*.d.ts',
   'commitlint.config.js',
-  '**/tsup.config.ts',
   'reference/',
   'research/',
   // Ignore ephemeral bundled config artifacts (e.g., tsup.config.bundled_*.mjs)
-  '**/tsup.config.*',
   '**/*.bundled_*.mjs',
   // Generated TypeDoc output
   '**/docs/api/',
```

## Appendix B — `mcp-567-vendor-symlinks` test block, preserved verbatim

Target API (`lockedIds` on `generateAdapters`/`checkAdapters`) no longer
exists on `main`; the behaviours are the specification.

```diff
diff --git a/agent-tools/tests/skills-adapter-generate/carriage-hardening.integration.test.ts b/agent-tools/tests/skills-adapter-generate/carriage-hardening.integration.test.ts
index 8b327512e..5b03fa3e9 100644
--- a/agent-tools/tests/skills-adapter-generate/carriage-hardening.integration.test.ts
+++ b/agent-tools/tests/skills-adapter-generate/carriage-hardening.integration.test.ts
@@ -370,3 +370,113 @@ describe('same-length drift over a real filesystem', () => {
     expect(flagged.drifted).toEqual([`${root}/${projected}`]);
   });
 });
+
+describe('vendored projection over a real filesystem (MCP-567)', () => {
+  const VENDORED_SOURCE = '.agents/skills/clerk';
+
+  function seedVendored(root: string): void {
+    writeRepoFile(root, `${VENDORED_SOURCE}/SKILL.md`, '# Clerk\n\nVendored body.\n');
+    writeRepoFile(root, `${VENDORED_SOURCE}/LICENSE.txt`, 'Upstream licence text.\n');
+    writeRepoFile(root, `${VENDORED_SOURCE}/templates/app/layout.tsx`, 'export default null;\n');
+    writeRepoFile(root, `${VENDORED_SOURCE}/scripts/run.sh`, '#!/bin/sh\necho run\n');
+    chmodRepoFile(root, `${VENDORED_SOURCE}/scripts/run.sh`, 0o755);
+  }
+
+  it('replaces a lock-pinned symlink with a real projected directory, target surviving', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    seedVendored(root);
+    symlinkRepoPath(root, '.claude/skills/clerk', `${root}/${VENDORED_SOURCE}`);
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+
+    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(flagged.stale).toContain(`${root}/.claude/skills/clerk`);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+
+    expect(repoPathIsSymlink(root, '.claude/skills/clerk')).toBe(false);
+    expect(repoPathExists(root, '.claude/skills/clerk/SKILL.md')).toBe(true);
+    expect(repoPathExists(root, `${VENDORED_SOURCE}/SKILL.md`)).toBe(true);
+  });
+
+  it('carries every vendored byte — content outside the canonical carried set is copied, never pruned', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    seedVendored(root);
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+
+    expect(readRepoBytes(root, '.claude/skills/clerk/LICENSE.txt')).toEqual(
+      new TextEncoder().encode('Upstream licence text.\n'),
+    );
+    expect(repoPathExists(root, '.claude/skills/clerk/templates/app/layout.tsx')).toBe(true);
+
+    // Steady state: a second run prunes nothing and the checker is clean.
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(repoPathExists(root, '.claude/skills/clerk/LICENSE.txt')).toBe(true);
+    expect(repoPathExists(root, '.claude/skills/clerk/templates/app/layout.tsx')).toBe(true);
+    const after = await checkAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(after.missing).toEqual([]);
+    expect(after.drifted).toEqual([]);
+    expect(after.stale).toEqual([]);
+    expect(after.refused).toEqual([]);
+  });
+
+  it('preserves the executable bit on projected vendored scripts', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    seedVendored(root);
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+
+    expect(repoFileIsExecutable(root, '.claude/skills/clerk/scripts/run.sh')).toBe(true);
+  });
+
+  it('repairs a drifted vendored copy from its source', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    seedVendored(root);
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+
+    writeRepoFile(root, '.claude/skills/clerk/SKILL.md', 'edited on the copy\n');
+
+    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(flagged.drifted).toContain(`${root}/.claude/skills/clerk/SKILL.md`);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(readRepoBytes(root, '.claude/skills/clerk/SKILL.md')).toEqual(
+      new TextEncoder().encode('# Clerk\n\nVendored body.\n'),
+    );
+  });
+
+  it('reds the check when a lock-pinned name is absent from the claude surface, and a run creates it', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    seedVendored(root);
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+
+    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(flagged.missing.length).toBeGreaterThan(0);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(repoPathExists(root, '.claude/skills/clerk/SKILL.md')).toBe(true);
+  });
+
+  it('refuses a lock-pinned id whose vendored source is gone — the copy is never touched', async () => {
+    const root = sandboxRepo();
+    seedSkill(root);
+    writeRepoFile(root, '.claude/skills/clerk/SKILL.md', 'vendored — source withdrawn\n');
+    const lockedIds: ReadonlySet<string> = new Set(['clerk']);
+
+    const flagged = await checkAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(flagged.refused.length).toBeGreaterThan(0);
+
+    await generateAdapters({ repoRoot: root, prefix: 'oak-', lockedIds });
+    expect(readRepoBytes(root, '.claude/skills/clerk/SKILL.md')).toEqual(
+      new TextEncoder().encode('vendored — source withdrawn\n'),
+    );
+  });
+});
```
