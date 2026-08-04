#!/usr/bin/env node
// Render the cohesive delivered WHOLES from the built SDK (exact where deterministic,
// {{placeholder}} where a value is runtime-supplied). Faithful, not reconstructed.
// Usage: node render-wholes.mjs <abs-path-to dist/public/mcp-tools.js>   (run from repo root)
import { writeFileSync } from 'node:fs';

const REPO = process.cwd();
const OUT = `${REPO}/.agent/reports/mcp-agent-facing-content-audit/rendered-wholes.md`;
const entry = process.argv[2];

const mcp = await import(entry);
// Break nested triple-backticks with an explicit zero-width-space escape (visible intent,
// no invisible-character copy/paste hazard in the source; PR #337 review).
const fence = (s) => '```text\n' + String(s).replace(/```/g, '`\u200b``') + '\n```';
// Truncate at the last newline before the limit so excerpts never cut mid-word (PR #337 review).
const truncateAtLine = (s, limit) => {
  if (s.length <= limit) return s;
  const cut = s.lastIndexOf('\n', limit);
  const head = s.slice(0, cut > 0 ? cut : limit);
  return `${head}\n…[truncated; full length ${s.length} chars]`;
};
// Render parameter lines from a Zod raw shape ({ name: ZodType }) — what listUniversalTools()
// actually returns (universal-tools/types.ts:137); there is no JSON-Schema .properties on it
// (PR #337 review: the previous .properties path never fired). Defensive: Zod internals vary.
const zodParamLines = (shape) => {
  return Object.entries(shape).map(([name, type]) => {
    let desc;
    let optional = false;
    let inner = type;
    try { desc = type.description; } catch { /* description getter unavailable */ }
    try { optional = typeof type.isOptional === 'function' ? type.isOptional() : false; } catch { /* ignore */ }
    for (let i = 0; i < 4; i += 1) {
      try {
        if (typeof inner.unwrap === 'function') inner = inner.unwrap();
        else break;
        if (!desc) desc = inner.description;
      } catch { break; }
    }
    // Normalise enum options to primitives (PR #337 review): a union-of-literals exposes
    // Zod schema OBJECTS via .options, which would render as "[object Object]" — an exact
    // render must show the literal values or no enum note at all.
    const normaliseOption = (o) => {
      if (o === null || typeof o !== 'object') return o;
      if ('value' in o) return o.value; // ZodLiteral instance
      const dv = o._def?.values ?? o.def?.values; // literal def carries values[]
      if (Array.isArray(dv) && dv.length === 1) return dv[0];
      return undefined; // unrenderable — suppress the enum note rather than emit junk
    };
    let optionValues;
    try {
      const raw = inner.options ?? inner._def?.values;
      if (Array.isArray(raw)) {
        const mapped = raw.map(normaliseOption);
        if (mapped.every((v) => v !== undefined && typeof v !== 'object')) optionValues = mapped;
      }
    } catch { /* ignore */ }
    const enumNote = optionValues ? ` [enum: ${optionValues.join(', ')}]` : '';
    return `  - ${name}${optional ? ' (optional)' : ''}: ${desc ?? '(no description)'}${enumNote}`;
  }).join('\n');
};
const parts = [];
const problems = [];

parts.push(`# Rendered wholes — the content as an agent receives it

Companion to \`report.md\` / \`registry.json\`. Where the registry lists a cohesive delivered surface as separate authored fragments, this file shows the **assembled whole** — rendered directly from the built SDK, so it is **exact** for deterministic content and marked with \`{{placeholder}}\` where a value is supplied at runtime (a user prompt argument, or interpolated curriculum data). Regenerate with \`render-wholes.mjs\`.

Rendered: ${new Date().toISOString().slice(0, 10)} — the render is exact for the SDK build it ran against and goes stale as the SDK moves; this date is the staleness signal.

`);

// 1. SERVER INSTRUCTIONS (exact, delivered once on connection)
try {
  parts.push(`## 1. Server instructions — delivered once at connection\n\nExact. This is the whole string an agent receives in the MCP \`initialize\` response.\n\n${fence(mcp.SERVER_INSTRUCTIONS)}\n`);
} catch (e) { problems.push('SERVER_INSTRUCTIONS: ' + e.message); }

