/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Runtime executors for schema-derived MCP tools.
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts
 *
 * @remarks This file is part of the schema-first execution DAG described in
 * .agent/directives/schema-first-execution.md. Do not hand-edit.
 */
import { CallToolRequestSchema, type CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { getToolEntryFromToolName, getToolFromToolName, isToolName, toolNames, type ToolDescriptorForName, type ToolName } from '../data/definitions.js';
import type { ToolArgsForName, ToolClientForName, ToolResultForName } from '../aliases/types.js';

export function listAllToolDescriptors(): readonly ToolDescriptorForName<ToolName>[] {
  return toolNames.map((name) => getToolFromToolName(name));
}

async function invokeToolByName<TName extends ToolName>(
  name: TName,
  client: ToolClientForName<TName>,
  rawArgs: unknown,
): Promise<ToolResultForName<TName>> {
  switch (name) {
    case 'get-changelog': {
      const entry = getToolEntryFromToolName('get-changelog');
      const descriptor: ToolDescriptorForName<'get-changelog'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-changelog-latest': {
      const entry = getToolEntryFromToolName('get-changelog-latest');
      const descriptor: ToolDescriptorForName<'get-changelog-latest'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-key-stages': {
      const entry = getToolEntryFromToolName('get-key-stages');
      const descriptor: ToolDescriptorForName<'get-key-stages'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-key-stages-subject-assets': {
      const entry = getToolEntryFromToolName('get-key-stages-subject-assets');
      const descriptor: ToolDescriptorForName<'get-key-stages-subject-assets'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-key-stages-subject-lessons': {
      const entry = getToolEntryFromToolName('get-key-stages-subject-lessons');
      const descriptor: ToolDescriptorForName<'get-key-stages-subject-lessons'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-key-stages-subject-questions': {
      const entry = getToolEntryFromToolName('get-key-stages-subject-questions');
      const descriptor: ToolDescriptorForName<'get-key-stages-subject-questions'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-key-stages-subject-units': {
      const entry = getToolEntryFromToolName('get-key-stages-subject-units');
      const descriptor: ToolDescriptorForName<'get-key-stages-subject-units'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-lessons-assets': {
      const entry = getToolEntryFromToolName('get-lessons-assets');
      const descriptor: ToolDescriptorForName<'get-lessons-assets'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-lessons-assets-by-type': {
      const entry = getToolEntryFromToolName('get-lessons-assets-by-type');
      const descriptor: ToolDescriptorForName<'get-lessons-assets-by-type'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-lessons-quiz': {
      const entry = getToolEntryFromToolName('get-lessons-quiz');
      const descriptor: ToolDescriptorForName<'get-lessons-quiz'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-lessons-summary': {
      const entry = getToolEntryFromToolName('get-lessons-summary');
      const descriptor: ToolDescriptorForName<'get-lessons-summary'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-lessons-transcript': {
      const entry = getToolEntryFromToolName('get-lessons-transcript');
      const descriptor: ToolDescriptorForName<'get-lessons-transcript'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-rate-limit': {
      const entry = getToolEntryFromToolName('get-rate-limit');
      const descriptor: ToolDescriptorForName<'get-rate-limit'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-sequences-assets': {
      const entry = getToolEntryFromToolName('get-sequences-assets');
      const descriptor: ToolDescriptorForName<'get-sequences-assets'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-sequences-questions': {
      const entry = getToolEntryFromToolName('get-sequences-questions');
      const descriptor: ToolDescriptorForName<'get-sequences-questions'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-sequences-units': {
      const entry = getToolEntryFromToolName('get-sequences-units');
      const descriptor: ToolDescriptorForName<'get-sequences-units'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-subject-detail': {
      const entry = getToolEntryFromToolName('get-subject-detail');
      const descriptor: ToolDescriptorForName<'get-subject-detail'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-subjects': {
      const entry = getToolEntryFromToolName('get-subjects');
      const descriptor: ToolDescriptorForName<'get-subjects'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-subjects-key-stages': {
      const entry = getToolEntryFromToolName('get-subjects-key-stages');
      const descriptor: ToolDescriptorForName<'get-subjects-key-stages'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-subjects-sequences': {
      const entry = getToolEntryFromToolName('get-subjects-sequences');
      const descriptor: ToolDescriptorForName<'get-subjects-sequences'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-subjects-years': {
      const entry = getToolEntryFromToolName('get-subjects-years');
      const descriptor: ToolDescriptorForName<'get-subjects-years'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-threads': {
      const entry = getToolEntryFromToolName('get-threads');
      const descriptor: ToolDescriptorForName<'get-threads'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-threads-units': {
      const entry = getToolEntryFromToolName('get-threads-units');
      const descriptor: ToolDescriptorForName<'get-threads-units'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    case 'get-units-summary': {
      const entry = getToolEntryFromToolName('get-units-summary');
      const descriptor: ToolDescriptorForName<'get-units-summary'> = entry.descriptor;
      const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
      if (!parsed.success) {
        throw new TypeError(descriptor.describeToolArgs());
      }
      const flatArgs = parsed.data;
      const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
      const output = await descriptor.invoke(client, nestedArgs);
      const validation = descriptor.validateOutput(output);
      if (!validation.ok) {
        throw new TypeError('Output validation error: ' + validation.message, {
          cause: { raw: output, issues: validation.issues, attemptedStatuses: validation.attemptedStatuses },
        });
      }
      return { status: validation.status, data: validation.data };
    }
    default:
      throw new TypeError('Unknown tool: ' + String(name));
  }
}

export function callTool(
  name: 'get-changelog',
  client: ToolClientForName<'get-changelog'>,
  rawArgs: ToolArgsForName<'get-changelog'>,
): Promise<ToolResultForName<'get-changelog'>>;
export function callTool(
  name: 'get-changelog-latest',
  client: ToolClientForName<'get-changelog-latest'>,
  rawArgs: ToolArgsForName<'get-changelog-latest'>,
): Promise<ToolResultForName<'get-changelog-latest'>>;
export function callTool(
  name: 'get-key-stages',
  client: ToolClientForName<'get-key-stages'>,
  rawArgs: ToolArgsForName<'get-key-stages'>,
): Promise<ToolResultForName<'get-key-stages'>>;
export function callTool(
  name: 'get-key-stages-subject-assets',
  client: ToolClientForName<'get-key-stages-subject-assets'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-assets'>,
): Promise<ToolResultForName<'get-key-stages-subject-assets'>>;
export function callTool(
  name: 'get-key-stages-subject-lessons',
  client: ToolClientForName<'get-key-stages-subject-lessons'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-lessons'>,
): Promise<ToolResultForName<'get-key-stages-subject-lessons'>>;
export function callTool(
  name: 'get-key-stages-subject-questions',
  client: ToolClientForName<'get-key-stages-subject-questions'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-questions'>,
): Promise<ToolResultForName<'get-key-stages-subject-questions'>>;
export function callTool(
  name: 'get-key-stages-subject-units',
  client: ToolClientForName<'get-key-stages-subject-units'>,
  rawArgs: ToolArgsForName<'get-key-stages-subject-units'>,
): Promise<ToolResultForName<'get-key-stages-subject-units'>>;
export function callTool(
  name: 'get-lessons-assets',
  client: ToolClientForName<'get-lessons-assets'>,
  rawArgs: ToolArgsForName<'get-lessons-assets'>,
): Promise<ToolResultForName<'get-lessons-assets'>>;
export function callTool(
  name: 'get-lessons-assets-by-type',
  client: ToolClientForName<'get-lessons-assets-by-type'>,
  rawArgs: ToolArgsForName<'get-lessons-assets-by-type'>,
): Promise<ToolResultForName<'get-lessons-assets-by-type'>>;
export function callTool(
  name: 'get-lessons-quiz',
  client: ToolClientForName<'get-lessons-quiz'>,
  rawArgs: ToolArgsForName<'get-lessons-quiz'>,
): Promise<ToolResultForName<'get-lessons-quiz'>>;
export function callTool(
  name: 'get-lessons-summary',
  client: ToolClientForName<'get-lessons-summary'>,
  rawArgs: ToolArgsForName<'get-lessons-summary'>,
): Promise<ToolResultForName<'get-lessons-summary'>>;
export function callTool(
  name: 'get-lessons-transcript',
  client: ToolClientForName<'get-lessons-transcript'>,
  rawArgs: ToolArgsForName<'get-lessons-transcript'>,
): Promise<ToolResultForName<'get-lessons-transcript'>>;
export function callTool(
  name: 'get-rate-limit',
  client: ToolClientForName<'get-rate-limit'>,
  rawArgs: ToolArgsForName<'get-rate-limit'>,
): Promise<ToolResultForName<'get-rate-limit'>>;
export function callTool(
  name: 'get-sequences-assets',
  client: ToolClientForName<'get-sequences-assets'>,
  rawArgs: ToolArgsForName<'get-sequences-assets'>,
): Promise<ToolResultForName<'get-sequences-assets'>>;
export function callTool(
  name: 'get-sequences-questions',
  client: ToolClientForName<'get-sequences-questions'>,
  rawArgs: ToolArgsForName<'get-sequences-questions'>,
): Promise<ToolResultForName<'get-sequences-questions'>>;
export function callTool(
  name: 'get-sequences-units',
  client: ToolClientForName<'get-sequences-units'>,
  rawArgs: ToolArgsForName<'get-sequences-units'>,
): Promise<ToolResultForName<'get-sequences-units'>>;
export function callTool(
  name: 'get-subject-detail',
  client: ToolClientForName<'get-subject-detail'>,
  rawArgs: ToolArgsForName<'get-subject-detail'>,
): Promise<ToolResultForName<'get-subject-detail'>>;
export function callTool(
  name: 'get-subjects',
  client: ToolClientForName<'get-subjects'>,
  rawArgs: ToolArgsForName<'get-subjects'>,
): Promise<ToolResultForName<'get-subjects'>>;
export function callTool(
  name: 'get-subjects-key-stages',
  client: ToolClientForName<'get-subjects-key-stages'>,
  rawArgs: ToolArgsForName<'get-subjects-key-stages'>,
): Promise<ToolResultForName<'get-subjects-key-stages'>>;
export function callTool(
  name: 'get-subjects-sequences',
  client: ToolClientForName<'get-subjects-sequences'>,
  rawArgs: ToolArgsForName<'get-subjects-sequences'>,
): Promise<ToolResultForName<'get-subjects-sequences'>>;
export function callTool(
  name: 'get-subjects-years',
  client: ToolClientForName<'get-subjects-years'>,
  rawArgs: ToolArgsForName<'get-subjects-years'>,
): Promise<ToolResultForName<'get-subjects-years'>>;
export function callTool(
  name: 'get-threads',
  client: ToolClientForName<'get-threads'>,
  rawArgs: ToolArgsForName<'get-threads'>,
): Promise<ToolResultForName<'get-threads'>>;
export function callTool(
  name: 'get-threads-units',
  client: ToolClientForName<'get-threads-units'>,
  rawArgs: ToolArgsForName<'get-threads-units'>,
): Promise<ToolResultForName<'get-threads-units'>>;
export function callTool(
  name: 'get-units-summary',
  client: ToolClientForName<'get-units-summary'>,
  rawArgs: ToolArgsForName<'get-units-summary'>,
): Promise<ToolResultForName<'get-units-summary'>>;
export function callTool(
  name: ToolName,
  client: ToolClientForName<ToolName>,
  rawArgs: unknown,
): Promise<ToolResultForName<ToolName>>;

export async function callTool<TName extends ToolName>(
  name: TName,
  client: ToolClientForName<TName>,
  rawArgs: unknown,
): Promise<ToolResultForName<TName>> {
  return invokeToolByName(name, client, rawArgs);
}

export async function callToolWithValidation(
  request: CallToolRequest,
  client: ToolClientForName<ToolName>,
): Promise<ToolResultForName<ToolName>> {
  const { params } = CallToolRequestSchema.parse(request);
  const { name, arguments: rawArgs } = params;
  if (!isToolName(name)) {
    throw new TypeError('Unknown tool: ' + String(name));
  }
  return callTool(name, client, rawArgs);
}