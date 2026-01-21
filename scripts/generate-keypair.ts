import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Generate a new Solana keypair for the shop wallet
 * 
 * Usage: tsx scripts/generate-keypair.ts
 */

console.log('\n🔐 Generating Shop Wallet Keypair...\n');

const keypair = Keypair.generate();
const privateKey = bs58.encode(keypair.secretKey);

console.log('✅ Keypair generated successfully!\n');
console.log('📋 Shop Wallet Details:');
console.log('─────────────────────────────────────────────────────────────\n');
console.log('Public Key (Wallet Address):');
console.log(keypair.publicKey.toBase58());
console.log('\nPrivate Key (Base58 - Add to .env as SHOP_PRIVATE_KEY):');
console.log(privateKey);
console.log('\n─────────────────────────────────────────────────────────────\n');

console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Save the private key in your .env file');
console.log('2. NEVER commit the .env file to git');
console.log('3. Keep the private key secure and backed up');
console.log('4. Fund this wallet with SOL for transaction fees');
console.log('5. This wallet will receive USDC payments\n');

console.log('📝 Next Steps:');
console.log('1. Add to .env: SHOP_PRIVATE_KEY=' + privateKey);
console.log('2. Fund wallet with SOL for rent: ' + keypair.publicKey.toBase58());
console.log('3. Restart your backend server\n');
