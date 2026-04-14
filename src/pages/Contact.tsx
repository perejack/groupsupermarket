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

          {/* Embedded map */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 rounded-2xl overflow-hidden border border-border"
          >
            <iframe
              title="SuperJobs Kenya Office Location - 209 Lenana Road Nairobi"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176!2d36.7849!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0NycwNS42IkU!5e0!3m2!1sen!2ske!4v1"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Contact;
