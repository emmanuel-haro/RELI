import { createFileRoute } from "@tanstack/react-router";
import { FileText, BookOpen, Quote } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/literature")({
  head: () => ({
    meta: [
      { title: "Literature & Resources — RELI" },
      { name: "description", content: "Access RELI's depository of child protection materials, life skills manuals, parenting guides, research and shared success stories." },
      { property: "og:title", content: "RELI Literature & Shared Stories" },
      { property: "og:description", content: "Resources, publications and testimonials from our community." },
    ],
  }),
  component: Literature,
});

const depository = [
  "Child Protection Materials",
  "Life Skills Manuals",
  "Parenting Guides",
  "Educational Resources",
  "Research Reports",
  "Project Reports",
];

const storytellers = ["Children", "Youth", "Families", "Volunteers", "Community Partners"];

function Literature() {
  return (
    <>
      <PageHero
        eyebrow="Literature"
        title="Knowledge & Shared Stories"
        subtitle="Our depository of resources and publications, alongside the voices of those whose lives have been transformed."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Depository</h2>
              </div>
              <p className="mt-3 text-muted-foreground">Resources and publications including:</p>
              <ul className="mt-5 space-y-3">
                {depository.map((d) => (
                  <li key={d} className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="font-medium text-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
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
                  <span key={s} className="rounded-full bg-gradient-soft px-4 py-2 text-sm font-semibold text-primary">
                    {s}
                  </span>
                ))}
              </div>
              <blockquote className="mt-6 rounded-2xl bg-gradient-soft p-6 text-foreground/90">
                <p className="italic">
                  “RELI gave my child a second chance — a path back to school, family, and hope.”
                </p>
                <footer className="mt-3 text-sm font-semibold text-primary">— A grateful parent</footer>
              </blockquote>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
