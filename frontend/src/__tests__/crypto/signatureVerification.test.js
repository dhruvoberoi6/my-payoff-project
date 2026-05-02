import { describe, it, expect } from 'vitest';
import { generateSignature } from '../../utils/crypto';
import { verifySignature } from '../../utils/token';

describe('Signature Verification', () => {
    it('SHA256 signature detects any payload tampering', () => {
        const token = { txnId: 'TXN_1', amount: 100 };
        const signature = generateSignature(token);
        
        // Should be valid with original token
        expect(verifySignature(token, signature)).toBe(true);

        // Tampering with amount
        const tamperedToken = { ...token, amount: 101 };
        expect(verifySignature(tamperedToken, signature)).toBe(false);

        // Tampering with txnId
        const tamperedToken2 = { ...token, txnId: 'TXN_2' };
        expect(verifySignature(tamperedToken2, signature)).toBe(false);
    });

    it('rejects completely invalid signatures', () => {
        const token = { txnId: 'TXN_1', amount: 100 };
        expect(verifySignature(token, 'invalid_signature')).toBe(false);
    });
});
