/**
 * Pure checks behind scripts/validate-boundaries.ts.
 *
 * Two check families, both returning failure strings (empty array = green)
 * so the script can report every problem in one run and exit non-zero once:
 *
 * - diffInventory: the declared-vs-live workspace comparison the flat tiers
 *   (libs, apps, sdks, design, tooling) already rely on.
 * - checkIdentityPackTier: the identity-pack tier (packages/design/identities)
 *   has no hand-declared inventory BY DESIGN — the identity-№N property
 *   requires that adding a pack needs zero framework-code edits, so a
 *   declared tuple here would itself violate the property the tier exists to
 *   prove. The tier is validated structurally instead: the directory must
 *   exist (a rename must fail loud, never silently shrink the checked
 *   surface — the tier is invisible to the package.json-keyed scans above),
 *   and every child must be a pack-shaped, data-only, private workspace.
 */

export function diffInventory(
  label: string,
  declared: readonly string[],
  actual: readonly string[],
): readonly string[] {
  const declaredSorted = [...declared].sort((a, b) => a.localeCompare(b));
  const actualSorted = [...actual].sort((a, b) => a.localeCompare(b));

  if (JSON.stringify(declaredSorted) === JSON.stringify(actualSorted)) {
    return [];
  }

  return [
    [
      `${label} is out of sync with the live workspace inventory.`,
      `Declared: ${JSON.stringify(declaredSorted)}`,
      `Live:     ${JSON.stringify(actualSorted)}`,
    ].join('\n'),
  ];
}

export interface IdentityPackTierEntry {
  readonly directoryName: string;
  /** Parsed package.json content, or undefined when the directory has none. */
  readonly packageJson: unknown;
  /**
   * Pack-relative paths of every file in the pack. Only enumerated
   * TRANSIENT artefacts (`node_modules`, `.turbo`, `.DS_Store`) are
   * excluded by the walk — a committed dot-entry (`.npmrc`, an
   * `.eslintrc.json`, a hidden directory) is pack content and faces the
   * same anatomy as any other file, so tool configuration cannot hide
   * behind a leading dot. The anatomy check runs over this listing, so a
   * pack's data-only invariant is enforced on contents, never inferred
   * from the absence of a `scripts` field alone.
   */
  readonly files: readonly string[];
  /**
   * Pack-relative paths of every symbolic link the walk encountered — a
   * link is neither a directory nor a regular file, so without this leg
   * the walker would silently omit it and a pack could carry `src/index.ts`
   * as a symlink (or an asset link escaping the pack) while reading
   * well-shaped. The policy refuses the file KIND itself.
   */
  readonly symlinks: readonly string[];
  /**
   * Set when the directory HAS a package.json that could not be parsed —
   * the third input state, distinct from absent and from parsed, so a
   * malformed manifest becomes a located finding rather than a bare crash.
   */
  readonly parseFailure?: string;
  /**
   * Set when the tier child is ITSELF a symbolic link. Such an entry is
   * refused by KIND with nothing behind it inspected — inspecting would
   * dereference the link, which is exactly the escape being refused —
   * so `files`/`symlinks` are empty and `packageJson` undefined by
   * construction, and the refusal must not be compounded with
   * missing-manifest or anatomy findings about a target never read.
   */
  readonly selfIsSymlink?: boolean;
}

/** The tier's home, exported as the single canonical owner: the filesystem
 *  reader (`scripts/validate-boundaries.ts`) resolves the SAME path this
 *  policy reports, so the two cannot drift into inspecting one location
 *  while naming another (`consolidate-at-second-consumer`). */
export const TIER_PATH = 'packages/design/identities';

/**
 * The reader's whole account of the tier surface, consumed as one value:
 * the tier path's own KIND (lstat semantics — a linked tier would validate
 * the link's target, so the kind itself is policed), the root entries the
 * closed shape does not admit, and the pack entries.
 */
export interface IdentityPackTierReading {
  readonly tierState: 'present' | 'missing' | 'wrong-kind';
  readonly strayRootEntries: readonly string[];
  readonly entries: readonly IdentityPackTierEntry[];
}

