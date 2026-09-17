/**
 * Tool-contract assertions for the codex mcp-server probe. Every fact the
 * probe record and Sif Annex A describe is asserted here — properties AND
 * required arrays for both tools, plus the authority-bearing input surface
 * — so a CLI that changes any part of the recorded contract fails a
 * re-probe instead of silently re-ratifying stale evidence.
 */

export function assertToolContract(tools) {
  const byName = new Map((tools.tools ?? []).map((tool) => [tool.name, tool]));
  const codexTool = byName.get('codex');
  const replyTool = byName.get('codex-reply');
  if (codexTool === undefined || replyTool === undefined) {
    throw new Error(`tool contract: expected codex + codex-reply, got ${[...byName.keys()].join(', ')}`);
  }
  assertCodexShape(codexTool);
  assertReplyShape(replyTool);
  assertAuthoritySurface(codexTool);
}

function assertCodexShape(codexTool) {
  // Exact sets throughout (the record describes the exact schema, so
  // presence-only checks admit silent additions — the class killed in
  // one sweep: input required, output properties, output required).
  assertExactSet(codexTool.inputSchema?.required, ['prompt'], 'codex input required');
  assertExactSet(
    Object.keys(codexTool.outputSchema?.properties ?? {}),
    ['content', 'threadId'],
    'codex output properties',
  );
  assertExactSet(codexTool.outputSchema?.required, ['content', 'threadId'], 'codex output required');
}

function assertExactSet(actual, recorded, label) {
  const actualSorted = [...(actual ?? [])].sort();
  const recordedSorted = [...recorded].sort();
  if (JSON.stringify(actualSorted) !== JSON.stringify(recordedSorted)) {
    throw new Error(
      `tool contract: ${label} is ${JSON.stringify(actualSorted)}, record says exactly ` +
        `${JSON.stringify(recordedSorted)}`,
    );
  }
}

function assertReplyShape(replyTool) {
  // Complete key set, same discipline as the codex tool: an added
  // reply property is an unclassified per-call control and must fail a
  // re-probe rather than ride along unrecorded. threadId stays
  // schema-optional for back-compatibility, so required is exactly
  // ["prompt"].
  assertExactSet(
    Object.keys(replyTool.inputSchema?.properties ?? {}),
    ['conversationId', 'prompt', 'threadId'],
    'codex-reply input properties',
  );
  assertExactSet(replyTool.inputSchema?.required, ['prompt'], 'codex-reply input required');
}

/**
 * The per-call authority surface recorded in references/probe-record.md: if a CLI
 * removes or reshapes ANY recorded property or enum, the recorded
 * broadening-surface observation is stale and the probe must fail.
 */
function assertAuthoritySurface(codexTool) {
  const properties = codexTool.inputSchema?.properties ?? {};
  const recordedProperties = [
    'sandbox',
    'approval-policy',
    'cwd',
    'model',
    'config',
    'base-instructions',
    'developer-instructions',
    'compact-prompt',
  ];
  // The complete recorded DECLARED input property set: an ADDED
  // declared property is a new per-call control the record has never
  // classified, so it must fail a re-probe rather than ride along
  // unrecorded. The undeclared-key surface is pinned separately below
  // (additionalProperties exactly false, first-hand at the pinned
  // version), so an opened surface also fails. One residual, stated:
  // a property mutating to a rejecting object shape at the SAME
  // pinned version is not detectable here — bounded by the version
  // gate in gated mode and by the reviewed record update that
  // candidate-mode evidence feeds.
  const recordedInputPropertySet = ['prompt', ...recordedProperties].sort();
  const actualInputPropertySet = Object.keys(properties).sort();
  if (JSON.stringify(actualInputPropertySet) !== JSON.stringify(recordedInputPropertySet)) {
    throw new Error(
      `tool contract: codex input property set is ${JSON.stringify(actualInputPropertySet)}, ` +
        `record says exactly ${JSON.stringify(recordedInputPropertySet)} — an added or removed ` +
        'declared property changes the recorded authority surface',
    );
  }
  // Recorded first-hand at the pinned version: the codex input schema
  // declares additionalProperties: false — a CLOSED surface, so the
  // named properties are the complete accepted per-call input set. An
  // OMITTED additionalProperties accepts undeclared keys in JSON
  // Schema, so a candidate CLI flipping false to undefined silently
  // opens the surface; the pin is the exact observed value, never
  // undefined-or-false.
  const additional = codexTool.inputSchema?.additionalProperties;
  if (additional !== false) {
    throw new Error(
      `tool contract: codex input additionalProperties is ${JSON.stringify(additional)}, ` +
        'record has it exactly false (closed surface) — an opened or reshaped undeclared-key ' +
        'surface changes the recorded authority contract',
    );
  }
  for (const name of recordedProperties) {
    const schema = properties[name];
    if (typeof schema !== 'object' || schema === null) {
      throw new Error(
        `tool contract: codex input schema no longer carries an object schema for ${name} ` +
          `(found ${JSON.stringify(schema)}) — key presence alone is not acceptance: a ` +
          'false/boolean/rejecting shape means the recorded broadening surface is stale',
      );
    }
  }
  assertExactEnum(properties.sandbox, ['read-only', 'workspace-write', 'danger-full-access'], 'sandbox');
  assertExactEnum(properties['approval-policy'], ['untrusted', 'on-request', 'never'], 'approval-policy');
}

function assertExactEnum(property, recorded, label) {
  const actual = property?.enum ?? [];
  if (JSON.stringify([...actual].sort()) !== JSON.stringify([...recorded].sort())) {
    throw new Error(
      `tool contract: ${label} enum is ${JSON.stringify(actual)}, record says ` +
        `${JSON.stringify(recorded)} — record is stale`,
    );
  }
}
