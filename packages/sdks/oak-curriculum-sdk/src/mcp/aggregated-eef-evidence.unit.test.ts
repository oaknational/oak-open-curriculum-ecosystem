import { describe, it, expect } from 'vitest';
import {
  EEF_STRAND_IDS,
  OBSERVED_PHASES,
  evidenceForMove,
  evidenceForMoveHeadlines,
} from '@oaknational/graph-corpus-sdk/eef-strands';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import { OAK_CONTEXT_HINT } from './prerequisite-guidance.js';
import {
  GET_EEF_EVIDENCE_INPUT_SCHEMA,
  GET_EEF_EVIDENCE_TOOL_DEF,
  runEefEvidenceTool,
} from './aggregated-eef-evidence.js';
import { summariseEefEnvelope } from './aggregated-eef-evidence-summaries.js';
import { eefEvidenceToCallToolResult } from './eef-evidence-egress.js';

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
      'detail',
    ]);
  });
});

describe('runEefEvidenceTool (thin parse-and-dispatch over the D5 bindings)', () => {
  it('inspect-strand returns the binding envelope verbatim with its summary', () => {
    const result = runEefEvidenceTool({ function: 'inspect-strand', strandId: firstStrandId });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    // The summary is the summariser's output for the envelope the tool
    // returned, at the detail level the dispatch site statically knows.
    expect(result.summary).toBe(summariseEefEnvelope(result.envelope, 'full'));
    expect(result.envelope.members).toHaveLength(1);
  });

  it('evidence-for-move with an observed phase returns the matching envelope verbatim', () => {
    const expected = evidenceForMove({ phase: firstPhase });
    expect(expected.members.length).toBeGreaterThan(0);

    const result = runEefEvidenceTool({ function: 'evidence-for-move', phase: firstPhase });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(result.envelope).toEqual(expected);
    expect(result.summary).toBe(summariseEefEnvelope(expected, 'full'));
  });

  it("evidence-for-move with detail:'headline' returns the bounded headline envelope", () => {
    const result = runEefEvidenceTool({
      function: 'evidence-for-move',
      phase: firstPhase,
      detail: 'headline',
    });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    const expected = evidenceForMoveHeadlines({ phase: firstPhase });
    expect(result.envelope).toEqual(expected);
    expect(result.summary).toBe(summariseEefEnvelope(expected, 'headline'));
  });

  it("evidence-for-move with detail:'full' returns the full strands (same as the default)", () => {
    const result = runEefEvidenceTool({
      function: 'evidence-for-move',
      phase: firstPhase,
      detail: 'full',
    });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(result.envelope).toEqual(evidenceForMove({ phase: firstPhase }));
  });

  it('evidence-for-move defaults to the full strands when detail is omitted', () => {
    const result = runEefEvidenceTool({ function: 'evidence-for-move', phase: firstPhase });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(result.envelope).toEqual(evidenceForMove({ phase: firstPhase }));
  });

  it('evidence-for-move with no selector is isError (an unscoped query is invalid)', () => {
    const result = runEefEvidenceTool({ function: 'evidence-for-move' });
    expect(result.isError).toBe(true);
    if (!result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(result.content[0]?.text).toContain('at least one selector');
  });

  it('evidence-for-move with an empty strandIds array is isError (an empty explicit set is not a scope)', () => {
    const result = runEefEvidenceTool({ function: 'evidence-for-move', strandIds: [] });
    expect(result.isError).toBe(true);
    if (!result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(result.content[0]?.text).toContain('at least one selector');
  });

  it('inspect-strand without a strandId is isError', () => {
    const result = runEefEvidenceTool({ function: 'inspect-strand' });
    expect(result.isError).toBe(true);
    if (!result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
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

describe('summariseEefEnvelope (the family wording contract)', () => {
  it('renders the strand-lookup template with the singular form at cardinality one', () => {
    const result = runEefEvidenceTool({ function: 'inspect-strand', strandId: firstStrandId });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    // inspect-strand envelopes carry exactly one member (the D4
    // cardinality-one invariant), so the singular form is structural.
    expect(result.envelope.members).toHaveLength(1);
    expect(summariseEefEnvelope(result.envelope, 'full')).toMatch(
      /^EEF evidence \(strand-lookup\): 1 full member strand, \d+ related_strand edges?, \d+ frontier strands?\.$/,
    );
  });

  it('pluralises member strands on a multi-member envelope (explicit full-set lookup)', () => {
    // An explicit-id selection is answerType 'strand-lookup' at ANY
    // cardinality (the coverage axis, not the cardinality axis); the full
    // corpus id set guarantees plurality structurally.
    const envelope = evidenceForMove({ strandIds: [...EEF_STRAND_IDS] });
    expect(envelope.members.length).toBeGreaterThan(1);
    expect(summariseEefEnvelope(envelope, 'full')).toMatch(
      /^EEF evidence \(strand-lookup\): \d+ full member strands, /,
    );
  });

  it('interpolates the context-subset answer type for an axis-selected envelope', () => {
    const envelope = evidenceForMove({ phase: firstPhase });
    expect(summariseEefEnvelope(envelope, 'full')).toMatch(/^EEF evidence \(context-subset\): /);
  });
});

describe('eefEvidenceToCallToolResult (egress membrane — ADR-193, house dual shape)', () => {
  it('crosses a success envelope into the dual shape: summary + serialised JSON + decorated structuredContent', () => {
    const domain = runEefEvidenceTool({ function: 'inspect-strand', strandId: firstStrandId });
    expect(domain.isError).toBeUndefined();
    if (domain.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    const vendor = eefEvidenceToCallToolResult(domain);
    const { envelope, summary } = domain;

    expect(vendor.isError).toBeUndefined();
    expect(vendor.content).toHaveLength(2);
    expect(vendor.content[0]).toEqual({ type: 'text', text: summary });

    const serialised = vendor.content[1];
    expect(serialised?.type).toBe('text');
    if (serialised?.type !== 'text') {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(JSON.parse(serialised.text)).toEqual(envelope);

    expect(vendor.structuredContent).toEqual({
      ...envelope,
      summary,
      oakContextHint: OAK_CONTEXT_HINT,
      status: 'success',
    });

    expect(vendor._meta).toMatchObject({
      toolName: 'get-eef-evidence',
      'annotations/title': GET_EEF_EVIDENCE_TOOL_DEF.title,
    });
    expect(typeof vendor._meta?.timestamp).toBe('number');
    expect(new Set(Object.keys(vendor._meta ?? {}))).toEqual(
      new Set(['annotations/title', 'timestamp', 'toolName']),
    );
  });

  it('emits the dual shape for a headline evidence-for-move envelope', () => {
    const domain = runEefEvidenceTool({
      function: 'evidence-for-move',
      phase: firstPhase,
      detail: 'headline',
    });
    expect(domain.isError).toBeUndefined();
    if (domain.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    const vendor = eefEvidenceToCallToolResult(domain);
    const envelope = evidenceForMoveHeadlines({ phase: firstPhase });

    expect(vendor.content).toHaveLength(2);
    expect(vendor.content[0]).toEqual({
      type: 'text',
      text: summariseEefEnvelope(envelope, 'headline'),
    });
    expect(vendor.structuredContent).toEqual({
      ...envelope,
      summary: summariseEefEnvelope(envelope, 'headline'),
      oakContextHint: OAK_CONTEXT_HINT,
      status: 'success',
    });
  });

  it('pins the envelope keys so envelope growth cannot be silently clobbered by the decoration spread', () => {
    // formatToolResponse spreads summary/oakContextHint/status AFTER the
    // envelope. If the envelope ever grows a key with one of those names,
    // the decoration value overwrites the envelope's value in
    // structuredContent — this guard makes corpus-envelope key growth loud
    // before any clobber can occur. The envelope is taken from the tool's
    // own result so the guard covers the value the egress actually receives.
    const result = runEefEvidenceTool({ function: 'inspect-strand', strandId: firstStrandId });
    expect(result.isError).toBeUndefined();
    if (result.isError) {
      throw new Error('unreachable: narrowing only — the expect above already failed');
    }
    expect(new Set(Object.keys(result.envelope))).toEqual(
      new Set(['answerType', 'edges', 'frontier', 'members', 'provenance']),
    );
  });

  it('passes an isError result through unchanged (no structuredContent on the error path)', () => {
    const domain = runEefEvidenceTool({ function: 'evidence-for-move' });
    const vendor = eefEvidenceToCallToolResult(domain);
    expect(vendor.isError).toBe(true);
    expect(vendor.structuredContent).toBeUndefined();
  });
});
