import { Link } from "react-router-dom";
import { Shield, Lock, FileCheck, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const securityFeatures = [
  {
    icon: Shield,
    title: "Audited Smart Contracts",
    description: "All contracts undergo rigorous third-party security audits",
  },
  {
    icon: Lock,
    title: "Multi-Signature Security",
    description: "Enterprise-grade multi-sig wallet protection",
  },
  {
    icon: FileCheck,
    title: "Compliance Frameworks",
    description: "Built-in regulatory compliance and reporting",
  },
  {
    icon: Eye,
    title: "24/7 Monitoring",
    description: "Real-time threat detection and response",
  },
];

export function SecuritySection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="enterprise-card overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Content */}
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Security & Compliance First
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every aspect of Pivat is designed with enterprise security and regulatory compliance as the foundation.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {securityFeatures.map((feature) => (
                  <div key={feature.title} className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="hero">
                <Link to="/security">
                  Learn More About Security <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Visual */}
            <div className="bg-muted/50 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 wireframe-grid opacity-50" />
              <div className="relative z-10 w-full max-w-xs">
                {/* Security Shield Visualization */}
                <div className="aspect-square rounded-3xl bg-background border border-border p-8 flex items-center justify-center shadow-lg">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
                      <Shield className="w-12 h-12 text-success" />
                    </div>
                    {/* Orbiting elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-enterprise/20 flex items-center justify-center animate-pulse-subtle">
                      <Lock className="w-3 h-3 text-enterprise" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center animate-pulse-subtle" style={{ animationDelay: "1s" }}>
                      <FileCheck className="w-3 h-3 text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
