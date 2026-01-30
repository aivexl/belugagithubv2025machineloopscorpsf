// API route untuk admin operations (simplified)
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Mapping kategori ke tabel database
const TABLE_MAPPING = {
  exchanges: 'crypto_exchanges',
  airdrop: 'crypto_airdrop',
  'ico-ido': 'crypto_ico_ido',
  fundraising: 'crypto_fundraising',
  glossary: 'crypto_glossary'
};

// Field mapping untuk exchanges
const FIELD_MAPPING = {
  exchanges: {
    // Form field -> Database field
    'founded': 'founded',
    'tradingVolume': 'trading_volume',
    'pairs': 'pairs',
    'features': 'features',
    'region': 'region',
    'website': 'website_url', // Mungkin masih website_url di database
    'logo': 'logo'            // Gunakan field logo langsung
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

// Helper function untuk map fields
function mapFields(category, data) {
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

// Helper function untuk generate default logo
function generateDefaultLogo(name) {
  const firstLetter = name ? name.charAt(0).toUpperCase() : 'E';
  return `https://ui-avatars.com/api/?name=${firstLetter}&background=F7931A&color=fff&size=64&font-size=0.4`;
}

// Helper function untuk reverse mapping (database -> form)
function reverseMapFields(category, item) {
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

// GET - Ambil data
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const searchParam = searchParams.get('search');
    // Sanitize search param to prevent PostgREST injection (remove commas and parentheses)
    const search = searchParam ? searchParam.replace(/[,()]/g, '') : null;
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    // Start building the query
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

    // Apply pagination (must be applied after filters for correct data slice)
    if (page && limit) {
      const p = parseInt(page);
      const l = parseInt(limit);
      const from = (p - 1) * l;
      const to = from + l - 1;
      query = query.range(from, to);
    }

    // Execute query once
    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process data with reverse mapping and ensure valid logos
    const processedData = (data || []).map(item => {
      // Apply reverse mapping to convert database fields to form fields
      const mappedItem = reverseMapFields(category, item);
      
      // Ensure valid logos for all categories
      if (category === 'exchanges') {
        mappedItem.logo = mappedItem.logo || mappedItem.logo_url || generateDefaultLogo(mappedItem.name || 'Exchange');
      } else if (category === 'airdrop' || category === 'ico-ido' || category === 'fundraising') {
        mappedItem.logo = mappedItem.logo || mappedItem.logo_url || generateDefaultLogo(mappedItem.project || 'Project');
      }
      
      return mappedItem;
    });

    return NextResponse.json({ data: processedData, total: count || 0 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Tambah data
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, itemData } = body;
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    const mappedData = mapFields(category, itemData);
    
    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('Category:', category);
      console.log('Table name:', tableName);
      console.log('Original data:', itemData);
      console.log('Mapped data:', mappedData);
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([mappedData])
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
      console.error('Table:', tableName);
      console.error('Data:', mappedData);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update data
export async function PUT(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, id, updateData } = body;
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    const mappedData = mapFields(category, updateData);
    
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...mappedData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Hapus data
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll') === 'true';
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (!id && !deleteAll) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    
    let result;
    if (deleteAll) {
      result = await supabase
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
        .select();
    } else {
      result = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error('Error deleting item:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