// 2. Server branding / Implementation. The app ships only bundled entry points with boot
// side effects, so this section is a VERBATIM SNAPSHOT of the SSOT, labelled as such
// (PR #337 review) — verify against server-branding.ts when it changes.
parts.push(`## 2. Server identity (Implementation metadata)\n\nVerbatim snapshot — **not machine-rendered**. SSOT: \`apps/oak-curriculum-mcp-streamable-http/src/server-branding.ts\` (\`OAK_SERVER_BRANDING\`); re-verify against it on change.\n\n${fence("title: Oak National Academy\ndescription: Search, explore, download and use Oak's free, fully sequenced and resourced curriculum resources, for KS1 to KS4.\nwebsiteUrl: https://www.thenational.academy\nicons: two themed data:image/svg+xml;base64 acorn variants (light fill #287c34, dark fill #ffffff)")}\n`);

// 3. TOOLS — assembled title + description + params + annotations (exact)
try {
  const tools = mcp.listUniversalTools(mcp.generatedToolRegistry);
  parts.push(`## 3. Tools — assembled definitions (${tools.length})\n\nExact. Each is the full \`title\` + \`description\` (as authored; routing cross-references only) + parameter descriptions + behaviour annotations the agent sees in \`tools/list\`.\n`);
  for (const t of tools) {
    const d = t.definition ?? t;
    const name = d.name ?? t.name ?? '(unknown)';
    const title = d.annotations?.title ?? d.title ?? '';
    const desc = d.description ?? '';
    const ann = d.annotations ? `readOnly=${d.annotations.readOnlyHint} destructive=${d.annotations.destructiveHint} idempotent=${d.annotations.idempotentHint} openWorld=${d.annotations.openWorldHint}` : '(none)';
    // Parameter descriptions. listUniversalTools() exposes inputSchema as a Zod RAW SHAPE
    // ({ name: ZodType }) — never a JSON Schema — so render from the shape; keep the
    // JSON-Schema path only as a fallback for descriptor-shaped inputs.
    let params = '';
    const schema = d.inputSchema ?? d.toolInputJsonSchema ?? d.inputJsonSchema;
    try {
      if (schema?.properties) {
        params = Object.entries(schema.properties).map(([k, v]) => `  - ${k}: ${v?.description ?? '(no description)'}${v?.enum ? ` [enum: ${v.enum.join(', ')}]` : ''}`).join('\n');
      } else if (schema && typeof schema === 'object') {
        params = zodParamLines(typeof schema.shape === 'object' && schema.shape !== null ? schema.shape : schema);
      }
    } catch (e2) { problems.push(`params for ${name}: ${e2.message}`); }
    // Security + app metadata also ship in tools/list (PR #337 review): OAuth scheme/scopes and
    // any MCP Apps widget routing are part of the exact surface an agent/host consumes.
    let security = '(none declared)';
    try {
      const schemes = d.securitySchemes ?? d._meta?.securitySchemes;
      if (Array.isArray(schemes) && schemes.length) {
        security = schemes.map((s) => `${s.type}${Array.isArray(s.scopes) && s.scopes.length ? ` (scopes: ${s.scopes.join(', ')})` : ''}`).join('; ');
      }
    } catch { /* ignore */ }
    let ui = '';
    try {
      if (d._meta?.ui) ui = `\nWidget (_meta.ui): ${d._meta.ui.resourceUri ? `resourceUri=${d._meta.ui.resourceUri}` : ''}${d._meta.ui.visibility ? ` visibility=${JSON.stringify(d._meta.ui.visibility)}` : ''}`;
    } catch { /* ignore */ }
    parts.push(`### \`${name}\`${title ? ` — ${title}` : ''}\n\n${fence(desc)}\n\nParameters:\n${params || '  (none)'}\n\nAnnotations: ${ann}\nSecurity: ${security}${ui}\n`);
  }
} catch (e) { problems.push('TOOLS: ' + e.message + '\n' + (e.stack || '')); }

