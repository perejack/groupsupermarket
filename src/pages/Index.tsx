import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SupermarketCard from "@/components/SupermarketCard";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const sharedPositions = [
  "Cleaners", "Cashiers", "Store Keepers", "Drivers", "Loaders & Off-loaders",
  "Marketer", "Sales Attendant", "Chef", "Warehouse Supervisor", "Guards",
];

const supermarkets = [
  {
    name: "Quickmart",
    image: "https://cdn.tuko.co.ke/images/1120/0bc5f1168e562efb.jpeg?v=1",
    description: "One of Kenya's fastest-growing retail chains with 70+ stores nationwide. Join a dynamic team committed to excellent customer service.",
    positions: sharedPositions,
    url: "https://www.quickmartopportunities.com/",
    accentColor: "#E53935",
    locations: "Nairobi, Mombasa, Kisumu",
  },
  {
    name: "Naivas",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9SrLRb-a27YCGkzHrlPNBHEItGh36ahlBaA&s",
    description: "Kenya's largest supermarket chain with over 100 branches. Enjoy career growth, competitive pay, and a supportive work culture.",
    positions: sharedPositions,
    url: "https://www.applicationskenya.site/",
    accentColor: "#4CAF50",
    locations: "All 47 Counties",
  },
  {
    name: "Carrefour",
    image: "https://techmoran.com/wp-content/uploads/2023/03/carrefour.webp",
    description: "An international retail giant operating across Kenya's major malls. Access world-class training and global career pathways.",
    positions: sharedPositions,
    url: "https://www.carefourcarreropportunities.site/",
    accentColor: "#1565C0",
    locations: "Nairobi, Mombasa, Nakuru",
  },
  {
    name: "Cleanshelf",
    image: "https://venasnews.co.ke/wp-content/uploads/2024/04/cleanshelf-supermarket.jpg",
    description: "A modern Kenyan supermarket focused on cleanliness and quality. Be part of a growing brand that values integrity and excellence.",
    positions: sharedPositions,
    url: "https://www.cleanshelfcareeropportunities.site/",
    accentColor: "#43A047",
    locations: "Central Kenya",
  },
];

const faqItems = [
  {
    q: "How do I apply for supermarket jobs in Kenya?",
    a: "Browse the supermarkets listed on this page, choose a position such as cashier, cleaner, driver or store keeper, and click 'Apply Now' to complete your application.",
  },
  {
    q: "What positions are available at Quickmart, Naivas, Carrefour and Cleanshelf?",
    a: "Current openings include Cleaners, Cashiers, Store Keepers, Drivers, Loaders & Off-loaders, Marketers, Sales Attendants, Chefs, Warehouse Supervisors, and Guards.",
  },
  {
    q: "Do I need experience to apply for retail jobs in Kenya?",
    a: "Many entry-level positions such as cleaners, loaders, and cashiers do not require prior experience. Some roles like Warehouse Supervisor or Chef may require relevant experience.",
  },
  {
    q: "Which counties have supermarket job openings?",
    a: "Naivas operates in all 47 counties. Quickmart and Carrefour have branches in Nairobi, Mombasa, Kisumu, and Nakuru. Cleanshelf focuses on Central Kenya.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />

        <section id="opportunities" className="py-24 bg-background" aria-label="Supermarket job vacancies in Kenya">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
                Featured Employers
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-display mb-4">
                Top <span className="text-gradient-hero">Supermarkets</span> Hiring in Kenya
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Apply for cashier, cleaner, store keeper, driver, chef &amp; guard positions at Kenya's leading supermarket chains.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {supermarkets.map((market, i) => (
                <SupermarketCard key={market.name} {...market} index={i} />
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="py-24 bg-background" aria-label="Frequently asked questions about supermarket jobs in Kenya">
          <div className="container max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
                Common <span className="text-gradient-gold">Questions</span>
              </h2>
            </motion.div>
            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <motion.details
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                >
                  <summary className="text-base font-semibold text-white list-none flex items-center justify-between">
                    {item.q}
                    <span className="ml-4 text-primary transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background" aria-label="Start your supermarket career in Kenya">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/60 p-12 md:p-20 text-center border border-primary/20"
            >
              <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/5 blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4">
                  Ready to Start Your Supermarket Career?
                </h2>
                <p className="text-white/80 max-w-md mx-auto mb-8">
                  Thousands of Kenyans have found cashier, driver, chef and store keeper jobs through our platform. Apply today.
                </p>
                <a
                  href="#opportunities"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 font-semibold text-primary transition-all hover:shadow-lg hover:scale-105"
                >
                  Explore Opportunities
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
