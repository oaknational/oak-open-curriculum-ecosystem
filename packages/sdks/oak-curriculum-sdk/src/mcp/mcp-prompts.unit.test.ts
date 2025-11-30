/**
 * Unit tests for MCP prompts.
 *
 * MCP prompts provide user-initiated workflow templates that guide
 * interactions with the Oak Curriculum MCP server.
 */

import { describe, it, expect } from 'vitest';
import { MCP_PROMPTS, getPromptMessages } from './mcp-prompts.js';

describe('MCP_PROMPTS', () => {
  it('has find-lessons prompt', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'find-lessons');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('lesson');
  });

  it('has lesson-planning prompt', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'lesson-planning');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('plan');
  });

  it('has progression-map prompt', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'progression-map');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('progression');
  });

  it('all prompts have required fields', () => {
    for (const prompt of MCP_PROMPTS) {
      expect(prompt.name).toBeDefined();
      expect(prompt.description).toBeDefined();
    }
  });

  it('find-lessons has topic argument', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'find-lessons');
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'topic', required: true }),
    );
  });

  it('lesson-planning has topic and yearGroup arguments', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'lesson-planning');
    const argNames = prompt?.arguments?.map((a) => a.name) ?? [];
    expect(argNames).toContain('topic');
    expect(argNames).toContain('yearGroup');
  });
});

describe('getPromptMessages', () => {
  describe('find-lessons prompt', () => {
    it('returns messages with topic in content', () => {
      const messages = getPromptMessages('find-lessons', { topic: 'photosynthesis' });
      expect(messages).toBeDefined();
      expect(messages.length).toBeGreaterThan(0);

      const hasTopicReference = messages.some((m) => m.content.text.includes('photosynthesis'));
      expect(hasTopicReference).toBe(true);
    });

    it('includes keyStage when provided', () => {
      const messages = getPromptMessages('find-lessons', {
        topic: 'fractions',
        keyStage: 'ks2',
      });

      const hasKeyStage = messages.some((m) => m.content.text.includes('ks2'));
      expect(hasKeyStage).toBe(true);
    });
  });

  describe('lesson-planning prompt', () => {
    it('returns messages with topic and yearGroup', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      expect(messages).toBeDefined();

      const content = messages.map((m) => m.content.text).join(' ');

      expect(content).toContain('fractions');
      expect(content).toContain('Year 4');
    });
  });

  describe('progression-map prompt', () => {
    it('returns messages with concept and subject', () => {
      const messages = getPromptMessages('progression-map', {
        concept: 'number',
        subject: 'maths',
      });
      expect(messages).toBeDefined();

      const content = messages.map((m) => m.content.text).join(' ');

      expect(content).toContain('number');
      expect(content).toContain('maths');
    });
  });

  it('returns empty array for unknown prompt', () => {
    const messages = getPromptMessages('unknown-prompt', {});
    expect(messages).toEqual([]);
  });
});
