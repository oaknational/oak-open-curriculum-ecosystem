import { compact, expand, frame } from 'jsonld';
import type {
  ContextDefinition as NativeJsonLdContext,
  JsonLdDocument as NativeJsonLdDocument,
  NodeObject as NativeJsonLdObject,
  Options as JsonLdOptions,
} from 'jsonld';

export type JsonLdRuntimeDocument = NativeJsonLdDocument;
export type JsonLdRuntimeContext = NativeJsonLdContext;
export type JsonLdRuntimeFrame = Parameters<typeof frame>[1];
export type JsonLdRuntimeObject = NativeJsonLdObject;

type JsonLdDocumentLoader = NonNullable<JsonLdOptions.Expand['documentLoader']>;
type JsonLdFrameOptions = JsonLdOptions.Expand & JsonLdOptions.Frame;

interface JsonLdRuntime {
  expand(
    document: JsonLdRuntimeDocument,
    options?: JsonLdOptions.Expand,
  ): ReturnType<typeof expand>;
  compact(
    document: JsonLdRuntimeDocument,
    context: JsonLdRuntimeContext,
    options?: JsonLdOptions.Compact,
  ): ReturnType<typeof compact>;
  frame(
    document: JsonLdRuntimeDocument,
    frame: JsonLdRuntimeFrame,
    options?: JsonLdFrameOptions,
  ): Promise<unknown>;
}

export const jsonLdRuntime: JsonLdRuntime = {
  expand(document, options) {
    return expand(document, options);
  },
  compact(document, context, options) {
    return compact(document, context, options);
  },
  frame(document, nativeFrame, options) {
    return frame(document, nativeFrame, options);
  },
};

// jsonld's documentLoader contract refuses a URL by REJECTING the returned
// promise — that is the third party's error protocol, which we honour rather
// than trying to make the vendor speak Result (ADR-088). The rejection is
// translated to a typed Result at our boundary (processor.ts `runProcessor`'s
// try/catch -> err(processorFailure)). Expressed as `Promise.reject` rather
// than a `throw` statement so the refusal is not an invisible throw.
const noRemoteDocumentLoader: JsonLdDocumentLoader = (url: string): Promise<never> =>
  Promise.reject(new Error(`Remote JSON-LD document loading is disabled for graph-core: ${url}`));

export const noRemoteExpandOptions = {
  documentLoader: noRemoteDocumentLoader,
} satisfies JsonLdOptions.Expand;

export const noRemoteCompactOptions = {
  documentLoader: noRemoteDocumentLoader,
} satisfies JsonLdOptions.Compact;

export const noRemoteFrameOptions = {
  documentLoader: noRemoteDocumentLoader,
  explicit: false,
} satisfies JsonLdFrameOptions;
