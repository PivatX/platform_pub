import { Link } from "react-router-dom";
import { 
  Shield, 
  Lock, 
  FileCheck, 
  Eye, 
  Server, 
  Key,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const securityFeatures = [
  {
    icon: Shield,
    title: "Audited Smart Contracts",
    description: "All smart contracts undergo rigorous third-party security audits by leading blockchain security firms. Audit reports are available upon request.",
  },
  {
    icon: Lock,
    title: "Multi-Signature Wallets",
    description: "Enterprise-grade multi-signature wallet protection ensures no single point of failure. Configure custom signing requirements for your organization.",
  },
  {
    icon: FileCheck,
    title: "Compliance Frameworks",
    description: "Built-in regulatory compliance frameworks including KYC/AML verification, transaction monitoring, and automated reporting tools.",
  },
  {
    icon: Eye,
    title: "24/7 Security Monitoring",
    description: "Real-time threat detection and automated response systems monitor all platform activity. Our security team is available around the clock.",
  },
  {
    icon: Server,
    title: "SOC 2 Compliant Infrastructure",
    description: "Our infrastructure meets SOC 2 Type II compliance standards. All data is encrypted at rest and in transit.",
  },
  {
    icon: Key,
    title: "Secure Key Management",
    description: "Hardware security modules (HSMs) protect all cryptographic operations. Keys are never exposed in plain text.",
  },
];

const certifications = [
  "SOC 2 Type II",
  "ISO 27001",
  "GDPR Compliant",
  "CCPA Compliant",
];

const bestPractices = [
  "Regular third-party penetration testing",
  "Bug bounty program for responsible disclosure",
  "Encrypted communications (TLS 1.3)",
  "Role-based access control (RBAC)",
  "Comprehensive audit logging",
  "Automated vulnerability scanning",
  "Incident response procedures",
  "Business continuity planning",
];

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-24">
        <div className="container max-w-4xl">
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
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Security</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Security & Compliance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade security is the foundation of Pivat. Every feature is designed with security and regulatory compliance as the top priority.
            </p>
          </div>

          {/* Security Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Security Features</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {securityFeatures.map((feature) => (
                <div key={feature.title} className="enterprise-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Certifications & Compliance</h2>
            <div className="enterprise-card p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="font-medium text-sm">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Security Best Practices</h2>
            <div className="enterprise-card p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {bestPractices.map((practice) => (
                  <div key={practice} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Abuse Prevention */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Abuse Prevention</h2>
            <div className="enterprise-card p-8 border-l-4 border-l-destructive">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Zero Tolerance Policy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pivat has a zero-tolerance policy for fraudulent activities. We actively monitor and prevent:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                      Pump and dump schemes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                      Price and volume manipulation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                      Rug pulls and exit scams
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                      Insider trading
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                      Any fraudulent or deceptive activities
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Violations result in immediate account termination and may be reported to relevant authorities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="enterprise-card p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Security Questions?</h2>
              <p className="text-muted-foreground mb-6">
                Our security team is available to answer your questions and provide additional documentation.
              </p>
              <Button asChild variant="hero">
                <a href="mailto:security@Pivat.io">
                  Contact Security Team
                </a>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
