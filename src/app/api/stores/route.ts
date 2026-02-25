import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Store from '@/models/Store';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();

    // If store owner, return their store
    if (session?.role === 'storeOwner' && session.storeId) {
      const store = await Store.findById(session.storeId).lean();
      return NextResponse.json({ store });
    }

    // Public: lookup by slug or return active stores
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get('slug');
    if (slugParam) {
      const store = await Store.findOne({ slug: slugParam, isActive: true }).lean();
      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }
      return NextResponse.json({ store, stores: [store] });
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const stores = await Store.find({ isActive: true })
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Store.countDocuments({ isActive: true });

    return NextResponse.json({ stores, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    console.error('Stores GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session || session.role !== 'storeOwner' || !session.storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    const allowedFields = ['name', 'description', 'logo', 'whatsappNumber', 'bitcoinWallet'];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }

    const store = await Store.findByIdAndUpdate(
      session.storeId,
      { $set: sanitized },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ store });
  } catch (error: unknown) {
    console.error('Store update error:', error);
    return NextResponse.json({ error: 'Failed to update store' }, { status: 500 });
  }
}
