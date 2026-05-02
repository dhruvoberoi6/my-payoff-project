import CryptoJS from 'crypto-js';

const DEFAULT_KEY = 'offline_pay_secure_fallback_key';

export const encryptData = (data: any, pin?: string): string => {
    const key = pin || DEFAULT_KEY;
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const decryptData = (encrypted: string, pin?: string): any | null => {
    try {
        const key = pin || DEFAULT_KEY;
        const bytes = CryptoJS.AES.decrypt(encrypted, key);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) return null;
        return JSON.parse(decryptedString);
    } catch (error) {
        return null;
    }
};
