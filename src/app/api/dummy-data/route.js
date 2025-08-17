import { NextResponse } from 'next/server';
import { getDummyData, getDummyDataById, searchDummyData } from '@/data/dummyData';

// API route for dummy data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const search = searchParams.get('search');

    // If no type specified, return all data types
    if (!type) {
      return NextResponse.json({
        success: true,
        message: 'Please specify a data type: exchanges, airdrops, fundraising, or ico',
        availableTypes: ['exchanges', 'airdrops', 'fundraising', 'ico'],
        timestamp: new Date().toISOString()
      });
    }

    let data = [];

    // Get data by type
    if (type) {
      data = getDummyData(type);
    }

    // Filter by ID if specified
    if (id) {
      const item = getDummyDataById(type, parseInt(id));
      if (item) {
        data = [item];
      } else {
        return NextResponse.json({
          success: false,
          error: `Item with ID ${id} not found in ${type}`,
          timestamp: new Date().toISOString()
        }, { status: 404 });
      }
    }

    // Search functionality
    if (search && search.trim()) {
      data = searchDummyData(type, search);
    }

    // Return the data
    return NextResponse.json({
      success: true,
      type: type,
      data: data,
      total: data.length,
      timestamp: new Date().toISOString(),
      source: 'Dummy Data (Manual Entry)',
      note: 'This data can be manually updated in src/data/dummyData.js'
    });

  } catch (error) {
    console.error('💥 Dummy Data API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST method for adding new data (for future manual updates)
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({
        success: false,
        error: 'Type and data are required',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // This would typically save to a database
    // For now, just return success message
    return NextResponse.json({
      success: true,
      message: `Data added to ${type} successfully`,
      note: 'To permanently save data, update src/data/dummyData.js manually',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Invalid request body',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}
