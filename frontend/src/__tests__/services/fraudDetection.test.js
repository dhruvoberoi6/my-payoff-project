import { describe, it, expect } from 'vitest';
import { validateTransaction, checkDuplicateToken } from '../../services/fraudDetection';

describe('Fraud Detection', () => {
    it('validates transaction amount against balance and daily limit', () => {
        // Valid case
        expect(validateTransaction(100, 1000, 5000, 0).valid).toBe(true);

        // Insufficient funds
        const result1 = validateTransaction(1100, 1000, 5000, 0);
        expect(result1.valid).toBe(false);
        expect(result1.reason).toBe('INSUFFICIENT_FUNDS');

        // Daily limit exceeded
        const result2 = validateTransaction(1000, 5000, 5000, 4500);
        expect(result2.valid).toBe(false);
        expect(result2.reason).toBe('DAILY_LIMIT_EXCEEDED');

        // Invalid amount
        const result3 = validateTransaction(-10, 1000, 5000, 0);
        expect(result3.valid).toBe(false);
        expect(result3.reason).toBe('INVALID_AMOUNT');
    });

    it('detects duplicate tokens', () => {
        const usedTokens = ['TXN_1', 'TXN_2'];
        expect(checkDuplicateToken('TXN_1', usedTokens)).toBe(true);
        expect(checkDuplicateToken('TXN_3', usedTokens)).toBe(false);
    });
});
