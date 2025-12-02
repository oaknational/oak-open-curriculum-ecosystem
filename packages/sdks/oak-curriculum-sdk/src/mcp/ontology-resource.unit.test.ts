/**
 * Unit tests for ontology resource.
 *
 * These tests validate the curriculum ontology resource definition that provides
 * domain model information via MCP resources/list and resources/read.
 */

import { describe, it, expect } from 'vitest';
import { ONTOLOGY_RESOURCE, getOntologyJson } from './ontology-resource.js';

describe('ONTOLOGY_RESOURCE', () => {
  it('has curriculum://ontology URI', () => {
    expect(ONTOLOGY_RESOURCE.uri).toBe('curriculum://ontology');
  });

  it('has application/json mimeType', () => {
    expect(ONTOLOGY_RESOURCE.mimeType).toBe('application/json');
  });

  it('has required fields', () => {
    expect(ONTOLOGY_RESOURCE.name).toBe('curriculum-ontology');
    expect(ONTOLOGY_RESOURCE.title).toBeDefined();
    expect(ONTOLOGY_RESOURCE.description).toBeDefined();
  });
});

describe('getOntologyJson', () => {
  it('returns valid JSON string', () => {
    const json = getOntologyJson();
    expect(() => {
      JSON.parse(json);
    }).not.toThrow();
  });

  it('includes curriculumStructure', () => {
    const json = getOntologyJson();
    const data = JSON.parse(json) as { curriculumStructure?: { keyStages?: unknown } };
    expect(data.curriculumStructure).toBeDefined();
    expect(data.curriculumStructure?.keyStages).toBeDefined();
  });

  it('includes workflows', () => {
    const json = getOntologyJson();
    const data = JSON.parse(json) as { workflows?: unknown };
    expect(data.workflows).toBeDefined();
  });

  it('includes entityHierarchy', () => {
    const json = getOntologyJson();
    const data = JSON.parse(json) as { entityHierarchy?: unknown };
    expect(data.entityHierarchy).toBeDefined();
  });

  it('includes threads information', () => {
    const json = getOntologyJson();
    const data = JSON.parse(json) as { threads?: unknown };
    expect(data.threads).toBeDefined();
  });
});
