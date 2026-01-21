import { Ban, CheckCircle2, FileCheck } from "lucide-react";

const products = [
  {
    icon: Ban,
    title: "Prevent Abuse",
    description: "Built-in safeguards prevent pump and dump schemes, ensuring your project maintains legitimacy and trust.",
  },
  {
    icon: CheckCircle2,
    title: "Compliance Verification",
    description: "Automated compliance checks ensure your token meets regulatory requirements before deployment.",
  },
  {
    icon: FileCheck,
    title: "Stay Compliant",
    description: "Continuous monitoring and reporting tools keep your project compliant as regulations evolve.",
  },
];

export function ProductPresentation() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Infrastructure You Can Trust
          </h2>
          <p className="text-lg text-muted-foreground">
            Every feature is designed with enterprise security and compliance at its core.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.title}
              className="enterprise-card p-8 text-center group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                <product.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
