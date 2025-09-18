import { NextResponse } from 'next/server';

// Simpan data di memory
let fundraisingData = [];

export async function GET() {
  return NextResponse.json(fundraisingData);
}

export async function POST(request) {
  try {
    const newFundraising = await request.json();
    
    if (!newFundraising.id) {
      newFundraising.id = Date.now().toString();
    }
    
    newFundraising.created_at = new Date().toISOString();
    newFundraising.updated_at = new Date().toISOString();
    
    fundraisingData.push(newFundraising);
    
    return NextResponse.json(newFundraising, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fundraising' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedFundraising = await request.json();
    const index = fundraisingData.findIndex(f => f.id === updatedFundraising.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Fundraising not found' }, { status: 404 });
    }
    
    updatedFundraising.updated_at = new Date().toISOString();
    fundraisingData[index] = updatedFundraising;
    
    return NextResponse.json(updatedFundraising);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update fundraising' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const index = fundraisingData.findIndex(f => f.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Fundraising not found' }, { status: 404 });
    }
    
    fundraisingData.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete fundraising' }, { status: 500 });
  }
}
