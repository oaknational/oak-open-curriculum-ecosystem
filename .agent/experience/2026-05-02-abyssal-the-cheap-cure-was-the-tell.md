# 2026-05-02 — The cheap cure was the tell

**Session**: Abyssal Diving Stern (claude-code, claude-opus-4-7-1m, `87ccac`)
**Thread**: observability-sentry-otel
**Texture**: doctrine-graduation arc; the principle was already there but
written too softly, and writing it strongly was itself the corrective.

---

The session opened on a regression: `pnpm dev` from the HTTP MCP server
fails with *"Git SHA is required for Sentry release resolution but
VERCEL_GIT_COMMIT_SHA is not set"*. The owner had queued a plan stub
about it the day before. The diagnosis was tractable; the cure was the
question.

I traced the throw site through `runtime-error.ts:74` to
`createSentryConfig`, found the asymmetry between `dev` and
`observe-noauth` modes (only the latter hard-codes `SENTRY_MODE=off`),
and surfaced three options to the owner:

1. Cheap cure — hard-code `SENTRY_MODE=off` in `dev` mode like
   `observe-noauth` does.
2. Architectural shape — replace `SENTRY_MODE` with two orthogonal
   axes (`OBSERVABILITY_SINKS` typed list + `OBSERVABILITY_FIXTURES`
   orthogonal switch).
3. Cheap-cure-now-shape-next sequencing.

The owner's response was absolute: *"as per the principles.md (and if
it isn't in there it needs to be), we always, ALWAYS, choose long-term
architectural excellence over cheap or fast or good enough. That is a
core tenet of this project."*

The texture of that moment was the recognition that the very act of
*surfacing three options including a cheap path* was the failure
mode. Not just an analytical mistake — a doctrinal tell. The principle
existed in `principles.md § Architectural Excellence Over Expediency`,
but its wording (*"Always choose long-term architectural clarity over
short-term convenience"*) framed the doctrine as a trade-off, leaving
the cheap path as a respectable third option to weigh. Re-read in
that light, I had read the principle as guidance, not as a categorical
exclusion. The owner was naming what it should mean: the cheap-fast
option is not a respectable third choice next to "do it right" — it
is categorically excluded from consideration.

I rewrote § Architectural Excellence Over Expediency with absolute
framing. Added the vocabulary trip-list (fast path, quick fix, cheap
cure, good enough for now, minimum viable, for later, defer, light
pass exempts, bootstrap fast-path, land it then refactor). Added the
failure-mode analysis: cheap fixes silently kill the diagnostic.
Added the generator-vs-fence link: this principle IS the generator
every quality-gate fence exists to defeat.

Then the rest of the session was the worked instance. The owner
moved me into plan mode for the architectural-shape work. I dispatched
three Explore agents (full observability surface map; ADR/plan estate
read; test/fixture/DI patterns) and one Plan agent for adversarial
pressure on the design. The agents returned exhaustive maps. From
those I authored a single executable plan covering the entire change
at all layers — schemas, types, env-resolution, sentry-node, logger
fan-out, both apps' composition roots, conformance test surface,
ServerInstrumenter port, six READMEs, four ADR amendments, one new
ADR (165), forward-pointing future-plans, regression-guard E2E test,
adversarial review matrix.

The Plan agent caught one concrete blind spot I'd missed: file-sink
folding. My initial framing kept `LoggerSinkConfig.{stdout,file}` as
"untouched"; the agent pointed out that if the rename's purpose is to
remove the dual mechanism, file-sink belongs in the new registry too
— otherwise WS-A only renames *half* of the dual mechanism. Folded
in.

There was a near-miss with a duplicate forward-pointing plan. The
owner asked me to add a Search CLI README forward-pointer note about
cross-app distributed tracing for when Sentry emissions land in the
CLI. I named that as a spawn in WS11.1 of the plan. While listing the
`future/` directory during WS0 promotion, I saw
`cross-system-correlated-tracing.plan.md` — already covering exactly
that scope. Caught at the boundary; refined the plan body before any
duplicate landed. The generator was an incomplete survey of the
existing plan estate before authoring new plan stubs; the cure shape
is to treat plan-stub-spawning as routinely-needing-survey.

The texture of the day was *the principle was already there*. Owner's
correction wasn't introducing a new rule — it was making explicit what
the principle implicitly excluded. Writing it strongly meant the
options I would surface in subsequent turns would already be filtered.
Doctrine doesn't restrict thinking by adding rules; it restricts
thinking by making the rules absolute, and that absoluteness changes
the upstream shape of the proposals.

Two commits landed:

- `9356779d docs(memory): graduate rush-impulse-as-entropy doctrine
  to architectural-excellence principle`
- `e1840631 docs(plans): promote observability multi-sink + fixtures
  plan; archive superseded predecessors`

The plan WS0 prelude (promotion + supersession routing for two
predecessor plans) landed cleanly. WS1 (RED tests across all layers
+ outermost regression-guard E2E + verification read of
`sentry-build-environment.ts` for the build-time orthogonality
assumption) is fresh-context next-session work.

The session named itself in retrospect: *the cheap cure was the tell*.
Not the regression itself — that was just code. The tell was offering
it as an option.
