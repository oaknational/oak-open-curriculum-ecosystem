/* AI Doc Types and utilities */

import { z, type ZodType } from 'zod';

// Strong TS types (exact runtime-aligned shapes)
export interface TDIntrinsic {
  type: 'intrinsic';
  name: string;
}
export interface TDReference {
  type: 'reference';
  name: string;
  typeArguments?: TDType[];
}
export interface TDArray {
  type: 'array';
  elementType: TDType;
}
export interface TDUnion {
  type: 'union';
  types: TDType[];
}
export interface TDLiteral {
  type: 'literal';
  value: string | number | boolean | null;
}
export type TDType = TDIntrinsic | TDReference | TDArray | TDUnion | TDLiteral;

export interface TDCommentPart {
  kind: string;
  text: string;
}
export interface TDBlockTag {
  tag: string;
  content?: TDCommentPart[];
}
export interface TDComment {
  summary?: TDCommentPart[];
  blockTags?: TDBlockTag[];
  shortText?: string;
  text?: string;
}
export interface TDSource {
  fileName: string;
  line: number;
  character: number;
  url?: string;
}
export interface TDParameter {
  name: string;
  type?: unknown;
}
export interface TDSignature {
  name: string;
  parameters?: TDParameter[];
  type?: unknown;
  comment?: TDComment;
}
export interface TDReflection {
  id: number;
  name: string;
  kind?: number;
  variant?: string;
  kindString?: string;
  children?: TDReflection[];
  flags?: { isExported?: boolean };
  signatures?: TDSignature[];
  type?: unknown;
  sources?: TDSource[];
  comment?: TDComment;
}
export interface TDProject {
  name: string;
  children?: TDReflection[];
}

// Exact Zod schemas (single source of truth)
const zTDCommentPart: ZodType<TDCommentPart> = z.object({
  kind: z.string(),
  text: z.string(),
});

const zTDSource: ZodType<TDSource> = z.object({
  fileName: z.string(),
  line: z.number(),
  character: z.number(),
  url: z.string().url().optional(),
});
const zTDBlockTag: ZodType<TDBlockTag> = z.object({
  tag: z.string(),
  content: z.array(zTDCommentPart).optional(),
});
const zTDComment: ZodType<TDComment> = z.object({
  summary: z.array(zTDCommentPart).optional(),
  blockTags: z.array(zTDBlockTag).optional(),
  shortText: z.string().optional(),
  text: z.string().optional(),
});

// Known TD types
const zTDTypeKnown: ZodType<TDType> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({ type: z.literal('intrinsic'), name: z.string() }),
    z.object({
      type: z.literal('reference'),
      name: z.string(),
      typeArguments: z.array(zTDTypeKnown).optional(),
    }),
    z.object({ type: z.literal('array'), elementType: zTDTypeKnown }),
    z.object({ type: z.literal('union'), types: z.array(zTDTypeKnown) }),
    z.object({
      type: z.literal('literal'),
      value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    }),
  ]),
);

// Fallback to accept any other TypeDoc node kinds without failing validation
const zTDTypeAny: ZodType<unknown> = z.union([
  zTDTypeKnown,
  z.object({ type: z.string() }).passthrough(),
]);

const zTDParameter: ZodType<TDParameter> = z.object({
  name: z.string(),
  type: zTDTypeAny.optional(),
});
const zTDSignature: ZodType<TDSignature> = z.object({
  name: z.string(),
  parameters: z.array(zTDParameter).optional(),
  type: zTDTypeAny.optional(),
  comment: zTDComment.optional(),
});

const zTDReflection: ZodType<TDReflection> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    kind: z.number().optional(),
    variant: z.string().optional(),
    kindString: z.string().optional(),
    children: z.array(zTDReflection).optional(),
    flags: z
      .object({
        isExported: z.boolean().optional(),
      })
      .optional(),
    signatures: z.array(zTDSignature).optional(),
    type: zTDTypeAny.optional(),
    sources: z.array(zTDSource).optional(),
    comment: zTDComment.optional(),
  }),
);
const zTDProject: ZodType<TDProject> = z.object({
  name: z.string(),
  children: z.array(zTDReflection).optional(),
});

export function parseTDProject(v: unknown): TDProject {
  return zTDProject.parse(v);
}

export function isTDProject(v: unknown): v is TDProject {
  return zTDProject.safeParse(v).success;
}

export function collectExports(root: TDProject): TDReflection[] {
  // In TypeDoc 0.26+, project.children contains exported top-level reflections.
  // Avoid relying on kindString/flags.isExported, which may be absent.
  const out: TDReflection[] = [];
  for (const child of root.children ?? []) {
    out.push(child);
  }
  return out;
}
