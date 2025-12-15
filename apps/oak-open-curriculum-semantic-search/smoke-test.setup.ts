/**
 * Smoke Test Setup for Oak Open Curriculum Semantic Search
 *
 * Loads environment variables from `.env.local` for smoke tests that need
 * real Elasticsearch credentials and API keys.
 *
 * Per testing-strategy.md:
 * - "Smoke tests CAN trigger all IO types"
 * - "Smoke tests DO have side effects"
 * - "Smoke tests DO NOT contain mocks"
 *
 * @module smoke-test.setup
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '.env.local');

// Load .env.local first (app-specific credentials)
dotenvConfig({ path: envLocalPath });

// Then try repo root .env as fallback for any missing vars
const repoRootEnv = resolve(thisDir, '../../.env');
dotenvConfig({ path: repoRootEnv });
