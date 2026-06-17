import { motion } from "framer-motion";
import mainLogo from "@/assets/main-logo.png";
import extraLogo from "@/assets/extra-logo.png";
import { FloatingParticles } from "./FloatingParticles";

const floatTransition = { duration: 6, repeat: Infinity, ease: "easeInOut" };

export function ReliLogo({ className = "h-12 w-12", floating = false, ...props }) {
  const isHero = className.includes("h-64") || className.includes("h-80");

  return (
    <div className="relative inline-block">
      <motion.img
        src={mainLogo}
        alt="Main logo"
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          ...(floating || isHero ? { y: [0, -12, 0] } : {}),
        }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          ...(floating || isHero ? { y: floatTransition } : {}),
        }}
        whileHover={{ scale: 1.06, rotate: 4 }}
        {...props}
      />
      <svg
        viewBox="0 0 120 120"
        className="pointer-events-none absolute -inset-2 w-32 h-32 opacity-20 animate-spin-slow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-green)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="46" stroke="url(#g1)" strokeWidth="4" fill="none" strokeOpacity="0.5" />
      </svg>
      <div className="absolute inset-0 -z-10">
        <FloatingParticles />
      </div>
    </div>
  );
}

export function HopeLogo({ className = "h-12 w-12", ...props }) {
  return (
    <div className="relative inline-block">
      <motion.img
        src={extraLogo}
        alt="Extra logo"
        className={className}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.08, rotate: -6 }}
        {...props}
      />
      <svg
        viewBox="0 0 120 120"
        className="pointer-events-none absolute -inset-2 w-32 h-32 opacity-20 animate-blob"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="60" cy="60" r="48" fill="url(#g2)" fillOpacity="0.06" />
        <defs>
          <radialGradient id="g2">
            <stop offset="0%" stopColor="var(--brand-yellow)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 -z-10">
        <FloatingParticles />
      </div>
    </div>
  );
}
