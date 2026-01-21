import { X, Check, TrendingUp, Shield, Users, Building2 } from "lucide-react";

const comparisons = [
  {
    problem: "Token launchers attract scams and pump schemes",
    solution: "Built-in abuse prevention and compliance verification",
    icon: Shield,
  },
  {
    problem: "No regulatory compliance or reporting tools",
    solution: "Automated compliance frameworks and audit trails",
    icon: TrendingUp,
  },
  {
    problem: "Designed for quick, disposable tokens",
    solution: "Enterprise infrastructure for long-term projects",
    icon: Building2,
  },
  {
    problem: "Anonymous creators, no accountability",
    solution: "Identity verification and team management",
    icon: Users,
  },
];

const stats = [
  { value: "100%", label: "Compliance Rate" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "0", label: "Tolerance for Abuse" },
  { value: "24/7", label: "Security Monitoring" },
];

export function DifferentiationSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            What Makes Us Different
          </h2>
          <p className="text-lg text-muted-foreground">
            We're not another token launcher. We're enterprise infrastructure for serious projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {comparisons.map((item, index) => (
            <div key={index} className="enterprise-card p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{item.problem}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{item.solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-background border border-border"
            >
              <div className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
