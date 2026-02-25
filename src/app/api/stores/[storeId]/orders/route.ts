import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Store from '@/models/Store';
import { getSession } from '@/lib/auth';

export async function GET(
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { storeId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(filter);

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const { storeId } = await params;

    const store = await Store.findById(storeId);
    if (!store || !store.isActive) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const body = await req.json();
    const { customerName, customerEmail, customerPhone, items, paymentMethod, paymentProof, txHash } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate items and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, storeId, isActive: true });
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        goldPurity: product.goldPurity,
        weight: product.weight,
      });

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      storeId,
      customerName,
      customerEmail,
      customerPhone,
      items: orderItems,
      total,
      paymentMethod,
      status: paymentMethod === 'bitcoin' ? 'awaitingConfirmation' : 'pending',
      paymentProof: paymentProof || '',
      txHash: txHash || '',
      bitcoinAmount: paymentMethod === 'bitcoin' ? total / 60000 : undefined,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    console.error('Order create error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
