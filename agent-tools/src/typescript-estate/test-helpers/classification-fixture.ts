import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import type { RegularBlobTreeEntry, SnapshotSource } from '../git-snapshot-model.js';
import type { RepoPath } from '../scalar-model.js';

const CONTENT_SHA256 = 'd'.repeat(64);

const GENERATED_SOURCE = readable(
  'apps/a/src/generated/model.generated.ts',
  '// do not edit\nexport const model = 1;',
);
const INDEX_SOURCE = readable('apps/a/src/index.ts', 'export const api = 1;');
const FREE_SOURCE = readable('tools/free.ts', 'const free = 1;');
const PRODUCER_SOURCE = readable('tools/producer.ts', 'export function produce() {}');
export const CLASSIFICATION_FILES = [
  GENERATED_SOURCE,
  INDEX_SOURCE,
  FREE_SOURCE,
  PRODUCER_SOURCE,
] as const;

export { classificationProgramFixture } from './classification-program-fixture.js';

function readable(path: RepoPath, text: string): SnapshotSource {
  const bytes = new TextEncoder().encode(text);
  const sourceFile = createSourceFile(path, text, ScriptTarget.Latest, true, ScriptKind.TS);
  return {
    path,
    extension: path.endsWith('.tsx') ? '.tsx' : '.ts',
    treeEntry: regularEntry(bytes.byteLength),
    bytes,
    text,
    sourceFile,
    read: {
      status: 'read',
      contentSha256: CONTENT_SHA256,
      byteCount: bytes.byteLength,
      lineCount: sourceFile.getLineStarts().length,
    },
  };
}

function regularEntry(size: number): RegularBlobTreeEntry {
  return { mode: '100644', type: 'blob', object: 'c'.repeat(40), size };
}
