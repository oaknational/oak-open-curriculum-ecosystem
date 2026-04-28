#!/usr/bin/env node
import { runCollaborationStateCli } from '../collaboration-state/cli.js';

runCollaborationStateCli({
  argv: process.argv.slice(2),
  env: {
    ...(process.env.PRACTICE_AGENT_SESSION_ID_CLAUDE === undefined
      ? {}
      : { PRACTICE_AGENT_SESSION_ID_CLAUDE: process.env.PRACTICE_AGENT_SESSION_ID_CLAUDE }),
    ...(process.env.PRACTICE_AGENT_SESSION_ID_CURSOR === undefined
      ? {}
      : { PRACTICE_AGENT_SESSION_ID_CURSOR: process.env.PRACTICE_AGENT_SESSION_ID_CURSOR }),
    ...(process.env.PRACTICE_AGENT_SESSION_ID_CODEX === undefined
      ? {}
      : { PRACTICE_AGENT_SESSION_ID_CODEX: process.env.PRACTICE_AGENT_SESSION_ID_CODEX }),
    ...(process.env.CODEX_THREAD_ID === undefined
      ? {}
      : { CODEX_THREAD_ID: process.env.CODEX_THREAD_ID }),
    ...(process.env.OAK_AGENT_IDENTITY_OVERRIDE === undefined
      ? {}
      : { OAK_AGENT_IDENTITY_OVERRIDE: process.env.OAK_AGENT_IDENTITY_OVERRIDE }),
  },
})
  .then((result) => {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    process.exitCode = result.exitCode;
  })
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
  });
