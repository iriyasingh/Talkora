import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Users, Compass, Sun, Moon, ArrowRight } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const talkoraAvatars = [
  { seed: "aria", delay: 0 },
  { seed: "kenji", delay: 0.15 },
  { seed: "priya", delay: 0.3 },
  { seed: "lucas", delay: 0.45 },
];

const features = [
  {
    icon: Compass,
    title: "Discover people",
    text: "Browse profiles and find people worth talking to, wherever they are.",
  },
  {
    icon: Users,
    title: "Build your circle",
    text: "Send requests, accept the ones that matter, keep your friend list yours.",
  },
  {
    icon: MessageCircle,
    title: "Chat in real time",
    text: "Messages land instantly, so a conversation feels like a conversation.",
  },
];

const LandingPage = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "talkora-dark";

  return (
    <div className="min-h-screen bg-base-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-field bg-primary text-primary-content">
            <MessageCircle className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Talkora</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm" aria-label="Toggle theme">
            {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm">
            Sign in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-20 pt-10 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Now in open beta
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              Conversations that pull people closer.
            </h1>
            <p className="mt-4 max-w-md text-base text-base-content/60">
              Talkora is where you find your people, build your circle, and talk — without the noise
              of everything else.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn btn-primary gap-2">
                Create your account
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/login" className="btn btn-ghost">
                I already have one
              </Link>
            </div>
          </motion.div>

          {/* Signature element: avatars around a central chat bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto aspect-square w-full max-w-sm"
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-base-300" />
            <div className="absolute inset-8 rounded-full border border-dashed border-base-300" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg">
                <MessageCircle className="size-8" />
              </div>
            </div>

            {talkoraAvatars.map(({ seed, delay }, i) => {
              const angle = (i / talkoraAvatars.length) * 2 * Math.PI;
              const radius = 46; // percent
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              return (
                <motion.img
                  key={seed}
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                  alt=""
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" }}
                  className="absolute size-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-base-100 ring-2 ring-base-100 shadow-md"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-box border border-base-300 bg-base-100 p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-field bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-base-content/60">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-box bg-primary px-8 py-12 text-center text-primary-content sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">Your circle is waiting.</h2>
          <p className="mx-auto mt-2 max-w-md text-primary-content/80">
            It takes less than a minute to set up your profile and start talking.
          </p>
          <Link to="/signup" className="btn mt-6 bg-primary-content text-primary hover:bg-primary-content/90">
            Get started free
          </Link>
        </div>
      </section>

      <footer className="border-t border-base-300 px-6 py-8 text-center text-xs text-base-content/40">
        © {new Date().getFullYear()} Talkora. Built for real conversations.
      </footer>
    </div>
  );
};

export default LandingPage;
