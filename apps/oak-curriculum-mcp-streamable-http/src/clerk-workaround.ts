import type { RequestHandler } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

/**
 * WORKAROUND: Fix @clerk/mcp-tools@0.3.1 bug in WWW-Authenticate header
 *
 * The library's getPRMUrl() function incorrectly appends req.originalUrl to the
 * OAuth metadata path, producing /.well-known/oauth-protected-resource/mcp (404)
 * instead of /.well-known/oauth-protected-resource (200).
 *
 * This middleware intercepts responses and removes the erroneous /mcp suffix.
 *
 * Bug location: @clerk/mcp-tools@0.3.1/dist/express/index.js:6567-6571
 * RFC 9470: https://www.rfc-editor.org/rfc/rfc9470.html
 *
 * TODO: Remove this when Clerk fixes upstream (track issue: TBD)
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
