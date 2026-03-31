import type { Express } from 'express';
import type { Logger } from '@oaknational/logger';

const HEALTH_RESPONSE = JSON.stringify({
  status: 'ok',
  mode: 'streamable-http',
  auth: 'required-for-post',
});

export function addHealthEndpoints(app: Express, log: Logger): void {
  app.head('/healthz', (req, res) => {
    log.debug('healthz.head', { path: req.path, method: req.method });
    res.setHeader('Content-Type', 'application/json').status(200).end();
  });
  app.get('/healthz', (req, res) => {
    log.debug('healthz.get', { path: req.path, method: req.method });
    res.type('application/json').send(HEALTH_RESPONSE);
  });
}
