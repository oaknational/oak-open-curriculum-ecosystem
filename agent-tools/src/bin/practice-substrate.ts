#!/usr/bin/env node

import { createLivePracticeSubstrateReport } from '../practice-substrate/live-report.js';
import { runPracticeSubstrateCli } from '../practice-substrate/report.js';

const result = await runPracticeSubstrateCli({
  argv: process.argv.slice(2),
  repoRoot: process.cwd(),
  executeReport: createLivePracticeSubstrateReport,
});

if (result.stdout.length > 0) {
  process.stdout.write(result.stdout);
}
if (result.stderr.length > 0) {
  process.stderr.write(result.stderr);
}

process.exitCode = result.exitCode;
