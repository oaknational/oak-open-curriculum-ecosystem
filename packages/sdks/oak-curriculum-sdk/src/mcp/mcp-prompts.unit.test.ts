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

  it('has exactly 7 prompts', () => {
    expect(MCP_PROMPTS).toHaveLength(7);
  });

  it('has continue-progression prompt with subject, yearGroup, justCovered required and classNotes optional', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'continue-progression');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('next');
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'subject', required: true }),
    );
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'yearGroup', required: true }),
    );
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'justCovered', required: true }),
    );
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'classNotes', required: false }),
    );
  });

  it('has curriculum-mapping prompt with subject and keyStage arguments', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'curriculum-mapping');
    expect(prompt).toBeDefined();
    expect(prompt?.description).toContain('map');
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'subject', required: true }),
    );
    expect(prompt?.arguments).toContainEqual(
      expect.objectContaining({ name: 'keyStage', required: true }),
    );
  });

  it('has adapt-lesson prompt with topic and yearGroup arguments', () => {
    const prompt = MCP_PROMPTS.find((p) => p.name === 'adapt-lesson');
    expect(prompt).toBeDefined();
    const argNames = prompt?.arguments?.map((a) => a.name) ?? [];
    expect(argNames).toContain('topic');
    expect(argNames).toContain('yearGroup');
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

    it('includes prerequisite orientation guidance', () => {
      const messages = getPromptMessages('find-lessons', { topic: 'fractions' });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toMatch(/get-curriculum-model/);
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

    it('includes prerequisite orientation guidance', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toMatch(/get-curriculum-model/);
    });

    it('guides narrowing the lessons search by the search "year" filter', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      // The served prompt directs the agent to the search tool's year-group
      // filter (the "year" parameter), which matches yearGroup granularity —
      // not a coarser key-stage substitution.
      expect(content).toContain('Year 4');
      // Anchor to the exact instructional example so a regression to a coarser
      // key-stage substitution (dropping the year filter) fails the test.
      expect(content).toContain('year: 4 for "Year 4"');
    });

    it('guides building the full lesson core, not just gathering materials', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages
        .map((m) => m.content.text)
        .join(' ')
        .toLowerCase();
      // The lesson anatomy from the oak-lesson-builder skill: outcome,
      // knowledge, vocabulary, misconceptions, and both quizzes.
      expect(content).toContain('pupil outcome');
      expect(content).toContain('key learning points');
      expect(content).toContain('keyword');
      expect(content).toContain('misconception');
      expect(content).toContain('starter quiz');
      expect(content).toContain('exit quiz');
    });

    it('grounds prior knowledge and misconceptions in Oak graph tools', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('get-prior-knowledge-graph');
      expect(content).toContain('get-misconception-graph');
    });

    it('names the tool for every lesson-data pull it instructs', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      // Each data pull names its MCP tool so the agent never guesses
      // between fetch and a dedicated tool for the same data.
      expect(content).toContain('get-lessons-summary');
      expect(content).toContain('get-lessons-transcript');
      expect(content).toContain('get-keywords');
      expect(content).toContain('get-lessons-quiz');
      expect(content).toContain('get-lessons-assets');
      expect(content).toContain('download-asset');
    });

    it('carries Oak attribution under the Open Government Licence', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('Oak National Academy');
      expect(content).toContain('Open Government Licence');
    });

    it('keeps the teacher in charge — a starting point to adapt, not a script', () => {
      const messages = getPromptMessages('lesson-planning', {
        topic: 'fractions',
        yearGroup: 'Year 4',
      });
      const content = messages
        .map((m) => m.content.text)
        .join(' ')
        .toLowerCase();
      expect(content).toContain('adapt');
      expect(content).toContain('not a script');
    });
  });

  describe('progression-map prompt (removed)', () => {
    it('returns empty array because it was subsumed by learning-progression', () => {
      const messages = getPromptMessages('progression-map', {
        concept: 'number',
        subject: 'maths',
      });
      expect(messages).toEqual([]);
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

    it('references get-thread-progressions and get-prior-knowledge-graph', () => {
      const messages = getPromptMessages('learning-progression', {
        concept: 'algebra',
        subject: 'maths',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('get-thread-progressions');
      expect(content).toContain('get-prior-knowledge-graph');
    });
  });

  describe('curriculum-mapping prompt', () => {
    it('returns messages with subject and keyStage in content', () => {
      const messages = getPromptMessages('curriculum-mapping', {
        subject: 'maths',
        keyStage: 'ks2',
      });
      expect(messages.length).toBeGreaterThan(0);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('maths');
      expect(content).toContain('ks2');
      expect(content).toMatch(/get-curriculum-model/);
    });

    it('grounds the map in threads, prerequisites, and coverage tools', () => {
      const messages = getPromptMessages('curriculum-mapping', {
        subject: 'maths',
        keyStage: 'ks2',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      // The mapping backbone from the oak-curriculum-mapper skill:
      // threads (vertical), prerequisites (horizontal), NC coverage.
      expect(content).toContain('get-threads');
      expect(content).toContain('get-thread-progressions');
      expect(content).toContain('get-prior-knowledge-graph');
      expect(content).toContain('get-units-summary');
      expect(content.toLowerCase()).toContain('prerequisite');
      expect(content.toLowerCase()).toContain('national curriculum');
    });

    it('includes the year group when provided', () => {
      const messages = getPromptMessages('curriculum-mapping', {
        subject: 'maths',
        keyStage: 'ks2',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('Year 4');
    });

    // The KS4 caution is a standing clause of the served prompt (present for
    // every key stage), not a conditional branch on the keyStage argument.
    it('always carries the KS4 structure caution routing science via sequences', () => {
      const messages = getPromptMessages('curriculum-mapping', {
        subject: 'science',
        keyStage: 'ks4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('KS4');
      expect(content).toContain('sequences');
    });

    it('carries Oak attribution and keeps the map adaptable, not a mandate', () => {
      const messages = getPromptMessages('curriculum-mapping', {
        subject: 'maths',
        keyStage: 'ks2',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('Oak National Academy');
      expect(content).toContain('Open Government Licence');
      expect(content.toLowerCase()).toContain('adapt');
    });
  });

  describe('adapt-lesson prompt', () => {
    it('returns messages naming the topic, year group, and the Oak→EEF workflow', () => {
      const messages = getPromptMessages('adapt-lesson', {
        topic: 'adding fractions',
        yearGroup: 'Year 4',
      });
      expect(messages.length).toBeGreaterThan(0);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('adding fractions');
      expect(content).toContain('Year 4');
      expect(content).toContain('get-eef-evidence');
      expect(content).toContain('eef://interpretation');
    });

    it('instructs converting free-form input to finite EEF tool inputs at the boundary', () => {
      const messages = getPromptMessages('adapt-lesson', {
        topic: 'photosynthesis',
        yearGroup: 'Year 9',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('finite');
      // Surfaces the pedagogical signal via Oak's own graphs.
      expect(content).toContain('misconception');
      expect(content).toContain('prior-knowledge');
    });

    it('instructs preserving caveats/attribution and presenting options, not selections', () => {
      const messages = getPromptMessages('adapt-lesson', {
        topic: 'photosynthesis',
        yearGroup: 'Year 9',
      });
      const content = messages
        .map((m) => m.content.text)
        .join(' ')
        .toLowerCase();
      expect(content).toContain('caveat');
      expect(content).toContain('attribut');
      expect(content).toContain('options');
    });

    it('guides narrowing the lessons search by the search "year" filter', () => {
      const messages = getPromptMessages('adapt-lesson', {
        topic: 'adding fractions',
        yearGroup: 'Year 4',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      // The served prompt directs the agent to the search tool's year-group
      // filter (the "year" parameter), which matches yearGroup granularity —
      // not a coarser key-stage substitution.
      expect(content).toContain('Year 4');
      // Anchor to the exact instructional example so a regression to a coarser
      // key-stage substitution (dropping the year filter) fails the test.
      expect(content).toContain('year: 4 for "Year 4"');
    });
  });

  describe('continue-progression prompt', () => {
    const fullArgs = {
      subject: 'maths',
      yearGroup: 'Year 4',
      justCovered: 'equivalent fractions',
    } as const;

    it('returns messages with subject, yearGroup, and justCovered in content', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      expect(messages.length).toBeGreaterThan(0);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('maths');
      expect(content).toContain('Year 4');
      expect(content).toContain('equivalent fractions');
      expect(content).toMatch(/get-curriculum-model/);
    });

    it('includes class notes when provided', () => {
      const messages = getPromptMessages('continue-progression', {
        ...fullArgs,
        classNotes: 'they struggled with comparing fractions',
      });
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('they struggled with comparing fractions');
    });

    it('orchestrates position resolution, sequence, readiness, and misconceptions in Oak tools', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // The position→next backbone: resolve position via search, derive the
      // next step from the thread progression, check readiness against the
      // next unit's prior knowledge, anticipate its misconceptions.
      expect(content).toContain('search');
      expect(content).toContain('get-thread-progressions');
      expect(content).toContain('get-prior-knowledge-graph');
      expect(content).toContain('get-misconception-graph');
    });

    it('guides narrowing the lessons search by the search "year" filter', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // Anchor to the exact instructional example so a regression to a coarser
      // key-stage substitution (dropping the year filter) fails the test.
      expect(content).toContain('year: 4 for "Year 4"');
      // The lessons fallback must keep the subject filter — dropping it raises
      // the wrong-unit resolution risk when justCovered is ambiguous across
      // subjects (the search tool supports subject and it is always available).
      expect(content).toContain('keeping the subject filter');
    });

    it('instructs candidate presentation and teacher confirmation on ambiguous position matches', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // Free-text justCovered may match several units; the prompt instructs
      // presenting candidates for the teacher to confirm, never silent selection.
      expect(content.toLowerCase()).toContain('confirm');
      expect(content.toLowerCase()).toContain('candidate');
    });

    // The KS4 caution is a standing clause of the served prompt (present for
    // every key stage). The verbatim form is the contract: the
    // position-anchored-teaching-continuity plan (w1-c1) mandates the caveat
    // "carried verbatim from curriculum-mapping", so the two prompts' caveat
    // sentences move together or not at all.
    it('always carries the KS4 structure caution routing science via sequences', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain(
        'KS4 is more complex (tiers and exam boards); science at KS4 must be traversed via sequences (get-sequences), not the flat lessons route.',
      );
    });

    it('instructs exactly one explicit anchor mode for the misconception-graph step', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // The tool's parse-time contract errors on ambiguous anchors; the served
      // step must show ONE anchor mode with a slug-from-step placeholder, so
      // the agent never improvises a multi-anchor call.
      expect(content).toMatch(
        /get-misconception-graph\(\{ unitSlugs: \["<next-unit-slug-from-step-\d>"\] \}\)/,
      );
      // No second anchor mode is offered anywhere in the misconception step.
      expect(content).not.toMatch(/get-misconception-graph\(\{[^}]*lessonSlugs/);
      expect(content).not.toMatch(/get-misconception-graph\(\{[^}]*threadSlug/);
    });

    it('presents the readiness list as checkable against what the class has covered', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // The next unit's assumed prior knowledge is what the class should now
      // have secured — served as a checkable readiness list.
      expect(content.toLowerCase()).toContain('readiness');
      expect(content.toLowerCase()).toContain('prior knowledge');
    });

    it('chains into lesson-planning rather than restating the planning workflow', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('lesson-planning');
    });

    it('chains with the next unit’s teaching year and surfaces any divergence from the stated year group', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      // The next unit comes from the year-ordered progression and can sit on a
      // different teaching year than the class label (the P3 live proof: a
      // Year 4 class's next unit was Y5). Chaining with the stated yearGroup
      // would steer lesson-planning's year-scoped search at the wrong year;
      // the prompt instructs using the next unit's teaching year and flagging
      // the difference — the teaching decision stays the teacher's (ADR-194).
      expect(content).toContain("the next unit's teaching year from step 2");
      expect(content.toLowerCase()).toContain('if that year differs from');
    });

    it('carries Oak attribution under the Open Government Licence and keeps the teacher in charge', () => {
      const messages = getPromptMessages('continue-progression', fullArgs);
      const content = messages.map((m) => m.content.text).join(' ');
      expect(content).toContain('Oak National Academy');
      expect(content).toContain('Open Government Licence');
      expect(content).toContain(
        'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      );
      // The credited dataset list matches what the workflow pulls: step 4
      // uses get-misconception-graph, so misconception data is credited too.
      expect(content).toContain('misconception data');
      // ADR-194: the surface informs; the teaching decision stays the teacher's.
      expect(content.toLowerCase()).toContain('decision is mine');
    });
  });

  it('returns empty array for unknown prompt', () => {
    const messages = getPromptMessages('unknown-prompt', {});
    expect(messages).toEqual([]);
  });
});
