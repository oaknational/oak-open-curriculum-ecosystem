/**
 * One strand of the EEF Teaching and Learning Toolkit corpus rendered as a
 * markdown reference file: provenance, the headline metrics, definition, key
 * findings, then every further section the corpus carries for that strand
 * except `school_context_relevance` (the evidence tools' selector block, whose
 * impact figures on some strands are a named follow-up) and the URL slug
 * (the EEF page carries it), and its tags. The rendered key set is pinned at
 * compile time in `./eef-markdown-rendered-keys.ts`. A pure projection of the
 * fixed `as const` corpus, in the repository formatter's normal form; the file
 * layout and the relative links come from `./eef-markdown-paths.ts`.
 */
import { bullets, document, heading } from './eef-markdown-blocks.js';
import {
  behindTheAverageSection,
  disadvantageGapSection,
  effectivenessSection,
  guidanceReportsSection,
  headlineSection,
  implementationSection,
  provenanceSection,
  relatedStrandsSection,
  updateHistorySection,
} from './eef-strand-markdown-sections.js';
import { strandById, type EefStrand, type EefStrandId } from './strand-lookup.js';

/** The sections a strand may or may not carry, in rendering order; each returns nothing when absent. */
const OPTIONAL_SECTIONS: readonly ((strand: EefStrand) => readonly string[])[] = [
  effectivenessSection,
  behindTheAverageSection,
  disadvantageGapSection,
  implementationSection,
  guidanceReportsSection,
  relatedStrandsSection,
  updateHistorySection,
];

/**
 * Render one strand's markdown reference file.
 *
 * @param id - A corpus strand id.
 * @returns The complete markdown text for that strand, ending in one newline.
 */
export function renderStrandMarkdown(id: EefStrandId): string {
  const strand = strandById(id);
  return document([
    heading(1, strand.name),
    provenanceSection(strand),
    ...headlineSection(strand),
    heading(2, 'Definition'),
    strand.definition.short,
    strand.definition.full,
    heading(2, 'Key findings'),
    bullets(strand.key_findings),
    ...OPTIONAL_SECTIONS.flatMap((section) => section(strand)),
    heading(2, 'Tags'),
    strand.tags.join(', '),
  ]);
}
