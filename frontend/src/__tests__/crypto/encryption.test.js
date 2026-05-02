import { describe, it, expect } from 'vitest';
import { encryptToken, decryptToken } from '../../utils/crypto';

describe('AES Encryption', () => {
    it('AES encryption/decryption round trip produces identical payload', () => {
        const payload = { test: 'data', secret: '123' };
        const pin = '123456';
        
        const encrypted = encryptToken(payload, pin);
        expect(typeof encrypted).toBe('string');
        expect(encrypted).not.toBe(JSON.stringify(payload));

        const decrypted = decryptToken(encrypted, pin);
        expect(decrypted).toEqual(payload);
    });

    it('returns null if decryption fails with wrong PIN', () => {
        const payload = { test: 'data' };
        const encrypted = encryptToken(payload, '123456');
        const decrypted = decryptToken(encrypted, 'wrong_pin');
        
        expect(decrypted).toBeNull();
    });
});
