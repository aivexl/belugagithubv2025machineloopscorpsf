import { NextResponse } from 'next/server';
import Moralis from 'moralis';

// Initialize Moralis
const initializeMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }
};

export async function GET(request) {
  try {
    await initializeMoralis();
    
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('contractAddress');
    const chain = searchParams.get('chain') || '1';
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const eventName = searchParams.get('eventName'); // Optional: specific event name

    if (!contractAddress) {
      return NextResponse.json(
        { error: 'Contract address parameter is required' },
        { status: 400 }
      );
    }

    // Get contract events
    const response = await Moralis.EvmApi.events.getContractEvents({
      address: contractAddress,
      chain,
      limit: parseInt(limit),
      ...(eventName && { topic: eventName }),
    });

    return NextResponse.json({
      success: true,
      data: response.raw,
      pagination: {
        total: response.raw.total || response.raw.result?.length || 0,
        page: 1,
        limit: parseInt(limit),
        offset: 0,
      }
    });

  } catch (error) {
    console.error('Moralis API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch contract events',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 