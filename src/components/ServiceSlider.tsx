import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import {
  ShoppingBag, HeartPulse, Stethoscope, Bone, GraduationCap, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Pet Marketplace",
    description: "Browse and buy certified pets from trusted sellers. Find your perfect companion with health certificates and breeder verification.",
    icon: ShoppingBag,
    color: "from-primary/20 to-primary/5",
    iconColor: "bg-primary/10 text-primary",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    path: "/marketplace",
  },
  {
    title: "Health Monitor",
    description: "Track vaccinations, medications, and overall health trends with interactive charts and AI-powered insights.",
    icon: HeartPulse,
    color: "from-koda-warm/20 to-koda-warm/5",
    iconColor: "bg-koda-warm/10 text-koda-warm",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop",
    path: "/health",
  },
  {
    title: "Vet Appointments",
    description: "Book appointments with verified veterinarians. Find nearby hospitals with interactive maps.",
    icon: Stethoscope,
    color: "from-koda-sky/20 to-koda-sky/5",
    iconColor: "bg-koda-sky/10 text-koda-sky",
    image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop",
    path: "/vet",
  },
  {
    title: "Pet Food Store",
    description: "Order quality pet food categorized by species. From premium kibble to specialized aquatic feed.",
    icon: Bone,
    color: "from-koda-rose/20 to-koda-rose/5",
    iconColor: "bg-koda-rose/10 text-koda-rose",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
    path: "/food",
  },
  {
    title: "Pet Training",
    description: "Expert training guides for all species. Learn obedience, tricks, and behavior management.",
    icon: GraduationCap,
    color: "from-koda-sand/40 to-koda-sand/10",
    iconColor: "bg-koda-sand text-koda-charcoal",
    image: "https://images.unsplash.com/photo-1587764379873-97837921fd44?w=600&h=400&fit=crop",
    path: "/training",
  },
  {
    title: "AI Chatbot",
    description: "Get instant answers to your pet care questions powered by AI. Available 24/7 for health and training advice.",
    icon: MessageCircle,
    color: "from-accent/20 to-accent/5",
    iconColor: "bg-accent/20 text-accent",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop",
    path: "/chatbot",
  },
];

export function ServiceSlider() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % services.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + services.length) % services.length), []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next]);

  const service = services[current];
  const Icon = service.icon;

  return (
    <div
      className="glass-card-elevated rounded-2xl overflow-hidden animate-reveal-up stagger-4"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="flex h-[280px]">
        {/* Image */}
        <div className="w-[45%] relative overflow-hidden">
          {services.map((s, i) => (
            <img
              key={s.title}
              src={s.image}
              alt={s.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
                i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
        </div>

        {/* Content */}
        <div className={cn("flex-1 p-8 flex flex-col justify-center bg-gradient-to-r", service.color)}>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", service.iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground mb-2">{service.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.description}</p>
          <button
            onClick={() => navigate(service.path)}
            className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
          >
            Explore <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/30">
        <div className="flex gap-1.5">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={prev} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors active:scale-95">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={next} className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors active:scale-95">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
