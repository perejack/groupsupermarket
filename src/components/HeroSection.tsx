import { motion } from "framer-motion";
import { ArrowDown, Briefcase, Users, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const stats = [
  { icon: Briefcase, value: "500+", label: "Open Positions" },
  { icon: Users, value: "4", label: "Top Retailers" },
  { icon: MapPin, value: "47", label: "Counties Covered" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Supermarket jobs in Kenya - hero">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Kenyan supermarket professionals"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
      </div>

      <div className="container relative z-10 py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Now Hiring Across Kenya</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-6 text-white"
          >
            Supermarket
            <br />
            <span className="text-gradient-green">Jobs</span> in
            <br />
            Kenya
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/70 max-w-lg mb-10 leading-relaxed"
          >
            Apply for cashier, cleaner, store keeper, driver, chef &amp; guard jobs at
            Quickmart, Naivas, Carrefour &amp; Cleanshelf — 500+ vacancies across all 47 counties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a
              href="#opportunities"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-105"
            >
              Browse Jobs
              <ArrowDown className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-white/20 hover:shadow-md"
            >
              How It Works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:flex-wrap lg:gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/10">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md sm:rounded-lg bg-primary/20 shrink-0">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-2xl font-bold text-white leading-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-white/60 whitespace-nowrap">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
