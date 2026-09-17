/**
 * Compile-time contract for the published `@oaknational/sdk-codegen/mcp-tools`
 * subpath, which is a hand-authored barrel that enumerates its exports: a
 * type reachable only from an internal module is not reachable by consumers
 * at all.
 *
 * PaginationEcho appears on the public ToolResultForName shape (the
 * pagination echo derived from the upstream Link header), so a consumer
 * narrowing that field must be able to name its type. These assertions fail
 * `pnpm type-check` if that stops being true; there is nothing to run at
 * test time, so this is a typecheck module, not a Vitest suite (same form as
 * the logger contract typecheck).
 */

import type { PaginationEcho, ToolResultForName } from './mcp-tools.js';

type Assert<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsAssignable<From, To> = [From] extends [To] ? true : false;

type KeywordsPaginationField = NonNullable<ToolResultForName<'get-keywords'>['pagination']>;
type HasMoreBranch = Extract<PaginationEcho, { hasMore: true }>;
type TerminalBranch = Extract<PaginationEcho, { hasMore: false }>;

export const echoIsNameableFromThePublicSubpath: Assert<
  IsAssignable<PaginationEcho, KeywordsPaginationField>
> = true;
export const paginatedResultFieldIsTheEcho: Assert<
  IsAssignable<KeywordsPaginationField, PaginationEcho>
> = true;
export const nextValuesLiveOnTheHasMoreBranch: Assert<
  IsAssignable<HasMoreBranch['nextOffset'], number | undefined>
> = true;
export const terminalBranchCarriesNoNextValues: AssertFalse<
  'nextOffset' extends keyof TerminalBranch ? true : false
> = false;
