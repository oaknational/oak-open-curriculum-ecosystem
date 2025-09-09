import type { RequestHandler } from 'express';

const isLocalDev = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;

export const bearerAuth: RequestHandler = (req, res, next) => {
  const auth = req.header('authorization') ?? req.header('Authorization');
  const devToken = process.env.REMOTE_MCP_DEV_TOKEN;

  if (!auth) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }
  const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : '';
  if (isLocalDev && devToken && token === devToken) {
    next();
    return;
  }
  res.status(401).json({ error: 'Invalid token' });
};
