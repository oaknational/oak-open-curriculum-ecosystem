export function escapedRepoPath(value: string): string {
  return value.replaceAll('\\', '-').replaceAll('/', '-');
}

export function isSessionId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u.test(value);
}
