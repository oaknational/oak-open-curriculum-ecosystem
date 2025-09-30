'use client';

import type { JSX } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

type MetricReporter = Parameters<typeof useReportWebVitals>[0];
type Metric = Parameters<MetricReporter>[0];

function logWebVitals(metric: Metric): void {
  if (process.env.NEXT_PUBLIC_WEB_VITALS_LOGGING === 'true') {
    console.log(`Core Web Vitals: ${metric.name} ${metric.value}`);
    console.log(`${JSON.stringify(metric)}`);
  }
}

export function WebVitals(): JSX.Element | null {
  useReportWebVitals(logWebVitals);
  return null;
}
