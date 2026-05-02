import CryptoJS from 'crypto-js';
import { PaymentToken } from '../types';

export const generatePaymentToken = (
    userId: string, 
    receiverUpi: string, 
    amount: number, 
    deviceFingerprint: string
): PaymentToken => {
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const timestamp = new Date().toISOString();
    const expiresAt = Date.now() + 600000; // 10 minutes
    const nonce = CryptoJS.lib.WordArray.random(16).toString();

    return {
        v: "1.0",
        txnId,
        senderId: userId || 'ANONYMOUS',
        receiverUpiId: receiverUpi,
        amount: amount,
        timestamp,
        expiresAt,
        deviceId: deviceFingerprint,
        nonce
    };
};

export const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() > expiresAt;
};
