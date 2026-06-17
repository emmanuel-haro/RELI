import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { ReliLogo, HopeLogo } from "./Logos";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/literature", label: "Literature" },
  { to: "/careers", label: "Careers" },
  { to: "/faq", label: "FAQ" },
  { to: "/contacts", label: "Contacts" },
];

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-muted font-semibold text-primary" : "text-foreground/80 hover:bg-muted hover:text-primary"
  }`;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <ReliLogo className="h-11 w-11 rounded-full object-cover shadow-soft" />
          <div className="leading-tight">
            <span className="block text-lg font-extrabold text-gradient">RELI</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:block">
              Reintegration &amp; Early Learning Institute
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/donation"
              className="hidden items-center gap-2 rounded-full bg-gradient-warm px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft animate-pulse-glow sm:inline-flex"
            >
              <Heart className="h-4 w-4" /> Donate
            </Link>
          </motion.div>
          <HopeLogo className="hidden h-10 w-10 rounded-full object-cover md:block" />
          <button
            className="rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-background lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/donation"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-warm px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Heart className="h-4 w-4" /> Donate
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
