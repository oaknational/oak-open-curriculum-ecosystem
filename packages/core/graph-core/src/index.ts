/**
 * `@oaknational/graph-core` root barrel.
 *
 * Re-exports each sub-path module's public surface as named exports.
 * Direct sub-path imports (e.g. `@oaknational/graph-core/term`) remain
 * the preferred entrypoint; the root barrel exists for convenience and
 * discovery.
 */

export {
  equals,
  type BlankNode,
  type DefaultGraph,
  type GraphTerm,
  type Literal,
  type NamedNode,
  type ObjectTerm,
  type PredicateTerm,
  type Quad,
  type SubjectTerm,
  type Term,
  type TripleTerm,
} from './term/index.js';
export { createDataset, type DatasetCore } from './dataset/index.js';
export {
  blankNode,
  defaultGraph,
  literal,
  namedNode,
  quad,
  tripleTerm,
  type BlankNodeTerm,
  type LiteralTerm,
  type NamedNodeTerm,
} from './data-factory/index.js';
export {
  createJsonLdProcessor,
  createJsonLdProcessorWithDriver,
  type ExpandedJsonLdDocument,
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
} from './jsonld/index.js';
export {
  canonicalize,
  type CanonicalizationError,
  type CanonicalizationErrorKind,
  type CanonicalizationResult,
  type CanonicalizedDataset,
} from './canon/index.js';
