import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    await connectDB();
    const { productId } = await params;
    const product = await Product.findById(productId).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error('Product GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { storeId, productId } = await params;

    if (!session || session.role !== 'storeOwner' || session.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    const allowedFields = ['name', 'description', 'images', 'goldPurity', 'weight', 'price', 'stock', 'isActive'];
    const sanitized: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) sanitized[key] = updates[key];
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, storeId },
      { $set: sanitized },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { storeId, productId } = await params;

    if (!session || session.role !== 'storeOwner' || session.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Product.findOneAndDelete({ _id: productId, storeId });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Product delete error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
