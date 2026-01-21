import { Shield, Scale, Settings, Server, Lock, FileText } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Security-First Architecture",
    description: "Multi-signature wallets, audited smart contracts, and enterprise-grade security protocols protect your assets.",
    highlights: ["Multi-sig wallets", "Audited contracts", "24/7 monitoring"],
  },
  {
    icon: Scale,
    title: "Built-in Compliance",
    description: "Automated KYC/AML verification, regulatory reporting, and compliance frameworks for global operations.",
    highlights: ["KYC/AML ready", "Regulatory reports", "Global compliance"],
  },
  {
    icon: Settings,
    title: "Token Management",
    description: "Complete lifecycle management from creation to distribution with granular control over token parameters.",
    highlights: ["Mint & burn", "Supply control", "Distribution tools"],
  },
  {
    icon: Server,
    title: "Infrastructure Tools",
    description: "Enterprise APIs, webhooks, and integration tools for seamless connection with your existing systems.",
    highlights: ["REST APIs", "Webhooks", "SDK support"],
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Role-based permissions, team management, and audit logs for complete organizational oversight.",
    highlights: ["RBAC", "Team roles", "Audit trails"],
  },
  {
    icon: FileText,
    title: "Documentation & Support",
    description: "Comprehensive documentation, dedicated support, and SLA guarantees for enterprise clients.",
    highlights: ["99.9% SLA", "24/7 support", "Full docs"],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 scroll-mt-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Enterprise-Grade Features
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to build, manage, and scale legitimate token projects with confidence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="enterprise-card p-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {feature.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
