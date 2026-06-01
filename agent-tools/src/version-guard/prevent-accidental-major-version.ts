#!/usr/bin/env node

/**
 * Pre-commit hook to prevent accidental major version bumps
 * Checks commit messages for breaking change indicators
 */

import { readFileSync } from 'node:fs';
import { argv, exit } from 'node:process';
import { writeErrorLine } from '../core/terminal-output.js';

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

function getCommitMessage(): string {
  // Get the commit message file from command line argument
  const commitMsgFile = argv[2];

  if (!commitMsgFile) {
    writeErrorLine('Error: No commit message file provided');
    exit(1);
    return '';
  }

  try {
    return readFileSync(commitMsgFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    writeErrorLine(`Error reading commit message file: ${message}`);
    exit(1);
    return '';
  }
}

function checkForBreakingChanges(message: string): boolean {
  const upperMessage = message.toUpperCase();

  for (const indicator of BREAKING_CHANGE_INDICATORS) {
    if (upperMessage.includes(indicator)) {
      return true;
    }
  }

  return false;
}

function checkForBangCommit(message: string): boolean {
  // Check for feat!, fix!, refactor!, etc.
  return /^(feat|fix|refactor|perf|test|build|ci|chore|docs|style|revert)!:/m.test(message);
}

function printErrorHeader(line: string): void {
  writeErrorLine(line);
  writeErrorLine(`${RED}⚠️  MAJOR VERSION BUMP DETECTED!${RESET}`);
  writeErrorLine(line);
  writeErrorLine('');
}

function printErrorCause(hasBreakingChange: boolean, hasBangCommit: boolean): void {
  if (hasBreakingChange) {
    writeErrorLine(`Your commit message contains a BREAKING CHANGE indicator.`);
  }

  if (hasBangCommit) {
    writeErrorLine(`Your commit uses the '!' syntax (e.g., feat!, fix!).`);
  }

  writeErrorLine(`This would trigger a major version bump (to 1.0.0 or higher).`);
  writeErrorLine('');
}

function printErrorAdvice(): void {
  writeErrorLine(`${YELLOW}Since this package is still in pre-1.0 development:${RESET}`);
  writeErrorLine(`• Remove "BREAKING CHANGE" from your commit message`);
  writeErrorLine(`• Don't use ! in your commit type (feat!, fix!, etc.)`);
  writeErrorLine(`• Use regular feat: or fix: commits instead`);
  writeErrorLine(`• Breaking changes in 0.x.x should bump minor version, not major`);
  writeErrorLine('');
  writeErrorLine(`${YELLOW}If you really need to indicate breaking changes:${RESET}`);
  writeErrorLine(`1. Use a regular commit type without !`);
  writeErrorLine(
    `2. Document breaking changes in the commit body (without the BREAKING CHANGE footer)`,
  );
  writeErrorLine(`3. Update CHANGELOG.md manually if needed`);
  writeErrorLine('');
}

function printError(hasBreakingChange: boolean, hasBangCommit: boolean): void {
  const line = `${RED}${'━'.repeat(75)}${RESET}`;

  printErrorHeader(line);
  printErrorCause(hasBreakingChange, hasBangCommit);
  printErrorAdvice();
  writeErrorLine(`${RED}Commit blocked. Please modify your commit message and try again.${RESET}`);
  writeErrorLine(line);
}

function main(): void {
  const commitMessage = getCommitMessage();

  if (!commitMessage) {
    // No commit message yet, this is fine
    exit(0);
  }

  const hasBreakingChange = checkForBreakingChanges(commitMessage);
  const hasBangCommit = checkForBangCommit(commitMessage);

  if (hasBreakingChange || hasBangCommit) {
    printError(hasBreakingChange, hasBangCommit);
    exit(1);
  }

  exit(0);
}

main();
