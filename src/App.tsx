/**
 * SIRC Elections 2026 — Campaign site for
 * CS Nattery Srinivasan Poornima
 *
 * Stack: React + TypeScript + Tailwind CSS (mobile-first) + lucide-react.
 * Single-file, production-ready component.
 *
 * Portrait: place the candidate image next to this file as `poornima.webp`
 * (already imported below). Swap PORTRAIT_SRC if you host it elsewhere.
 *
 * Theme tokens:
 *   maroon  #680c2b / #37091a
 *   gold    #deb977 / #d4af37
 *   cream   #f7f3ec / #faf8f5
 *   text    #252424 / #1e293b
 */

import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  Vote,
  CheckCircle2,
  ShieldCheck,
  HandHeart,
  TrendingUp,
  Users,
  GraduationCap,
  Building2,
  Sprout,
  Quote,
  Scale,
  Flame,
  Lightbulb,
  Zap,
  BadgeCheck,
  ArrowRight,
  ArrowUp,
  Linkedin,
  Mail,
  Share2,
  MapPin,
} from "lucide-react";

// If your bundler supports asset imports (Vite/CRA/webpack), this resolves
// to a URL string. See assets.d.ts for the ambient module declaration.
import portrait from "./poornima.webp";

const PORTRAIT_SRC: string = portrait;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Priorities", href: "#priorities" },
  { label: "Values", href: "#values" },
  { label: "Vote", href: "#vote" },
];

type Pillar = {
  icon: React.ComponentType<any>;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Users,
    title: "Members",
    body: "Bridging skills with industry needs through practical, future-ready programmes.",
  },
  {
    icon: GraduationCap,
    title: "Students",
    body: "Awareness, mentorship and campus placements that open real career doors.",
  },
  {
    icon: TrendingUp,
    title: "Stronger SIRC",
    body: "Empowered members, vibrant students and a future-ready profession.",
  },
  {
    icon: HandHeart,
    title: "Women Empowerment",
    body: "Networking, mentorship and support for women professionals returning to the profession.",
  },
  {
    icon: Building2,
    title: "Infrastructure Development",
    body: "Strengthening learning facilities across chapters — establish CCGRT in Tamil Nadu.",
  },
  {
    icon: Sprout,
    title: "Viksit Bharat 2047",
    body: "Ethical governance, responsible business practices and sustainable growth.",
  },
];

type Value = {
  icon: React.ComponentType<any>;
  title: string;
  body: string;
};

const VALUES: Value[] = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    body: "Decisions taken transparently, in the collective interest of the profession.",
  },
  {
    icon: HandHeart,
    title: "Accessibility",
    body: "A council member who listens, responds and stays reachable to every member.",
  },
  {
    icon: TrendingUp,
    title: "Advancement",
    body: "Raising the standing and opportunities of Company Secretaries across the region.",
  },
];

const CREDENTIALS: { icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { icon: BadgeCheck, label: "Practising Company Secretary" },
  { icon: Scale, label: "Registered Trademark Agent" },
  { icon: ShieldCheck, label: "POSH Trainer" },
];

