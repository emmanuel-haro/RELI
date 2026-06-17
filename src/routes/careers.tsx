import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, HeartHandshake, Users, Briefcase, Megaphone, Sprout, ArrowRight } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Volunteering — RELI" },
      { name: "description", content: "Join RELI in transforming lives. Explore opportunities for teachers, counselors, social workers, volunteers, interns and community mobilizers." },
      { property: "og:title", content: "Careers at RELI" },
      { property: "og:description", content: "Join us in transforming lives." },
    ],
  }),
  component: Careers,
});

const roles = [
  { icon: GraduationCap, title: "Teachers", desc: "Shape young minds through early learning and corrective education." },
  { icon: HeartHandshake, title: "Counselors", desc: "Provide therapeutic support and emotional healing." },
  { icon: Users, title: "Social Workers", desc: "Strengthen families and guide reintegration journeys." },
  { icon: Sprout, title: "Volunteers", desc: "Contribute your time and talent to our mission." },
  { icon: Briefcase, title: "Internships", desc: "Gain hands-on experience while making an impact." },
  { icon: Megaphone, title: "Community Mobilizers", desc: "Build awareness and connect communities to support." },
];

function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join Us in Transforming Lives"
        subtitle="We are always looking for compassionate, dedicated people to help children and youth heal, learn and thrive."
      />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-5 rounded-3xl bg-gradient-hero px-6 py-12 text-center text-primary-foreground">
            <h2 className="max-w-xl text-2xl font-bold md:text-3xl">Ready to make a difference?</h2>
            <p className="max-w-xl text-primary-foreground/90">
              Reach out to express your interest and our team will get in touch with current opportunities.
            </p>
            <Link to="/contacts" className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary shadow-glow transition-transform hover:scale-105">
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
