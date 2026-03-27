import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag, HeartPulse, Stethoscope, Bone, ChevronDown,
  Dog, Cat, Bird, Fish, Search, Bell, PawPrint, LayoutDashboard,
  Sun, Moon, LogOut, GraduationCap, MessageCircle, ShoppingCart, ClipboardList, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

const allNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Pet Marketplace", icon: ShoppingBag, path: "/marketplace" },
  { label: "Health Monitor", icon: HeartPulse, path: "/health" },
  { label: "Vet Appointments", icon: Stethoscope, path: "/vet" },
  { label: "Food & Medicine", icon: Bone, path: "/food" },
  { label: "Pet Training", icon: GraduationCap, path: "/training" },
  { label: "AI Chatbot", icon: MessageCircle, path: "/chatbot" },
  { label: "Customer Orders", icon: ClipboardList, path: "/orders", roleOnly: "owner" },
  { label: "Order Tracking", icon: Truck, path: "/track-orders", roleOnly: "customer" },
  { label: "Order Tracking", icon: Truck, path: "/track-orders", roleOnly: "doctor" },
];

const speciesLibrary = [
  { label: "Mammals", items: ["Dogs", "Cats", "Hamsters"] },
  { label: "Birds", items: ["Parrots", "Canaries"] },
  { label: "Aquatic", items: ["Tropical Fish", "Turtles"] },
  { label: "Reptiles", items: ["Snakes", "Lizards"] },
];

const speciesIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Dogs: Dog, Cats: Cat, Parrots: Bird, Canaries: Bird, "Tropical Fish": Fish, Turtles: Fish,
};

const roleLabels: Record<string, string> = { customer: "Customer", owner: "Pet Seller", doctor: "Vet Doctor" };

export function KodaSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Mammals"]);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]);
  };

  const displayName = profile?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <aside className="w-72 h-screen flex flex-col border-r border-border/60 bg-sidebar overflow-y-auto shrink-0">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 active:scale-95" onClick={() => navigate("/")}>
            <PawPrint className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-none cursor-pointer" onClick={() => navigate("/")}>Koda</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Pet Care Platform</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => setCartOpen(true)} className="relative p-2 rounded-xl hover:bg-muted transition-colors" title="Cart">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
              )}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-muted transition-colors" title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-koda-warm" />}
            </button>
          </div>
        </div>

        {role && (
          <div className="px-4 mb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">{roleLabels[role] || role}</span>
            </div>
          </div>
        )}

        <div className="px-4 mb-2">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/60 text-muted-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
            <Search className="w-4 h-4 shrink-0" />
            <span>Search...</span>
            <kbd className="ml-auto text-[10px] bg-background/80 px-1.5 py-0.5 rounded-md border border-border/50 font-mono">⌘K</kbd>
          </div>
        </div>

        <nav className="px-3 mt-2">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Services</p>
          <ul className="space-y-0.5">
            {allNav.filter(item => !item.roleOnly || item.roleOnly === role).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.label}>
                  <button onClick={() => navigate(item.path)}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent active:scale-[0.98]",
                      isActive ? "bg-primary/10 text-primary shadow-sm" : "text-sidebar-foreground/75 hover:text-sidebar-foreground")}>
                    <item.icon className={cn("w-[18px] h-[18px] transition-transform duration-200", isActive && "scale-110")} />
                    {item.label}
                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-scale-in" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav className="px-3 mt-6 flex-1">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Species Library</p>
          <ul className="space-y-0.5">
            {speciesLibrary.map((cat) => {
              const isOpen = expandedCategories.includes(cat.label);
              return (
                <li key={cat.label}>
                  <button onClick={() => toggleCategory(cat.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200 active:scale-[0.98]">
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", !isOpen && "-rotate-90")} />
                    {cat.label}
                    <span className="ml-auto text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">{cat.items.length}</span>
                  </button>
                  <div className={cn("overflow-hidden transition-all duration-300 ease-out", isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0")}>
                    <ul className="ml-4 mt-0.5 space-y-0.5">
                      {cat.items.map((species) => {
                        const Icon = speciesIcons[species];
                        return (
                          <li key={species}>
                            <button onClick={() => navigate(`/marketplace?category=${cat.label.toLowerCase()}`)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/65 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 active:scale-[0.98]">
                              {Icon ? <Icon className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full bg-muted" />}
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

        <div className="p-4 mt-auto border-t border-border/50">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-koda-sand flex items-center justify-center text-sm font-semibold text-koda-charcoal-soft">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{roleLabels[role || ""] || "Member"}</p>
            </div>
            <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors" title="Notifications">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-koda-rose animate-pulse" />
            </button>
            <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </aside>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
