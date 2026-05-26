import { describe, expect, it } from 'vitest';

import {
  listCanonicalRuleFiles,
  loadRulesIndexMarkdown,
} from '../test-helpers/rules-index-classification-fixtures.js';

/**
 * WS0 acceptance test: every canonical rule file under .agent/rules/ MUST
 * appear in RULES_INDEX.md's three-column classification table with a
 * classification value of `always-on` or `trigger-loaded`. Trigger-loaded
 * rows MUST name a non-dash firing-trigger phrase; always-on rows MUST
 * use the em-dash placeholder.
 *
 * IO surfaces are injected via the test-helpers loader; the test stays
 * pure logic over the loaded strings.
 */

interface ClassificationRow {
  readonly rulePath: string;
  readonly classification: string;
  readonly trigger: string;
}

function isParseableRow(ruleCell: string): boolean {
  if (ruleCell === '' || ruleCell === 'Rule') {
    return false;
  }
  return !ruleCell.includes('---');
}

function extractRuleName(ruleCell: string): string | undefined {
  const ruleMatch = /^`([^`]+)`$/.exec(ruleCell);
  return ruleMatch?.[1];
}

function parseTableLine(line: string): ClassificationRow | undefined {
  if (!line.startsWith('|')) {
    return undefined;
  }
  const cells = line.split('|').map((cell) => cell.trim());
  if (cells.length < 5) {
    return undefined;
  }
  const ruleCell = cells[1];
  const classificationCell = cells[2];
  const triggerCell = cells[3];
  if (ruleCell === undefined || classificationCell === undefined || triggerCell === undefined) {
    return undefined;
  }
  if (!isParseableRow(ruleCell)) {
    return undefined;
  }
  const rulePath = extractRuleName(ruleCell);
  if (rulePath === undefined) {
    return undefined;
  }
  return { rulePath, classification: classificationCell, trigger: triggerCell };
}

function parseClassificationTable(indexMarkdown: string): readonly ClassificationRow[] {
  const rows: ClassificationRow[] = [];
  for (const line of indexMarkdown.split('\n')) {
    const row = parseTableLine(line);
    if (row !== undefined) {
      rows.push(row);
    }
  }
  return rows;
}

describe('RULES_INDEX.md classification table', () => {
  it('enumerates every canonical rule file', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);
    const indexedRules = rows.map((row) => row.rulePath).sort((a, b) => a.localeCompare(b));
    const canonicalFiles = await listCanonicalRuleFiles();

    expect(indexedRules).toStrictEqual(canonicalFiles);
  });

  it('classifies every row as always-on or trigger-loaded', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);

    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      expect(row.classification).toMatch(/^(always-on|trigger-loaded)$/);
    }
  });

  it('uses em-dash trigger for always-on rules', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);
    const alwaysOnRows = rows.filter((row) => row.classification === 'always-on');

    expect(alwaysOnRows.length).toBeGreaterThan(0);

    for (const row of alwaysOnRows) {
      expect(row.trigger).toBe('—');
    }
  });

  it('names a non-dash firing trigger for trigger-loaded rules', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);
    const triggerLoadedRows = rows.filter((row) => row.classification === 'trigger-loaded');

    expect(triggerLoadedRows.length).toBeGreaterThan(0);

    for (const row of triggerLoadedRows) {
      expect(row.trigger).not.toBe('—');
      expect(row.trigger.length).toBeGreaterThan(2);
    }
  });

  it('classifies the WS0-extracted comms-watcher rule as trigger-loaded', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);
    const watcherRow = rows.find(
      (row) => row.rulePath === '.agent/rules/comms-all-channels-watcher.md',
    );

    expect(watcherRow).toBeDefined();
    expect(watcherRow?.classification).toBe('trigger-loaded');
  });

  it('classifies the WS0-extracted heartbeat-cron rule as trigger-loaded', async () => {
    const indexMarkdown = await loadRulesIndexMarkdown();
    const rows = parseClassificationTable(indexMarkdown);
    const heartbeatRow = rows.find(
      (row) => row.rulePath === '.agent/rules/liveness-heartbeat-cron.md',
    );

    expect(heartbeatRow).toBeDefined();
    expect(heartbeatRow?.classification).toBe('trigger-loaded');
  });
});
