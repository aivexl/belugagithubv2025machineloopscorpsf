// Simple in-memory cache with TTL and in-flight request deduplication

const store = new Map(); // key -> { value, expiresAt }
const inflight = new Map(); // key -> Promise<any>

export function getCachedValue(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCachedValue(key, value, ttlMs) {
  const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
  store.set(key, { value, expiresAt });
}

export function getInflight(key) {
  return inflight.get(key);
}

export function setInflight(key, promise) {
  inflight.set(key, promise);
  const clear = () => inflight.delete(key);
  promise.finally(clear);
  return promise;
}

export function withCache(key, ttlMs, fetcher) {
  const cached = getCachedValue(key);
  if (cached !== undefined) return Promise.resolve(cached);
  const existing = getInflight(key);
  if (existing) return existing;
  const p = Promise.resolve().then(fetcher).then((val) => {
    if (val !== undefined) setCachedValue(key, val, ttlMs);
    return val;
  });
  return setInflight(key, p);
}

export default {
  getCachedValue,
  setCachedValue,
  withCache,
  getInflight,
  setInflight,
};


