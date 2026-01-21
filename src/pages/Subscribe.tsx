import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Check, ArrowLeft, Shield, Lock, CheckCircle2, Wallet, Loader2, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { nftService } from "@/lib/api/services/nft.service";

const professionalFeatures = [
  "5 token deployments",
  "Full compliance framework",
  "Priority support (24h response)",
  "Multi-signature wallets",
  "90-day transaction history",
  "REST API access",
  "Team management (3 seats)",
  "Compliance reporting",
];

const enterpriseFeatures = [
  "Unlimited token deployments",
  "Custom compliance frameworks",
  "Dedicated account manager",
  "White-label options",
  "99.9% SLA guarantee",
  "Unlimited API calls",
  "Unlimited team seats",
  "Custom integrations",
  "On-premise deployment options",
  "Security audit support",
];

export default function Subscribe() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "professional";
  const isProfessional = plan === "professional";

  const features = isProfessional ? professionalFeatures : enterpriseFeatures;

  // Solana integration
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const qrRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Generate QR code
  useEffect(() => {
    if (!isProfessional || !qrRef.current) return;

    const { location } = window;
    const apiUrl = `${location.protocol}//${location.host}/api/nft-pass/checkout`;

    const urlFields: TransactionRequestURLFields = {
      link: new URL(apiUrl),
    };
    const url = encodeURL(urlFields);
    const qr = createQR(url, 256, "transparent");

    qrRef.current.innerHTML = "";
    qr.append(qrRef.current);
  }, [isProfessional]);

  // Handle wallet mint
  const handleMint = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Create unsigned transaction
      const responseBody = await nftService.createTransaction(publicKey.toBase58());

      if ("error" in responseBody) {
        setError(responseBody.error);
        setLoading(false);
        return;
      }

      // Step 2: User signs transaction
      const unsignedTransaction = Transaction.from(
        Uint8Array.from(atob(responseBody.transaction), c => c.charCodeAt(0))
      );
      const userSignedTransaction = await signTransaction(unsignedTransaction);

      // Step 3: Add shop + mint signatures
      const signResponseBody = await nftService.addSignatures(
        publicKey.toBase58(),
        btoa(String.fromCharCode(...userSignedTransaction.serialize({ requireAllSignatures: false })))
      );

      if ("error" in signResponseBody) {
        setError(signResponseBody.error);
        setLoading(false);
        return;
      }

      // Step 4: Send fully signed transaction
      const fullySignedTransaction = Transaction.from(
        Uint8Array.from(atob(signResponseBody.transaction), c => c.charCodeAt(0))
      );

      const signature = await connection.sendRawTransaction(
        fullySignedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );

      // Step 5: Confirm transaction
      const latestBlockhash = await connection.getLatestBlockhash();
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error("Transaction failed");
      }

      setTransactionHash(signature);
      setSuccess(true);
      setLoading(false);
    } catch (txError: unknown) {
      const err = txError as Error;
      setError(`Transaction failed: ${err?.message || "Unknown error"}`);
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="container max-w-5xl">
          {/* Back button */}
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link to="/get-started">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Plans
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Features */}
            <div>
              <Badge variant="outline" className="mb-4">
                {isProfessional ? "Professional" : "Enterprise"} Plan
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                {isProfessional 
                  ? "Complete Your Subscription"
                  : "Enterprise Subscription"
                }
              </h1>
              <p className="text-muted-foreground mb-8">
                {isProfessional
                  ? "Get access to professional token infrastructure with compliance tools and priority support."
                  : "Custom enterprise solutions tailored to your organization's needs."
                }
              </p>

              {/* Features List */}
              <div className="enterprise-card p-6 mb-6">
                <h3 className="font-semibold mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="enterprise-card p-6 lg:p-8">
              <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

              {isProfessional ? (
                <>
                  {/* Pricing */}
                  <div className="bg-muted/50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground">Professional Plan</span>
                      <span className="font-semibold">39 USDC</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Rent + Network fees</span>
                      <span>~0.025 SOL</span>
                    </div>
                    <div className="border-t border-border mt-4 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">39 USDC + 0.025 SOL</span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Connection */}
                  <div className="space-y-4">
                    {!publicKey ? (
                      <WalletMultiButton className="!w-full !bg-gradient-to-r !from-primary !via-secondary !to-accent !text-foreground hover:!from-primary/90 hover:!via-secondary/90 hover:!to-accent/90 !border-0 !rounded-lg !px-6 !py-3 !font-semibold !h-12" />
                    ) : (
                      <Button 
                        variant="hero" 
                        className="w-full" 
                        size="lg"
                        onClick={handleMint}
                        disabled={loading || success}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : success ? (
                          <>
                            <Check className="mr-2 w-5 h-5" />
                            Subscribed!
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 w-5 h-5" />
                            Complete Subscription
                          </>
                        )}
                      </Button>
                    )}
                    <p className="text-xs text-center text-muted-foreground">
                      Connect your Solana wallet to complete the subscription. We support Phantom, Solflare, and other major wallets.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setError(null)}
                          className="text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {success && transactionHash && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                            Subscription successful!
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 dark:text-green-400 text-xs">Transaction:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
                          >
                            <a
                              href={`https://solscan.io/tx/${transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Solana Pay QR Code */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Or pay with Solana Pay
                    </p>
                    <div className="bg-muted/30 rounded-xl p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div ref={qrRef} className="mx-auto mb-4 rounded-xl overflow-hidden" />
                        <p className="text-sm text-muted-foreground">Scan with any Solana Pay wallet</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-6">
                    Enterprise plans require a custom quote based on your organization's needs.
                  </p>
                  <Button asChild variant="hero" size="lg">
                    <a href="mailto:sales@Pivat.io?subject=Enterprise%20Plan%20Inquiry">
                      Contact Sales Team
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
