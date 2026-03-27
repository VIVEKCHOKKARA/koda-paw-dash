import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  ReferenceArea,
} from "recharts";

// Fallback static data when no records exist
const fallbackWeeklyData = [
  { day: "Mon", Milo: 94, Luna: 88, Oscar: 82 },
  { day: "Tue", Milo: 95, Luna: 87, Oscar: 84 },
  { day: "Wed", Milo: 93, Luna: 89, Oscar: 85 },
  { day: "Thu", Milo: 96, Luna: 90, Oscar: 83 },
  { day: "Fri", Milo: 95, Luna: 91, Oscar: 86 },
  { day: "Sat", Milo: 97, Luna: 89, Oscar: 87 },
  { day: "Sun", Milo: 97, Luna: 91, Oscar: 88 },
];

const defaultPetColors = [
  "#00f2fe", // Vibrant Teal
  "#4facfe", // Light Blue
  "#f093fb", // Purple
  "#f5576c", // Pink
  "#48c6ef", // Light Sky
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl px-5 py-4 text-xs border border-white/5 shadow-2xl animate-fade-in">
      <p className="font-semibold text-white/90 mb-3 text-sm">{label}</p>
      <div className="space-y-3">
        {payload.map((entry) => (
          <div key={entry.name} className="flex flex-col gap-1 py-1">
            <div className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-slate-300 font-medium">{entry.name}</span>
              <span className="ml-auto font-bold text-white">
                {entry.value}% Health ({Number(entry.value || 0) >= 80 ? "Excellent" : Number(entry.value || 0) >= 50 ? "Good" : "Needs Care"})
              </span>
            </div>
            {/* Display weight in tooltip if captured for this data point */}
            {entry.payload && entry.payload[`${entry.name}_weight`] && (
              <div className="pl-5 text-[11px] text-slate-400/80 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
                Weight: <span className="text-slate-300">{entry.payload[`${entry.name}_weight`]} kg</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PetInfo {
  key: string;
  color: string;
  label: string;
}

export function HealthChart() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const [pets, setPets] = useState<PetInfo[]>([]);
  const [activePets, setActivePets] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRecords, setHasRecords] = useState(false);
  useEffect(() => {
    fetchHealthData();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('health_chart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pet_health_records'
        },
        () => {
          fetchHealthData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [range]);

  const fetchHealthData = async () => {
    setLoading(true);

    // Fetch all pet health records with pet info
    const { data: records } = await supabase
      .from("pet_health_records")
      .select("*, pets(name)")
      .order("recorded_at", { ascending: true });

    if (!records || records.length === 0) {
      // Use fallback static data
      setHasRecords(false);
      const fallbackPets = [
        { key: "Milo", color: "hsl(145, 20%, 42%)", label: "Milo" },
        { key: "Luna", color: "hsl(28, 40%, 52%)", label: "Luna" },
        { key: "Oscar", color: "hsl(200, 30%, 52%)", label: "Oscar" },
      ];
      setPets(fallbackPets);
      setActivePets(fallbackPets.map(p => p.key));
      setChartData(fallbackWeeklyData);
      setLoading(false);
      return;
    }

    setHasRecords(true);

    // Group by pet name
    const petMap = new Map<string, { scores: { date: string; score: number; weight: number | null }[] }>();
    for (const rec of records) {
      const petName = (rec as any).pets?.name || "Unknown";
      if (!petMap.has(petName)) {
        petMap.set(petName, { scores: [] });
      }
      petMap.get(petName)!.scores.push({
        date: rec.recorded_at,
        score: rec.health_score,
        weight: rec.weight_kg,
      });
    }

    // Build pet info
    const petNames = Array.from(petMap.keys());
    const petInfos: PetInfo[] = petNames.map((name, i) => ({
      key: name,
      color: defaultPetColors[i % defaultPetColors.length],
      label: name,
    }));
    setPets(petInfos);
    if (activePets.length === 0) {
      setActivePets(petNames);
    }

    // Build chart data based on range
    if (range === "weekly") {
      const now = new Date();
      const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const dataPoints: any[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayLabel = dayLabels[date.getDay() === 0 ? 6 : date.getDay() - 1];

        const point: any = { day: dayLabel };
        for (const [petName, data] of petMap) {
          const dayRecords = data.scores.filter(s => s.date.startsWith(dateStr));
          if (dayRecords.length > 0) {
            const latestRecordResult = dayRecords[dayRecords.length - 1];
            point[petName] = latestRecordResult.score;
            if (latestRecordResult.weight) point[`${petName}_weight`] = latestRecordResult.weight;
          } else {
            const pastRecords = data.scores.filter(s => s.date <= dateStr);
            if (pastRecords.length > 0) {
              const lastRecord = pastRecords[pastRecords.length - 1];
              point[petName] = lastRecord.score;
              if (lastRecord.weight) point[`${petName}_weight`] = lastRecord.weight;
            }
          }
        }
        dataPoints.push(point);
      }
      setChartData(dataPoints);
    } else {
      const now = new Date();
      const dataPoints: any[] = [];

      for (let w = 3; w >= 0; w--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - w * 7);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const weekStartStr = weekStart.toISOString();
        const weekEndStr = weekEnd.toISOString();

        const point: any = { day: `Wk ${4 - w}` };
        for (const [petName, data] of petMap) {
          const weekRecords = data.scores.filter(
            s => s.date >= weekStartStr && s.date < weekEndStr
          );
          if (weekRecords.length > 0) {
            const avgScore = Math.round(weekRecords.reduce((s, r) => s + r.score, 0) / weekRecords.length);
            const avgWeight = weekRecords.find(r => r.weight)?.weight;
            point[petName] = avgScore;
            if (avgWeight) point[`${petName}_weight`] = avgWeight;
          } else {
            const pastRecords = data.scores.filter(s => s.date < weekStartStr);
            if (pastRecords.length > 0) {
              const lastRecord = pastRecords[pastRecords.length - 1];
              point[petName] = lastRecord.score;
              if (lastRecord.weight) point[`${petName}_weight`] = lastRecord.weight;
            }
          }
        }
        dataPoints.push(point);
      }
      setChartData(dataPoints);
    }
    setLoading(false);
  };

  const togglePet = (key: string) => {
    setActivePets((prev) =>
      prev.includes(key)
        ? prev.length > 1
          ? prev.filter((p) => p !== key)
          : prev
        : [...prev, key]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-display font-semibold text-foreground">Health Trends</h2>
          {hasRecords && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-xl bg-muted/60">
          {(["weekly", "monthly"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                range === r
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "weekly" ? "Week" : "Month"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {pets.map((pet) => {
          const isActive = activePets.includes(pet.key);
          return (
            <button
              key={pet.key}
              onClick={() => togglePet(pet.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97] ${
                isActive
                  ? "bg-card shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-opacity"
                style={{
                  backgroundColor: pet.color,
                  opacity: isActive ? 1 : 0.3,
                }}
              />
              {pet.label}
            </button>
          );
        })}
      </div>

      <div className="h-[300px] w-full mt-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Loading health data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <filter id="shadow" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                  <feOffset in="blur" dx="0" dy="4" result="offsetBlur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {pets.map((pet) => (
                  <linearGradient key={pet.key} id={`grad-${pet.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={pet.color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={pet.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(156, 163, 175, 0.6)" }}
                dy={8}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(156, 163, 175, 0.6)" }}
                tickFormatter={(v) => `${v}%`}
              />
              <ReferenceArea y1={80} y2={100} fill="rgba(34, 197, 94, 0.02)" />
              <ReferenceArea y1={50} y2={80} fill="rgba(234, 179, 8, 0.02)" />
              <ReferenceArea y1={0} y2={50} fill="rgba(239, 68, 68, 0.02)" />
              <Tooltip content={<CustomTooltip />} />
              {pets.map((pet) =>
                activePets.includes(pet.key) ? (
                  <Area
                    key={pet.key}
                    type="monotone"
                    dataKey={pet.key}
                    stroke={pet.color}
                    strokeWidth={3}
                    fill={`url(#grad-${pet.key})`}
                    filter="url(#shadow)"
                    dot={{
                      r: 4,
                      strokeWidth: 2,
                      stroke: "rgba(255,255,255,0.8)",
                      fill: pet.color,
                      fillOpacity: 1
                    }}
                    activeDot={{
                      r: 7,
                      strokeWidth: 2,
                      stroke: "white",
                      fill: pet.color,
                      shadow: "0 0 10px rgba(0,0,0,0.5)"
                    }}
                    animationDuration={1500}
                    animationEasing="cubic-bezier(0.4, 0, 0.2, 1)"
                    connectNulls
                  />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

