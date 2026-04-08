/**
 * Oak National Academy MCP Server Branding
 *
 * Provides the `Implementation` metadata passed to the `McpServer` constructor:
 * `title`, `description`, `websiteUrl`, and themed `icons`.
 *
 * @remarks
 * The MCP spec's `Implementation` interface (2025-11-25) extends `BaseMetadata`
 * (name + title) and `Icons` (themed icon array). Every MCP host renders these
 * fields in its server list — without them the server appears as a generic
 * technical identifier ("oak-curriculum-http v0.1.0").
 *
 * The Oak acorn SVG path data is extracted from the widget's `BrandBanner.tsx`
 * (sourced from Oak-Web-Application sprite sheet, `id="logo"`). Two
 * `data:image/svg+xml;base64` URIs provide light-background and
 * dark-background variants. Base64 is used per the MCP spec recommendation
 * for `data:` URIs. The SVGs are ~2.4 KB each — well within the typical
 * icon payload budget.
 *
 * @see {@link https://spec.modelcontextprotocol.io/2025-11-25/core/lifecycle/} MCP Implementation schema
 */

import type { Icon } from '@modelcontextprotocol/sdk/types.js';

/**
 * Oak acorn SVG path data (viewBox 0 0 32 42).
 *
 * Shared between light and dark icon variants. Extracted from
 * `widget/src/BrandBanner.tsx` to avoid duplication.
 */
const OAK_ACORN_PATH =
  'M16.983 7.198c.86.15 1.602.243 2.328.41a14.603 14.603 0 0 1 8.09 4.962 14.964 14.964 0 0 1 3.513 8.535c.05.58.082 1.16.092 1.74.012.627-.086.738-.676.825-2.213.32-4.468.14-6.604-.522a14.778 14.778 0 0 1-3.871-1.838 13.41 13.41 0 0 1-3.74-3.803 13.242 13.242 0 0 1-2.07-5.484c-.107-.711-.124-1.434-.191-2.234a12.84 12.84 0 0 0-6.444 3.065c-2.65 2.319-4.192 5.266-4.748 8.808.536.108 1.029.224 1.532.303.447.07.71.244.724.76.046 1.658.345 3.3.887 4.865a31.671 31.671 0 0 0 1.983 4.418 16.044 16.044 0 0 0 4.608 5.383 17.553 17.553 0 0 0 3.214 1.861c.383.17 1.015-.104 1.483-.301a13.61 13.61 0 0 0 5.595-4.23c.835-1.076 1.497-2.307 2.12-3.529.755-1.482 1.063-3.115 1.258-4.761.039-.323.15-.454.481-.423.396.04.794.05 1.191.035.474-.026.675.222.613.637-.191 1.314-.306 2.66-.67 3.927a16.895 16.895 0 0 1-4.344 7.268 15.364 15.364 0 0 1-6.6 4.002c-.504.15-.926-.027-1.372-.176-2.78-.924-5.066-2.6-6.995-4.773a28.75 28.75 0 0 1-2.51-3.27 20.02 20.02 0 0 1-2.158-4.435 18.563 18.563 0 0 1-1.074-5.01.49.49 0 0 0-.303-.325c-.592-.193-1.197-.327-1.795-.493a.615.615 0 0 1-.516-.484.628.628 0 0 1-.003-.25c.154-2.56.889-5.05 2.147-7.278a16.25 16.25 0 0 1 4.174-4.84 15.683 15.683 0 0 1 6.32-2.969 1.19 1.19 0 0 1 .326-.071c1.117.102 1.404-.63 1.682-1.53a11.998 11.998 0 0 1 3.683-5.58c.5-.436.564-.436 1.01 0 .26.26.511.53.755.804.361.41.361.594-.048.967-.947.895-1.73 1.95-2.316 3.119-.286.624-.54 1.264-.76 1.915Zm11.554 14.268c-.032-.173-.065-.31-.084-.45a13.55 13.55 0 0 0-2.01-5.465 12.892 12.892 0 0 0-5.012-4.62A12.337 12.337 0 0 0 17 9.671c-.272-.03-.42.046-.414.36.056 2.427.701 4.674 2.12 6.64a11.663 11.663 0 0 0 5.268 4.082c1.465.58 2.978.754 4.564.713Z';

/**
 * Builds a standalone SVG string for the Oak acorn logo.
 *
 * @param fill - CSS colour value for the acorn path
 * @returns Complete SVG document string
 */
function buildAcornSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42"><path fill="${fill}" d="${OAK_ACORN_PATH}"/></svg>`;
}

/**
 * Encodes an SVG string as a `data:image/svg+xml;base64,...` URI.
 *
 * @param svg - Raw SVG document string
 * @returns Base64-encoded data URI
 */
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Oak acorn logo for light host backgrounds (oak-green-500 `#287c34`).
 *
 * @remarks
 * Designed for MCP hosts with light themes (e.g. Claude Desktop default).
 * The green acorn provides brand recognition against white/light surfaces.
 */
const OAK_ICON_LIGHT: Icon = {
  src: svgToDataUri(buildAcornSvg('#287c34')),
  mimeType: 'image/svg+xml',
  theme: 'light',
};

/**
 * Oak acorn logo for dark host backgrounds (white `#ffffff`).
 *
 * @remarks
 * Designed for MCP hosts with dark themes (e.g. Claude Desktop dark mode).
 * The white acorn provides visibility against dark surfaces.
 */
const OAK_ICON_DARK: Icon = {
  src: svgToDataUri(buildAcornSvg('#ffffff')),
  mimeType: 'image/svg+xml',
  theme: 'dark',
};

/**
 * Complete Oak server branding for the `McpServer` `Implementation` object.
 *
 * @remarks
 * Spread into the `McpServer` constructor's first argument alongside
 * `name` and `version`. Every field maps to the 2025-11-25 MCP spec's
 * `Implementation` interface.
 *
 * @example
 * ```typescript
 * const server = new McpServer({
 *   name: 'oak-curriculum-http',
 *   version: '0.1.0',
 *   ...OAK_SERVER_BRANDING,
 * });
 * ```
 */
export const OAK_SERVER_BRANDING = {
  title: 'Oak National Curriculum',
  description: 'Curriculum tools, lesson content, and semantic search for Oak National Academy.',
  websiteUrl: 'https://www.thenational.academy',
  icons: [OAK_ICON_LIGHT, OAK_ICON_DARK],
};
