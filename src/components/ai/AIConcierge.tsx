'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Bot, X, Send, Sparkles, User, ShieldCheck } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIConcierge({ locale }: { locale: string }) {
  const t = useTranslations('AIConcierge');
  const isAr = locale === 'ar';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Session & Expiration Check
  useEffect(() => {
    let sid = localStorage.getItem('neoma_ai_session');
    let lastTime = localStorage.getItem('neoma_ai_time');
    const now = Date.now();

    // 30-minute idle session expiration check
    if (!sid || !lastTime || now - Number(lastTime) > 30 * 60 * 1000) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('neoma_ai_session', sid);
    }
    localStorage.setItem('neoma_ai_time', String(now));
    setSessionId(sid);

    setMessages([{ role: 'assistant', content: t('welcome') }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || limitReached) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    trackEvent(TRACKING_EVENTS.AI_CONCIERGE_INTERACTION, { prompt: userMessage.content });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, messages: updatedMessages }),
      });

      const data = await res.json();

      if (data.content) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
      }

      if (data.limitReached) {
        setLimitReached(true);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Our concierge services are currently processing another inquiry. Please try again shortly.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gold-gradient text-neoma-black font-bold shadow-gold-glow hover:scale-105 transition-all flex items-center gap-2"
        title={t('title')}
      >
        <Bot className="w-6 h-6" />
        <span className="hidden md:inline text-xs font-mono uppercase tracking-wider">
          AI Concierge
        </span>
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-md glass-panel border border-neoma-gold/40 rounded-3xl overflow-hidden shadow-gold-glow bg-neoma-black/95 flex flex-col h-[520px]"
          >
            {/* Header */}
            <div className="p-4 bg-neoma-dark border-b border-neoma-gold/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neoma-gold/20 border border-neoma-gold flex items-center justify-center text-neoma-gold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-playfair font-bold text-neoma-ivory">
                    {t('title')}
                  </h4>
                  <span className="text-[10px] font-mono text-neoma-emerald block">
                    • Online • OpenAI GPT-4o
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-neoma-gray-400 hover:text-neoma-gold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Thread */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-neoma-surface border border-neoma-gold/30 flex items-center justify-center text-neoma-gold flex-shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-neoma-gold text-neoma-black font-medium rounded-tr-none'
                        : 'glass-panel text-neoma-ivory border-neoma-gold/20 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 text-neoma-gold text-xs items-center pl-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Curating answer...</span>
                </div>
              )}

              {limitReached && (
                <div className="p-3 rounded-xl bg-neoma-surface border border-neoma-gold/40 text-center space-y-2">
                  <p className="text-neoma-gold font-mono">{t('limitReached')}</p>
                  <a
                    href={`/${locale}#consultation`}
                    onClick={() => setIsOpen(false)}
                    className="inline-block px-4 py-1.5 rounded-full bg-gold-gradient text-neoma-black font-bold uppercase text-[10px]"
                  >
                    {t('connectConsultant')}
                  </a>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-neoma-dark border-t border-neoma-gold/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={limitReached}
                placeholder={t('inputPlaceholder')}
                className="flex-grow px-4 py-2.5 rounded-xl bg-neoma-surface border border-neoma-gold/20 text-neoma-ivory focus:outline-none focus:border-neoma-gold text-xs"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || limitReached}
                className="p-2.5 rounded-xl bg-neoma-gold text-neoma-black hover:bg-neoma-gold-light disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
