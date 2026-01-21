# Quick Start Guide - Solana NFT Pass

Get your NFT minting platform up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Generate Shop Wallet

```bash
npm run generate:keypair
```

This will output:
- **Public Key**: Your shop wallet address (receives payments)
- **Private Key**: Add this to your `.env` file

## 3. Create `.env` File

Create a `.env` file in the root directory:

```env
# Network (use devnet for testing)
VITE_SOLANA_NETWORK=devnet

# RPC Endpoint
HELIUS_URL=https://devnet.helius-rpc.com/?api-key=YOUR_HELIUS_KEY

# NFT Configuration
VITE_NFT_METADATA_URI=https://arweave.net/sample-metadata
VITE_NFT_PRICE=8

# Shop Private Key (from step 2)
SHOP_PRIVATE_KEY=paste_your_private_key_here

# Server Port
PORT=3001
```

### Get a FREE Helius API Key:
1. Go to [helius.dev](https://helius.dev)
2. Sign up for free account
3. Create new project
4. Copy your API key
5. Replace `YOUR_HELIUS_KEY` in the `.env`

## 4. Fund Your Shop Wallet (Devnet)

```bash
# Get devnet SOL
solana airdrop 1 YOUR_SHOP_PUBLIC_KEY --url devnet

# Check balance
npm run check:wallet YOUR_SHOP_PUBLIC_KEY
```

Your shop wallet needs SOL to pay for NFT creation rent.

## 5. Prepare NFT Metadata

Create a JSON file with your NFT metadata:

```json
{
  "name": "Pivat Platform Pass",
  "symbol": "PIVAT",
  "description": "Premium access to all platform features",
  "image": "https://your-domain.com/nft-image.png",
  "attributes": [
    {
      "trait_type": "Access Level",
      "value": "Premium"
    }
  ]
}
```

Upload to Arweave or IPFS and update `VITE_NFT_METADATA_URI` in `.env`.

**Quick upload options:**
- [Arweave](https://www.arweave.org/)
- [NFT.Storage](https://nft.storage/) (free IPFS)
- [Pinata](https://pinata.cloud/) (IPFS)

## 6. Run the Application

```bash
# Start both frontend and backend
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001

## 7. Test the Minting Flow

1. Open http://localhost:8080/get-started in your browser
2. Connect your wallet (use Phantom for easiest testing)
3. Make sure your wallet has:
   - **0.025+ SOL** (for rent and fees)
   - **8+ USDC** (for the NFT payment)

### Get Devnet USDC:
1. Visit [spl-token-faucet.com](https://spl-token-faucet.com/)
2. Enter your wallet address
3. Request devnet USDC

### Get Devnet SOL:
```bash
solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet
```

## 8. Mint Your First NFT!

Click "Mint NFT Pass" and follow the prompts. The transaction will:
1. Transfer 8 USDC to shop wallet
2. Transfer 0.02 SOL for NFT rent
3. Mint the NFT to your wallet

## Troubleshooting

### "No USDC token account found"
You need devnet USDC in your wallet. Visit spl-token-faucet.com

### "Insufficient SOL balance"
You need at least 0.025 SOL. Run: `solana airdrop 1 <your-wallet> --url devnet`

### "SHOP_PRIVATE_KEY not found"
Make sure your `.env` file is in the root directory and contains the `SHOP_PRIVATE_KEY`

### Backend not starting
Check that port 3001 is available. Change `PORT` in `.env` if needed.

### QR Code not showing
Make sure the backend is running on port 3001 and Vite proxy is configured.

## Next Steps

### For Testing:
- Mint multiple NFTs from different wallets
- Test the QR code with Solana Pay wallets
- Verify NFTs appear in wallets

### For Production:
1. Change network to `mainnet-beta`
2. Use production Helius RPC
3. Upload production NFT metadata
4. Get real USDC and SOL
5. Test with small amounts first
6. Deploy backend to production server
7. Deploy frontend to CDN

## Support Scripts

### Generate New Keypair
```bash
npm run generate:keypair
```

### Check Wallet Balance
```bash
npm run check:wallet <wallet_address>
```

## File Structure

```
/server                 # Backend API
  /routes
    nft-pass.ts        # NFT minting logic

/src
  /pages
    GetStarted.tsx     # NFT minting page
  /lib/api/services
    nft.service.ts     # NFT API client
  /components
    SolanaProvider.tsx # Wallet provider
    WalletButton.tsx   # Connect wallet button
```

## Resources

- [Solana Documentation](https://docs.solana.com)
- [Metaplex Documentation](https://docs.metaplex.com)
- [Wallet Adapter](https://github.com/anza-xyz/wallet-adapter)
- [Solana Pay](https://docs.solanapay.com)

## Questions?

Check the full documentation in:
- `SETUP.md` - Detailed setup guide
- `NFT_IMPLEMENTATION.md` - Technical implementation details

Happy minting! 🎉
