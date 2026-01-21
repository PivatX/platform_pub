import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of projects is Pivat designed for?",
    answer: "Pivat is designed for legitimate enterprise blockchain projects, DAOs, and organizations that need compliant token infrastructure. We specifically do not support meme coins, pump and dump schemes, or any fraudulent activities.",
  },
  {
    question: "How does Pivat ensure compliance?",
    answer: "We provide built-in KYC/AML verification, regulatory reporting tools, audit trails, and compliance frameworks. All projects go through verification before deployment, and we continuously monitor for suspicious activities.",
  },
  {
    question: "What security measures are in place?",
    answer: "Our security includes multi-signature wallets, audited smart contracts, 24/7 monitoring, encrypted communications, and SOC 2 compliance. We also provide detailed security documentation and best practices for all clients.",
  },
  {
    question: "Which blockchains does Pivat support?",
    answer: "Currently, we support Solana with full feature availability. Ethereum and BNB Chain support are in development and will be available soon for enterprise clients.",
  },
  {
    question: "What is included in the Enterprise plan?",
    answer: "Enterprise plans include unlimited token deployments, dedicated support, custom compliance frameworks, white-label options, SLA guarantees, and direct access to our security team. Contact sales for custom pricing.",
  },
  {
    question: "How do you prevent abuse of the platform?",
    answer: "We have strict terms of service prohibiting fraudulent activities, mandatory identity verification for all projects, real-time monitoring for suspicious patterns, and a zero-tolerance policy for violations. See our Terms of Service for details.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-muted/30 scroll-mt-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Pivat's enterprise token infrastructure.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="enterprise-card px-6 border-0"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
