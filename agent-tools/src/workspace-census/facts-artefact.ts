/**
 * The single canonical serialisation of the committed facts artefact:
 * `facts` writes exactly this byte form and `check` compares against
 * exactly this byte form, so envelope fields (schema_version, plan,
 * note), entry order, and formatting can never drift apart silently
 * (validators-must-recompute).
 */
import type { SubjectFacts } from './facts.js';

export function renderFactsArtefact(facts: readonly SubjectFacts[]): string {
  const artefact = {
    schema_version: '1.0.0',
    plan: '.agent/plans/delivery/workspace-classification-census.plan.md',
    note: 'Detector facts only — mechanical observations; judged readings live in rows.json.',
    facts,
  };
  return `${JSON.stringify(artefact, null, 2)}\n`;
}
