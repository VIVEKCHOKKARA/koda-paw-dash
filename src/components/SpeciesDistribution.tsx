import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ["#00f2fe", "#4facfe", "#f093fb", "#f5576c", "#48c6ef"];

export function SpeciesDistribution() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistribution();
  }, []);

  const fetchDistribution = async () => {
    const { data: allPets } = await supabase.from("pets").select("species");
    if (allPets) {
      const counts: Record<string, number> = {};
      allPets.forEach((p) => {
        counts[p.species] = (counts[p.species] || 0) + 1;
      });
      const total = allPets.length;
      const formatted = Object.entries(counts).map(([name, value]) => ({
        name,
        value,
        percentage: Math.round((value / total) * 100),
      }));
      setData(formatted);
    }
    setLoading(false);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">Species Distribution</h2>
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="w-full h-full max-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
