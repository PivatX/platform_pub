import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Github } from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
  comingSoon?: boolean;
};

const footerLinks: {
  product: FooterLink[];
  company: FooterLink[];
  legal: FooterLink[];
} = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Security", href: "/security" },
    { label: "Pricing", href: "/get-started" },
    { label: "FAQ", href: "/#faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "#", comingSoon: true },
    { label: "Contact", href: "mailto:info@pivat.xyz" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center font-semibold text-foreground mb-4">
              <Logo showText={true} className="w-10 h-10" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enterprise token infrastructure for legitimate blockchain projects. Security-first, compliance-ready.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("mailto:") ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                    >
                      {link.label}
                      {link.comingSoon && (
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full">Coming Soon</span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pivat. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PivatX/platform_pub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <p className="text-sm text-muted-foreground">
              Built for legitimate projects only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
