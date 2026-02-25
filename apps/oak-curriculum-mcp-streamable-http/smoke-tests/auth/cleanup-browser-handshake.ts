import { readFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

import { join } from 'node:path';
import { createClerkClient } from '@clerk/backend';
import { config as dotenvConfig } from 'dotenv';
import { findRepoRoot } from '@oaknational/env';
import { HandshakeSnapshotSchema } from './snapshot.js';

interface CleanupSnapshot {
  readonly userId: string;
  readonly sessionId: string;
  readonly oauthApplication: {
    readonly id: string;
  };
}

async function cleanup(): Promise<void> {
  const root = findRepoRoot(process.cwd());
  if (root === undefined) {
    throw new Error('Smoke tests must run inside the monorepo');
  }
  dotenvConfig({ path: join(root, '.env.local') });
  dotenvConfig({ path: join(root, '.env') });

  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

  if (!secretKey || !publishableKey) {
    throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY must be set.');
  }

  const snapshotPath = resolve('.tmp/clerk-handshake.json');
  const snapshot = parseCleanupSnapshot(readFileSync(snapshotPath, 'utf-8'));

  const clerk = createClerkClient({ secretKey, publishableKey });

  await Promise.allSettled([
    clerk.sessions.revokeSession(snapshot.sessionId),
    clerk.users.deleteUser(snapshot.userId),
    clerk.oauthApplications.delete(snapshot.oauthApplication.id),
  ]);

  unlinkSync(snapshotPath);

  console.log('Cleaned up Clerk handshake resources and removed snapshot file.');
}

cleanup().catch((error: unknown) => {
  console.error('Failed to clean up Clerk browser handshake resources:', error);
  process.exitCode = 1;
});

function parseCleanupSnapshot(contents: string): CleanupSnapshot {
  const parsed = HandshakeSnapshotSchema.parse(JSON.parse(contents));
  return {
    userId: parsed.userId,
    sessionId: parsed.sessionId,
    oauthApplication: {
      id: parsed.oauthApplication.id,
    },
  };
}