// The four leadership qualities of Thirukkural 382.
const LEADER_QUALITIES: {
  icon: React.ComponentType<any>;
  label: string;
}[] = [
  { icon: Flame, label: "Courage" },
  { icon: HandHeart, label: "A Liberal Hand" },
  { icon: Lightbulb, label: "Wisdom" },
  { icon: Zap, label: "Energy" },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  invert?: boolean;
}> = ({ eyebrow, title, subtitle, invert = false }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
    {eyebrow && (
      <p
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.22em] ${
          invert ? "text-[#deb977]" : "text-[#680c2b]"
        }`}
      >
        {eyebrow}
      </p>
    )}
    <h2
      className={`text-2xl font-bold leading-tight sm:text-3xl md:text-4xl ${
        invert ? "text-white" : "text-[#37091a]"
      }`}
    >
      {title}
    </h2>
    <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-[#d4af37] to-[#deb977]" />
    {subtitle && (
      <p
        className={`mt-5 text-sm leading-relaxed sm:text-base ${
          invert ? "text-white/80" : "text-slate-600"
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showTop, setShowTop] = useState<boolean>(false);

  // Header shadow after a little scroll; "back to top" button after more.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setShowTop(y > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  // Close the drawer and then scroll to the target. The body scroll is locked
  // while the drawer is open, so a plain hash link can't jump — we unlock
  // first, then smooth-scroll on the next frame.
  const handleDrawerNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace("#", "");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", href);
        }
      });
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#faf8f5] font-sans text-[#252424] antialiased">
      {/* ---------------------------------------------------------- */}
      {/* Top notice bar                                             */}
      {/* ---------------------------------------------------------- */}
      <div className="bg-[#37091a] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-[#f7f3ec] sm:text-xs">
        <span className="font-semibold text-[#deb977]">SIRC ELECTIONS 2026</span>
        <span className="mx-2 text-[#deb977]/50">|</span>
        Your Voice, Your Trust, Our SIRC
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Sticky header                                              */}
      {/* ---------------------------------------------------------- */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#faf8f5]/90 shadow-[0_2px_20px_rgba(55,9,26,0.12)] backdrop-blur-md"
            : "bg-[#faf8f5]/70 backdrop-blur-sm"
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Brand wordmark */}
          <a href="#home" className="flex flex-col leading-tight" onClick={closeMenu}>
            <span className="text-sm font-bold tracking-tight text-[#37091a] sm:text-base">
              CS Nattery Srinivasan{" "}
              <span className="text-[#680c2b]">POORNIMA</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#680c2b]/70">
              SIRC Elections 2026
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#252424] transition-colors hover:bg-[#680c2b]/5 hover:text-[#680c2b]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#vote"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#680c2b] to-[#37091a] px-5 py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-[#deb977]/40 transition-transform hover:scale-[1.03]"
            >
              <Vote className="h-4 w-4" aria-hidden />
              Vote 1st Preference
            </a>
          </div>

          {/* Mobile hamburger — 44x44 tap target */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#680c2b] text-white shadow-sm md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            <Menu className="h-6 w-6" aria-hidden />
          </button>
        </nav>
      </header>

      {/* ---------------------------------------------------------- */}
      {/* Mobile drawer                                              */}
      {/* ---------------------------------------------------------- */}
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-40 bg-[#37091a]/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      {/* Slide-over panel */}
      <aside
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-xs flex-col bg-[#faf8f5] shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#680c2b]/10 px-5 py-4">
          <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#680c2b]">
            Menu
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#680c2b]/5 text-[#680c2b]"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleDrawerNav(e, item.href)}
              className="rounded-xl px-4 py-3 text-base font-medium text-[#252424] transition-colors hover:bg-[#680c2b]/5 hover:text-[#680c2b]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#vote"
            onClick={(e) => handleDrawerNav(e, "#vote")}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#680c2b] to-[#37091a] px-5 py-3.5 text-base font-semibold text-white shadow-md ring-1 ring-[#deb977]/40"
          >
            <Vote className="h-5 w-5" aria-hidden />
            Vote 1st Preference
          </a>
        </nav>
        <div className="mt-auto border-t border-[#680c2b]/10 p-5 text-xs leading-relaxed text-slate-500">
          CS Nattery Srinivasan Poornima
          <br />
          Your Voice, Your Trust, Our SIRC
        </div>
      </aside>

      <main>
        {/* -------------------------------------------------------- */}
        {/* Hero                                                     */}
        {/* -------------------------------------------------------- */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-[#f7f3ec] via-[#faf8f5] to-[#faf8f5]"
        >
          {/* decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#deb977]/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#680c2b]/10 blur-3xl"
          />

          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20">
            {/* Text column (first on mobile, right side on desktop) */}
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#680c2b]">
                <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
                SIRC Elections 2026
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#37091a] sm:text-4xl md:text-5xl">
                CS Nattery
                <br className="hidden sm:block" /> Srinivasan Poornima
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-base font-medium text-[#680c2b] sm:text-lg lg:mx-0">
                Your Voice, Your Trust, Our SIRC
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base lg:mx-0">
                A Practising Company Secretary standing for a stronger, more
                connected and future-ready Southern India Regional Council.
              </p>

              {/* Credentials chips */}
              <ul className="mt-6 flex flex-wrap justify-center gap-1.5 sm:flex-nowrap sm:gap-2 lg:justify-start">
                {CREDENTIALS.map((c) => (
                  <li
                    key={c.label}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#37091a] shadow-sm ring-1 ring-[#680c2b]/10 sm:px-3 sm:py-2 sm:text-xs"
                  >
                    <c.icon className="h-3.5 w-3.5 flex-none text-[#d4af37]" />
                    {c.label}
                  </li>
                ))}
              </ul>

              {/* Dual CTAs — full width on mobile */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href="#vote"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#680c2b] to-[#37091a] px-6 py-3.5 text-sm font-semibold text-white shadow-lg ring-1 ring-[#deb977]/40 transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  <Vote className="h-5 w-5" aria-hidden />
                  Seek your 1st Preference Vote
                </a>
                <a
                  href="#priorities"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#680c2b]/20 bg-white px-6 py-3.5 text-sm font-semibold text-[#680c2b] transition-colors hover:border-[#680c2b]/40 hover:bg-[#680c2b]/5 sm:w-auto"
                >
                  View Priorities
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>

            {/* Portrait column (left side on desktop) */}
            <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
              <div className="relative">
                {/* gold ring frame */}
                <div
                  aria-hidden
                  className="absolute inset-0 -m-3 rounded-[2rem] bg-gradient-to-br from-[#d4af37] via-[#deb977] to-[#680c2b] opacity-80 blur-[2px]"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#f7f3ec] to-white shadow-2xl ring-1 ring-[#deb977]/50">
                  <img
                    src={PORTRAIT_SRC}
                    alt="Portrait of CS Nattery Srinivasan Poornima"
                    className="h-[22rem] w-full max-w-sm object-cover object-top sm:h-[26rem] md:h-[30rem]"
                    loading="eager"
                  />
                  {/* soft vignette */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_-60px_60px_-30px_rgba(55,9,26,0.35)]"
                  />
                  {/* name plate */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#37091a]/90 to-transparent px-5 pb-4 pt-10 text-center">
                    <p className="text-sm font-bold text-white">
                      CS N. S. Poornima
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#deb977]">
                      1st Preference · SIRC 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Thirukkural 382 banner                                   */}
        {/* -------------------------------------------------------- */}
        <section
          aria-label="Campaign inspiration — Thirukkural 382"
          className="relative overflow-hidden bg-gradient-to-br from-[#680c2b] via-[#4e0a21] to-[#37091a] px-4 py-14 sm:px-6 sm:py-20"
        >
          {/* warm glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#deb977]/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl">
            <div className="relative rounded-3xl border border-[#deb977]/40 bg-white/[0.04] px-4 py-8 text-center shadow-[0_0_60px_rgba(222,185,119,0.15)] backdrop-blur-sm sm:p-10 md:p-14">
              {/* corner ornaments */}
              <span
                aria-hidden
                className="absolute left-4 top-4 h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-[#deb977]/60"
              />
              <span
                aria-hidden
                className="absolute bottom-4 right-4 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-[#deb977]/60"
              />

              <Quote
                className="mx-auto mb-5 h-10 w-10 text-[#deb977]"
                aria-hidden
              />
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#deb977]">
                Guiding Philosophy · Thirukkural 382
              </p>

              {/* Tamil couplet — serif, scales down on mobile */}
              <blockquote
                lang="ta"
                className="font-serif leading-[1.75] text-[#f7f3ec]"
              >
                {/* Each line stays on a single line (4 words / 3 words); the
                    clamp keeps line 1 intact from mobile to desktop. */}
                <span className="block whitespace-nowrap text-[clamp(0.62rem,3vw,1.4rem)]">
                  அஞ்சாமை ஈகை அறிவூக்கம் இந்நான்கும்
                </span>
                <span className="block whitespace-nowrap text-[clamp(0.62rem,3vw,1.4rem)]">
                  எஞ்சாமை வேந்தர்க்கு இயல்பு.
                </span>
              </blockquote>

              <p className="mt-4 text-sm font-medium italic text-[#deb977]">
                — திருக்குறள் 382
              </p>

              {/* divider */}
              <span className="mx-auto my-7 block h-px w-24 bg-gradient-to-r from-transparent via-[#deb977]/70 to-transparent" />

              {/* English meaning */}
              <p className="mx-auto max-w-2xl font-serif text-base leading-relaxed text-white/90 sm:text-lg">
                “Courage, a liberal hand, wisdom and energy — these four
                qualities should never be lacking in a true leader.”
              </p>
              <p className="mt-3 text-sm font-medium italic text-white/60">
                — Thirukkural 382
              </p>

              {/* The four leadership qualities */}
              <ul className="mx-auto mt-9 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3">
                {LEADER_QUALITIES.map((q) => (
                  <li key={q.label} className="flex flex-col items-center gap-2">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#deb977]/40 bg-white/[0.06] text-[#deb977]">
                      <q.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f7f3ec]/90">
                      {q.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Leadership bio & vision                                  */}
        {/* -------------------------------------------------------- */}
        <section id="about" className="bg-[#faf8f5] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="About the Candidate"
              title="From Salem, for a greater vision"
              subtitle="Leadership that listens, understands and takes everyone forward together."
            />

            <div className="grid gap-6 md:grid-cols-5 md:gap-10">
              <div className="md:col-span-3">
                <div className="space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                  <p>
                    CS Nattery Srinivasan Poornima is a{" "}
                    <strong className="text-[#680c2b]">
                      Practising Company Secretary
                    </strong>
                    , a <strong className="text-[#680c2b]">Registered
                    Trademark Agent</strong> and a{" "}
                    <strong className="text-[#680c2b]">POSH Trainer</strong>.
                    Hailing from <strong className="text-[#680c2b]">Salem</strong>
                    , she steps forward as the first and youngest woman from a
                    non-metropolitan city to seek this role — bringing fresh
                    energy and a deep commitment to the profession across the
                    Southern region.
                  </p>
                  <p>
                    Her idea of leadership is simple: leadership that{" "}
                    <strong className="text-[#680c2b]">listens</strong>, that{" "}
                    <strong className="text-[#680c2b]">understands</strong>, that{" "}
                    <strong className="text-[#680c2b]">
                      creates opportunities
                    </strong>{" "}
                    and that{" "}
                    <strong className="text-[#680c2b]">
                      takes everyone forward together
                    </strong>
                    . It is a vision for a SIRC that supports professionals and
                    students alike — and stays reachable and responsive to every
                    member.
                  </p>
                  <p>
                    Standing for SIRC Elections 2026, she asks for your trust to
                    build a stronger, more connected and future-ready Institute
                    — one that contributes meaningfully to{" "}
                    <strong className="text-[#680c2b]">
                      Viksit Bharat 2047
                    </strong>
                    . As she takes this next step, she humbly seeks your
                    blessings, wishes and support.
                  </p>
                </div>
              </div>

              {/* Vision card */}
              <div className="md:col-span-2">
                <div className="rounded-2xl border border-[#680c2b]/10 bg-gradient-to-br from-white to-[#f7f3ec] p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#680c2b]">
                    The Leadership I Wish to Create
                  </p>
                  <p className="mt-3 font-serif text-lg leading-relaxed text-[#37091a]">
                    “Leadership that listens, understands, creates opportunities
                    — and takes everyone forward together.”
                  </p>
                  <div className="mt-5 border-t border-[#680c2b]/10 pt-4">
                    <p className="text-sm font-bold text-[#37091a]">
                      CS Nattery Srinivasan Poornima
                    </p>
                    <p className="text-xs text-slate-600">
                      Candidate, SIRC Elections 2026 · Salem
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[#680c2b]">
                      Together, let’s shape a better tomorrow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Strategic action pillars                                 */}
        {/* -------------------------------------------------------- */}
        <section
          id="priorities"
          className="relative bg-[#f7f3ec] px-4 py-14 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Manifesto · Focus Areas"
              title="Six strategic action pillars"
              subtitle="A clear, practical agenda for members, students and the profession."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((pillar, i) => (
                <article
                  key={pillar.title}
                  tabIndex={0}
                  className="group relative overflow-hidden rounded-2xl border border-[#680c2b]/10 bg-white p-6 shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-[#d4af37]/60 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#680c2b]"
                >
                  {/* number watermark */}
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-3 select-none font-serif text-6xl font-bold text-[#680c2b]/5 transition-colors group-hover:text-[#d4af37]/15"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#680c2b] to-[#37091a] text-[#deb977] shadow-md">
                    <pillar.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="relative mb-2 text-lg font-bold text-[#37091a]">
                    {pillar.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed text-slate-600">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Core values                                              */}
        {/* -------------------------------------------------------- */}
        <section id="values" className="bg-[#faf8f5] px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <SectionHeading
              eyebrow="What I stand for"
              title="Integrity · Accessibility · Advancement"
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="flex flex-col items-center rounded-2xl border border-[#680c2b]/10 bg-white px-6 py-8 text-center shadow-sm transition-shadow hover:shadow-lg"
                >
                  <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#680c2b]/5 text-[#680c2b] ring-1 ring-[#d4af37]/40">
                    <value.icon className="h-7 w-7" aria-hidden />
                  </span>
                  <h3 className="mb-2 text-lg font-bold text-[#37091a]">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {value.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* Ballot callout / voter appeal                            */}
        {/* -------------------------------------------------------- */}
        <section
          id="vote"
          className="relative overflow-hidden bg-gradient-to-br from-[#37091a] via-[#680c2b] to-[#37091a] px-4 py-16 sm:px-6 sm:py-24"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-0 h-80 w-80 translate-x-1/3 rounded-full bg-[#deb977]/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            {/* Appeal copy */}
            <div className="text-center lg:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#deb977]">
                Polling Day · SIRC Elections 2026
              </p>
              <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                Make Poornima your{" "}
                <span className="text-[#deb977]">1st Preference</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base lg:mx-0">
                Your first preference carries the most weight. Rank CS N. S.
                Poornima as <strong className="text-white">1</strong> for a
                stronger, more connected and accessible SIRC.
              </p>
              <a
                href="#home"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#deb977] to-[#d4af37] px-7 py-4 text-sm font-bold text-[#37091a] shadow-lg transition-transform hover:scale-[1.02] sm:w-auto"
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden />
                Pledge your 1st Preference Vote
              </a>
            </div>

            {/* Ballot paper visual — centers & shrinks neatly */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-[#deb977]/40 sm:p-6">
                <p className="mb-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#680c2b]">
                  Official Ballot
                </p>
                <p className="mb-4 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Mark your order of preference
                </p>

                {/* 1st preference — highlighted */}
                <div className="relative mb-2.5 flex items-center gap-3 rounded-xl border-2 border-[#d4af37] bg-[#f7f3ec] p-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#680c2b] text-base font-extrabold text-[#deb977]">
                    1
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#37091a]">
                      CS N. S. Poornima
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                      Practising Company Secretary
                    </p>
                  </div>
                  <span className="absolute -right-2 -top-2 inline-flex items-center gap-1 rounded-full bg-[#d4af37] px-2 py-0.5 text-[9px] font-bold uppercase text-[#37091a] shadow">
                    <BadgeCheck className="h-3 w-3" aria-hidden /> 1st Pref
                  </span>
                </div>

                {/* placeholder rows */}
                {[2, 3].map((n) => (
                  <div
                    key={n}
                    className="mb-2.5 flex items-center gap-3 rounded-xl border border-slate-200 p-3 last:mb-0"
                  >
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-slate-100 text-base font-bold text-slate-400">
                      {n}
                    </span>
                    <div className="flex-1 space-y-1.5">
                      <span className="block h-2.5 w-3/4 rounded bg-slate-100" />
                      <span className="block h-2 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                     */}
      {/* ---------------------------------------------------------- */}
      <footer className="bg-[#37091a] px-4 py-12 text-[#f7f3ec] sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="leading-tight">
                <span className="block text-base font-bold">
                  CS Nattery Srinivasan{" "}
                  <span className="text-[#deb977]">POORNIMA</span>
                </span>
                <span className="mt-0.5 block text-[11px] uppercase tracking-[0.18em] text-[#deb977]">
                  SIRC Elections 2026
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
                Your Voice, Your Trust, Our SIRC. A stronger, more connected and
                future-ready profession for the Southern region.
              </p>
            </div>

            {/* Quick nav */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#deb977]">
                Quick Links
              </p>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="inline-block py-1 text-white/75 transition-colors hover:text-[#deb977]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coverage + social */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#deb977]">
                Chapter Coverage
              </p>
              <p className="flex items-start gap-2 text-sm text-white/75">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-[#deb977]" aria-hidden />
                Serving members &amp; students across SIRC chapters in the
                Southern region.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href="https://www.linkedin.com/in/cs-poornima-shankar-ab65a353/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#deb977] hover:text-[#37091a]"
                >
                  <Linkedin className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#deb977] hover:text-[#37091a]"
                >
                  <Mail className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="#"
                  aria-label="Share"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#deb977] hover:text-[#37091a]"
                >
                  <Share2 className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs leading-relaxed text-white/50">
            <p>
              © {new Date().getFullYear()} CS Nattery Srinivasan Poornima ·
              Campaign for SIRC Elections 2026.
            </p>
            <p className="mt-2">
              This is a campaign website published in support of the candidate's
              candidature. Not an official communication of the Institute.
            </p>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------------------------- */}
      {/* Back-to-top button                                         */}
      {/* ---------------------------------------------------------- */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#680c2b] to-[#37091a] text-[#deb977] shadow-lg ring-1 ring-[#deb977]/40 transition-all duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#deb977] ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-6 w-6" aria-hidden />
      </button>
    </div>
  );
};

export default App;
