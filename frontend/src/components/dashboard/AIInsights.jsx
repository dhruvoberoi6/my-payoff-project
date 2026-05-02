import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw, ChevronRight } from 'lucide-react';
import { useAI } from '../../context/AIContext';

const AIInsights = () => {
    const { insights, refreshInsights, isLoading } = useAI();

    if (!insights || insights.length === 0) return null;

    return (
        <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent-cyan" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">AI Smart Insights</h2>
                </div>
                <button 
                    onClick={refreshInsights}
                    className={`p-1 text-secondary hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`}
                >
                    <RefreshCw size={14} />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6">
                <AnimatePresence>
                    {insights.map((insight, idx) => (
                        <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="min-w-[280px] glass-card p-5 relative group overflow-hidden border-accent-cyan/20"
                        >
                            {/* Decorative background pulse */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-cyan/5 blur-3xl rounded-full group-hover:bg-accent-cyan/10 transition-colors" />
                            
                            <div className="flex items-start gap-4">
                                <div className="text-2xl">{insight.icon}</div>
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-white leading-relaxed pr-6">
                                        {insight.text}
                                    </p>
                                    <div className="flex items-center gap-1 mt-3">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${
                                            insight.type === 'WARNING' ? 'text-orange-400' : 
                                            insight.type === 'GOAL' ? 'text-purple-400' : 'text-accent-cyan'
                                        }`}>
                                            {insight.type}
                                        </span>
                                        <ChevronRight size={10} className="text-text-secondary" />
                                    </div>
                                </div>
                            </div>

                            <button className="absolute top-4 right-4 text-white/10 hover:text-white/40 transition-colors">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AIInsights;
