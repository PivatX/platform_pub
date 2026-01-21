import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check, ArrowLeft, Shield, Lock, CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ApplicationModal } from "@/components/ApplicationModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
  const { publicKey } = useWallet();

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  // Open modal after wallet connects
  useEffect(() => {
    if (shouldOpenModal && publicKey) {
      setIsApplicationModalOpen(true);
      setShouldOpenModal(false);
    }
  }, [publicKey, shouldOpenModal]);

  const handleStartApplication = () => {
    if (publicKey) {
      // Wallet already connected, open modal
      setIsApplicationModalOpen(true);
    } else {
      // Need to connect wallet first, trigger wallet modal
      setShouldOpenModal(true);
      // The WalletMultiButton will be triggered programmatically
      document.querySelector<HTMLButtonElement>('.wallet-adapter-button')?.click();
    }
  };

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

                  {/* Important Notice */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> This is an application fee. Payment does not guarantee approval. We'll review your application and contact you for KYC verification.
                    </p>
                  </div>

                  {/* Hidden Wallet Button for triggering connection */}
                  <div className="hidden">
                    <WalletMultiButton />
                  </div>

                  {/* Application Button */}
                  <Button 
                    onClick={handleStartApplication}
                    className="w-full" 
                    size="lg"
                  >
                    <Wallet className="mr-2 w-5 h-5" />
                    {publicKey ? 'Start Application' : 'Connect Wallet & Apply'}
                  </Button>
                  
                  {!publicKey && (
                    <p className="text-xs text-center text-muted-foreground">
                      You'll be prompted to connect your wallet first
                    </p>
                  )}
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
      
      {/* Application Modal */}
      <ApplicationModal 
        open={isApplicationModalOpen} 
        onOpenChange={setIsApplicationModalOpen}
      />
    </div>
  );
}
