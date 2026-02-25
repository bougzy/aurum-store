import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChatbotConfig from '@/models/ChatbotConfig';
import { getSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const { storeId } = await params;
    const config = await ChatbotConfig.findOne({ storeId }).lean();
    return NextResponse.json({ config });
  } catch (error: unknown) {
    console.error('Chatbot config GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { storeId } = await params;

    if (!session || session.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    const config = await ChatbotConfig.findOneAndUpdate(
      { storeId },
      { $set: updates },
      { new: true, upsert: true }
    ).lean();

    return NextResponse.json({ config });
  } catch (error: unknown) {
    console.error('Chatbot config PUT error:', error);
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
