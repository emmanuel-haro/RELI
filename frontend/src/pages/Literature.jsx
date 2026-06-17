import { FileText, BookOpen, Quote } from "lucide-react";
import { PageHero, Reveal, Section } from "../components/ui-bits";
import { motion } from "framer-motion";

const depository = [
  "Child Protection Materials",
  "Life Skills Manuals",
  "Parenting Guides",
  "Educational Resources",
  "Research Reports",
  "Project Reports",
];

const storytellers = ["Children", "Youth", "Families", "Volunteers", "Community Partners"];

export default function Literature() {
  return (
    <>
      <PageHero
        eyebrow="Literature"
        title="Knowledge & Shared Stories"
        subtitle="Our depository of resources and publications, alongside the voices of those whose lives have been transformed."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Depository</h2>
              </div>
              <p className="mt-3 text-muted-foreground">Resources and publications including:</p>
              <ul className="mt-5 space-y-3">
                {depository.map((d, i) => (
                  <motion.li
                    key={d}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3"
                  >
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-foreground">{d}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground">
                  <Quote className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Shared Stories</h2>
              </div>
              <p className="mt-3 text-muted-foreground">
                Success stories and testimonials from across our community:
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {storytellers.map((s) => (
                  <motion.span
                    key={s}
                    whileHover={{ scale: 1.08 }}
                    className="rounded-full bg-gradient-soft px-4 py-2 text-sm font-semibold text-primary"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
              <motion.blockquote
                animate={{ boxShadow: ["0 0 0px oklch(0.55 0.13 152 / 0)", "0 0 20px oklch(0.55 0.13 152 / 0.2)", "0 0 0px oklch(0.55 0.13 152 / 0)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-6 rounded-2xl bg-gradient-soft p-6 text-foreground/90"
              >
                <p className="italic">
                  &ldquo;RELI gave my child a second chance — a path back to school, family, and hope.&rdquo;
                </p>
                <footer className="mt-3 text-sm font-semibold text-primary">— A grateful parent</footer>
              </motion.blockquote>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
