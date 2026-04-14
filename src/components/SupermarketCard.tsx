import { motion } from "framer-motion";
import { MapPin, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SupermarketCardProps {
  name: string;
  image: string;
  description: string;
  positions: string[];
  url: string;
  accentColor: string;
  locations: string;
  index: number;
}

const SupermarketCard = ({
  name,
  image,
  description,
  positions,
  url,
  accentColor,
  locations,
  index,
}: SupermarketCardProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:border-transparent"
      style={{ "--hover-color": accentColor } as React.CSSProperties}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={`${name} supermarket`}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <div
          className="absolute top-4 left-4 rounded-full px-4 py-1.5 text-sm font-bold backdrop-blur-md"
          style={{ backgroundColor: accentColor + "30", color: "#fff", border: `1px solid ${accentColor}50` }}
        >
          {name}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md border border-white/10">
          <MapPin className="h-3 w-3" />
          {locations}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 font-display">{name}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Open Positions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {positions.map((pos) => (
              <span
                key={pos}
                className="rounded-md bg-muted px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-primary hover:text-white border border-border"
              >
                {pos}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(`/apply/${name.toLowerCase()}`)}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          Apply Now <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default SupermarketCard;
