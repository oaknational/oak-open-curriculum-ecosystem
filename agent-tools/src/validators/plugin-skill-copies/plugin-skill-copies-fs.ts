/**
 * The real-filesystem {@link SkillTreeReader} for the skill-copy validator.
 *
 * @remarks
 * Kept apart from the pure comparison so the comparison can be tested with
 * in-memory trees and this module is the only place that touches disk.
 *
 * @packageDocumentation
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { SkillTree, SkillTreeReader } from './plugin-skill-copies.js';

/**
 * Create a reader that walks a skill directory on disk, skipping any directory
 * whose name is in `ignoreDirs` (at any depth).
 */
export function createFileSystemSkillTreeReader(ignoreDirs: readonly string[]): SkillTreeReader {
  const read = (skillDir: string): SkillTree | undefined => {
    if (!existsSync(skillDir)) {
      return undefined;
    }
    const tree = new Map<string, Uint8Array>();
    const walk = (current: string, prefix: string): void => {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name)) {
            walk(path.join(current, entry.name), relative);
          }
        } else if (entry.isFile()) {
          tree.set(relative, readFileSync(path.join(current, entry.name)));
        }
      }
    };
    walk(skillDir, '');
    return tree;
  };
  return { read };
}
