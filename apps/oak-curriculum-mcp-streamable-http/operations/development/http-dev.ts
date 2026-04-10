import { fileURLToPath } from 'node:url';

import {
  createNodeProcessRunner,
  parseHttpDevMode,
  resolveHttpDevExecutionPlan,
  runHttpDevSession,
} from './index.js';

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));
const parsedMode = parseHttpDevMode(process.argv[2]);

if (!parsedMode.ok) {
  process.stderr.write(
    `Invalid HTTP dev mode "${parsedMode.error.input}". ` +
      'Expected one of: dev, observe, observe-noauth.\n',
  );
  process.exitCode = 1;
} else {
  const executionPlan = resolveHttpDevExecutionPlan({
    mode: parsedMode.value,
    workspaceRoot,
    parentEnv: process.env,
    now: new Date(),
  });

  const exitCode = await runHttpDevSession({
    executionPlan,
    processRunner: createNodeProcessRunner(),
    onSignal: (signal, handler) => {
      process.once(signal, handler);
    },
  });

  process.exitCode = exitCode;
}
