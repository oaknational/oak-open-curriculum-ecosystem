#!/usr/bin/env npx tsx
/**
 * Generates Elasticsearch synonym set from SDK ontology data.
 *
 * The SDK `ontologyData.synonyms` is the SINGLE SOURCE OF TRUTH.
 * This script exports to ES-compatible JSON format.
 *
 * @example
 * ```bash
 * npx tsx scripts/generate-synonyms.ts > /tmp/synonyms.json
 * ```
 */

import { serialiseElasticsearchSynonyms } from '@oaknational/sdk-codegen/synonyms';

process.stdout.write(serialiseElasticsearchSynonyms() + '\n');
