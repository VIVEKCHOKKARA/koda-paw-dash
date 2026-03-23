import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { GraduationCap, Play, Clock, Star, ChevronRight, Dog, Cat, Bird, Fish } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Dogs", "Cats", "Birds", "Fish", "Reptiles"];

const trainingSections = [
  {
    title: "Basic Obedience for Dogs",
    category: "Dogs",
    duration: "12 min",
    difficulty: "Beginner",
    rating: 4.9,
    description: "Learn sit, stay, come, and down commands. Build a strong foundation for your dog's training journey.",
    icon: Dog,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Cat Litter Training",
    category: "Cats",
    duration: "8 min",
    difficulty: "Beginner",
    rating: 4.7,
    description: "Step-by-step guide to litter training your kitten or cat. Includes troubleshooting tips.",
    icon: Cat,
    color: "bg-koda-warm/10 text-koda-warm",
  },
  {
    title: "Teaching Birds to Talk",
    category: "Birds",
    duration: "15 min",
    difficulty: "Intermediate",
    rating: 4.8,
    description: "Techniques to teach parrots and other vocal birds to mimic words and phrases.",
    icon: Bird,
    color: "bg-koda-sky/10 text-koda-sky",
  },
  {
    title: "Aquarium Fish Care",
    category: "Fish",
    duration: "10 min",
    difficulty: "Beginner",
    rating: 4.6,
    description: "Essential water parameters, feeding schedules, and tank maintenance for healthy fish.",
    icon: Fish,
    color: "bg-koda-rose/10 text-koda-rose",
  },
  {
    title: "Leash Walking Mastery",
    category: "Dogs",
    duration: "18 min",
    difficulty: "Intermediate",
    rating: 4.8,
    description: "Stop pulling and lunging. Master the art of calm, controlled leash walking with your dog.",
    icon: Dog,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Reptile Handling Safety",
    category: "Reptiles",
    duration: "9 min",
    difficulty: "Beginner",
    rating: 4.5,
    description: "Safe handling techniques for snakes, lizards, and turtles. Prevent stress and injury.",
    icon: GraduationCap,
    color: "bg-koda-sand text-koda-charcoal",
  },
];

export default function PetTraining() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? trainingSections
    : trainingSections.filter((s) => s.category === selectedCategory);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">Learn to care for your pets 📚</p>
          <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
            Pet Training
          </h1>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 animate-reveal-up stagger-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border border-border/40 bg-card/80 text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Training cards */}
        <div className="grid grid-cols-2 gap-5">
          {filtered.map((item, i) => (
            <div
              key={item.title}
              className="glass-card-elevated rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate-reveal-up group cursor-pointer"
              style={{ animationDelay: `${(i + 2) * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {item.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {item.duration}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-semibold text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center gap-1 text-xs text-koda-warm">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </span>
                    <button className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
                      <Play className="w-3 h-3" /> Start Training <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
