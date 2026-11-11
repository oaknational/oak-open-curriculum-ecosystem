/**
 * The file universe of the root format and markdown gates, as pure functions
 * over what git gave back.
 *
 * @remarks
 * The universe is git's tracked tree, never a walk of the disk. A walk checks
 * whatever this machine happens to carry (a generated read model, an editor's
 * workspace file, build output) and so proves the machine, not the repository:
 * the "green here, red in CI" class. Existence comes from git; ownership (which
 * tracked files a tool formats) stays declared in each tool's own ignore
 * settings, which both tools still apply to paths named explicitly: prettier's
 * `.prettierignore` and markdownlint-cli2's `ignores`, and `.gitignore` for
 * both (prettier reads it by default; the markdownlint config sets `gitignore`).
 *
 * The tracked tree of a large repository does not fit one command line, so the
 * files are run in chunks under a byte budget ({@link argvChunks}).
 *
 * @packageDocumentation
 */

const NUL = '\u0000';

/** A resolved (stage 0) symbolic link in `git ls-files -s` output, up to its path. */
const RESOLVED_SYMLINK = /^120000 [0-9a-f]+ 0\t/u;

/**
 * Split git's `-z` output into paths, so a space, a tab or a newline inside a
 * path survives.
 *
 * @param stdout - What a `-z` git command wrote.
 * @returns The paths in order, without the empty record after the last NUL.
 */
export function parseNulSeparatedPaths(stdout: string): readonly string[] {
  return stdout.split(NUL).filter((entry) => entry.length > 0);
}

/**
 * The index entries that are symbolic links, read from
 * `git ls-files --cached -s -z` (`<mode> <object> <stage>\t<path>`).
 *
 * @remarks
 * A symlink carries no content of its own to format: its target is checked
 * under its real path, and prettier refuses a symlink path outright. An
 * unmerged path's stages may differ in type, so only a resolved entry counts,
 * and the tools read the path as the working tree holds it. The first tab ends
 * the metadata and the path may hold a tab, so the record is split there.
 *
 * @param stageOutput - What `git ls-files --cached -s -z` wrote.
 * @returns The symlink paths.
 */
export function parseSymlinkPaths(stageOutput: string): ReadonlySet<string> {
  const symlinks = new Set<string>();
  for (const record of parseNulSeparatedPaths(stageOutput)) {
    if (RESOLVED_SYMLINK.test(record)) {
      symlinks.add(record.slice(record.indexOf('\t') + 1));
    }
  }
  return symlinks;
}

/** What git says about the tracked tree, read once for one gate run. */
export interface TrackedTreeReading {
  /** Every tracked file (`git ls-files -z`). */
  readonly tracked: readonly string[];
  /** Tracked files deleted or retyped in the working tree and not yet staged. */
  readonly goneFromWorkingTree: ReadonlySet<string>;
  /** Index entries that are symbolic links. */
  readonly symlinks: ReadonlySet<string>;
}

/**
 * The tracked files a gate runs over.
 *
 * @remarks
 * A tracked file deleted from the working tree, or replaced there by a symlink,
 * is still a regular index entry until the change is staged, so `ls-files`
 * names it and the tool would fail on a missing file or refuse the link. Git's
 * own unstaged-diff answer removes those, so the list never comes from probing
 * the disk.
 *
 * @param reading - What git said about the tracked tree.
 * @returns The tracked files, in git's order, without those gone from the
 *   working tree and without symbolic links.
 */
export function trackedCheckFiles(reading: TrackedTreeReading): readonly string[] {
  return reading.tracked.filter(
    (file) => !reading.goneFromWorkingTree.has(file) && !reading.symlinks.has(file),
  );
}

/**
 * The Markdown files among the given paths.
 *
 * @param files - Repo-relative paths.
 * @returns The paths ending in `.md`, in order.
 */
export function markdownOnly(files: readonly string[]): readonly string[] {
  return files.filter((file) => file.endsWith('.md'));
}

/**
 * Split files into chunks that each fit a command line.
 *
 * @remarks
 * A command line's size limit counts each argument's bytes plus its
 * terminator, and the environment shares it (1 MiB on macOS), so the budget is
 * set well under that. A single path larger than the budget cannot be split and
 * takes a chunk of its own.
 *
 * @param files - Repo-relative paths, in the order they run.
 * @param budgetBytes - The most bytes one chunk's paths may cost.
 * @returns The chunks in order; every file appears exactly once.
 */
export function argvChunks(
  files: readonly string[],
  budgetBytes: number,
): readonly (readonly string[])[] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let used = 0;
  for (const file of files) {
    const cost = Buffer.byteLength(file, 'utf8') + 1;
    if (current.length > 0 && used + cost > budgetBytes) {
      chunks.push(current);
      current = [];
      used = 0;
    }
    current.push(file);
    used += cost;
  }
  if (current.length > 0) {
    chunks.push(current);
  }
  return chunks;
}

