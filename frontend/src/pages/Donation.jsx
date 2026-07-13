import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Utensils,
  BookOpen,
  Building2,
  HeartPulse,
  Gift,
  Landmark,
  Smartphone,
  Copy,
  CheckCircle2,
  Loader2,
  AlertCircle,
  CreditCard,
  Store,
} from "lucide-react";
import { PageHero, Reveal, Section } from "../components/ui-bits";
import { api } from "../api/client";

const ways = [
  { icon: GraduationCap, title: "Education Sponsorship", desc: "Fund a child's learning journey from early steps to a strong new start." },
  { icon: Utensils, title: "Feeding Programs", desc: "Provide nutritious meals that fuel growth and learning." },
  { icon: BookOpen, title: "Learning Materials", desc: "Supply books, stationery and educational resources." },
  { icon: Building2, title: "Infrastructure Development", desc: "Help build safe, nurturing spaces to learn and heal." },
  { icon: HeartPulse, title: "Therapy & Counseling", desc: "Support therapeutic and emotional recovery programs." },
  { icon: Gift, title: "General Donations", desc: "Give where it is needed most to sustain our mission." },
];

const categories = [
  { value: "education", label: "Education Sponsorship" },
  { value: "feeding", label: "Feeding Programs" },
  { value: "materials", label: "Learning Materials" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "therapy", label: "Therapy & Counseling" },
  { value: "general", label: "General Donation" },
];

const amounts = [500, 1000, 2000, 5000, 10000];
const methodLabels = {
  mpesa_paybill: "M-Pesa PayBill",
  mpesa_buygoods: "M-Pesa Buy Goods",
  bank_transfer: "Bank Transfer",
};

