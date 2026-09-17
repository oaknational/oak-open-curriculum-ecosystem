/**
 * Git's credential-resolution chain, enumerated in FULL, and the environment
 * and argv derivations that close every arm of it.
 *
 * R9 (external-contract closure): git owns this contract, so it is
 * transcribed here from `gitcredentials(7)` § REQUESTING CREDENTIALS rather
 * than inferred. A hand-picked subset is exactly how the two askpass
 * fallbacks were missed while the tests stayed green — and an open askpass
 * arm is a live credential prompt answered by whoever is signed in, which
 * under shared credentials puts the wrong identity on the push.
 */

/** Where an arm of the chain gets its answer from, and therefore how it is closed. */
type CredentialArmSource = 'config' | 'env' | 'terminal';

/**
 * The chain in the order git consults it:
 *
 * | order | arm                 | source   | closed by                              |
 * | ----- | ------------------- | -------- | -------------------------------------- |
 * | 0     | `credential.helper` | config   | argv: cleared, then this command's own |
 * | 1     | `GIT_ASKPASS`       | env      | env: removed                           |
 * | 2     | `core.askPass`      | config   | argv: cleared                          |
 * | 3     | `SSH_ASKPASS`       | env      | env: removed                           |
 * | 4     | terminal prompt     | terminal | env: `GIT_TERMINAL_PROMPT=0`           |
 *
 * This table is the SOURCE both derivations below are built from, so an arm
 * cannot be documented here and left open in the call that reaches git.
 */
export const GIT_CREDENTIAL_RESOLUTION_CHAIN = [
  { name: 'credential.helper', source: 'config' },
  { name: 'GIT_ASKPASS', source: 'env' },
  { name: 'core.askPass', source: 'config' },
  { name: 'SSH_ASKPASS', source: 'env' },
  { name: 'GIT_TERMINAL_PROMPT', source: 'terminal' },
] as const satisfies readonly { readonly name: string; readonly source: CredentialArmSource }[];

/**
 * Every env-sourced arm, as removals. Node drops undefined-valued entries
 * when building the child environment, so these are true removals rather
 * than empty values.
 */
export function scrubbedCredentialEnv(): Partial<Record<string, string>> {
  return Object.fromEntries(
    GIT_CREDENTIAL_RESOLUTION_CHAIN.filter((arm) => arm.source === 'env').map((arm) => [
      arm.name,
      undefined,
    ]),
  );
}

/** Every config-sourced arm, as `-c <name>=` clears for git's own command line. */
export function clearedCredentialConfig(): readonly string[] {
  return GIT_CREDENTIAL_RESOLUTION_CHAIN.filter((arm) => arm.source === 'config').flatMap((arm) => [
    '-c',
    `${arm.name}=`,
  ]);
}
