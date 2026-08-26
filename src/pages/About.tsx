import { motion } from "framer-motion";
import { MapPin, Phone, Building2, Target, ShieldCheck, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: Target, title: "Our Mission", desc: "To bridge the gap between Kenyan job seekers and leading supermarket employers, making the application process simple, transparent, and accessible to everyone." },
  { icon: ShieldCheck, title: "Trust & Transparency", desc: "We only list verified opportunities from established supermarket chains. Every link redirects to official employer career portals — no middlemen, no hidden fees." },
  { icon: Users, title: "For All Kenyans", desc: "Whether you're a first-time job seeker in Nairobi or an experienced retail professional in Kisumu, SuperJobs Kenya serves all 47 counties." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="py-16" aria-label="About SuperJobs Kenya">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">About Us</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
              Connecting Kenyans with <span className="text-gradient-hero">Supermarket Careers</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              SuperJobs Kenya is the leading platform for supermarket job vacancies in Kenya. We aggregate cashier, cleaner, driver, store keeper, chef, and guard positions from Quickmart, Naivas, Carrefour, and Cleanshelf — helping thousands of Kenyans find employment every month.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-8 text-center hover:border-primary/30 transition-all"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground font-display mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-10"
          >
            <h2 className="text-2xl font-bold text-foreground font-display mb-6 text-center">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Office Address</h3>
                  <address className="text-sm text-muted-foreground not-italic leading-relaxed">
                    209 Lenana Road<br />Nairobi, Kenya
                  </address>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <a href="tel:+254105575260" className="text-sm text-primary hover:underline">+254 105 575 260</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