/**
 * One exit status for a gate that ran its tool several times: the first
 * failure, so every chunk's findings are shown and the gate still fails.
 *
 * @param statuses - Each run's exit status, in run order.
 * @returns 0 when every run passed or none ran; otherwise the first non-zero
 *   status.
 */
export function combinedExitCode(statuses: readonly number[]): number {
  return statuses.find((status) => status !== 0) ?? 0;
}

/** Prettier runs read-only (`check`) or as the repair (`write`). */
export type PrettierMode = 'check' | 'write';

/**
 * The `pnpm exec` argv that runs prettier over exactly the given files.
 *
 * The `--` ends the options, so a tracked file named like one (`--write`) is
 * still a file. `--ignore-unknown` is load-bearing: the tracked universe carries every file
 * type the repository holds, and prettier must skip what it has no parser for
 * rather than fail. `.prettierignore` still applies to explicitly named
 * paths, so ownership exclusions hold. The write mode keeps prettier's cache;
 * a check never reads one, so a proof of the tree is never a proof of a cache.
 *
 * @param mode - Read-only check or the repair.
 * @param files - Repo-relative paths to format.
 * @returns Arguments for `pnpm`.
 */
export function prettierArgs(mode: PrettierMode, files: readonly string[]): readonly string[] {
  const modeArgs = mode === 'check' ? ['--check'] : ['--write', '--cache'];
  return ['exec', 'prettier', ...modeArgs, '--ignore-unknown', '--', ...files];
}

/** markdownlint runs read-only (`check`) or as the repair (`fix`). */
export type MarkdownlintMode = 'check' | 'fix';

/**
 * The `pnpm exec` argv that runs markdownlint-cli2 over exactly the given
 * files.
 *
 * The `--` ends the options, so a tracked file named like one is still a
 * file; the paths after it are still matched against the config's `ignores`.
 * `--no-globs` is load-bearing, not redundant: it tells markdownlint-cli2 to
 * lint ONLY the explicit paths instead of unioning them with a `globs` array
 * from `.markdownlint-cli2.jsonc`. The config's rules and `ignores` still
 * apply, so an explicitly named but excluded file is skipped.
 *
 * @param mode - Read-only check or the repair.
 * @param files - Repo-relative Markdown paths to lint.
 * @returns Arguments for `pnpm`.
 */
export function markdownlintArgs(
  mode: MarkdownlintMode,
  files: readonly string[],
): readonly string[] {
  const modeArgs = mode === 'fix' ? ['--fix'] : [];
  return ['exec', 'markdownlint-cli2', '--no-globs', ...modeArgs, '--', ...files];
}

/**
 * The runs the tracked prettier gate makes: prettier over every tracked file
 * present in the working tree, one run per chunk within the budget.
 *
 * @param mode - Read-only check or the repair.
 * @param reading - What git said about the tracked tree.
 * @param budgetBytes - The most bytes one run's paths may cost.
 * @returns Arguments for `pnpm`, one entry per run, in order.
 */
export function trackedPrettierRuns(
  mode: PrettierMode,
  reading: TrackedTreeReading,
  budgetBytes: number,
): readonly (readonly string[])[] {
  return argvChunks(trackedCheckFiles(reading), budgetBytes).map((chunk) =>
    prettierArgs(mode, chunk),
  );
}

/**
 * The runs the tracked markdownlint gate makes: markdownlint over every tracked
 * Markdown file present in the working tree, one run per chunk within the budget.
 *
 * @param mode - Read-only check or the repair.
 * @param reading - What git said about the tracked tree.
 * @param budgetBytes - The most bytes one run's paths may cost.
 * @returns Arguments for `pnpm`, one entry per run, in order.
 */
export function trackedMarkdownlintRuns(
  mode: MarkdownlintMode,
  reading: TrackedTreeReading,
  budgetBytes: number,
): readonly (readonly string[])[] {
  return argvChunks(markdownOnly(trackedCheckFiles(reading)), budgetBytes).map((chunk) =>
    markdownlintArgs(mode, chunk),
  );
}

/** A glob character (a backslash reads as `/`), or a leading `#`, `!` or `:` (a comment, a negation, a literal path). */
const GLOB_SIGNIFICANT = /[*?[\]{}()\\]|^[#!:]/u;

/**
 * The paths markdownlint-cli2 would read as glob patterns rather than as the
 * files they name. It takes every argument as a glob, so such a file is
 * silently skipped, never linted; the gate refuses them by name instead. Its
 * literal-path prefix is no cure: a literal path escapes the config's
 * `ignores`, so the exclusions would stop applying.
 *
 * @param files - Repo-relative Markdown paths.
 * @returns The glob-significant paths, in order.
 */
export function globSignificantPaths(files: readonly string[]): readonly string[] {
  return files.filter((file) => GLOB_SIGNIFICANT.test(file));
}
