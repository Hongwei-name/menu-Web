import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, query, run } from '@/lib/db';

export async function GET() {
  try {
    await initializeDatabase();
    
    const categories = await query('SELECT * FROM categories ORDER BY created_at DESC');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { id, name, color } = body;

    if (!id || !name || !color) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await run(
      'INSERT INTO categories (id, name, color) VALUES (?, ?, ?)',
      [id, name, color]
    );

    const newCategory = await query('SELECT * FROM categories WHERE id = ?', [id]);
    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const body = await request.json();
    const { id, name, color } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    await run(
      'UPDATE categories SET name = ?, color = ? WHERE id = ?',
      [name, color, id]
    );

    const updatedCategory = await query('SELECT * FROM categories WHERE id = ?', [id]);
    return NextResponse.json(updatedCategory[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
    }

    await run('DELETE FROM categories WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}