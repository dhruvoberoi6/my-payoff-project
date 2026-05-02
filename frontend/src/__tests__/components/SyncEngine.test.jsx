import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SyncEngine from '../../pages/SyncEngine';
import * as db from '../../services/db';

// Mock contexts
vi.mock('../../context/WalletContext', () => ({
    useWallet: () => ({
        setIsSyncing: vi.fn(),
        refreshWallet: vi.fn(),
        addNotification: vi.fn(),
    })
}));

vi.mock('../../context/DemoContext', () => ({
    useDemo: () => ({
        isDemoActive: false,
        demoStep: 0,
        nextStep: vi.fn(),
    })
}));

vi.mock('../../hooks/useOnlineStatus', () => ({
    useOnlineStatus: () => true
}));

// Mock DB
vi.mock('../../services/db', () => ({
    getPendingTransactions: vi.fn(),
    clearPendingTransactions: vi.fn(),
    STORES: { WALLET: 'wallet', HISTORY: 'transactions', USED_TOKENS: 'usedTokens' },
    putData: vi.fn(),
    getData: vi.fn(),
}));

describe('SyncEngine Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays "Vault is fully synchronized" when no pending transactions', async () => {
        db.getPendingTransactions.mockResolvedValue([]);
        
        render(
            <BrowserRouter>
                <SyncEngine />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Vault is fully synchronized/i)).toBeInTheDocument();
        });
    });

    it('shows pending transactions in the queue', async () => {
        db.getPendingTransactions.mockResolvedValue([
            { id: 'TXN_1', type: 'SEND', amount: 500, status: 'PENDING' }
        ]);

        render(
            <BrowserRouter>
                <SyncEngine />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/500/)).toBeInTheDocument();
            expect(screen.getByText(/SEND PROTOCOL/)).toBeInTheDocument();
        });
    });

    it('handles a successful sync trigger', async () => {
        db.getPendingTransactions.mockResolvedValue([
            { id: 'TXN_1', type: 'SEND', amount: 500, status: 'PENDING' }
        ]);
        db.getData.mockResolvedValue({ value: 1000 });

        render(
            <BrowserRouter>
                <SyncEngine />
            </BrowserRouter>
        );

        await waitFor(() => {
            const syncButton = screen.queryByText(/Force Sync/i);
            if (syncButton) fireEvent.click(syncButton);
        });

        await waitFor(() => {
            expect(db.putData).toHaveBeenCalled();
        }, { timeout: 5000 });
    });
});
