/** Kind-specific inputs from which graph node identities are derived. */
export type GraphNodeInput =
  | { readonly kind: 'file'; readonly path: string }
  | {
      readonly kind: 'workspace';
      readonly root: string;
      readonly manifestPath: string;
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
      readonly manifestPath: string;
      readonly scriptName: string;
      readonly literalCommand: string;
    }
  | {
      readonly kind: 'artefact';
      readonly identity:
        | { readonly kind: 'repo-path'; readonly path: string }
        | {
            readonly kind: 'repo-prefix';
            readonly prefix: string;
            readonly memberSetSha256: string;
          }
        | { readonly kind: 'external-input'; readonly identifier: string };
    }
  | {
      readonly kind: 'registration';
      readonly sourcePath: string;
      readonly startLine: number;
      readonly terminalCallName: string;
      readonly target: string | null;
    }
  | {
      readonly kind: 'external-contract';
      readonly contractKind: string;
      readonly identifier: string;
    };
