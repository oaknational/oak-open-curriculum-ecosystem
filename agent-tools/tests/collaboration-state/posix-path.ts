import { sep } from 'node:path';

/**
 * The product composes paths with the HOST separator (correct for real
 * filesystem access); fixtures seed them as POSIX literals for readability.
 * Every path-keyed store in the fake collaboration runtime therefore keys on
 * the POSIX form, so a seeded fixture and a host-joined lookup meet on every
 * platform. Without this a Windows run silently reads an empty store rather
 * than failing loudly — the fixture would report "no comms" instead of
 * "wrong key".
 */
export const posixPath = (hostPath: string): string => hostPath.split(sep).join('/');
