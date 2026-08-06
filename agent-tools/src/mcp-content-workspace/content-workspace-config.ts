/**
 * Paths and presentation constants for the model-behaviour content workspace.
 *
 * @packageDocumentation
 */

/** Tracked home of the generated workspace — the surface reviewers open. */
export const WORKSPACE_ROOT = 'docs/governance/model-behaviour-content';

/** The reviewer's entry point. */
export const WORKSPACE_INDEX = `${WORKSPACE_ROOT}/README.md`;

/** Per-review-domain view pages live here (§12.2 "views, not partitions"). */
const WORKSPACE_DOMAIN_DIR = `${WORKSPACE_ROOT}/domains`;

/** The live-versus-dormant served-surface view. */
export const WORKSPACE_SERVED_SURFACE = `${WORKSPACE_ROOT}/served-surface.md`;

/** Items whose rendering this pass could not complete, named rather than dropped. */
export const WORKSPACE_UNRENDERED = `${WORKSPACE_ROOT}/unrendered.md`;

/** Repo-relative path of the audit report the workspace renders. */
export const AUDIT_REPORT_PATH = '.agent/reports/mcp-agent-facing-content-audit/report.md';

/**
 * Longest excerpt rendered inline, in characters.
 *
 * @remarks
 * A handful of items are whole documents. Past this, the excerpt is cut at a
 * line boundary and the item says so and points at its source file — a
 * reviewer is never shown a silent truncation.
 */
export const EXCERPT_CHARACTER_LIMIT = 1500;

/** Plain-English gloss for each review domain, shown at the head of its view. */
export const REVIEW_DOMAIN_GLOSS: Readonly<Record<string, string>> = {
  pedagogy:
    'Prompts, orientation, and curriculum-model doctrine — how the content teaches an agent to teach. Reviewed by Oak education experts.',
  'curriculum-accuracy':
    'The authored conceptual model — ontology, domain concepts, subject and key-stage vocabulary. Reviewed by Oak curriculum experts.',
  'pedagogy-external':
    'External EEF Teaching and Learning Toolkit material carrying Oak editorial framing. The corpus is cited, not rewritten; the framing around it is ours to review.',
  'legal-licensing':
    'Attribution, Open Government Licence v3.0 notices, trademark, and EEF citation obligations.',
  'ux-accessibility':
    'Human-facing surfaces — the landing page, the widget, and authorisation and consent copy. WCAG 2.2 AA applies.',
  'tool-usability':
    'How an agent discovers and uses the tools — titles, descriptions, parameter descriptions, and the orientation directives that steer a first call.',
  'recovery-copy':
    'What an agent receives when something fails or returns nothing — validation, empty-state, and degradation messages. This copy shapes whether an agent recovers or fabricates.',
  'engineering-structural':
    'Annotations, schemas, authorisation scopes, and discovery or branding metadata.',
  'resource-metadata-and-routing':
    'How each guidance document announces itself — its name, address, audience, and freshness — which decides when an agent reaches for it.',
  'owner-signed-copy':
    'Copy carrying an explicit owner sign-off, held apart so a change to it is never routine.',
  other: 'Items whose review domain is mixed or uncategorised.',
};

/**
 * Item count past which a domain view is split into per-surface-type pages.
 *
 * @remarks
 * Splitting is about the reviewer, not the byte count: past a few hundred
 * items a single page stops being reviewable in one sitting, and "every
 * parameter description" is a coherent task in a way that "the first half of
 * tool usability" is not. Surface type is the split key because it is the
 * grouping a reviewer would have made themselves.
 */
export const DOMAIN_SPLIT_THRESHOLD = 100;

/** Repo-relative page path for one surface-type slice of a split domain. */
export function surfacePagePath(domain: string, surfaceType: string): string {
  return `${WORKSPACE_DOMAIN_DIR}/${domainSlug(domain)}--${domainSlug(surfaceType)}.md`;
}

/** Stable ordering for the domain views: reviewer-facing domains first. */
export const REVIEW_DOMAIN_ORDER: readonly string[] = [
  'pedagogy',
  'curriculum-accuracy',
  'pedagogy-external',
  'legal-licensing',
  'ux-accessibility',
  'tool-usability',
  'recovery-copy',
  'engineering-structural',
  'other',
];

/** Filename-safe slug for a review domain. */
export function domainSlug(domain: string): string {
  return domain.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
}

/** Repo-relative page path for a review domain's view. */
export function domainPagePath(domain: string): string {
  return `${WORKSPACE_DOMAIN_DIR}/${domainSlug(domain)}.md`;
}
