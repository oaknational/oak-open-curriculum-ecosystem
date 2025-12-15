# Oak OpenAPI - Bulk Download System

## Overview

The bulk download system creates organized archives of entire curriculum sequences for offline use. It packages videos, worksheets, slide decks, quizzes, and metadata into tar files uploaded to Google Cloud Storage.

## Architecture

```
bin/prepare-bulk.ts (Node.js script)
    ↓
Fetch all sequences from OWA Hasura
    ↓
For each sequence:
  ├─ Get unit data
  ├─ Get lesson data
  ├─ Fetch asset links from GraphQL
  ├─ Download videos from Mux
  ├─ Fetch files from Google Cloud Storage
  ├─ Create tar archives by asset type
  ├─ Write JSON/JSONL metadata files
  └─ Upload to GCS bucket
    ↓
User requests bulk download
    ↓
API endpoint streams from GCS
```

---

## Preparation Script

**File:** `bin/prepare-bulk.ts`

**Purpose:** Pre-generates bulk download packages (run offline)

**Requirements:**

- Node.js 22+ (for socket handling)
- Environment variables configured
- Companion script `bulk-download-videos.sh` running

### Configuration

**Environment Variables:**

```bash
OAK_GRAPHQL_HOST=         # Hasura GraphQL endpoint
OAK_GRAPHQL_SECRET=       # Auth secret
GOOGLE_APPLICATION_CREDENTIALS_JSON= # GCS credentials
INCLUDE_ASSETS=true       # Process assets (false = metadata only)
MUX_TOKEN=                # Mux API access
```

### Execution

**Full Build:**

```bash
NODE_OPTIONS='--max-old-space-size=4096' tsx bin/prepare-bulk.ts
```

**Single Subject/Phase:**

```bash
tsx bin/prepare-bulk.ts maths-primary
```

**Metadata Only (No Assets):**

```bash
INCLUDE_ASSETS=false tsx bin/prepare-bulk.ts
```

---

## Data Flow

### 1. Sequence Discovery

```typescript
const subjects = await getAllSubjects(client);

for (const subject of subjects) {
  const sequences = await getAllSequenceData(client, subject.slug, subject.phase);

  for (const sequence of sequences) {
    await buildLessonData(sequence.slug, sequence.units, assetPacks);
  }
}
```

**Data Source:** `published_mv_curriculum_sequence_b_13_0_17`

### 2. Unit & Lesson Fetching

```typescript
async function buildLessonData(slug: string, sequence: UnitWithExamBoards[], packs: AssetPacks) {
  const unitSlugs: string[] = deepSearchAll(sequence, 'unitSlug');

  for (const unitSlug of unitSlugs) {
    const lessonData = await getAllLessonData(unitSlug);
    const assetLinks = await getAllLessonAssets(
      client,
      lessonData.map((_) => _.lessonSlug),
    );

    // Process each lesson...
  }
}
```

**Queries:**

- Lesson metadata from `published_mv_lesson_openapi_1_2_3`
- Asset links from `published_mv_openapi_downloads_1_0_0`

### 3. Asset Processing

#### Copyright Gating

```typescript
function isLessonAssetsAllowed(lesson: {
  subjectSlug: string;
  unitSlug: string;
  lessonSlug: string;
}): boolean {
  const { subjectSlug, unitSlug, lessonSlug } = lesson;

  if (isLessonSupported(lessonSlug)) {
    return true;
  }

  return isSubjectSupported(subjectSlug) || isUnitSupported(unitSlug);
}
```

**Gating Sources:**

- `src/lib/queryGateData/supportedLessons.json`
- `src/lib/queryGateData/supportedUnits.json`
- Hardcoded subjects (currently only `maths`)

#### Video Downloads

```typescript
// 1. Get video URL from Mux
const url = await getVideoFromMux(assetLinks[lesson.lessonSlug].videoStream);

// 2. Add to download queue
await addURLToQueue(url, `${lesson.lessonSlug}.mp4`, slug);

// 3. Record reference in metadata
lesson.video = `${slug}-videos.tar:${lesson.lessonSlug}.mp4`;
```

