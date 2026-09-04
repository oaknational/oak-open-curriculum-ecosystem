/**
 * Reviewed current-source anchors for audit items whose immutable baseline
 * fragment was intentionally modified or relocated.
 *
 * Retained items use immutable baseline fragments. Entries here are explicit
 * semantic hand-offs; changing one is a compliance review act.
 */
import { CURRENT_AGGREGATED_ITEM_ANCHOR_OVERRIDES } from './current-aggregated-item-anchor-overrides.js';
import { CURRENT_GENERATED_DESCRIPTION_ANCHOR_OVERRIDES } from './current-generated-description-anchor-overrides.js';
import { CURRENT_GENERATED_ITEM_ANCHOR_OVERRIDES } from './current-generated-item-anchor-overrides.js';
import { CURRENT_LANDING_ITEM_ANCHOR_OVERRIDES } from './current-landing-item-anchor-overrides.js';
import { CURRENT_REGISTRATION_ITEM_ANCHOR_OVERRIDES } from './current-registration-item-anchor-overrides.js';
import { CURRENT_SPEC_REFRESH_ITEM_ANCHOR_OVERRIDES } from './current-spec-refresh-item-anchor-overrides.js';
import { CURRENT_THREAD_PROGRESSIONS_ITEM_ANCHOR_OVERRIDES } from './current-thread-progressions-item-anchor-overrides.js';

const GUIDANCE_ROOT = 'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources';
const FIND = `${GUIDANCE_ROOT}/find-lessons.ts`;
const EXPLORE = `${GUIDANCE_ROOT}/explore-curriculum.ts`;
const LEARNING = `${GUIDANCE_ROOT}/learning-progression.ts`;
const MAPPING = `${GUIDANCE_ROOT}/curriculum-mapping.ts`;
const ADAPT = `${GUIDANCE_ROOT}/adapt-lesson.ts`;
const CONTINUE = `${GUIDANCE_ROOT}/continue-progression.ts`;
type AnchorOverrides = Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>;

