import type { RequestHandler } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

/**
 * WORKAROUND: Fix @clerk/mcp-tools@0.3.1 bug in WWW-Authenticate header
 *
 * Bug in @clerk/mcp-tools@0.3.1:
 * The library's getPRMUrl() function incorrectly appends req.originalUrl to the
 * OAuth metadata path, producing /.well-known/oauth-protected-resource/mcp
 * instead of /.well-known/oauth-protected-resource.
 *
 * PRIMARY FIX: We now serve OAuth metadata at BOTH paths (see auth-routes.ts)
 * so clients can fetch metadata regardless of which URL they receive.
 *
 * SECONDARY FIX (this middleware): Corrects the WWW-Authenticate header itself
 * to point to the canonical RFC 9470 compliant URL. This is defensive - clients
 * will work either way, but this ensures they receive the correct URL.
 *
 * Bug location: @clerk/mcp-tools@0.3.1/dist/express/index.js getPRMUrl()
 * RFC 9470: https://www.rfc-editor.org/rfc/rfc9470.html#section-3
 *
 * TODO: Remove both workarounds when Clerk fixes upstream bug
 */
export function createClerkBugWorkaroundMiddleware(log: Logger): RequestHandler {
  return (req, res, next) => {
    // Create a function to fix the header before any response is sent
    const fixHeader = () => {
      const wwwAuth = res.get('WWW-Authenticate');

      if (wwwAuth && typeof wwwAuth === 'string') {
        const corrected = wwwAuth.replace(
          /(\/.well-known\/oauth-protected-resource)\/mcp\b/g,
          '$1',
        );

        if (corrected !== wwwAuth) {
          log.debug('clerk.bug.workaround.applied', {
            original: wwwAuth,
            corrected,
            path: req.path,
          });
          res.set('WWW-Authenticate', corrected);
        }
      }
    };

    // Patch all response methods that could send the response
    const originalSend = res.send.bind(res);
    const originalJson = res.json.bind(res);
    const originalEnd = res.end.bind(res);

    res.send = function (body) {
      fixHeader();
      return originalSend(body);
    };

    res.json = function (body) {
      fixHeader();
      return originalJson(body);
    };

    // Type assertion needed for Express overload compatibility
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    res.end = function (...args: Parameters<typeof originalEnd>) {
      fixHeader();
      return originalEnd(...args);
    } as typeof originalEnd;

    next();
  };
}
