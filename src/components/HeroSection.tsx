import { Link } from "react-router-dom";
import { ArrowRight, Shield, CheckCircle2, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-dark" />
      <div className="absolute inset-0 wireframe-grid" />
      
      {/* Glow Effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full glow-primary opacity-50" />

      {/* Network Visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" aria-hidden="true">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--enterprise))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--enterprise))" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Animated nodes */}
        <circle cx="20%" cy="30%" r="4" fill="url(#nodeGlow)" className="animate-pulse-subtle" />
        <circle cx="80%" cy="25%" r="3" fill="url(#nodeGlow)" className="animate-pulse-subtle" style={{ animationDelay: "1s" }} />
        <circle cx="15%" cy="70%" r="5" fill="url(#nodeGlow)" className="animate-pulse-subtle" style={{ animationDelay: "2s" }} />
        <circle cx="85%" cy="65%" r="4" fill="url(#nodeGlow)" className="animate-pulse-subtle" style={{ animationDelay: "0.5s" }} />
        <circle cx="50%" cy="85%" r="3" fill="url(#nodeGlow)" className="animate-pulse-subtle" style={{ animationDelay: "1.5s" }} />
      </svg>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <Badge variant="outline" className="mb-6 text-xs font-semibold tracking-widest uppercase border-enterprise/30 text-enterprise">
              Enterprise Token Infrastructure
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              Your Portal to
              <span className="block text-gradient-enterprise">Token Infrastructure</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Enterprise-grade token creation, management, and compliance tools for legitimate blockchain projects. Security-first architecture with built-in regulatory compliance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button asChild variant="hero" size="xl">
                <Link to="/get-started">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="hero-outline" size="xl">
                <a href="#features">
                  Explore Features
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>100% Compliance Rate</span>
              </div>
            </div>
          </div>

          {/* Right Column - Featured Card */}
          <div className="relative">
            <div className="enterprise-card p-6 lg:p-8 animate-float">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Enterprise Project</h3>
                    <p className="text-xs text-muted-foreground">Token Infrastructure</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-success/10 text-success border-0">
                  Active
                </Badge>
              </div>

              {/* Network Badges */}
              <div className="flex gap-2 mb-6">
                <Badge className="bg-[#9945FF]/10 text-[#9945FF] border-[#9945FF]/30">
                  Solana
                </Badge>
                <Badge variant="outline" className="opacity-50">
                  Ethereum
                  <span className="ml-1 text-[10px]">Soon</span>
                </Badge>
                <Badge variant="outline" className="opacity-50">
                  BNB
                  <span className="ml-1 text-[10px]">Soon</span>
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="w-3 h-3" />
                    Uptime SLA
                  </div>
                  <div className="text-2xl font-bold">99.9%</div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-1">Compliance Rate</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-muted-foreground">98%</span>
                    <ArrowRight className="w-4 h-4 text-success" />
                    <span className="text-2xl font-bold text-success">100%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-full bg-success rounded-full" />
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {["Built-in Compliance", "Security-First", "Enterprise Support"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-enterprise/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