export const CURRENT_ITEM_ANCHOR_OVERRIDES: AnchorOverrides = {
  ...CURRENT_GENERATED_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_GENERATED_DESCRIPTION_ANCHOR_OVERRIDES,
  ...CURRENT_AGGREGATED_ITEM_ANCHOR_OVERRIDES,
  C178: {
    [FIND]: [
      'find curriculum lessons on a topic the teacher names, across all subjects and key stages',
    ],
  },
  C180: {
    [EXPLORE]: ['explore what Oak has on a topic across lessons, units, and threads in parallel'],
  },
  C181: {
    [LEARNING]: [
      'understand how a concept builds across year groups by walking progression threads',
    ],
  },
  C182: {
    [MAPPING]: [
      'build or audit a curriculum map — unit order across a year or key stage — grounded in Oak',
    ],
  },
  C183: {
    [ADAPT]: ['adapt an Oak lesson grounded in EEF Teaching and Learning Toolkit evidence'],
  },
  C184: {
    [CONTINUE]: [
      "plan the next step from where the teacher's class is — resolve the next unit from Oak's sequence",
    ],
  },
  C185: {
    [FIND]: ["Substitute the teacher's own topic wherever a placeholder like `<topic>` appears"],
  },
  C186: {
    [FIND]: [
      'if they name a key stage, carry it as the `keyStage` filter',
      '`"ks1"`, `"ks2"`, `"ks3"`, `"ks4"`',
    ],
  },
  C187: {
    [ADAPT]: ['a teacher is adapting a lesson on a topic for a year group'],
  },
  C188: {
    [ADAPT]: ["Substitute the teacher's own topic and year group where the placeholders appear"],
    [CONTINUE]: [
      "Substitute the teacher's own subject, year group, and just-covered topic where the placeholders appear",
    ],
  },
  C189: {
    [EXPLORE]: ["Substitute the teacher's own topic for `<topic>`"],
  },
  C190: {
    [EXPLORE]: ['if they name a subject, carry it as the `subject` filter'],
  },
  C191: {
    [LEARNING]: ["Substitute the teacher's own concept and subject where the placeholders appear"],
  },
  C192: {
    [LEARNING]: ["Substitute the teacher's own concept and subject where the placeholders appear"],
    [MAPPING]: [
      "Substitute the teacher's own subject, key stage, and (if named) year group where the placeholders appear",
    ],
    [CONTINUE]: [
      "Substitute the teacher's own subject, year group, and just-covered topic where the placeholders appear",
    ],
  },
  C193: {
    [MAPPING]: ['build (or audit) a curriculum map for a subject at a key stage'],
  },
  C194: {
    [MAPPING]: ['(if named) year group where the placeholders appear'],
  },
  C195: {
    [CONTINUE]: ['what their class just covered'],
  },
  C196: {
    [CONTINUE]: ['optionally with notes on how the class did'],
  },
  C197: {
    [FIND]: [
      'Use `search` with scope `"lessons"` to find lessons matching the topic',
      'For the top 3-5 lessons, provide a brief summary of what each covers',
    ],
  },
  C199: {
    [EXPLORE]: [
      'Use `explore-topic` to search across lessons, units, and threads in parallel',
      'For the most relevant results, drill down using `search` with a specific scope',
    ],
  },
  C200: {
    [LEARNING]: [
      'The progression from earliest to latest year group',
      'Key prerequisites at each stage',
      'How concepts build on previous learning',
    ],
  },
  C201: {
    [MAPPING]: [
      'threads are the vertical backbone, so the map should advance them coherently rather than presenting disconnected topics',
      'Output the map as a table (term/half-term | unit | thread(s) | builds on | national curriculum coverage)',
    ],
  },
  C202: {
    [ADAPT]: [
      'Surface the pedagogical signals: take the lesson slug of the lesson you selected in step 1',
      'Give the teacher the adapted lesson as evidence-calibrated options and trade-offs — not a single recommendation or selection',
    ],
  },
  C203: {
    [CONTINUE]: [
      "the unit that follows the class's confirmed position is the candidate next step",
      'its assumed prior knowledge is exactly what the class should now have secured',
    ],
  },
  C204: {
    [CONTINUE]: [
      'If the teacher gave class notes, check the list against them and flag anything the class may not have secured',
    ],
  },
  C205: {
    [FIND]: [
      'Before searching, call `get-curriculum-model` for a complete understanding of the curriculum domain model and available tools',
    ],
    [EXPLORE]: ['Call `get-curriculum-model` first for domain definitions and tool guidance'],
    [LEARNING]: ['Call `get-curriculum-model` first for domain definitions and tool guidance'],
    [MAPPING]: [
      'Call `get-curriculum-model` first for domain definitions and tool guidance',
      'MCP tool names may appear prefixed',
    ],
    [ADAPT]: [
      'Call `get-curriculum-model` first for domain definitions and tool guidance',
      'MCP tool names may appear prefixed',
    ],
    [CONTINUE]: [
      'Call `get-curriculum-model` first for domain definitions and tool guidance',
      'MCP tool names may appear prefixed',
    ],
  },
  C206: {
    [MAPPING]: [
      'published under the Open Government Licence v3.0',
      'credit Oak National Academy and link to the relevant thread or unit',
    ],
    [ADAPT]: [
      'credit Oak National Academy under the Open Government Licence v3.0 for any reproduced Oak material',
    ],
    [CONTINUE]: [
      'published under the Open Government Licence v3.0',
      'credit Oak National Academy and link to the relevant thread or unit',
    ],
  },
  C207: {
    [MAPPING]: [
      'render any document with real table headers and a logical reading order (WCAG 2.2 AA)',
    ],
    [ADAPT]: [
      'If you produce slides, worksheets, or quizzes, meet WCAG 2.2 AA (alt text, heading/reading order, contrast)',
    ],
  },
  C208: {
    [MAPPING]: ['the map is a model to localise, not a mandate'],
    [ADAPT]: ['not a single recommendation or selection', 'The decision is theirs to make'],
    [CONTINUE]: [
      "The next step is a recommendation grounded in Oak's published sequence, not a mandate",
      "the teaching decision is the teacher's to make",
    ],
  },
  C209: {
    [MAPPING]: [
      "The approach follows Oak's curriculum threads (after Mary Myatt) and Oak's six curriculum principles",
    ],
    [ADAPT]: ['cite EEF for the evidence (organisation, the EEF page link, and the named authors)'],
  },
  C313: {
    'packages/sdks/oak-curriculum-sdk/src/mcp/classify-error-response.ts': [
      "type DocumentedErrorCode = 'RESOURCE_NOT_FOUND' | 'AUTHENTICATION_REQUIRED' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'",
      "type UpstreamErrorCode = 'UPSTREAM_SERVER_ERROR' | 'CONTENT_NOT_AVAILABLE' | 'UPSTREAM_API_ERROR'",
    ],
  },
  C329: {
    [FIND]: ['Agent guidance: find lessons'],
  },
  C331: {
    [EXPLORE]: ['Agent guidance: explore the curriculum'],
  },
  C332: {
    [LEARNING]: ['Agent guidance: learning progression'],
  },
  C333: {
    [MAPPING]: ['Agent guidance: curriculum mapping'],
  },
  C334: {
    [ADAPT]: ['Agent guidance: adapt a lesson with EEF evidence'],
  },
  C335: {
    [CONTINUE]: ['Agent guidance: continue the progression'],
  },
  ...CURRENT_THREAD_PROGRESSIONS_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_REGISTRATION_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_LANDING_ITEM_ANCHOR_OVERRIDES,
  ...CURRENT_SPEC_REFRESH_ITEM_ANCHOR_OVERRIDES,
  // MCP-353: C413 (the under-the-hood public-allowlist row) retired with the
  // deleted resource — no current anchor; the retirement rides the lineage.
  C479: {
    'packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts': [
      'export const BASE_WIDGET_URI = `ui://widget/oak-curriculum-app-${resolveWidgetUriSuffix({',
      'vercel: process.env.VERCEL, gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA, deploymentId: process.env.VERCEL_DEPLOYMENT_ID',
    ],
  },
};
