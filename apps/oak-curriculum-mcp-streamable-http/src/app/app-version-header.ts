/**
 * Response headers that expose the current app build version.
 */
interface AppVersionHeaders {
  readonly 'x-app-version': string;
}

/**
 * Create response headers from the app build identity value.
 */
export function createAppVersionHeaders(appVersion: string): AppVersionHeaders {
  return {
    'x-app-version': appVersion,
  };
}
