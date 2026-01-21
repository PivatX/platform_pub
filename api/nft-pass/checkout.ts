import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getMint,
  getAccount,
  TokenAccountNotFoundError,
} from '@solana/spl-token';
import { SystemProgram } from '@solana/web3.js';
import { keypairIdentity, Metaplex } from '@metaplex-foundation/js';
import base58 from 'bs58';

// Payment token address - Using mainnet USDC
const USDC_ADDRESS = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// NFT details
const NFT_NAME = 'Pivat Platform Pass';
const NFT_SYMBOL = 'PIVAT';

// Getter functions for env vars
const getMetadataUri = () => process.env.VITE_NFT_METADATA_URI || 'https://arweave.net/your-metadata-uri';
const getEndpoint = () => process.env.HELIUS_URL || 'https://mainnet.helius-rpc.com/?api-key=your-api-key';
const getPriceUsdc = () => parseFloat(process.env.VITE_NFT_PRICE || '8');

type PostResponse = {
  transaction: string;
  message: string;
};

type PostError = {
  error: string;
};

async function createNFTTransaction(account: PublicKey, preSigned: boolean = false): Promise<PostResponse> {
  const ENDPOINT = getEndpoint();
  const METADATA_URI = getMetadataUri();
  const PRICE_USDC = getPriceUsdc();
  
  const connection = new Connection(ENDPOINT);

  console.log('=== Starting NFT Transaction Creation ===');
  console.log('Buyer account:', account.toString());
  console.log('Pre-signed mode:', preSigned);

  const shopPrivateKey = process.env.SHOP_PRIVATE_KEY;
  if (!shopPrivateKey) {
    throw new Error('SHOP_PRIVATE_KEY not found');
  }

  let shopKeypair: Keypair;
  try {
    shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey));
  } catch (error) {
    throw new Error('Invalid SHOP_PRIVATE_KEY format');
  }

  const metaplex = Metaplex.make(connection).use(keypairIdentity(shopKeypair));
  const nfts = metaplex.nfts();

  const mintSeed = account.toBytes();
  const mintKeypair = Keypair.fromSeed(mintSeed.slice(0, 32));

  const mintAccountInfo = await connection.getAccountInfo(mintKeypair.publicKey);
  if (mintAccountInfo) {
    throw new Error('You already have an NFT Pass');
  }

  const { decimals } = await getMint(connection, USDC_ADDRESS);
  const fromUsdcAddress = await getAssociatedTokenAddress(USDC_ADDRESS, account);
  const toUsdcAddress = await getAssociatedTokenAddress(USDC_ADDRESS, shopKeypair.publicKey);

  let buyerTokenAccount;
  try {
    buyerTokenAccount = await getAccount(connection, fromUsdcAddress);
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError) {
      throw new Error('No USDC token account found. Please ensure you have USDC in your wallet.');
    }
    throw error;
  }

  const requiredAmount = PRICE_USDC * 10 ** decimals;
  if (buyerTokenAccount && buyerTokenAccount.amount < requiredAmount) {
    throw new Error(`Insufficient USDC balance. Required: ${PRICE_USDC} USDC`);
  }

  const nftRentCost = 0.02;
  const transactionFeeBuffer = 0.005;
  const totalRequiredSOL = nftRentCost + transactionFeeBuffer;
  const buyerBalance = await connection.getBalance(account);
  
  if (buyerBalance < Math.floor(totalRequiredSOL * 1e9)) {
    throw new Error(`Insufficient SOL balance. Required: ${totalRequiredSOL} SOL`);
  }

  let shopTokenAccount;
  try {
    shopTokenAccount = await getAccount(connection, toUsdcAddress);
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError) {
      shopTokenAccount = null;
    } else {
      throw error;
    }
  }

  const latestBlockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction();

  if (!shopTokenAccount) {
    const createShopTokenAccountInstruction = createAssociatedTokenAccountInstruction(
      shopKeypair.publicKey,
      toUsdcAddress,
      shopKeypair.publicKey,
      USDC_ADDRESS
    );
    transaction.add(createShopTokenAccountInstruction);
  }

  const usdcTransferInstruction = createTransferCheckedInstruction(
    fromUsdcAddress,
    USDC_ADDRESS,
    toUsdcAddress,
    account,
    PRICE_USDC * 10 ** decimals,
    decimals
  );
  transaction.add(usdcTransferInstruction);

  const nftRentTransferInstruction = SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: shopKeypair.publicKey,
    lamports: Math.floor(nftRentCost * 1e9),
  });
  transaction.add(nftRentTransferInstruction);

  const transactionBuilder = await nfts.builders().create({
    uri: METADATA_URI,
    name: NFT_NAME,
    symbol: NFT_SYMBOL,
    tokenOwner: account,
    updateAuthority: shopKeypair,
    sellerFeeBasisPoints: 250,
    useNewMint: mintKeypair,
  });

  const nftBuilderTransaction = await transactionBuilder.toTransaction(latestBlockhash);
  nftBuilderTransaction.instructions.forEach((instruction) => {
    transaction.add(instruction);
  });

  transaction.feePayer = account;
  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

  // If preSigned (for Solana Pay), sign with shop and mint FIRST
  // User will sign last in their wallet
  if (preSigned) {
    console.log('Pre-signing with shop and mint keypairs for Solana Pay...');
    transaction.partialSign(shopKeypair);
    transaction.partialSign(mintKeypair);
  }

  const serialized = transaction.serialize({ requireAllSignatures: false });
  const base64 = serialized.toString('base64');

  return {
    transaction: base64,
    message: `Purchase your Pivat Platform Pass for ${PRICE_USDC} USDC + ${totalRequiredSOL} SOL`,
  };
}

