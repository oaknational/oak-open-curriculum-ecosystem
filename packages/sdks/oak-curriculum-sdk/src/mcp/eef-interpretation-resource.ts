/**
 * The `eef://interpretation` MCP resource — a static `text/markdown` reasoning
 * scaffold (D3) that projects the fixed EEF Teaching and Learning Toolkit corpus
 * into three labelled layers:
 *
 * 1. **EEF corpus reference (cited)** — the corpus's own methodology, caveats,
 *    source attribution, and a complete strand index.
 * 2. **Agent reasoning guidance** — tagged explicitly as NON-corpus material: the
 *    end goals, the Oak→EEF workflow, and how to read partial curation honestly.
 * 3. **Graph-structural reference** — the envelope field names and edge type the
 *    agent navigates in a `get-eef-evidence` result.
 *
 * It is read context, never executable: the agent is the only reasoner over the
 * evidence (ADR-191), and this guidance cannot constrain it.
 *
 * The content is a HAND-AUTHORED markdown projection, deliberately NOT produced by
 * the JSON `graph-resource-factory` (that emits `application/json` for a single
 * data graph; this is a layered `text/markdown` guide — a different
 * responsibility). All corpus material is cited verbatim or derived from the
 * corpus at build time; no EEF vocabulary, caveat class, or strand is invented
 * (ADR-191). Source attribution — organisation, url, AND named authors — is
 * carried in full; free access to sources is a trust requirement.
 */

import {
  corpusCaveats,
  corpusMeta,
  corpusMethodology,
  EEF_STRAND_IDS,
  strandById,
} from '@oaknational/graph-corpus-sdk/eef-strands';

import { typeSafeValues } from '../types/helpers/type-helpers.js';

/**
 * Static resource identity. URI style follows the sibling `docs://oak/*` and
 * `curriculum://model` resources; priority 0.5 marks supplementary reference
 * context (the agent need not pre-load it to orient).
 */
export const EEF_INTERPRETATION_RESOURCE: {
  readonly name: string;
  readonly uri: string;
  readonly title: string;
  readonly description: string;
  readonly mimeType: 'text/markdown';
  readonly annotations: {
    readonly priority: number;
    readonly audience: ('user' | 'assistant')[];
  };
} = {
  name: 'eef-interpretation',
  uri: 'eef://interpretation',
  title: 'EEF Toolkit — Interpretation Guide',
  description:
    'How to interpret and faithfully apply EEF Teaching and Learning Toolkit evidence: the corpus methodology, caveats, source attribution, and a complete strand index, plus agent reasoning guidance and the graph field names. Read context for grounding get-eef-evidence; the agent reasons over the evidence.',
  mimeType: 'text/markdown',
  annotations: {
    priority: 0.5,
    audience: ['assistant'],
  },
};

function citeSource(): string {
  const { source, licence, coverage } = corpusMeta;
  return [
    '### Source and attribution',
    '',
    `- **Source**: ${source.name} (${source.organisation})`,
    `- **EEF page**: ${source.url}`,
    `- **Authors**: ${source.original_authors.join('; ')}`,
    `- **Licence**: ${licence.name}`,
    `- ${licence.attribution_note}`,
    `- **Coverage**: ${coverage.age_range}; ${coverage.jurisdiction_focus}; ${coverage.evidence_scope}`,
  ].join('\n');
}

function citeMethodology(): string {
  const { impact_measure, cost_measure, evidence_strength_measure } = corpusMethodology;
  const costRows = typeSafeValues(cost_measure.scale)
    .map(
      (band) =>
        `  - ${band.rating} (${band.label}): ${band.range_per_pupil_per_year_gbp} per pupil/year`,
    )
    .join('\n');
  return [
    '### Methodology (EEF)',
    '',
    `- **${impact_measure.name}** (${impact_measure.unit}): ${impact_measure.derivation} ${impact_measure.interpretation_guidance}`,
    `- **${cost_measure.name}**:`,
    costRows,
    `- **${evidence_strength_measure.name}**: ${evidence_strength_measure.interpretation_guidance}`,
  ].join('\n');
}

function citeCaveats(): string {
  return [
    '### Caveats (apply to every figure)',
    '',
    corpusCaveats.map((caveat) => `- ${caveat}`).join('\n'),
  ].join('\n');
}

