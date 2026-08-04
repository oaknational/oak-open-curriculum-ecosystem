import js from '@eslint/js';
import { defineConfig } from 'eslint/config';

export default defineConfig(js.configs.recommended, {
  files: ['runtime-only-scripts/**/*.mjs'],
  languageOptions: {
    globals: { console: 'readonly', process: 'readonly' },
  },
});