async function addAdditionalSignatures(
  signedTransactionBase64: string,
  account: PublicKey
): Promise<PostResponse> {
  const ENDPOINT = getEndpoint();
  const connection = new Connection(ENDPOINT);

  const shopPrivateKey = process.env.SHOP_PRIVATE_KEY;
  if (!shopPrivateKey) {
    throw new Error('SHOP_PRIVATE_KEY not found');
  }

  let shopKeypair: Keypair;
  try {
    shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey));
  } catch (error) {
    throw new Error('Invalid SHOP_PRIVATE_KEY format');
  }

  const mintSeed = account.toBytes();
  const mintKeypair = Keypair.fromSeed(mintSeed.slice(0, 32));

  const userSignedTransaction = Transaction.from(Buffer.from(signedTransactionBase64, 'base64'));
  userSignedTransaction.partialSign(shopKeypair);
  userSignedTransaction.partialSign(mintKeypair);

  const serialized = userSignedTransaction.serialize({ requireAllSignatures: false });
  const base64 = serialized.toString('base64');

  return {
    transaction: base64,
    message: 'Transaction fully signed - ready to send',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({
      label: 'Pivat Platform',
      icon: 'https://app.pivat.xyz/logo.png',
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;

      if ('signedTransaction' in body) {
        // Web app flow: User signed first, now add shop + mint signatures
        const { signedTransaction, account } = body;
        if (!signedTransaction || !account) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await addAdditionalSignatures(signedTransaction, new PublicKey(account));
        return res.json(result);
      } else {
        const { account } = body;
        if (!account) {
          return res.status(400).json({ error: 'No account provided' });
        }
        
        // Detect if this is Solana Pay request (simple heuristic: no additional fields)
        // Solana Pay needs pre-signed transaction (shop + mint sign first)
        const isSolanaPay = Object.keys(body).length === 1;
        
        const result = await createNFTTransaction(new PublicKey(account), isSolanaPay);
        return res.json(result);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error:', err);
      return res.status(500).json({ error: err.message || 'Error processing request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
