# Solana NFT Pass Setup Guide

## Prerequisites

- Node.js 18+ installed
- Solana CLI installed (optional, for keypair generation)
- USDC and SOL for testing (devnet) or production (mainnet)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Solana Network Configuration
VITE_SOLANA_NETWORK=devnet

# Helius RPC Endpoint (or use another RPC provider)
HELIUS_URL=https://devnet.helius-rpc.com/?api-key=your-api-key

# NFT Configuration
VITE_NFT_METADATA_URI=https://arweave.net/your-metadata-uri
VITE_NFT_PRICE=8

# Shop Private Key (base58 encoded)
SHOP_PRIVATE_KEY=your_base58_encoded_private_key_here

# API Server Port
PORT=3001
```

## Generating Shop Keypair

### Option 1: Using Solana CLI

```bash
# Generate new keypair
solana-keygen new --outfile shop-keypair.json

# Get the base58 encoded private key
cat shop-keypair.json | base58
```

### Option 2: Using Node.js

```javascript
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const keypair = Keypair.generate();
const privateKey = bs58.encode(keypair.secretKey);
console.log('Public Key:', keypair.publicKey.toBase58());
console.log('Private Key (base58):', privateKey);
```

## NFT Metadata Setup

1. Create your NFT metadata JSON file:

```json
{
  "name": "Pivat Platform Pass",
  "symbol": "PIVAT",
  "description": "Premium access to Pivat platform features",
  "image": "https://your-domain.com/nft-image.png",
  "attributes": [
    {
      "trait_type": "Access Level",
      "value": "Premium"
    },
    {
      "trait_type": "Plan",
      "value": "Professional"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://your-domain.com/nft-image.png",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

2. Upload to Arweave or IPFS
3. Update `VITE_NFT_METADATA_URI` with the URI

## Installation

```bash
# Install dependencies
npm install
```

## Running the Application

### Development Mode (Both Frontend and Backend)

```bash
npm run dev:all
```

This will start:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

### Run Individually

```bash
# Frontend only
npm run dev

# Backend API only
npm run dev:server
```

## Testing

### Devnet Testing

1. Get devnet SOL from faucet:
```bash
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet
```

2. Get devnet USDC from [Solana Faucet](https://spl-token-faucet.com/)

### Production

1. Ensure you have mainnet USDC and SOL
2. Update `.env` with `VITE_SOLANA_NETWORK=mainnet-beta`
3. Use a production RPC endpoint (Helius, QuickNode, etc.)

## Security Considerations

- Never commit your `.env` file or private keys
- Use environment variables for all sensitive data
- For production, consider using a key management service
- Regularly rotate your shop private key
- Monitor your shop wallet for suspicious activity

## Troubleshooting

### "Insufficient SOL balance" Error

The buyer needs at least 0.025 SOL for NFT creation rent and transaction fees.

### "No USDC token account found" Error

The buyer needs to have USDC in their wallet. Make sure they have the SPL Token program installed.

### "SHOP_PRIVATE_KEY not found" Error

Make sure your `.env` file is in the root directory and contains the `SHOP_PRIVATE_KEY` variable.

### QR Code Not Showing

Check browser console for errors. Make sure the backend API is running on port 3001.

## API Endpoints

### GET /api/nft-pass/checkout

Returns Solana Pay metadata for QR code generation.

### POST /api/nft-pass/checkout

Creates unsigned NFT transaction or adds additional signatures.

**Create Transaction Request:**
```json
{
  "account": "wallet_public_key"
}
```

**Add Signatures Request:**
```json
{
  "account": "wallet_public_key",
  "signedTransaction": "base64_encoded_signed_transaction"
}
```

## Support

For issues or questions, please check the logs in the console or contact support.
