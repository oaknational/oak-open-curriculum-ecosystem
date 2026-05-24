#!/usr/bin/env -S pnpm exec tsx
/**
 * Generates Elasticsearch synonym set from SDK ontology data.
 *
 * The SDK `ontologyData.synonyms` is the SINGLE SOURCE OF TRUTH.
 * This script exports to ES-compatible JSON format.
 *
 * @example
 * ```bash
 * pnpm --filter @oaknational/search-cli exec tsx operations/utilities/generate-synonyms.ts > /tmp/synonyms.json
 * ```
 */

import { serialiseElasticsearchSynonyms } from '@oaknational/sdk-codegen/synonyms';

process.stdout.write(serialiseElasticsearchSynonyms() + '\n');
