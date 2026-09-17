/** Repository-relative POSIX path validated at the document boundary. */
export type RepoPath = string;

/** Workspace package name validated against the frozen package-name grammar. */
export type WorkspacePackageName = string;

/** Lower-case hexadecimal SHA-256 validated at the document boundary. */
export type Sha256 = string;

/** Full hexadecimal Git object id validated at the document boundary. */
export type GitObjectId = string;

export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];
export type AtLeastTwoReadonly<T> = readonly [T, T, ...T[]];
export type AtLeastThreeReadonly<T> = readonly [T, T, T, ...T[]];
export type AtLeastElevenReadonly<T> = readonly [T, T, T, T, T, T, T, T, T, T, T, ...T[]];