function strandIndex(): string {
  const header =
    '| Strand id | Name | Impact-for-cost summary | Tags | EEF page |\n| --- | --- | --- | --- | --- |';
  const rows = EEF_STRAND_IDS.map((id) => {
    const strand = strandById(id);
    const tags = 'tags' in strand && strand.tags ? strand.tags.join(', ') : '';
    return `| ${strand.id} | ${strand.name} | ${strand.headline.headline_summary} | ${tags} | ${strand.eef_url} |`;
  }).join('\n');
  return [
    '### Strand index (complete corpus)',
    '',
    'Every strand, with its impact-for-cost one-liner and EEF page. Choose strands from this index by inspecting their definitions, findings, and relations — not by axis filtering alone.',
    '',
    header,
    rows,
  ].join('\n');
}

function agentGuidance(): string {
  const total = EEF_STRAND_IDS.length;
  const taggedForSchoolContext = EEF_STRAND_IDS.filter(
    (id) => 'school_context_relevance' in strandById(id),
  ).length;
  return [
    '## 2. Agent reasoning guidance — NOT EEF corpus evidence',
    '',
    "This layer is the calling agent's reasoning scaffold. It is NOT part of the EEF corpus and must never be presented to a teacher as EEF evidence.",
    '',
    '### End goals',
    "- Transmit the evidence faithfully: preserve each strand's impact, cost, evidence strength, caveats, and limits.",
    '- Present options and trade-offs, never recommendations or selections — the teacher decides.',
    '- Always attribute EEF and link the teacher to the relevant EEF page for the full detail and most current figures.',
    '',
    '### Oak → EEF workflow',
    '1. Understand the teaching task.',
    "2. Use Oak's search, misconception, and prior-knowledge tools to surface the pedagogical signals in the lesson.",
    '3. Name the pedagogical move the signal raises, then choose real strand ids from the index above.',
    '4. Call `get-eef-evidence` with those finite ids/axes; read the returned envelope.',
    '5. Offer the teacher evidence-calibrated options, with caveats and EEF attribution intact.',
    '',
    '### Worked examples',
    '- Faithful: "EEF rates feedback as high impact (+6 months) for very low cost on extensive evidence, though figures are population averages and depend on implementation quality."',
    '- Unfaithful: "Use feedback — it is the best strategy." (Invents a ranking; drops cost, evidence strength, and caveats.)',
    '',
    '### Reading partial curation honestly',
    `- ${taggedForSchoolContext} of ${total} strands carry school-context tags (\`school_context_relevance\`). The absence of a tag is **not evidence of inapplicability** — the corpus covers ${corpusMeta.coverage.age_range} and curation is partial.`,
    '- The complete strand index above, not axis filtering, is the discovery path over the full corpus.',
  ].join('\n');
}

function graphStructural(): string {
  return [
    '## 3. Graph-structural reference',
    '',
    'A `get-eef-evidence` result is an evidence envelope with these fields:',
    '- `members`: the matched strands (full strand objects).',
    '- `edges`: `related_strand` edges whose endpoints are both members.',
    '- `frontier`: related strand ids outside the member set — suggested next lookups.',
    '- `provenance`: `source` (name, url, organisation, authors), `licence`, and `caveats`, carried once per envelope.',
    '',
    'Input selectors are finite and drawn from the corpus: strand ids, and the observed phase, key stage, and priority axes.',
    '',
    'MCP tool names may appear prefixed by the client (e.g. `mcp__<server>__get-eef-evidence`); match tools by their suffix.',
  ].join('\n');
}

/**
 * Build the complete `eef://interpretation` markdown payload. Pure projection of
 * the fixed corpus — no parameters, deterministic output.
 */
export function getEefInterpretationMarkdown(): string {
  return [
    '# EEF Teaching and Learning Toolkit — Interpretation Guide',
    '',
    "Read context for grounding `get-eef-evidence`. The EEF Toolkit summarises education research as average impact (months of additional progress), implementation cost, and evidence strength. This guide projects the corpus's own methodology, caveats, attribution, and a complete strand index; it then adds agent reasoning guidance (clearly tagged) and the graph field names. The agent is the only reasoner over the evidence (ADR-191); this guidance cannot constrain it.",
    '',
    '## 1. EEF corpus reference (cited)',
    '',
    citeSource(),
    '',
    citeMethodology(),
    '',
    citeCaveats(),
    '',
    strandIndex(),
    '',
    agentGuidance(),
    '',
    graphStructural(),
    '',
  ].join('\n');
}
