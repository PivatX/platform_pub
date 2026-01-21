import { Router, Request, Response } from 'express';
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

const router = Router();

// Payment token address - Using mainnet USDC
const USDC_ADDRESS = new PublicKey(
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
);

// NFT details
const NFT_NAME = 'Pivat Platform Pass';
const NFT_SYMBOL = 'PIVAT';

// Getter functions for env vars (read fresh each time to support hot reload)
const getMetadataUri = () => process.env.VITE_NFT_METADATA_URI || 'https://arweave.net/your-metadata-uri';
const getEndpoint = () => process.env.HELIUS_URL || 'https://mainnet.helius-rpc.com/?api-key=your-api-key';
const getPriceUsdc = () => parseFloat(process.env.VITE_NFT_PRICE || '8');

type InputData = {
  account: string;
};

type GetResponse = {
  label: string;
  icon: string;
};

export type PostResponse = {
  transaction: string;
  message: string;
};

export type PostError = {
  error: string;
};

type SignRequest = {
  signedTransaction: string;
};

// GET endpoint for Solana Pay metadata
router.get('/checkout', (req: Request, res: Response<GetResponse>) => {
  const response: GetResponse = {
    label: 'Pivat Platform',
    icon: 'https://app.pivat.io/logo/logo_single.png',
  };

  res.json(response);
});

