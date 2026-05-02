import { describe, it, expect } from 'vitest';
import { calculateTrustScore } from '../../services/trustScore';

describe('Trust Score Calculation', () => {
    it('calculates correctly for new user (base score)', () => {
        const txns = [];
        const accountAge = 0;
        const result = calculateTrustScore(txns, accountAge);
        
        expect(result.score).toBe(50);
        expect(result.offlineLimit).toBe(2000); // 50 is between 41 and 70
    });

    it('adds bonus for successful syncs', () => {
        const txns = [
            { status: 'COMPLETED', type: 'SEND', amount: 100 },
            { status: 'COMPLETED', type: 'RECEIVE', amount: 200 }
        ];
        const accountAge = 0;
        const result = calculateTrustScore(txns, accountAge);
        
        // Base 50 + (2 * 5) = 60
        expect(result.score).toBe(60);
        expect(result.factors.some(f => f.text.includes('Successful syncs (2)'))).toBe(true);
    });

    it('penalizes for failed syncs', () => {
        const txns = [
            { status: 'FAILED', type: 'SEND', amount: 100 }
        ];
        const accountAge = 0;
        const result = calculateTrustScore(txns, accountAge);
        
        // Base 50 - 10 = 40
        expect(result.score).toBe(40);
        expect(result.offlineLimit).toBe(500);
    });

    it('adds bonus for account age and volume', () => {
        const txns = [
            { status: 'COMPLETED', type: 'SEND', amount: 6000 }
        ];
        const accountAge = 10;
        const result = calculateTrustScore(txns, accountAge);
        
        // Base 50 + 5 (1 txn) + 10 (age) + 10 (volume) = 75
        expect(result.score).toBe(75);
        expect(result.offlineLimit).toBe(5000);
    });

    it('caps score at 100 and floors at 0', () => {
        const manySuccess = Array(20).fill({ status: 'COMPLETED', type: 'SEND', amount: 1000 });
        expect(calculateTrustScore(manySuccess, 30).score).toBe(100);

        const manyFails = Array(10).fill({ status: 'FAILED', type: 'SEND', amount: 100 });
        expect(calculateTrustScore(manyFails, 0).score).toBe(0);
    });
});
