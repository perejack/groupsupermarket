import { motion } from "framer-motion";
import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const positions = [
  "Cleaners", "Cashiers", "Store Keepers", "Drivers", "Loaders & Off-loaders",
  "Marketer", "Sales Attendant", "Chef", "Warehouse Supervisor", "Guards",
];

const employers = [
  { name: "Quickmart", url: "https://www.quickmartopportunities.com/", color: "#4CAF50", locations: "Nairobi, Mombasa, Kisumu", branches: "70+" },
  { name: "Naivas", url: "https://www.applicationskenya.site/", color: "#E53935", locations: "All 47 Counties", branches: "100+" },
  { name: "Carrefour", url: "https://www.carefourcarreropportunities.site/", color: "#1565C0", locations: "Nairobi, Mombasa, Nakuru", branches: "15+" },
  { name: "Cleanshelf", url: "https://www.cleanshelfcareeropportunities.site/", color: "#43A047", locations: "Central Kenya", branches: "20+" },
];

const Jobs = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="py-16" aria-label="All supermarket job vacancies in Kenya 2026">
        <div className="container max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">All Vacancies</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
              Supermarket <span className="text-gradient-hero">Job Vacancies</span> in Kenya 2026
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Browse all open cashier, cleaner, driver, store keeper, chef, guard, and warehouse positions at Kenya's top supermarket chains. Click any employer to apply directly.
            </p>
          </motion.div>

          {/* Positions overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 mb-12"
          >
            <h2 className="text-xl font-bold text-foreground font-display mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Available Positions Across All Supermarkets
            </h2>
            <div className="flex flex-wrap gap-3">
              {positions.map((pos) => (
                <span key={pos} className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground">
                  {pos}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Employer cards */}
          <div className="space-y-6">
            {employers.map((emp, i) => (
              <motion.a
                key={emp.name}
                href={emp.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-2xl border border-border bg-card p-8 hover:border-primary/30 hover:shadow-[var(--card-glow)] transition-all group"
              >
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg shrink-0"
                    style={{ backgroundColor: emp.color }}
                  >
                    {emp.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-display">{emp.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{emp.locations}</span>
                      <span>•</span>
                      <span>{emp.branches} branches</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: emp.color }}>
                  Apply Now <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* SEO content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 prose prose-invert prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground max-w-none"
          >
            <h2>Why Work in a Supermarket in Kenya?</h2>
            <p>Kenya's retail sector is one of the fastest-growing industries in East Africa. With supermarket chains like Naivas expanding to all 47 counties and Quickmart opening new branches every quarter, there are hundreds of new retail jobs created every month. Positions range from entry-level roles like cleaners and cashiers to skilled positions such as chefs, warehouse supervisors, and marketing professionals.</p>

            <h2>How to Apply for Supermarket Jobs in Kenya</h2>
            <p>Applying is simple: browse the employers above, click "Apply Now" to visit their official careers portal, and submit your application. Most supermarkets accept applications for cashier, cleaner, store keeper, driver, loader, marketer, sales attendant, chef, warehouse supervisor, and guard positions on a rolling basis. No recruitment fees are required — if anyone asks you for money, it is a scam.</p>

            <h2>Popular Supermarket Job Locations</h2>
            <p>The highest concentration of supermarket vacancies is in Nairobi, Mombasa, Kisumu, Nakuru, Eldoret, and Thika. However, Naivas operates branches in all 47 counties, meaning opportunities exist even in smaller towns across Kenya.</p>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Jobs;
