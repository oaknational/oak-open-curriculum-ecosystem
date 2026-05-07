import type { LogContextInput, Logger, NormalizedError } from '../src/index.js';

type Assert<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsAssignable<From, To> = [From] extends [To] ? true : false;

type ErrorHasContextOverload = Logger extends {
  error(message: string, context?: LogContextInput): void;
}
  ? true
  : false;

type FatalHasContextOverload = Logger extends {
  fatal(message: string, context?: LogContextInput): void;
}
  ? true
  : false;

type ErrorSecondArgument = Parameters<Logger['error']>[1];
type FatalSecondArgument = Parameters<Logger['fatal']>[1];

export const errorHasContextOverload: Assert<ErrorHasContextOverload> = true;
export const fatalHasContextOverload: Assert<FatalHasContextOverload> = true;
export const acceptsNormalizedErrorForError: Assert<
  IsAssignable<NormalizedError, ErrorSecondArgument>
> = true;
export const acceptsNormalizedErrorForFatal: Assert<
  IsAssignable<NormalizedError, FatalSecondArgument>
> = true;
export const rejectsRawErrorForError: AssertFalse<IsAssignable<Error, ErrorSecondArgument>> = false;
export const rejectsRawErrorForFatal: AssertFalse<IsAssignable<Error, FatalSecondArgument>> = false;
export const rejectsStringForError: AssertFalse<IsAssignable<string, ErrorSecondArgument>> = false;
export const rejectsStringForFatal: AssertFalse<IsAssignable<string, FatalSecondArgument>> = false;
