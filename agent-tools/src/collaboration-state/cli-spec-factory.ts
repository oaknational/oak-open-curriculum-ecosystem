import { type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import { type CollaborationStateEnvironment } from './types.js';

/**
 * A collaboration-state CLI command handler: takes parsed options, the
 * environment, and the runtime, and returns its stdout (sync or async). The
 * `specs` registry in `cli-specs.ts` maps each `<topic>:<action>` to one of
 * these via {@link commandSpec}.
 */
export type CliHandler = (
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
) => Promise<string> | string;

/** A resolved command specification: handler, help text, and allowed options. */
export interface CommandSpec {
  readonly handler: CliHandler;
  readonly help: string;
  readonly options: ReadonlySet<string>;
  readonly allowsFiles?: boolean;
}

/**
 * Build a {@link CommandSpec} from an option-name list (materialised into the
 * `ReadonlySet` the parser validates against). Kept separate from the registry
 * data in `cli-specs.ts` so adding a command grows only the registry, not this
 * factory.
 */
export function commandSpec(input: {
  readonly help: string;
  readonly options: readonly string[];
  readonly allowsFiles?: boolean;
  readonly handler: CliHandler;
}): CommandSpec {
  return {
    help: input.help,
    options: new Set(input.options),
    allowsFiles: input.allowsFiles,
    handler: input.handler,
  };
}
