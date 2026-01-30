// API route untuk admin operations (simplified)
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  TABLE_MAPPING,
  mapFields,
  reverseMapFields,
  generateDefaultLogo,
  buildQuery
} from './utils';

// GET - Ambil data
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category || !TABLE_MAPPING[category]) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const query = buildQuery(supabase, category, searchParams);
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
