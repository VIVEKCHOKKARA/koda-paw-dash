import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Dog,
  Cat,
  Bird,
  Fish,
  Search,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodProduct {
  id: string;
  name: string;
  brand: string;
  category: "mammals" | "birds" | "aquatic" | "reptiles";
  animalType: string;
  price: number;
  rating: number;
  reviews: number;
  weight: string;
  description: string;
  tag: string;
}

const foodProducts: FoodProduct[] = [
  { id: "1", name: "Premium Chicken & Rice", brand: "Royal Canin", category: "mammals", animalType: "Dogs", price: 42.99, rating: 4.8, reviews: 234, weight: "5kg", description: "Complete nutrition for adult dogs. High-quality protein with essential vitamins and minerals.", tag: "Best Seller" },
  { id: "2", name: "Indoor Cat Formula", brand: "Hill's Science", category: "mammals", animalType: "Cats", price: 34.50, rating: 4.7, reviews: 189, weight: "3.5kg", description: "Specially formulated for indoor cats. Supports healthy weight and hairball control.", tag: "Popular" },
  { id: "3", name: "Hamster Mix Deluxe", brand: "Vitakraft", category: "mammals", animalType: "Hamsters", price: 12.99, rating: 4.5, reviews: 87, weight: "800g", description: "Balanced seed and grain mix with dried fruits. Perfect daily nutrition for hamsters.", tag: "Value" },
  { id: "4", name: "Tropical Parrot Blend", brand: "ZuPreem", category: "birds", animalType: "Parrots", price: 28.99, rating: 4.9, reviews: 156, weight: "1.5kg", description: "Fruit-flavored pellets for medium to large parrots. Complete balanced nutrition.", tag: "Top Rated" },
  { id: "5", name: "Canary Song Food", brand: "Kaytee", category: "birds", animalType: "Canaries", price: 9.99, rating: 4.4, reviews: 98, weight: "500g", description: "Premium blend designed to promote bright plumage and cheerful song.", tag: "New" },
  { id: "6", name: "Tropical Fish Flakes", brand: "TetraMin", category: "aquatic", animalType: "Fish", price: 8.49, rating: 4.6, reviews: 312, weight: "200g", description: "Complete flake food for all tropical freshwater fish. Cleaner and clearer water formula.", tag: "Essential" },
  { id: "7", name: "Turtle Pellets Plus", brand: "ReptoMin", category: "aquatic", animalType: "Turtles", price: 14.99, rating: 4.5, reviews: 145, weight: "300g", description: "Floating food sticks with calcium for strong shell development.", tag: "Popular" },
  { id: "8", name: "Iguana Green Diet", brand: "Zoo Med", category: "reptiles", animalType: "Lizards", price: 18.99, rating: 4.3, reviews: 76, weight: "680g", description: "All-natural adult iguana food with vitamins and minerals. No artificial colors.", tag: "Natural" },
];

const foodCategories = [
  { key: "all", label: "All Food", icon: ShoppingCart },
  { key: "mammals", label: "Mammals", icon: Dog },
  { key: "birds", label: "Birds", icon: Bird },
  { key: "aquatic", label: "Aquatic", icon: Fish },
  { key: "reptiles", label: "Reptiles", icon: Cat },
] as const;

function FoodCard({ product, index }: { product: FoodProduct; index: number }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div
      className="glass-card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-reveal-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Colored top bar */}
      <div className={cn(
        "h-2",
        product.category === "mammals" && "bg-primary",
        product.category === "birds" && "bg-koda-warm",
        product.category === "aquatic" && "bg-koda-sky",
        product.category === "reptiles" && "bg-koda-rose",
      )} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
          <span className="text-xs text-muted-foreground">{product.weight}</span>
        </div>

        <h3 className="text-sm font-display font-semibold text-foreground mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-1">{product.brand} · For {product.animalType}</p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{product.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-0.5 text-xs text-koda-warm">
            <Star className="w-3 h-3 fill-current" /> {product.rating}
          </span>
          <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-border">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md">
              <ShoppingCart className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PetFood() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = foodProducts.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.animalType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Nutrition for every pet 🍖</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            Pet Food Store
          </h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6 animate-reveal-up stagger-1">
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/80 border border-border/40 text-sm">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search food by name, brand, or animal type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border/40 bg-card/80 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-200">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 animate-reveal-up stagger-2">
          {foodCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                activeCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/30"
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product, i) => (
            <FoodCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 animate-reveal-up">
            <p className="text-lg text-muted-foreground">No food products found.</p>
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
