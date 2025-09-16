// Debug script untuk mengecek data coinTags
console.log('=== DEBUG COIN TAGS ===');

// Simulasi data artikel dengan coinTags
const mockArticle = {
  _id: 'test-article',
  title: 'Test Article',
  coinTags: [
    {
      _id: 'coin-1',
      name: 'Bitcoin',
      symbol: 'BTC',
      logo: {
        asset: {
          _ref: 'image-123',
          _type: 'reference'
        },
        alt: 'Bitcoin logo'
      },
      category: 'bitcoin',
      isActive: true,
      link: '/crypto/bitcoin'
    }
  ]
};

console.log('Mock article with coinTags:', mockArticle);
console.log('coinTags length:', mockArticle.coinTags?.length);
console.log('coinTags exists:', !!mockArticle.coinTags);
console.log('coinTags is array:', Array.isArray(mockArticle.coinTags));

// Test kondisi yang digunakan di komponen
if (mockArticle.coinTags && mockArticle.coinTags.length > 0) {
  console.log('✅ Condition passed: coinTags exist and have length > 0');
} else {
  console.log('❌ Condition failed: coinTags do not exist or have length 0');
}

console.log('=== END DEBUG ===');

