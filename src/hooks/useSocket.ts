'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(storeId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('join-store', storeId);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [storeId]);

  const joinChat = useCallback((chatId: string) => {
    socketRef.current?.emit('join-chat', chatId);
  }, []);

  const sendMessage = useCallback((data: {
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
    socketRef.current?.emit('send-message', data);
  }, []);

  const onNewMessage = useCallback((callback: (message: unknown) => void) => {
    socketRef.current?.on('new-message', callback);
    return () => {
      socketRef.current?.off('new-message', callback);
    };
  }, []);

  const onChatUpdate = useCallback((callback: (data: unknown) => void) => {
    socketRef.current?.on('chat-update', callback);
    return () => {
      socketRef.current?.off('chat-update', callback);
    };
  }, []);

  const setTyping = useCallback((chatId: string, userId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { chatId, userId, isTyping });
  }, []);

  return {
    socket: socketRef.current,
    joinChat,
    sendMessage,
    onNewMessage,
    onChatUpdate,
    setTyping,
  };
}
