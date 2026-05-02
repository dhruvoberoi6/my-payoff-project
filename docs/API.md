# OfflinePay API Documentation

## OpenAPI 3.0 Specification (YAML)

```yaml
openapi: 3.0.0
info:
  title: OfflinePay Sync API
  description: API for synchronizing offline payment ledgers and managing trust scores.
  version: 1.0.0
servers:
  - url: https://api.offlinepay.io/v1
    description: Production Server

paths:
  /sync:
    post:
      summary: Synchronize transaction queue
      description: Pushes local pending transactions to the central ledger.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                userId:
                  type: string
                transactions:
                  type: array
                  items:
                    $ref: '#/components/schemas/Transaction'
      responses:
        '200':
          description: Sync successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: string
                  processedCount:
                    type: integer
                  newBalance:
                    type: number
        '400':
          description: Invalid transaction payload

components:
  schemas:
    Transaction:
      type: object
      properties:
        txnId:
          type: string
        amount:
          type: number
        type:
          type: string
          enum: [SEND, RECEIVE]
        timestamp:
          type: string
          format: date-time
        signature:
          type: string
```

## Error Code Reference

| Code | Message | Description |
| :--- | :--- | :--- |
| `ERR_AUTH_01` | Unauthorized | Bearer token missing or expired. |
| `ERR_VAL_02` | Invalid Signature | The SHA-256 signature does not match the payload. |
| `ERR_BAL_03` | Insufficient Funds | Server-side balance is lower than the transaction amount. |
| `ERR_DUP_04` | Duplicate TXN | This `txnId` has already been processed. |
| `ERR_LMT_05` | Daily Limit Exceeded | User has exceeded their daily offline limit based on Trust Score. |

## Rate Limiting

To prevent DoS attacks and brute-force PIN attempts, the following limits apply:
- **Sync Endpoints**: 60 requests per minute per IP.
- **Auth Endpoints**: 5 requests per minute per User ID.
- **Trust Score Queries**: 120 requests per minute.

## Request Example (Sync)

```bash
curl -X POST https://api.offlinepay.io/v1/sync \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "transactions": [
      {
        "txnId": "TXN_98765",
        "amount": 500,
        "type": "SEND",
        "signature": "a591a...3c2"
      }
    ]
  }'
```
