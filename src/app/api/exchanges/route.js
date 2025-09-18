import { NextResponse } from 'next/server';

// Simpan data di memory (akan hilang saat restart, tapi OK untuk testing)
let exchangesData = [];

export async function GET() {
  return NextResponse.json(exchangesData);
}

export async function POST(request) {
  try {
    const newExchange = await request.json();
    
    // Generate ID jika tidak ada
    if (!newExchange.id) {
      newExchange.id = Date.now().toString();
    }
    
    // Add timestamp
    newExchange.created_at = new Date().toISOString();
    newExchange.updated_at = new Date().toISOString();
    
    exchangesData.push(newExchange);
    
    return NextResponse.json(newExchange, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create exchange' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedExchange = await request.json();
    const index = exchangesData.findIndex(e => e.id === updatedExchange.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Exchange not found' }, { status: 404 });
    }
    
    updatedExchange.updated_at = new Date().toISOString();
    exchangesData[index] = updatedExchange;
    
    return NextResponse.json(updatedExchange);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exchange' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const index = exchangesData.findIndex(e => e.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Exchange not found' }, { status: 404 });
    }
    
    exchangesData.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exchange' }, { status: 500 });
  }
}
