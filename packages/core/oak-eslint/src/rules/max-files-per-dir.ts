import path from 'node:path';
import { minimatch } from 'minimatch';
import type { TSESLint } from '@typescript-eslint/utils';

export interface DirectoryInventory {
  readonly directory: string;
  readonly files: readonly string[];
}

interface MaxFilesPerDirOptions {
  readonly pattern?: string;
  readonly maxFiles?: number;
  readonly ignoreDirs?: readonly string[];
  readonly inventories?: readonly DirectoryInventory[];
}

interface MaxFilesPerDirViolation {
  readonly dir: string;
  readonly actual: number;
  readonly pattern: string;
  readonly max: number;
}

interface EvaluateMaxFilesPerDirInput {
  readonly filePath: string;
  readonly pattern: string;
  readonly maxFiles: number;
  readonly ignoreDirs: readonly string[];
  readonly inventories: readonly DirectoryInventory[];
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}

function normaliseDirectory(value: string): string {
  const normalised = toPosix(value).replace(/\/+$/u, '');

  return normalised === '' ? '.' : normalised;
}

function findDirectoryInventory(
  directory: string,
  inventories: readonly DirectoryInventory[],
): DirectoryInventory | null {
  for (const inventory of inventories) {
    if (normaliseDirectory(inventory.directory) === directory) {
      return inventory;
    }
  }

  return null;
}

export function evaluateMaxFilesPerDir({
  filePath,
  pattern,
  maxFiles,
  ignoreDirs,
  inventories,
}: EvaluateMaxFilesPerDirInput): MaxFilesPerDirViolation | null {
  const normalisedFilePath = toPosix(filePath);
  const directory = normaliseDirectory(path.posix.dirname(normalisedFilePath));

  if (ignoreDirs.some((glob) => minimatch(directory, glob, { dot: true }))) {
    return null;
  }

  const inventory = findDirectoryInventory(directory, inventories);
  if (!inventory) {
    return null;
  }

  const matchedFiles = [...inventory.files]
    .filter((name) => minimatch(name, pattern, { dot: true }))
    .sort();

  if (matchedFiles.length <= maxFiles) {
    return null;
  }

  if (path.posix.basename(normalisedFilePath) !== matchedFiles[0]) {
    return null;
  }

  return {
    dir: directory,
    actual: matchedFiles.length,
    pattern,
    max: maxFiles,
  };
}

const maxFilesPerDirRule: TSESLint.RuleModule<'tooManyFiles', [MaxFilesPerDirOptions]> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce a maximum number of files in a directory from an explicit inventory (non-recursive).',
    },
    schema: [
      {
        type: 'object',
        properties: {
          pattern: { type: 'string' },
          maxFiles: { type: 'integer', minimum: 1 },
          ignoreDirs: { type: 'array', items: { type: 'string' } },
          inventories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                directory: { type: 'string' },
                files: { type: 'array', items: { type: 'string' } },
              },
              required: ['directory', 'files'],
              additionalProperties: false,
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooManyFiles:
        '{{dir}} contains {{actual}} files matching "{{pattern}}", exceeding max {{max}}.',
    },
  },
  defaultOptions: [{}],

  create(context) {
    const [{ pattern = '*', maxFiles = 8, ignoreDirs = [], inventories = [] }] = context.options;
    const filePath = context.physicalFilename ?? context.filename;
    if (!filePath) {
      return {};
    }

    return {
      Program(node) {
        const violation = evaluateMaxFilesPerDir({
          filePath,
          pattern,
          maxFiles,
          ignoreDirs,
          inventories,
        });

        if (!violation) {
          return;
        }

        context.report({
          node,
          messageId: 'tooManyFiles',
          data: {
            dir: violation.dir,
            actual: String(violation.actual),
            pattern: violation.pattern,
            max: String(violation.max),
          },
        });
      },
    };
  },
};

export { maxFilesPerDirRule };
