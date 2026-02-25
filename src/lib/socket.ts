import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function getIO(): SocketIOServer | null {
  return io;
}

export function initSocket(httpServer: HTTPServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join store-specific chat room
    socket.on('join-store', (storeId: string) => {
      socket.join(`store-${storeId}`);
      console.log(`Socket ${socket.id} joined store-${storeId}`);
    });

    // Join specific chat room
    socket.on('join-chat', (chatId: string) => {
      socket.join(`chat-${chatId}`);
      console.log(`Socket ${socket.id} joined chat-${chatId}`);
    });

    // Handle new message
    socket.on('send-message', (data: {
      chatId: string;
      storeId: string;
      message: {
        _id: string;
        senderId: string;
        senderRole: string;
        text: string;
        createdAt: string;
      };
    }) => {
      // Broadcast to chat room
      socket.to(`chat-${data.chatId}`).emit('new-message', data.message);
      // Notify store owner
      socket.to(`store-${data.storeId}`).emit('chat-update', {
        chatId: data.chatId,
        message: data.message,
      });
    });

    // Typing indicator
    socket.on('typing', (data: { chatId: string; userId: string; isTyping: boolean }) => {
      socket.to(`chat-${data.chatId}`).emit('user-typing', data);
    });

    // Online status
    socket.on('online', (data: { storeId: string; userId: string }) => {
      socket.to(`store-${data.storeId}`).emit('user-online', data.userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}
