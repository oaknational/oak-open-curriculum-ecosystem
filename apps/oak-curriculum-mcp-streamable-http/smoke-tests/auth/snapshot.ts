import { z } from 'zod';

export const HandshakeSnapshotSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  sessionJwt: z.string(),
  clientId: z.string(),
  devBrowserToken: z.string(),
  oauthApplication: z.object({
    id: z.string(),
    clientId: z.string(),
    authorizeUrl: z.string().min(1),
    tokenFetchUrl: z.string().min(1),
    redirectUri: z.string().min(1),
    scopes: z.string(),
  }),
  pkce: z.object({
    verifier: z.string(),
    challenge: z.string(),
  }),
  state: z.string(),
  authorizeRequestUrl: z.string().min(1),
  createdAt: z.string(),
});

export type HandshakeSnapshot = z.infer<typeof HandshakeSnapshotSchema>;