**Video Queue:**

- Managed by separate `bulk-download-videos.sh` script
- Downloads in parallel using `aria2c`
- Writes directly to tar archive

#### File Assets

```typescript
await addStorageAssetToTar(
  packs.slideDecks,
  {
    bucket_name: 'oak-assets',
    bucket_path: '/path/to/PowerPoint.pptx',
  },
  `${lesson.lessonSlug}_slide_deck.pptx`,
  storage,
);
```

**Process:**

1. Download from Google Cloud Storage
2. Stream directly into tar archive
3. No disk intermediate (memory efficient)

#### Quiz Downloads

```typescript
await downloadQuiz(
  assetLinks[lesson.lessonSlug].starterQuiz,
  `${lesson.lessonSlug}_starter_quiz.pdf`,
  packs.quizzes,
);
```

**Quiz Types:**

- Starter quiz questions (JSON)
- Starter quiz answers (PDF)
- Exit quiz questions (JSON)
- Exit quiz answers (PDF)

---

## Output Structure

### Directory Layout

```
out/
├── maths-primary-year-1-number/
│   ├── sequence.json
│   ├── units.jsonl
│   ├── lessons.jsonl
│   ├── maths-primary-year-1-number-videos.tar
│   ├── maths-primary-year-1-number-worksheets.tar
│   ├── maths-primary-year-1-number-slide-decks.tar
│   ├── maths-primary-year-1-number-quizzes.tar
│   └── maths-primary-year-1-number-resources.tar
└── ...
```

### Metadata Files

#### sequence.json

**Format:** Single JSON object

```json
{
  "slug": "maths-primary-year-1-number",
  "title": "Number",
  "description": "Understanding numbers and counting",
  "keyStage": "ks1",
  "subject": "maths",
  "phase": "primary",
  "year": "1",
  "unitCount": 3,
  "lessonCount": 24
}
```

#### units.jsonl

**Format:** JSON Lines (one JSON object per line)

```jsonl
{"slug":"unit-1","title":"Place Value","order":1,"lessonCount":8}
{"slug":"unit-2","title":"Addition","order":2,"lessonCount":10}
{"slug":"unit-3","title":"Subtraction","order":3,"lessonCount":6}
```

#### lessons.jsonl

**Format:** JSON Lines with asset references

```jsonl
{
  "lessonSlug": "place-value-intro",
  "lessonTitle": "Introduction to Place Value",
  "unitSlug": "unit-1",
  "order": 1,
  "video": "maths-primary-year-1-number-videos.tar:place-value-intro.mp4",
  "slideDeck": "maths-primary-year-1-number-slide-decks.tar:place-value-intro_slide_deck.pptx",
  "worksheet": "maths-primary-year-1-number-worksheets.tar:place-value-intro_worksheet.pdf",
  "starterQuiz": "maths-primary-year-1-number-quizzes.tar:place-value-intro_starter_quiz.pdf",
  "exitQuiz": "maths-primary-year-1-number-quizzes.tar:place-value-intro_exit_quiz.pdf"
}
```

**Reference Format:** `{tar-filename}:{file-path-in-tar}`

### Tar Archives

**Naming Convention:** `{sequence-slug}-{asset-type}.tar`

**Asset Types:**

- `videos` - MP4 video files
- `worksheets` - PDF worksheets and editable PPTX versions
- `slide-decks` - PowerPoint presentation files
- `quizzes` - Starter and exit quiz PDFs
- `resources` - Supplementary materials

**File Naming Inside Tar:**

- Videos: `{lesson-slug}.mp4`
- Slide decks: `{lesson-slug}_slide_deck.pptx`
- Worksheets: `{lesson-slug}_worksheet.pdf`
- Quizzes: `{lesson-slug}_starter_quiz.pdf`

