import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-units
 * Path: /key-stages/\{keyStage\}/subject/\{subject\}/units
 * Method: GET
 */

const operationId = 'getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits' as const;
const name = 'get-key-stages-subject-units' as const;
const path = '/key-stages/{keyStage}/subject/{subject}/units' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** Key stage slug to filter by, e.g. 'ks2' Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2'","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)","examples":["art"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2'"), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)") }) }) });
export const toolMcpFlatInputSchema = z.object({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2'"), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)") });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\'","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. \'science\' - note that casing is important here (always lowercase)","examples":["art"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
export const describeToolArgs = () => toolArgsDescription;
/**
 * Transform flat MCP arguments to nested SDK format.
 *
 * Converts flat parameter structure from MCP client to nested params.path/params.query
 * structure expected by SDK invoke function.
 *
 * @param flatArgs - Flat arguments from MCP client (validated against toolMcpFlatInputSchema)
 * @returns Nested arguments for SDK invoke function (ToolArgs format)
 */
export function transformFlatToNestedArgs(flatArgs: z.infer<typeof toolMcpFlatInputSchema>): ToolArgs {
  const params: ToolParams = {
    path: {
      keyStage: flatArgs.keyStage,
      subject: flatArgs.subject,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
type DocumentedStatusDiscriminant = StatusDiscriminant<DocumentedStatus>;
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits.');
}
const resolveDescriptorForStatus = (status: number) => {
  const directKey = String(status);
  const direct = responseDescriptors[directKey];
  if (direct) {
    return direct;
  }
  const rangeKey = `${String(Math.trunc(status / 100))}XX`;
  const range = responseDescriptors[rangeKey];
  if (range) {
    return range;
  }
  return responseDescriptors["default"];
};
function toStatusDiscriminant<T extends string>(status: T): StatusDiscriminant<T> {
  const numeric = Number(status);
  return (Number.isNaN(numeric) ? status : numeric) as StatusDiscriminant<T>;
}
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getKeyStagesSubjectUnits = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/key-stages/{keyStage}/subject/{subject}/units"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/units');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getAllKeyStageAndSubjectUnits-getAllKeyStageAndSubjectUnits. Documented statuses: 200`);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    // Structural limitation: descriptor is dynamically resolved at runtime, so
    // TypeScript cannot statically infer the output type. This single cast
    // bridges the gap between the runtime-selected schema and the static type.
    return payload as z.infer<typeof descriptorForStatus.zod>;
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolMcpFlatInputSchema,
  transformFlatToNestedArgs,
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "Units\n\nThis tool returns an array of units containing available published lessons for a given key stage and subject, grouped by year. Units without published lessons will not be returned by this tool.\n\nPREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology` first to understand key stages, subjects, entity hierarchy, and ID formats.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  requiresDomainContext: true,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Key Stages Subject Units",
  },
  _meta: {
    'openai/outputTemplate': "ui://widget/oak-json-viewer-local.html",
    'openai/toolInvocation/invoking': "Fetching Get Key Stages Subject Units…",
    'openai/toolInvocation/invoked': "Get Key Stages Subject Units loaded",
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  },
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: z.ZodError["issues"] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: toStatusDiscriminant(statusKey) };
      }
      attemptedStatuses.push({ status: toStatusDiscriminant(statusKey), issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
