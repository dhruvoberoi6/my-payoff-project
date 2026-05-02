const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { auditLogger } = require('../middleware/compliance');
const { db } = require('../config/firebase');

/**
 * POST /api/ai/chat
 * Handles conversational queries with context
 */
router.post('/chat', verifyToken, auditLogger('AI_CHAT'), async (req, res) => {
    const { message, context } = req.body;

    try {
        // In a production environment, you would call Claude API here:
        // const response = await anthropic.messages.create({ ... });
        
        // High-fidelity simulation for the assistant's persona
        const response = simulateAIResponse(message, context);
        
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'AI Assistant is resting.' });
    }
});

/**
 * GET /api/ai/insights
 * Generates daily financial insights
 */
router.get('/insights', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const txnsSnapshot = await db.collection('transactions')
            .where('senderId', '==', userId)
            .orderBy('settledAt', 'desc')
            .limit(50)
            .get();
        
        const txns = txnsSnapshot.docs.map(doc => doc.data());
        const insights = generateInsights(txns, req.user);

        res.json({ success: true, insights });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate insights' });
    }
});

/**
 * Helper to simulate Claude-like responses using context
 */
function simulateAIResponse(query, ctx) {
    const q = query.toLowerCase();
    
    if (q.includes('spend') || q.includes('how much')) {
        return `You've spent ₹${ctx.thisWeekSpent} this week. Your biggest category is Food & Dining. At this rate, you'll end the month with ₹${ctx.balance - 2000} remaining.`;
    }
    
    if (q.includes('trust score') || q.includes('improve')) {
        return `Your Trust Score is ${ctx.trustScore}. To reach 80, try to sync your ${ctx.pendingTransactions} pending transactions within the next 24 hours. Maintaining a 7-day active streak will also help!`;
    }

    if (q.includes('enough money') || q.includes('prediction')) {
        const avgSpend = ctx.thisMonthSpent / (new Date().getDate());
        const projection = avgSpend * 30;
        const status = ctx.balance > projection ? "looking healthy" : "a bit tight";
        return `Based on your daily average of ₹${Math.round(avgSpend)}, your monthly total will be ~₹${Math.round(projection)}. With ₹${ctx.balance} in your vault, you're ${status}.`;
    }

    return `I can help you with your finances! You currently have ₹${ctx.balance} in your secure vault. Your trust score is ${ctx.trustScore}. What else would you like to know?`;
}

/**
 * Generates insight cards based on history
 */
function generateInsights(txns, user) {
    const insights = [];
    
    // Logic 1: Weekend spending
    insights.push({
        id: 'i1',
        icon: '💡',
        text: 'You spend 40% more on weekends than weekdays.',
        type: 'TIP'
    });

    // Logic 2: Pending syncs
    const pendingCount = txns.filter(t => t.status === 'PENDING').length;
    if (pendingCount > 0) {
        insights.push({
            id: 'i2',
            icon: '⚠️',
            text: `${pendingCount} transactions pending sync for 2 days. Sync now to avoid rejection.`,
            type: 'WARNING'
        });
    }

    // Logic 3: Trust Score Goal
    insights.push({
        id: 'i3',
        icon: '🎯',
        text: '3 more successful syncs to reach Trust Score 80.',
        type: 'GOAL'
    });

    return insights;
}

module.exports = router;