---

## Asset Pack System

### AssetPacks Type

```typescript
export type AssetPacks = {
  videos: Pack | null;
  worksheets: Pack | null;
  slideDecks: Pack | null;
  quizzes: Pack | null;
  resources: Pack | null;
};
```

### Pack Interface

```typescript
type Pack = {
  tarStream: Archiver;
  outputPath: string;
  fileCount: number;
  totalSize: number;
};
```

### Pack Creation

```typescript
function buildAssetPacks(slug: string): AssetPacks {
  const sequenceDir = `${__dirname}/out/${slug}`;

  const createPack = (type: string) => ({
    tarStream: archiver('tar', { gzip: false }),
    outputPath: `${sequenceDir}/${slug}-${type}.tar`,
    fileCount: 0,
    totalSize: 0,
  });

  return {
    videos: createPack('videos'),
    worksheets: createPack('worksheets'),
    slideDecks: createPack('slide-decks'),
    quizzes: createPack('quizzes'),
    resources: createPack('resources'),
  };
}
```

### Adding Files to Packs

#### From URL (Videos)

```typescript
await addURLToQueue(url, filename, sequenceSlug);
// Handled by external aria2c process
```

#### From Google Cloud Storage

```typescript
async function addStorageAssetToTar(
  pack: Pack,
  asset: SignedAsset,
  filename: string,
  storage: Storage,
) {
  const file = storage.bucket(asset.bucket_name).file(asset.bucket_path);

  const stream = file.createReadStream();

  pack.tarStream.append(stream, { name: filename });
  pack.fileCount++;

  // Track size
  const [metadata] = await file.getMetadata();
  pack.totalSize += metadata.size;
}
```

#### From Memory (Quiz JSON)

```typescript
async function downloadQuiz(asset: SignedAsset, filename: string, pack: Pack) {
  const [url] = await storage.bucket(asset.bucket_name).file(asset.bucket_path).getSignedUrl({
    /* ... */
  });

  const response = await fetch(url);
  const buffer = await response.buffer();

  pack.tarStream.append(buffer, { name: filename });
  pack.fileCount++;
}
```

### Finalizing Packs

```typescript
async function finalizePacks(packs: AssetPacks) {
  for (const pack of Object.values(packs)) {
    if (pack) {
      await pack.tarStream.finalize();

      log(`Created ${pack.outputPath}`);
      log(`Files: ${pack.fileCount}, Size: ${formatBytes(pack.totalSize)}`);
    }
  }
}
```

---

## Upload to Google Cloud Storage

### Configuration

```typescript
const storage = getGoogleCloudStorage();
const bucketName = 'oak-prod-ldn-bulk-uploader';
```

### Upload Process

```typescript
async function uploadToStorage(sequenceSlug: string, sequenceDir: string) {
  const bucket = storage.bucket(bucketName);

  // Get all files in sequence directory
  const files = await fs.readdir(sequenceDir);

  for (const file of files) {
    const localPath = path.join(sequenceDir, file);
    const remotePath = `${sequenceSlug}/${file}`;

    await bucket.upload(localPath, {
      destination: remotePath,
      metadata: {
        cacheControl: 'public, max-age=3600',
      },
    });

    log(`Uploaded ${file} to GCS`);
  }
}
```

**Bucket Structure:**

```
oak-prod-ldn-bulk-uploader/
├── maths-primary-year-1-number/
│   ├── sequence.json
│   ├── units.jsonl
│   ├── lessons.jsonl
│   ├── maths-primary-year-1-number-videos.tar
│   └── ...
└── ...
```

---

## API Endpoint for Bulk Downloads

**File:** `src/app/api/bulk/route.ts`

### Request Format

```http
POST /api/bulk
Authorization: Bearer {api-key}
Content-Type: application/json

{
  "subjects": [
    "maths-primary",
    "science-secondary"
  ]
}
```

### Response

