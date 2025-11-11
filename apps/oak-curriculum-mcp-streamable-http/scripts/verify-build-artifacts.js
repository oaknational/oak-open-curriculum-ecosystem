#!/usr/bin/env node
/**
 * Post-build verification script
 *
 * Checks that build artifacts are structurally correct for both deployment modes:
 * 1. Vercel serverless (dist/src/index.js exports Express app)
 * 2. Traditional hosting (dist/server.js starts server)
 *
 * This catches build configuration errors before tests run.
 *
 * Runs automatically after `pnpm build` via postbuild npm script lifecycle hook.
 */

import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const errors = [];

// Check 1: Required build artifacts exist
console.log('✓ Checking build artifacts exist...');
const requiredFiles = [
  'dist/src/index.js',
  'dist/src/index.d.ts',
  'dist/server.js',
  'dist/server.d.ts',
];

for (const file of requiredFiles) {
  const path = resolve(rootDir, file);
  if (!existsSync(path)) {
    errors.push(`Missing required file: ${file}`);
  }
}

// Check 2: package.json main field points to valid file
console.log('✓ Checking package.json main field...');
const pkgPath = resolve(rootDir, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

if (!pkg.main) {
  errors.push('package.json missing "main" field');
} else {
  const mainPath = resolve(rootDir, pkg.main);
  if (!existsSync(mainPath)) {
    errors.push(`package.json "main" points to non-existent file: ${pkg.main}`);
  }
}

// Check 3: Vercel entry point exports correctly
console.log('✓ Checking Vercel entry point (default export)...');
try {
  const vercelEntry = await import(`${rootDir}/dist/src/index.js`);
  if (typeof vercelEntry.default !== 'function') {
    errors.push('dist/src/index.js does not export a function as default');
  }
  if (typeof vercelEntry.createApp !== 'function') {
    errors.push('dist/src/index.js does not export createApp function');
  }
} catch (err) {
  errors.push(`Failed to import Vercel entry point: ${err.message}`);
}

// Check 4: Server entry point exists and imports createApp
console.log('✓ Checking traditional hosting entry point...');
const serverJs = readFileSync(resolve(rootDir, 'dist/server.js'), 'utf-8');
if (!serverJs.includes('createApp')) {
  errors.push('dist/server.js does not import createApp');
}
if (!serverJs.includes('app.listen')) {
  errors.push('dist/server.js does not call app.listen()');
}

// Check 5: Types are generated
console.log('✓ Checking TypeScript declarations...');
if (!existsSync(resolve(rootDir, 'dist/src/index.d.ts'))) {
  errors.push('Missing TypeScript declarations for Vercel entry point');
}

// Report results
console.log('\n' + '='.repeat(60));
if (errors.length === 0) {
  console.log('✅ Build artifact verification PASSED');
  console.log('\nAll required files present and correctly structured:');
  console.log('  • Vercel entry: dist/src/index.js (exports Express app)');
  console.log('  • Traditional: dist/server.js (calls app.listen())');
  console.log('  • Package main: ' + pkg.main);
  console.log('='.repeat(60));
  process.exit(0);
} else {
  console.error('❌ Build artifact verification FAILED\n');
  console.error('Errors found:');
  for (const error of errors) {
    console.error(`  • ${error}`);
  }
  console.log('\n' + '='.repeat(60));
  console.error('\nBuild produced invalid artifacts. Check:');
  console.error('  - tsup.config.ts entry points');
  console.error('  - package.json main field');
  console.error('  - TypeScript configuration');
  console.log('='.repeat(60));
  process.exit(1);
}
