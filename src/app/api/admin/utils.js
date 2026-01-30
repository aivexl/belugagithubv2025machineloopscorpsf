// Mapping kategori ke tabel database
export const TABLE_MAPPING = {
  exchanges: 'crypto_exchanges',
  airdrop: 'crypto_airdrop',
  'ico-ido': 'crypto_ico_ido',
  fundraising: 'crypto_fundraising',
  glossary: 'crypto_glossary'
};

// Field mapping untuk exchanges
export const FIELD_MAPPING = {
  exchanges: {
    'founded': 'founded',
    'tradingVolume': 'trading_volume',
    'pairs': 'pairs',
    'features': 'features',
    'region': 'region',
    'website': 'website_url',
    'logo': 'logo'
  },
  airdrop: {
    'startDate': 'start_date',
    'endDate': 'end_date',
    'totalReward': 'reward_amount',
    'totalAllocation': 'total_allocation',
    'minAllocation': 'min_allocation',
    'maxAllocation': 'max_allocation',
    'estimatedValue': 'estimated_value',
    'participants': 'participants',
    'requirements': 'requirements',
    'website': 'website_url',
    'logo': 'logo'
  },
  'ico-ido': {
    'startDate': 'start_date',
    'endDate': 'end_date',
    'price': 'price',
    'currentPrice': 'current_price',
    'totalSupply': 'total_supply',
    'raised': 'raised_amount',
    'participants': 'participants',
    'roi': 'roi',
    'vesting': 'vesting',
    'category': 'category',
    'website': 'website_url',
    'logo': 'logo',
    'type': 'type',
    'softCap': 'soft_cap',
    'hardCap': 'hard_cap',
    'investorsCount': 'investors_count'
  },
  fundraising: {
    'raised': 'raised_amount',
    'targetAmount': 'target_amount',
    'investorsCount': 'investors_count',
    'investors': 'investors',
    'valuation': 'valuation',
    'date': 'start_date',
    'round': 'round',
    'useCase': 'use_case',
    'website': 'website_url',
    'logo': 'logo'
  },
  glossary: {
    'relatedTerms': 'related_terms',
    'example': 'example',
    'definition': 'definition',
    'term': 'term',
    'category': 'category'
  }
};

export function generateDefaultLogo(name) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : 'E';
  return `https://ui-avatars.com/api/?name=${firstLetter}&background=F7931A&color=fff&size=64&font-size=0.4`;
}

export function mapFields(category, data) {
  const mapping = FIELD_MAPPING[category];
  if (!mapping) return data;

  const mappedData = {};
  Object.keys(data).forEach(key => {
    const dbField = mapping[key] || key;
    mappedData[dbField] = data[key];
  });

  // Ensure logo field exists with fallback
  if (category === 'exchanges' && !mappedData.logo) {
    mappedData.logo = generateDefaultLogo(data.name || 'Exchange');
  }

  return mappedData;
}

export function reverseMapFields(category, item) {
  const reverseMapping = {
    exchanges: {
      'founded': 'founded',
      'trading_volume': 'tradingVolume',
      'pairs': 'pairs',
      'features': 'features',
      'region': 'region',
      'website_url': 'website',
      'logo': 'logo'
    },
    airdrop: {
      'start_date': 'startDate',
      'end_date': 'endDate',
      'reward_amount': 'totalReward',
      'total_allocation': 'totalAllocation',
      'min_allocation': 'minAllocation',
      'max_allocation': 'maxAllocation',
      'estimated_value': 'estimatedValue',
      'participants': 'participants',
      'requirements': 'requirements',
      'website_url': 'website',
      'logo': 'logo'
    },
    'ico-ido': {
      'start_date': 'startDate',
      'end_date': 'endDate',
      'price': 'price',
      'current_price': 'currentPrice',
      'total_supply': 'totalSupply',
      'raised_amount': 'raised',
      'participants': 'participants',
      'roi': 'roi',
      'vesting': 'vesting',
      'category': 'category',
      'website_url': 'website',
      'logo': 'logo',
      'type': 'type',
      'soft_cap': 'softCap',
      'hard_cap': 'hardCap',
      'investors_count': 'investorsCount'
    },
    fundraising: {
      'raised_amount': 'raised',
      'target_amount': 'targetAmount',
      'investors_count': 'investorsCount',
      'investors': 'investors',
      'valuation': 'valuation',
      'start_date': 'date',
      'round': 'round',
      'use_case': 'useCase',
      'website_url': 'website',
      'logo': 'logo'
    },
    glossary: {
      'example': 'example',
      'definition': 'definition',
      'term': 'term',
      'category': 'category',
      'related_terms': 'relatedTerms'
    }
  };

  const mapping = reverseMapping[category];
  if (!mapping) return item;

  const mappedItem = { ...item };
  Object.keys(mapping).forEach(dbField => {
    const formField = mapping[dbField];
    if (item[dbField] !== undefined) {
      mappedItem[formField] = item[dbField];
    }
  });

  return mappedItem;
}

export function buildQuery(supabase, category, searchParams) {
  const tableName = TABLE_MAPPING[category];
  if (!tableName) {
    throw new Error('Invalid category');
  }

  // Sanitize search param
  const searchParam = searchParams.get('search');
  const search = searchParam ? searchParam.replace(/[,()]/g, '') : null;

  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  let query = supabase
    .from(tableName)
    .select('*', { count: 'exact' });

  // Apply search term
  if (search) {
    if (category === 'exchanges') {
      query = query.or(`name.ilike.%${search}%,region.ilike.%${search}%`);
    } else if (category === 'airdrop' || category === 'ico-ido') {
      query = query.or(`project.ilike.%${search}%,token.ilike.%${search}%`);
    } else if (category === 'fundraising') {
      query = query.or(`project.ilike.%${search}%,category.ilike.%${search}%`);
    } else if (category === 'glossary') {
      query = query.or(`term.ilike.%${search}%,definition.ilike.%${search}%`);
    }
  }

  // Apply filters
  const mapping = FIELD_MAPPING[category];
  for (const [key, value] of searchParams.entries()) {
    if (['category', 'search', 't', 'page', 'limit'].includes(key)) continue;

    // Map frontend field to database field if mapping exists
    const dbField = (mapping && mapping[key]) ? mapping[key] : key;

    if (value && value !== 'All') {
      query = query.eq(dbField, value);
    }
  }

  // Apply sorting
  query = query.order('created_at', { ascending: false });

  // Apply pagination
  if (page && limit) {
    const p = parseInt(page);
    const l = parseInt(limit);
    const from = (p - 1) * l;
    const to = from + l - 1;
    query = query.range(from, to);
  }

  return query;
}
