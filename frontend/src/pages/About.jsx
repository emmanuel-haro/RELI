import { Eye, Target, Heart, Users, Scale, ShieldCheck, Sprout } from "lucide-react";
import { PageHero, Reveal, Section } from "../components/ui-bits";
import { motion } from "framer-motion";

const values = [
  { icon: Heart, label: "Compassion" },
  { icon: Sprout, label: "Restoration" },
  { icon: Scale, label: "Equity" },
  { icon: Users, label: "Community" },
  { icon: ShieldCheck, label: "Integrity" },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Who We Are"
        subtitle="The Reintegration & Early Learning Institute (RELI) is a program of Hope for Life Agency dedicated to supporting vulnerable children, youth, and families."
      />
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal direction="left">
            <motion.div whileHover={{ scale: 1.02 }} className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                A society where every child and youth has a path to healing, growth, and lifelong dignity.
              </p>
            </motion.div>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <motion.div whileHover={{ scale: 1.02 }} className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To provide holistic early education, life skills training, and reintegration support that
                restores hope, unlocks potential, and builds brighter futures.
              </p>
            </motion.div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-16 text-center text-3xl font-bold text-foreground">Core Values</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {values.map((v, i) => (
            <Reveal key={v.label} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -8, rotate: 2 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary"
                >
                  <v.icon className="h-6 w-6" />
                </motion.div>
                <span className="font-semibold text-foreground">{v.label}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