export function checkIdentityPackTier(reading: IdentityPackTierReading): readonly string[] {
  if (reading.tierState === 'missing') {
    return [
      `Identity-pack tier directory ${TIER_PATH} is missing. The tier is a checked surface: ` +
        'if it was renamed or removed, move this leg with it rather than letting it vanish silently.',
    ];
  }
  if (reading.tierState === 'wrong-kind') {
    return [
      `${TIER_PATH} is not a real directory (a symbolic link or file stands at the tier path). ` +
        "The tier is classified by KIND before any read — validating a linked tier would validate the link's " +
        'target — so the kind itself is refused and nothing behind it is inspected.',
    ];
  }

  return [
    ...reading.strayRootEntries.map(
      (name) =>
        `${TIER_PATH}/${name} is not a pack directory or an admitted tier file. Tier children are ` +
        'pack directories plus the tier README only — a stray root entry sits outside every ' +
        "pack's anatomy and validation surface.",
    ),
    ...reading.entries.flatMap((entry) => checkPackEntry(entry)),
  ];
}

function checkPackEntry(entry: IdentityPackTierEntry): readonly string[] {
  const location = `${TIER_PATH}/${entry.directoryName}`;

  // A tier child that is itself a symbolic link is refused by KIND, alone:
  // its contents were never inspected (inspection would dereference the
  // link), so the collect-all below would report phantom findings about a
  // target that was deliberately not read.
  if (entry.selfIsSymlink === true) {
    return [
      `${location} is a symbolic link. Tier children are real pack directories only: a link ` +
        'can point outside the tier boundary, so the entry kind itself is refused and nothing ' +
        'behind it is inspected.',
    ];
  }

  // Collect-all: the manifest legs and the contents legs are independent
  // inputs, so a pack with a malformed package.json AND a source file
  // reports both in one run — a manifest fault never shadows an anatomy
  // fault (the module's every-problem-in-one-run contract).
  return [
    ...checkPackManifest(location, entry),
    ...checkPackAnatomy(location, entry.files),
    ...entry.symlinks.map(
      (link) =>
        `${location}/${link} is a symbolic link. Packs carry real files only: a link can point ` +
        'outside the pack boundary (or smuggle source past the anatomy), so the file kind ' +
        'itself is refused.',
    ),
  ];
}

function checkPackManifest(location: string, entry: IdentityPackTierEntry): readonly string[] {
  if (entry.parseFailure !== undefined) {
    return [`${location}/package.json could not be parsed: ${entry.parseFailure}`];
  }

  if (entry.packageJson === undefined) {
    return [
      `${location} has no package.json. Every child of the identity-pack tier is a pack ` +
        'workspace; anything else breaks the tier homogeneity the identity-№N enumeration relies on.',
    ];
  }

  if (typeof entry.packageJson !== 'object' || entry.packageJson === null) {
    return [`${location}/package.json is not an object.`];
  }

  const packageJson: Record<string, unknown> = { ...entry.packageJson };
  const failures: string[] = [];
  const expectedName = `@oaknational/identity-pack-${entry.directoryName}`;

  if (packageJson['name'] !== expectedName) {
    failures.push(
      `${location} must be named ${expectedName}, got: ${JSON.stringify(packageJson['name'])}.`,
    );
  }

  if (packageJson['private'] !== true) {
    failures.push(
      `${location} must set "private": true — identity packs carry identity content and must ` +
        'never become publishable by accident.',
    );
  }

  if ('scripts' in packageJson) {
    failures.push(
      `${location} declares scripts. Identity packs are data-only workspaces (manifest + CSS + ` +
        'assets + licence surface) and contribute nothing to the task graph.',
    );
  }

  if (typeof packageJson['license'] !== 'string' || packageJson['license'].trim().length === 0) {
    failures.push(
      `${location} must declare a non-blank "license" field — each identity pack carries its own licence surface.`,
    );
  }

  return failures;
}

/**
 * The permitted pack anatomy — a closed shape (tier README §Tier
 * invariants). Data-only means manifest/data JSON, authored CSS, docs,
 * licence surfaces, and vendored assets; source, executables, tool
 * configuration, and any file class this list has never admitted are
 * refused by default rather than admitted by omission.
 */
