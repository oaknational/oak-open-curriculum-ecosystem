# Config-load sentinel probe (reversible; 2026-08-10)

Method: `vitest.config.ts` was temporarily replaced with a single line —
`throw new Error('config-load-probe: this file is being evaluated');` —
then `pnpm run mutate` was executed and the original file restored
byte-identically (verified via git diff). A silent-fallback run would
succeed regardless of this file's content; the observed failure below
proves Stryker's vitest runner loads and evaluates the named
`vitest.config.ts`. Paired with `run-real-config.log.txt` (same command,
intact config, completed pass), the pair distinguishes a real-config run
from fallback.

Observed (excerpt, scrubbed):

    21:34:04 (17343) ERROR Stryker Unexpected error occurred while running Stryker StrykerError: Error: config-load-probe: this file is being evaluated
    Error: config-load-probe: this file is being evaluated
    StrykerError: Error: config-load-probe: this file is being evaluated
    Error: config-load-probe: this file is being evaluated

    exit status: 1
