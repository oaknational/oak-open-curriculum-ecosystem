import { SERVER_INSTRUCTIONS_ADDITIONS } from './current-source-additions-server-instructions.js';
import {
  contentsAnchor,
  metadataAnchor,
  sharedEnvelopeAnchor,
  structuralAnchor,
  type CurrentSourceAdditionDefinition,
} from './current-source-addition-anchor-helpers.js';

export type {
  CurrentSourceAdditionDefinition,
  ReviewedAdditionAnchor,
} from './current-source-addition-anchor-helpers.js';

const SERVED_SURFACE =
  'apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts';
const UNDER_THE_HOOD_CONTENT =
  'apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts';
const EXCLUDED_PATHS = 'packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts';
const GUIDANCE_ROOT = 'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources';
const GUIDANCE_CATALOGUE = `${GUIDANCE_ROOT}/agent-guidance-resources.ts`;

function guidanceMetadataAddition(input: {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly state: 'live' | 'dormant';
  readonly provenance?: string;
}): CurrentSourceAdditionDefinition {
  const uri = `docs://oak/guidance/${input.slug}.md`;
  return {
    id: input.id,
    title: input.title,
    reviewDomain: 'resource-metadata-and-routing',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Define the guidance resource identity and route, assistant audience and priority, presentation type, and freshness metadata exposed through MCP resource discovery and reads.' +
      (input.provenance === undefined
        ? ''
        : ' Preserve the source provenance notice as reviewed lineage context.'),
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: `${GUIDANCE_ROOT}/${input.slug}.ts`,
    reviewedAnchors: [
      metadataAnchor(`name: 'guidance-${input.slug}'`, 'name', `guidance-${input.slug}`),
      sharedEnvelopeAnchor(`uri: '${uri}'`, 'uri', uri),
      sharedEnvelopeAnchor("mimeType: 'text/markdown'", 'mimeType', 'text/markdown'),
      metadataAnchor(
        "annotations: { priority: 0.4, audience: ['assistant'] }",
        'annotations',
        '{"priority":0.4,"audience":["assistant"]}',
      ),
      contentsAnchor(
        "lastModified: '2026-07-23T00:00:00Z'",
        '_meta.lastModified',
        '2026-07-23T00:00:00Z',
      ),
      ...(input.provenance === undefined ? [] : [structuralAnchor(input.provenance)]),
    ],
    registration: { state: input.state, selector: uri },
  };
}

/**
 * Reviewed semantic additions since the phase-(a) audit registry
 * (717 rows as maintained on main).
 *
 * These are source definitions, not generated output: adding or changing an
 * entry is the explicit compliance-review act that makes a post-baseline item
 * part of the current inventory.
 */
