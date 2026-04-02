import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildOakDesignTokensCss } from './build-css.js';

const outputDirectory = resolve(import.meta.dirname, '../dist');
const outputPath = resolve(outputDirectory, 'index.css');

mkdirSync(outputDirectory, { recursive: true });
writeFileSync(outputPath, buildOakDesignTokensCss());
