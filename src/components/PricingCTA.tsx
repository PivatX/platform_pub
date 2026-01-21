import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCTA() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="enterprise-card p-8 lg:p-16 text-center bg-primary text-primary-foreground">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Ready to Build with Enterprise Infrastructure?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join legitimate blockchain projects using Pivat for compliant, secure token infrastructure.
          </p>
          <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90">
            <Link to="/get-started">
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
