/**
 * Pure helpers for the plan-corpus validator: per-file frontmatter
 * conformance and corpus-level edge resolution.
 *
 * @remarks
 * Registry recomputation lives in `plan-corpus-registries.ts` (both
 * registries recompute from live surfaces on every run). Cross-file
 * rules live in {@link validateCorpus}: a strategic node's `serves`
 * resolves against the published choice registry; a delivery plan's or
 * runbook's `serves` resolves against the strategic nodes actually in
 * the corpus; `depends_on` edges and `impact_areas` members resolve or
 * the corpus fails; an empty corpus is a failure, never a vacuous
 * green; and ratified delivery plans satisfy execution-anchor
 * consistency (the rule, its derivation, and its deliberate limit
 * live in `plan-execution-anchors.ts`).
 *
 * Subtree resolution needs no recursion, by validation rather than by
 * luck: a strategic node's `serves` must resolve against the published
 * choice registry, so a strategic node can never serve another plan
 * and the corpus is exactly two levels deep. A future nested shape
 * would surface here as a visible gap, not a silent wrong answer.
 *
 * @packageDocumentation
 */

import { err, isErr, ok, type Result } from '@oaknational/result';
import { parse as parseYaml } from 'yaml';

import { isJsonObject } from '../../core/json.js';
import { extractFrontmatter } from '../portability/portability-fs.js';
import { type ParsedPlanFile, type PlanConformanceFailure } from './plan-corpus-types.js';
import { anchoringEvidence, executionAnchorMessages } from './plan-execution-anchors.js';
import { type ChoiceRegistry } from './plan-corpus-registries.js';
import { planNodeSchema, type PlanNode } from './plan-node-schema.js';

/**
 * Validate one `*.plan.md` file's frontmatter against the plan-node
 * contract (single-file shape only — corpus rules are
 * {@link validateCorpus}'s).
 *
 * Fail-closed at file granularity: a plan with no frontmatter block is
 * a failure, never a silent skip (the vacuous-green class).
 *
 * @returns `ok(PlanNode)` on conformance; `err` carries every message.
 */
export function validatePlanFile(
  path: string,
  content: string,
): Result<PlanNode, PlanConformanceFailure> {
  const mapping = parseFrontmatterMapping(content);
  if (isErr(mapping)) {
    return err({ path, messages: [mapping.error] });
  }
  const result = planNodeSchema.safeParse(mapping.value);
  if (!result.success) {
    return err({
      path,
      messages: result.error.issues.map(
        (issue) => `${issue.path.map(String).join('.') || '(root)'}: ${issue.message}`,
      ),
    });
  }
  return ok(result.data);
}

/**
 * Corpus-level rules over the file-level-valid plans: non-emptiness,
 * id uniqueness, `serves` resolution (strategic → published choice
 * registry; delivery/runbook → a strategic node in the corpus),
 * `impact_areas` registry membership, `depends_on` resolution, and
 * execution-anchor consistency for ratified delivery plans.
 *
 * @returns Path-anchored failures; empty means the corpus coheres.
 */
export function validateCorpus(
  files: readonly ParsedPlanFile[],
  choices: ChoiceRegistry,
  impactAreas: ReadonlySet<string>,
): PlanConformanceFailure[] {
  if (files.length === 0) {
    return [
      {
        path: '.agent/plans',
        messages: ['the corpus is empty — zero plan files is a failure, never a vacuous green'],
      },
    ];
  }
  const allIds = new Set(files.map((file) => file.node.id));
  const strategicIds = new Set(
    files.filter((file) => file.node.node_type === 'strategic').map((file) => file.node.id),
  );
  const anchors = anchoringEvidence(files);
  const failures: PlanConformanceFailure[] = [];
  for (const file of files) {
    const messages = [
      ...duplicateIdMessages(file, files),
      ...servesMessages(file.node, choices, strategicIds),
      ...impactAreaMessages(file.node, impactAreas),
      ...dependsOnMessages(file.node, allIds),
      ...executionAnchorMessages(file.node, anchors),
    ];
    if (messages.length > 0) {
      failures.push({ path: file.path, messages });
    }
  }
  return failures;
}

/** A plan id appearing under more than one path is a corpus failure. */
function duplicateIdMessages(
  file: ParsedPlanFile,
  files: readonly ParsedPlanFile[],
): readonly string[] {
  const holders = files.filter((candidate) => candidate.node.id === file.node.id);
  if (holders.length === 1) {
    return [];
  }
  return [
    `id: duplicate plan id '${file.node.id}' (also at: ${holders
      .filter((candidate) => candidate.path !== file.path)
      .map((candidate) => candidate.path)
      .join(', ')})`,
  ];
}

/** `serves` resolution per node type. */
function servesMessages(
  node: PlanNode,
  choices: ChoiceRegistry,
  strategicIds: ReadonlySet<string>,
): readonly string[] {
  const serves = node.serves;
  if (serves === undefined) {
    return [];
  }
  if (node.node_type === 'strategic') {
    return choices.ids.has(serves)
      ? []
      : [
          `serves: '${serves}' does not resolve against the published strategic-choice registry (docs/strategy; known: ${sorted(choices.ids).join(', ')})`,
        ];
  }
  return strategicIds.has(serves)
    ? []
    : [
        `serves: '${serves}' names no strategic node in the corpus (known: ${sorted(strategicIds).join(', ')})`,
      ];
}

/** Every `impact_areas` member resolves against the closed registry. */
function impactAreaMessages(node: PlanNode, impactAreas: ReadonlySet<string>): readonly string[] {
  return node.impact_areas
    .filter((area) => !impactAreas.has(area))
    .map(
      (area) =>
        `impact_areas: '${area}' is not in the closed registry (.agent/plans/impact-areas.md; known: ${sorted(impactAreas).join(', ')})`,
    );
}

/** Every `depends_on` edge names a plan id present in the corpus. */
function dependsOnMessages(node: PlanNode, allIds: ReadonlySet<string>): readonly string[] {
  return (node.depends_on ?? [])
    .filter((edge) => !allIds.has(edge.plan))
    .map((edge) => `depends_on: '${edge.plan}' names no plan id in the corpus`);
}

/** Locale-stable sorted view of a set, for deterministic messages. */
function sorted(values: ReadonlySet<string>): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

/** Extract and parse the YAML frontmatter block into a mapping, fail-closed. */
function parseFrontmatterMapping(content: string): Result<unknown, string> {
  const frontmatter = extractFrontmatter(content);
  if (frontmatter === null) {
    return err('no YAML frontmatter block (the plan-node contract requires one)');
  }
  let parsed: unknown;
  try {
    parsed = parseYaml(frontmatter);
  } catch (cause) {
    return err(
      `frontmatter is not parseable YAML: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
  }
  if (!isJsonObject(parsed)) {
    return err('frontmatter is not a YAML mapping');
  }
  return ok(parsed);
}
