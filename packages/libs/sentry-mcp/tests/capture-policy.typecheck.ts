import type { McpObservationOptions } from '../src/index.js';

type Assert<T extends true> = T;
type AssertFalse<T extends false> = T;
type IsAssignable<From, To> = [From] extends [To] ? true : false;

type RecordInputsType = McpObservationOptions['recordInputs'];
type RecordOutputsType = McpObservationOptions['recordOutputs'];

const recordInputsDefaultsToFalse: Assert<IsAssignable<false | undefined, RecordInputsType>> = true;
const recordOutputsDefaultsToFalse: Assert<IsAssignable<false | undefined, RecordOutputsType>> =
  true;

const recordInputsRejectsTrue: AssertFalse<IsAssignable<true, RecordInputsType>> = false;
const recordOutputsRejectsTrue: AssertFalse<IsAssignable<true, RecordOutputsType>> = false;

void recordInputsDefaultsToFalse;
void recordOutputsDefaultsToFalse;
void recordInputsRejectsTrue;
void recordOutputsRejectsTrue;
