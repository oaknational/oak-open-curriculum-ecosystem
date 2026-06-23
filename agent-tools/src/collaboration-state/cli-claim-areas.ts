import { required, type Options } from './cli-options.js';
import { type CollaborationArea } from './types.js';

/**
 * Resolve the claimed area for `claims open` from `--area-kind` plus either
 * repeatable `--file` or repeatable `--area-pattern` argv (mutually
 * exclusive).
 */
export function areaFromOptions(options: Options): CollaborationArea {
  return {
    kind: parseAreaKind(required(options, 'area-kind')),
    patterns: areaPatternsFromOptions(options),
  };
}

function areaPatternsFromOptions(options: Options): readonly string[] {
  const hasFiles = options.files.length > 0;
  const hasAreaPatterns = options.areaPatterns.length > 0;

  if (hasFiles && hasAreaPatterns) {
    throw new Error('claims open accepts either --file or --area-pattern, not both');
  }
  if (hasFiles) {
    return options.files;
  }
  if (hasAreaPatterns) {
    return options.areaPatterns;
  }

  throw new Error('claims open requires either --file or --area-pattern');
}

function parseAreaKind(value: string): 'files' | 'workspace' | 'plan' | 'adr' | 'git' {
  if (
    value === 'files' ||
    value === 'workspace' ||
    value === 'plan' ||
    value === 'adr' ||
    value === 'git'
  ) {
    return value;
  }

  throw new Error(
    `unsupported area kind: ${value}. Expected one of: files | workspace | plan | adr | git`,
  );
}