export const CURRENT_SOURCE_ADDITION_DEFINITIONS: readonly CurrentSourceAdditionDefinition[] = [
  {
    id: 'A001',
    title: 'MCP served-surface allowlist',
    reviewDomain: 'engineering-structural',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Classify every MCP tool and resource as live or dormant at the app registration boundary.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: SERVED_SURFACE,
    reviewedAnchors: [
      structuralAnchor("user-search': 'dormant',\n    'user-search-query': 'dormant'"),
      structuralAnchor("'get-eef-evidence': 'dormant'"),
      structuralAnchor("'docs://oak/getting-started.md': 'live'"),
      structuralAnchor("'docs://oak/guidance/curriculum-mapping.md': 'dormant'"),
    ],
  },
  {
    id: 'A002',
    title: 'Deferred upstream API paths',
    reviewDomain: 'engineering-structural',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Temporarily exclude the check-restricted API family from generated schemas and MCP tools until MCP-214 lifts the deferral.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: EXCLUDED_PATHS,
    reviewedAnchors: [
      structuralAnchor(
        "export const DEFERRED_PATHS: readonly DeferredPathEntry[] = [\n  { path: '/key-stages/{keyStage}/subject/{subject}/check-restricted', ticket: 'MCP-214' },\n  { path: '/lessons/check-restricted', ticket: 'MCP-214' },\n];",
      ),
    ],
  },
  guidanceMetadataAddition({
    id: 'A003',
    title: 'Find lessons guidance resource identity and metadata',
    slug: 'find-lessons',
    state: 'live',
  }),
  guidanceMetadataAddition({
    id: 'A004',
    title: 'Explore curriculum guidance resource identity and metadata',
    slug: 'explore-curriculum',
    state: 'live',
  }),
  guidanceMetadataAddition({
    id: 'A005',
    title: 'Learning progression guidance resource identity and metadata',
    slug: 'learning-progression',
    state: 'live',
  }),
  guidanceMetadataAddition({
    id: 'A006',
    title: 'Curriculum mapping guidance resource identity, metadata, and provenance',
    slug: 'curriculum-mapping',
    state: 'dormant',
    provenance:
      "provenance:\n      'Derived from the oak-curriculum-mapper skill (oaknational/oak-skills); keep the two in step.'",
  }),
  guidanceMetadataAddition({
    id: 'A007',
    title: 'Adapt lesson guidance resource identity and metadata',
    slug: 'adapt-lesson',
    state: 'dormant',
  }),
  guidanceMetadataAddition({
    id: 'A008',
    title: 'Continue progression guidance resource identity and metadata',
    slug: 'continue-progression',
    state: 'dormant',
  }),
  {
    id: 'A009',
    title: 'Guidance resource catalogue and live-purpose partition',
    reviewDomain: 'resource-metadata-and-routing',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Define the complete six-resource catalogue, stable content lookup, and navigation-versus-creation partition consumed by registration, served-surface checks, and public-resource policy.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: GUIDANCE_CATALOGUE,
    reviewedAnchors: [
      structuralAnchor(`export const AGENT_GUIDANCE_RESOURCES: readonly AgentGuidanceResource[] = [
  FIND_LESSONS_GUIDANCE,
  EXPLORE_CURRICULUM_GUIDANCE,
  LEARNING_PROGRESSION_GUIDANCE,
  CURRICULUM_MAPPING_GUIDANCE,
  ADAPT_LESSON_GUIDANCE,
  CONTINUE_PROGRESSION_GUIDANCE,
];`),
      structuralAnchor(`export const NAVIGATION_GUIDANCE_URIS: readonly string[] = [
  FIND_LESSONS_GUIDANCE.uri,
  EXPLORE_CURRICULUM_GUIDANCE.uri,
  LEARNING_PROGRESSION_GUIDANCE.uri,
];`),
      structuralAnchor(`export const CREATION_GUIDANCE_URIS: readonly string[] = [
  CURRICULUM_MAPPING_GUIDANCE.uri,
  ADAPT_LESSON_GUIDANCE.uri,
  CONTINUE_PROGRESSION_GUIDANCE.uri,
];`),
      structuralAnchor(`const CONTENT_BY_URI: ReadonlyMap<string, string> = new Map([
  [FIND_LESSONS_GUIDANCE.uri, FIND_LESSONS_GUIDANCE_MARKDOWN],
  [EXPLORE_CURRICULUM_GUIDANCE.uri, EXPLORE_CURRICULUM_GUIDANCE_MARKDOWN],
  [LEARNING_PROGRESSION_GUIDANCE.uri, LEARNING_PROGRESSION_GUIDANCE_MARKDOWN],
  [CURRICULUM_MAPPING_GUIDANCE.uri, CURRICULUM_MAPPING_GUIDANCE_MARKDOWN],
  [ADAPT_LESSON_GUIDANCE.uri, ADAPT_LESSON_GUIDANCE_MARKDOWN],
  [CONTINUE_PROGRESSION_GUIDANCE.uri, CONTINUE_PROGRESSION_GUIDANCE_MARKDOWN],
]);`),
    ],
  },
  {
    id: 'A010',
    title: 'Oak: Under the Hood baked orientation digest',
    reviewDomain: 'engineering-structural',
    impactTier: 'high-impact',
    behaviouralIntent:
      'Serve the repository orientation method inline from the deployed artefact (directory ' +
      'policy §2.F cure, MCP-353): the audience-independent digest of the canonical ' +
      'under-the-hood skill, generated out of band with a parity gate ' +
      '(validate-under-the-hood-content) so served instructions are reviewed with the ' +
      'deployment, never fetched at runtime.',
    workspaceScope: 'in',
    sourceLocus: 'this-repo',
    file: UNDER_THE_HOOD_CONTENT,
    reviewedAnchors: [structuralAnchor('export const OAK_UNDER_THE_HOOD_ORIENTATION =')],
  },
  ...SERVER_INSTRUCTIONS_ADDITIONS,
];
