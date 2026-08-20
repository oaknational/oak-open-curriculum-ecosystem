import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { copyOakDs } from '../../build-scripts/copy-oak-ds.js';
import {
  createNodeProcessRunner,
  parseHttpDevMode,
  resolveHttpDevExecutionPlan,
  runHttpDevSession,
} from './index.js';

const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));

// The dev path bypasses esbuild entirely, so it copies the design system
// into `public/` itself — the boot-time marker check refuses to serve
// without it. Once at start-up: the design system is a sibling package that
// does not change during a session (restart to pick up an edit to it).
await copyOakDs(path.join(workspaceRoot, 'public'));

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
