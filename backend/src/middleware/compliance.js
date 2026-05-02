const { db, admin } = require('../config/firebase');

/**
 * Middleware to enforce KYC-based transaction limits
 */
const checkLimits = async (req, res, next) => {
    const userId = req.user.id;
    const amount = req.body.amount || req.body.txn?.amount;

    if (!amount) return next();

    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        const kycLevel = userData.kycLevel || 'NONE';
        const limits = {
            'NONE': { daily: 0, monthly: 0, single: 0 },
            'MIN_KYC': { daily: 10000, monthly: 100000, single: 10000 },
            'FULL_KYC': { daily: 100000, monthly: 1000000, single: 100000 }
        };

        const userLimits = limits[kycLevel];

        // 1. Single Transaction Limit
        if (amount > userLimits.single) {
            return res.status(403).json({ 
                success: false, 
                error_code: 'LIMIT_EXCEEDED', 
                message: `Transaction exceeds your single limit of ₹${userLimits.single}` 
            });
        }

        // 2. Daily & Monthly Limit Checks
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const monthStr = todayStr.substring(0, 7);

        const dailyUsed = userData.dailyUsed?.[todayStr] || 0;
        const monthlyUsed = userData.monthlyUsed?.[monthStr] || 0;

        if (dailyUsed + amount > userLimits.daily) {
            return res.status(403).json({ 
                success: false, 
                error_code: 'DAILY_LIMIT_EXCEEDED', 
                message: 'Daily transaction limit reached' 
            });
        }

        if (monthlyUsed + amount > userLimits.monthly) {
            return res.status(403).json({ 
                success: false, 
                error_code: 'MONTHLY_LIMIT_EXCEEDED', 
                message: 'Monthly transaction limit reached' 
            });
        }

        // 3. Suspicious Pattern Detection (10+ txns in 1 hour)
        const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
        const recentTxns = await db.collection('transactions')
            .where('senderId', '==', userId)
            .where('settledAt', '>=', oneHourAgo)
            .get();

        if (recentTxns.size >= 10) {
            // Log as suspicious
            await db.collection('security_alerts').add({
                userId,
                type: 'VELOCITY_ATTACK',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                count: recentTxns.size
            });
            
            return res.status(429).json({ 
                success: false, 
                error_code: 'VELOCITY_BLOCK', 
                message: 'Too many transactions. Your account is temporarily flagged for review.' 
            });
        }

        next();
    } catch (error) {
        console.error('Limit Check Error:', error);
        res.status(500).json({ success: false, message: 'Compliance check failed' });
    }
};

/**
 * Immutable Audit Logger Middleware
 */
const auditLogger = (action) => async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
        const userId = req.user?.id || 'ANONYMOUS';
        const logData = {
            userId,
            action,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ipAddress: req.ip || req.headers['x-forwarded-for'],
            deviceId: req.headers['x-device-id'] || 'UNKNOWN',
            result: res.statusCode >= 200 && res.statusCode < 300 ? 'SUCCESS' : 'FAILURE',
            metadata: {
                method: req.method,
                path: req.path,
                params: req.params,
                query: req.query
            }
        };

        // Fire and forget logging (don't block response)
        db.collection('audit_logs').add(logData).catch(err => console.error('Audit Log Failed:', err));
        
        originalSend.apply(res, arguments);
    };

    next();
};

module.exports = {
    checkLimits,
    auditLogger
};
