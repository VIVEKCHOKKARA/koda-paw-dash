import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck, Heart, ShoppingCart, Star, Syringe, Tag, Plus, Filter, Search, X, Edit, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Pet {
  id: string; owner_id: string; name: string; species: string; breed: string;
  category: string; price: number; age: string; image_url: string | null;
  certified: boolean; certificate_id: string | null; description: string;
  temperament: string | null; health_status: string; vaccinated: boolean; is_available: boolean;
}

const categories = [
  { key: "all", label: "All Pets" },
  { key: "mammals", label: "Mammals" },
  { key: "birds", label: "Birds" },
  { key: "aquatic", label: "Aquatic" },
  { key: "reptiles", label: "Reptiles" },
];

const defaultImages: Record<string, string> = {
  mammals: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
  birds: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&h=300&fit=crop",
  aquatic: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop",
  reptiles: "https://images.unsplash.com/photo-1504450874802-0ba2bcd659e3?w=400&h=300&fit=crop",
};

function PetForm({ pet, onSave, onCancel }: { pet?: Pet; onSave: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: pet?.name || "", species: pet?.species || "", breed: pet?.breed || "",
    category: pet?.category || "mammals", price: pet?.price?.toString() || "",
    age: pet?.age || "", image_url: pet?.image_url || "",
    certified: pet?.certified || false, certificate_id: pet?.certificate_id || "",
    description: pet?.description || "", temperament: pet?.temperament || "",
    health_status: pet?.health_status || "Good", vaccinated: pet?.vaccinated || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!user || !form.name || !form.species || !form.breed) {
      toast({ title: "Missing fields", variant: "destructive" }); return;
    }
    setSaving(true);
    const data = { ...form, price: parseFloat(form.price) || 0, owner_id: user.id, is_available: true };
    if (pet) {
      const { owner_id, ...updateData } = data;
      await supabase.from("pets").update(updateData).eq("id", pet.id);
      toast({ title: "Pet updated ✅" });
    } else {
      await supabase.from("pets").insert(data);
      toast({ title: "Pet listed! 🎉" });
    }
    setSaving(false);
    onSave();
  };

  const field = (label: string, key: string, type = "text") => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <input type={type} value={(form as any)[key]} onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
        className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-semibold text-foreground">{pet ? "Edit Pet" : "Add New Pet"}</h2>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {field("Name", "name")}
            {field("Species", "species")}
            {field("Breed", "breed")}
            {field("Age", "age")}
            {field("Price ($)", "price", "number")}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                {categories.filter(c => c.key !== "all").map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
          </div>
          {field("Image URL", "image_url")}
          {field("Description", "description")}
          {field("Temperament", "temperament")}
          {field("Health Status", "health_status")}
          {field("Certificate ID", "certificate_id")}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.certified} onChange={(e) => setForm(f => ({ ...f, certified: e.target.checked }))} className="rounded" /> Certified
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.vaccinated} onChange={(e) => setForm(f => ({ ...f, vaccinated: e.target.checked }))} className="rounded" /> Vaccinated
            </label>
          </div>
        </div>
        <button onClick={handleSubmit} disabled={saving}
          className="w-full mt-5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200">
          {saving ? "Saving..." : pet ? "Update Pet" : "List Pet"}
        </button>
      </div>
    </div>
  );
}

function AnimalCard({ pet, isOwner, onEdit, onDelete }: { pet: Pet; isOwner: boolean; onEdit: () => void; onDelete: () => void }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { addToCart } = useCart();
  const image = pet.image_url || defaultImages[pet.category] || defaultImages.mammals;

  return (
    <div className="glass-card-elevated rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow duration-500">
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute top-3 left-3 flex gap-2">
          {pet.certified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-lg">
              <ShieldCheck className="w-3 h-3" /> Certified
            </span>
          )}
          {pet.vaccinated && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-koda-sky text-primary-foreground px-2.5 py-1 rounded-full shadow-lg">
              <Syringe className="w-3 h-3" /> Vaccinated
            </span>
          )}
        </div>
        <button onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
          <Heart className={cn("w-4 h-4 transition-colors duration-200", liked ? "fill-koda-rose text-koda-rose" : "text-muted-foreground")} />
        </button>
        <div className="absolute bottom-3 right-3">
          <span className="text-sm font-bold bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-xl shadow-lg">
            ${Number(pet.price).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-display font-semibold text-foreground">{pet.name}</h3>
            <p className="text-xs text-muted-foreground">{pet.breed} · {pet.age}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{pet.species}</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {expanded ? pet.description : (pet.description || "").slice(0, 100) + "..."}
          {pet.description && pet.description.length > 100 && (
            <button onClick={() => setExpanded(!expanded)} className="ml-1 text-primary font-medium hover:underline underline-offset-2">
              {expanded ? "Less" : "More"}
            </button>
          )}
        </p>

        {pet.certified && pet.certificate_id && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-primary">Health Certificate</p>
              <p className="text-xs text-muted-foreground font-mono">{pet.certificate_id}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-koda-warm fill-koda-warm" /> {pet.health_status}</span>
          {pet.temperament && <><span>·</span><span>{pet.temperament.split(",")[0].trim()}</span></>}
        </div>

        <div className="flex gap-2">
          {isOwner ? (
            <>
              <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all">
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button onClick={onDelete} className="px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 active:scale-[0.98] transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => addToCart("pet", pet.id, pet.name, Number(pet.price))}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg">
                <ShoppingCart className="w-4 h-4" /> Buy Now
              </button>
              <button className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all">
                Details
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PetMarketplace() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | undefined>();
  const { user, role } = useAuth();

  const fetchPets = async () => {
    setLoading(true);
    const { data } = await supabase.from("pets").select("*").eq("is_available", true).order("created_at", { ascending: false });
    if (data) setPets(data as Pet[]);
    setLoading(false);
  };

  useEffect(() => { fetchPets(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("pets").delete().eq("id", id);
    toast({ title: "Pet removed 🗑️" });
    fetchPets();
  };

  const filtered = pets.filter((a) => {
    const matchesCategory = activeCategory === "all" || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Find your perfect companion 🐾</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>Pet Marketplace</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 animate-reveal-up stagger-1">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/80 border border-border/40 text-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input type="text" placeholder="Search by name, breed, or species..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground" />
          </div>
          {role === "owner" && (
            <button onClick={() => { setEditingPet(undefined); setShowForm(true); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md">
              <Plus className="w-4 h-4" /> Add Pet
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-8 animate-reveal-up stagger-2">
          {categories.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              )}>
              {cat.label}
              <span className={cn("ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full", activeCategory === cat.key ? "bg-primary-foreground/20" : "bg-muted")}>
                {cat.key === "all" ? pets.length : pets.filter(a => a.category === cat.key).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20"><p className="text-muted-foreground">Loading pets...</p></div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pet) => (
              <AnimalCard key={pet.id} pet={pet} isOwner={role === "owner" && pet.owner_id === user?.id}
                onEdit={() => { setEditingPet(pet); setShowForm(true); }}
                onDelete={() => handleDelete(pet.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-reveal-up">
            <p className="text-lg text-muted-foreground">No pets found. {role === "owner" && "Add your first pet listing!"}</p>
            <button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="mt-3 text-sm text-primary font-medium hover:underline">Clear filters</button>
          </div>
        )}

        {showForm && <PetForm pet={editingPet} onSave={() => { setShowForm(false); fetchPets(); }} onCancel={() => setShowForm(false)} />}
      </div>
    </PageLayout>
  );
}
