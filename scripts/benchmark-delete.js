
const API_URL = 'http://localhost:3000/api/admin';
const CATEGORY = 'glossary';
const ITEM_COUNT = 20;

const dummyItem = {
  term: 'Benchmark Term',
  definition: 'A term for benchmarking',
  category: 'benchmark',
  example: 'This is an example',
  relatedTerms: 'none'
};

async function insertItems(count) {
  const items = [];
  process.stdout.write(`Inserting ${count} items... `);
  for (let i = 0; i < count; i++) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: CATEGORY, itemData: { ...dummyItem, term: `Term ${i}-${Date.now()}` } })
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    items.push(json.data);
  }
  console.log('Done.');
  return items;
}

async function deleteOneByOne(items) {
  const start = Date.now();
  for (const item of items) {
    const res = await fetch(`${API_URL}?category=${CATEGORY}&id=${item.id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
  }
  return Date.now() - start;
}

async function deleteBulk() {
  const start = Date.now();
  const res = await fetch(`${API_URL}?category=${CATEGORY}&deleteAll=true`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return Date.now() - start;
}

async function run() {
  console.log(`Starting benchmark with ${ITEM_COUNT} items...`);

  // Clean start
  console.log('Cleaning table first...');
  await deleteBulk();

  // 1. Insert items
  const items1 = await insertItems(ITEM_COUNT);

  // 2. Measure N+1 Delete
  console.log('Running N+1 delete...');
  const timeN1 = await deleteOneByOne(items1);
  console.log(`N+1 Delete Time: ${timeN1}ms`);

  // 3. Insert items again
  const items2 = await insertItems(ITEM_COUNT);

  // 4. Measure Bulk Delete
  console.log('Running Bulk delete...');
  const timeBulk = await deleteBulk();
  console.log(`Bulk Delete Time: ${timeBulk}ms`);

  console.log('--------------------------------');
  console.log(`Improvement: ${(timeN1 / timeBulk).toFixed(2)}x faster`);
}

run().catch(console.error);
