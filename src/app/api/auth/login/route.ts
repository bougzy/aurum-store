import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Store from '@/models/Store';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let storeId: string | undefined;
    if (user.role === 'storeOwner' && user.storeId) {
      storeId = user.storeId.toString();
    } else if (user.role === 'storeOwner') {
      const store = await Store.findOne({ ownerId: user._id });
      if (store) {
        storeId = store._id.toString();
        user.storeId = store._id;
        await user.save();
      }
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      storeId,
      name: user.name,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId,
      },
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
