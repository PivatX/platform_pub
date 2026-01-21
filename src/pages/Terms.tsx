import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="container max-w-3xl">
          {/* Back button */}
          <div className="mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="mb-12">
            <Badge variant="outline" className="mb-4">Legal</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          {/* Important Notice */}
          <div className="enterprise-card p-6 mb-12 border-l-4 border-l-destructive">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Legitimate Use Only</h3>
                <p className="text-sm text-muted-foreground">
                  Pivat is designed exclusively for legitimate blockchain projects. Any attempt to use our platform for fraudulent activities will result in immediate termination and may be reported to law enforcement.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Pivat's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services. These terms apply to all users, including enterprise clients and individual users.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pivat provides enterprise token infrastructure services including, but not limited to: token creation, token management, compliance tools, security features, and related services. Our services are designed for legitimate blockchain projects and enterprises.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-destructive">3. Prohibited Activities</h2>
              <div className="enterprise-card p-6 bg-destructive/5">
                <p className="text-sm mb-4">
                  The following activities are strictly prohibited and will result in immediate account termination:
                </p>
                <ul className="space-y-3">
                  {[
                    "Pump and dump schemes - Creating tokens with the intent to artificially inflate prices and sell",
                    "Price manipulation - Any attempt to artificially manipulate token prices",
                    "Volume manipulation - Fake trading activity to mislead investors",
                    "Rug pulls - Abandoning a project after collecting funds",
                    "Insider trading - Trading on non-public information",
                    "Fraud - Any deceptive practices designed to mislead users or investors",
                    "Money laundering - Using our services to launder proceeds of crime",
                    "Securities violations - Creating unregistered securities",
                    "Scams - Any scheme designed to defraud users",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0 mt-2"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">4. User Verification</h2>
              <p className="text-muted-foreground leading-relaxed">
                All users must complete identity verification before deploying tokens. This includes providing accurate personal or business information, completing KYC/AML verification, and maintaining accurate records. Providing false information is grounds for immediate termination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">5. Compliance Requirements</h2>
              <p className="text-muted-foreground leading-relaxed">
                Users are responsible for ensuring their token projects comply with all applicable laws and regulations in their jurisdiction. Pivat provides compliance tools to assist with this, but ultimate responsibility lies with the user. We reserve the right to refuse service to projects that do not meet our compliance standards.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">6. Enforcement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pivat actively monitors platform activity and reserves the right to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"></span>
                  <span>Suspend or terminate accounts without notice for violations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"></span>
                  <span>Report suspicious activities to law enforcement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"></span>
                  <span>Cooperate with regulatory investigations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"></span>
                  <span>Freeze assets pending investigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2"></span>
                  <span>Pursue legal action for damages</span>
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Pivat provides its services "as is" without warranties of any kind. We are not liable for any losses arising from the use of our platform, market fluctuations, or third-party actions. Users assume all risks associated with blockchain transactions.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms. We will notify users of material changes via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at{" "}
                <a href="mailto:legal@pivat.xyz" className="text-foreground underline">
                  legal@pivat.xyz
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
