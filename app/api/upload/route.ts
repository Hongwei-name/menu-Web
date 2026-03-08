import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    const fileExtension = path.extname(file.name);
    const allowedExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.svg'];
    
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file type. Allowed types: ico, png, jpg, jpeg, svg' }, { status: 400 });
    }
    
    const logosDir = path.join(process.cwd(), 'public', 'logos');
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
    }
    
    const fileName = `${Date.now()}${fileExtension}`;
    const filePath = path.join(logosDir, fileName);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    fs.writeFileSync(filePath, buffer);
    
    const logoPath = `/logos/${fileName}`;
    
    return NextResponse.json({ logoPath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
