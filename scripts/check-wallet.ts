import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Check shop wallet balances
 * 
 * Usage: tsx scripts/check-wallet.ts <wallet_address>
 */

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const RPC_URL = process.env.HELIUS_URL || 'https://api.mainnet-beta.solana.com';

async function checkWallet(walletAddress: string) {
  console.log('\n💰 Checking Wallet Balances...\n');
  console.log('Wallet:', walletAddress);
  console.log('Network:', RPC_URL.includes('devnet') ? 'Devnet' : 'Mainnet');
  console.log('─────────────────────────────────────────────────────────────\n');

  const connection = new Connection(RPC_URL);
  const publicKey = new PublicKey(walletAddress);

  try {
    // Check SOL balance
    const solBalance = await connection.getBalance(publicKey);
    console.log('SOL Balance:', (solBalance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');

    // Check USDC balance
    try {
      const usdcTokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
      const accountInfo = await getAccount(connection, usdcTokenAccount);
      const usdcBalance = Number(accountInfo.amount) / 1e6;
      console.log('USDC Balance:', usdcBalance.toFixed(2), 'USDC');
      console.log('USDC Token Account:', usdcTokenAccount.toBase58());
    } catch (error) {
      console.log('USDC Balance: 0 USDC (No token account)');
    }

    console.log('\n─────────────────────────────────────────────────────────────\n');

    // Recommendations
    if (solBalance < 0.1 * LAMPORTS_PER_SOL) {
      console.log('⚠️  Warning: Low SOL balance. Consider adding more SOL for transaction fees.');
    } else {
      console.log('✅ SOL balance looks good!');
    }

    console.log('\n');
  } catch (error) {
    console.error('❌ Error checking wallet:', error);
  }
}

const walletAddress = process.argv[2];

if (!walletAddress) {
  console.error('\n❌ Please provide a wallet address as argument');
  console.log('Usage: tsx scripts/check-wallet.ts <wallet_address>\n');
  process.exit(1);
}

checkWallet(walletAddress);
