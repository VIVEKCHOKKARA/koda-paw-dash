import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

const weeklyData = [
  { day: "Mon", Milo: 94, Luna: 88, Oscar: 82 },
  { day: "Tue", Milo: 95, Luna: 87, Oscar: 84 },
  { day: "Wed", Milo: 93, Luna: 89, Oscar: 85 },
  { day: "Thu", Milo: 96, Luna: 90, Oscar: 83 },
  { day: "Fri", Milo: 95, Luna: 91, Oscar: 86 },
  { day: "Sat", Milo: 97, Luna: 89, Oscar: 87 },
  { day: "Sun", Milo: 97, Luna: 91, Oscar: 88 },
];

const monthlyData = [
  { day: "Wk 1", Milo: 89, Luna: 83, Oscar: 78 },
  { day: "Wk 2", Milo: 91, Luna: 85, Oscar: 80 },
  { day: "Wk 3", Milo: 93, Luna: 87, Oscar: 82 },
  { day: "Wk 4", Milo: 97, Luna: 91, Oscar: 88 },
];

const pets = [
  { key: "Milo", color: "hsl(145, 20%, 42%)", label: "Milo" },
  { key: "Luna", color: "hsl(28, 40%, 52%)", label: "Luna" },
  { key: "Oscar", color: "hsl(200, 30%, 52%)", label: "Oscar" },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-elevated rounded-xl px-4 py-3 text-xs">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="ml-auto font-semibold text-foreground">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function HealthChart() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const [activePets, setActivePets] = useState<string[]>(["Milo", "Luna", "Oscar"]);

  const data = range === "weekly" ? weeklyData : monthlyData;

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-display font-semibold text-foreground">Health Trends</h2>
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

      {/* Pet toggles */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              {pets.map((pet) => (
                <linearGradient key={pet.key} id={`grad-${pet.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={pet.color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={pet.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(36, 18%, 86%)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(30, 8%, 50%)" }}
              dy={8}
            />
            <YAxis
              domain={[70, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(30, 8%, 50%)" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            {pets.map((pet) =>
              activePets.includes(pet.key) ? (
                <Area
                  key={pet.key}
                  type="monotone"
                  dataKey={pet.key}
                  stroke={pet.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${pet.key})`}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "hsl(40, 30%, 97%)",
                    fill: pet.color,
                  }}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              ) : null
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
