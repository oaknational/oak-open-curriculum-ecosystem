#!/usr/bin/env node
import { resolveCoordinationHome } from '../../collaboration-state/coordination-home.js';
import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from '../../collaboration-state/state-integrity.js';

// The machine-local surfaces (claims, comms, commit-queue) live at the
// ADR-197 coordination home — from a linked worktree, process.cwd() alone
// would validate absent-or-stale local decoys while the canonical store
// stays uninspected (review finding 5).
const report = await validateCollaborationStateIntegrity({
  repoRoot: process.cwd(),
  coordinationHome: resolveCoordinationHome(process.cwd(), {
    coordinationHomeEnv: process.env.PRACTICE_COORDINATION_HOME,
  }),
});
const formatted = formatCollaborationStateIntegrityReport(report);

if (report.findings.length > 0) {
  process.stderr.write(formatted);
  process.exitCode = 1;
} else {
  process.stdout.write(formatted);
}
