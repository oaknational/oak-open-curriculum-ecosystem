import type { JSX } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { HealthPayload } from './types';
import { isHealthPayload } from './status-helpers';
import { StatusClient } from './StatusClient';

export const revalidate = 0;

export default async function StatusPage(): Promise<JSX.Element> {
  const payload = await fetchHealthPayload();

  if (!payload) {
    notFound();
  }

  return <StatusClient payload={payload} />;
}

async function fetchHealthPayload(): Promise<HealthPayload | null> {
  const headerList = await headers();
  const hostHeader = headerList.get('host');
  const host = typeof hostHeader === 'string' ? hostHeader : null;
  if (!host) {
    return null;
  }
  const protocol = host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https';
  try {
    const res = await fetch(`${protocol}://${host}/healthz`, { cache: 'no-store' });
    const data: unknown = await res.json();
    return isHealthPayload(data) ? data : null;
  } catch {
    return null;
  }
}
