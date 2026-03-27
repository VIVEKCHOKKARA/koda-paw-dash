import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Calendar, ShoppingBag, HeartPulse, ArrowUpRight,
  Star, Clock, MapPin, Bone, Stethoscope, PawPrint,
  Package, Users,
} from "lucide-react";
import { HealthChart } from "@/components/HealthChart";
import { ServiceSlider } from "@/components/ServiceSlider";
import { useAuth } from "@/contexts/AuthContext";

function StatCard({ label, value, change, icon: Icon, color, stagger = "", onClick }: {
  label: string; value: string; change: string; icon: React.ComponentType<{ className?: string }>;
  color: string; stagger?: string; onClick?: () => void;
}) {
  return (
    <div className={`glass-card-elevated rounded-2xl p-5 flex flex-col gap-3 animate-reveal-up cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-[0.98] hover:-translate-y-1 ${stagger}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-primary flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />{change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export function DashboardContent() {
  const navigate = useNavigate();
  const { role, profile } = useAuth();
  const displayName = profile?.display_name || "there";

  const customerStats = [
    { label: "My Pets", value: "3", change: "+1", icon: HeartPulse, color: "bg-primary/10 text-primary" },
    { label: "Appointments", value: "7", change: "+2", icon: Calendar, color: "bg-koda-warm/10 text-koda-warm" },
    { label: "Orders", value: "12", change: "+4", icon: ShoppingBag, color: "bg-koda-sky/10 text-koda-sky" },
    { label: "Health Score", value: "94%", change: "+3%", icon: TrendingUp, color: "bg-koda-rose/10 text-koda-rose" },
  ];

  const ownerStats = [
    { label: "Listed Pets", value: "18", change: "+3", icon: PawPrint, color: "bg-primary/10 text-primary" },
    { label: "Total Customers", value: "142", change: "+12", icon: Users, color: "bg-koda-warm/10 text-koda-warm" },
    { label: "Products", value: "45", change: "+8", icon: Package, color: "bg-koda-sky/10 text-koda-sky" },
    { label: "Revenue", value: "$8.2K", change: "+18%", icon: TrendingUp, color: "bg-koda-rose/10 text-koda-rose" },
  ];

  const doctorStats = [
    { label: "Patients", value: "56", change: "+5", icon: HeartPulse, color: "bg-primary/10 text-primary" },
    { label: "Appointments", value: "14", change: "+3", icon: Calendar, color: "bg-koda-warm/10 text-koda-warm" },
    { label: "Treated Today", value: "8", change: "+2", icon: Stethoscope, color: "bg-koda-sky/10 text-koda-sky" },
    { label: "Rating", value: "4.9", change: "+0.1", icon: Star, color: "bg-koda-rose/10 text-koda-rose" },
  ];

  const stats = role === "owner" ? ownerStats : role === "doctor" ? doctorStats : customerStats;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-6 animate-reveal-up">
        <p className="text-sm text-muted-foreground">
          {role === "doctor" ? "Welcome, Dr." : role === "owner" ? "Welcome back," : "Good morning,"} {displayName} 👋
        </p>
        <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
          {role === "doctor" ? "Clinic Dashboard" : role === "owner" ? "Seller Dashboard" : "Pet Dashboard"}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} stagger={`stagger-${i + 1}`} onClick={() => navigate(i < 2 ? "/health" : "/marketplace")} />
        ))}
      </div>

      {/* Service Slider */}
      <div className="mb-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-5 animate-reveal-up stagger-4">Our Services</h2>
        <ServiceSlider />
      </div>

      {/* Health Chart */}
      <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up stagger-5" style={{ minHeight: 340 }}>
        <HealthChart />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Appointments */}
        <div className="col-span-3 glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-display font-semibold text-foreground">
              {role === "doctor" ? "Today's Patients" : "Upcoming Appointments"}
            </h2>
            <button onClick={() => navigate("/vet")} className="text-xs font-medium text-primary flex items-center gap-1 hover:underline underline-offset-2">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { pet: "Milo", vet: "Dr. Chen — Greenfield Vet", time: "Today, 2pm", type: "Annual Checkup", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=80&h=80&fit=crop" },
              { pet: "Luna", vet: "Dr. Patel — PawCare", time: "Thu, 10am", type: "Dental Cleaning", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop" },
              { pet: "Oscar", vet: "Dr. Kim — AquaVet", time: "Sat, 3pm", type: "Scale Check", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=80&h=80&fit=crop" },
            ].map((apt, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all duration-200 cursor-pointer hover:-translate-x-1" onClick={() => navigate("/vet")}>
                <img src={apt.img} alt={apt.pet} className="w-11 h-11 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{apt.pet}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {apt.vet} · {apt.type}
                  </p>
                </div>
                <p className="text-xs font-medium text-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" /> {apt.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pet Scores */}
        <div className="col-span-2 glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-7">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">
            {role === "doctor" ? "Recent Patients" : "Current Scores"}
          </h2>
          <div className="space-y-4">
            {[
              { name: "Milo", species: "Golden Retriever", score: 97, color: "bg-primary", img: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=80&h=80&fit=crop" },
              { name: "Luna", species: "Maine Coon", score: 91, color: "bg-koda-warm", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop" },
              { name: "Oscar", species: "Betta Fish", score: 88, color: "bg-koda-sky", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=80&h=80&fit=crop" },
            ].map((pet) => (
              <div key={pet.name} className="flex items-center gap-3 cursor-pointer hover:translate-x-1 transition-transform duration-200" onClick={() => navigate("/health")}>
                <img src={pet.img} alt={pet.name} className="w-9 h-9 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{pet.name}</p>
                    <span className="text-xs font-semibold text-foreground">{pet.score}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{pet.species}</p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${pet.color} transition-all duration-700`} style={{ width: `${pet.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
