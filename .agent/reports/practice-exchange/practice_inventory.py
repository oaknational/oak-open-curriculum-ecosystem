#!/usr/bin/env python3
"""The Practice inventory (the finish node's end state 3, now mechanism 3 of
practice-parity-for-extraction): one row per artefact of the Practice in either estate's default
tip, with its kind, its PDR-143 scope class by directory default (hand overrides by name where
§2's membership test says otherwise), and whether the two estates' copies are the same bytes.
Generated from the two trees' blob ids; no file content is read.

usage: practice_inventory.py <jc-root> <jc-ref> <oce-root> <oce-ref> <out-file>
The report names the estates JC.net and OCE and carries no machine-local path.
"""
import re
import subprocess
import sys
from collections import Counter

jc, jcref, oce, oceref, out = sys.argv[1:6]

# (prefix, kind, default scope). First match wins; order matters.
KINDS = [
    (".agent/practice-index.md", "bridge index", "Repo-local, authored"),
    (".agent/directives/", "directive", "Practice-wide"),
    (".agent/rules/", "rule", "Practice-wide"),
    (".agent/skills/", "skill", "Practice-wide"),
    (".agent/practice-core/decision-records/", "decision record", "Practice-wide"),
    (".agent/practice-core/schemas/", "schema", "Practice-wide"),
    (".agent/practice-core/provenance.yml", "adoption record", "Repo-local, authored"),
    (".agent/practice-core/", "Practice Core file", "Practice-wide"),
    (".agent/sub-agents/templates/", "reviewer template", "Practice-wide"),
    (".agent/sub-agents/components/", "reviewer component", "Practice-wide"),
    (".agent/sub-agents/", "reviewer index", "Practice-wide"),
    (".agent/hooks/", "hook policy", "Practice-wide"),
    ("agent-tools/smoke-tests/", "tooling smoke test", "Language-wide (TypeScript)"),
    ("agent-tools/src/", "tooling", "Language-wide (TypeScript)"),
    (".claude/", "platform adapter (Claude)", "Repo-local, rendered"),
    (".cursor/", "platform adapter (Cursor)", "Repo-local, rendered"),
    (".codex/", "platform adapter (Codex)", "Repo-local, rendered"),
    (".gemini/", "platform adapter (Gemini)", "Repo-local, rendered"),
]
ADAPTER_SUBDIRS = ("rules/", "skills/", "agents/")

# Hand overrides by name under PDR-143 §2: an artefact that names one host, its people, its
# product or its platform set is repo-local, authored, whichever directory holds it.
HOST_PATTERNS = re.compile(
    r"(^|/)(invoke-architecture-expert-(fred|wilma|betty|barney)|jc-[^/]*|oak[^/]*|mcp-[^/]*|"
    r"curriculum[^/]*|under-the-hood[^/]*|lesson-[^/]*|posthog[^/]*|clerk[^/]*|pkg-expert[^/]*|"
    r"design-system-expert[^/]*|react-component-expert[^/]*|editor[^/]*|accessibility-expert[^/]*)"
    r"(\.|/|$)"
)
# Reviewed overrides by path for artefacts whose names are neutral but whose contents bind one
# host's product (read by hand on 2026-10-02: Oak's semantic search, bulk downloads and upstream
# API). The membership test applied to contents across the whole tree is mechanism 3 of
# practice-parity-for-extraction; this list is the reviewed subset until that rerun.
HOST_BOUND_PATHS = (
    ".agent/skills/ground-truth-design/",
    ".agent/skills/ground-truth-evaluation/",
    ".agent/skills/update-bulk-download-schema/",
    ".agent/skills/update-upstream-api-spec/",
)


def tree(root: str, ref: str) -> dict[str, str]:
    outp = subprocess.run(
        ["git", "-C", root, "ls-tree", "-r", ref], capture_output=True, text=True, check=True,
    ).stdout
    blobs: dict[str, str] = {}
    for line in outp.splitlines():
        meta, path = line.split("\t", 1)
        blobs[path] = meta.split()[2]
    return blobs


def host_bound(path: str) -> bool:
    return bool(HOST_PATTERNS.search(path)) or path.startswith(HOST_BOUND_PATHS)


def classify(path: str):
    for prefix, kind, scope in KINDS:
        if path.startswith(prefix):
            if kind.startswith("platform adapter"):
                rest = path[len(prefix):]
                if not rest.startswith(ADAPTER_SUBDIRS):
                    return None
            if kind == "skill" and ("/evals/" in path or "/fixtures/" in path or "/eval/" in path):
                kind = "skill evals and fixtures"
            if host_bound(path) and scope == "Practice-wide":
                return kind, "Repo-local, authored (host name, §2)"
            if host_bound(path) and scope.startswith("Language-wide"):
                return kind, "Repo-local, host (product tooling, §2)"
            return kind, scope
    return None


def head(root: str, ref: str) -> str:
    return subprocess.run(
        ["git", "-C", root, "rev-parse", "--short=9", ref], capture_output=True, text=True, check=True,
    ).stdout.strip()


jchead, ocehead = head(jc, jcref), head(oce, oceref)
a = tree(jc, jcref)
b = tree(oce, oceref)
rows = []
for path in sorted(set(a) | set(b)):
    c = classify(path)
    if c is None:
        continue
    kind, scope = c
    if path in a and path in b:
        same = "same bytes" if a[path] == b[path] else "different bytes"
    elif path in a:
        same = "JC.net only"
    else:
        same = "OCE only"
    rows.append((path, kind, scope, same))