async function createNFTTransaction(
  account: PublicKey
): Promise<PostResponse> {
  const ENDPOINT = getEndpoint();
  const METADATA_URI = getMetadataUri();
  const PRICE_USDC = getPriceUsdc();
  
  const connection = new Connection(ENDPOINT);

  console.log('=== Starting NFT Transaction Creation ===');
  console.log('Buyer account:', account.toString());
  console.log('RPC Endpoint:', ENDPOINT);
  console.log('NFT Price:', PRICE_USDC, 'USDC');
  console.log('NFT Metadata URI:', METADATA_URI);
  console.log('USDC Address:', USDC_ADDRESS.toString());

  // Get the shop keypair from the environment variable
  const shopPrivateKey = process.env.SHOP_PRIVATE_KEY;
  if (!shopPrivateKey) {
    console.error('SHOP_PRIVATE_KEY environment variable not found');
    throw new Error(
      'SHOP_PRIVATE_KEY not found. Please check your .env file'
    );
  }

  let shopKeypair: Keypair;
  try {
    shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey));
    console.log('Shop wallet:', shopKeypair.publicKey.toString());
  } catch (error) {
    console.error('Failed to decode shop private key:', error);
    throw new Error(
      "Invalid SHOP_PRIVATE_KEY format. Make sure it's a valid base58 encoded private key"
    );
  }

  // Initialize Metaplex with shop keypair
  const metaplex = Metaplex.make(connection).use(
    keypairIdentity(shopKeypair)
  );

  const nfts = metaplex.nfts();

  // Create a deterministic mint keypair based on the user's account
  const mintSeed = account.toBytes();
  const mintKeypair = Keypair.fromSeed(mintSeed.slice(0, 32));
  console.log(
    'NFT Mint address (deterministic):',
    mintKeypair.publicKey.toString()
  );

  // Check if the mint account already exists
  const mintAccountInfo = await connection.getAccountInfo(
    mintKeypair.publicKey
  );
  if (mintAccountInfo) {
    console.log('Mint account already exists - user already has an NFT pass');
    throw new Error(
      'You already have an NFT Pass. The mint account for your wallet already exists.'
    );
  }

  // Get USDC mint info
  const { decimals } = await getMint(connection, USDC_ADDRESS);

  // Get the associated token addresses
  const fromUsdcAddress = await getAssociatedTokenAddress(USDC_ADDRESS, account);
  const toUsdcAddress = await getAssociatedTokenAddress(
    USDC_ADDRESS,
    shopKeypair.publicKey
  );

  // Check if buyer's USDC account exists
  let buyerTokenAccount;
  try {
    buyerTokenAccount = await getAccount(connection, fromUsdcAddress);
    console.log('Buyer USDC account found:', fromUsdcAddress.toString());
    console.log(
      'Buyer USDC balance:',
      Number(buyerTokenAccount.amount) / 10 ** decimals,
      'USDC'
    );
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError) {
      console.error('Buyer has no USDC token account');
      throw new Error(
        'No USDC token account found. Please ensure you have USDC in your wallet.'
      );
    } else {
      throw error;
    }
  }

  // Check if buyer has enough USDC
  const requiredAmount = PRICE_USDC * 10 ** decimals;
  if (buyerTokenAccount && buyerTokenAccount.amount < requiredAmount) {
    console.error('Insufficient USDC balance:', {
      required: PRICE_USDC,
      available: Number(buyerTokenAccount.amount) / 10 ** decimals,
    });
    throw new Error(
      `Insufficient USDC balance. Required: ${PRICE_USDC} USDC, Available: ${Number(buyerTokenAccount.amount) / 10 ** decimals} USDC`
    );
  }

  // Define rent amount needed for NFT creation
  const nftRentCost = 0.02;
  const transactionFeeBuffer = 0.005;
  const totalRequiredSOL = nftRentCost + transactionFeeBuffer;
  const totalRequiredLamports = Math.floor(totalRequiredSOL * 1e9);

  // Check if buyer has enough SOL
  const buyerBalance = await connection.getBalance(account);
  if (buyerBalance < totalRequiredLamports) {
    console.error('Insufficient SOL balance:', {
      required: totalRequiredSOL,
      available: buyerBalance / 1e9,
      breakdown: {
        nftRent: nftRentCost,
        transactionFees: transactionFeeBuffer,
      },
    });
    throw new Error(
      `Insufficient SOL balance. Required: ${totalRequiredSOL} SOL (${nftRentCost} for NFT rent + ${transactionFeeBuffer} for fees), Available: ${(buyerBalance / 1e9).toFixed(4)} SOL`
    );
  }

  console.log('Buyer SOL balance:', buyerBalance / 1e9, 'SOL');
  console.log('NFT rent cost:', nftRentCost, 'SOL');
  console.log('Transaction fee buffer:', transactionFeeBuffer, 'SOL');
  console.log('Total SOL required:', totalRequiredSOL, 'SOL');

  // Check shop wallet SOL balance
  const shopBalance = await connection.getBalance(shopKeypair.publicKey);
  console.log('Shop SOL balance:', shopBalance / 1e9, 'SOL');

  // Check if shop's USDC account exists
  let shopTokenAccount;
  try {
    shopTokenAccount = await getAccount(connection, toUsdcAddress);
    console.log('Shop USDC account found:', toUsdcAddress.toString());
  } catch (error: unknown) {
    if (error instanceof TokenAccountNotFoundError) {
      console.log('Shop USDC account not found, will create it');
      shopTokenAccount = null;
    } else {
      throw error;
    }
  }

  const latestBlockhash = await connection.getLatestBlockhash();
  const transaction = new Transaction();

  // If shop's token account doesn't exist, add instruction to create it
  if (!shopTokenAccount) {
    const createShopTokenAccountInstruction =
      createAssociatedTokenAccountInstruction(
        shopKeypair.publicKey, // payer
        toUsdcAddress, // associated token account
        shopKeypair.publicKey, // owner
        USDC_ADDRESS // mint
      );

    transaction.add(createShopTokenAccountInstruction);
  }

  // Create USDC transfer instruction
  const usdcTransferInstruction = createTransferCheckedInstruction(
    fromUsdcAddress,
    USDC_ADDRESS,
    toUsdcAddress,
    account,
    PRICE_USDC * 10 ** decimals,
    decimals
  );

  transaction.add(usdcTransferInstruction);

  // Transfer SOL from buyer to shop to cover NFT creation rent
  const nftRentTransferInstruction = SystemProgram.transfer({
    fromPubkey: account,
    toPubkey: shopKeypair.publicKey,
    lamports: Math.floor(nftRentCost * 1e9),
  });

  transaction.add(nftRentTransferInstruction);

  // Create NFT
  const transactionBuilder = await nfts.builders().create({
    uri: METADATA_URI,
    name: NFT_NAME,
    symbol: NFT_SYMBOL,
    tokenOwner: account,
    updateAuthority: shopKeypair,
    sellerFeeBasisPoints: 250,
    useNewMint: mintKeypair,
  });

  // Convert NFT builder to transaction
  const nftBuilderTransaction =
    await transactionBuilder.toTransaction(latestBlockhash);

  // Add NFT instructions to main transaction
  nftBuilderTransaction.instructions.forEach((instruction) => {
    transaction.add(instruction);
  });

  // Set fee payer and blockhash
  transaction.feePayer = account;
  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

  console.log('Transaction created (unsigned)');

  // Serialize transaction (unsigned)
  const serialized = transaction.serialize({
    requireAllSignatures: false,
  });

  const base64 = serialized.toString('base64');

  console.log('Transaction size:', serialized.length, 'bytes');

  const message = `Purchase your Pivat Platform Pass for ${PRICE_USDC} USDC + ${totalRequiredSOL} SOL (NFT rent + fees)`;

  return {
    transaction: base64,
    message,
  };
}

