#!/usr/bin/env node
/**
 * Real-content backstop binding the two operator-profile schemas.
 *
 * The Core-carried JSON Schema
 * (`.agent/practice-core/schemas/operator-profile.schema.json`) is the
 * portable CONTRACT; the zod schema in `operator-profile-schema.ts` is
 * this estate's ENFORCEMENT surface. Unit tests exercise the zod surface on
 * shared fixtures without IO; this smoke reads the contract document as data,
 * compiles it strictly, and proves both surfaces return the same verdict on
 * every fixture — so an edit to one without the other red-gates.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { type AnySchema, type ValidateFunction } from 'ajv';
import Ajv from 'ajv/dist/2020.js';
import { parse as parseYaml } from 'yaml';

import { isJsonObject } from '../../core/json.js';
import { writeLine } from '../../core/terminal-output.js';
import { splitProfileFrontmatter } from './operator-profile-document.js';
import { PROFILE_FIXTURES } from './operator-profile-fixtures.js';
import {
  OPERATOR_PROFILE_CONTRACT_REL_PATH,
  OPERATOR_PROFILE_SCHEMA_VERSION,
  operatorProfileFrontmatterSchema,
} from './operator-profile-schema.js';

const REPO_ROOT = fileURLToPath(new URL('../../../..', import.meta.url));

const raw = readFileSync(join(REPO_ROOT, OPERATOR_PROFILE_CONTRACT_REL_PATH), 'utf8');
const document: unknown = JSON.parse(raw);
assert.ok(isJsonObject(document), 'the contract document is a JSON object');

const version = document['version'];
assert.equal(typeof version, 'string', 'the contract declares a version');
assert.equal(
  String(version).split('.')[0],
  String(OPERATOR_PROFILE_SCHEMA_VERSION),
  'the contract MAJOR and the enforcement schema family agree',
);

const defs = document['$defs'];
assert.ok(isJsonObject(defs), 'the contract carries $defs');

// Two compilations. The strict one passes only `$defs` to the compiler, so a
// mistyped keyword in the shapes fails loudly and the root annotation keys
// (`version`, `$comment_*`) never reach strict mode. The whole-document one
// is what a portable consumer does — compile the published file as it is —
// and proves the root `$ref` binds the document to the frontmatter shape;
// it tolerates the annotation keys as unknown keywords, which is the only
// relaxation a consumer needs.
const strictAjv = new Ajv({ strict: true, allErrors: true });
const strictSchema: AnySchema = { $ref: '#/$defs/profile_frontmatter', $defs: defs };
const validateShapes: ValidateFunction = strictAjv.compile(strictSchema);

assert.equal(
  document['$ref'],
  '#/$defs/profile_frontmatter',
  'the published document binds its root to the frontmatter shape',
);
const consumerAjv = new Ajv({ strict: true, strictSchema: false, allErrors: true });
const publishedSchema: AnySchema = document;
const validateDocument: ValidateFunction = consumerAjv.compile(publishedSchema);

let checked = 0;
for (const fixture of PROFILE_FIXTURES) {
  const split = splitProfileFrontmatter(fixture.content);
  assert.ok(split !== null, `${fixture.name}: fixture has a frontmatter block`);
  const mapping: unknown = parseYaml(split.frontmatter);
  const shapesVerdict = validateShapes(mapping) === true;
  const documentVerdict = validateDocument(mapping) === true;
  const enforcementVerdict = operatorProfileFrontmatterSchema.safeParse(mapping).success;
  assert.equal(
    shapesVerdict,
    fixture.frontmatterValid,
    `${fixture.name}: the contract's verdict matches the fixture's declared validity`,
  );
  assert.equal(
    documentVerdict,
    shapesVerdict,
    `${fixture.name}: the published document, compiled whole, gives the same verdict`,
  );
  assert.equal(
    enforcementVerdict,
    shapesVerdict,
    `${fixture.name}: the enforcement schema agrees with the contract`,
  );
  checked += 1;
}

writeLine(
  `✓ operator-profile contract ${String(version)} and the family-${OPERATOR_PROFILE_SCHEMA_VERSION} enforcement schema agree on ${checked} fixtures`,
);
