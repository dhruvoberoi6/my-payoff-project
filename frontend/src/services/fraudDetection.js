export const validateTransaction = (amount, currentBalance, dailyLimit, dailySpent) => {
    if (amount <= 0) {
        return { valid: false, reason: 'INVALID_AMOUNT' };
    }
    if (amount > currentBalance) {
        return { valid: false, reason: 'INSUFFICIENT_FUNDS' };
    }
    if (dailySpent + amount > dailyLimit) {
        return { valid: false, reason: 'DAILY_LIMIT_EXCEEDED' };
    }
    return { valid: true };
};

export const checkDuplicateToken = (txnId, usedTokens) => {
    return usedTokens.includes(txnId);
};
