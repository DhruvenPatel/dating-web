import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  Flame,
  Heart,
  Image as ImageIcon,
  Lock,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { lenisRef } from "@/lib/lenis";

const primaryLink =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-white shadow-glow transition hover:brightness-110";
const outlineLink =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border bg-card/60 px-7 text-sm font-semibold backdrop-blur transition hover:bg-muted";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 });
  else el.scrollIntoView({ behavior: "smooth" });
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Decorative preview of the swipe deck. These are illustrations, not real people. */
const DEMO = [
  { name: "Aria", age: 26, bg: "from-fuchsia-500 to-violet-700", rotate: -9, x: -80, z: 1 },
  { name: "Noah", age: 29, bg: "from-violet-500 to-indigo-700", rotate: 8, x: 80, z: 2 },
  { name: "Maya", age: 25, bg: "from-pink-500 to-fuchsia-700", rotate: 0, x: 0, z: 3 },
];

function HeroCards() {
  return (
    <div aria-hidden className="relative mx-auto h-[30rem] w-full max-w-md">
      {DEMO.map((d, i) => (
        <motion.div
          key={d.name}
          className={`absolute top-2 h-[24rem] w-60 overflow-hidden rounded-3xl bg-gradient-to-br ${d.bg} shadow-2xl`}
          style={{ left: "50%", marginLeft: -120, x: d.x, rotate: d.rotate, zIndex: d.z }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: i * 0.15 },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <User className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white/25" size={260} />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
            <p className="font-display text-xl font-bold">
              {d.name}, {d.age}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-white/60">Preview</p>
          </div>
          {d.z === 3 && (
            <span className="absolute left-4 top-5 -rotate-12 rounded-lg border-2 border-emerald-300 px-2.5 py-0.5 text-lg font-extrabold tracking-wider text-emerald-300">
              LIKE
            </span>
          )}
        </motion.div>
      ))}

      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center gap-6">
        <span className="grid h-14 w-14 place-items-center rounded-full border bg-card text-nope shadow-lg">
          <X size={26} strokeWidth={3} />
        </span>
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-glow">
          <Heart size={26} fill="currentColor" />
        </span>
      </div>
    </div>
  );
}

const STEPS = [
  {
    icon: UserPlus,
    title: "Create your profile",
    text: "Add a photo, your interests and a little about you. It takes a minute.",
  },
  {
    icon: Flame,
    title: "Swipe and like",
    text: "Swipe right on people you'd like to meet. Swipe left to pass.",
  },
  {
    icon: MessageCircle,
    title: "Match and chat",
    text: "When you both like each other, it's a match. Say hello with text, photos or video.",
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified accounts",
    text: "Every account confirms its email with a one-time code before it can join.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filters that respect your time",
    text: "Narrow by age, gender, location, language and interests.",
  },
  {
    icon: Lock,
    title: "You control your privacy",
    text: "Choose who sees your profile and online status, and who can like or message you.",
  },
  {
    icon: ImageIcon,
    title: "Photos and videos in chat",
    text: "Share moments, not just messages.",
  },
  {
    icon: Ban,
    title: "Block anytime",
    text: "One tap removes someone from your world, in both directions.",
  },
  {
    icon: Sparkles,
    title: "Beautiful on every screen",
    text: "A smooth experience on phone, tablet and desktop, in dark or light.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <button onClick={() => scrollToSection("how")} className="transition hover:text-foreground">
              How it works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="transition hover:text-foreground"
            >
              Features
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/login"
              className="hidden h-9 items-center rounded-lg px-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Join free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-14 lg:grid-cols-2 lg:pt-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <ShieldCheck size={14} className="text-primary" />
            Verified accounts · Private by design
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Find someone <span className="text-brand">worth meeting.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            Swipe through people who share your interests, match when the feeling is mutual, and
            start a real conversation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link to="/register" className={primaryLink}>
              Create free account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className={outlineLink}>
              I already have an account
            </Link>
          </motion.div>

          <p className="mt-5 text-sm text-muted-foreground">
            Free to join · Email verification · Block anytime
          </p>
        </div>

        <HeroCards />
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted-foreground">Three simple steps from hello to a real chat.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1}>
              <div className="h-full rounded-lg border bg-card p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-glow">
                    <Icon size={22} />
                  </span>
                  <span className="font-display text-4xl font-bold text-muted-foreground/30">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Built for real connections
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to meet people comfortably and safely.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <div className="h-full rounded-lg border bg-card p-6 transition hover:border-primary/50">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-16 text-center text-white sm:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_-10%,rgba(255,255,255,0.28),transparent)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to meet someone?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-white/85">
                Create your free account and start swiping today.
              </p>
              <Link
                to="/register"
                className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-fuchsia-700 shadow-xl transition hover:scale-[1.03]"
              >
                Join VIPXFRIEND <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo size="sm" />
          <p>© {new Date().getFullYear()} VIPXFRIEND. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-foreground">
              Log in
            </Link>
            <Link to="/register" className="hover:text-foreground">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}