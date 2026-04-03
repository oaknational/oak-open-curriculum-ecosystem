/**
 * Token build script for `@oaknational/oak-design-tokens`.
 *
 * @remarks
 * Generates `dist/index.css` from DTCG JSON token sources via the
 * `design-tokens-core` helpers. Errors propagate naturally — Node
 * surfaces the stack trace, and Turbo reports the non-zero exit.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildOakDesignTokensCss } from './build-css.js';

const outputDirectory = resolve(import.meta.dirname, '../dist');
const outputPath = resolve(outputDirectory, 'index.css');

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, buildOakDesignTokensCss());
