export const calculateNewBalance = (currentBalance, amount, type) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return currentBalance;
    
    if (type === 'SEND') {
        const nextBalance = currentBalance - numAmount;
        return nextBalance < 0 ? currentBalance : nextBalance;
    } else if (type === 'RECEIVE') {
        return currentBalance + numAmount;
    }
    return currentBalance;
};

export const handleConcurrentSync = (currentBalance, pendingTxns) => {
    let finalBalance = currentBalance;
    pendingTxns.forEach(txn => {
        if (txn.type === 'SEND') {
            finalBalance -= txn.amount;
        } else if (txn.type === 'RECEIVE') {
            finalBalance += txn.amount;
        }
    });
    return finalBalance;
};
