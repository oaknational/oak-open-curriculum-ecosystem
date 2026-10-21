import { z } from 'zod';

import { redactCredentials } from './bounded-excerpt.js';
import { type DriveOutcome, type DriveWitness } from './drive.js';

/**
 * Renders the reviewer walkthrough from one drive run (MCP-303): the pack
 * is a traceable projection of the run, so every claim in it — which tools
 * exist, what arguments exercise them, which could not be exercised and
 * why — comes from the recorded witnesses, never from prose.
 *
 * The outward-facing sentences (connection, credentials, the
 * same-curriculum-for-every-account note) are OWNER-GATED copy supplied by
 * the caller: this renderer structures, it does not author.
 */

export interface ReviewerPackPreamble {
  readonly connectionNote: string;
  readonly credentialsNote: string;
  readonly sameDataNote: string;
}

/** Boundary schema for a caller-supplied preamble file. */
const ownerCopySentence = z
  .string()
  .min(1)
  .refine((value) => value.trim().length > 0, {
    message: 'owner copy must not be blank',
  });

export const reviewerPackPreambleSchema = z
  .object({
    connectionNote: ownerCopySentence,
    credentialsNote: ownerCopySentence,
    sameDataNote: ownerCopySentence,
  })
  .strict();

/**
 * Visible placeholders for a draft pack run before the owner-approved copy
 * exists. Deliberately unmistakable in output — a draft pack must never
 * read as finished copy.
 */
export const PLACEHOLDER_PREAMBLE: ReviewerPackPreamble = {
  connectionNote: '[CONNECTION NOTE — owner-approved copy pending]',
  credentialsNote: '[CREDENTIALS NOTE — owner-approved copy pending]',
  sameDataNote: '[SAME-CURRICULUM-FOR-EVERY-ACCOUNT NOTE — owner-approved copy pending]',
};

/** Run provenance: when, with what instrument, and where the evidence lives. */
export interface ReviewerPackProvenance {
  readonly generatedAt: string;
  readonly vendorCliVersion: string;
  readonly reportDir: string;
}

export interface RenderReviewerPackInput {
  readonly target: string;
  readonly preamble: ReviewerPackPreamble;
  readonly outcome: DriveOutcome;
  readonly provenance: ReviewerPackProvenance;
}

/**
 * Vendor-controlled text rendered as an INDENTED code block: every line is
 * prefixed, and unlike any fixed-length fence (which a content line of the
 * same backtick run would close), indentation has no closing delimiter for
 * hostile content to fake — nothing a server sends can escape into the
 * outward-facing pack's Markdown.
 */
function indentedBlock(text: string): readonly string[] {
  return text.split('\n').map((line) => `    ${line}`);
}

/**
 * One pack section per witness. Tool names are boundary-validated by the
 * drive's list schema (safe as headings); failure detail embeds
 * vendor-controlled text (stdout/stderr excerpts), so it renders as an
 * indented block via {@link indentedBlock}.
 */
function witnessSection(witness: DriveWitness): readonly string[] {
  const invocation =
    witness.args === undefined
      ? []
      : ['Invocation arguments:', '', '```json', JSON.stringify(witness.args, null, 2), '```', ''];
  const result =
    witness.outcome === 'called-ok'
      ? ['Exercised successfully against the live server.', '']
      : ['NOT exercised:', '', ...indentedBlock(witness.detail), ''];
  return [`### ${witness.toolName}`, '', ...invocation, ...result];
}

export function renderReviewerPack(input: RenderReviewerPackInput): string {
  const header = [
    '# Oak Curriculum MCP — reviewer walkthrough',
    '',
    // The pack is a shareable markdown document; the target is redacted on
    // the way in, as at every other emit site.
    `Server: \`${redactCredentials(input.target)}\``,
    '',
    `Generated ${input.provenance.generatedAt} by \`agent-tools mcp-conformance --drive\` (\`@mcpjam/cli\` ${input.provenance.vendorCliVersion}); full run evidence under \`${input.provenance.reportDir}\`.`,
    '',
    input.preamble.connectionNote,
    '',
    input.preamble.credentialsNote,
    '',
    input.preamble.sameDataNote,
    '',
  ];
  if (input.outcome.listFailure !== undefined) {
    return [
      ...header,
      '## Walkthrough unavailable',
      '',
      'The tool list could not be obtained from the server:',
      '',
      ...indentedBlock(input.outcome.listFailure),
      '',
    ].join('\n');
  }
  const exercised = input.outcome.witnesses.filter((w) => w.outcome === 'called-ok');
  const sections = input.outcome.witnesses.flatMap(witnessSection);
  return [
    ...header,
    `## Tools (${exercised.length} of ${input.outcome.witnesses.length} tools exercised)`,
    '',
    ...sections,
  ].join('\n');
}
