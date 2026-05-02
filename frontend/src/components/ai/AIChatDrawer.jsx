import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, MicOff, Sparkles, Bot, User, Brain } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import toast from 'react-hot-toast';

const AIChatDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const { messages, sendMessage, isLoading } = useAI();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input;
        setInput('');
        await sendMessage(msg);
    };

    const toggleVoice = () => {
        if (!('webkitSpeechRecognition' in window)) {
            toast.error('Voice recognition not supported in this browser');
            return;
        }

        if (isListening) {
            setIsListening(false);
        } else {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-IN';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setInput(text);
                setIsListening(false);
            };

            recognition.start();
        }
    };

    const suggestedQuestions = [
        "How much did I spend this week?",
        "Who do I pay most often?",
        "How can I improve my trust score?",
        "Will I have enough money this month?"
    ];

    return (
        <>
            {/* Floating FAB */}
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 left-1/2 ml-[135px] w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-cyan to-blue-600 flex items-center justify-center text-bg-primary shadow-[0_10px_30px_rgba(0,245,255,0.4)] z-[90] max-[430px]:left-auto max-[430px]:ml-0 max-[430px]:right-6"
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[80vh] bg-[#0a1628] rounded-t-[40px] border-t border-white/10 z-[110] flex flex-col overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-accent-cyan/5 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center border border-accent-cyan/20">
                                        <Brain className="text-accent-cyan w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Ask OfflinePay AI</h3>
                                        <p className="text-[10px] text-accent-cyan font-bold uppercase tracking-widest">Powered by Claude 3.5</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                                    <X className="w-5 h-5 text-secondary" />
                                </button>
                            </div>

                            {/* Chat Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                                {messages.length === 0 && (
                                    <div className="space-y-6 mt-10">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                <Bot className="w-8 h-8 text-secondary" />
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2">Namaste! I'm your AI assistant.</h4>
                                            <p className="text-sm text-text-secondary">I can analyze your spending patterns and help you reach your financial goals.</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            {suggestedQuestions.map((q, i) => (
                                                <button 
                                                    key={i} 
                                                    onClick={() => {
                                                        setInput(q);
                                                        // Auto send after setting input?
                                                        sendMessage(q);
                                                    }}
                                                    className="p-4 rounded-2xl bg-white/5 border border-white/5 text-left text-xs font-bold text-secondary hover:bg-white/10 hover:border-accent-cyan/30 transition-all"
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-purple-500/10 text-purple-400'}`}>
                                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                            </div>
                                            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-accent-cyan text-bg-primary font-black' : 'bg-white/5 border border-white/5 text-gray-200 font-medium'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex gap-3 max-w-[85%]">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                                                <Bot size={16} />
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce"></div>
                                                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-accent-cyan/50 transition-all">
                                    <button 
                                        onClick={toggleVoice}
                                        className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-white/5 text-secondary'}`}
                                    >
                                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                                    </button>
                                    <input 
                                        type="text"
                                        placeholder="Ask about your finances..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white placeholder:text-text-secondary"
                                    />
                                    <button 
                                        onClick={handleSend}
                                        disabled={isLoading || !input.trim()}
                                        className="p-3 bg-accent-cyan text-bg-primary rounded-xl disabled:opacity-50 transition-all"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                <p className="text-[8px] text-center text-text-secondary mt-3 font-bold uppercase tracking-widest">
                                    AI insights may be based on cached data if offline
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatDrawer;
