import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { streamChatMessage } from '../utils/api';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: "🌌 **Welcome to THE UNIVERSE AI Guide!**\n\nAsk me anything about space, planets, astronomy, or space exploration.", timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      let fullResponse = '';
      setMessages(prev => [...prev, { id: `placeholder-${Date.now()}`, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }]);

      await streamChatMessage(inputValue.trim(), 'mistral', (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const placeholderIndex = updated.findIndex(m => m.isStreaming);
          if (placeholderIndex !== -1) {
            updated[placeholderIndex] = { ...updated[placeholderIndex], content: fullResponse };
          }
          return updated;
        });
      });

      setMessages(prev => {
        const updated = [...prev];
        const placeholderIndex = updated.findIndex(m => m.isStreaming);
        if (placeholderIndex !== -1) {
          updated[placeholderIndex] = { ...updated[placeholderIndex], content: fullResponse, isStreaming: false };
        }
        return updated;
      });
    } catch (err) {
      setError(err.message || 'Failed to get response');
      setMessages(prev => prev.filter(m => !m.isStreaming));
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900/50 to-purple-900/50">
      <div className="sticky top-0 z-10 bg-black/40 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Space Guide</h1>
              <p className="text-white/60 text-sm">Powered by Mistral AI</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/10 hover:bg-red-500/10 text-red-400 hover:text-red-300 text-sm rounded-lg border border-white/20 transition-all flex items-center gap-2" onClick={() => setMessages([{ id: 'welcome', role: 'assistant', content: "🌌 **Welcome to THE UNIVERSE AI Guide!**\n\nAsk me anything about space, planets, astronomy, or space exploration.", timestamp: new Date() }])}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {messages.map((msg, i) => (
              <motion.div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: msg.role === 'user' ? 50 : -50 }} transition={{ delay: i * 0.1 }}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <motion.div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600/20 rounded-br-sm' : 'bg-white/10 rounded-bl-sm'}`} initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 + 0.1 }}>
                    <div className="whitespace-pre-wrap break-words">
                      {msg.isStreaming ? (
                        <>
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          <motion.span className="inline-block" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}>▋</motion.span>
                        </>
                      ) : (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      )}
                    </div>
                    <motion.div className={`text-xs text-white/50 mt-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.2 }}>
                      {formatTime(msg.timestamp)}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && !messages.some(m => m.isStreaming) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[80%] mr-auto">
              <div className="px-4 py-3 rounded-2xl bg-white/10">
                <motion.div className="flex gap-1" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  <motion.div className="w-2 h-2 rounded-full bg-blue-500" animate={{ y: [-5, 0, 5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-blue-500" animate={{ y: [-5, 0, 5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 rounded-full bg-blue-500" animate={{ y: [-5, 0, 5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                </motion.div>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky bottom-0 bg-black/40 backdrop-blur-2xl border-t border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-3">
            <textarea ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={isLoading ? "Wait for response..." : "Ask about space... (e.g., What is a black hole?)"} disabled={isLoading} className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none min-h-[44px] max-h-[200px]" rows={1} />
            <button onClick={handleSend} disabled={!inputValue.trim() || isLoading} className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex-shrink-0 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            ["What is a black hole?", "Tell me about Mars", "How do rockets work?", "What's the latest space mission?"].map((prompt, index) => (
              <button key={index} onClick={() => setInputValue(prompt)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 text-xs rounded-full border border-white/10 transition-all">{prompt}</button>
            ))
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;