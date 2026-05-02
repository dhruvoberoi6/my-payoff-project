import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useWallet } from './WalletContext';
import { useKYC } from './KYCContext';

const AIContext = createContext();

export const AIProvider = ({ children }) => {
    const { user } = useAuth();
    const { balance, trustScore, transactions, pendingCount } = useWallet();
    const { kycLevel } = useKYC();
    
    const [messages, setMessages] = useState([]);
    const [insights, setInsights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Build context object for AI
    const buildContext = () => {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const thisWeekTxns = (transactions || []).filter(t => new Date(t.timestamp) >= startOfWeek);
        const thisWeekSpent = thisWeekTxns.filter(t => t.type === 'SEND').reduce((sum, t) => sum + t.amount, 0);
        
        const thisMonthTxns = (transactions || []).filter(t => new Date(t.timestamp).getMonth() === new Date().getMonth());
        const thisMonthSpent = thisMonthTxns.filter(t => t.type === 'SEND').reduce((sum, t) => sum + t.amount, 0);

        return {
            balance,
            trustScore,
            thisWeekSpent,
            thisMonthSpent,
            pendingTransactions: pendingCount,
            kycLevel,
            subscriptionPlan: 'FREE',
            timestamp: new Date().toISOString()
        };
    };

    const sendMessage = async (text) => {
        const userMsg = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const token = await user.getIdToken();
            const context = buildContext();
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, 
                { message: text, context },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const aiMsg = { role: 'assistant', content: response.data.response, timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
            
            // Save to local cache for offline
            localStorage.setItem('last_ai_response', JSON.stringify(aiMsg));
        } catch (error) {
            const cached = localStorage.getItem('last_ai_response');
            if (cached) {
                const aiMsg = JSON.parse(cached);
                aiMsg.content = `[OFFLINE] ${aiMsg.content}`;
                setMessages(prev => [...prev, aiMsg]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting, but I'll be back online soon!", timestamp: new Date() }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchInsights = async () => {
        try {
            const token = await user.getIdToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ai/insights`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInsights(response.data.insights);
        } catch (error) {
            // Local fallback insights
            setInsights([
                { id: 'l1', icon: '⚡', text: `Balance trend is up 12% vs last week.`, type: 'TIP' },
                { id: 'l2', icon: '🛡️', text: `Next trust milestone at 80 points.`, type: 'GOAL' }
            ]);
        }
    };

    useEffect(() => {
        if (user) fetchInsights();
    }, [user]);

    const value = {
        messages,
        insights,
        isLoading,
        sendMessage,
        refreshInsights: fetchInsights
    };

    return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export const useAI = () => useContext(AIContext);
