import { motion } from "framer-motion";
import { Search, MousePointerClick, FileText, CheckCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Browse", desc: "Explore open positions at top supermarkets across Kenya" },
  { icon: MousePointerClick, title: "Select", desc: "Click on the supermarket that matches your career goals" },
  { icon: FileText, title: "Apply", desc: "Fill out the application form on the retailer's official portal" },
  { icon: CheckCircle, title: "Get Hired", desc: "Interview and start your new career in retail" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 block">
          Simple Process
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
          How It <span className="text-gradient-gold">Works</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative group"
          >
            <div className="rounded-2xl border border-border bg-card p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group-hover:-translate-y-1">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-muted-foreground mb-2">Step {i + 1}</div>
              <h3 className="text-lg font-bold text-white mb-2 font-display">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
