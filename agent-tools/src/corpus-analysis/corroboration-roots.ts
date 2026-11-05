/**
 * The homes a corroboration claim may name: the meta prompt asks for paths under these two
 * roots, and the post-run check counts a claim only as a regular file under one of them, so
 * the two read one list. A leaf module with no imports, because the meta workflow bundles it
 * into a sandbox that carries no dependencies.
 */
export const CORROBORATION_ROOTS = ['.agent/memory/active/patterns/', '.agent/rules/'] as const;
