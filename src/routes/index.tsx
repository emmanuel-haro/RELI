import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Baby,
  Route as RouteIcon,
  Home as HomeIcon,
  Compass,
  Heart,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Reveal, Section } from "@/components/ui-bits";
import reliLogo from "@/assets/reli-logo.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RELI — Empowering New Beginnings Through Education & Compassion" },
      { name: "description", content: "Welcome to RELI. Every child and youth deserves the opportunity to learn, heal, grow and succeed. Discover our early learning and reintegration programs." },
      { property: "og:title", content: "RELI — Empowering New Beginnings" },
      { property: "og:description", content: "Education with Compassion, Reintegration with Dignity." },
    ],
  }),
  component: Home,
});

const programs = [
  { icon: Baby, title: "Little Foundations", desc: "Early Learning — a safe, nurturing start that builds the skills for lifelong success." },
  { icon: RouteIcon, title: "Pathways Back", desc: "Corrective Education & Life Skills that restore hope and reintegrate youth into life." },
  { icon: HomeIcon, title: "Bridge Home Program", desc: "Reintegration & Family Support to safely reunite children with their families." },
  { icon: Compass, title: "Hope Track", desc: "Mentorship & Aftercare ensuring long-term success and positive growth." },
];

const taglines = [
  "Healing Minds. Building Futures.",
  "Education with Compassion, Reintegration with Dignity.",
  "From Early Steps to Strong New Starts.",
  "Every Second Chance Begins with Learning.",
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-yellow/30 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-brand-blue/40 blur-3xl animate-blob" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" /> Reintegration &amp; Early Learning Institute
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl"
            >
              Empowering New Beginnings Through Education &amp; Compassion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-xl text-lg text-primary-foreground/90"
            >
              At RELI, we believe every child and youth deserves the opportunity to learn, heal, grow,
              and succeed — through early learning, corrective education, life skills, family
              strengthening and reintegration support.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-transform hover:scale-105">
                Explore Programs <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/donation" className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                <Heart className="h-4 w-4" /> Support a Child
              </Link>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <img src={reliLogo} alt="RELI logo" className="h-64 w-64 rounded-full bg-background object-cover p-3 shadow-glow animate-float md:h-80 md:w-80" />
          </motion.div>
        </div>
      </section>

      <Section>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Our Core Programs</h2>
            <p className="mt-3 text-muted-foreground">
              Four integrated programs creating pathways to brighter futures.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="!py-0">
        <Reveal>
          <div className="overflow-hidden rounded-3xl bg-gradient-soft p-10 md:p-14">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {taglines.map((t) => (
                <div key={t} className="rounded-2xl bg-card p-6 text-center shadow-soft">
                  <p className="font-semibold text-primary">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-hero px-6 py-14 text-center text-primary-foreground">
            <h2 className="max-w-2xl text-3xl font-bold md:text-4xl">
              Together we nurture resilient individuals and stronger families.
            </h2>
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-transform hover:scale-105">
              Learn About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
