import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Store from '@/models/Store';
import ChatbotConfig from '@/models/ChatbotConfig';
import { signToken, setAuthCookie } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone, storeName, storeSlug } = await req.json();

    if (!name || !email || !password || !storeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const slug = slugify(storeSlug || storeName);
    const existingStore = await Store.findOne({ slug });
    if (existingStore) {
      return NextResponse.json({ error: 'Store slug already taken' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: 'storeOwner',
    });

    const store = await Store.create({
      name: storeName,
      slug,
      ownerId: user._id,
    });

    user.storeId = store._id;
    await user.save();

    await ChatbotConfig.create({
      storeId: store._id,
      greetingMessage: `Welcome to ${storeName}! How can I help you?`,
      autoReplies: [
        { keyword: 'shipping', response: 'We offer worldwide shipping on all gold products.' },
        { keyword: 'return', response: 'Returns are accepted within 14 days of delivery.' },
        { keyword: 'payment', response: 'We accept WhatsApp orders and Bitcoin payments.' },
      ],
    });

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      storeId: store._id.toString(),
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      store: {
        id: store._id,
        name: store.name,
        slug: store.slug,
      },
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
