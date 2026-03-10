import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth';
import { authOptions, isLocalDevBypass } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!isLocalDevBypass()) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  try {
    const blob = await put(`bonus-cards/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error('[UPLOAD-ERROR]', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
