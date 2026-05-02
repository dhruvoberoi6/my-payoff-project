import CryptoJS from 'crypto-js';

const SYSTEM_SECRET = 'offline_pay_system_signature_secret_2026';

export const createSignature = (data: any): string => {
    return CryptoJS.SHA256(JSON.stringify(data) + SYSTEM_SECRET).toString();
};

export const verifySignature = (data: any, signature: string): boolean => {
    const expected = createSignature(data);
    return expected === signature;
};
