import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, query, run } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    
    const { id } = params;
    const body = await request.json();
    const { title, url, category, description, logo_path } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (url !== undefined) {
      updates.push('url = ?');
      values.push(url);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (logo_path !== undefined) {
      updates.push('logo_path = ?');
      values.push(logo_path);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await run(
      `UPDATE urls SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedUrl = await query('SELECT * FROM urls WHERE id = ?', [id]);
    if (!updatedUrl || updatedUrl.length === 0) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUrl[0]);
  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    
    const { id } = params;

    await run('DELETE FROM urls WHERE id = ?', [id]);

    return NextResponse.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 });
  }
}
