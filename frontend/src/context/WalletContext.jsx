import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateTrustScore } from 'offlinepay-core';
import { STORES, getData, putData, getAllData, getPendingTransactions, deleteData } from '../services/db';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [trustScore, setTrustScore] = useState(50);
    const [trustFactors, setTrustFactors] = useState([]);
    const [offlineLimit, setOfflineLimit] = useState(500);
    const [isLoading, setIsLoading] = useState(true);

    const refreshWallet = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Get Balance
            const walletData = await getData(STORES.WALLET, 'balance');
            if (walletData) {
                setBalance(walletData.value);
            } else {
                // Initializing wallet with ₹10,000 if first time user
                const initialBalance = 10000;
                await putData(STORES.WALLET, { key: 'balance', value: initialBalance });
                setBalance(initialBalance);
            }

            // 2. Get Recent Transactions
            const txns = await getAllData(STORES.HISTORY) || [];
            const sortedTxns = [...txns].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setTransactions(sortedTxns.slice(0, 5));

            // 3. Get Pending Count
            const pending = await getPendingTransactions() || [];
            setPendingCount(pending.length);

            // 4. Get Notifications
            const notifs = await getAllData(STORES.NOTIFICATIONS) || [];
            setNotifications([...notifs].sort((a, b) => b.timestamp - a.timestamp));

            // 5. Calculate Trust Score
            let completedCount = 0;
            let failedCount = 0;
            let totalVolume = 0;
            
            txns.forEach(t => {
                if (t.status === 'COMPLETED') {
                    completedCount++;
                    if (t.type === 'SEND') totalVolume += t.amount;
                }
                if (t.status === 'FAILED') failedCount++;
            });

            // Account age (getting from auth storage)
            let accountAgeDays = 0;
            const storedUser = sessionStorage.getItem('currentUser');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    if (user && user.createdAt) {
                        const diffTime = Math.abs(new Date() - new Date(user.createdAt));
                        accountAgeDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    }
                } catch (e) {
                    console.error('Error parsing user in WalletContext', e);
                }
            }

            const { score, factors, offlineLimit } = calculateTrustScore(txns, accountAgeDays);
            setTrustScore(score);
            setTrustFactors(factors);
            setOfflineLimit(offlineLimit);

        } catch (error) {
            console.error('Wallet Refresh Failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    const addTransaction = async (txn) => {
        const fullTxn = { ...txn, txnId: txn.txnId || txn.id };
        await putData(STORES.HISTORY, fullTxn);
        
        // Update balance locally
        let newBalance = balance;
        if (txn.type === 'SEND') {
            newBalance -= txn.amount;
        } else {
            newBalance += txn.amount;
        }
        
        await putData(STORES.WALLET, { key: 'balance', value: newBalance });
        setBalance(newBalance);
        refreshWallet();
    };

    const playTone = (type) => {
        if (document.hidden) return; // Respect silent mode if app is backgrounded
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            const now = ctx.currentTime;
            if (type === 'success') {
                playNote(523.25, now, 0.2); // C5
                playNote(659.25, now + 0.15, 0.2); // E5
                playNote(783.99, now + 0.3, 0.4); // G5
            } else if (type === 'error' || type === 'failed') {
                playNote(300, now, 0.3);
                playNote(250, now + 0.3, 0.4);
            } else {
                playNote(600, now, 0.2); // Standard info beep
            }
        } catch (e) {
            console.error('Audio API failed', e);
        }
    };

    const addNotification = async (title, message, type = 'info', actionRoute = null) => {
        const notif = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: Date.now(),
            read: false,
            actionRoute
        };
        await putData(STORES.NOTIFICATIONS, notif);
        
        // Max 50 notifications
        const allNotifs = await getAllData(STORES.NOTIFICATIONS) || [];
        if (allNotifs.length > 50) {
            const sorted = allNotifs.sort((a, b) => a.timestamp - b.timestamp);
            const toDelete = sorted.slice(0, allNotifs.length - 50);
            for (const n of toDelete) {
                await deleteData(STORES.NOTIFICATIONS, n.id);
            }
        }
        
        playTone(type);
        refreshWallet();
    };

    const deleteNotification = async (id) => {
        await deleteData(STORES.NOTIFICATIONS, id);
        refreshWallet();
    };

    const markNotificationsAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        for (const n of unread) {
            await putData(STORES.NOTIFICATIONS, { ...n, read: true });
        }
        refreshWallet();
    };

    return (
        <WalletContext.Provider value={{ 
            balance, 
            transactions, 
            pendingCount, 
            notifications, 
            isSyncing, 
            setIsSyncing,
            trustScore,
            trustFactors,
            offlineLimit,
            isLoading,
            refreshWallet,
            addTransaction,
            addNotification,
            deleteNotification,
            markNotificationsAsRead
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
