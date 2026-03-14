'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import {
  Send,
  Mic,
  Sparkles,
  User,
  Bot,
  Volume2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      "Hey there 💜 I'm Peaclify, your personal wellness companion. How are you feeling today? No filters needed — this is a safe space.",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          data.message?.content ||
          "I'm here for you. Could you tell me more about what you're feeling?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm having a little trouble connecting right now, but I'm still here for you. Try again in a moment? 💜",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6 text-nebula" />
              Chat with <span className="glow-text">Peaclify</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-sm mt-1"
            >
              Your empathetic AI companion — always here to listen
            </motion.p>
          </div>

          {/* Voice Orb (Hume AI placeholder) */}
          <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nebula to-ember flex items-center justify-center relative">
              <Volume2 className="w-6 h-6 text-white relative z-10" />
              {/* Pulsing glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-nebula to-ember animate-pulse-glow opacity-50 blur-md" />
              <div className="absolute inset-[-4px] rounded-full border-2 border-nebula/20 animate-pulse-glow" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Voice Mode
            </span>
          </motion.div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-br from-nebula to-ember'
                      : 'bg-white/10'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.role === 'assistant'
                      ? 'glass-card bg-white/[0.03]'
                      : 'bg-gradient-to-br from-nebula/30 to-nebula/10 border border-nebula/20'
                  }`}
                >
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-2">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-nebula to-ember flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="glass-card px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-nebula"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4">
          <div className="glass-strong p-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type something... I'm listening 💜"
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base resize-none outline-none px-4 py-3 max-h-32"
              style={{ minHeight: '44px' }}
            />
            <div className="flex items-center gap-1 pb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Voice input"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-gradient-to-br from-nebula to-ember text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            Peaclify is an AI companion, not a licensed therapist. If you&apos;re in
            crisis, please reach out to a professional or call 988 Suicide &amp;
            Crisis Lifeline.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
