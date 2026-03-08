import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, query, run } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    
    const settings = await query('SELECT * FROM settings');
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting: any) => {
      settingsMap[setting.key] = setting.value;
    });
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await run(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, value]
    );

    const newSetting = await query('SELECT * FROM settings WHERE key = ?', [key]);
    return NextResponse.json(newSetting[0], { status: 201 });
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Missing setting key' }, { status: 400 });
    }

    await run(
      'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
      [value, key]
    );

    const updatedSetting = await query('SELECT * FROM settings WHERE key = ?', [key]);
    return NextResponse.json(updatedSetting[0]);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Missing setting key' }, { status: 400 });
    }

    await run('DELETE FROM settings WHERE key = ?', [key]);

    return NextResponse.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}