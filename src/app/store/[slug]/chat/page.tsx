'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

interface Message {
  _id: string;
  senderId: string;
  senderRole: string;
  text: string;
  createdAt: string;
}

export default function StoreChatPage() {
  const { slug } = useParams<{ slug: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [customerId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem(`chat-id-${slug}`);
      if (!id) {
        id = uuidv4();
        localStorage.setItem(`chat-id-${slug}`, id);
      }
      return id;
    }
    return uuidv4();
  });
  const [customerName, setCustomerName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(`chat-name-${slug}`) : null;
    if (stored) {
      setCustomerName(stored);
      setNameSet(true);
    }
  }, [slug]);

  useEffect(() => {
    if (!nameSet) return;
    // Load greeting
    fetch(`/api/stores/${slug}/chatbot`)
      .then((r) => r.json())
      .then((data) => {
        if (data.config?.greetingMessage) setGreeting(data.config.greetingMessage);
      })
      .catch(() => {});

    // Load existing messages
    fetch(`/api/stores/${slug}/chat?customerId=${customerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .catch(() => {});
  }, [slug, customerId, nameSet]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 3s
  useEffect(() => {
    if (!nameSet) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/stores/${slug}/chat?customerId=${customerId}`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch { /* ignore */ }
    }, 3000);
    return () => clearInterval(interval);
  }, [slug, customerId, nameSet]);

  const handleSetName = () => {
    if (!customerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    localStorage.setItem(`chat-name-${slug}`, customerName);
    setNameSet(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${slug}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerName,
          text: newMessage,
          senderRole: 'customer',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        if (data.botReply) {
          // Add bot reply with slight delay for effect
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                _id: uuidv4(),
                senderId: 'chatbot',
                senderRole: 'storeOwner',
                text: data.botReply,
                createdAt: new Date().toISOString(),
              },
            ]);
          }, 500);
        }
        setNewMessage('');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!nameSet) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full gold-gradient mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold gold-text mb-2">Start a Chat</h2>
          <p className="text-sm text-[#f5f0e1]/50 mb-6">Enter your name to begin</p>
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Your name"
            onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
          />
          <Button variant="primary" className="w-full mt-4" onClick={handleSetName}>
            Start Chatting
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/store/${slug}`} className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-[#f5f0e1]/70">Live Chat</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {greeting && (
            <div className="flex justify-start">
              <div className="bg-dark-700 border border-dark-600 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                <p className="text-sm">{greeting}</p>
                <p className="text-xs text-[#f5f0e1]/30 mt-1">Store Bot</p>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg._id} className={`flex ${msg.senderRole === 'customer' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  msg.senderRole === 'customer'
                    ? 'bg-gold-600/20 border border-gold-500/20 rounded-br-sm'
                    : 'bg-dark-700 border border-dark-600 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-[#f5f0e1]/30 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-dark-800 border-t border-dark-700 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-[#f5f0e1] placeholder-[#f5f0e1]/30 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all"
          />
          <Button variant="primary" onClick={sendMessage} loading={loading} className="px-6">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
