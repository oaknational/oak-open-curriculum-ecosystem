/** What decides a spawned child's environment. */
export interface ChildEnvironmentInput {
  /** The spawning process's environment. */
  readonly ambient: NodeJS.ProcessEnv;
  /** Variables the caller adds. */
  readonly extra: Readonly<Record<string, string>> | undefined;
}

/**
 * The environment a child is spawned with, or `undefined` to inherit this
 * process's. Extra variables join the ambient ones and win over them.
 */
export function childEnvironment(input: ChildEnvironmentInput): NodeJS.ProcessEnv | undefined {
  return input.extra === undefined ? undefined : { ...input.ambient, ...input.extra };
}
