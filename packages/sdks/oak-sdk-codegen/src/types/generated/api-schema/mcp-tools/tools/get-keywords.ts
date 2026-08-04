import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-keywords
 * Path: /keywords
 * Method: GET
 */

const operationId = 'getKeywords-getKeywords' as const;
const name = 'get-keywords' as const;
const path = '/keywords' as const;
const method = 'GET' as const;


/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject?: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
  /** Key stage slug to filter by, e.g. 'ks2' Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage. Allowed values: primary, secondary */
  readonly phase?: 'primary' | 'secondary';
  /** Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase) */
  readonly unit?: string;
  /** Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase) */
  readonly lesson?: string;
  /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
  readonly offset?: number;
  /** Limit the number of keywords, e.g. return a maximum of 300 keywords Default: 20 */
  readonly limit?: number;
}
export interface ToolParams {
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"subject":{"type":"string","description":"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2'","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"phase":{"type":"string","description":"Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage.","enum":["primary","secondary"]},"unit":{"type":"string","description":"Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase)"},"lesson":{"type":"string","description":"Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase)"},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of keywords, e.g. return a maximum of 300 keywords","default":20,"examples":[20],"maximum":300}} as const, additionalProperties: false as const };
export const toolZodSchema = z.object({ params: z.object({ query: z.object({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)").optional(), keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2'").optional(), phase: z.enum(["primary", "secondary"] as const).describe("Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage.").optional(), unit: z.string().describe("Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase)").optional(), lesson: z.string().describe("Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase)").optional(), offset: z.number().describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").optional(), limit: z.number().lte(300).describe("Limit the number of keywords, e.g. return a maximum of 300 keywords").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)").meta({ examples: ["english"] }).optional(), keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2'").meta({ examples: ["ks1"] }).optional(), phase: z.enum(["primary", "secondary"] as const).describe("Phase to filter by, e.g. 'primary' or 'secondary'. Cannot be combined with keyStage.").optional(), unit: z.string().describe("Unit slug to search by, e.g. 'forces-and-magnets' - note that casing is important here (always lowercase)").optional(), lesson: z.string().describe("Lesson slug to search by, e.g. 'animating-text' - note that casing is important here (always lowercase)").optional(), offset: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number()).describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").meta({ examples: [0] }).optional(), limit: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number().lte(300)).describe("Limit the number of keywords, e.g. return a maximum of 300 keywords").meta({ examples: [20] }).optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"Subject slug to search by, e.g. \'science\' - note that casing is important here (always lowercase)","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\'","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"phase":{"type":"string","description":"Phase to filter by, e.g. \'primary\' or \'secondary\'. Cannot be combined with keyStage.","enum":["primary","secondary"]},"unit":{"type":"string","description":"Unit slug to search by, e.g. \'forces-and-magnets\' - note that casing is important here (always lowercase)"},"lesson":{"type":"string","description":"Lesson slug to search by, e.g. \'animating-text\' - note that casing is important here (always lowercase)"},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of keywords, e.g. return a maximum of 300 keywords","default":20,"examples":[20],"maximum":300}},"additionalProperties":false}\nRequired: (none)';
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
    query: {
      subject: flatArgs.subject,
      keyStage: flatArgs.keyStage,
      phase: flatArgs.phase,
      unit: flatArgs.unit,
      lesson: flatArgs.lesson,
      offset: flatArgs.offset,
      limit: flatArgs.limit,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
const STATUS_DISCRIMINANTS = { '200': 200 } as const;
type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getKeywords-getKeywords.');
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
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getKeywords = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/keywords"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /keywords');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getKeywords-getKeywords', documentedStatuses, responseBody);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return { httpStatus: status, payload };
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
  description: "Keywords by subject and key stage\n\nUse when you want the vocabulary for a key stage, subject, unit, lesson, or phase — e.g. to build a glossary or attach definitions to content. Returns keywords with definition, the subject + key stage they appear in, and the lessons that use them, sorted alphabetically. All filters are optional, but pass at least one of keyStage, subject, unit, lesson, or phase. Request rules: - At least one of subject, keyStage, phase, unit or lesson must be provided - note that they are all the slug form of the values (e.g. \"ks2\" for key stage 2, \"science\" for the science subject, and \"forces-and-magnets\" for the forces and magnets unit), and that casing is important (always lowercase).\n\nWHEN TO PREFER WHICH KEYWORDS TOOL: this tool returns the LIVE keyword set for a key stage + subject — fresh and authoritative (including KS4 during curriculum restructures), alphabetical, unranked, and large at subject scope. For a bounded frequency-ranked subset with lesson connections (token economy + relationship navigation over the curriculum graph), prefer get-keyword-graph, which serves a point-in-time curriculum snapshot.\n\nNOTE: This tool is paginated — the server returns at most 20 keywords unless you pass `limit` (max 300), and nothing in the response indicates that more exist. For the complete set, pass `limit: 300` and increase `offset` by 300 per call until a page returns fewer than 300 keywords.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
  requiresDomainContext: true,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Keywords",
  },
  _meta: {
    securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
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
        return { ok: true, data: result.data, status: STATUS_DISCRIMINANTS[statusKey] };
      }
      attemptedStatuses.push({ status: STATUS_DISCRIMINANTS[statusKey], issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200',
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
