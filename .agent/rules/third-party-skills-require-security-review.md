# Third-Party Skills Require Security Review

No third-party skill, skill pack, or plugin enters this estate — by
vendoring, a `pnpx skills` install, or a plugin install —
without a recorded security review of its executable content. A pack
whose payload is pure markdown records that determination; a pack that
ships anything a harness can run records a review of what runs, when,
and with what reach, before anything lands.

## Trigger

Fires at every third-party adoption moment, in any session:

- installing or updating a Vendor skill with the external skills
  machinery (`pnpx skills add`, or any equivalent installer);
- vendoring content into an adapter tier (`.agents/skills/`,
  `.claude/skills/`, or any successor surface);
- installing a pack as a harness plugin (Claude Code, Codex, Cursor, or
  any other), including installs the owner invokes mid-session;
- bumping the pin of an already-vendored source (a whole-repo pin means
  the re-review scopes to the changed executables in the diff).

## Action

1. **Enumerate the executable surface** of the incoming unit first:
   hooks, scripts, install-time code paths, session-start injectors,
   eval runners — anything any harness runs automatically or the pack's
   documentation instructs running. Markdown-only payloads: record the
   zero-executables determination and proceed; that record is the
   review.
2. **Review before landing.** A recorded security review of the
   executable surface must exist BEFORE the install or vendor lands:
   what runs, at which lifecycle moment, with what permissions and
   network reach, and any injection, exfiltration, persistence, or
   supply-chain vector. The review names the source SHA it covered.
3. **No default script execution.** Adoption shapes that auto-run pack
   code (plugin installs with hooks) are acceptable only when the
   review covers the auto-run surface explicitly and the reviewer's
   verdict is safe at the pinned SHA. Prefer adoption shapes that carry
   content without execution (file-level content, no install hooks).
4. **Provenance rides the landing**: source, SHA or content hash, and
   licence recorded beside the review, per PDR-115's naming
   discipline.
5. **Pin bumps re-fire the gate** for whatever executable content
   changed since the reviewed SHA.

## Failure Mode Prevented

The live instance that surfaced the gap (2026-08-02): a popular skills
pack ships seven install-time shell scripts including a session-start
hook that injects content into every Claude Code session; at review
time every security finding filed against it was still open (the oldest
98 days, covering SSRF, cache poisoning, and symlink overwrite in the
hooks) while a 158-line hardening fix sat unmerged for 46 days. A
plugin install would have established a standing, unpinned,
every-session code-execution and prompt-injection channel. Before this
rule, nothing in PDR-051, ADR-125, PDR-115, or the ingestion plan
required anyone to look.

## Worked Instance

The `addyosmani/agent-skills` detailed scan, leg C (2026-08-02), is the
rule's first exercise: adversarial review of all seven hooks, the
script set, and the four plugin manifests, producing a per-executable
account and the verdict — not safe to install as a Claude Code plugin
at the reviewed SHA; file-level vendoring of individual SKILL.md files
safe; the tier-3 eval runner unsafe outside a container. The estate's
prior vendored adoptions (clerk family, mcp-inspector, skill-creator)
are markdown-and-scripts payloads that predate the rule; their reviews
backfill at their next pin bump.

## Enforcement

Behavioural at the adoption moment now; the mechanical check lands with
the WS5(d) external-boundary validator (the validator that refuses
third-party landings in the canonical corpus also checks that an
adopted external carries its review record). Raw material for the
check: trusted-origin allowlist, digest verification, provenance
records, no default script execution.

## Related Surfaces

- [PDR-051 (vendor-agnostic skills standardisation)](../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md)
  — the owned-vs-ingested contract this gate attaches to.
- [PDR-115 (naming openly-licensed external sources)](../practice-core/decision-records/PDR-115-naming-openly-licensed-external-sources.md)
  — provenance and attribution discipline.
- ADR-125 §Skill classes and validation jurisdiction — the boundary
  contract (three classes: Practice / Vendor / User-facing; externals
  never enter the canonical corpus and are never adjudicated by our
  validation). The external-boundary validator that will carry this
  gate's mechanical check lands with that same boundary work.
