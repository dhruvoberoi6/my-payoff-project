const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const verifyToken = require('../middleware/auth');
const { auditLogger } = require('../middleware/compliance');

/**
 * POST /api/kyc/submit
 * Submit KYC data (Minimum or Full)
 */
router.post('/submit', verifyToken, auditLogger('KYC_SUBMIT'), async (req, res) => {
    const userId = req.user.id;
    const { type, data } = req.body; // type: 'MIN' or 'FULL'

    try {
        const userRef = db.collection('users').doc(userId);
        
        if (type === 'MIN') {
            // Min KYC logic
            await userRef.update({
                kycLevel: 'MIN_KYC',
                kycStatus: 'COMPLETED',
                'kycData.min': {
                    phone: data.phone,
                    fullName: data.fullName,
                    submittedAt: admin.firestore.FieldValue.serverTimestamp()
                }
            });
        } else {
            // Full KYC logic
            await userRef.update({
                kycStatus: 'PENDING',
                'kycData.full': {
                    ...data,
                    submittedAt: admin.firestore.FieldValue.serverTimestamp()
                }
            });
        }

        res.json({ success: true, message: 'KYC submitted successfully' });
    } catch (error) {
        console.error('KYC Submit Error:', error);
        res.status(500).json({ success: false, message: 'Failed to submit KYC' });
    }
});

/**
 * GET /api/kyc/status
 * Get current user KYC level and status
 */
router.get('/status', verifyToken, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.user.id).get();
        if (!userDoc.exists) return res.status(404).json({ success: false, message: 'User not found' });

        const userData = userDoc.data();
        res.json({
            success: true,
            kycLevel: userData.kycLevel || 'NONE',
            kycStatus: userData.kycStatus || 'NOT_STARTED',
            limits: {
                daily: userData.dailyUsed || {},
                monthly: userData.monthlyUsed || {}
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get KYC status' });
    }
});

module.exports = router;