// 4. PROMPTS — rendered messages with placeholder args (representative)
try {
  const prompts = mcp.MCP_PROMPTS ?? [];
  parts.push(`## 4. Prompts — assembled workflow messages (${prompts.length})\n\nRendered with \`{{arg}}\` placeholders where the user supplies a value. This is the message injected into the conversation when the prompt fires.\n`);
  for (const p of prompts) {
    const args = {};
    for (const a of (p.arguments ?? [])) args[a.name] = `{{${a.name}}}`;
    let rendered = '';
    try {
      const msgs = mcp.getPromptMessages(p.name, args);
      rendered = (Array.isArray(msgs) ? msgs : msgs?.messages ?? []).map((m) => {
        const c = m.content;
        const text = typeof c === 'string' ? c : (c?.text ?? JSON.stringify(c));
        return `[${m.role}] ${text}`;
      }).join('\n\n');
    } catch (e2) { rendered = '(could not render: ' + e2.message + ')'; problems.push(`prompt ${p.name}: ${e2.message}`); }
    const argList = (p.arguments ?? []).map((a) => `${a.name}${a.required ? '*' : ''}`).join(', ') || '(none)';
    parts.push(`### \`${p.name}\`\n\n${p.description ?? ''}\n\nArguments: ${argList}\n\n${fence(rendered)}\n`);
  }
} catch (e) { problems.push('PROMPTS: ' + e.message); }

// 5. Getting-started doc resource (exact)
try {
  parts.push(`## 5. Resource — \`docs://oak/getting-started\` (getting-started markdown)\n\nExact.\n\n${fence(mcp.getGettingStartedMarkdown())}\n`);
} catch (e) { problems.push('getGettingStartedMarkdown: ' + e.message); }

// 6. EEF interpretation resource (exact assembled markdown; corpus values are third-party)
try {
  const eef = mcp.getEefInterpretationMarkdown();
  parts.push(`## 6. Resource — \`eef://interpretation\` (assembled)\n\nExact assembled markdown, rendered IN FULL (PR #337 review: an "exact" surface must not be truncated). The interpolated corpus values (strand text, caveats, named authors) are external EEF content; the scaffold + agent-reasoning layer are Oak-authored.\n\n${fence(eef)}\n`);
} catch (e) { problems.push('getEefInterpretationMarkdown: ' + e.message); }

// 7. Curriculum-model resource (structural representative — large, part authored + API-derived slugs)
try {
  const cm = mcp.getCurriculumModelJson();
  const s = typeof cm === 'string' ? cm : JSON.stringify(cm, null, 2);
  const top = typeof cm === 'string' ? '(string)' : Object.keys(cm).join(', ');
  parts.push(`## 7. Resource/tool — \`curriculum://model\` / \`get-curriculum-model\` (representative)\n\nThe orientation payload delivered by the priority-1.0 resource and the \`get-curriculum-model\` tool. Large (${s.length} chars). Top-level keys: \`${top}\`. First ~3000 chars shown (line-boundary truncation); the whole is repo-authored domain model + tool guidance (subject/key-stage slug lists are OpenAPI-derived, display metadata authored).\n\n${fence(truncateAtLine(s, 3000))}\n`);
} catch (e) { problems.push('getCurriculumModelJson: ' + e.message); }

if (problems.length) parts.push(`## Render notes\n\nItems that could not be rendered exactly (fell back to source or omitted):\n\n${problems.map((p) => '- ' + p.split('\n')[0]).join('\n')}\n`);

writeFileSync(OUT, parts.join('\n'));
console.log('wrote rendered-wholes.md —', parts.join('\n').length, 'chars');
console.log('problems:', problems.length);
if (problems.length) {
  console.log(problems.map((p) => p.split('\n')[0]).join('\n'));
  // A partial render must FAIL the invoking pipeline (PR #337 review): a future regeneration
  // that silently drops a surface would otherwise pass gates green while the artefact degrades.
  process.exitCode = 1;
}
