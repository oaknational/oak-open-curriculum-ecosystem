'use client';

import { useReportWebVitals } from 'next/web-vitals';

function logWebVitals(metric: unknown): void {
  console.log(metric);
}

export function WebVitals(): null {
  useReportWebVitals(logWebVitals);
  return null;
}
