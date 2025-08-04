#!/usr/bin/env node

/**
 * Pre-commit hook to prevent accidental major version bumps
 * Checks commit messages for breaking change indicators
 */

import { execSync } from 'child_process';

const BREAKING_CHANGE_INDICATORS = [
  'BREAKING CHANGE:',
  'BREAKING CHANGES:',
  'BREAKING-CHANGE:',
  'BREAKING CHANGE',
  'BREAKING CHANGES',
  'BREAKING-CHANGE',
];

// ANSI color codes
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function getCommitMessage() {
  // Get the commit message file from command line argument
  const commitMsgFile = process.argv[2];

  if (!commitMsgFile) {
    console.error('Error: No commit message file provided');
    process.exit(1);
  }

  try {
    return execSync(`cat ${commitMsgFile}`, { encoding: 'utf8' });
  } catch (error) {
    console.error('Error reading commit message file:', error.message);
    process.exit(1);
  }
}

function checkForBreakingChanges(message) {
  const upperMessage = message.toUpperCase();

  for (const indicator of BREAKING_CHANGE_INDICATORS) {
    if (upperMessage.includes(indicator)) {
      return true;
    }
  }

  return false;
}

function checkForBangCommit(message) {
  // Check for feat!, fix!, refactor!, etc.
  return /^(feat|fix|refactor|perf|test|build|ci|chore|docs|style|revert)!:/m.test(message);
}

function main() {
  const commitMessage = getCommitMessage();

  if (!commitMessage) {
    // No commit message yet, this is fine
    process.exit(0);
  }

  const hasBreakingChange = checkForBreakingChanges(commitMessage);
  const hasBangCommit = checkForBangCommit(commitMessage);

  if (hasBreakingChange || hasBangCommit) {
    console.error(
      `${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`,
    );
    console.error(`${RED}⚠️  MAJOR VERSION BUMP DETECTED!${RESET}`);
    console.error(
      `${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`,
    );
    console.error('');

    if (hasBreakingChange) {
      console.error(`Your commit message contains a BREAKING CHANGE indicator.`);
    }

    if (hasBangCommit) {
      console.error(`Your commit uses the '!' syntax (e.g., feat!, fix!).`);
    }

    console.error(`This would trigger a major version bump (to 1.0.0 or higher).`);
    console.error('');
    console.error(`${YELLOW}Since this package is still in pre-1.0 development:${RESET}`);
    console.error(`• Remove "BREAKING CHANGE" from your commit message`);
    console.error(`• Don't use ! in your commit type (feat!, fix!, etc.)`);
    console.error(`• Use regular feat: or fix: commits instead`);
    console.error(`• Breaking changes in 0.x.x should bump minor version, not major`);
    console.error('');
    console.error(`${YELLOW}If you really need to indicate breaking changes:${RESET}`);
    console.error(`1. Use a regular commit type without !`);
    console.error(
      `2. Document breaking changes in the commit body (without the BREAKING CHANGE footer)`,
    );
    console.error(`3. Update CHANGELOG.md manually if needed`);
    console.error('');
    console.error(`${RED}Commit blocked. Please modify your commit message and try again.${RESET}`);
    console.error(
      `${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`,
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