async function addAdditionalSignatures(
  signedTransactionBase64: string,
  account: PublicKey
): Promise<PostResponse> {
  const ENDPOINT = getEndpoint();
  const connection = new Connection(ENDPOINT);

  console.log('=== Adding Additional Signatures ===');
  console.log('Buyer account:', account.toString());

  const shopPrivateKey = process.env.SHOP_PRIVATE_KEY;
  if (!shopPrivateKey) {
    console.error('SHOP_PRIVATE_KEY environment variable not found');
    throw new Error('SHOP_PRIVATE_KEY not found');
  }

  let shopKeypair: Keypair;
  try {
    shopKeypair = Keypair.fromSecretKey(base58.decode(shopPrivateKey));
    console.log('Shop wallet:', shopKeypair.publicKey.toString());
  } catch (error) {
    console.error('Failed to decode shop private key:', error);
    throw new Error('Invalid SHOP_PRIVATE_KEY format');
  }

  // Create deterministic mint keypair
  const mintSeed = account.toBytes();
  const mintKeypair = Keypair.fromSeed(mintSeed.slice(0, 32));
  console.log(
    'NFT Mint address (deterministic):',
    mintKeypair.publicKey.toString()
  );

  // Deserialize the user-signed transaction
  console.log('Deserializing user-signed transaction...');
  const userSignedTransaction = Transaction.from(
    Buffer.from(signedTransactionBase64, 'base64')
  );

  // Add shop and mint signatures
  console.log('Adding shop signature to transaction...');
  userSignedTransaction.partialSign(shopKeypair);

  console.log('Adding mint signature to transaction...');
  userSignedTransaction.partialSign(mintKeypair);

  // Serialize the fully signed transaction
  console.log('Serializing fully signed transaction...');
  const serialized = userSignedTransaction.serialize({
    requireAllSignatures: false,
  });

  const base64 = serialized.toString('base64');

  console.log('Transaction size:', serialized.length, 'bytes');
  console.log('Transaction fully signed (user + shop + mint)');

  const message = 'Transaction fully signed - ready to send';

  return {
    transaction: base64,
    message,
  };
}

// POST endpoint for creating and signing transactions
router.post(
  '/checkout',
  async (
    req: Request<object, object, InputData | (SignRequest & InputData)>,
    res: Response<PostResponse | PostError>
  ) => {
    try {
      console.log('\n=== NFT Pass Checkout API Called ===');
      const body = req.body;
      console.log('Request body keys:', Object.keys(body));

      // Check if this is a signing request
      if ('signedTransaction' in body) {
        const { signedTransaction, account } = body as SignRequest & InputData;

        if (!signedTransaction) {
          console.error('No signedTransaction provided');
          return res
            .status(400)
            .json({ error: 'No signedTransaction provided' } as PostError);
        }

        if (!account) {
          console.error('No account provided in signing request');
          return res
            .status(400)
            .json({ error: 'No account provided' } as PostError);
        }

        console.log('Adding additional signatures for account:', account);
        const signedOutputData = await addAdditionalSignatures(
          signedTransaction,
          new PublicKey(account)
        );
        console.log('Additional signatures added successfully');

        return res.json(signedOutputData);
      } else {
        const { account } = body as InputData;

        if (!account) {
          console.error('No account provided in request');
          return res
            .status(400)
            .json({ error: 'No account provided' } as PostError);
        }

        console.log('Creating transaction for account:', account);
        const mintOutputData = await createNFTTransaction(
          new PublicKey(account)
        );
        console.log('Transaction created successfully');

        return res.json(mintOutputData);
      }
    } catch (error: unknown) {
      const err = error as Error;
      console.error('\n❌ Error in checkout API:', err);
      console.error('Error stack:', err.stack);

      let errorMessage = 'Error processing request';
      if (err.message) {
        errorMessage = err.message;
      }

      return res.status(500).json({ error: errorMessage } as PostError);
    }
  }
);

export default router;
