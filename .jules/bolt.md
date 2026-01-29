## 2025-02-19 - Unexpected Prop Mutation
**Learning:** `Top100Trending` was sorting `homepageCoins` directly in the render body. Since this data comes from a Context provider, `Array.prototype.sort()` mutates the shared state in-place.
**Action:** Always clone arrays (`[...arr]`) before sorting in components to prevent side effects on shared state.
