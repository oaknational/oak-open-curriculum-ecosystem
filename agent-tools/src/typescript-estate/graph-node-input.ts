import type { RepoPath, Sha256 } from './scalar-model.js';

/** Kind-specific inputs from which graph node identities are derived. */
export type GraphNodeInput =
  | { readonly kind: 'file'; readonly path: RepoPath }
  | {
      readonly kind: 'workspace';
      readonly root: RepoPath;
      readonly manifestPath: RepoPath;
      readonly packageName: string | null;
    }
  | {
      readonly kind: 'package';
      readonly ownership: 'workspace' | 'external';
      readonly packageName: string;
      readonly subpath: string | null;
    }
  | {
      readonly kind: 'command';
      readonly manifestPath: RepoPath;
      readonly scriptName: string;
      readonly literalCommand: string;
    }
  | {
      readonly kind: 'artefact';
      readonly identity:
        | { readonly kind: 'repo-path'; readonly path: RepoPath }
        | {
            readonly kind: 'repo-prefix';
            readonly prefix: RepoPath;
            readonly memberSetSha256: Sha256;
          }
        | { readonly kind: 'external-input'; readonly identifier: string };
    }
  | {
      readonly kind: 'registration';
      readonly sourcePath: RepoPath;
      readonly startLine: number;
      readonly terminalCallName: string;
      readonly target: string | null;
    }
  | {
      readonly kind: 'external-contract';
      readonly contractKind: string;
      readonly identifier: string;
    };
