import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ProductPresentation } from "@/components/ProductPresentation";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DifferentiationSection } from "@/components/DifferentiationSection";
import { SecuritySection } from "@/components/SecuritySection";
import { PricingCTA } from "@/components/PricingCTA";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ProductPresentation />
        <FeaturesSection />
        <DifferentiationSection />
        <SecuritySection />
        <PricingCTA />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
