import { describe, it, expect, vi } from 'vitest';
import {
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
} from './universal-tools.js';
import { OPENAI_CONNECTOR_TOOL_DEFS } from '../types/generated/openai-connector/index.js';
import { MCP_TOOLS } from '../types/generated/api-schema/mcp-tools/index.js';

const SAMPLE_MCP_TOOL_NAME = 'get-key-stages-subject-lessons';

if (!(SAMPLE_MCP_TOOL_NAME in MCP_TOOLS)) {
  throw new Error('Expected get-key-stages-subject-lessons tool to be generated');
}

describe('listUniversalTools', () => {
  it('includes generated openai tools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name);
    expect(names).toContain('search');
    expect(names).toContain('fetch');
  });

  it('includes generated curriculum tools', () => {
    const tools = listUniversalTools();
    const names = tools.map((tool) => tool.name);
    expect(names).toContain(SAMPLE_MCP_TOOL_NAME);
  });

  it('preserves schema metadata from generated definitions', () => {
    const tools = listUniversalTools();
    const searchTool = tools.find((tool) => tool.name === 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.inputSchema).toEqual(OPENAI_CONNECTOR_TOOL_DEFS.search.inputSchema);
  });
});

describe('isUniversalToolName', () => {
  it('matches search and fetch', () => {
    expect(isUniversalToolName('search')).toBe(true);
    expect(isUniversalToolName('fetch')).toBe(true);
  });

  it('matches curriculum tool names', () => {
    expect(isUniversalToolName(SAMPLE_MCP_TOOL_NAME)).toBe(true);
  });

  it('rejects unknown names', () => {
    expect(isUniversalToolName('unknown-tool')).toBe(false);
  });
});

describe('createUniversalToolExecutor', () => {
  it('delegates to openai executor for search', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn().mockResolvedValue({ result: 'ok' });
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool('search', { query: 'photosynthesis' });

    expect(executeOpenAiTool).toHaveBeenCalledWith('search', { query: 'photosynthesis' });
    expect(result.isError).toBeUndefined();
    expect(result.content[0]).toEqual({ type: 'text', text: JSON.stringify({ result: 'ok' }) });
  });

  it('delegates to mcp executor for curriculum tools', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'science',
    });

    expect(executeMcpTool).toHaveBeenCalledTimes(1);
    const callArgs = executeMcpTool.mock.calls[0];
    expect(callArgs[0]).toBe(SAMPLE_MCP_TOOL_NAME);
    expect(callArgs[1]).toEqual({
      keyStage: 'ks3',
      subject: 'science',
    });
    expect(result.isError).toBeUndefined();
    expect(result.content[0]).toEqual({ type: 'text', text: JSON.stringify({ status: 'ok' }) });
  });

  it('standardises subject and key stage synonyms before validation', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'Key Stage 3',
      subject: 'math',
    });

    expect(executeMcpTool).toHaveBeenCalledTimes(1);
    const callArgs = executeMcpTool.mock.calls[0];
    expect(callArgs[1]).toEqual({
      keyStage: 'ks3',
      subject: 'maths',
    });
  });

  it.each([
    ['Fine Art', 'art'],
    ['Civics', 'citizenship'],
    ['Food and Nutrition', 'cooking-nutrition'],
    ['Design and Technology', 'design-technology'],
    ['French Language', 'french'],
    ['Geo', 'geography'],
    ['German Language', 'german'],
    ['Historical Studies', 'history'],
    ['Music Education', 'music'],
    ['PE', 'physical-education'],
    ['Religious Studies', 'religious-education'],
    ['PSHE', 'rshe-pshe'],
    ['Spanish Language', 'spanish'],
  ])('normalises subject synonym %s to %s', async (input, expected) => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'ks3',
      subject: input,
    });

    expect(executeMcpTool).toHaveBeenCalledWith(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'ks3',
      subject: expected,
    });
  });

  it.each([
    ['KS 1', 'ks1'],
    ['Key Stage Two', 'ks2'],
    ['ks 3', 'ks3'],
    ['Key Stage Four', 'ks4'],
    ['KS-2', 'ks2'],
  ])('normalises key stage synonym %s to %s', async (input, expected) => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { status: 'ok' } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: input,
      subject: 'science',
    });

    expect(executeMcpTool).toHaveBeenCalledWith(SAMPLE_MCP_TOOL_NAME, {
      keyStage: expected,
      subject: 'science',
    });
  });

  it('returns an error result when validation fails', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, { subject: 'science' });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.type).toBe('text');
    expect(result.content[0]?.text).toContain('Required');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('rejects plain string arguments for get-search-lessons', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool('get-search-lessons', 'trees');

    expect(result.isError).toBe(true);
    const message = result.content[0]?.type === 'text' ? result.content[0].text : '';
    expect(message).toContain('Expected object, received string');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('accepts structured arguments for get-search-lessons', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ data: { data: [] } });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool('get-search-lessons', { q: 'trees' });

    expect(result.isError).toBeUndefined();
    expect(executeMcpTool).toHaveBeenCalledWith('get-search-lessons', { q: 'trees' });
  });

  it('returns an error when subject cannot be standardised', async () => {
    const executeMcpTool = vi.fn();
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'matematico',
    });

    expect(result.isError).toBe(true);
    const text = result.content[0] && 'text' in result.content[0] ? result.content[0].text : '';
    expect(text).toContain('Unknown subject');
    expect(text).toContain('Allowed subjects');
    expect(executeMcpTool).not.toHaveBeenCalled();
  });

  it('returns an error result when executors throw', async () => {
    const executeMcpTool = vi.fn().mockResolvedValue({ error: new Error('failure') });
    const executeOpenAiTool = vi.fn();
    const callUniversalTool = createUniversalToolExecutor({ executeMcpTool, executeOpenAiTool });

    const result = await callUniversalTool(SAMPLE_MCP_TOOL_NAME, {
      keyStage: 'ks3',
      subject: 'science',
    });

    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('failure');
  });
});
