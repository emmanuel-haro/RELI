import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { PageHero, Section } from "../components/ui-bits";

const categories = {
  Facilities: ["Classrooms", "Counseling Rooms", "Library", "Dormitories", "Playgrounds", "Training Rooms", "Administrative Offices"],
  Food: ["Meals", "Kitchen Facilities", "Nutrition Programs", "Food Preparation Activities"],
  Miscellaneous: ["Community Outreach", "Environmental Activities", "Tree Planting", "Workshops", "Events", "Training Sessions"],
  People: ["Staff", "Volunteers", "Mentors", "Beneficiaries", "Community Partners"],
};

const tabs = ["All", ...Object.keys(categories)];
const palette = ["bg-gradient-hero", "bg-gradient-warm", "bg-gradient-soft"];

export default function Gallery() {
  const [active, setActive] = useState("All");

  const entries =
    active === "All"
      ? Object.keys(categories).flatMap((cat) =>
          categories[cat].map((label) => ({ cat, label })),
        )
      : categories[active].map((label) => ({ cat: active, label }));

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
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActive(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active === t
                  ? "bg-gradient-hero text-primary-foreground shadow-soft"
                  : "bg-muted text-foreground/80 hover:bg-muted/70"
              }`}
            >
              {t}
            </motion.button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {entries.map((e, i) => (
              <motion.div
                key={`${e.cat}-${e.label}`}
                layout
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <div className={`relative flex h-44 items-center justify-center ${palette[i % palette.length]}`}>
                  <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                    <ImageIcon className="h-10 w-10 text-primary-foreground/70" />
                  </motion.div>
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
