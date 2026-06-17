import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Send, CheckCircle2, Users } from "lucide-react";
import { PageHero, Reveal, Section } from "@/components/ui-bits";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — RELI | We Are Here to Listen" },
      { name: "description", content: "Get in touch with RELI. Call, email or visit us in Roka Maweni, Kilifi North Sub-County, Kilifi County, Kenya. Send us a message and we will respond." },
      { property: "og:title", content: "Contact RELI" },
      { property: "og:description", content: "We Are Here to Listen. Engage Us." },
    ],
  }),
  component: Contacts,
});

const phones = ["+254 724 811 611", "+254 724 489 662", "+254 718 670 559"];

function useVisitorCounter() {
  const [counts, setCounts] = useState({ today: 0, month: 0, total: 0 });

  useEffect(() => {
    try {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      const monthKey = now.toISOString().slice(0, 7);
      const raw = localStorage.getItem("reli_visits");
      const data = raw ? JSON.parse(raw) : { dayKey: "", day: 0, monthKey: "", month: 0, total: 0 };

      data.total = (data.total || 0) + 1;
      data.day = data.dayKey === dayKey ? (data.day || 0) + 1 : 1;
      data.dayKey = dayKey;
      data.month = data.monthKey === monthKey ? (data.month || 0) + 1 : 1;
      data.monthKey = monthKey;

      localStorage.setItem("reli_visits", JSON.stringify(data));
      setCounts({ today: data.day, month: data.month, total: data.total });
    } catch {
      setCounts({ today: 1, month: 1, total: 1 });
    }
  }, []);

  return counts;
}

function Contacts() {
  const [sent, setSent] = useState(false);
  const counts = useVisitorCounter();

  return (
    <>
      <PageHero
        eyebrow="Contacts"
        title="We Are Here to Listen"
        subtitle="Engage us — reach out with questions, partnership ideas, or to enroll a child. We would love to hear from you."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-secondary" />
                  <h3 className="text-lg font-bold text-foreground">Phone</h3>
                </div>
                <ul className="mt-3 space-y-1 text-muted-foreground">
                  {phones.map((p) => (
                    <li key={p}><a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-primary">{p}</a></li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-brand-green" />
                  <h3 className="text-lg font-bold text-foreground">Email</h3>
                </div>
                <a href="mailto:hope4lifeagency@gmail.com" className="mt-3 inline-block text-muted-foreground hover:text-primary">
                  hope4lifeagency@gmail.com
                </a>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-brand-yellow" />
                  <h3 className="text-lg font-bold text-foreground">Location</h3>
                </div>
                <p className="mt-3 text-muted-foreground">
                  Roka Maweni (Timboni Area), Off Mombasa–Malindi Road,<br />
                  After Kadegeni Shopping Centre, Kilifi North Sub-County,<br />
                  Kilifi County, Kenya
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <h3 className="text-xl font-bold text-foreground">Send Us a Message</h3>
              {sent ? (
                <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-gradient-soft p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-brand-green" />
                  <p className="font-semibold text-foreground">Thank you! Your message has been received.</p>
                  <p className="text-sm text-muted-foreground">We will get back to you as soon as possible.</p>
                  <button onClick={() => setSent(false)} className="mt-2 text-sm font-semibold text-primary hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  {[
                    { id: "name", label: "Your Name", type: "text" },
                    { id: "email", label: "Your Email", type: "email" },
                    { id: "subject", label: "Subject", type: "text" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="mb-1 block text-sm font-medium text-foreground">
                        {f.label}*
                      </label>
                      <input
                        id={f.id}
                        type={f.type}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground">
                      Your Message*
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
                  >
                    <Send className="h-4 w-4" /> Submit
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 rounded-3xl bg-gradient-hero p-8 text-primary-foreground">
            <div className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-bold">Visitor Counter</h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Today", value: counts.today },
                { label: "This Month", value: counts.month },
                { label: "Total Visitors", value: counts.total },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl bg-primary-foreground/15 p-6 text-center">
                  <p className="text-3xl font-extrabold">{c.value.toLocaleString()}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
