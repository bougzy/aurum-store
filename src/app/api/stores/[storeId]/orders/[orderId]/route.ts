import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ storeId: string; orderId: string }> }
) {
  try {
    await connectDB();
    const { orderId } = await params;
    const order = await Order.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error('Order GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string; orderId: string }> }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { storeId, orderId } = await params;

    if (!session || session.storeId !== storeId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();
    const validStatuses = ['pending', 'awaitingConfirmation', 'confirmed', 'cancelled', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, storeId },
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
