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
    const originalSend = res.send;

    res.send = function (body) {
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

      return originalSend.call(this, body);
    };

    next();
  };
}
