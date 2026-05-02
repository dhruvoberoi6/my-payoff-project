import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[400px] z-[100]"
                >
                    <div className="glass-card p-6 border-accent-cyan/30 shadow-2xl relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-cyan/10 blur-3xl rounded-full" />
                        
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center shrink-0 border border-accent-cyan/20">
                                <Cookie className="w-5 h-5 text-accent-cyan" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">We value your privacy</h3>
                                <p className="text-[10px] text-text-secondary leading-relaxed mt-1">
                                    OfflinePay uses cookies to enhance security, analyze traffic, and ensure RBI compliance for offline transaction syncing.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button 
                                onClick={handleAccept}
                                className="flex-1 py-2 bg-accent-cyan text-bg-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all"
                            >
                                Accept All
                            </button>
                            <Link 
                                to="/privacy"
                                className="flex-1 py-2 border border-white/10 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1"
                            >
                                Policy <ExternalLink className="w-3 h-3" />
                            </Link>
                        </div>

                        <button 
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-text-secondary hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
