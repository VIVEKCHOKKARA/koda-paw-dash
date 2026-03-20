import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { animals, categories, type Animal } from "@/data/animals";
import {
  ShieldCheck,
  Heart,
  ShoppingCart,
  Star,
  Syringe,
  Tag,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

function AnimalCard({ animal, index }: { animal: Animal; index: number }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="glass-card-elevated rounded-2xl overflow-hidden group animate-reveal-up hover:shadow-xl transition-shadow duration-500"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {animal.certified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-lg">
              <ShieldCheck className="w-3 h-3" /> Certified
            </span>
          )}
          {animal.vaccinated && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-koda-sky text-primary-foreground px-2.5 py-1 rounded-full shadow-lg">
              <Syringe className="w-3 h-3" /> Vaccinated
            </span>
          )}
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          <Heart
            className={cn("w-4 h-4 transition-colors duration-200", liked ? "fill-koda-rose text-koda-rose" : "text-muted-foreground")}
          />
        </button>
        <div className="absolute bottom-3 right-3">
          <span className="text-sm font-bold bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-xl shadow-lg">
            ${animal.price.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-base font-display font-semibold text-foreground">{animal.name}</h3>
            <p className="text-xs text-muted-foreground">{animal.breed} · {animal.age}</p>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {animal.species}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          {expanded ? animal.description : animal.description.slice(0, 100) + "..."}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 text-primary font-medium hover:underline underline-offset-2"
          >
            {expanded ? "Less" : "More"}
          </button>
        </p>

        {/* Certificate */}
        {animal.certified && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/10 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-primary">Health Certificate</p>
              <p className="text-xs text-muted-foreground font-mono">{animal.certificateId}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-koda-warm fill-koda-warm" /> {animal.healthStatus}
          </span>
          <span>·</span>
          <span>{animal.temperament.split(",")[0].trim()}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {animal.seller}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg">
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
          <button className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-200">
            Details
          </button>
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

  const filtered = animals.filter((a) => {
    const matchesCategory = activeCategory === "all" || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.species.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Find your perfect companion 🐾</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            Pet Marketplace
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8 animate-reveal-up stagger-1">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/80 border border-border/40 text-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search by name, breed, or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/40 bg-card/80 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-200">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md">
            <Plus className="w-4 h-4" /> Sell a Pet
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 animate-reveal-up stagger-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              )}
            >
              {cat.label}
              <span className={cn(
                "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                activeCategory === cat.key ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {cat.key === "all" ? animals.length : animals.filter(a => a.category === cat.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((animal, i) => (
              <AnimalCard key={animal.id} animal={animal} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-reveal-up">
            <p className="text-lg text-muted-foreground">No pets found matching your search.</p>
            <button
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="mt-3 text-sm text-primary font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
