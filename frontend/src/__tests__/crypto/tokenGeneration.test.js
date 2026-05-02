import { describe, it, expect, vi } from 'vitest';
import { generateToken } from '../../utils/token';

describe('Token Generation', () => {
    it('generates a token with correct structure and fields', () => {
        const user = { id: 'user_123', name: 'Test User' };
        const receiver = 'receiver@upi';
        const amount = 100;
        
        // Mock global objects used in generateToken
        global.navigator = { userAgent: 'test-agent' };
        global.screen = { width: 1920 };

        const token = generateToken(user, receiver, amount, '123456');

        expect(token).toHaveProperty('v', '1.0');
        expect(token).toHaveProperty('txnId');
        expect(token.txnId).toMatch(/^TXN_/);
        expect(token).toHaveProperty('senderId', 'user_123');
        expect(token).toHaveProperty('receiverUpiId', receiver);
        expect(token).toHaveProperty('amount', amount);
        expect(token).toHaveProperty('timestamp');
        expect(token).toHaveProperty('expiresAt');
        expect(token).toHaveProperty('deviceId');
        expect(token).toHaveProperty('nonce');
    });

    it('handles anonymous users', () => {
        const token = generateToken(null, 'receiver@upi', 100, '123456');
        expect(token.senderId).toBe('ANONYMOUS');
    });
});
