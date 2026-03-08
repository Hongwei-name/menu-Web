import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, query, run } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM urls';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' WHERE category = ?';
      params.push(category);
    }

    if (search) {
      sql += (params.length > 0 ? ' AND' : ' WHERE') + ' (title LIKE ? OR url LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const urls = await query(sql, params);
    return NextResponse.json(urls);
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { id, title, url, category, description, logo_path } = body;

    if (!title || !url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const urlId = id || `url-${Date.now()}`;

    await run(
      'INSERT INTO urls (id, title, url, category, description, logo_path) VALUES (?, ?, ?, ?, ?, ?)',
      [urlId, title, url, category, description || '', logo_path || '']
    );

    const newUrl = await query('SELECT * FROM urls WHERE id = ?', [urlId]);
    return NextResponse.json(newUrl[0], { status: 201 });
  } catch (error) {
    console.error('Error creating URL:', error);
    return NextResponse.json({ error: 'Failed to create URL' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { id, title, url, category, description, logo_path } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing URL ID' }, { status: 400 });
    }

    await run(
      'UPDATE urls SET title = ?, url = ?, category = ?, description = ?, logo_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, url, category, description, logo_path, id]
    );

    const updatedUrl = await query('SELECT * FROM urls WHERE id = ?', [id]);
    return NextResponse.json(updatedUrl[0]);
  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing URL ID' }, { status: 400 });
    }

    await run('DELETE FROM urls WHERE id = ?', [id]);

    return NextResponse.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}