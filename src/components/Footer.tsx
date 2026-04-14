import { Heart, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="kenyan-stripe mb-8" />
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-1">
          <Link to="/" className="text-lg font-bold font-display text-white">
            Super<span className="text-primary">Jobs</span> Kenya
          </Link>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Connecting Kenyans with top supermarket careers at Quickmart, Naivas, Carrefour &amp; Cleanshelf.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/jobs" className="text-muted-foreground hover:text-primary transition-colors">All Jobs</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> 209 Lenana Road, Nairobi</li>
            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary shrink-0" /> <a href="tel:+254105575260" className="hover:text-primary transition-colors">+254 105 575 260</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SuperJobs Kenya. All rights reserved. SuperJobs Kenya is not an employer or recruitment agency.
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-primary fill-primary" /> for Kenya
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
