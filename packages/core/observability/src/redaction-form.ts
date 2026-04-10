interface FormRedactionOptions {
  readonly normaliseKey: (key: string) => string;
  readonly redactedQueryKeys: ReadonlySet<string>;
  readonly redactedValue: string;
  readonly shouldFullyRedactKey: (key: string) => boolean;
}

function shouldRedactFormKey(key: string, options: FormRedactionOptions): boolean {
  return (
    options.redactedQueryKeys.has(options.normaliseKey(key)) || options.shouldFullyRedactKey(key)
  );
}

function isLikelyFormEncodedPayload(value: string): boolean {
  if (value.includes('://') || value.includes('?')) {
    return false;
  }

  return value.includes('&') || /^[^=\s]+=[^\s]*$/u.test(value);
}

export function redactFormEncodedString(value: string, options: FormRedactionOptions): string {
  if (!isLikelyFormEncodedPayload(value)) {
    return value;
  }

  const searchParams = new URLSearchParams(value);
  const redactedParams = new URLSearchParams();
  let changed = false;

  for (const [key, entry] of searchParams.entries()) {
    if (shouldRedactFormKey(key, options)) {
      redactedParams.append(key, options.redactedValue);
      changed = true;
      continue;
    }

    redactedParams.append(key, entry);
  }

  return changed ? redactedParams.toString() : value;
}
