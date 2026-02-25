import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Store from '@/models/Store';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Chat from '@/models/Chat';

export async function GET() {
  try {
    await connectDB();

    const [totalStores, totalUsers, totalProducts, totalOrders, activeChats, totalRevenue] =
      await Promise.all([
        Store.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Chat.countDocuments({ isActive: true }),
        Order.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const storesByMonth = await Store.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    return NextResponse.json({
      totalStores,
      totalUsers,
      totalProducts,
      totalOrders,
      activeChats,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      storesByMonth,
    });
  } catch (error: unknown) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
