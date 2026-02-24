/**
 * Generates the `client-types.ts` module that defines `OakApiPathBasedClient`.
 *
 * This type is `PathBasedClient<paths>` — derivable entirely from the
 * upstream schema plus `openapi-fetch`. Generating it here keeps the
 * `generated/` directory self-contained and safe to wipe via `generate:clean`.
 */

const HEADER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Client type alias for the Oak Curriculum API.
 * Regenerate with: pnpm type-gen
 */\n`;

export function generateClientTypes(): string {
  return `${HEADER}
import type { PathBasedClient } from 'openapi-fetch';

import type { paths } from './api-paths-types.js';

export type OakApiPathBasedClient = PathBasedClient<paths>;
`;
}
