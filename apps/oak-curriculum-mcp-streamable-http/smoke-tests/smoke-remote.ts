import { buildRemoteCommand, optionsToSmokeSuite } from './cli/remote-cli.js';
import { runSmokeSuite } from './smoke-suite.js';

async function main(): Promise<void> {
  const program = buildRemoteCommand(async (cliOptions) => {
    await runSmokeSuite(optionsToSmokeSuite(cliOptions));
  });

  await program.parseAsync(process.argv);
}

main().catch((err: unknown) => {
  console.error('Remote smoke failed:', err);
  process.exit(1);
});