by_kind = Counter((k, s) for _, k, _, s in rows)
by_scope = Counter((sc, s) for _, _, sc, s in rows)
kinds = sorted({k for _, k, _, _ in rows})
scopes = sorted({sc for _, _, sc, _ in rows})
SAME = ["same bytes", "different bytes", "JC.net only", "OCE only"]

lines = []
lines.append("# The Practice inventory, 2026-10-02")
lines.append("")
lines.append(
    "One row per artefact of the Practice present in either estate's default tip, generated from "
    "the two trees' blob ids by `practice_inventory.py` beside this report (run as `python3 "
    "practice_inventory.py <jc-root> <jc-ref> <oce-root> <oce-ref> <out>` against the two checkouts "
    "at the two tips named below; the register is then closed against the output by "
    "`register_close.py <register> <inventory> <closure>` and the closure spliced in above the rows "
    "by `assemble_report.py <inventory> <closure> <out>`, both beside this report): kind by "
    "directory; scope class under PDR-143 §1 by directory "
    "default, with hand overrides by name where §2's membership test says an artefact names one "
    "host (its people, its product, its platform set); sameness by blob id. Heads: JC.net main "
    f"SHA:{jchead}, OCE engraph SHA:{ocehead}. Rows: {len(rows)}. This report is the input the "
    "extraction plan takes (the finish node's end state 3, carried since 2026-10-02 by "
    "`practice-parity-for-extraction`, whose mechanism 3 reruns it over the whole Practice at the "
    "folded tips); the exchange register closes against it."
)
lines.append("")
lines.append(
    "The scope classes are PDR-143's (the Practice as a standalone entity; Proposed, recorded on "
    "2026-10-02 on the coordination branch of each estate, so neither default tip holds it until "
    "the day's fold lands; its text is restated here so this report stands on its own). §1, the "
    "scopes in the owner's words: Practice-wide (principles, rules, skills, decision records, "
    "reviewer templates, hook policy, the schemas of every state and memory surface, the learning "
    "protocol, the tooling's contracts, the set of platforms the entity renders adapters for); "
    "Language-wide, today TypeScript (the binding of each Practice-wide contract to one ecosystem: "
    "gate names, test conventions, the tooling's implementation); Repo-local, the installed "
    "Practice, authored (the bridge index, the bindings the host chooses, the adoption record and "
    "its omissions, repo-local extensions); Repo-local, the installed Practice, rendered (the "
    "canonical content and the platform adapters rendered from the pinned revision and committed); "
    "Repo-local, the installed Practice, instances (every state and memory instance); Repo-local, "
    "the host (product code, content, product decision records, product docs and tests, the gates "
    "the host exposes); Machine-local (the operator profile). §2, the membership tests: PDR-079's "
    "migration test, could this record land unchanged in another repository adopting the same "
    "practice, read for every artefact kind; and for tooling the engineering principles' framework "
    "test, could another consumer use this component unchanged; an artefact that passes neither "
    "cleanly is decomposed at the tension before it is placed, and a compromise label names "
    "coupling, not a home. The hand overrides by name in this generator are the §2 tests applied "
    "to artefacts that name one host; the instances and machine-local scopes hold no inventoried "
    "artefact, since memory and the home directory are outside the directories below."
)
lines.append("")
lines.append(
    "Reading the sameness column: a platform adapter is rendered from the canonical content with "
    "the host's prefix, so adapters differ or stand one-sided by design and say nothing about the "
    "canonical; a skill's evals and fixtures are counted as their own kind because one estate holds "
    "the eval runner and the other does not; tooling differs by topic, and a topic one estate alone "
    "holds is either a capability to carry (Language-wide) or product tooling (Repo-local, host). "
    "The hand overrides by name are the regular expression in the generator, and four OCE skills "
    "whose names are neutral but whose contents bind Oak's product (ground-truth-design, "
    "ground-truth-evaluation, update-bulk-download-schema, update-upstream-api-spec) are placed by "
    "the generator's reviewed path list; a row whose scope reads with a §2 note was placed by one "
    "of those, every other row by its directory. The bridge index `.agent/practice-index.md` is "
    "the one root-level Practice surface inventoried; the other entry points and the Practice "
    "directories outside the prefix list are the rerun's."
)
lines.append("")
lines.append("## Counts by kind")
lines.append("")
lines.append("| Kind | same bytes | different bytes | JC.net only | OCE only | total |")
lines.append("| --- | --- | --- | --- | --- | --- |")
for k in kinds:
    cs = [by_kind[(k, s)] for s in SAME]
    lines.append(f"| {k} | {cs[0]} | {cs[1]} | {cs[2]} | {cs[3]} | {sum(cs)} |")
tot = [sum(by_kind[(k, s)] for k in kinds) for s in SAME]
lines.append(f"| all | {tot[0]} | {tot[1]} | {tot[2]} | {tot[3]} | {sum(tot)} |")
lines.append("")
lines.append("## Counts by scope class")
lines.append("")
lines.append("| Scope (PDR-143 §1) | same bytes | different bytes | JC.net only | OCE only | total |")
lines.append("| --- | --- | --- | --- | --- | --- |")
for sc in scopes:
    cs = [by_scope[(sc, s)] for s in SAME]
    lines.append(f"| {sc} | {cs[0]} | {cs[1]} | {cs[2]} | {cs[3]} | {sum(cs)} |")
lines.append("")
lines.append("## Rows")
lines.append("")
lines.append("| Path | Kind | Scope | Sameness |")
lines.append("| --- | --- | --- | --- |")
for path, kind, scope, same in rows:
    lines.append(f"| `{path}` | {kind} | {scope} | {same} |")
lines.append("")
with open(out, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))
print(f"rows {len(rows)}; same {tot[0]}, different {tot[1]}, JC.net only {tot[2]}, OCE only {tot[3]}")
