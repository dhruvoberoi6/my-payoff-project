export const calculateTrustScore = (txns, accountAgeDays) => {
    let completedCount = 0;
    let failedCount = 0;
    let totalVolume = 0;
    
    txns.forEach(t => {
        if (t.status === 'COMPLETED') {
            completedCount++;
            if (t.type === 'SEND') totalVolume += t.amount;
        }
        if (t.status === 'FAILED') failedCount++;
    });

    let score = 50;
    let factors = [
        { id: 1, text: 'Base score for new user', points: 50, achieved: true }
    ];

    const completedBonus = Math.min(completedCount * 5, 30);
    if (completedBonus > 0) {
        score += completedBonus;
        factors.push({ id: 2, text: `Successful syncs (${completedCount})`, points: completedBonus, achieved: true });
    } else {
        factors.push({ id: 2, text: `Successful syncs (Max +30)`, points: '+5 per sync', achieved: false });
    }

    if (failedCount > 0) {
        const penalty = failedCount * 10;
        score -= penalty;
        factors.push({ id: 3, text: `Failed syncs (${failedCount})`, points: -penalty, achieved: true, negative: true });
    }

    if (accountAgeDays > 7) {
        score += 10;
        factors.push({ id: 4, text: 'Account age > 7 days', points: 10, achieved: true });
    } else {
        factors.push({ id: 4, text: 'Account age > 7 days', points: '+10', achieved: false });
    }

    if (totalVolume > 5000) {
        score += 10;
        factors.push({ id: 5, text: 'Synced volume > ₹5000', points: 10, achieved: true });
    } else {
        factors.push({ id: 5, text: 'Synced volume > ₹5000', points: '+10', achieved: false });
    }

    score = Math.max(0, Math.min(100, score));
    
    let offlineLimit = 500;
    if (score <= 40) offlineLimit = 500;
    else if (score <= 70) offlineLimit = 2000;
    else offlineLimit = 5000;

    return { score, factors, offlineLimit };
};
