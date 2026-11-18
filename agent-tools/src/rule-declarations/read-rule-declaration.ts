/**
 * Read a canonical rule's declaration from its frontmatter.
 *
 * The block is strict YAML in the closed shape `rule-declaration.ts` defines; anything else is
 * refused with the rule path and the reason, so a projection is never generated from a
 * declaration the estate cannot vouch for. The boundary also refuses values the projections
 * cannot carry (`strict-validation-at-boundary`): a description or trigger that spans lines, a
 * trigger with a `|` or a backtick (it sits in a table cell inside a code span), an empty or
 * repeated glob, and a glob that would not survive the Cursor trigger's comma-joined line: the
 * trigger is rendered by `join(',')` and Cursor reads it back by splitting top-level commas
 * inside balanced braces, so every member must round-trip through that reader as itself.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { typeSafeKeys } from '@oaknational/type-helpers';
import { parse } from 'yaml';

import { isJsonObject, type JsonObject } from '../core/json.js';

import { splitCommaList } from './comma-list.js';
import { FRONTMATTER_FENCE_LINE } from './frontmatter-lines.js';
import {
  isRuleClassification,
  RULE_CLASSIFICATIONS,
  type RuleClassification,
  type RuleDeclaration,
} from './rule-declaration.js';

const DECLARATION_KEYS: ReadonlySet<string> = new Set([
  'classification',
  'description',
  'trigger',
  'globs',
]);

/**
 * Parse the frontmatter block of a rule file into its declaration.
 *
 * @param name - The rule's basename without `.md`.
 * @param text - The rule file text.
 * @returns The declaration, or the reason it could not be read.
 *
 * @example
 * ```ts
 * readRuleDeclaration('compute-dont-hope', '---\nclassification: core\ndescription: d\n---\n\n# …');
 * // { ok: true, value: { name: 'compute-dont-hope', classification: 'core', description: 'd' } }
 * ```
 */
export function readRuleDeclaration(name: string, text: string): Result<RuleDeclaration, string> {
  const rulePath = `.agent/rules/${name}.md`;
  const fields = readFields(text);
  if (!fields.ok) {
    return err(`${rulePath}: ${fields.error}`);
  }
  const shape = readShape(name, fields.value);
  return shape.ok ? shape : err(`${rulePath}: ${shape.error}`);
}

function readFields(text: string): Result<JsonObject, string> {
  const block = frontmatterBlock(text);
  if (block === undefined) {
    return err('no frontmatter block');
  }
  const parsed = parseYaml(block);
  if (!parsed.ok) {
    return err(`frontmatter is not valid YAML (${parsed.error})`);
  }
  return isJsonObject(parsed.value) ? ok(parsed.value) : err('frontmatter must be a mapping');
}

function frontmatterBlock(text: string): string | undefined {
  const lines = text.split('\n');
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return undefined;
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  return closing === -1 ? undefined : lines.slice(1, closing).join('\n');
}

function parseYaml(block: string): Result<unknown, string> {
  try {
    return ok(parse(block));
  } catch (error: unknown) {
    return err(error instanceof Error ? (error.message.split('\n')[0] ?? '') : String(error));
  }
}

function readShape(name: string, fields: JsonObject): Result<RuleDeclaration, string> {
  const unknownKey = typeSafeKeys(fields).find((key) => !DECLARATION_KEYS.has(key));
  if (unknownKey !== undefined) {
    return err(`unknown frontmatter key "${unknownKey}"`);
  }
  const classification = readClassification(fields['classification']);
  if (!classification.ok) {
    return classification;
  }
  const description = readDescription(fields['description']);
  if (!description.ok) {
    return description;
  }
  return classification.value === 'core'
    ? readCore(name, description.value, fields)
    : readSituational(name, description.value, fields);
}

function readDescription(value: unknown): Result<string, string> {
  if (typeof value !== 'string' || value.length === 0) {
    return err('description must be a non-empty string');
  }
  return value.includes('\n') ? err('description must be one line') : ok(value);
}

function readClassification(value: unknown): Result<RuleClassification, string> {
  if (typeof value === 'string' && isRuleClassification(value)) {
    return ok(value);
  }
  const allowed = RULE_CLASSIFICATIONS.join(' or ');
  return err(`classification must be ${allowed}, got "${String(value)}"`);
}

function readCore(
  name: string,
  description: string,
  fields: JsonObject,
): Result<RuleDeclaration, string> {
  return 'trigger' in fields || 'globs' in fields
    ? err('a core rule carries no trigger or globs')
    : ok({ name, classification: 'core', description });
}

function readSituational(
  name: string,
  description: string,
  fields: JsonObject,
): Result<RuleDeclaration, string> {
  const trigger = readTrigger(fields['trigger']);
  if (!trigger.ok) {
    return trigger;
  }
  const globs = readGlobs(fields['globs']);
  return globs.ok
    ? ok({
        name,
        classification: 'situational',
        description,
        trigger: trigger.value,
        globs: globs.value,
      })
    : globs;
}

const TRIGGER_CANNOT_CARRY = /[\n|`]/u;

function readTrigger(value: unknown): Result<string, string> {
  if (typeof value !== 'string' || value.length === 0) {
    return err('a situational rule needs a trigger');
  }
  return TRIGGER_CANNOT_CARRY.test(value)
    ? err('trigger must be one line without "|" or a backtick')
    : ok(value);
}

function readGlobs(value: unknown): Result<readonly string[], string> {
  if (value === undefined) {
    return ok([]);
  }
  if (!Array.isArray(value) || !value.every((member) => typeof member === 'string')) {
    return err('globs must be a list of strings');
  }
  const members: readonly string[] = value.filter((member) => typeof member === 'string');
  if (members.some((member) => member.length === 0 || member.includes('\n'))) {
    return err('globs must be one-line non-empty strings');
  }
  const repeated = members.find((member, index) => members.indexOf(member) !== index);
  if (repeated !== undefined) {
    return err(`globs repeat "${repeated}"`);
  }
  const unrenderable = members.find((member) => !survivesCursorCommaList(member));
  return unrenderable === undefined
    ? ok(members)
    : err(`glob "${unrenderable}" would not survive the Cursor trigger's comma-joined globs line`);
}

/** Whether the Cursor comma-list reader gives the member back as itself and nothing else. */
function survivesCursorCommaList(member: string): boolean {
  const read = splitCommaList(member);
  return read.ok && read.value.length === 1 && read.value[0] === member;
}
