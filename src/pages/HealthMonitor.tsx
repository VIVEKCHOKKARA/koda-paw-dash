import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { HealthChart } from "@/components/HealthChart";
import { SpeciesDistribution } from "@/components/SpeciesDistribution";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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

interface PetRecord {
  id: string;
  name: string;
  breed: string;
  species: string;
  latestHealthScore: number;
  color: string;
  healthRecords: { score: number; date: string; notes: string | null; weight: number | null }[];
}

// Fallback static pets for when no DB data exists
const fallbackPets: PetRecord[] = [
  {
    id: "1", name: "Milo", breed: "Golden Retriever", species: "Dog",
    latestHealthScore: 97, color: "bg-primary",
    healthRecords: [{ score: 97, date: "2024-01-15", notes: "Healthy", weight: 25.5 }],
  },
  {
    id: "2", name: "Luna", breed: "Maine Coon", species: "Cat",
    latestHealthScore: 91, color: "bg-koda-warm",
    healthRecords: [{ score: 91, date: "2024-02-10", notes: "Good condition", weight: 6.2 }],
  },
  {
    id: "3", name: "Oscar", breed: "Betta Fish", species: "Fish",
    latestHealthScore: 88, color: "bg-koda-sky",
    healthRecords: [{ score: 88, date: "2024-03-20", notes: "Active", weight: null }],
  },
];

const petColors = ["bg-primary", "bg-koda-warm", "bg-koda-sky", "bg-koda-rose", "bg-purple-500"];

export default function HealthMonitor() {
  const { role } = useAuth();
  const [selectedPet, setSelectedPet] = useState(0);
  const [pets, setPets] = useState<PetRecord[]>(fallbackPets);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetsWithHealth();

    // Subscribe to new health records to update stats/timeline in real-time
    const channel = supabase
      .channel('health_monitor_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pet_health_records' },
        () => { fetchPetsWithHealth(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPetsWithHealth = async () => {
    setLoading(true);

    // Fetch all pets
    const { data: allPets } = await supabase
      .from("pets")
      .select("id, name, breed, species")
      .order("created_at", { ascending: true });

    if (!allPets || allPets.length === 0) {
      setPets(fallbackPets);
      setLoading(false);
      return;
    }

    // Fetch all health records
    const { data: records } = await supabase
      .from("pet_health_records")
      .select("*")
      .order("recorded_at", { ascending: false });

    const petRecords: PetRecord[] = allPets.map((p, i) => {
      const petHealthRecords = (records || [])
        .filter(r => r.pet_id === p.id)
        .map(r => ({
          score: r.health_score,
          date: r.recorded_at,
          notes: r.notes,
          weight: r.weight_kg,
        }));

      const latestScore = petHealthRecords.length > 0
        ? petHealthRecords[0].score
        : 0;

      return {
        id: p.id,
        name: p.name,
        breed: p.breed,
        species: p.species,
        latestHealthScore: latestScore,
        color: petColors[i % petColors.length],
        healthRecords: petHealthRecords,
      };
    });

    // Filter to only pets that have health records, unless there are none (then show all)
    const petsWithRecords = petRecords.filter(p => p.healthRecords.length > 0);
    setPets(petsWithRecords.length > 0 ? petsWithRecords : petRecords);
    setLoading(false);
  };

  const pet = pets[selectedPet] || pets[0];

  const totalRecords = pet?.healthRecords?.length || 0;
  const latestWeight = pet?.healthRecords?.find(r => r.weight !== null)?.weight;

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

        {loading ? (
          <div className="text-center py-20"><p className="text-muted-foreground">Loading health data...</p></div>
        ) : (
          <>
            {/* Pet Selector */}
            <div className="flex gap-3 mb-8 animate-reveal-up stagger-1 flex-wrap">
              {pets.map((p, i) => (
                <button
                  key={p.id}
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
                    <span className="ml-2 text-lg font-bold text-primary">
                      {p.latestHealthScore > 0 ? `${p.latestHealthScore}%` : "—"}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Health Score",
                  value: pet.latestHealthScore > 0 ? `${pet.latestHealthScore}%` : "—",
                  icon: HeartPulse,
                  color: "bg-primary/10 text-primary",
                },
                {
                  label: "Records",
                  value: `${totalRecords}`,
                  icon: Syringe,
                  color: "bg-koda-sky/10 text-koda-sky",
                },
                {
                  label: "Weight",
                  value: latestWeight ? `${latestWeight} kg` : "—",
                  icon: Pill,
                  color: "bg-koda-warm/10 text-koda-warm",
                },
                {
                  label: "Status",
                  value: pet.latestHealthScore >= 80 ? "Excellent" : pet.latestHealthScore >= 50 ? "Good" : pet.latestHealthScore > 0 ? "Needs Care" : "No Data",
                  icon: Activity,
                  color: "bg-koda-rose/10 text-koda-rose",
                },
              ].map((stat, i) => (
                <div key={stat.label} className="glass-card-elevated rounded-2xl p-5 animate-reveal-up" style={{ animationDelay: `${(i + 2) * 80}ms` }}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Health Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-5 flex flex-col min-h-[400px]">
                <HealthChart />
              </div>
              <div className="glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-6 flex flex-col min-h-[400px]">
                <SpeciesDistribution />
              </div>
            </div>

            {/* Health Records Timeline */}
            <div className="glass-card-elevated rounded-2xl p-6 animate-reveal-up stagger-6">
              <div className="flex items-center gap-2 mb-5">
                <HeartPulse className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Health Records for {pet.name}
                </h2>
              </div>
              {pet.healthRecords.length > 0 ? (
                <div className="space-y-3">
                  {pet.healthRecords.map((record, i) => {
                    const scoreColor = record.score >= 80 ? "text-primary bg-primary/10" :
                      record.score >= 50 ? "text-koda-warm bg-koda-warm/10" : "text-koda-rose bg-koda-rose/10";
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm", scoreColor)}>
                          {record.score}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              Health Check #{pet.healthRecords.length - i}
                            </p>
                            {record.weight && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-koda-sky/10 text-koda-sky">
                                {record.weight} kg
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(record.date).toLocaleDateString()}
                            {record.notes && <span className="ml-2">· {record.notes}</span>}
                          </p>
                        </div>
                        <div className="w-24">
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-700",
                                record.score >= 80 ? "bg-primary" :
                                record.score >= 50 ? "bg-koda-warm" : "bg-koda-rose"
                              )}
                              style={{ width: `${record.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HeartPulse className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No health records yet for {pet.name}.
                    {role === "doctor" ? " Accept an appointment and record health data." : " Health data will appear after a vet visit."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
