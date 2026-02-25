import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Store from '@/models/Store';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const stores = await Store.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Store.countDocuments();

    // Get product/order counts for each store
    const enriched = await Promise.all(
      stores.map(async (store) => {
        const productCount = await Product.countDocuments({ storeId: store._id });
        const orderCount = await Order.countDocuments({ storeId: store._id });
        return { ...store, productCount, orderCount };
      })
    );

    return NextResponse.json({ stores: enriched, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    console.error('Admin stores GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { storeId, action } = await req.json();

    if (!storeId || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (action === 'suspend') {
      await Store.findByIdAndUpdate(storeId, { isActive: false });
    } else if (action === 'activate') {
      await Store.findByIdAndUpdate(storeId, { isActive: true });
    } else if (action === 'delete') {
      const store = await Store.findById(storeId);
      if (store) {
        await Product.deleteMany({ storeId });
        await Order.deleteMany({ storeId });
        await Store.findByIdAndDelete(storeId);
        await User.findByIdAndUpdate(store.ownerId, { storeId: null });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Admin store action error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
