# OfflinePay Judge's Demo Guide

This guide is designed to help you experience the full power of OfflinePay in under 5 minutes.

## 🚀 Getting Started

### 1. Install the PWA
Scan this QR code (or visit the URL) on your mobile device:
`http://localhost:5173`
> [!TIP]
> Use Chrome (Android) or Safari (iOS) and select "Add to Home Screen" for the true offline experience.

### 2. Pre-seeded Test Accounts
Use these credentials to test different scenarios:

| Role | PIN | Starting Balance | Trust Level |
| :--- | :--- | :--- | :--- |
| **The Merchant** | `111111` | ₹50,000 | Platinum (100) |
| **The Regular** | `123456` | ₹10,000 | Silver (65) |
| **The Newcomer** | `999999` | ₹500 | Bronze (50) |

## 🧪 Demo Scenarios

### Scenario A: The Zero-G Payment (Offline QR)
1.  **Turn off Wi-Fi/Mobile Data** on your phone.
2.  Login as **The Regular** (`123456`).
3.  Tap **Send** → Enter Amount: `₹500` → Recipient: `merchant@upi`.
4.  Authorize with PIN → **QR Code appears**.
5.  *Result*: Balance drops to ₹9,500 instantly. Status shows "OFFLINE VAULT LOCKED".

### Scenario B: The SMS Fallback (Ultra-Low Signal)
1.  Initiate a payment but choose **SMS** instead of QR.
2.  Observe the ultra-compressed 140-character token generated for standard GSM networks.

### Scenario C: The Fraud Prevention (Trust Limits)
1.  Login as **The Newcomer** (`999999`).
2.  Try to send **₹2,000**.
3.  *Result*: Transaction blocked. "Daily Offline Limit (₹500) Exceeded. Sync to Increase Trust."

### Scenario D: The Big Reveal (Background Sync)
1.  **Turn Wi-Fi back on**.
2.  Navigate to the **Sync Engine** tab.
3.  Watch as the app detects the "Uplink Restored" and pushes all pending transactions to the cloud.

## ⚠️ Known Limitations
- **Camera Resolution**: On some budget devices, the QR scanner may struggle in low light.
- **Biometrics**: Native biometrics (FaceID/TouchID) are only available in the **Mobile App (Expo)** version, not the PWA.
- **Sync Conflict**: If the same account is used on two devices simultaneously while offline, the last sync wins (server-side reconciliation).

---
*Thank you for judging OfflinePay! We are building a future where your money works even when the tower doesn't.*
