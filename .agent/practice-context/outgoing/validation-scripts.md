# Practice Validation Scripts

> **Origin**: oak-mcp-ecosystem, 2026-03-19
> **Status**: Reference implementations for the validation checks described in
> `practice-lineage.md` §Validation

These bash scripts implement the six validation checks from the lineage
document. They are rough reference implementations — adapt paths to your
platform adapter directories.

## Reference Check

Finds broken file references in agent and adapter directories. Does not handle
relative paths from the referencing file's location, `@`-prefixed Cursor
references, or paths inside code blocks.

```bash
# Adapt .cursor/ to your platform adapter directories (.claude/, .agents/, .codex/, etc.)
rg -o '\./[^\s\)]+\.md' .agent/ .cursor/ --no-filename | sort -u | while read ref; do
  path="${ref#./}"
  if [ ! -f "$path" ]; then
    echo "BROKEN: $ref"
  fi
done
```

## Self-Containment Check

Verifies Practice Core files have no external navigable links except the
permitted bridge to `../practice-index.md`. Strips code-fenced blocks first
to avoid false positives from templates.

````bash
for f in .agent/practice-core/*.md; do
  awk '/^```/{skip=!skip; next} !skip{print}' "$f" \
    | rg -n '\]\(\.\.\/' \
    | rg -v 'practice-index\.md' \
    && echo "VIOLATION: $f has external links outside code fences"
done
````

## Agent Dependency Check

Verifies that every file reference in agent adapter wrappers resolves.

```bash
# Adapt .cursor/agents/ to your platform's agent adapter directory
for agent in .cursor/agents/*.md; do
  rg 'read.*\.agent/' "$agent" --no-filename | while read line; do
    ref=$(echo "$line" | rg -o '`[^`]+`' | tr -d '`')
    if [ -n "$ref" ] && [ ! -f "$ref" ]; then
      echo "BROKEN AGENT: $(basename $agent) references $ref"
    fi
  done
done
```

## Integration Into Quality Gates

A proper implementation would integrate these checks into the quality gate
sequence (e.g., as a `pnpm validate:practice` script). The oak-mcp-ecosystem
repo uses `scripts/validate-portability.mjs` for portability validation, which
covers a subset of these checks.

## See Also

- `three-dimension-fitness-functions.md` — the three-dimension fitness
  function innovation (lines + chars + prose width) with adoption guide
- `validate-practice-fitness.ts` — TypeScript mirror of the live
  zero-dependency validator (`scripts/validate-practice-fitness.mjs`)
