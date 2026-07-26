/**
 * Build-time copy of the Oak design system's runtime files into `public/`.
 *
 * @remarks
 * The app serves the design system as ordinary static assets under
 * `/oak-ds/`. The package is a devDependency consumed at build/dev/test
 * time only (precedent: `@oaknational/oak-design-tokens`), so nothing
 * design-system-shaped enters the deployed dependency graph — only the
 * copied files do.
 *
 * Two constraints shape the copy:
 *
 * - **Package-relative layout is mirrored.** `url()` resolution in CSS is
 *   relative to the stylesheet, so `fonts/` and `assets/icons/` must sit
 *   where `colors_and_type.css` and `oak-icons.css` expect them.
 * - **The set is declared, not globbed.** {@link OAK_DS_MANIFEST} is the
 *   contract; the unit suite recomputes the stylesheet's real `@import` +
 *   `url()` closure against it, so a design-system change that widens the
 *   closure fails the build rather than shipping a page with a missing
 *   font or icon.
 *
 * Deliberately excluded: `brand.css` (outside the `styles.css` closure —
 * it is the white-label override contract, not the Oak identity) and
 * `oak-flat.generated.css` (design-sync's derived artefact).
 *
 * @packageDocumentation
 */

import { createRequire } from 'node:module';
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

/** Directory name the copied design system occupies under the served root. */
export const OAK_DS_PUBLIC_DIRNAME = 'oak-ds';

/**
 * The declared runtime file set, package-relative.
 *
 * @remarks
 * `files` is exact-pinned: the unit suite asserts the copied `oak-ds/`
 * root contains these and nothing else, so an unnoticed addition to the
 * package cannot silently ride along. `directories` is checked at
 * directory granularity — icon sets grow benignly and pinning 128 file
 * names would break on every legitimate addition.
 */
export const OAK_DS_MANIFEST = {
  files: [
    'styles.css',
    'colors_and_type.css',
    'oak-icons.css',
    'components.css',
    'print.css',
    // The system's own theme switcher. Loaded synchronously in <head> so the
    // stored theme applies before first paint; also the source of the five
    // theme names the page's theme control offers.
    'oak-theme.js',
    'fonts/Lexend-VariableFont_wght.ttf',
    'fonts/Lexend-OFL.txt',
    'fonts/RobotoMono-VariableFont_wght.ttf',
    'fonts/RobotoMono-OFL.txt',
    // Markup-referenced, so no CSS closure reaches either of these. Declared
    // individually even though `assets/icons` is copied wholesale: the footer
    // rule is not an icon, it merely lives in that directory today, and a
    // design-system commit that reorganised it would 404 the footer with the
    // whole suite green.
    'assets/logo-full-black.svg',
    'assets/icons/header-underline.svg',
  ],
  directories: ['assets/icons'],
} as const;

/**
 * Absolute path to the installed `@oaknational/oak-design-system` root.
 *
 * @remarks
 * Resolved through the package's `exports` map via its root entry
 * (`styles.css`), then walked up one level. `./package.json` is NOT an
 * exported subpath and resolving it would throw; a relative monorepo path
 * would break the moment the app is built anywhere but in place.
 */
export function resolveOakDsPackageRoot(): string {
  const require = createRequire(import.meta.url);
  return path.dirname(require.resolve('@oaknational/oak-design-system'));
}

/**
 * Copy the declared design-system file set into `<destRoot>/oak-ds/`.
 *
 * @param destRoot - The served static root (the app's `public/` directory).
 *
 * @remarks
 * The destination is removed first so a file dropped from the manifest
 * does not linger from an earlier build.
 */
export async function copyOakDs(destRoot: string): Promise<void> {
  const packageRoot = resolveOakDsPackageRoot();
  const destination = path.join(destRoot, OAK_DS_PUBLIC_DIRNAME);

  await rm(destination, { recursive: true, force: true });

  for (const relativePath of OAK_DS_MANIFEST.files) {
    const target = path.join(destination, relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(path.join(packageRoot, relativePath), target);
  }

  for (const relativeDir of OAK_DS_MANIFEST.directories) {
    await cp(path.join(packageRoot, relativeDir), path.join(destination, relativeDir), {
      recursive: true,
    });
  }
}
