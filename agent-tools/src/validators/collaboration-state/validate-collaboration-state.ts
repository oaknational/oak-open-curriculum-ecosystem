#!/usr/bin/env node
import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from '../../collaboration-state/state-integrity.js';

const report = await validateCollaborationStateIntegrity({ repoRoot: process.cwd() });
const formatted = formatCollaborationStateIntegrityReport(report);

if (report.findings.length > 0) {
  process.stderr.write(formatted);
  process.exitCode = 1;
} else {
  process.stdout.write(formatted);
}
