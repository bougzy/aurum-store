'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { formatDate, getInitials, truncate } from '@/lib/utils';
import toast from 'react-hot-toast';
import { IChat, IMessage } from '@/types';

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<IChat[]>([]);
  const [activeChat, setActiveChat] = useState<IChat | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = useCallback(async () => {
    if (!user?.storeId) return;
    try {
      const res = await fetch(`/api/stores/${user.storeId}/chat`);
      const data = await res.json();
      setChats(data.chats || []);
    } catch {
      // Silently fail on poll
    } finally {
      setLoading(false);
    }
  }, [user?.storeId]);

  const fetchMessages = useCallback(async (chatId: string) => {
    if (!user?.storeId) return;
    try {
      const res = await fetch(`/api/stores/${user.storeId}/chat?chatId=${chatId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      // Silently fail on poll
    }
  }, [user?.storeId]);

  // Initial load
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Poll for new messages when a chat is active
  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
    }

    if (activeChat) {
      fetchMessages(activeChat._id);

      pollRef.current = setInterval(() => {
        fetchMessages(activeChat._id);
        fetchChats();
      }, 3000);
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [activeChat, fetchMessages, fetchChats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectChat = (chat: IChat) => {
    setActiveChat(chat);
    setMobileChatOpen(true);
  };

  const sendMessage = async () => {
    if (!user?.storeId || !activeChat || !newMessage.trim()) return;

    setSending(true);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: activeChat.customerId,
          text: newMessage.trim(),
          senderRole: 'storeOwner',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewMessage('');
      fetchMessages(activeChat._id);
      fetchChats();
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (date: Date | string | undefined) => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold gold-text">Chat</h1>
        <p className="text-dark-500 mt-1">Communicate with your customers</p>
      </div>

      <div className="flex h-[calc(100vh-220px)] bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
        {/* Chat list - left panel */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-dark-600 flex flex-col flex-shrink-0 ${
            mobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-dark-600">
            <h2 className="text-gold-200 font-medium">Conversations</h2>
            <p className="text-dark-500 text-xs mt-0.5">{chats.length} chat{chats.length !== 1 ? 's' : ''}</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <svg className="w-12 h-12 text-dark-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-dark-500 text-sm">No conversations yet</p>
                <p className="text-dark-500/60 text-xs mt-1">Customer messages will appear here</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  className={`w-full text-left px-4 py-3.5 border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${
                    activeChat?._id === chat._id ? 'bg-dark-700/50 border-l-2 border-l-gold-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold-400 text-xs font-bold">{getInitials(chat.customerName)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-gold-200 text-sm font-medium truncate">{chat.customerName}</p>
                        <span className="text-dark-500 text-xs flex-shrink-0">
                          {formatRelativeTime(chat.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-dark-500 text-xs mt-0.5 truncate">
                        {chat.lastMessage ? truncate(chat.lastMessage, 50) : 'No messages'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat messages - right panel */}
        <div
          className={`flex-1 flex flex-col ${
            mobileChatOpen ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-dark-600 flex items-center gap-3">
                <button
                  onClick={() => setMobileChatOpen(false)}
                  className="md:hidden text-dark-500 hover:text-gold-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <span className="text-gold-400 text-xs font-bold">{getInitials(activeChat.customerName)}</span>
                </div>
                <div>
                  <p className="text-gold-200 font-medium text-sm">{activeChat.customerName}</p>
                  <p className="text-dark-500 text-xs">Customer</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-dark-500 text-sm">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwner = msg.senderRole === 'storeOwner';
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isOwner
                              ? 'bg-gold-500/10 border border-gold-500/20 text-gold-200'
                              : 'bg-dark-700 border border-dark-600 text-gold-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                          <p className={`text-xs mt-1 ${isOwner ? 'text-gold-500/50' : 'text-dark-500'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-dark-600">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 bg-dark-700 border border-dark-600 rounded-xl text-[#f5f0e1] placeholder-dark-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    loading={sending}
                    disabled={sending || !newMessage.trim()}
                    className="rounded-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-gold-200 font-medium mb-1">Select a conversation</h3>
                <p className="text-dark-500 text-sm">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
