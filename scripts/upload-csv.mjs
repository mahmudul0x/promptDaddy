// scripts/upload-csv.mjs
// Parallel + fast CSV uploader — grok, seedance, nano_banana
//
// চালানোর আগে (project root থেকে):
//   npm install csv-parse
//   (@supabase/supabase-js already আছে তোমার project এ)
//
// চালাও:
//   node scripts/upload-csv.mjs              ← সব table
//   node scripts/upload-csv.mjs grok         ← শুধু grok
//   node scripts/upload-csv.mjs seedance     ← শুধু seedance
//   node scripts/upload-csv.mjs nano         ← শুধু nano

import { createClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ddejhrygbczqxanrasmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8TrWJwrowOd0acPtVilPFQ_2oo4H25_';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: 'public' },
  global: { headers: { 'Cache-Control': 'no-cache' } }
});

// CSV files এই folder এ থাকবে: scripts/data/
const DATA_PATH = join(__dirname, 'data');

// CSV পড়া
function readCsv(filename) {
  return new Promise((resolve, reject) => {
    const records = [];
    createReadStream(join(DATA_PATH, filename))
      .pipe(parse({ columns: true, skip_empty_lines: true, cast: true }))
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

// Parallel upload
async function uploadParallel(tableName, items, { chunkSize = 500, concurrency = 5 } = {}) {
  const startTime = Date.now();
  console.log(`\n📤 ${tableName} — ${items.length.toLocaleString()} rows`);

  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push({ index: chunks.length, data: items.slice(i, i + chunkSize) });
  }

  let done = 0;
  let failed = 0;
  const failedChunks = [];

  async function uploadChunk(chunk) {
    const { error } = await supabase
      .from(tableName)
      .upsert(chunk.data, { onConflict: 'id' });

    done++;
    const pct = Math.round((done / chunks.length) * 100);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\r  ${pct}% (${done}/${chunks.length} chunks) — ${elapsed}s elapsed   `);

    if (error) {
      failed++;
      failedChunks.push(chunk);
    }
  }

  // concurrency টা বাড়ালে দ্রুত হবে, কিন্তু rate limit এ পড়তে পারো
  for (let i = 0; i < chunks.length; i += concurrency) {
    await Promise.all(chunks.slice(i, i + concurrency).map(uploadChunk));
  }

  // Failed chunks retry
  if (failedChunks.length > 0) {
    console.log(`\n  ⚠️  ${failedChunks.length} chunks failed, retrying one by one...`);
    for (const chunk of failedChunks) {
      const { error } = await supabase
        .from(tableName)
        .upsert(chunk.data, { onConflict: 'id' });
      if (error) console.error(`  ❌ Chunk ${chunk.index} still failing:`, error.message);
      else console.log(`  ✅ Chunk ${chunk.index} retry ok`);
    }
  }

  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n✅ ${tableName} done in ${totalTime}s`);
}

// ─── Config ───────────────────────────────────────────────────────────────────
// concurrency বাড়ালে দ্রুত হবে (max ~10, তার বেশি হলে Supabase rate limit করতে পারে)
const TASKS = {
  grok: {
    file: 'grok-imagine-prompts-20260429.csv',
    table: 'grok_imagine_prompts',
    chunkSize: 500,
    concurrency: 8,
  },
  seedance: {
    file: 'seedance-2-0-prompts-20260429.csv',
    table: 'seedance_prompts',
    chunkSize: 500,
    concurrency: 8,
  },
  nano: {
    file: 'nano-banana-pro-prompts-20260429.csv',
    table: 'nano_banana_prompts',
    chunkSize: 1000,  // row বেশি তাই chunk বড়
    concurrency: 6,
  },
};

async function main() {
  const target = process.argv[2];

  const toRun = target
    ? Object.entries(TASKS).filter(([key]) => key === target)
    : Object.entries(TASKS);

  if (target && toRun.length === 0) {
    console.error(`❌ Unknown target: "${target}". Options: grok, seedance, nano`);
    process.exit(1);
  }

  console.log('🚀 Upload শুরু হচ্ছে...');
  console.log(`📁 Data: ${DATA_PATH}\n`);

  const globalStart = Date.now();

  for (const [, config] of toRun) {
    console.log(`📂 Reading ${config.file}...`);
    const data = await readCsv(config.file);
    await uploadParallel(config.table, data, {
      chunkSize: config.chunkSize,
      concurrency: config.concurrency,
    });
  }

  const total = Math.round((Date.now() - globalStart) / 1000);
  console.log(`\n🎉 সব done! মোট সময়: ${Math.floor(total / 60)}m ${total % 60}s`);
  console.log('👉 Supabase Dashboard → Table Editor এ চেক করো');
  process.exit(0);
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
