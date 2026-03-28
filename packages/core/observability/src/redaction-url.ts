interface UrlRedactionOptions {
  readonly normaliseKey: (key: string) => string;
  readonly redactedQueryKeys: ReadonlySet<string>;
  readonly redactedValue: string;
}

interface ParsedUrlForRedaction {
  readonly url: URL;
  readonly base?: string;
}

export function redactUrlString(value: string, options: UrlRedactionOptions): string {
  const parsedUrl = parseUrlForRedaction(value);
  if (!parsedUrl) {
    return value;
  }

  const queryChanged = redactSensitiveQueryParams(parsedUrl.url, options);
  const credentialsChanged = redactUrlCredentials(parsedUrl.url, options.redactedValue);

  if (!queryChanged && !credentialsChanged) {
    return value;
  }

  return formatParsedUrl(parsedUrl);
}

function parseUrlForRedaction(value: string): ParsedUrlForRedaction | undefined {
  if (!mayContainRedactableUrlParts(value)) {
    return undefined;
  }

  try {
    const base =
      value.startsWith('http://') || value.startsWith('https://') ? undefined : 'https://oak.local';
    return {
      url: new URL(value, base),
      base,
    };
  } catch {
    return undefined;
  }
}

function mayContainRedactableUrlParts(value: string): boolean {
  return value.includes('?') || value.includes('://');
}

function redactSensitiveQueryParams(url: URL, options: UrlRedactionOptions): boolean {
  let changed = false;

  for (const [key] of url.searchParams.entries()) {
    if (!options.redactedQueryKeys.has(options.normaliseKey(key))) {
      continue;
    }

    url.searchParams.set(key, options.redactedValue);
    changed = true;
  }

  return changed;
}

function redactUrlCredentials(url: URL, redactedValue: string): boolean {
  if (url.username === '' && url.password === '') {
    return false;
  }

  if (url.username !== '') {
    url.username = redactedValue;
  }

  if (url.password !== '') {
    url.password = redactedValue;
  }

  return true;
}

function formatParsedUrl(parsedUrl: ParsedUrlForRedaction): string {
  if (parsedUrl.base === undefined) {
    return parsedUrl.url.toString();
  }

  return `${parsedUrl.url.pathname}${parsedUrl.url.search}${parsedUrl.url.hash}`;
}
