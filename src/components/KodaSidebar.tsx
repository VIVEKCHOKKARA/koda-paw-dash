import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  HeartPulse,
  Stethoscope,
  Bone,
  ChevronDown,
  Dog,
  Cat,
  Bird,
  Fish,
  Search,
  Bell,
  PawPrint,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Pet Marketplace", icon: ShoppingBag, path: "/marketplace" },
  { label: "Health Monitor", icon: HeartPulse, path: "/health" },
  { label: "Vet Appointments", icon: Stethoscope, path: "/vet" },
  { label: "Pet Food", icon: Bone, path: "/food" },
];

interface SpeciesCategory {
  label: string;
  items: string[];
}

const speciesLibrary: SpeciesCategory[] = [
  { label: "Mammals", items: ["Dogs", "Cats", "Hamsters"] },
  { label: "Birds", items: ["Parrots", "Canaries"] },
  { label: "Aquatic", items: ["Tropical Fish", "Turtles"] },
  { label: "Reptiles", items: ["Snakes", "Lizards"] },
];

const speciesIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Dogs: Dog,
  Cats: Cat,
  Parrots: Bird,
  Canaries: Bird,
  "Tropical Fish": Fish,
  Turtles: Fish,
};

export function KodaSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Mammals"]);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  return (
    <aside className="w-72 h-screen flex flex-col border-r border-border/60 bg-sidebar overflow-y-auto shrink-0">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95"
          onClick={() => navigate("/")}
        >
          <PawPrint className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1
            className="font-display text-lg font-bold text-foreground leading-none cursor-pointer"
            onClick={() => navigate("/")}
          >
            Koda
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Pet Care Platform</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/60 text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors duration-200">
          <Search className="w-4 h-4 shrink-0" />
          <span>Search...</span>
          <kbd className="ml-auto text-[10px] bg-background/80 px-1.5 py-0.5 rounded-md border border-border/50 font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 mt-2">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Services
        </p>
        <ul className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    "hover:bg-sidebar-accent active:scale-[0.98]",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-sidebar-foreground/75 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className={cn("w-[18px] h-[18px] transition-transform duration-200", isActive && "scale-110")} />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-scale-in" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Species Library */}
      <nav className="px-3 mt-6 flex-1">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Species Library
        </p>
        <ul className="space-y-0.5">
          {speciesLibrary.map((cat) => {
            const isOpen = expandedCategories.includes(cat.label);
            return (
              <li key={cat.label}>
                <button
                  onClick={() => toggleCategory(cat.label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 active:scale-[0.98]"
                >
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      !isOpen && "-rotate-90"
                    )}
                  />
                  {cat.label}
                  <span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {cat.items.length}
                  </span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <ul className="ml-4 mt-0.5 space-y-0.5">
                    {cat.items.map((species, idx) => {
                      const Icon = speciesIcons[species];
                      return (
                        <li key={species} style={{ animationDelay: `${idx * 50}ms` }}>
                          <button
                            onClick={() => navigate(`/marketplace?category=${cat.label.toLowerCase()}`)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 active:scale-[0.98]"
                          >
                            {Icon ? (
                              <Icon className="w-4 h-4" />
                            ) : (
                              <span className="w-4 h-4 rounded-full bg-muted" />
                            )}
                            {species}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom user area */}
      <div className="p-4 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl bg-koda-sand flex items-center justify-center text-sm font-semibold text-koda-charcoal-soft">
            ML
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Maya Laurent</p>
            <p className="text-xs text-muted-foreground truncate">Pet Parent · 3 pets</p>
          </div>
          <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-koda-rose animate-pulse" />
          </button>
        </div>
      </div>
    </aside>
  );
}
