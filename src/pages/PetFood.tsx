import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Star, Plus, Minus, Search, Filter, X, Edit, Trash2, Pill } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string; owner_id: string; name: string; brand: string; category: string;
  animal_type: string; price: number; weight: string | null; description: string;
  tag: string | null; image_url: string | null; is_available: boolean;
}

interface Medicine {
  id: string; owner_id: string; name: string; category: string; animal_type: string;
  price: number; dosage: string | null; description: string;
  prescription_required: boolean; image_url: string | null; is_available: boolean;
}

const foodCategories = [
  { key: "all", label: "All" },
  { key: "mammals", label: "Mammals" },
  { key: "birds", label: "Birds" },
  { key: "aquatic", label: "Aquatic" },
  { key: "reptiles", label: "Reptiles" },
];

function ProductForm({ type, item, onSave, onCancel }: { type: "food" | "medicine"; item?: any; onSave: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const isFood = type === "food";
  const [form, setForm] = useState({
    name: item?.name || "", brand: item?.brand || "", category: item?.category || "mammals",
    animal_type: item?.animal_type || "", price: item?.price?.toString() || "",
    weight: item?.weight || "", description: item?.description || "", tag: item?.tag || "",
    dosage: item?.dosage || "", prescription_required: item?.prescription_required || false,
    image_url: item?.image_url || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user || !form.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    setSaving(true);
    if (isFood) {
      const data = { name: form.name, brand: form.brand, category: form.category, animal_type: form.animal_type, price: parseFloat(form.price) || 0, weight: form.weight, description: form.description, tag: form.tag, image_url: form.image_url, owner_id: user.id, is_available: true };
      if (item) { const { owner_id, ...upd } = data; await supabase.from("food_products").update(upd).eq("id", item.id); }
      else await supabase.from("food_products").insert(data);
    } else {
      const data = { name: form.name, category: form.category, animal_type: form.animal_type, price: parseFloat(form.price) || 0, dosage: form.dosage, description: form.description, prescription_required: form.prescription_required, image_url: form.image_url, owner_id: user.id, is_available: true };
      if (item) { const { owner_id, ...upd } = data; await supabase.from("medicines").update(upd).eq("id", item.id); }
      else await supabase.from("medicines").insert(data);
    }
    setSaving(false);
    toast({ title: item ? "Updated ✅" : "Added! 🎉" });
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-foreground">{item ? "Edit" : "Add"} {isFood ? "Food" : "Medicine"}</h2>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {[["Name", "name"], ["Price ($)", "price"], ...(isFood ? [["Brand", "brand"], ["Weight", "weight"], ["Tag", "tag"]] : [["Dosage", "dosage"]]), ["Animal Type", "animal_type"], ["Description", "description"], ["Image URL", "image_url"]].map(([label, key]) => (
            <div key={key as string}>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{label as string}</label>
              <input value={(form as any)[key as string]} onChange={(e) => setForm(f => ({ ...f, [key as string]: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
              {foodCategories.filter(c => c.key !== "all").map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          {!isFood && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.prescription_required} onChange={(e) => setForm(f => ({ ...f, prescription_required: e.target.checked }))} /> Prescription Required
            </label>
          )}
        </div>
        <button onClick={handleSubmit} disabled={saving}
          className="w-full mt-5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">
          {saving ? "Saving..." : item ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function PetFood() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"food" | "medicine">("food");
  const [foods, setFoods] = useState<Product[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(undefined);
  const { user, role } = useAuth();
  const { addToCart } = useCart();

  const fetchData = async () => {
    setLoading(true);
    const [{ data: f }, { data: m }] = await Promise.all([
      supabase.from("food_products").select("*").eq("is_available", true).order("created_at", { ascending: false }),
      supabase.from("medicines").select("*").eq("is_available", true).order("created_at", { ascending: false }),
    ]);
    if (f) setFoods(f as Product[]);
    if (m) setMedicines(m as Medicine[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from(tab === "food" ? "food_products" : "medicines").delete().eq("id", id);
    toast({ title: "Removed 🗑️" });
    fetchData();
  };

  const items = tab === "food" ? foods : medicines;
  const filtered = items.filter((p: any) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.animal_type || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Nutrition & medicines for every pet 🍖💊</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>Pet Food & Medicine</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-reveal-up stagger-1">
          {(["food", "medicine"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                tab === t ? "bg-primary text-primary-foreground shadow-md" : "bg-card/60 text-muted-foreground hover:bg-muted border border-border/30")}>
              {t === "food" ? "🍖 Food" : "💊 Medicines"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6 animate-reveal-up stagger-2">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/80 border border-border/40 text-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          {role === "owner" && (
            <button onClick={() => { setEditingItem(undefined); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md">
              <Plus className="w-4 h-4" /> Add {tab === "food" ? "Food" : "Medicine"}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-8 animate-reveal-up stagger-3">
          {foodCategories.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                activeCategory === cat.key ? "bg-primary text-primary-foreground shadow-md" : "bg-card/60 text-muted-foreground hover:bg-muted border border-border/30")}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><p className="text-muted-foreground">Loading...</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product: any, i: number) => {
              const isOwnerItem = role === "owner" && product.owner_id === user?.id;
              return (
                <div key={product.id} className="glass-card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-reveal-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className={cn("h-2", product.category === "mammals" && "bg-primary", product.category === "birds" && "bg-koda-warm", product.category === "aquatic" && "bg-koda-sky", product.category === "reptiles" && "bg-koda-rose")} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      {product.tag && <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{product.tag}</span>}
                      {tab === "medicine" && product.prescription_required && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-koda-rose bg-koda-rose/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Pill className="w-3 h-3" /> Rx
                        </span>
                      )}
                      {product.weight && <span className="text-xs text-muted-foreground">{product.weight}</span>}
                    </div>
                    <h3 className="text-sm font-display font-semibold text-foreground mb-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{product.brand || product.animal_type} {product.animal_type ? `· For ${product.animal_type}` : ""}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{product.description}</p>
                    {tab === "medicine" && product.dosage && <p className="text-xs text-muted-foreground mb-2">Dosage: {product.dosage}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">${Number(product.price).toFixed(2)}</span>
                      {isOwnerItem ? (
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingItem(product); setShowForm(true); }} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="px-3 py-2 rounded-xl border border-destructive/30 text-destructive text-xs hover:bg-destructive/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(tab === "food" ? "food" : "medicine", product.id, product.name, Number(product.price))}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md">
                          <ShoppingCart className="w-3.5 h-3.5" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 animate-reveal-up">
            <p className="text-lg text-muted-foreground">No {tab} products found. {role === "owner" && "Add your first listing!"}</p>
          </div>
        )}

        {showForm && <ProductForm type={tab} item={editingItem} onSave={() => { setShowForm(false); fetchData(); }} onCancel={() => setShowForm(false)} />}
      </div>
    </PageLayout>
  );
}
