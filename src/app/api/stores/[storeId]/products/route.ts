import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const { storeId } = await params;

    // Check if storeId is actually a slug
    let actualStoreId = storeId;
    if (!storeId.match(/^[0-9a-fA-F]{24}$/)) {
      const store = await Store.findOne({ slug: storeId });
      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }
      actualStoreId = store._id.toString();
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const products = await Product.find({ storeId: actualStoreId, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments({ storeId: actualStoreId, isActive: true });

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { storeId } = await params;

    if (!session || session.role !== 'storeOwner' || session.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const product = await Product.create({
      storeId,
      name: body.name,
      description: body.description,
      images: body.images || [],
      goldPurity: body.goldPurity,
      weight: body.weight,
      price: body.price,
      stock: body.stock || 0,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
