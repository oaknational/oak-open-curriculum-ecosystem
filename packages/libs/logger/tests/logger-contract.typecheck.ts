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

const errorHasContextOverload: Assert<ErrorHasContextOverload> = true;
const fatalHasContextOverload: Assert<FatalHasContextOverload> = true;

const acceptsNormalizedErrorForError: Assert<IsAssignable<NormalizedError, ErrorSecondArgument>> =
  true;
const acceptsNormalizedErrorForFatal: Assert<IsAssignable<NormalizedError, FatalSecondArgument>> =
  true;

const rejectsRawErrorForError: AssertFalse<IsAssignable<Error, ErrorSecondArgument>> = false;
const rejectsRawErrorForFatal: AssertFalse<IsAssignable<Error, FatalSecondArgument>> = false;

const rejectsStringForError: AssertFalse<IsAssignable<string, ErrorSecondArgument>> = false;
const rejectsStringForFatal: AssertFalse<IsAssignable<string, FatalSecondArgument>> = false;

void errorHasContextOverload;
void fatalHasContextOverload;
void acceptsNormalizedErrorForError;
void acceptsNormalizedErrorForFatal;
void rejectsRawErrorForError;
void rejectsRawErrorForFatal;
void rejectsStringForError;
void rejectsStringForFatal;
