import { useState, useCallback, useEffect, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Transaction } from "@solana/web3.js";
import { Loader2, Check, AlertTriangle, Mail, Building2, Globe, MessageSquare, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createQR, encodeURL, TransactionRequestURLFields } from "@solana/pay";
import { nftService } from "@/lib/api/services/nft.service";

interface ApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ApplicationStep = "form" | "payment" | "success";

interface FormData {
  fullName: string;
  email: string;
  projectName: string;
  projectWebsite: string;
  projectDescription: string;
  telegram: string;
}

export function ApplicationModal({ open, onOpenChange }: ApplicationModalProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const qrRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<ApplicationStep>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    projectName: "",
    projectWebsite: "",
    projectDescription: "",
    telegram: "",
  });

  // Reset to form step when modal opens
  useEffect(() => {
    if (open) {
      setStep("form");
    }
  }, [open]);

  // Generate QR code when on payment step
  useEffect(() => {
    if (step === "payment" && qrRef.current) {
      const { location } = window;
      const apiUrl = `${location.protocol}//${location.host}/api/nft-pass/checkout`;

      const urlFields: TransactionRequestURLFields = {
        link: new URL(apiUrl),
      };
      const url = encodeURL(urlFields);
      const qr = createQR(url, 256, "transparent");

      qrRef.current.innerHTML = "";
      qr.append(qrRef.current);
    }
  }, [step]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.projectName.trim()) {
      setError("Project name is required");
      return false;
    }
    if (!formData.projectDescription.trim()) {
      setError("Project description is required");
      return false;
    }
    return true;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    // Move to payment step
    setStep("payment");
  };

  const handlePayment = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Submit application to backend (you'll need to create this endpoint)
      // For now, we'll just log it and proceed with payment
      console.log("Application submitted:", formData);

      // Step 2: Create unsigned transaction
      const responseBody = await nftService.createTransaction(publicKey.toBase58());

      if ("error" in responseBody) {
        setError(responseBody.error);
        setLoading(false);
        return;
      }

      // Step 3: User signs transaction
      const unsignedTransaction = Transaction.from(
        Uint8Array.from(atob(responseBody.transaction), (c) => c.charCodeAt(0))
      );
      const userSignedTransaction = await signTransaction(unsignedTransaction);

      // Step 4: Add shop + mint signatures
      const signResponseBody = await nftService.addSignatures(
        publicKey.toBase58(),
        btoa(String.fromCharCode(...userSignedTransaction.serialize({ requireAllSignatures: false })))
      );

      if ("error" in signResponseBody) {
        setError(signResponseBody.error);
        setLoading(false);
        return;
      }

      // Step 5: Send fully signed transaction
      const fullySignedTransaction = Transaction.from(
        Uint8Array.from(atob(signResponseBody.transaction), (c) => c.charCodeAt(0))
      );

      const signature = await connection.sendRawTransaction(
        fullySignedTransaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
      );

      // Step 6: Confirm transaction
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
      setStep("success");
      setLoading(false);

      // TODO: Send application data to your backend with transaction hash
      console.log("Payment successful! Transaction:", signature);
    } catch (txError: unknown) {
      const err = txError as Error;
      setError(`Transaction failed: ${err?.message || "Unknown error"}`);
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection, formData]);

  const handleClose = () => {
    if (!loading) {
      setStep("form");
      setError(null);
      setFormData({
        fullName: "",
        email: "",
        projectName: "",
        projectWebsite: "",
        projectDescription: "",
        telegram: "",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Form Step */}
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Professional Plan Application</DialogTitle>
              <DialogDescription>
                Submit your application and pay the 79 USDC processing fee. We'll review your application and contact you for KYC verification.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                    Important Notice
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    The 79 USDC application fee is <strong>non-refundable</strong> and does not guarantee approval. We reserve the right to reject applications that don't meet our compliance standards.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll use this email to contact you regarding your application
                  </p>
                </div>

                <div>
                  <Label htmlFor="telegram">Telegram Username (Optional)</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleInputChange}
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Project Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Project Information</h3>
                
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Your Project Name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectWebsite">Project Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="projectWebsite"
                      name="projectWebsite"
                      type="url"
                      value={formData.projectWebsite}
                      onChange={handleInputChange}
                      placeholder="https://yourproject.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="projectDescription">Project Description *</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="projectDescription"
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      placeholder="Describe your project, its goals, and how you plan to use Pivat's infrastructure..."
                      className="pl-10 min-h-[120px]"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please provide details about your project and compliance measures
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Complete Payment</DialogTitle>
              <DialogDescription>
                Pay 79 USDC application fee to submit your application
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Application Summary */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Applicant:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{formData.projectName}</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Application Fee</span>
                  <span className="font-semibold">79 USDC</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Network fees</span>
                  <span>~0.025 SOL</span>
                </div>
                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">79 USDC + 0.025 SOL</span>
                  </div>
                </div>
              </div>

              {/* Pay with Wallet */}
              <div className="space-y-4">
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 w-5 h-5" />
                      Pay with Wallet
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Connected: {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or scan QR code
                  </span>
                </div>
              </div>

              {/* Solana Pay QR Code */}
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div ref={qrRef} className="mx-auto mb-3 rounded-xl overflow-hidden" />
                    <p className="text-sm text-muted-foreground">Scan with Solana Pay wallet</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("form")}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Success Step */}
        {step === "success" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Application Submitted!</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground">
                    Your application has been submitted and payment received.
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold">What happens next?</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-semibold">1</span>
                    </span>
                    <span>Our team will review your application within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-semibold">2</span>
                    </span>
                    <span>We'll contact you at <strong>{formData.email}</strong> for KYC verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary font-semibold">3</span>
                    </span>
                    <span>Once approved, you'll receive your Professional Platform Pass NFT</span>
                  </li>
                </ul>
              </div>

              {transactionHash && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Transaction Hash:</p>
                  <a
                    href={`https://solscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
                  </a>
                </div>
              )}

              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
