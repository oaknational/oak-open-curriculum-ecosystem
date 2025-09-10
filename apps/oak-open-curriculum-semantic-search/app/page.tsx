export default function Home() {
  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold">Oak Search API</h1>
      <p className="mt-2 text-sm text-gray-600">
        1) /api/index-oak → 2) /api/rebuild-rollup → 3) /api/search
      </p>
      <p className="mt-2 text-sm text-gray-600">
        SDK parity tests: POST /api/sdk/search-lessons, POST /api/sdk/search-transcripts
      </p>
    </main>
  );
}