export default function Donation() {
  const [config, setConfig] = useState(null);
  const [method, setMethod] = useState("mpesa_paybill");
  const [form, setForm] = useState({ donorName: "", phone: "", email: "", amount: 1000, category: "general" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    api.getPaymentConfig()
      .then((res) => setConfig(res.data))
      .catch(() => setConfig({
        paybill: "126914",
        till: "4062256",
        bank: {
          name: "Kenya Commercial Bank",
          accountName: "Hope for life Agency account",
          accountNumber: "1234567890",
          branch: "Kilifi Branch",
          swift: "KCBLKENX",
        },
      }));
  }, []);

  function copyText(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  // STK Push has been removed — M-Pesa methods use the same record flow as bank transfers.

  async function handleBankSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const res = await api.recordBankDonation({
        donorName: form.donorName,
        email: form.email,
        amount: Number(form.amount),
        category: form.category,
        method,
      });
      setSuccess({
        type: method,
        methodLabel: res.data?.paymentMethod || methodLabels[method] || "Donation",
        message: res.message,
        reference: res.data?.reference,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const bank = config?.bank;

  function getCategoryIcon(cat) {
    switch (cat) {
      case "education":
        return GraduationCap;
      case "feeding":
        return Utensils;
      case "materials":
        return BookOpen;
      case "infrastructure":
        return Building2;
      case "therapy":
        return HeartPulse;
      default:
        return Gift;
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Donation"
        title="Support a Child. Transform a Future."
        subtitle="Your generosity creates pathways to healing, education and lifelong dignity for vulnerable children and youth."
      />
      <Section>
        <Reveal>
          <h2 className="text-center text-3xl font-bold text-foreground">Ways to Support</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -8, rotate: 1 }}
                className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-warm text-primary-foreground"
                >
                  <w.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h2 className="mt-16 text-center text-3xl font-bold text-foreground">Make a Donation</h2>
          <p className="mt-2 text-center text-muted-foreground">Choose your preferred payment method</p>
        </Reveal>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { id: "mpesa_paybill", label: "M-Pesa PayBill", icon: CreditCard },
            { id: "mpesa_buygoods", label: "M-Pesa Buy Goods", icon: Store },
            { id: "bank_transfer", label: "Bank Transfer", icon: Landmark },
          ].map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMethod(m.id); setError(""); setSuccess(null); }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                method === m.id
                  ? "bg-gradient-hero text-primary-foreground shadow-glow animate-pulse-glow"
                  : "bg-muted text-foreground/80 hover:bg-muted/70"
              }`}
            >
              <m.icon className="h-4 w-4" /> {m.label}
            </motion.button>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mt-6 max-w-xl rounded-2xl bg-gradient-soft p-6 text-center"
          >
            <CheckCircle2 className="mx-auto h-10 w-10 text-brand-green" />
            {success.methodLabel && (
              <p className="mt-3 text-sm font-medium text-muted-foreground">{success.methodLabel} confirmed</p>
            )}
            <p className="mt-3 font-semibold text-foreground">{success.message}</p>
            {success.reference && (
              <p className="mt-2 text-sm text-muted-foreground">Reference: <strong>{success.reference}</strong></p>
            )}
          </motion.div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {(method === "mpesa_paybill" || method === "mpesa_buygoods") && (
            <>
              <Reveal direction="left">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-brand-green" />
                    <h3 className="text-xl font-bold text-foreground">
                      {method === "mpesa_paybill" ? "M-Pesa PayBill" : "M-Pesa Buy Goods (Till)"}
                    </h3>
                  </div>
                  <div className="mt-4 space-y-3 text-muted-foreground">
                    {method === "mpesa_paybill" ? (
                      <>
                        <p className="text-sm">
                          <strong className="text-foreground">Paybill No:</strong> 126914 - Hope for life Agency account - id no or your Name
                        </p>
                        <p className="text-sm">Please use your M-Pesa menu to send the donation, then record the transfer below.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          <strong className="text-foreground">Buy Goods Till Number:</strong> 4062256
                        </p>
                        <p className="text-sm">Go to M-Pesa → Lipa na M-Pesa → Buy Goods → enter Till number 4062256, then record the transfer below.</p>
                      </>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => copyText(method === "mpesa_paybill" ? "126914" : "4062256", "number")}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium"
                  >
                    {copied === "number" ? <CheckCircle2 className="h-4 w-4 text-brand-green" /> : <Copy className="h-4 w-4" />}
                    Copy {method === "mpesa_paybill" ? "PayBill" : "Till"} Number
                  </motion.button>
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.1}>
                <form onSubmit={handleBankSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <h3 className="text-xl font-bold text-foreground">
                    {method === "mpesa_paybill" ? "Confirm M-Pesa PayBill Payment" : "Confirm M-Pesa Buy Goods Payment"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">After transferring, fill this form to confirm your M-Pesa payment details.</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Your Name</label>
                      <input
                        value={form.donorName}
                        onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Email (optional)</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Donation Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Amount Transferred (KES)*</label>
                      <input
                        type="number"
                        min="1"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (() => {
                        const CatIcon = getCategoryIcon(form.category);
                        return <CatIcon className="h-4 w-4" />;
                      })()}
                        {loading ? "Recording..." : (method === "mpesa_paybill" ? "Confirm PayBill Payment" : "Confirm Buy Goods Payment")}
                    </motion.button>
                  </div>
                </form>
              </Reveal>
            </>
          )}

          {method === "bank_transfer" && bank && (
            <>
              <Reveal direction="left">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-secondary" />
                    <h3 className="text-xl font-bold text-foreground">Bank Details</h3>
                  </div>
                  <dl className="mt-4 space-y-3 text-muted-foreground">
                    {[
                      ["Bank Name", bank.name],
                      ["Account Name", bank.accountName],
                      ["Account Number", bank.accountNumber],
                      ["Branch", bank.branch],
                      ["SWIFT Code", bank.swift],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4">
                        <dt className="font-medium text-foreground">{label}</dt>
                        <dd className="flex items-center gap-2">
                          {value}
                          <button
                            type="button"
                            onClick={() => copyText(value, label)}
                            className="rounded p-1 hover:bg-muted"
                            aria-label={`Copy ${label}`}
                          >
                            {copied === label ? <CheckCircle2 className="h-4 w-4 text-brand-green" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.1}>
                <form onSubmit={handleBankSubmit} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <h3 className="text-xl font-bold text-foreground">Confirm Bank Transfer Payment</h3>
                  <p className="mt-1 text-sm text-muted-foreground">After bank transfer, fill this form to confirm your bank payment details.</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Your Name</label>
                      <input
                        value={form.donorName}
                        onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Email (optional)</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Donation Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      >
                        {categories.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Amount Transferred (KES)*</label>
                      <input
                        type="number"
                        min="1"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 outline-none focus:border-primary"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Landmark className="h-4 w-4" />}
                      {loading ? "Recording..." : "Confirm Bank Payment"}
                    </motion.button>
                  </div>
                </form>
              </Reveal>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
