import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="py-16" aria-label="Contact SuperJobs Kenya">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">Contact</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-display mb-4">
              Get in <span className="text-gradient-hero">Touch</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Have questions about supermarket job applications in Kenya? Reach out to us.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {[
              { icon: MapPin, title: "Visit Us", content: "209 Lenana Road, Nairobi, Kenya" },
              { icon: Phone, title: "Call Us", content: "+254 105 575 260", href: "tel:+254105575260" },
              { icon: Clock, title: "Working Hours", content: "Monday – Friday: 8:00 AM – 5:00 PM EAT" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-8 hover:border-primary/30 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-display mb-1">{item.title}</h2>
                  {item.href ? (
                    <a href={item.href} className="text-primary hover:underline">{item.content}</a>
                  ) : (
                    <p className="text-muted-foreground">{item.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Location info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Our Office</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  209 Lenana Road, Nairobi<br />
                  Kenya
                </p>
                <p className="text-emerald-600 text-sm mt-2 font-medium">
                  Open Monday – Friday, 8:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Contact;
