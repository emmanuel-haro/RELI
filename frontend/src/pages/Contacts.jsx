import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2, Users, Loader2, AlertCircle } from "lucide-react";
import { PageHero, Reveal, Section, AnimatedCounter } from "../components/ui-bits";
import { useVisitorCounter } from "../hooks/useVisitorCounter";
import { api } from "../api/client";

const phones = ["+254 724 811 611", "+254 724 489 662", "+254 718 670 559"];

export default function Contacts() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const counts = useVisitorCounter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");

    const form = e.target;
    const body = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const res = await api.sendMessage(body);
      if (res.warning) {
        setWarning(res.warning);
        setSent(false);
      } else {
        setSent(true);
        form.reset();
      }
    } catch (err) {
      setError(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contacts"
        title="We Are Here to Listen"
        subtitle="Engage us — reach out with questions, partnership ideas, or to enroll a child. We would love to hear from you."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="space-y-5">
              {[
                { icon: Phone, title: "Phone", content: phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block hover:text-primary">{p}</a>
                )) },
                { icon: Mail, title: "Email", content: (
                  <a href="mailto:hope4lifeagency@gmail.com" className="hover:text-primary">hope4lifeagency@gmail.com</a>
                ) },
                { icon: MapPin, title: "Location", content: (
                  <p>Roka Maweni (Timboni Area), Off Mombasa–Malindi Road,<br />After Kadegeni Shopping Centre, Kilifi North Sub-County,<br />Kilifi County, Kenya</p>
                ) },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-6 w-6 text-secondary" />
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  </div>
                  <div className="mt-3 text-muted-foreground">{item.content}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
              <h3 className="text-xl font-bold text-foreground">Send Us a Message</h3>
              {sent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-gradient-soft p-8 text-center"
                >
                  <CheckCircle2 className="h-12 w-12 text-brand-green" />
                  <p className="font-semibold text-foreground">Thank you! Your message has been received.</p>
                  <p className="text-sm text-muted-foreground">We will get back to you as soon as possible.</p>
                  {warning && (
                    <div className="mt-4 w-full rounded-2xl bg-warning/10 px-4 py-3 text-sm text-warning">
                      <strong>Email notice:</strong> {warning}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setSent(false); setWarning(""); setError(""); }}
                    className="mt-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                    </div>
                  )}
                  {warning && (
                    <div className="flex items-center gap-2 rounded-xl bg-warning/10 px-4 py-3 text-sm text-warning">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {warning}
                    </div>
                  )}
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
                        name={f.id}
                        type={f.type}
                        required
                        disabled={loading}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground">
                      Your Message*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      disabled={loading}
                      className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/40 disabled:opacity-60"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? "Sending..." : "Submit"}
                  </motion.button>
                </form>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal>
          <motion.div
            whileInView={{ scale: [0.98, 1] }}
            viewport={{ once: true }}
            className="mt-12 rounded-3xl bg-gradient-hero p-8 text-primary-foreground"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-bold">Visitor Counter</h3>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Today", value: counts.today },
                { label: "This Month", value: counts.month },
                { label: "Total Visitors", value: counts.total },
              ].map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-2xl bg-primary-foreground/15 p-6 text-center"
                >
                  <p className="text-3xl font-extrabold">
                    <AnimatedCounter value={c.value} />
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{c.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Reveal>
      </Section>
    </>
  );
}
