import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Calendar,
  ShoppingBag,
  HeartPulse,
  ArrowUpRight,
  Star,
  Clock,
  MapPin,
  Bone,
  Stethoscope,
  PawPrint,
} from "lucide-react";
import { HealthChart } from "@/components/HealthChart";

function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  stagger = "",
  onClick,
}: {
  label: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  stagger?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`glass-card-elevated rounded-2xl p-5 flex flex-col gap-3 animate-reveal-up cursor-pointer hover:shadow-xl transition-shadow duration-300 active:scale-[0.98] ${stagger}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-primary flex items-center gap-0.5">
          <TrendingUp className="w-3 h-3" />
          {change}
        </span>
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  stagger: string;
  onClick: () => void;
}

function ServiceCard({ title, description, icon: Icon, color, stagger, onClick }: ServiceCardProps) {
  return (
    <div
      className={`glass-card-elevated rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 active:scale-[0.98] animate-reveal-up group ${stagger}`}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-display font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-primary">
        Explore <ArrowUpRight className="w-3 h-3" />
      </div>
    </div>
  );
}

export function DashboardContent() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-reveal-up">
        <p className="text-sm text-muted-foreground">Good morning, Maya 👋</p>
        <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
          Pet Dashboard
        </h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Pets" value="3" change="+1" icon={HeartPulse} color="bg-primary/10 text-primary" stagger="stagger-1" onClick={() => navigate("/health")} />
        <StatCard label="Appointments" value="7" change="+2" icon={Calendar} color="bg-koda-warm/10 text-koda-warm" stagger="stagger-2" onClick={() => navigate("/vet")} />
        <StatCard label="Orders" value="12" change="+4" icon={ShoppingBag} color="bg-koda-sky/10 text-koda-sky" stagger="stagger-3" onClick={() => navigate("/marketplace")} />
        <StatCard label="Health Score" value="94%" change="+3%" icon={TrendingUp} color="bg-koda-rose/10 text-koda-rose" stagger="stagger-4" onClick={() => navigate("/health")} />
      </div>

      {/* Services */}
      <div className="mb-8">
        <h2 className="text-lg font-display font-semibold text-foreground mb-5 animate-reveal-up stagger-4">Our Services</h2>
        <div className="grid grid-cols-4 gap-4">
          <ServiceCard
            title="Pet Marketplace"
            description="Buy and sell pets with certified health documents. Browse mammals, birds, aquatic, and reptiles."
            icon={ShoppingBag}
            color="bg-primary/10 text-primary"
            stagger="stagger-5"
            onClick={() => navigate("/marketplace")}
          />
          <ServiceCard
            title="Health Monitor"
            description="Track vaccinations, medications, and overall health status of your pets in real-time."
            icon={HeartPulse}
            color="bg-koda-warm/10 text-koda-warm"
            stagger="stagger-6"
            onClick={() => navigate("/health")}
          />
          <ServiceCard
            title="Vet Appointments"
            description="Book appointments with verified vets and find nearby veterinary hospitals on the map."
            icon={Stethoscope}
            color="bg-koda-sky/10 text-koda-sky"
            stagger="stagger-7"
            onClick={() => navigate("/vet")}
          />
          <ServiceCard
            title="Pet Food"
            description="Order quality pet food categorized by species — mammals, birds, aquatic, and reptiles."
            icon={Bone}
            color="bg-koda-rose/10 text-koda-rose"
            stagger="stagger-8"
            onClick={() => navigate("/food")}
          />
        </div>
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
            <h2 className="text-lg font-display font-semibold text-foreground">Upcoming Appointments</h2>
            <button
              onClick={() => navigate("/vet")}
              className="text-xs font-medium text-primary flex items-center gap-1 hover:underline underline-offset-2"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { pet: "Milo", vet: "Dr. Chen — Greenfield Vet", time: "Today, 2pm", type: "Annual Checkup" },
              { pet: "Luna", vet: "Dr. Patel — PawCare", time: "Thu, 10am", type: "Dental Cleaning" },
              { pet: "Oscar", vet: "Dr. Kim — AquaVet", time: "Sat, 3pm", type: "Scale Check" },
            ].map((apt, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200 cursor-pointer" onClick={() => navigate("/vet")}>
                <div className="w-11 h-11 rounded-xl bg-koda-sage-light flex items-center justify-center text-sm font-bold text-primary">
                  {apt.pet[0]}
                </div>
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
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">Current Scores</h2>
          <div className="space-y-4">
            {[
              { name: "Milo", species: "Golden Retriever", score: 97, color: "bg-primary" },
              { name: "Luna", species: "Maine Coon", score: 91, color: "bg-koda-warm" },
              { name: "Oscar", species: "Betta Fish", score: 88, color: "bg-koda-sky" },
            ].map((pet) => (
              <div key={pet.name} className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/health")}>
                <div className="w-9 h-9 rounded-xl bg-koda-sage-light flex items-center justify-center text-xs font-bold text-primary">
                  {pet.name[0]}
                </div>
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

      {/* Recommended Products */}
      <div className="mt-8 animate-reveal-up stagger-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-foreground">Recommended Products</h2>
          <button
            onClick={() => navigate("/marketplace")}
            className="text-xs font-medium text-primary flex items-center gap-1 hover:underline underline-offset-2"
          >
            Browse all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: "Organic Salmon Bites", rating: 4.8, price: "$24.99", tag: "Best Seller" },
            { name: "Calming Hemp Chews", rating: 4.6, price: "$18.50", tag: "Wellness" },
            { name: "Smart Collar Pro", rating: 4.9, price: "$89.00", tag: "Tech" },
            { name: "Feather Wand Deluxe", rating: 4.7, price: "$12.99", tag: "Toys" },
          ].map((product, i) => (
            <div
              key={product.name}
              className={`glass-card-elevated rounded-2xl p-4 hover:shadow-xl transition-shadow duration-300 animate-reveal-up cursor-pointer active:scale-[0.98]`}
              style={{ animationDelay: `${(i + 5) * 80}ms` }}
              onClick={() => navigate("/marketplace")}
            >
              <div className="h-28 rounded-xl bg-koda-sage-light/50 flex items-center justify-center mb-3">
                <PawPrint className="w-8 h-8 text-primary/40" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {product.tag}
              </span>
              <p className="text-sm font-semibold text-foreground mt-2">{product.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-foreground">{product.price}</span>
                <span className="flex items-center gap-0.5 text-xs text-koda-warm">
                  <Star className="w-3 h-3 fill-current" /> {product.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
