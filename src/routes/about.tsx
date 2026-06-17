import { createFileRoute } from "@tanstack/react-router";
import { Eye, Target, Heart, Users, Scale, ShieldCheck, Sprout } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — RELI | Hope for Life Agency" },
      { name: "description", content: "RELI is a program of Hope for Life Agency supporting vulnerable children, youth and families through education, therapy, mentorship and reintegration services." },
      { property: "og:title", content: "About RELI" },
      { property: "og:description", content: "A society where every child and youth has a path to healing, growth and lifelong dignity." },
    ],
  }),
  component: About,
});

const values = [
  { icon: Heart, label: "Compassion" },
  { icon: Sprout, label: "Restoration" },
  { icon: Scale, label: "Equity" },
  { icon: Users, label: "Community" },
  { icon: ShieldCheck, label: "Integrity" },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Who We Are"
        subtitle="The Reintegration & Early Learning Institute (RELI) is a program of Hope for Life Agency dedicated to supporting vulnerable children, youth, and families."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                A society where every child and youth has a path to healing, growth, and lifelong dignity.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To provide holistic early education, life skills training, and reintegration support that
                restores hope, unlocks potential, and builds brighter futures.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-16 text-center text-3xl font-bold text-foreground">Core Values</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {values.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-transform hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <span className="font-semibold text-foreground">{v.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
