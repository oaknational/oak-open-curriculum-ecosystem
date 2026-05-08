#!/usr/bin/env node
import { runBranchTouchedFilesCli } from '../branch-touched-files/cli.js';

process.exitCode = runBranchTouchedFilesCli({
  args: process.argv.slice(2),
  cwd: process.cwd(),
});
