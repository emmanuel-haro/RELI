import { createFileRoute } from "@tanstack/react-router";
import { Baby, Route as RouteIcon, Home as HomeIcon, Compass, CheckCircle2 } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Programs — RELI" },
      { name: "description", content: "Explore RELI's four integrated programs: Little Foundations, Pathways Back, Bridge Home Program and Hope Track — education, therapy, family support and aftercare." },
      { property: "og:title", content: "RELI Services & Programs" },
      { property: "og:description", content: "Education, healing, support and opportunities for successful reintegration." },
    ],
  }),
  component: Services,
});

type Group = { heading: string; items: string[] };
type Program = {
  icon: typeof Baby;
  letter: string;
  title: string;
  subtitle: string;
  purpose: string;
  groups: Group[];
  outcomes: string[];
};

const programs: Program[] = [
  {
    icon: Baby,
    letter: "A",
    title: "Little Foundations",
    subtitle: "Early Learning Division",
    purpose:
      "A safe, nurturing, and stimulating environment where young children develop the educational, social, emotional, and physical skills necessary for lifelong learning and success.",
    groups: [
      {
        heading: "Services Offered",
        items: [
          "Early Childhood Education",
          "School Readiness Programs",
          "Child Development Assessments",
          "Parent Engagement Programs",
          "Nutrition and Wellness Support",
        ],
      },
    ],
    outcomes: [
      "Improved cognitive and language development",
      "Increased school readiness and learning confidence",
      "Enhanced social and emotional skills",
      "Strong parent-child engagement",
      "Better health, nutrition, and overall well-being",
    ],
  },
  {
    icon: RouteIcon,
    letter: "B",
    title: "Pathways Back",
    subtitle: "Corrective Education & Life Skills",
    purpose:
      "Supports children and youth facing educational, behavioral, emotional, or social challenges through corrective education, therapeutic interventions, and life skills development — helping them overcome barriers, restore hope, and reintegrate into school, family, and community life.",
    groups: [
      {
        heading: "Educational Services",
        items: ["Alternative Education", "Remedial Learning", "Psycho-Education", "Therapeutic Boarding School Programs"],
      },
      {
        heading: "Therapeutic Services",
        items: [
          "Individual Therapy",
          "Group Counselling",
          "Art Therapy Workshops",
          "Occupational Therapy",
          "Spiritual Recovery",
          "Wilderness Therapy",
          "Outdoor Behavioral Healthcare",
        ],
      },
      {
        heading: "Health & Wellness Services",
        items: ["Nutrition and Body Exercise", "Sports and Recreation", "Music Enrichment Programs"],
      },
      {
        heading: "Recovery Programs",
        items: ["Residential Treatment", "Residential Facilities", "Boot Camp Programs", "The 12 Steps of Alcoholics Anonymous (AA)"],
      },
    ],
    outcomes: [
      "Improved academic performance",
      "Enhanced emotional and behavioral regulation",
      "Increased self-esteem and resilience",
      "Reduced risk behaviors and substance abuse",
      "Improved mental health and well-being",
      "Successful reintegration into school and community life",
      "Development of practical life and social skills",
    ],
  },
  {
    icon: HomeIcon,
    letter: "C",
    title: "Bridge Home Program",
    subtitle: "Reintegration & Family Support",
    purpose:
      "Helps children safely reunite with their families and communities while strengthening relationships and support systems, equipping parents and caregivers to create stable, nurturing, and protective home environments.",
    groups: [
      {
        heading: "Services Offered",
        items: [
          "Family Therapy",
          "Family Support Programs",
          "Positive Parenting Training",
          "Family Mediation",
          "Family Strengthening",
          "Child Reintegration Services",
          "Community Outreach",
        ],
      },
    ],
    outcomes: [
      "Successful child reintegration into family and community settings",
      "Stronger family relationships and communication",
      "Improved parenting and caregiving skills",
      "Reduced family conflict and dysfunction",
      "Increased child safety, stability, and well-being",
      "Enhanced family resilience and self-sufficiency",
      "Greater community awareness and support for vulnerable children",
    ],
  },
  {
    icon: Compass,
    letter: "D",
    title: "Hope Track",
    subtitle: "Mentorship & Aftercare",
    purpose:
      "Provides continued guidance, mentorship, and support after completing RELI programs, ensuring long-term success by keeping participants connected to education, employment, positive relationships, and community support networks.",
    groups: [
      {
        heading: "Services Offered",
        items: [
          "Aftercare Programs",
          "Mentorship",
          "Career Guidance",
          "School Re-enrollment Monitoring",
          "Life Coaching",
          "Alumni Support Network",
        ],
      },
    ],
    outcomes: [
      "Sustained positive behavior change",
      "Increased educational retention and completion",
      "Improved career readiness and employability",
      "Stronger decision-making and life skills",
      "Positive peer and mentor relationships",
      "Reduced risk of relapse into harmful behaviors",
      "Long-term personal growth and community participation",
    ],
  },
];

function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Our Programs"
        subtitle="Four integrated programs ensuring every child and youth has access to education, healing, support, and opportunities for successful reintegration."
      />
      <Section className="space-y-16">
        {programs.map((p, idx) => (
          <Reveal key={p.title} delay={0.05}>
            <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="flex items-center gap-4 bg-gradient-hero p-6 text-primary-foreground md:p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/20">
                  <p.icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/80">
                    {p.letter}. {p.subtitle}
                  </p>
                  <h2 className="text-2xl font-bold md:text-3xl">{p.title}</h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-muted-foreground">{p.purpose}</p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {p.groups.map((g) => (
                    <div key={g.heading} className="rounded-2xl bg-muted/60 p-5">
                      <h3 className="font-bold text-primary">{g.heading}</h3>
                      <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                        {g.items.map((it) => (
                          <li key={it} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-border p-5">
                  <h3 className="font-bold text-primary">Expected Outcomes</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {p.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        <Reveal>
          <div className="rounded-3xl bg-gradient-soft p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Program Impact</h2>
            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              Through these four integrated programs, RELI nurtures resilient individuals, strengthens
              families, and builds safer, healthier communities where every young person can thrive.
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
