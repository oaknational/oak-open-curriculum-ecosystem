/**
 * Source attribution constants for MCP resources and tools.
 *
 * Provides machine-readable provenance, licensing, and credit information
 * that accompanies the human-readable namespace prefix convention
 * (ADR-157 §Namespace Convention). Each resource/tool carries both:
 * - A prefix in its name (`oak-kg-*`, `eef-*`, or unprefixed for bulk API)
 * - A `SourceAttribution` in its `_meta` field for programmatic access
 *
 * The `SourceAttribution` type definition lives in `@oaknational/sdk-codegen`
 * as the single source of truth. This module provides the concrete constant
 * values that populate it.
 *
 * @see ADR-157 §Namespace Convention for the prefix rules
 * @see ADR-157 §Licensing for the full licence terms
 * @see LICENCE-DATA.md for downstream attribution requirements
 *
 * @packageDocumentation
 */

import type { SourceAttribution } from '@oaknational/sdk-codegen/mcp-tools';

/**
 * Attribution for data derived from the Oak Open Curriculum API.
 *
 * Applies to all unprefixed MCP resources: `prior-knowledge-graph`,
 * `thread-progressions`, `misconception-graph`, and the bulk-data
 * component of `model`.
 */
export const OAK_API_ATTRIBUTION: SourceAttribution = {
  source: 'Oak Open Curriculum API',
  sourceUrl: 'https://open-api.thenational.academy/',
  licence: 'Open Government Licence v3.0',
  licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  attributionNote:
    'Contains Oak National Academy open curriculum data licensed under the Open Government Licence v3.0.',
};

/**
 * Attribution for data imported from the Oak Curriculum Ontology.
 *
 * Applies to all `oak-kg-*` prefixed MCP resources. The ontology is
 * Oak's formal semantic representation of curriculum structure, aligned
 * to the National Curriculum for England (2014). It is an Oak-developed
 * representation and does not constitute an official DfE publication.
 */
export const OAK_KG_ATTRIBUTION: SourceAttribution = {
  source: 'Oak Curriculum Ontology',
  sourceUrl: 'https://github.com/oaknational/oak-curriculum-ontology',
  licence: 'Open Government Licence v3.0 (data) + MIT (code)',
  licenceUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
  attributionNote:
    'Contains data from the Oak Curriculum Ontology by Oak National Academy, licensed under OGL v3.0 (data) and MIT (code).',
};

/**
 * Attribution for data from the EEF Teaching and Learning Toolkit.
 *
 * Applies to all `eef-*` prefixed MCP resources.
 */
export const EEF_ATTRIBUTION: SourceAttribution = {
  source: 'EEF Teaching and Learning Toolkit',
  sourceUrl:
    'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
  licence: 'Attribution required',
  licenceUrl:
    'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit',
  attributionNote:
    'Contains evidence data from the Education Endowment Foundation Teaching and Learning Toolkit. Citation required.',
};
