import fs from 'node:fs';
import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Rule } from 'eslint';

type Options = [
  {
    /** Glob for files to count (relative to each directory). Defaults to "*" */
    pattern?: string;
    /** Maximum allowed files in a directory. Defaults to 8 */
    maxFiles?: number;
    /**
     * Directory patterns to ignore (match against path relative to cwd).
     * Defaults include node_modules, dist, build, coverage, .git.
     */
    ignoreDirs?: string[];
  },
];

function toPosix(p: string) {
  return p.split(path.sep).join('/');
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a maximum number of files in a directory (non-recursive).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: { type: 'string' },
          maxFiles: { type: 'integer', minimum: 1 },
          ignoreDirs: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyFiles:
        '{{dir}} contains {{actual}} files matching "{{pattern}}", exceeding max {{max}}.',
    },
  },

  create(context) {
    const [{ pattern = '*', maxFiles = 8, ignoreDirs = [] } = {}] = context.options as Options;

    // Prefer physical path when processors might change virtual filenames
    const filePath = (context as any).physicalFilename ?? context.filename;
    if (!filePath) return {};

    const dirPath = path.dirname(filePath);
    const cwd = (context as any).cwd ?? process.cwd();
    const relDir = toPosix(path.relative(cwd, dirPath)) || '.';

    // Ignore configured directories (match against repo-relative dir path)
    if (ignoreDirs.some((glob) => minimatch(relDir, glob, { dot: true }))) {
      return {};
    }

    // Default ignores (always active unless overridden by logic, but here we just add them to user ignores if we wanted)
    // For now, let's stick to the user provided ignoreDirs + standard ones if we want, or just rely on user config.
    // The plan said defaults include node_modules etc.
    const defaultIgnores = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.git/**',
    ];

    const allIgnores = [...defaultIgnores, ...ignoreDirs];
    if (allIgnores.some((glob) => minimatch(relDir, glob, { dot: true }))) {
      return {};
    }

    return {
      Program(node) {
        let entries: fs.Dirent[];
        try {
          entries = fs.readdirSync(dirPath, { withFileTypes: true });
        } catch {
          // Virtual file or directory not on disk; ignore gracefully.
          return;
        }

        const files = entries.filter((e) => e.isFile()).map((e) => e.name);
        const matched = files.filter((name) => minimatch(name, pattern, { dot: true })).sort();

        const actual = matched.length;
        if (actual <= maxFiles) return;

        // Report once per directory: only the alphabetically-first matched file reports
        const base = path.basename(filePath);
        if (base !== matched[0]) return;

        context.report({
          node,
          messageId: 'tooManyFiles',
          data: { dir: relDir, actual: String(actual), pattern, max: String(maxFiles) },
        });
      },
    };
  },
};

export default rule;
