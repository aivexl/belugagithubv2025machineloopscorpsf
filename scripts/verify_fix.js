import { buildQuery } from '../src/app/api/admin/utils.js';

class MockQueryBuilder {
  constructor(tableName) {
    this.tableName = tableName;
    this.calls = [];
  }

  select(columns, options) {
    this.calls.push({ method: 'select', args: [columns, options] });
    return this;
  }

  or(condition) {
    this.calls.push({ method: 'or', args: [condition] });
    return this;
  }

  eq(column, value) {
    this.calls.push({ method: 'eq', args: [column, value] });
    return this;
  }

  order(column, options) {
    this.calls.push({ method: 'order', args: [column, options] });
    return this;
  }

  range(from, to) {
    this.calls.push({ method: 'range', args: [from, to] });
    return this;
  }
}

const mockSupabase = {
  from: (tableName) => new MockQueryBuilder(tableName)
};

function runTest(name, callback) {
  try {
    callback();
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    console.error(`❌ FAIL: ${name}`, error);
    process.exit(1);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Helper to create URLSearchParams
const params = (obj) => {
    const p = new URLSearchParams();
    for (const k in obj) p.set(k, obj[k]);
    return p;
};

console.log('--- Starting Logic Verification ---');

runTest('Basic Query Construction', () => {
    const builder = buildQuery(mockSupabase, 'exchanges', params({}));
    const calls = builder.calls;

    assert(calls[0].method === 'select', 'First call must be select');
    assert(calls[0].args[0] === '*', 'Must select *');
    assert(calls[calls.length - 1].method === 'order', 'Last call (without pagination) must be order');
});

runTest('Pagination Logic', () => {
    const builder = buildQuery(mockSupabase, 'exchanges', params({ page: '2', limit: '10' }));
    const calls = builder.calls;

    const rangeCall = calls.find(c => c.method === 'range');
    assert(rangeCall, 'Must call range');
    assert(rangeCall.args[0] === 10, 'From should be 10');
    assert(rangeCall.args[1] === 19, 'To should be 19');

    const orderIndex = calls.findIndex(c => c.method === 'order');
    const rangeIndex = calls.findIndex(c => c.method === 'range');
    assert(orderIndex < rangeIndex, 'Must sort before range');
});

runTest('Search Logic', () => {
    const builder = buildQuery(mockSupabase, 'exchanges', params({ search: 'binance' }));
    const calls = builder.calls;

    const orCall = calls.find(c => c.method === 'or');
    assert(orCall, 'Must call or');
    assert(orCall.args[0].includes('binance'), 'Search term included');
});

runTest('Filter Logic', () => {
    const builder = buildQuery(mockSupabase, 'exchanges', params({ region: 'Asia' }));
    const calls = builder.calls;

    const eqCall = calls.find(c => c.method === 'eq');
    assert(eqCall, 'Must call eq');
    assert(eqCall.args[0] === 'region', 'Column matches');
    assert(eqCall.args[1] === 'Asia', 'Value matches');
});

runTest('Filter + Search + Pagination + Sort Order', () => {
    const builder = buildQuery(mockSupabase, 'exchanges', params({
        search: 'crypto',
        region: 'Global',
        page: '1',
        limit: '5'
    }));
    const calls = builder.calls;

    const selectIdx = calls.findIndex(c => c.method === 'select');
    const orIdx = calls.findIndex(c => c.method === 'or');
    const eqIdx = calls.findIndex(c => c.method === 'eq');
    const orderIdx = calls.findIndex(c => c.method === 'order');
    const rangeIdx = calls.findIndex(c => c.method === 'range');

    assert(selectIdx === 0, 'Select first');
    assert(orIdx > selectIdx, 'Search after select');
    assert(eqIdx > selectIdx, 'Filter after select');
    assert(orderIdx > orIdx && orderIdx > eqIdx, 'Sort after filtering');
    assert(rangeIdx > orderIdx, 'Range after sort');
});

console.log('All tests passed.');