```http
HTTP/1.1 200 OK
Content-Type: application/zip

[Binary ZIP data]
```

### Implementation

```typescript
const handler = async (req: NextRequest) => {
  // 1. Authenticate user
  const user = await withUser(req);
  const ctx = { user, resHeaders: req.headers };

  // 2. Check rate limit
  await protect({
    ctx,
    next: async () => {},
    meta: { noCost: false }, // Bulk downloads consume quota
  });

  // 3. Parse request
  const body = await req.json();
  const subjects = body.subjects || [];

  // 4. Fetch files from GCS
  const allFiles: File[] = [];

  for (const subject of subjects) {
    const [files] = await storage
      .bucket(bucketName)
      .getFiles({ prefix: `${subject}/${subject}.json` });

    if (files && files.length > 0) {
      allFiles.push(...files);
    }
  }

  // 5. Create ZIP archive
  const archive = archiver('zip', { zlib: { level: 9 } });
  const zipStream = new PassThrough();
  archive.pipe(zipStream);

  // 6. Add files to archive
  for (const file of allFiles) {
    archive.append(file.createReadStream(), {
      name: file.name.split('/').pop() || file.name,
    });
  }

  // 7. Finalize and stream
  archive.finalize();

  return new Response(zipStream, {
    headers: {
      'Content-Type': 'application/zip',
    },
  });
};
```

**Timeout:** `maxDuration = 120` (2 minutes)

**Notes:**

- Streams directly to client (no disk buffering)
- Large downloads may timeout
- Consider pre-signed GCS URLs instead

---

## Companion Video Download Script

**File:** `bin/bulk-download-videos.sh`

**Purpose:** Downloads videos in parallel while prepare-bulk.ts runs

### Implementation

```bash
#!/bin/bash

QUEUE_DIR="./video-queue"
DOWNLOAD_DIR="./out"

mkdir -p "$QUEUE_DIR"

# Watch for new download requests
while true; do
  for file in "$QUEUE_DIR"/*.json; do
    if [ -f "$file" ]; then
      URL=$(jq -r '.url' "$file")
      OUTPUT=$(jq -r '.output' "$file")

      # Download with aria2c (parallel, resume support)
      aria2c -x 16 -s 16 -k 1M \
        -d "$DOWNLOAD_DIR" \
        -o "$OUTPUT" \
        "$URL"

      # Remove queue file
      rm "$file"
    fi
  done

  sleep 1
done
```

**Features:**

- Parallel chunk downloads (16 connections)
- Resume support
- Progress reporting

### Queue File Format

```json
{
  "url": "https://stream.mux.com/abc123.mp4",
  "output": "maths-primary-year-1/videos/lesson-1.mp4",
  "sequenceSlug": "maths-primary-year-1"
}
```

---

## Copyright & Licensing Gating

### Gating Logic

```typescript
function isLessonAssetsAllowed(lesson): boolean {
  // 1. Check explicit lesson allowlist
  if (isLessonSupported(lesson.lessonSlug)) {
    return true;
  }

  // 2. Check subject support
  if (isSubjectSupported(lesson.subjectSlug)) {
    return true;
  }

  // 3. Check unit support
  if (isUnitSupported(lesson.unitSlug)) {
    return true;
  }

  return false;
}
```

### Current Gating

**Supported by default:**

- All Math lessons (any key stage)

**Requires explicit approval:**

- English (fully blocked)
- Financial Education (fully blocked)
- Other subjects (unit-by-unit basis)

**Configuration Files:**

- `src/lib/queryGateData/supportedLessons.json` - Explicit lesson slugs
- `src/lib/queryGateData/supportedUnits.json` - Explicit unit slugs
- `src/lib/queryGateData/assets/blockedLessons.json` - Never allow
- `src/lib/queryGateData/assets/blockedUnits.json` - Never allow

### Blocked Content Handling

```typescript
if (!assetsAllowed) {
  log(`Skipping lesson ${lesson.lessonSlug} assets - not in allowed list`);
  // Metadata still included, assets excluded
}
```

