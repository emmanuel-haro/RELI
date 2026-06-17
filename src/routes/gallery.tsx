import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { PageHero, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — RELI" },
      { name: "description", content: "Explore RELI through photos of our facilities, food and nutrition programs, community activities and the people who make our mission possible." },
      { property: "og:title", content: "RELI Gallery" },
      { property: "og:description", content: "Facilities, food, community activities and people at RELI." },
    ],
  }),
  component: Gallery,
});

const categories = {
  Facilities: ["Classrooms", "Counseling Rooms", "Library", "Dormitories", "Playgrounds", "Training Rooms", "Administrative Offices"],
  Food: ["Meals", "Kitchen Facilities", "Nutrition Programs", "Food Preparation Activities"],
  Miscellaneous: ["Community Outreach", "Environmental Activities", "Tree Planting", "Workshops", "Events", "Training Sessions"],
  People: ["Staff", "Volunteers", "Mentors", "Beneficiaries", "Community Partners"],
} as const;

type Cat = keyof typeof categories;
const tabs = ["All", ...Object.keys(categories)] as const;

const palette = ["bg-gradient-hero", "bg-gradient-warm", "bg-gradient-soft"];

function Gallery() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");

  const entries: { cat: Cat; label: string }[] =
    active === "All"
      ? (Object.keys(categories) as Cat[]).flatMap((cat) =>
          categories[cat].map((label) => ({ cat, label })),
        )
      : categories[active as Cat].map((label) => ({ cat: active as Cat, label }));

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments of Hope"
        subtitle="A glimpse into our facilities, programs, activities and the people building brighter futures together."
      />
      <Section>
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active === t
                  ? "bg-gradient-hero text-primary-foreground shadow-soft"
                  : "bg-muted text-foreground/80 hover:bg-muted/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {entries.map((e, i) => (
              <motion.div
                key={`${e.cat}-${e.label}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className={`relative flex h-44 items-center justify-center ${palette[i % palette.length]}`}>
                  <ImageIcon className="h-10 w-10 text-primary-foreground/70 transition-transform group-hover:scale-110" />
                  <span className="absolute right-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                    {e.cat}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground">{e.label}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Photos and videos are being added — check back soon to see RELI in action.
        </p>
      </Section>
    </>
  );
}
