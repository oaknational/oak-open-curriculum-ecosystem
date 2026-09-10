# Oak Components runtime and package experiment

## Question

Can the current Oak Components root contract provide independently consumable
foundations, React UI and product recipes, or does runtime coupling support
testing the layers proposed in [H002](../hypotheses/H002-layered-ui-platform.md)?

This is a package experiment, not a production performance audit.

## Inputs and constraints

**Observed:** The source inspection is pinned to Oak Components
[`8ff8264fa921e4e40fdaf9a99b02fd156c699cc8`](https://github.com/oaknational/oak-components/tree/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8).
That revision declares version 3.0.0, one `main`, one `module` and one `types`
entry ([package](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L1-L14)).
Its build has one source entry and emits one ESM bundle, one CJS bundle and one
declaration bundle
([build configuration](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L12-L43)).

**Observed:** Runtime measurements use OWA's locally installed 2.45.0 artifact.
OWA requests `^2.45.0`
([manifest](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/package.json#L99-L101))
and its lockfile resolves 2.45.0 with a recorded integrity hash and five peers
([lockfile](https://github.com/oaknational/Oak-Web-Application/blob/510ac63a62fb37a70183b00ce0f5fb15be4491e5/pnpm-lock.yaml#L3114-L3122)).

**Observed:** All probes ran locally on Node 24.16.0 using the already installed
Rollup 4.60.1, Terser, Next 15.5.15, React 18.3.1 and OWA dependency graph. No
dependency was installed and neither source repository was changed. The
original probe used temporary Next fixtures. Equivalent fixtures and the
measurement code were subsequently retained in the historical
[runtime-probe harness](../../evidence-harness-provenance.md#oak-components-runtime-probes);
only their build output was temporary.

**Unknown:** Version 3.0.0 has no checked-in `dist` artifact at the pinned
revision, so its emitted byte sizes and runtime behavior were not measured.
The source package still has the same single-entry build shape as 2.45.0, but
equivalent behavior is an inference until its published artifact is tested.

## Historical reproduction method

With the pinned OWA and Components dependencies already installed, the first
retired probe measured artifact compression, runtime-name counts, isolated
Rollup/Terser results and Node compatibility. The second built five then-retained
Next fixtures. Both emitted normalized JSON and recorded source revisions,
package/tool versions and initial source-worktree status. The immutable
[runtime-probe provenance](../../evidence-harness-provenance.md#oak-components-runtime-probes)
retains the exact implementation.

## Method

### Artifact and runtime surface

The installed metadata and output were inspected with:

```sh
node -p "require('./node_modules/@oaknational/oak-components/package.json')"
find -L node_modules/@oaknational/oak-components/dist -type f -maxdepth 2 -print
wc -c node_modules/@oaknational/oak-components/dist/{esm,cjs}/index.js
node -e "console.log(Object.keys(require('@oaknational/oak-components')).length)"
```

Gzip and Brotli values were produced from the exact files with Node's
`zlib.gzipSync` and `zlib.brotliCompressSync`, using defaults.

### Named-import tree shaking

A virtual Rollup entry re-exported one named symbol from the installed ESM
artifact. All bare imports were external, `moduleSideEffects` was set to
`false`, output was compact ESM, and Terser was applied. This deliberately gives
the root artifact a favorable isolated tree-shaking test. The same probe was
repeated for the full namespace.

Conceptually, each entry was:

```js
export { OakBox as value } from "/absolute/path/to/dist/esm/index.js";
```

The recorded values are generated package code plus external import statements.
They exclude the code of React, styled-components, Next and other external
peers. They are not client bundle sizes.

### Node and Next compatibility

Node probes exercised `require()` and ESM imports of the package root and direct
artifacts. Minimal Next App Router fixtures then built these pages:

```jsx
// Client Component probe
"use client";
import { OakBox } from "@oaknational/oak-components";
export default function Page() {
  return <OakBox>client</OakBox>;
}
```

```jsx
// Server Component probes, run separately with OakBox and oakColorTokens
import { oakColorTokens } from "@oaknational/oak-components";
export default function Page() {
  return <main>{oakColorTokens.black}</main>;
}
```

Each fixture used a symlink to OWA's existing `node_modules` and ran:

```sh
NEXT_TELEMETRY_DISABLED=1 next build
```

A package-free page provided the Next build baseline. A second Client Component
rendered `OakLessonBottomNav` to sample a product-level recipe.

## Results

### Published artifact

**Observed:** Version 2.45.0 has five distribution files: ESM, CJS and declaration
files plus two source maps. Its package metadata has neither an `exports` field
nor a `sideEffects` field. All 241 runtime names are available through the root.

| Artifact     | Raw bytes | Gzip bytes | Brotli bytes |
| ------------ | --------: | ---------: | -----------: |
| ESM root     |   564,690 |    161,731 |      129,978 |
| CJS root     |   579,429 |    162,938 |      130,298 |
| Declarations |   209,574 |     42,695 |       34,102 |

**Observed:** Both JavaScript artifacts leave exactly these imports or requires
external: `react`, `styled-components`, `next/image`, `react-dom`, `next/link`
and `next-cloudinary`. The pinned 3.0.0 build likewise declares React, Next,
next-cloudinary and styled-components as peers
([package](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/package.json#L34-L40))
and applies peer externalization during the build
([configuration](https://github.com/oaknational/oak-components/blob/8ff8264fa921e4e40fdaf9a99b02fd156c699cc8/rollup.config.js#L29-L37)).

**Inferred:** Peer externalization prevents those libraries being copied into
the published Oak artifact. It does not remove them from a consumer's runtime
graph; the consumer still has to resolve and, where applicable, deliver them.

### Isolated named imports

| Named export            | Working layer   | Raw bytes | Gzip bytes | External imports retained                       |
| ----------------------- | --------------- | --------: | ---------: | ----------------------------------------------- |
| `oakColorTokens`        | foundation data |   322,886 |     93,852 | React, styled-components, Next image, React DOM |
| `OakBox`                | primitive       |   322,887 |     93,852 | React, styled-components, Next image, React DOM |
| `OakPrimaryButton`      | control         |   322,887 |     93,852 | React, styled-components, Next image, React DOM |
| `OakPupilJourneyLayout` | product recipe  |   323,807 |     94,052 | React, styled-components, Next image, React DOM |
| `OakDownloadCard`       | product recipe  |   326,057 |     94,682 | React, styled-components, Next image, React DOM |
| `OakLessonBottomNav`    | product recipe  |   327,685 |     95,504 | React, styled-components, Next image, React DOM |
| `OakLessonLayout`       | product recipe  |   330,329 |     95,772 | React, styled-components, Next image, React DOM |
| `OakQuizMatch`          | product recipe  |   331,728 |     96,564 | React, styled-components, Next image, React DOM |
| `OakCookieConsent`      | product recipe  |   335,387 |     97,361 | React, styled-components, Next image, React DOM |
| all exports             | root namespace  |   563,900 |    161,444 | all six published externals                     |

**Observed:** Named ESM imports are partially tree-shaken: `OakBox` retains about
58% of the full namespace's gzip bytes in this isolated probe. However, a token,
a primitive and a primary button all retain the same approximately 94 KB gzip
floor and the same four framework/runtime imports. Sample recipes add roughly
0.2-3.5 KB gzip above that floor. `OakPrimaryNav`, tested separately, also
retained `next/link`.

**Inferred:** The result is consistent with one bundled module containing many
eager top-level styled-component constructions and a strongly shared base
graph. It weakens the proposition that the current root already behaves like
independent foundation, React and framework layers. It does not show that
separate npm packages are necessary.

### CJS, ESM and RSC behavior

**Observed:** `require("@oaknational/oak-components")` succeeds and returns 241
runtime names. Default and named ESM imports of the package root also succeed in
Node 24, but resolve through the package's CJS `main`. Requiring the explicit CJS
file succeeds.

**Observed:** Direct native import of `dist/esm/index.js` did not complete. Node
parsed the file, then failed to resolve its `next/image` specifier. The ESM file
worked as bundler input in Rollup and Next. With no conditional `exports` map,
the package therefore has a working Node CJS route and a bundler-oriented
`module` field, but no verified native-Node ESM route.

**Observed:** The package-free Next fixture built with a Next-reported route size
of 127 B and first-load graph of 102 kB. A Client Component rendering `OakBox`
built successfully: the original temporary fixture reported 149 kB for the route
and 251 kB first load, while two runs of the then-retained fixture reported the same
251 kB first load and a rounded 150 kB route. The `OakLessonBottomNav` Client
Component built with both fixture forms, reporting 151 kB and 253 kB
respectively. The unexplained 1 kB reporting variation is another reason not to
treat these synthetic Next summaries as precise package-size measurements.

**Observed:** A Server Component importing and rendering `OakBox` compiled, then
failed while Next collected page data: `createContext is not a function`. A
separate Server Component that imported only `oakColorTokens` failed at the same
stage with the same cause. The pinned 3.0.0 source contains no `use client`
directive, while a source-name scan found 62 files containing common React hook
names.

**Inferred:** The root entry is a Client Component dependency in this tested App
Router environment, even when the requested value is static token data. A
consumer must supply the client boundary; the artifact does not declare it.

The Next numbers describe complete synthetic route graphs, including resolved
peers and framework chunks. They must not be read as Oak Components' production
client payload or subtracted from OWA without a production build and chunk-ownership
analysis.

## Failed or blocked measurements

- **Unknown:** Production OWA chunk ownership, caching, deduplication and route
  delivery were not measured. Building OWA would introduce environment and
  application configuration beyond this package experiment.
- **Unknown:** Browser hydration, runtime accessibility and interaction behavior
  were not exercised; the Next probes stop at production build and static data
  collection.
- **Unknown:** Pages Router behavior was not sampled.
- **Unknown:** The 3.0.0 output was not built because `dist` is absent and this
  experiment was constrained not to modify the Components repository.
- **Unknown:** Non-OWA consumer requirements and whether every credible consumer
  is already a Next Client Component remain unmeasured.
- **Observed failure:** Direct native-Node ESM loading failed on `next/image`.
  This says nothing about bundler compatibility, which succeeded.
- **Observed failure:** Both sampled Server Component root imports failed during
  page-data collection. This does not prove that every export is intrinsically
  client-only; it demonstrates that the root artifact makes the distinction
  unavailable to the tested consumer.

## Invalidators

This experiment would stop supporting, or materially narrow, H002 if a
multi-entry prototype shows any of the following:

1. a tokens-only entry still requires React, styled-components, Next or browser
   globals because the token contract is intrinsically runtime-dependent;
2. primitive and adapter entries retain essentially the same isolated graph and
   Server Component failures after the barrel and build boundaries are removed;
3. real consumers require the complete root graph on the same routes, so smaller
   contracts add ownership and versioning machinery without changing delivery,
   testing or server/client clarity;
4. production chunk analysis shows current deduplication already gives every
   relevant route the intended dependency boundary, and the package API is not
   causing incorrect server/client use;
5. keeping recipes with capability owners causes more duplicated accessibility
   behavior and coordinated releases than the present central ownership.

Conversely, artifact size alone cannot validate H002. The hypothesis also needs
evidence about ownership, accessibility reuse, release coupling and real
consumer behavior.

## Implication for H002

**Observed result:** The current 2.45.0 root is only partly tree-shakeable, cannot
provide tokens without framework/runtime imports in the isolated probe, and
does not compile through a Server Component use of either `OakBox` or token data.

**Hypothesis update:** This supports continuing H002 at `testing`, specifically
as an export and dependency-contract experiment. It does not yet support
multiple independently versioned packages.

The most direct next discriminating build is one release unit with explicit
entries such as `./tokens`, `./react`, `./next`, `./recipes/*` and `./test`, plus
an `exports` map, deliberate side-effect metadata and client-boundary markers.
The prototype should be rejected unless it can demonstrate all of:

1. `./tokens` has no React, Next, styled-components or browser dependency and
   succeeds in the sampled Server Component;
2. a primitive import has a materially smaller isolated graph than the current
   approximately 94 KB gzip floor;
3. framework adapters and product recipes add explicit, explainable peers;
4. existing OWA imports can migrate mechanically without losing type,
   accessibility or interaction contracts;
5. the measured improvement remains visible in representative consumer builds,
   not only in the package artifact.
