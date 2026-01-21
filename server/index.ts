import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import nftPassRouter from './routes/nft-pass';

// Load .env from root directory
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded from:', envPath);
}

// Debug: Log what was actually loaded (hide sensitive parts)
console.log('🔍 Environment check:');
console.log('  HELIUS_URL:', process.env.HELIUS_URL?.substring(0, 50) + '...');
console.log('  SHOP_PRIVATE_KEY:', process.env.SHOP_PRIVATE_KEY ? '✓ Set' : '✗ Missing');
console.log('  VITE_NFT_METADATA_URI:', process.env.VITE_NFT_METADATA_URI?.substring(0, 40) + '...');
console.log('  VITE_NFT_PRICE:', process.env.VITE_NFT_PRICE || 'Not set');
console.log('');

const app = express();
const PORT = process.env.PORT || 3001;

// Check required environment variables
const requiredEnvVars = [
  'HELIUS_URL',
  'SHOP_PRIVATE_KEY',
  'VITE_NFT_METADATA_URI',
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName] || process.env[varName]?.includes('your-')
);

if (missingEnvVars.length > 0) {
  console.error('\n❌ Missing or invalid environment variables:');
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 Please create a .env file in the root directory with:');
  console.error('   VITE_SOLANA_NETWORK=devnet');
  console.error('   HELIUS_URL=https://devnet.helius-rpc.com/?api-key=YOUR_ACTUAL_KEY');
  console.error('   VITE_NFT_METADATA_URI=https://arweave.net/your-metadata');
  console.error('   VITE_NFT_PRICE=8');
  console.error('   SHOP_PRIVATE_KEY=your_base58_private_key');
  console.error('   PORT=3001\n');
  console.error('💡 Run: npm run generate:keypair (to generate SHOP_PRIVATE_KEY)');
  console.error('💡 Get free Helius API key: https://helius.dev\n');
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/nft-pass', nftPassRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    envConfigured: missingEnvVars.length === 0,
    missingEnvVars: missingEnvVars.length > 0 ? missingEnvVars : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (missingEnvVars.length === 0) {
    console.log('✅ Environment variables configured');
  } else {
    console.log('⚠️  Environment variables missing - see errors above');
  }
});

export default app;
