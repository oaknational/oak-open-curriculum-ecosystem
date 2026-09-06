import { describe, expect, it } from 'vitest';
import {
  buildCurrentSourceAdditions,
  currentSourceAdditionFiles,
} from './current-source-additions.js';
import type { RegistrationSourceEvidence } from './current-source-model.js';

describe('buildCurrentSourceAdditions', () => {
  it('builds distinct evidence for every reviewed post-baseline item', () => {
    expect(currentSourceAdditionFiles()).toHaveLength(11);
    // The three resources revised for the stated-statements contract carry
    // their revision date; the rest keep the original capture date.
    const guidanceLastModified = (slug: string): string =>
      ['learning-progression', 'curriculum-mapping', 'adapt-lesson'].includes(slug)
        ? '2026-09-02T00:00:00Z'
        : '2026-07-23T00:00:00Z';
    const guidanceFixture = (slug: string): readonly [string, string] => [
      `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/${slug}.ts`,
      [
        `name: 'guidance-${slug}'`,
        `uri: 'docs://oak/guidance/${slug}.md'`,
        "mimeType: 'text/markdown'",
        "annotations: { priority: 0.4, audience: ['assistant'] }",
        `lastModified: '${guidanceLastModified(slug)}'`,
        ...(slug === 'curriculum-mapping'
          ? [
              'provenance:',
              "      'Derived from the oak-curriculum-mapper skill (oaknational/oak-skills); keep the two in step.'",
            ]
          : []),
      ].join('\n'),
    ];
    const guidanceRegistrationFixture = (
      slug: string,
      state: 'live' | 'dormant',
    ): readonly [string, RegistrationSourceEvidence] => [
      `packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/${slug}.ts`,
      {
        rootId: 'oak-curriculum-http',
        state,
        primitive: 'resource',
        selector: `docs://oak/guidance/${slug}.md`,
        surfaces: [
          {
            locus: 'resource-metadata',
            field: 'name',
            value: `guidance-${slug}`,
          },
          {
            locus: 'resource-metadata',
            field: 'uri',
            value: `docs://oak/guidance/${slug}.md`,
          },
          {
            locus: 'resource-metadata',
            field: 'mimeType',
            value: 'text/markdown',
          },
          {
            locus: 'resource-metadata',
            field: 'annotations',
            value: '{"priority":0.4,"audience":["assistant"]}',
          },
          {
            locus: 'resource-contents',
            field: 'uri',
            value: `docs://oak/guidance/${slug}.md`,
          },
          {
            locus: 'resource-contents',
            field: 'mimeType',
            value: 'text/markdown',
          },
          {
            locus: 'resource-contents',
            field: '_meta.lastModified',
            value: guidanceLastModified(slug),
          },
        ],
        channels:
          state === 'live' ? ['resources/list.resources[]', 'resources/read.contents[]'] : [],
      },
    ];
    const contents = new Map<string, string>([
      [
        'apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts',
        [
          "user-search': 'dormant',",
          "    'user-search-query': 'dormant'",
          "'get-eef-evidence': 'dormant'",
          "'docs://oak/getting-started.md': 'live'",
          "'docs://oak/guidance/curriculum-mapping.md': 'dormant'",
        ].join('\n'),
      ],
      [
        'packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts',
        [
          'export const DEFERRED_PATHS: readonly DeferredPathEntry[] = [',
          "  { path: '/key-stages/{keyStage}/subject/{subject}/check-restricted', ticket: 'MCP-214' },",
          "  { path: '/lessons/check-restricted', ticket: 'MCP-214' },",
          "  { path: '/changelog', ticket: 'MCP-630' },",
          "  { path: '/changelog/latest', ticket: 'MCP-630' },",
          '];',
        ].join('\n'),
      ],
      ...[
        'find-lessons',
        'explore-curriculum',
        'learning-progression',
        'curriculum-mapping',
        'adapt-lesson',
        'continue-progression',
      ].map(guidanceFixture),
      [
        'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/agent-guidance-resources.ts',
        `export const AGENT_GUIDANCE_RESOURCES: readonly AgentGuidanceResource[] = [
  FIND_LESSONS_GUIDANCE,
  EXPLORE_CURRICULUM_GUIDANCE,
  LEARNING_PROGRESSION_GUIDANCE,
  CURRICULUM_MAPPING_GUIDANCE,
  ADAPT_LESSON_GUIDANCE,
  CONTINUE_PROGRESSION_GUIDANCE,
];
export const NAVIGATION_GUIDANCE_URIS: readonly string[] = [
  FIND_LESSONS_GUIDANCE.uri,
  EXPLORE_CURRICULUM_GUIDANCE.uri,
  LEARNING_PROGRESSION_GUIDANCE.uri,
];
export const CREATION_GUIDANCE_URIS: readonly string[] = [
  CURRICULUM_MAPPING_GUIDANCE.uri,
  ADAPT_LESSON_GUIDANCE.uri,
  CONTINUE_PROGRESSION_GUIDANCE.uri,
];
const CONTENT_BY_URI: ReadonlyMap<string, string> = new Map([
  [FIND_LESSONS_GUIDANCE.uri, FIND_LESSONS_GUIDANCE_MARKDOWN],
  [EXPLORE_CURRICULUM_GUIDANCE.uri, EXPLORE_CURRICULUM_GUIDANCE_MARKDOWN],
  [LEARNING_PROGRESSION_GUIDANCE.uri, LEARNING_PROGRESSION_GUIDANCE_MARKDOWN],
  [CURRICULUM_MAPPING_GUIDANCE.uri, CURRICULUM_MAPPING_GUIDANCE_MARKDOWN],
  [ADAPT_LESSON_GUIDANCE.uri, ADAPT_LESSON_GUIDANCE_MARKDOWN],
  [CONTINUE_PROGRESSION_GUIDANCE.uri, CONTINUE_PROGRESSION_GUIDANCE_MARKDOWN],
]);`,
      ],
      [
        'apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts',
        'export const OAK_UNDER_THE_HOOD_ORIENTATION = "# Oak: Under the Hood" as const;',
      ],
      [
        'packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts',
        'const BRAND_PROVENANCE_GUIDANCE = `Oak brand and content provenance: Oak National Academy owns the Oak brand and brand elements. When you reuse Oak\'s curriculum content, attribute it ("Contains public sector information licensed under the Open Government Licence v3.0."). When you create content derived from Oak\'s resources, we request that it adheres to the same high design standards as Oak — but it must not use the Oak branding, and it must never present itself as Oak-created or Oak-endorsed.`;',
      ],
    ]);

    const registrations = Object.fromEntries([
      guidanceRegistrationFixture('find-lessons', 'live'),
      guidanceRegistrationFixture('explore-curriculum', 'live'),
      guidanceRegistrationFixture('learning-progression', 'live'),
      guidanceRegistrationFixture('curriculum-mapping', 'dormant'),
      guidanceRegistrationFixture('adapt-lesson', 'dormant'),
      guidanceRegistrationFixture('continue-progression', 'dormant'),
    ]);
    const additions = buildCurrentSourceAdditions(contents, registrations);

    expect(additions.map((addition) => addition.id)).toEqual([
      'A001',
      'A002',
      'A003',
      'A004',
      'A005',
      'A006',
      'A007',
      'A008',
      'A009',
      'A010',
      'A011',
    ]);
    expect(additions.every((addition) => addition.evidence.revision === 'added')).toBe(true);
    expect(additions[0]?.evidence.targets[0]?.anchors).toHaveLength(4);
    expect(additions[2]?.registrations).toMatchObject([
      {
        state: 'live',
        selector: 'docs://oak/guidance/find-lessons.md',
        channels: ['resources/list.resources[]', 'resources/read.contents[]'],
      },
    ]);
    expect(
      additions[2]?.registrations[0]?.anchorSurfaces
        .map((surface) => `${surface.locus}:${surface.field}`)
        .sort((left, right) => left.localeCompare(right)),
    ).toEqual([
      'resource-contents:_meta.lastModified',
      'resource-contents:mimeType',
      'resource-contents:uri',
      'resource-metadata:annotations',
      'resource-metadata:mimeType',
      'resource-metadata:name',
      'resource-metadata:uri',
    ]);
    expect(additions[5]?.registrations).toMatchObject([
      {
        state: 'dormant',
        selector: 'docs://oak/guidance/curriculum-mapping.md',
        channels: [],
      },
    ]);
  });

  it('rejects an absent addition source', () => {
    expect(() => buildCurrentSourceAdditions(new Map())).toThrow(
      'Current-source addition A001 file is absent',
    );
  });
});
