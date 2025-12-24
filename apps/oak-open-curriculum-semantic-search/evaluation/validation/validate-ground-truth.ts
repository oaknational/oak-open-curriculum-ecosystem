/**
 * Ground Truth Validation Script
 *
 * Validates that all lesson, unit, and sequence slugs in the ground truth data
 * actually exist in the Oak Curriculum API.
 *
 * Run: pnpm tsx evaluation/validation/validate-ground-truth.ts
 *
 * @see ADR-085 Ground Truth Validation Discipline
 * @packageDocumentation
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runValidation } from './lib/validation-runner';

// Load environment variables from .env files
const thisDir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(thisDir, '../../.env.local') });
dotenvConfig({ path: resolve(thisDir, '../../../../.env') });

runValidation().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
