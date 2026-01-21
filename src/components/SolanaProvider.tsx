import { useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider = ({ children }: SolanaProviderProps) => {
  // Configure network: 'devnet' | 'testnet' | 'mainnet-beta'
  const network = import.meta.env.VITE_SOLANA_NETWORK || "devnet";
  console.log('Network:', network);
  
  // Use custom RPC endpoint if provided, otherwise use default
  const endpoint = useMemo(() => {
    const customRPC = import.meta.env.VITE_SOLANA_RPC_ENDPOINT;
    if (customRPC) {
      return customRPC;
    }
    return clusterApiUrl(network as "devnet" | "testnet" | "mainnet-beta");
  }, [network]);

  // Configure supported wallets
  // Note: Using empty array [] allows wallet-adapter to auto-detect installed wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
