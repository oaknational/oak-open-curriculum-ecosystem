'use client';
import { useEffect, useRef } from "react";

export default function ApiDocsPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const specUrl = "/api/openapi.json";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error Redoc global provided by the CDN bundle
      if (window.Redoc && mountRef.current) {
        // @ts-expect-error Redoc global provided by the CDN bundle
        window.Redoc.init(
          specUrl,
          {
            hideDownloadButton: false,
            expandResponses: "all",
            jsonSampleExpandLevel: "all",
            pathInMiddlePanel: true
          },
          mountRef.current
        );
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main style={{ padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
      <header style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Oak Curriculum Search API</h1>
        <p style={{ margin: '6px 0 0', color: '#4b5563' }}>
          OpenAPI schema:{" "}
          <a href={specUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
            {specUrl}
          </a>
        </p>
      </header>
      <div ref={mountRef} style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }} />
    </main>
  );
}
