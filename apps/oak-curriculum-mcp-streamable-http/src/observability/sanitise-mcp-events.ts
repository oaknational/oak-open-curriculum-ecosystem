import type {
  SentryBreadcrumb,
  SentryErrorEvent,
  SentryPostRedactionHooks,
  SentryTransactionEvent,
} from '@oaknational/sentry-node';

type SentryRequest = SentryErrorEvent['request'];

export type HttpPostRedactionHooks = SentryPostRedactionHooks;

export function decodeUrlValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function extractMcpRoute(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const decoded = decodeUrlValue(value);

  try {
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
      return new URL(decoded).pathname;
    }
  } catch {
    // Fall through to relaxed parsing below.
  }

  if (decoded.startsWith('/')) {
    return decoded.split('?')[0];
  }

  const mcpIndex = decoded.indexOf('/mcp');

  if (mcpIndex >= 0) {
    return decoded.slice(mcpIndex).split('?')[0];
  }

  return undefined;
}

export function isMcpRoute(route: string | undefined): route is '/mcp' {
  return route === '/mcp';
}

function getMcpRequestMethod(request: SentryRequest | undefined): string | undefined {
  return typeof request?.method === 'string' ? request.method : undefined;
}

function sanitizeMcpRequest(request: SentryRequest | undefined): SentryRequest | undefined {
  const route = extractMcpRoute(typeof request?.url === 'string' ? request.url : undefined);

  if (!isMcpRoute(route)) {
    return request;
  }

  return {
    ...(getMcpRequestMethod(request) ? { method: getMcpRequestMethod(request) } : {}),
    url: route,
  };
}

function sanitizeMcpEvent<T extends { request?: SentryRequest; transaction?: string }>(
  event: T,
): T {
  const request = sanitizeMcpRequest(event.request);
  const route = extractMcpRoute(request?.url ?? event.transaction);

  if (!isMcpRoute(route)) {
    return event;
  }

  const method = getMcpRequestMethod(request);

  return {
    ...event,
    ...(request ? { request } : {}),
    ...(event.transaction !== undefined
      ? { transaction: method ? `${method} ${route}` : route }
      : {}),
  };
}

function getBreadcrumbMethod(breadcrumb: SentryBreadcrumb): string | undefined {
  const method: unknown = breadcrumb.data?.method;

  return typeof method === 'string' ? method : undefined;
}

function sanitizeMcpBreadcrumb(breadcrumb: SentryBreadcrumb): SentryBreadcrumb {
  const route = extractMcpRoute(
    (typeof breadcrumb.data?.url === 'string' ? breadcrumb.data.url : undefined) ??
      breadcrumb.message,
  );

  if (!isMcpRoute(route)) {
    return breadcrumb;
  }

  const method = getBreadcrumbMethod(breadcrumb);

  return {
    ...breadcrumb,
    ...(method ? { message: `${method} ${route}` } : { message: route }),
    data: {
      ...(method ? { method } : {}),
      route,
    },
  };
}

export function createHttpPostRedactionHooks(): HttpPostRedactionHooks {
  return {
    beforeSend(event: SentryErrorEvent) {
      return sanitizeMcpEvent(event);
    },
    beforeSendTransaction(event: SentryTransactionEvent) {
      return sanitizeMcpEvent(event);
    },
    beforeBreadcrumb(breadcrumb: SentryBreadcrumb) {
      return sanitizeMcpBreadcrumb(breadcrumb);
    },
  };
}
