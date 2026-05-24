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

const noRemoteDocumentLoader: JsonLdDocumentLoader = async (url: string): Promise<never> => {
  throw new Error(`Remote JSON-LD document loading is disabled for graph-core: ${url}`);
};

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
