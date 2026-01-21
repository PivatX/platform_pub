import { Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const plans = [
  {
    name: "Starter",
    description: "Perfect for testing and small projects",
    price: "Free Trial",
    priceNote: "14 days, no credit card",
    cta: "Start Free Trial",
    ctaHref: "mailto:hello@Pivat.io?subject=Starter%20Plan%20Interest",
    features: [
      "1 token deployment",
      "Basic compliance checks",
      "Community support",
      "Standard security",
      "7-day transaction history",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For growing projects with compliance needs",
    price: "39 USDC",
    priceNote: "+ 0.025 SOL (rent + fees)",
    cta: "Subscribe Now",
    ctaHref: "/subscribe?plan=professional",
    features: [
      "5 token deployments",
      "Full compliance framework",
      "Priority support",
      "Multi-sig wallets",
      "90-day transaction history",
      "API access",
      "Team management (3 seats)",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: "Custom",
    priceNote: "Annual contract",
    cta: "Contact Sales",
    ctaHref: "mailto:sales@Pivat.io?subject=Enterprise%20Plan%20Inquiry",
    features: [
      "Unlimited deployments",
      "Custom compliance frameworks",
      "Dedicated account manager",
      "White-label options",
      "99.9% SLA guarantee",
      "Unlimited API calls",
      "Unlimited team seats",
      "Custom integrations",
    ],
    highlighted: false,
  },
];

const allPlansInclude = [
  "Audited smart contracts",
  "SOC 2 compliant infrastructure",
  "24/7 security monitoring",
  "Encrypted communications",
  "Identity verification",
  "Abuse prevention",
];

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-32 pb-24">
        <div className="container">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade token infrastructure with transparent pricing. Start with a free trial or contact us for custom enterprise solutions.
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`enterprise-card p-6 lg:p-8 flex flex-col ${
                  plan.highlighted ? "ring-2 ring-primary relative" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">{plan.priceNote}</div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full"
                >
                  {plan.ctaHref.startsWith("mailto:") ? (
                    <a href={plan.ctaHref}>
                      {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  ) : (
                    <Link to={plan.ctaHref}>
                      {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {/* All Plans Include */}
          <div className="enterprise-card p-8 lg:p-12">
            <h3 className="text-xl font-semibold mb-6 text-center">All Plans Include</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlansInclude.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-success" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Button asChild variant="ghost">
              <Link to="/">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
