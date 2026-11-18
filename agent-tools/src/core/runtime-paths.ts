import { isLowercaseUuid } from './lowercase-uuid.js';

export function escapedRepoPath(value: string): string {
  return value.replaceAll('\\', '-').replaceAll('/', '-');
}

export function isSessionId(value: string): boolean {
  return isLowercaseUuid(value);
}
