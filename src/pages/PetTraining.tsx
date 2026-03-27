import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import {
  GraduationCap, Play, Clock, Star, ChevronRight, Dog, Cat, Bird, Fish,
  X, Maximize2, Volume2, ThumbsUp, BookOpen, Award, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Dogs", "Cats", "Birds", "Fish", "Reptiles"];

const trainingSections = [
  {
    title: "Basic Obedience for Dogs",
    category: "Dogs",
    duration: "12 min",
    difficulty: "Beginner",
    rating: 4.9,
    description:
      "Learn sit, stay, come, and down commands. Build a strong foundation for your dog's training journey.",
    icon: Dog,
    color: "bg-primary/10 text-primary",
    videoId: "jFMA5ggFsdk",
    thumbnail: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=640&h=360&fit=crop",
    lessons: 8,
  },
  {
    title: "Cat Litter Training",
    category: "Cats",
    duration: "8 min",
    difficulty: "Beginner",
    rating: 4.7,
    description:
      "Step-by-step guide to litter training your kitten or cat. Includes troubleshooting tips.",
    icon: Cat,
    color: "bg-koda-warm/10 text-koda-warm",
    videoId: "WMHnV0GvAnI",
    thumbnail: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=640&h=360&fit=crop",
    lessons: 5,
  },
  {
    title: "Teaching Birds to Talk",
    category: "Birds",
    duration: "15 min",
    difficulty: "Intermediate",
    rating: 4.8,
    description:
      "Techniques to teach parrots and other vocal birds to mimic words and phrases.",
    icon: Bird,
    color: "bg-koda-sky/10 text-koda-sky",
    videoId: "TGGkRKBQ4_s",
    thumbnail: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=640&h=360&fit=crop",
    lessons: 6,
  },
  {
    title: "Aquarium Fish Care",
    category: "Fish",
    duration: "10 min",
    difficulty: "Beginner",
    rating: 4.6,
    description:
      "Essential water parameters, feeding schedules, and tank maintenance for healthy fish.",
    icon: Fish,
    color: "bg-koda-rose/10 text-koda-rose",
    videoId: "HWIhFIFC8vE",
    thumbnail: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=640&h=360&fit=crop",
    lessons: 7,
  },
  {
    title: "Leash Walking Mastery",
    category: "Dogs",
    duration: "18 min",
    difficulty: "Intermediate",
    rating: 4.8,
    description:
      "Stop pulling and lunging. Master the art of calm, controlled leash walking with your dog.",
    icon: Dog,
    color: "bg-primary/10 text-primary",
    videoId: "sFGJEOgFNiA",
    thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=640&h=360&fit=crop",
    lessons: 10,
  },
  {
    title: "Reptile Handling Safety",
    category: "Reptiles",
    duration: "9 min",
    difficulty: "Beginner",
    rating: 4.5,
    description:
      "Safe handling techniques for snakes, lizards, and turtles. Prevent stress and injury.",
    icon: GraduationCap,
    color: "bg-koda-sand text-koda-charcoal",
    videoId: "dRGk4Lai3yo",
    thumbnail: "https://images.unsplash.com/photo-1504450874802-0ba2bcd659e3?w=640&h=360&fit=crop",
    lessons: 4,
  },
];

/* ────── Video Player Modal ────── */
function VideoPlayer({
  item,
  onClose,
}: {
  item: (typeof trainingSections)[0];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                item.color
              )}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-display font-semibold text-base">
                {item.title}
              </h3>
              <p className="text-white/50 text-xs">
                {item.category} · {item.difficulty} · {item.duration}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video iframe */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-white/60">
              <Star className="w-3 h-3 fill-koda-warm text-koda-warm" />{" "}
              {item.rating}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/60">
              <BookOpen className="w-3 h-3" /> {item.lessons} lessons
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" /> Helpful
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              <Award className="w-3.5 h-3.5" /> Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────── Training Card ────── */
function TrainingCard({
  item,
  index,
  onPlay,
}: {
  item: (typeof trainingSections)[0];
  index: number;
  onPlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="glass-card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-reveal-up group cursor-pointer"
      style={{ animationDelay: `${(index + 2) * 80}ms` }}
      onClick={onPlay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={item.thumbnail}
          alt={item.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-700 ease-out",
            hovered && "scale-110"
          )}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-all duration-300",
              hovered
                ? "scale-110 bg-primary shadow-primary/40"
                : "scale-100"
            )}
          >
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            <Clock className="w-3 h-3" /> {item.duration}
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
            {item.category}
          </span>
        </div>

        {/* Bottom info on thumbnail */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-white/90">
              <Star className="w-3 h-3 fill-koda-warm text-koda-warm" />{" "}
              {item.rating}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-xs text-white/70">
              {item.lessons} lessons
            </span>
            <span className="text-white/40">·</span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                item.difficulty === "Beginner"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              )}
            >
              {item.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300",
              item.color,
              hovered && "scale-110"
            )}
          >
            <item.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-display font-semibold text-foreground leading-tight">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="w-3.5 h-3.5" /> {item.lessons} lessons
          </span>
          <button className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all duration-200">
            <Play className="w-3.5 h-3.5" /> Watch Now{" "}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────── Main Page ────── */
export default function PetTraining() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [playingItem, setPlayingItem] = useState<
    (typeof trainingSections)[0] | null
  >(null);

  const filtered =
    selectedCategory === "All"
      ? trainingSections
      : trainingSections.filter((s) => s.category === selectedCategory);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-8 animate-reveal-up">
          <p className="text-sm text-muted-foreground">
            Learn to care for your pets 📚
          </p>
          <h1
            className="text-3xl font-display font-bold text-foreground mt-1"
            style={{ lineHeight: 1.1 }}
          >
            Pet Training
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Watch expert-led video tutorials for every type of pet. From basic obedience to advanced care techniques.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 animate-reveal-up stagger-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Play className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{trainingSections.length}</strong> Videos</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">{trainingSections.reduce((s, t) => s + t.lessons, 0)}</strong> Lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">72</strong> Minutes</span>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-8 animate-reveal-up stagger-2 flex-wrap">
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
              <span
                className={cn(
                  "ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full",
                  selectedCategory === cat
                    ? "bg-primary-foreground/20"
                    : "bg-muted"
                )}
              >
                {cat === "All"
                  ? trainingSections.length
                  : trainingSections.filter((s) => s.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Training cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <TrainingCard
              key={item.title}
              item={item}
              index={i}
              onPlay={() => setPlayingItem(item)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 animate-reveal-up">
            <p className="text-lg text-muted-foreground">
              No training videos for this category yet.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-3 text-sm text-primary font-medium hover:underline"
            >
              Show all videos
            </button>
          </div>
        )}

        {/* Video Player Modal */}
        {playingItem && (
          <VideoPlayer
            item={playingItem}
            onClose={() => setPlayingItem(null)}
          />
        )}
      </div>
    </PageLayout>
  );
}
