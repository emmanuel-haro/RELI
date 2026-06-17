import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Utensils, BookOpen, Building2, HeartPulse, Gift, Landmark, Smartphone } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/donation")({
  head: () => ({
    meta: [
      { title: "Donate — Support a Child, Transform a Future | RELI" },
      { name: "description", content: "Support RELI through education sponsorship, feeding programs, learning materials, infrastructure, therapy programs or general donations. Every gift transforms a future." },
      { property: "og:title", content: "Donate to RELI" },
      { property: "og:description", content: "Support a Child. Transform a Future." },
    ],
  }),
  component: Donation,
});

const ways = [
  { icon: GraduationCap, title: "Education Sponsorship", desc: "Fund a child's learning journey from early steps to a strong new start." },
  { icon: Utensils, title: "Feeding Programs", desc: "Provide nutritious meals that fuel growth and learning." },
  { icon: BookOpen, title: "Learning Materials", desc: "Supply books, stationery and educational resources." },
  { icon: Building2, title: "Infrastructure Development", desc: "Help build safe, nurturing spaces to learn and heal." },
  { icon: HeartPulse, title: "Therapy & Counseling", desc: "Support therapeutic and emotional recovery programs." },
  { icon: Gift, title: "General Donations", desc: "Give where it is needed most to sustain our mission." },
];

function Donation() {
  return (
    <>
      <PageHero
        eyebrow="Donation"
        title="Support a Child. Transform a Future."
        subtitle="Your generosity creates pathways to healing, education and lifelong dignity for vulnerable children and youth."
      />
      <Section>
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-foreground">Ways to Support</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <Landmark className="h-6 w-6 text-secondary" />
                <h3 className="text-xl font-bold text-foreground">Bank Details</h3>
              </div>
              <p className="text-muted-foreground">
                Bank transfer details will be provided here soon. Please contact us to make a bank donation in the meantime.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-brand-green" />
                <h3 className="text-xl font-bold text-foreground">M-Pesa Paybill / Till</h3>
              </div>
              <p className="text-muted-foreground">
                M-Pesa Paybill / Till number will be provided here soon. Reach out and we will share the latest details.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