const PERMITTED_FILE_EXTENSIONS: ReadonlySet<string> = new Set([
  'css',
  'md',
  'txt',
  'svg',
  'png',
  'webp',
  'avif',
  'jpg',
  'jpeg',
  'gif',
  'ico',
  'woff',
  'woff2',
  'ttf',
  'otf',
]);

const PERMITTED_EXTENSIONLESS_BASENAMES: ReadonlySet<string> = new Set([
  'LICENSE',
  'LICENCE',
  'NOTICE',
]);

const SOURCE_FILE_EXTENSIONS: ReadonlySet<string> = new Set([
  'ts',
  'tsx',
  'js',
  'jsx',
  'mjs',
  'cjs',
  'mts',
  'cts',
  'sh',
]);

const REFUSED_CONFIG_BASENAMES =
  /^(?:eslint\.config\..+|tsconfig(?:\..+)?\.json|turbo\.json|vite\.config\..+|vitest\.config\..+|playwright\.config\..+)$/;

/**
 * Data JSON is admitted by PLACE AND SHAPE, never by bare extension: the
 * two root manifests, and DTCG token modules under `dtcg/` carrying the
 * DTCG format's own `.tokens.json` suffix. Tool configuration rides the
 * `.json` extension — `biome.json`, `deno.json`, `package-lock.json`, a
 * dotted rc file — so a blanket extension admission would undo
 * refusal-by-default for exactly the class a deny-list can never finish
 * enumerating; and a place alone re-opens the same hole INSIDE the place
 * (nested tool config is live for tools that read nested rc files). The
 * suffix names the format, so `dtcg/biome.json` is refused while
 * `dtcg/palette.tokens.json` is admitted.
 */
const PERMITTED_JSON_PATHS: ReadonlySet<string> = new Set(['package.json', 'manifest.json']);
const PERMITTED_DTCG_MODULE = /^dtcg\/(?:[^/]+\/)*[^/.][^/]*\.tokens\.json$/;

function isPermittedJson(file: string): boolean {
  return PERMITTED_JSON_PATHS.has(file) || PERMITTED_DTCG_MODULE.test(file);
}

function checkPackAnatomy(location: string, files: readonly string[]): readonly string[] {
  return files.flatMap((file) => {
    const basename = file.split('/').at(-1) ?? file;
    const dotIndex = basename.lastIndexOf('.');
    const extension = dotIndex > 0 ? basename.slice(dotIndex + 1).toLowerCase() : undefined;

    if (REFUSED_CONFIG_BASENAMES.test(basename)) {
      return [
        `${location}/${file} is tool configuration. Identity packs carry no build, lint, or ` +
          'test configuration — packs are data-only workspaces outside the task graph.',
      ];
    }

    if (extension === 'json' || basename.toLowerCase().endsWith('.json')) {
      return isPermittedJson(file)
        ? []
        : [
            `${location}/${file} is JSON outside the admitted data-JSON shapes (the root ` +
              '`package.json` and `manifest.json`, and `*.tokens.json` DTCG modules under ' +
              '`dtcg/`). Tool configuration rides the .json extension, so JSON is admitted ' +
              'by place and format suffix, never by extension; a new data-JSON home enters ' +
              'by amending the permitted set.',
          ];
    }

    if (extension !== undefined && SOURCE_FILE_EXTENSIONS.has(extension)) {
      return [
        `${location}/${file} is source or executable code. Data-only packs refuse source as a ` +
          "shape error (see the tier README's boundary-zone depth note): packs carry no ESLint " +
          'config, so source here would bypass the boundary rules entirely.',
      ];
    }

    if (
      (extension !== undefined && PERMITTED_FILE_EXTENSIONS.has(extension)) ||
      PERMITTED_EXTENSIONLESS_BASENAMES.has(basename)
    ) {
      return [];
    }

    return [
      `${location}/${file} is outside the permitted pack anatomy (manifest/data JSON, authored ` +
        'CSS, docs, licence surfaces, vendored assets). The anatomy is a closed shape: a new ' +
        'file class enters by amending the permitted set deliberately, never by omission.',
    ];
  });
}
