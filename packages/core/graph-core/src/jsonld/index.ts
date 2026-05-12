/**
 * JSON-LD 1.1 processor adapter surface for graph-core.
 *
 * The public contract is exposed through graph-core's adapter aliases,
 * result shape, and error taxonomy rather than direct `jsonld.js` calls.
 * `jsonld.js` is the default runtime implementation; callers depend on this
 * versioned adapter boundary rather than directly on the third-party package.
 */

export {
  createJsonLdProcessor,
  createJsonLdProcessorWithDriver,
  type CompactedJsonLdDocument,
  type ExpandedJsonLdDocument,
  type FramedJsonLdDocument,
  type JsonLdContext,
  type JsonLdDocument,
  type JsonLdFrame,
  type JsonLdObject,
  type JsonLdProcessor,
  type JsonLdProcessorDriver,
  type JsonLdProcessorError,
  type JsonLdProcessorErrorKind,
  type JsonLdProcessorImplementation,
  type JsonLdProcessorOperation,
  type JsonLdProcessorResult,
  type JsonLdValue,
} from './processor.js';
