/**
 * Closed, case-insensitive path exclusions for outbound model review.
 *
 * @packageDocumentation
 */

const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.jj',
  'node_modules',
  'vendor',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.turbo',
  '.cache',
  '.claude',
  '.codex',
  '.direnv',
  '.ssh',
  '.gnupg',
  '.aws',
  'tmp',
  'generated',
  '__generated__',
]);

const EXCLUDED_BASENAMES = new Set([
  '.npmrc',
  '.pypirc',
  '.netrc',
  'credentials',
  'credentials.json',
  'secrets',
  'secrets.json',
  'id_rsa',
  'id_dsa',
  'id_ed25519',
]);

const EXCLUDED_LOCKFILES = new Set([
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'bun.lock',
  'bun.lockb',
  'cargo.lock',
  'gemfile.lock',
  'poetry.lock',
  'uv.lock',
  'composer.lock',
  'go.sum',
]);

const EXCLUDED_EXTENSIONS = [
  '.pem',
  '.key',
  '.p12',
  '.pfx',
  '.jks',
  '.keystore',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.ico',
  '.bmp',
  '.tiff',
  '.svg',
  '.pdf',
  '.zip',
  '.gz',
  '.tgz',
  '.tar',
  '.7z',
  '.rar',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.mp3',
  '.mp4',
  '.mov',
  '.wav',
  '.ogg',
  '.webm',
  '.wasm',
  '.class',
  '.jar',
  '.exe',
  '.dll',
  '.dylib',
  '.so',
  '.bin',
  '.db',
  '.sqlite',
  '.sqlite3',
  '.parquet',
  '.arrow',
  '.feather',
  '.csv',
  '.tsv',
  '.ndjson',
  '.jsonl',
  '.map',
  '.min.js',
  '.min.css',
];

/** Whether a portable project-relative file path is excluded from model review. */
export function isExcludedReviewPath(relativePath: string): boolean {
  const segments = relativePath.toLowerCase().split('/');
  const basename = segments.at(-1) ?? '';
  return (
    segments.some((segment) => EXCLUDED_DIRECTORIES.has(segment)) ||
    isAgentMemoryPath(segments) ||
    isEnvironmentFile(basename) ||
    EXCLUDED_BASENAMES.has(basename) ||
    EXCLUDED_LOCKFILES.has(basename) ||
    EXCLUDED_EXTENSIONS.some((extension) => basename.endsWith(extension))
  );
}

function isEnvironmentFile(basename: string): boolean {
  return (
    basename === '.env' ||
    basename === '.envrc' ||
    basename.startsWith('.env.') ||
    basename.endsWith('.env')
  );
}

function isAgentMemoryPath(segments: readonly string[]): boolean {
  return segments[0] === '.agent' && segments[1] === 'memory';
}
