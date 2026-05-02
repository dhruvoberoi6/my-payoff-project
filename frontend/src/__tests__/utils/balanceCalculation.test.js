import { describe, it, expect } from 'vitest';
import { calculateNewBalance, handleConcurrentSync } from '../../utils/balanceCalculation';

describe('Balance Calculation', () => {
    it('correctly adds received amount', () => {
        expect(calculateNewBalance(1000, 500, 'RECEIVE')).toBe(1500);
    });

    it('correctly subtracts sent amount', () => {
        expect(calculateNewBalance(1000, 400, 'SEND')).toBe(600);
    });

    it('prevents balance from going negative', () => {
        // The utility function returns current balance if next is negative
        expect(calculateNewBalance(100, 200, 'SEND')).toBe(100);
    });

    it('handles concurrent syncs correctly', () => {
        const pendingTxns = [
            { type: 'SEND', amount: 100 },
            { type: 'RECEIVE', amount: 500 },
            { type: 'SEND', amount: 200 }
        ];
        // 1000 - 100 + 500 - 200 = 1200
        expect(handleConcurrentSync(1000, pendingTxns)).toBe(1200);
    });
});
