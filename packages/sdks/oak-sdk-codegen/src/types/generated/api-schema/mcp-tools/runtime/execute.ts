/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Runtime executors for schema-derived MCP tools.
 *
 * Generated from packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.ts
 *
 * @remarks This file is part of the schema-first execution DAG described in
 * .agent/directives/schema-first-execution.md. Do not hand-edit.
 */
import type { Logger } from '@oaknational/logger';
import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { getToolEntryFromToolName, getToolFromToolName, isToolName, toolNames, type ToolDescriptorForName, type ToolName } from '../definitions.js';
import type { ToolArgsForName, ToolClientForName, ToolResultForName } from '../aliases/types.js';
import { DOCUMENTED_ERROR_PREFIX } from '../contract/tool-descriptor.contract.js';

export function listAllToolDescriptors(): readonly ToolDescriptorForName<ToolName>[] {
  return toolNames.map((name) => getToolFromToolName(name));
}

async function invokeGetChangelogTool(
  client: ToolClientForName<'get-changelog'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-changelog'>> {
  const descriptor: ToolDescriptorForName<'get-changelog'> = getToolEntryFromToolName('get-changelog').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetChangelogLatestTool(
  client: ToolClientForName<'get-changelog-latest'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-changelog-latest'>> {
  const descriptor: ToolDescriptorForName<'get-changelog-latest'> = getToolEntryFromToolName('get-changelog-latest').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeyStagesTool(
  client: ToolClientForName<'get-key-stages'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-key-stages'>> {
  const descriptor: ToolDescriptorForName<'get-key-stages'> = getToolEntryFromToolName('get-key-stages').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeyStagesSubjectAssetsTool(
  client: ToolClientForName<'get-key-stages-subject-assets'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-key-stages-subject-assets'>> {
  const descriptor: ToolDescriptorForName<'get-key-stages-subject-assets'> = getToolEntryFromToolName('get-key-stages-subject-assets').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeyStagesSubjectLessonsTool(
  client: ToolClientForName<'get-key-stages-subject-lessons'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-key-stages-subject-lessons'>> {
  const descriptor: ToolDescriptorForName<'get-key-stages-subject-lessons'> = getToolEntryFromToolName('get-key-stages-subject-lessons').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeyStagesSubjectQuestionsTool(
  client: ToolClientForName<'get-key-stages-subject-questions'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-key-stages-subject-questions'>> {
  const descriptor: ToolDescriptorForName<'get-key-stages-subject-questions'> = getToolEntryFromToolName('get-key-stages-subject-questions').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeyStagesSubjectUnitsTool(
  client: ToolClientForName<'get-key-stages-subject-units'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-key-stages-subject-units'>> {
  const descriptor: ToolDescriptorForName<'get-key-stages-subject-units'> = getToolEntryFromToolName('get-key-stages-subject-units').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetKeywordsTool(
  client: ToolClientForName<'get-keywords'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-keywords'>> {
  const descriptor: ToolDescriptorForName<'get-keywords'> = getToolEntryFromToolName('get-keywords').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetLessonsAssetsTool(
  client: ToolClientForName<'get-lessons-assets'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-lessons-assets'>> {
  const descriptor: ToolDescriptorForName<'get-lessons-assets'> = getToolEntryFromToolName('get-lessons-assets').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetLessonsQuizTool(
  client: ToolClientForName<'get-lessons-quiz'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-lessons-quiz'>> {
  const descriptor: ToolDescriptorForName<'get-lessons-quiz'> = getToolEntryFromToolName('get-lessons-quiz').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetLessonsSummaryTool(
  client: ToolClientForName<'get-lessons-summary'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-lessons-summary'>> {
  const descriptor: ToolDescriptorForName<'get-lessons-summary'> = getToolEntryFromToolName('get-lessons-summary').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetLessonsTranscriptTool(
  client: ToolClientForName<'get-lessons-transcript'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-lessons-transcript'>> {
  const descriptor: ToolDescriptorForName<'get-lessons-transcript'> = getToolEntryFromToolName('get-lessons-transcript').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetRateLimitTool(
  client: ToolClientForName<'get-rate-limit'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-rate-limit'>> {
  const descriptor: ToolDescriptorForName<'get-rate-limit'> = getToolEntryFromToolName('get-rate-limit').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSequencesAssetsTool(
  client: ToolClientForName<'get-sequences-assets'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-sequences-assets'>> {
  const descriptor: ToolDescriptorForName<'get-sequences-assets'> = getToolEntryFromToolName('get-sequences-assets').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSequencesQuestionsTool(
  client: ToolClientForName<'get-sequences-questions'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-sequences-questions'>> {
  const descriptor: ToolDescriptorForName<'get-sequences-questions'> = getToolEntryFromToolName('get-sequences-questions').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSequencesUnitsTool(
  client: ToolClientForName<'get-sequences-units'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-sequences-units'>> {
  const descriptor: ToolDescriptorForName<'get-sequences-units'> = getToolEntryFromToolName('get-sequences-units').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSubjectDetailTool(
  client: ToolClientForName<'get-subject-detail'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-subject-detail'>> {
  const descriptor: ToolDescriptorForName<'get-subject-detail'> = getToolEntryFromToolName('get-subject-detail').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSubjectsTool(
  client: ToolClientForName<'get-subjects'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-subjects'>> {
  const descriptor: ToolDescriptorForName<'get-subjects'> = getToolEntryFromToolName('get-subjects').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSubjectsKeyStagesTool(
  client: ToolClientForName<'get-subjects-key-stages'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-subjects-key-stages'>> {
  const descriptor: ToolDescriptorForName<'get-subjects-key-stages'> = getToolEntryFromToolName('get-subjects-key-stages').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSubjectsSequencesTool(
  client: ToolClientForName<'get-subjects-sequences'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-subjects-sequences'>> {
  const descriptor: ToolDescriptorForName<'get-subjects-sequences'> = getToolEntryFromToolName('get-subjects-sequences').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetSubjectsYearsTool(
  client: ToolClientForName<'get-subjects-years'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-subjects-years'>> {
  const descriptor: ToolDescriptorForName<'get-subjects-years'> = getToolEntryFromToolName('get-subjects-years').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetThreadsTool(
  client: ToolClientForName<'get-threads'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-threads'>> {
  const descriptor: ToolDescriptorForName<'get-threads'> = getToolEntryFromToolName('get-threads').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetThreadsUnitsTool(
  client: ToolClientForName<'get-threads-units'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-threads-units'>> {
  const descriptor: ToolDescriptorForName<'get-threads-units'> = getToolEntryFromToolName('get-threads-units').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeGetUnitsSummaryTool(
  client: ToolClientForName<'get-units-summary'>,
  rawArgs: unknown,
): Promise<ToolResultForName<'get-units-summary'>> {
  const descriptor: ToolDescriptorForName<'get-units-summary'> = getToolEntryFromToolName('get-units-summary').descriptor;
  const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
  if (!parsed.success) {
    throw new TypeError(descriptor.describeToolArgs());
  }
  const flatArgs = parsed.data;
  const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
  const invokeResult = await descriptor.invoke(client, nestedArgs);
  if (invokeResult.httpStatus >= 400) {
    throw new TypeError(DOCUMENTED_ERROR_PREFIX + String(invokeResult.httpStatus), {
      cause: { httpStatus: invokeResult.httpStatus, payload: invokeResult.payload },
    });
  }
  const validation = descriptor.validateOutput(invokeResult.payload);
  if (!validation.ok) {
    throw new TypeError('Output validation error: ' + validation.message, {
      cause: {
        raw: invokeResult.payload,
        issues: validation.issues,
        attemptedStatuses: validation.attemptedStatuses,
      },
    });
  }
  return { status: validation.status, data: validation.data };
}

async function invokeToolByName<TName extends ToolName>(
  name: TName,
  client: ToolClientForName<TName>,
  rawArgs: unknown,
): Promise<ToolResultForName<ToolName>> {
  switch (name) {
    case 'get-changelog':
      return invokeGetChangelogTool(client, rawArgs);
    case 'get-changelog-latest':
      return invokeGetChangelogLatestTool(client, rawArgs);
    case 'get-key-stages':
      return invokeGetKeyStagesTool(client, rawArgs);
    case 'get-key-stages-subject-assets':
      return invokeGetKeyStagesSubjectAssetsTool(client, rawArgs);
    case 'get-key-stages-subject-lessons':
      return invokeGetKeyStagesSubjectLessonsTool(client, rawArgs);
    case 'get-key-stages-subject-questions':
      return invokeGetKeyStagesSubjectQuestionsTool(client, rawArgs);
    case 'get-key-stages-subject-units':
      return invokeGetKeyStagesSubjectUnitsTool(client, rawArgs);
    case 'get-keywords':
      return invokeGetKeywordsTool(client, rawArgs);
    case 'get-lessons-assets':
      return invokeGetLessonsAssetsTool(client, rawArgs);
    case 'get-lessons-quiz':
      return invokeGetLessonsQuizTool(client, rawArgs);
    case 'get-lessons-summary':
      return invokeGetLessonsSummaryTool(client, rawArgs);
    case 'get-lessons-transcript':
      return invokeGetLessonsTranscriptTool(client, rawArgs);
    case 'get-rate-limit':
      return invokeGetRateLimitTool(client, rawArgs);
    case 'get-sequences-assets':
      return invokeGetSequencesAssetsTool(client, rawArgs);
    case 'get-sequences-questions':
      return invokeGetSequencesQuestionsTool(client, rawArgs);
    case 'get-sequences-units':
      return invokeGetSequencesUnitsTool(client, rawArgs);
    case 'get-subject-detail':
      return invokeGetSubjectDetailTool(client, rawArgs);
    case 'get-subjects':
      return invokeGetSubjectsTool(client, rawArgs);
    case 'get-subjects-key-stages':
      return invokeGetSubjectsKeyStagesTool(client, rawArgs);
    case 'get-subjects-sequences':
      return invokeGetSubjectsSequencesTool(client, rawArgs);
    case 'get-subjects-years':
      return invokeGetSubjectsYearsTool(client, rawArgs);
    case 'get-threads':
      return invokeGetThreadsTool(client, rawArgs);
    case 'get-threads-units':
      return invokeGetThreadsUnitsTool(client, rawArgs);
    case 'get-units-summary':
      return invokeGetUnitsSummaryTool(client, rawArgs);
    default:
      throw new TypeError('Unknown tool: ' + String(name));
  }
}

export function callTool(
  name: 'get-changelog',
  client: ToolClientForName<'get-changelog'>,
  rawArgs: ToolArgsForName<'get-changelog'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-changelog'>>;
export function callTool(
  name: 'get-changelog-latest',
  client: ToolClientForName<'get-changelog-latest'>,
  rawArgs: ToolArgsForName<'get-changelog-latest'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-changelog-latest'>>;
export function callTool(
  name: 'get-key-stages',
  client: ToolClientForName<'get-key-stages'>,
  rawArgs: ToolArgsForName<'get-key-stages'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-key-stages'>>;
export function callTool(
  name: 'get-key-stages-subject-assets',
  client: ToolClientForName<'get-key-stages-subject-assets'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-assets'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-key-stages-subject-assets'>>;
export function callTool(
  name: 'get-key-stages-subject-lessons',
  client: ToolClientForName<'get-key-stages-subject-lessons'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-lessons'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-key-stages-subject-lessons'>>;
export function callTool(
  name: 'get-key-stages-subject-questions',
  client: ToolClientForName<'get-key-stages-subject-questions'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-questions'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-key-stages-subject-questions'>>;
export function callTool(
  name: 'get-key-stages-subject-units',
  client: ToolClientForName<'get-key-stages-subject-units'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-units'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-key-stages-subject-units'>>;
export function callTool(
  name: 'get-keywords',
  client: ToolClientForName<'get-keywords'>,
  rawArgs: ToolArgsForName<'get-keywords'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-keywords'>>;
export function callTool(
  name: 'get-lessons-assets',
  client: ToolClientForName<'get-lessons-assets'>,
  rawArgs: ToolArgsForName<'get-lessons-assets'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-lessons-assets'>>;
export function callTool(
  name: 'get-lessons-quiz',
  client: ToolClientForName<'get-lessons-quiz'>,
  rawArgs: ToolArgsForName<'get-lessons-quiz'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-lessons-quiz'>>;
export function callTool(
  name: 'get-lessons-summary',
  client: ToolClientForName<'get-lessons-summary'>,
  rawArgs: ToolArgsForName<'get-lessons-summary'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-lessons-summary'>>;
export function callTool(
  name: 'get-lessons-transcript',
  client: ToolClientForName<'get-lessons-transcript'>,
  rawArgs: ToolArgsForName<'get-lessons-transcript'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-lessons-transcript'>>;
export function callTool(
  name: 'get-rate-limit',
  client: ToolClientForName<'get-rate-limit'>,
  rawArgs: ToolArgsForName<'get-rate-limit'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-rate-limit'>>;
export function callTool(
  name: 'get-sequences-assets',
  client: ToolClientForName<'get-sequences-assets'>,
  rawArgs: ToolArgsForName<'get-sequences-assets'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-sequences-assets'>>;
export function callTool(
  name: 'get-sequences-questions',
  client: ToolClientForName<'get-sequences-questions'>,
  rawArgs: ToolArgsForName<'get-sequences-questions'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-sequences-questions'>>;
export function callTool(
  name: 'get-sequences-units',
  client: ToolClientForName<'get-sequences-units'>,
  rawArgs: ToolArgsForName<'get-sequences-units'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-sequences-units'>>;
export function callTool(
  name: 'get-subject-detail',
  client: ToolClientForName<'get-subject-detail'>,
  rawArgs: ToolArgsForName<'get-subject-detail'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-subject-detail'>>;
export function callTool(
  name: 'get-subjects',
  client: ToolClientForName<'get-subjects'>,
  rawArgs: ToolArgsForName<'get-subjects'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-subjects'>>;
export function callTool(
  name: 'get-subjects-key-stages',
  client: ToolClientForName<'get-subjects-key-stages'>,
  rawArgs: ToolArgsForName<'get-subjects-key-stages'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-subjects-key-stages'>>;
export function callTool(
  name: 'get-subjects-sequences',
  client: ToolClientForName<'get-subjects-sequences'>,
  rawArgs: ToolArgsForName<'get-subjects-sequences'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-subjects-sequences'>>;
export function callTool(
  name: 'get-subjects-years',
  client: ToolClientForName<'get-subjects-years'>,
  rawArgs: ToolArgsForName<'get-subjects-years'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-subjects-years'>>;
export function callTool(
  name: 'get-threads',
  client: ToolClientForName<'get-threads'>,
  rawArgs: ToolArgsForName<'get-threads'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-threads'>>;
export function callTool(
  name: 'get-threads-units',
  client: ToolClientForName<'get-threads-units'>,
  rawArgs: ToolArgsForName<'get-threads-units'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-threads-units'>>;
export function callTool(
  name: 'get-units-summary',
  client: ToolClientForName<'get-units-summary'>,
  rawArgs: ToolArgsForName<'get-units-summary'>,
  logger?: Logger,
): Promise<ToolResultForName<'get-units-summary'>>;
export function callTool(
  name: ToolName,
  client: ToolClientForName<ToolName>,
  rawArgs: unknown,
  logger?: Logger,
): Promise<ToolResultForName<ToolName>>;

export async function callTool(
  name: ToolName,
  client: ToolClientForName<ToolName>,
  rawArgs: unknown,
  logger?: Logger,
): Promise<ToolResultForName<ToolName>> {
  logger?.debug('mcp-tool.generated.call', { toolName: name, hasArgs: rawArgs !== undefined });
  return invokeToolByName(name, client, rawArgs);
}

export async function callToolWithValidation(
  request: CallToolRequest,
  client: ToolClientForName<ToolName>,
  logger?: Logger,
): Promise<ToolResultForName<ToolName>> {
  logger?.debug('mcp-tool.generated.validate', { hasRequest: true });
  const { params } = CallToolRequestSchema.parse(request);
  const { name, arguments: rawArgs } = params;
  if (!isToolName(name)) {
    throw new TypeError('Unknown tool: ' + String(name));
  }
  return callTool(name, client, rawArgs, logger);
}