import { startDevServer } from './index.js';

startDevServer().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
