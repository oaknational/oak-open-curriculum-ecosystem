/**
 * Shared JSON-LD processor types extracted to break the cycle between
 * `processor.ts` and `remote-context.ts`. Both files (and the public
 * `index.ts`) import their type vocabulary from here; the cycle goes
 * away because `remote-context.ts` no longer needs to import from
 * `processor.ts` and `processor.ts` continues to import its
 * function-level dependencies from `remote-context.ts` in one
 * direction only.
 */

import type {
  JsonLdRuntimeContext,
  JsonLdRuntimeDocument,
  JsonLdRuntimeFrame,
  JsonLdRuntimeObject,
} from './runtime.js';

type JsonLdScalar = string | number | boolean | null;

export type JsonLdObject = JsonLdRuntimeObject;

export type JsonLdValue =
  | JsonLdScalar
  | JsonLdObject
  | JsonLdRuntimeContext
  | JsonLdRuntimeDocument
  | NonNullable<JsonLdObject[string]>
  | JsonLdValue[];

export type JsonLdDocument = JsonLdRuntimeDocument;

export type JsonLdContext = JsonLdRuntimeContext;

export type JsonLdFrame = JsonLdRuntimeFrame;

export type ExpandedJsonLdDocument = JsonLdObject[];

export type JsonLdProcessorOperation = 'expand' | 'compact' | 'frame';

export type JsonLdProcessorErrorKind =
  | 'processor_failed'
  | 'invalid_processor_output'
  | 'remote_context_disallowed';

export interface JsonLdProcessorError {
  readonly kind: JsonLdProcessorErrorKind;
  readonly operation: JsonLdProcessorOperation;
  readonly message: string;
  readonly cause?: Error;
}

export type JsonLdProcessorResult<T> =
  | {
      readonly ok: true;
      readonly value: T;
    }
  | {
      readonly ok: false;
      readonly error: JsonLdProcessorError;
    };
