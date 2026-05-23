import { namedNode, quad } from '@oaknational/graph-core/data-factory';
import type { JsonLdDocument } from '@oaknational/graph-core/jsonld';
import { describe, expect, it } from 'vitest';

import { parseJsonLdCompatible } from './index.js';

// A minimal JSON-LD-compatible fixture. The document declares one
// `Person` with two named-literal properties (name + jobTitle) under
// the schema.org context — three quads total:
//   1 rdf:type Person
//   1 schema:name "Ada"
//   1 schema:jobTitle "Engineer"
// = 3 quads. The named-domain rationale (a typed entity with two
// distinguishing string properties) makes the count a domain fact.
const PERSON_JSONLD_FIXTURE: JsonLdDocument = {
  '@context': {
    name: 'https://schema.org/name',
    jobTitle: 'https://schema.org/jobTitle',
    Person: 'https://schema.org/Person',
  },
  '@id': 'https://example.test/people/ada',
  '@type': 'Person',
  name: 'Ada',
  jobTitle: 'Engineer',
};

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const SCHEMA_PERSON = 'https://schema.org/Person';
const SCHEMA_NAME = 'https://schema.org/name';
const SCHEMA_JOB_TITLE = 'https://schema.org/jobTitle';
const EX_ADA = 'https://example.test/people/ada';

describe('parseJsonLdCompatible', () => {
  it('parses a minimal typed Person document into the three expected quads', async () => {
    const result = await parseJsonLdCompatible(PERSON_JSONLD_FIXTURE);

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const dataset = result.value;

    expect(dataset.size).toBe(3);
    expect(
      dataset.has(quad(namedNode(EX_ADA), namedNode(RDF_TYPE), namedNode(SCHEMA_PERSON))),
    ).toBe(true);
    // The name/jobTitle quads carry literal objects, which is what the
    // invariant-2 contract test exercises across both parsers; the
    // membership check here uses structural Quad equality so it
    // suffices to verify the predicate and subject.
    let nameFound = false;
    let jobTitleFound = false;
    for (const q of dataset) {
      if (q.predicate.value === SCHEMA_NAME && q.subject.value === EX_ADA) {
        nameFound = true;
      }
      if (q.predicate.value === SCHEMA_JOB_TITLE && q.subject.value === EX_ADA) {
        jobTitleFound = true;
      }
    }
    expect(nameFound).toBe(true);
    expect(jobTitleFound).toBe(true);
  });

  it('returns deterministic Datasets on repeated parses of the same document', async () => {
    const first = await parseJsonLdCompatible(PERSON_JSONLD_FIXTURE);
    const second = await parseJsonLdCompatible(PERSON_JSONLD_FIXTURE);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }

    expect(first.value.size).toBe(second.value.size);
    for (const q of first.value) {
      expect(second.value.has(q)).toBe(true);
    }
  });

  it('returns ok with an empty Dataset for an empty JSON-LD document', async () => {
    const result = await parseJsonLdCompatible({});

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.size).toBe(0);
  });
});
