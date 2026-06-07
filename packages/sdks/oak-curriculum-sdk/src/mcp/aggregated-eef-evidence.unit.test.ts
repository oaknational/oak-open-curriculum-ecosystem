import { describe, it, expect } from 'vitest';
import {
  EEF_STRAND_IDS,
  OBSERVED_PHASES,
  inspectStrand,
  evidenceForMove,
} from '@oaknational/graph-corpus-sdk/eef-strands';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import {
  GET_EEF_EVIDENCE_INPUT_SCHEMA,
  GET_EEF_EVIDENCE_TOOL_DEF,
  runEefEvidenceTool,
} from './aggregated-eef-evidence.js';

// The corpus is fixed `as const`, so these are non-empty by construction; the
// guard narrows them for the type checker and fails loudly if the corpus is
// ever emptied.
const firstStrandId = EEF_STRAND_IDS[0];
const firstPhase = OBSERVED_PHASES[0];
if (firstStrandId === undefined || firstPhase === undefined) {
  throw new Error('EEF corpus finite domains are unexpectedly empty');
}

describe('get-eef-evidence input schema (closed, finite domain)', () => {
  it('exposes exactly the dispatch field and the bounded-query selectors', () => {
    expect(typeSafeKeys(GET_EEF_EVIDENCE_INPUT_SCHEMA)).toEqual([
      'function',
      'strandId',
      'strandIds',
      'phase',
      'keyStage',
      'priority',
    ]);
  });
});

describe('runEefEvidenceTool (thin parse-and-dispatch over the D5 bindings)', () => {
  it('inspect-strand returns the binding envelope verbatim as structuredContent', () => {
    const result = runEefEvidenceTool({ function: 'inspect-strand', strandId: firstStrandId });
    if (result.isError) {
      throw new Error('expected a successful result');
    }
    expect(result.content).toEqual([]);
    expect(result.structuredContent).toEqual(inspectStrand(firstStrandId));
  });

  it('evidence-for-move with an observed phase returns the matching envelope verbatim', () => {
    const expected = evidenceForMove({ phase: firstPhase });
    expect(expected.members.length).toBeGreaterThan(0);

    const result = runEefEvidenceTool({ function: 'evidence-for-move', phase: firstPhase });
    if (result.isError) {
      throw new Error('expected a successful result');
    }
    expect(result.content).toEqual([]);
    expect(result.structuredContent).toEqual(expected);
  });

  it('evidence-for-move with no selector is isError (an unscoped query is invalid)', () => {
    const result = runEefEvidenceTool({ function: 'evidence-for-move' });
    if (!result.isError) {
      throw new Error('expected an error result');
    }
    expect(result.content[0]?.text).toContain('at least one selector');
  });

  it('inspect-strand without a strandId is isError', () => {
    const result = runEefEvidenceTool({ function: 'inspect-strand' });
    if (!result.isError) {
      throw new Error('expected an error result');
    }
    expect(result.content[0]?.text).toContain("requires 'strandId'");
  });

  it('an unknown strand id is rejected by the schema parse (isError)', () => {
    const result = runEefEvidenceTool({
      function: 'inspect-strand',
      strandId: 'eef-tl-not-a-real-strand',
    });
    expect(result.isError).toBe(true);
  });
});

describe('get-eef-evidence tool definition', () => {
  it('carries the ratified title', () => {
    expect(GET_EEF_EVIDENCE_TOOL_DEF.title).toBe('EEF Evidence (Teaching and Learning Toolkit)');
  });
});
