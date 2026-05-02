export interface Transaction {
    id: string;
    txnId?: string;
    type: 'SEND' | 'RECEIVE';
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    timestamp: string;
    expiresAt?: string;
    senderId?: string;
    receiverUpiId?: string;
    receiverName?: string;
    senderName?: string;
    reason?: string;
}

export interface PaymentToken {
    v: string;
    txnId: string;
    senderId: string;
    receiverUpiId: string;
    amount: number;
    timestamp: string;
    expiresAt: number;
    deviceId: string;
    nonce: string;
}

export interface TrustFactor {
    id: number;
    text: string;
    points: number | string;
    achieved: boolean;
    negative?: boolean;
}

export interface TrustScoreResult {
    score: number;
    factors: TrustFactor[];
    offlineLimit: number;
}
