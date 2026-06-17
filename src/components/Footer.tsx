import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import reliLogo from "@/assets/reli-logo.jpg";
import hopeLogo from "@/assets/hope-logo.jpg";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <img src={reliLogo} alt="RELI logo" className="h-12 w-12 rounded-full object-cover shadow-soft" />
            <img src={hopeLogo} alt="Hope for Life Agency logo" className="h-12 w-12 rounded-full object-cover shadow-soft" />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            RELI — Reintegration &amp; Early Learning Institute
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Healing Minds. Building Futures.</p>
          <p className="mt-1 text-xs text-muted-foreground">A program of Hope for Life Agency</p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-primary">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/literature" className="hover:text-primary">Literature</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-primary">Get Involved</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
            <li><Link to="/donation" className="hover:text-primary">Donate</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/contacts" className="hover:text-primary">Contacts</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-primary">Reach Us</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-secondary" /> +254 724 811 611</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-secondary" /> hope4lifeagency@gmail.com</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-secondary" /> Roka Maweni, Kilifi North, Kilifi County, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © 2026 RELI — Hope for Life Agency. All Rights Reserved.
      </div>
    </footer>
  );
}
