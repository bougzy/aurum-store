'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { IChatbotConfig } from '@/types';

interface AutoReply {
  keyword: string;
  response: string;
}

export default function ChatbotPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [greetingMessage, setGreetingMessage] = useState('Welcome! How can I help you today?');
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
    outsideMessage: "We're currently offline. We'll get back to you during business hours!",
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    if (!user?.storeId) return;

    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/stores/${user.storeId}/chatbot`);
        const data = await res.json();

        if (data.config) {
          const config: IChatbotConfig = data.config;
          setIsActive(config.isActive);
          setGreetingMessage(config.greetingMessage);
          setAutoReplies(config.autoReplies || []);
          setWorkingHours({
            start: config.workingHours?.start || '09:00',
            end: config.workingHours?.end || '18:00',
            outsideMessage: config.workingHours?.outsideMessage || "We're currently offline. We'll get back to you during business hours!",
          });
        }
      } catch {
        toast.error('Failed to load chatbot configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [user?.storeId]);

  const addAutoReply = () => {
    if (!newKeyword.trim() || !newResponse.trim()) {
      toast.error('Please enter both keyword and response');
      return;
    }

    setAutoReplies([...autoReplies, { keyword: newKeyword.trim(), response: newResponse.trim() }]);
    setNewKeyword('');
    setNewResponse('');
    toast.success('Auto-reply added');
  };

  const removeAutoReply = (index: number) => {
    setAutoReplies(autoReplies.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user?.storeId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/stores/${user.storeId}/chatbot`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive,
          greetingMessage,
          autoReplies,
          workingHours: {
            start: workingHours.start,
            end: workingHours.end,
            outsideMessage: workingHours.outsideMessage,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Chatbot configuration saved');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gold-text">Chatbot Configuration</h1>
          <p className="text-dark-500 mt-1">Configure automated responses for your customers</p>
        </div>
        <Button onClick={handleSave} loading={saving}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Configuration
        </Button>
      </div>

      {/* Chatbot toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gold-200 font-medium">Chatbot Status</h2>
            <p className="text-dark-500 text-sm mt-1">
              {isActive ? 'Chatbot is active and responding to customers' : 'Chatbot is disabled'}
            </p>
          </div>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
              isActive ? 'bg-gold-500' : 'bg-dark-600'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                isActive ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Greeting message */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Greeting Message</h2>
        <p className="text-dark-500 text-sm mb-3">This message is shown when a customer starts a new chat</p>
        <textarea
          className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] placeholder-dark-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200 min-h-[80px] resize-y"
          placeholder="Enter greeting message..."
          value={greetingMessage}
          onChange={(e) => setGreetingMessage(e.target.value)}
        />
      </Card>

      {/* Auto-replies */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Auto-Replies</h2>
        <p className="text-dark-500 text-sm mb-4">
          When a customer message contains a keyword, the chatbot will automatically respond
        </p>

        {/* Existing auto-replies */}
        {autoReplies.length > 0 && (
          <div className="space-y-2 mb-6">
            {autoReplies.map((reply, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-dark-700/50 rounded-lg px-4 py-3 border border-dark-600"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-dark-500 uppercase tracking-wider">Keyword</span>
                    <span className="text-gold-300 text-sm font-medium">{reply.keyword}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-dark-500 uppercase tracking-wider mt-0.5">Response</span>
                    <span className="text-gold-200 text-sm">{reply.response}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeAutoReply(index)}
                  className="text-dark-500 hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                  title="Remove auto-reply"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new auto-reply */}
        <div className="space-y-3 p-4 bg-dark-700/30 rounded-lg border border-dashed border-dark-600">
          <p className="text-gold-300 text-sm font-medium">Add New Auto-Reply</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Keyword"
              placeholder="e.g., shipping, price, hours"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
            />
            <Input
              label="Response"
              placeholder="Bot reply when keyword is detected"
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={addAutoReply}>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Auto-Reply
          </Button>
        </div>
      </Card>

      {/* Working hours */}
      <Card>
        <h2 className="text-gold-200 font-medium mb-4">Working Hours</h2>
        <p className="text-dark-500 text-sm mb-4">
          Set your business hours. Outside these hours, the chatbot will send an automated message.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gold-300 mb-1.5">Start Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200"
                value={workingHours.start}
                onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gold-300 mb-1.5">End Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200"
                value={workingHours.end}
                onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gold-300 mb-1.5">Outside Hours Message</label>
            <textarea
              className="w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] placeholder-dark-500/70 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200 min-h-[80px] resize-y"
              placeholder="Message sent when customers reach out outside working hours..."
              value={workingHours.outsideMessage}
              onChange={(e) => setWorkingHours({ ...workingHours, outsideMessage: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Bottom save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} size="lg">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
