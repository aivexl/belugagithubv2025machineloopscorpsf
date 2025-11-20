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

    return NextResponse.json({ data: data || [] });
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
    
    const { data, error } = await supabase
      .from(tableName)
      .insert([itemData])
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
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
    
    const { data, error } = await supabase
      .from(tableName)
      .update({ ...updateData, updated_at: new Date().toISOString() })
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






























