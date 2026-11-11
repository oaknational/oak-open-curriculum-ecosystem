/**
 * Unit tests for the search `year` filter schemas: they follow the year domain
 * they are given, and the shipped schemas use the generated API contract's.
 */

import { describe, expect, it } from 'vitest';
import { MCP_TOOL_DESCRIPTORS } from '@oaknational/sdk-codegen/mcp-tools';
import {
  createYearFilterSchemas,
  YEAR_NUMBER_SCHEMA,
  YEAR_STRING_SCHEMA,
} from './year-filter-schema.js';

const contractYears = MCP_TOOL_DESCRIPTORS[
  'get-sequences-units'
].toolZodSchema.shape.params.shape.query
  .unwrap()
  .shape.year.unwrap().options;

describe('createYearFilterSchemas', () => {
  const { stringSchema, numberSchema } = createYearFilterSchemas(['1', '2', 'all-years']);

  it.each(['1', '2', 'all-years'])('accepts the string value "%s" from the domain', (value) => {
    expect(stringSchema.safeParse(value).success).toBe(true);
  });

  it.each(['0', '3', '02', 'banana'])('rejects the string value "%s" outside it', (value) => {
    expect(stringSchema.safeParse(value).success).toBe(false);
  });

  it.each([1, 2])('accepts the year group number %d from the domain', (value) => {
    expect(numberSchema.safeParse(value).success).toBe(true);
  });

  it.each([0, 3, 1.5])('rejects the number %d outside it', (value) => {
    expect(numberSchema.safeParse(value).success).toBe(false);
  });
});

describe('the shipped year schemas', () => {
  it('accept exactly the year values the generated API contract declares', () => {
    expect(YEAR_STRING_SCHEMA.options).toStrictEqual(contractYears);
  });

  it('publish a number range holding exactly the contract year groups', () => {
    const accepted = Array.from({ length: 100 }, (_, year) => year).filter(
      (year) => YEAR_NUMBER_SCHEMA.safeParse(year).success,
    );

    expect(accepted).not.toHaveLength(0);
    expect(accepted.map(String)).toStrictEqual(
      contractYears.filter((year) => Number.isInteger(Number(year))),
    );
  });
});
