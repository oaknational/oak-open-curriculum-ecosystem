/**
 * E2E-tier helper: the resolved Turbo task graph for this workspace's
 * build, as Turbo itself reports it (`--dry-run=json`). Turbo runs as a
 * real child process here, which is why the contract that reads this
 * graph lives in the e2e tier and not in the in-process suites.
 */
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const packageRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)));
const repoRoot = path.resolve(packageRoot, '../..');
/** Turbo's own entry script, resolved by module resolution — no PATH lookup of any binary. */
const turboEntry = createRequire(import.meta.url).resolve('turbo/bin/turbo');

/** The fields of a dry-run task the contract reads; `resolvedTaskDefinition` is the config. */
const TurboDryRunTaskSchema = z.object({
  taskId: z.string(),
  command: z.string(),
  dependencies: z.array(z.string()),
  resolvedTaskDefinition: z.object({
    cache: z.boolean(),
    dependsOn: z.array(z.string()),
    passThroughEnv: z.array(z.string()).nullable(),
  }),
});

const TurboDryRunSchema = z.object({ tasks: z.array(TurboDryRunTaskSchema) });

/** One task as Turbo's dry run describes it. */
export type TurboDryRunTask = z.output<typeof TurboDryRunTaskSchema>;

/**
 * Resolve the task graph Turbo would run for this workspace's `build`.
 *
 * @returns Every task in the graph, keyed by Turbo's task id.
 */
export function resolveBuildTaskGraph(): ReadonlyMap<string, TurboDryRunTask> {
  const raw = execFileSync(
    process.execPath,
    [
      turboEntry,
      'run',
      'build',
      '--filter=@oaknational/oak-curriculum-mcp-streamable-http',
      '--dry-run=json',
    ],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  const parsed = TurboDryRunSchema.parse(JSON.parse(raw));
  return new Map(parsed.tasks.map((task) => [task.taskId, task]));
}
