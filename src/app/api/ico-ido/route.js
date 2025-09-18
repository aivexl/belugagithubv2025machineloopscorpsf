import { NextResponse } from 'next/server';

// Simpan data di memory
let airdropsData = [];

export async function GET() {
  return NextResponse.json(airdropsData);
}

export async function POST(request) {
  try {
    const newAirdrop = await request.json();
    
    if (!newAirdrop.id) {
      newAirdrop.id = Date.now().toString();
    }
    
    newAirdrop.created_at = new Date().toISOString();
    newAirdrop.updated_at = new Date().toISOString();
    
    airdropsData.push(newAirdrop);
    
    return NextResponse.json(newAirdrop, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create airdrop' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const updatedAirdrop = await request.json();
    const index = airdropsData.findIndex(a => a.id === updatedAirdrop.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Airdrop not found' }, { status: 404 });
    }
    
    updatedAirdrop.updated_at = new Date().toISOString();
    airdropsData[index] = updatedAirdrop;
    
    return NextResponse.json(updatedAirdrop);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update airdrop' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const index = airdropsData.findIndex(a => a.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Airdrop not found' }, { status: 404 });
    }
    
    airdropsData.splice(index, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete airdrop' }, { status: 500 });
  }
}
