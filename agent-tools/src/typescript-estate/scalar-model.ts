/**
 * The tuple shapes the estate documents share. The scalar fields they once
 * aliased (a repository-relative POSIX path, a workspace package name, a
 * lower-case SHA-256, a Git object id) are plain strings validated at the
 * document boundary by their zod schemas; an alias of `string` carries no
 * guarantee the schema does not, so the fields say `string`.
 *
 * @packageDocumentation
 */
export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]];
export type AtLeastTwoReadonly<T> = readonly [T, T, ...T[]];
export type AtLeastThreeReadonly<T> = readonly [T, T, T, ...T[]];
export type AtLeastElevenReadonly<T> = readonly [T, T, T, T, T, T, T, T, T, T, T, ...T[]];
