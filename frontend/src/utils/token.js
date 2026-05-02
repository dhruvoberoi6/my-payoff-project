import CryptoJS from 'crypto-js';

export const generateToken = (user, receiver, amount, pin) => {
    const txnId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const timestamp = new Date().toISOString();
    const expiresAt = Date.now() + 600000; // 10 minutes
    const deviceId = CryptoJS.SHA256(navigator.userAgent + screen.width).toString().slice(0, 16);
    const nonce = CryptoJS.lib.WordArray.random(16).toString();

    const token = {
        v: "1.0",
        txnId,
        senderId: user?.id || 'ANONYMOUS',
        receiverUpiId: receiver,
        amount: parseFloat(amount),
        timestamp,
        expiresAt,
        deviceId,
        nonce
    };

    return token;
};

export const isTokenExpired = (expiresAt) => {
    return Date.now() > expiresAt;
};

export const verifySignature = (token, signature) => {
    const SECRET = 'offline_pay_system_signature_secret_2026';
    const expectedSignature = CryptoJS.SHA256(JSON.stringify(token) + SECRET).toString();
    return expectedSignature === signature;
};
