// API route untuk admin operations (simplified)
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sqjqirkrcfczypxygdtm.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxanFpcmtyY2ZjenlweHlnZHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzE5MDAsImV4cCI6MjA3MTU0NzkwMH0.7Tnurb-zS8n_KeuE_K2rA_RlLSVsk2E4S3YiTf9MfhI';

// Create client dengan anon key
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

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

    return NextResponse.json({ data: processedData });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Tambah data
export async function POST(request) {
  try {
    const body = await request.json();
    const { category, itemData } = body;
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    const mappedData = mapFields(category, itemData);
    
    // Debug logging
    console.log('Category:', category);
    console.log('Table name:', tableName);
    console.log('Original data:', itemData);
    console.log('Mapped data:', mappedData);
    
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
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');
    
    if (!category || !TABLE_MAPPING[category] || !id) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const tableName = TABLE_MAPPING[category];
    
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select()
      .single();

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
