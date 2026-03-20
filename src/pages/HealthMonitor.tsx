import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { HealthChart } from "@/components/HealthChart";
import {
  HeartPulse,
  Syringe,
  Pill,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Pet {
  name: string;
  breed: string;
  healthScore: number;
  color: string;
  vaccinations: { name: string; date: string; status: "completed" | "upcoming" | "overdue" }[];
  medications: { name: string; dosage: string; frequency: string; active: boolean }[];
}

const pets: Pet[] = [
  {
    name: "Milo",
    breed: "Golden Retriever",
    healthScore: 97,
    color: "bg-primary",
    vaccinations: [
      { name: "Rabies", date: "2024-01-15", status: "completed" },
      { name: "DHPP", date: "2024-03-20", status: "completed" },
      { name: "Bordetella", date: "2024-08-01", status: "upcoming" },
      { name: "Lyme Disease", date: "2024-02-10", status: "overdue" },
    ],
    medications: [
      { name: "Heartworm Prevention", dosage: "1 tablet", frequency: "Monthly", active: true },
      { name: "Flea & Tick", dosage: "1 dose", frequency: "Monthly", active: true },
    ],
  },
  {
    name: "Luna",
    breed: "Maine Coon",
    healthScore: 91,
    color: "bg-koda-warm",
    vaccinations: [
      { name: "FVRCP", date: "2024-02-10", status: "completed" },
      { name: "Rabies", date: "2024-04-05", status: "completed" },
      { name: "FeLV", date: "2024-09-15", status: "upcoming" },
    ],
    medications: [
      { name: "Joint Supplement", dosage: "1 scoop", frequency: "Daily", active: true },
    ],
  },
  {
    name: "Oscar",
    breed: "Betta Fish",
    healthScore: 88,
    color: "bg-koda-sky",
    vaccinations: [],
    medications: [
      { name: "Water Conditioner", dosage: "5ml", frequency: "Weekly", active: true },
    ],
  },
];

const statusIcon = {
  completed: <CheckCircle2 className="w-4 h-4 text-primary" />,
  upcoming: <Clock className="w-4 h-4 text-koda-warm" />,
  overdue: <AlertCircle className="w-4 h-4 text-koda-rose" />,
};

const statusBg = {
  completed: "bg-primary/10 text-primary",
  upcoming: "bg-koda-warm/10 text-koda-warm",
  overdue: "bg-koda-rose/10 text-koda-rose",
};

export default function HealthMonitor() {
  const [selectedPet, setSelectedPet] = useState(0);
  const pet = pets[selectedPet];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Track your pet's wellbeing 💚</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            Health Monitor
          </h1>
        </div>

        {/* Pet Selector */}
        <div className="flex gap-3 mb-8 animate-reveal-up stagger-1">
          {pets.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelectedPet(i)}
              className={cn(
                "flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                selectedPet === i
                  ? "glass-card-elevated shadow-lg text-foreground"
                  : "bg-card/40 text-muted-foreground hover:bg-card/70 border border-border/30"
              )}
            >
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-primary-foreground", p.color)}>
                {p.name[0]}
              </div>
              <div className="text-left">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.breed}</p>
              </div>
              {selectedPet === i && (
                <span className="ml-2 text-lg font-bold text-primary">{p.healthScore}%</span>
              )}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Health Score", value: `${pet.healthScore}%`, icon: HeartPulse, color: "bg-primary/10 text-primary" },
            { label: "Vaccinations", value: `${pet.vaccinations.filter(v => v.status === "completed").length}/${pet.vaccinations.length}`, icon: Syringe, color: "bg-koda-sky/10 text-koda-sky" },
            { label: "Active Meds", value: `${pet.medications.filter(m => m.active).length}`, icon: Pill, color: "bg-koda-warm/10 text-koda-warm" },
            { label: "Status", value: pet.healthScore >= 90 ? "Excellent" : "Good", icon: Activity, color: "bg-koda-rose/10 text-koda-rose" },
          ].map((stat, i) => (
            <div key={stat.label} className={`glass-card-elevated rounded-2xl p-5 animate-reveal-up`} style={{ animationDelay: `${(i + 2) * 80}ms` }}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Health Chart */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up stagger-5" style={{ minHeight: 340 }}>
          <HealthChart />
        </div>

        {/* Vaccinations & Medications */}
        <div className="grid grid-cols-2 gap-6">
          {/* Vaccinations */}
          <div className="glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-6">
            <div className="flex items-center gap-2 mb-5">
              <Syringe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Vaccinations</h2>
            </div>
            {pet.vaccinations.length > 0 ? (
              <div className="space-y-3">
                {pet.vaccinations.map((vax, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200">
                    {statusIcon[vax.status]}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{vax.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {vax.date}
                      </p>
                    </div>
                    <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", statusBg[vax.status])}>
                      {vax.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">No vaccinations required for this pet</p>
            )}
          </div>

          {/* Medications */}
          <div className="glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-7">
            <div className="flex items-center gap-2 mb-5">
              <Pill className="w-5 h-5 text-koda-warm" />
              <h2 className="text-lg font-display font-semibold text-foreground">Medications</h2>
            </div>
            <div className="space-y-3">
              {pet.medications.map((med, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200">
                  <div className={cn("w-2 h-2 rounded-full", med.active ? "bg-primary" : "bg-muted-foreground")} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage} · {med.frequency}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full",
                    med.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {med.active ? "Active" : "Paused"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
