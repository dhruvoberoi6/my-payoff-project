const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const PDFDocument = require('pdfkit');
const verifyToken = require('../middleware/auth');
const { auditLogger } = require('../middleware/compliance');

/**
 * GET /api/compliance/data/export
 * Export all user data as JSON
 */
router.get('/data/export', verifyToken, auditLogger('DATA_EXPORT'), async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch User Info
        const userDoc = await db.collection('users').doc(userId).get();
        
        // Fetch Transactions
        const txnsSnapshot = await db.collection('transactions')
            .where('senderId', '==', userId)
            .get();
        const txns = txnsSnapshot.docs.map(doc => doc.data());

        // Fetch Audit Logs (Relevant to user)
        const logsSnapshot = await db.collection('audit_logs')
            .where('userId', '==', userId)
            .get();
        const logs = logsSnapshot.docs.map(doc => doc.data());

        const exportData = {
            profile: userDoc.data(),
            transactions: txns,
            auditLogs: logs,
            exportedAt: new Date().toISOString(),
            compliance_notice: "This data is provided as per your right to portability under PDPB/GDPR."
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=offlinepay_data_${userId}.json`);
        res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ success: false, message: 'Failed to export data' });
    }
});

/**
 * GET /api/compliance/audit/export
 * Export audit logs as PDF
 */
router.get('/audit/export', verifyToken, auditLogger('AUDIT_PDF_EXPORT'), async (req, res) => {
    try {
        const userId = req.user.id;
        const logsSnapshot = await db.collection('audit_logs')
            .where('userId', '==', userId)
            .orderBy('timestamp', 'desc')
            .limit(100)
            .get();

        const doc = new PDFDocument();
        let filename = `audit_log_${userId}.pdf`;
        
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(20).text('OfflinePay Security Audit Log', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).text(`User ID: ${userId}`);
        doc.text(`Generated At: ${new Date().toISOString()}`);
        doc.moveDown();
        doc.text('------------------------------------------------------------');
        doc.moveDown();

        logsSnapshot.forEach(logDoc => {
            const log = logDoc.data();
            const date = log.timestamp?.toDate()?.toISOString() || 'Unknown Date';
            doc.fontSize(10).fillColor('blue').text(`[${date}] ${log.action}`);
            doc.fillColor('black').text(`Result: ${log.result} | IP: ${log.ipAddress}`);
            doc.moveDown(0.5);
        });

        doc.end();
        doc.pipe(res);

    } catch (error) {
        console.error('PDF Export Error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate audit report' });
    }
});

/**
 * POST /api/compliance/data/delete
 * Request account deletion
 */
router.post('/data/delete', verifyToken, auditLogger('DATA_DELETE_REQUEST'), async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Create a deletion request
        await db.collection('deletion_requests').add({
            userId,
            requestedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'PENDING',
            processBy: new Date(Date.now() + 48 * 3600000).toISOString()
        });

        // Mark user for deletion in users collection
        await db.collection('users').doc(userId).update({
            deletionRequested: true,
            deletionRequestedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: 'Deletion request received and scheduled' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process deletion request' });
    }
});

module.exports = router;
