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

  it('has explore-curriculum prompt', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'explore-curriculum');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('Explore');
  });

  it('has learning-progression prompt', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'learning-progression');
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

    it('suggests calling get-ontology first', () => {
      const messages = getPromptMessages('find-lessons', { topic: 'fractions' });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('get-ontology');
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

    it('suggests calling context tools first', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toMatch(/get-help|get-ontology/);
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

    it('suggests calling context tools first', () => {
      const messages = getPromptMessages('progression-map', {
        concept: 'number',
        subject: 'maths',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toMatch(/get-help|get-ontology/);
    });
  });

  describe('explore-curriculum prompt', () => {
    it('returns messages with topic in content', () => {
      const messages = getPromptMessages('explore-curriculum', { topic: 'volcanos' });
      expect(messages).toBeDefined();
      expect(messages.length).toBeGreaterThan(0);

      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('volcanos');
    });

    it('includes subject when provided', () => {
      const messages = getPromptMessages('explore-curriculum', {
        topic: 'volcanos',
        subject: 'geography',
      });

      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('geography');
    });

    it('references explore-topic tool', () => {
      const messages = getPromptMessages('explore-curriculum', { topic: 'volcanos' });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('explore-topic');
    });
  });

  describe('learning-progression prompt', () => {
    it('returns messages with concept and subject', () => {
      const messages = getPromptMessages('learning-progression', {
        concept: 'algebra',
        subject: 'maths',
      });
      expect(messages).toBeDefined();

      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('algebra');
      expect(content).toContain('maths');
    });

    it('references search with threads scope', () => {
      const messages = getPromptMessages('learning-progression', {
        concept: 'algebra',
        subject: 'maths',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('search');
      expect(content).toContain('threads');
    });

    it('references get-thread-progressions and get-prerequisite-graph', () => {
      const messages = getPromptMessages('learning-progression', {
        concept: 'algebra',
        subject: 'maths',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('get-thread-progressions');
      expect(content).toContain('get-prerequisite-graph');
    });
  });

  it('returns empty array for unknown prompt', () => {
    const messages = getPromptMessages('unknown-prompt', {});
    expect(messages).toEqual([]);
  });
});
