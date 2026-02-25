'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface BotMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const FAQ_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['create', 'store', 'start', 'begin', 'new store'],
    response: 'To create your gold store:\n\n1. Click "Create Store" or go to the Register page\n2. Fill in your details (name, email, password)\n3. Choose a store name and slug\n4. Your store will be created automatically!\n\nYour store URL will be: domain.com/store/your-slug',
  },
  {
    keywords: ['product', 'add product', 'listing', 'sell'],
    response: 'To add products to your store:\n\n1. Go to your Dashboard > Products\n2. Click "Add Product"\n3. Fill in: Name, Description, Gold Purity, Weight, Price, Stock\n4. Upload product images\n5. Save!\n\nYour products will appear on your store page immediately.',
  },
  {
    keywords: ['payment', 'pay', 'bitcoin', 'btc', 'whatsapp'],
    response: 'AurumStore supports two payment methods:\n\n1. **WhatsApp Checkout**: Customer gets redirected to WhatsApp with a pre-filled order summary\n2. **Bitcoin Payment**: Customer sends BTC to your wallet address and uploads proof\n\nConfigure both in Dashboard > Settings.',
  },
  {
    keywords: ['order', 'manage', 'confirm', 'track'],
    response: 'To manage orders:\n\n1. Go to Dashboard > Orders\n2. View orders by status (Pending, Awaiting Confirmation, Confirmed)\n3. For Bitcoin orders, verify the payment proof and confirm/reject\n4. Track all your orders in one place',
  },
  {
    keywords: ['chat', 'message', 'customer', 'talk'],
    response: 'The real-time chat system lets you:\n\n1. Receive messages from customers browsing your store\n2. Reply in real-time from Dashboard > Chat\n3. Set up auto-responses in Dashboard > Chatbot\n4. Configure working hours and greeting messages',
  },
  {
    keywords: ['subscription', 'plan', 'pricing', 'cost', 'free'],
    response: 'AurumStore is currently free to use! Create your store, add unlimited products, and start selling with no fees.\n\nPremium tiers with advanced features may be available in the future.',
  },
  {
    keywords: ['help', 'support', 'contact'],
    response: 'I can help you with:\n\n- Creating your store\n- Adding products\n- Managing orders\n- Payment setup\n- Chat configuration\n- Subscription info\n\nJust type your question!',
  },
];

const GREETING = "Hi! I'm the AurumStore assistant. I can help you with creating stores, managing products, payments, and more. What would you like to know?";

export default function PlatformChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    { id: 0, text: GREETING, sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase();
    for (const faq of FAQ_RESPONSES) {
      if (faq.keywords.some((kw) => lower.includes(kw))) {
        return faq.response;
      }
    }
    return "I'm not sure about that. Try asking about:\n- Creating a store\n- Adding products\n- Payment methods\n- Order management\n- Chat features\n- Pricing";
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: BotMessage = { id: idRef.current++, text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMsg: BotMessage = { id: idRef.current++, text: botResponse, sender: 'bot' };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/30 hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[500px] bg-dark-800 border border-dark-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-dark-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-dark-900 font-bold text-sm">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm">AurumStore Assistant</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[85%] text-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-gold-600/20 border border-gold-500/20 rounded-br-sm'
                      : 'bg-dark-700 border border-dark-600 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-dark-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-sm text-[#f5f0e1] placeholder-[#f5f0e1]/30 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
            />
            <Button variant="primary" size="sm" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
