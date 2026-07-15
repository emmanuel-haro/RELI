import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-yellow/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-brand-blue/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 animate-spin-slow" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center md:px-8 md:py-28">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-primary-foreground/90"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

export function Reveal({ children, delay = 0, direction = "up" }) {
  const variants = {
    up: { y: 24 },
    left: { x: -24 },
    right: { x: 24 },
    scale: { scale: 0.92 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...variants[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, type: "spring", stiffness: 80 }}
      whileHover={{ y: direction === "up" ? -4 : 0 }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ children, className = "" }) {
  return (
    <section className={`mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:px-8 ${className}`}>{children}</section>
  );
}

export function AnimatedCounter({ value, duration = 1.5 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration }}
      >
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}
