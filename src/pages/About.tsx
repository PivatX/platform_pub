import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function About() {
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
            <Badge variant="outline" className="mb-4">About Pivat</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Enterprise Token Infrastructure
            </h1>
            <p className="text-xl text-muted-foreground">
              Built for legitimate blockchain projects that prioritize security and compliance
            </p>
          </div>

          {/* Mission */}
          <div className="enterprise-card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Pivat provides enterprise-grade token infrastructure designed specifically for legitimate blockchain projects. We believe that the future of blockchain depends on projects that prioritize security, compliance, and transparency.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform combines cutting-edge security measures with comprehensive compliance tools, making it easier for serious projects to build on Solana while maintaining the highest standards of integrity.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Security First</h3>
              <p className="text-sm text-muted-foreground">
                SOC 2 compliant infrastructure with 24/7 security monitoring and audited smart contracts.
              </p>
            </div>

            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Built for Scale</h3>
              <p className="text-sm text-muted-foreground">
                High-performance infrastructure designed to handle enterprise workloads and rapid growth.
              </p>
            </div>

            <div className="enterprise-card p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Compliance Ready</h3>
              <p className="text-sm text-muted-foreground">
                Full compliance framework with identity verification and comprehensive audit trails.
              </p>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="enterprise-card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Why Choose Pivat?</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Legitimate Projects Only</h3>
                <p className="text-muted-foreground">
                  We exclusively serve legitimate blockchain projects. Our verification process ensures that only serious, compliant projects use our infrastructure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Enterprise-Grade Security</h3>
                <p className="text-muted-foreground">
                  From audited smart contracts to SOC 2 compliance, every aspect of our platform is built with security as the foundation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of blockchain experts provides priority support to ensure your project succeeds.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Join legitimate blockchain projects building on enterprise infrastructure.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/get-started">
                View Pricing Plans
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
