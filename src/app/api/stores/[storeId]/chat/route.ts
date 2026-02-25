import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Chat from '@/models/Chat';
import Message from '@/models/Message';
import ChatbotConfig from '@/models/ChatbotConfig';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const { storeId } = await params;
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const customerId = searchParams.get('customerId');

    if (chatId) {
      const messages = await Message.find({ chatId })
        .sort({ createdAt: 1 })
        .lean();
      return NextResponse.json({ messages });
    }

    if (customerId) {
      let chat = await Chat.findOne({ storeId, customerId }).lean();
      if (!chat) {
        return NextResponse.json({ chat: null, messages: [] });
      }
      const messages = await Message.find({ chatId: chat._id })
        .sort({ createdAt: 1 })
        .lean();
      return NextResponse.json({ chat, messages });
    }

    // Store owner: get all chats
    const session = await getSession();
    if (session?.storeId === storeId) {
      const chats = await Chat.find({ storeId })
        .sort({ lastMessageAt: -1 })
        .lean();
      return NextResponse.json({ chats });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error: unknown) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    await connectDB();
    const { storeId } = await params;
    const { customerId, customerName, text, senderRole } = await req.json();

    if (!customerId || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find or create chat
    let chat = await Chat.findOne({ storeId, customerId });
    if (!chat) {
      chat = await Chat.create({
        storeId,
        customerId,
        customerName: customerName || 'Customer',
      });
    }

    const message = await Message.create({
      chatId: chat._id,
      senderId: customerId,
      senderRole: senderRole || 'customer',
      text,
    });

    chat.lastMessage = text;
    chat.lastMessageAt = new Date();
    await chat.save();

    // Check for chatbot auto-replies
    let botReply = null;
    if (senderRole === 'customer') {
      const config = await ChatbotConfig.findOne({ storeId, isActive: true });
      if (config) {
        // Check working hours
        const now = new Date();
        const hours = now.getHours();
        const startHour = parseInt(config.workingHours.start.split(':')[0]);
        const endHour = parseInt(config.workingHours.end.split(':')[0]);

        if (hours < startHour || hours >= endHour) {
          botReply = config.workingHours.outsideMessage;
        } else {
          // Check keyword triggers
          const lowerText = text.toLowerCase();
          for (const reply of config.autoReplies) {
            if (lowerText.includes(reply.keyword.toLowerCase())) {
              botReply = reply.response;
              break;
            }
          }
        }

        if (botReply) {
          await Message.create({
            chatId: chat._id,
            senderId: 'chatbot',
            senderRole: 'storeOwner',
            text: botReply,
          });
          chat.lastMessage = botReply;
          chat.lastMessageAt = new Date();
          await chat.save();
        }
      }
    }

    return NextResponse.json({ message, botReply }, { status: 201 });
  } catch (error: unknown) {
    console.error('Chat POST error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
