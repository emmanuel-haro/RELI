import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — RELI" },
      { name: "description", content: "Frequently asked questions about RELI: who we are, how to enroll a child, whether services are free, how reintegration works, and how to volunteer or support." },
      { property: "og:title", content: "RELI Frequently Asked Questions" },
      { property: "og:description", content: "Answers to common questions about our programs and how to get involved." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  {
    q: "What is RELI?",
    a: "RELI (Reintegration & Early Learning Institute) is a program of Hope for Life Agency that supports vulnerable children, youth and families through early learning, corrective education, life skills, therapy, mentorship and reintegration services.",
  },
  {
    q: "Who can join the programs?",
    a: "Our programs serve young children needing early learning, as well as children and youth facing educational, behavioral, emotional or social challenges, and their families.",
  },
  {
    q: "How do I enroll a child?",
    a: "Reach out via our Contacts page by phone or email. Our team will guide you through assessment, placement and the enrollment process for the most suitable program.",
  },
  {
    q: "Are the services free?",
    a: "We work to keep services accessible. Support is made possible through donations and sponsorships. Contact us to discuss your situation and available support options.",
  },
  {
    q: "How does reintegration work?",
    a: "Through the Bridge Home Program and Hope Track, we help children safely reunite with their families and communities, strengthen relationships, and provide ongoing mentorship and aftercare for long-term success.",
  },
  {
    q: "How can I volunteer?",
    a: "Visit our Careers page to see opportunities for teachers, counselors, social workers, mentors and community mobilizers, then contact us to express your interest.",
  },
  {
    q: "How can I support RELI?",
    a: "You can support a child through education sponsorship, feeding programs, learning materials, infrastructure, therapy programs or general donations. See our Donation page for details.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about RELI's programs and how to get involved."
      />
      <Section className="max-w-3xl">
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-gradient-soft px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-foreground">Still have questions?</h2>
            <Link to="/contacts" className="inline-flex items-center gap-2 rounded-full bg-gradient-hero px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105">
              Get in Touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
