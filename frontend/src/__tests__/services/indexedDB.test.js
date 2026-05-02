import { describe, it, expect, beforeEach } from 'vitest';
import * as db from '../../services/db';

describe('IndexedDB Service', () => {
    beforeEach(async () => {
        // Clear stores before each test if needed
        // Note: fake-indexeddb auto-resets if using auto import
    });

    it('saves and retrieves pending transaction', async () => {
        const txn = { id: 'TXN_TEST_1', amount: 100, type: 'SEND' };
        await db.savePendingTransaction(txn);
        
        const all = await db.getPendingTransactions();
        expect(all).toContainEqual(txn);
    });

    it('clears specific pending transactions', async () => {
        const txn1 = { id: 'TXN_1', amount: 100 };
        const txn2 = { id: 'TXN_2', amount: 200 };
        await db.savePendingTransaction(txn1);
        await db.savePendingTransaction(txn2);
        
        await db.clearPendingTransactions(['TXN_1']);
        
        const all = await db.getPendingTransactions();
        expect(all.find(t => t.id === 'TXN_1')).toBeUndefined();
        expect(all.find(t => t.id === 'TXN_2')).toBeDefined();
    });
});
