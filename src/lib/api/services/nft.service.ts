import { apiClient } from '../client';

export type PostResponse = {
  transaction: string;
  message: string;
};

export type PostError = {
  error: string;
};

export type GetResponse = {
  label: string;
  icon: string;
};

type CreateTransactionRequest = {
  account: string;
};

type SignTransactionRequest = {
  account: string;
  signedTransaction: string;
};

/**
 * NFT Pass Service
 * Handles NFT minting transactions and Solana Pay integration
 */
class NFTService {
  private readonly baseEndpoint = '/nft-pass';

  /**
   * Get Solana Pay metadata
   */
  async getPayMetadata(): Promise<GetResponse> {
    return apiClient.get<GetResponse>(`${this.baseEndpoint}/checkout`);
  }

  /**
   * Create unsigned NFT transaction
   * @param account - Buyer's wallet public key
   */
  async createTransaction(account: string): Promise<PostResponse> {
    return apiClient.post<PostResponse>(`${this.baseEndpoint}/checkout`, {
      account,
    } as CreateTransactionRequest);
  }

  /**
   * Add additional signatures to user-signed transaction
   * @param account - Buyer's wallet public key
   * @param signedTransaction - Base64 encoded user-signed transaction
   */
  async addSignatures(
    account: string,
    signedTransaction: string
  ): Promise<PostResponse> {
    return apiClient.post<PostResponse>(`${this.baseEndpoint}/checkout`, {
      account,
      signedTransaction,
    } as SignTransactionRequest);
  }
}

export const nftService = new NFTService();
export default NFTService;