**Result:**

- Lesson appears in `lessons.jsonl`
- Asset fields are `null` or omitted
- User sees lesson exists but can't download assets

---

## Performance & Resource Management

### Memory Usage

**Problem:** Processing large sequences with many videos can exceed Node.js memory

**Solution:**

```bash
NODE_OPTIONS='--max-old-space-size=4096' # 4GB heap
```

**Streaming:**

- Videos streamed directly to tar
- Files streamed from GCS
- No large buffers in memory

### Disk Usage

**Temporary Storage:**

```
out/
└── {sequence-slug}/
    ├── {tar files} (can be many GBs)
    └── {metadata} (KBs)
```

**Cleanup:**
After upload to GCS, local files can be deleted.

### Network Usage

**Parallel Downloads:**

- Videos: 16 parallel chunks per file
- GCS files: Sequential (limited by API)

**Bandwidth:**

- Full curriculum could be 100+ GB
- Mux streaming: No bandwidth charges
- GCS egress: Charged per GB

### Time Estimates

**Math Primary (example):**

- 6 key stages
- ~500 lessons
- ~50 GB total assets
- Time: 2-4 hours (depending on network)

**Full Curriculum:**

- ~3000 lessons
- ~300 GB total
- Time: 12-24 hours

---

## Error Handling & Logging

### Logging System

**File:** `src/lib/bulk-data/logger.ts`

```typescript
export function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

export function logError(message: string) {
  console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
}
```

### Error Scenarios

**Video Download Failure:**

```typescript
try {
  const url = await getVideoFromMux(stream);
  await addURLToQueue(url, filename, slug);
  lesson.video = `${slug}-videos.tar:${filename}`;
} catch (e) {
  logError(`Failed to process video for ${lesson.lessonSlug}: ${e}`);
  // Continue with other lessons
}
```

**GCS Asset Failure:**

```typescript
try {
  await addStorageAssetToTar(pack, asset, filename, storage);
  lesson.slideDeck = `${slug}-slide-decks.tar:${filename}`;
} catch (e) {
  logError(`Failed to process slide deck for ${lesson.lessonSlug}: ${e}`);
  logError(`Slide deck data: ${JSON.stringify(asset)}`);
  // Continue with other assets
}
```

**Strategy:** Fail gracefully, log errors, continue processing

---

## Memory Tracking

```typescript
function trackMemoryUsage() {
  return setInterval(() => {
    const used = process.memoryUsage();
    log(
      `Memory: ${Math.round(used.heapUsed / 1024 / 1024)}MB / ${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    );
  }, 30000); // Every 30 seconds
}

const memoryTracker = trackMemoryUsage();

main().finally(() => {
  clearInterval(memoryTracker);
});
```

---

## Future Improvements

### 1. Incremental Updates

**Problem:** Re-downloading unchanged content wastes time/bandwidth

**Solution:**

- Check file hashes before downloading
- Only update changed lessons
- Version tracking in metadata

### 2. Resume Support

**Problem:** Script crashes require starting over

**Solution:**

- Checkpoint progress to disk
- Skip completed sequences
- Resume partial tar files

### 3. Parallel Sequence Processing

**Problem:** Sequences processed sequentially

**Solution:**

- Process multiple sequences concurrently
- Worker pool pattern
- Shared asset deduplication

### 4. Direct Client Downloads

**Problem:** API endpoint times out for large downloads

**Solution:**

- Generate pre-signed GCS URLs
- Client downloads directly from GCS
- No API server involvement

### 5. Delta Packages

**Problem:** Users re-download entire sequences for small updates

**Solution:**

- Track content versions
- Generate delta packages (only changed files)
- Patch mechanism for updates

### 6. Torrent Distribution

**Problem:** High bandwidth costs for bulk content

**Solution:**

- Generate torrent files
- Peer-to-peer distribution
- Significantly reduced server costs




