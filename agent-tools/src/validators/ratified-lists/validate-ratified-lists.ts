#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { isErr } from '@oaknational/result';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { COMPLETION_KEYWORDS_V1 } from '../../refounding/refound-claim-census-model.js';
import { NET_C_KEYWORDS_V1 } from '../../refounding/refound-inventory-nets.js';
import { SWEEP_MARKERS_V1 } from '../../refounding/refound-sweep-model.js';
import {
  compareRatifiedList,
  extractBacktickListParagraph,
} from './validate-ratified-lists-helpers.js';

/**
 * Ratified-lists validator: recompute BOTH sides of the G1-packet ↔ code
 * agreement — the packet's §2 (Net-C), §2a (census completion-keyword), and §6 (sweep marker)
 * ratification lists against the versioned in-script constants
 * (`NET_C_KEYWORDS_V1`, `COMPLETION_KEYWORDS_V1`, `SWEEP_MARKERS_V1`) — and fail on any drift.
 *
 * **Why a validator, not a test** (owner-directed 2026-07-07): a doc↔code
 * sync check audits file-system contents, which is not a product behaviour a
 * test should describe (`testing-strategy.md`); the conformant home is a
 * repo-validator that recomputes the comparison from both live surfaces
 * (`validators-must-recompute-not-just-record`). List changes are versioned
 * amendments ratified with the packet, never silent edits on either side.
 *
 * @packageDocumentation
 */

const PACKET_REL = '.agent/plans-refounding/g1-freeze-rule-packet.md';
const repoRoot = resolveRepoRoot(import.meta.url);

const CHECKS = [
  {
    label: 'Net-C keyword list (§2)',
    heading: '## 2. Net-C keyword list',
    code: NET_C_KEYWORDS_V1,
  },
  {
    label: 'census completion-keyword list (§2a)',
    heading: '### 2a. Census completion-keyword list',
    code: COMPLETION_KEYWORDS_V1,
  },
  {
    label: 'sweep-net marker set (§6)',
    heading: '## 6. Sweep single-net residue',
    code: SWEEP_MARKERS_V1,
  },
] as const;

/** Every drift line across the ratified-list checks (empty means in sync). */
function collectDrift(markdown: string): readonly string[] {
  const drift: string[] = [];
  for (const check of CHECKS) {
    const packetList = extractBacktickListParagraph(markdown, check.heading);
    if (isErr(packetList)) {
      drift.push(`${check.label}: ${packetList.error.message}`);
      continue;
    }
    drift.push(
      ...compareRatifiedList({ label: check.label, packet: packetList.value, code: check.code }),
    );
  }
  return drift;
}

async function main(): Promise<void> {
  let markdown: string;
  try {
    markdown = await readFile(path.join(repoRoot, PACKET_REL), 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    writeErrorLine(`validate-ratified-lists: cannot read ${PACKET_REL}: ${message}`);
    process.exitCode = 1;
    return;
  }
  const drift = collectDrift(markdown);
  if (drift.length > 0) {
    writeErrorLine(
      'validate-ratified-lists: the G1 packet and the versioned in-script lists have drifted — ' +
        'a list change is an amendment ratified with the packet, never a silent edit:',
    );
    for (const line of drift) {
      writeErrorLine(`  ${line}`);
    }
    process.exitCode = 1;
    return;
  }
  writeLine(
    'validate-ratified-lists: OK (G1 packet §2/§2a/§6 match the versioned in-script lists).',
  );
}

await main();
