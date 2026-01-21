import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { WalletButton } from "@/components/WalletButton";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/security", label: "Security" },
  { href: "/get-started", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      const elementId = href.replace("/#", "");
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <nav className="glass rounded-2xl shadow-md px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center font-semibold text-foreground">
          <Logo showText={true} className="w-10 h-10" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href.startsWith("/#") ? "/" : link.href}
              onClick={() => handleNavClick(link.href)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {/* <WalletButton /> */}
          <Button asChild variant="hero" size="sm">
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass rounded-2xl shadow-md mt-2 p-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href.startsWith("/#") ? "/" : link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2 space-y-2">
              <WalletButton />
              <Button asChild variant="hero" className="w-full">
                <Link to="/get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
