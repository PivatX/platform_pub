import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useCallback } from "react";

/**
 * Custom hook for Solana wallet and connection operations
 * Provides convenient access to wallet state and blockchain interactions
 */
export const useSolana = () => {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connecting,
    disconnect,
    sendTransaction,
    signTransaction,
    signAllTransactions,
    wallet,
  } = useWallet();

  /**
   * Get SOL balance for connected wallet
   */
  const getBalance = useCallback(async (): Promise<number | null> => {
    if (!publicKey) {
      console.warn("Wallet not connected");
      return null;
    }

    try {
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  }, [publicKey, connection]);

  /**
   * Get token balance for a specific mint address
   */
  const getTokenBalance = useCallback(
    async (mintAddress: string): Promise<number | null> => {
      if (!publicKey) {
        console.warn("Wallet not connected");
        return null;
      }

      try {
        const mintPublicKey = new PublicKey(mintAddress);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          publicKey,
          { mint: mintPublicKey }
        );

        if (tokenAccounts.value.length === 0) {
          return 0;
        }

        const balance =
          tokenAccounts.value[0].account.data.parsed.info.tokenAmount
            .uiAmount;
        return balance;
      } catch (error) {
        console.error("Error fetching token balance:", error);
        return null;
      }
    },
    [publicKey, connection]
  );

  /**
   * Send a transaction with proper error handling
   */
  const sendTransactionWithRetry = useCallback(
    async (
      transaction: Transaction,
      maxRetries: number = 3
    ): Promise<string | null> => {
      if (!publicKey || !sendTransaction) {
        console.error("Wallet not connected or sendTransaction not available");
        return null;
      }

      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const signature = await sendTransaction(transaction, connection, {
            skipPreflight: false,
            maxRetries: 3,
          });

          // Wait for confirmation
          await connection.confirmTransaction(signature, "confirmed");

          console.log(`Transaction successful: ${signature}`);
          return signature;
        } catch (error) {
          lastError = error as Error;
          console.error(`Transaction attempt ${attempt} failed:`, error);

          if (attempt < maxRetries) {
            // Exponential backoff
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
          }
        }
      }

      console.error("Transaction failed after all retries:", lastError);
      return null;
    },
    [publicKey, sendTransaction, connection]
  );

  return {
    // Connection
    connection,

    // Wallet state
    publicKey,
    connected,
    connecting,
    walletAddress: publicKey?.toBase58() || null,
    walletName: wallet?.adapter.name || null,

    // Wallet actions
    disconnect,
    sendTransaction: sendTransactionWithRetry,
    signTransaction,
    signAllTransactions,

    // Utility functions
    getBalance,
    getTokenBalance,
  };
};
