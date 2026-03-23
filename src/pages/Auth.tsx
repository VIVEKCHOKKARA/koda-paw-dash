import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PawPrint, User, Store, Stethoscope, Mail, Lock, UserCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roles: { value: AppRole; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "customer", label: "Customer", icon: User, desc: "Buy pets, book vet appointments, order food & medicine" },
  { value: "owner", label: "Pet Owner / Seller", icon: Store, desc: "List pets for sale, manage inventory, add food & medicines" },
  { value: "doctor", label: "Veterinary Doctor", icon: Stethoscope, desc: "Accept appointments, monitor animal health, manage clinic" },
];

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("customer");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignUp) {
        await signUp(email, password, displayName, selectedRole);
        toast.success("Account created! Welcome to Koda 🐾");
      } else {
        await signIn(email, password);
        toast.success("Welcome back! 🐾");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen koda-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-reveal-up">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <PawPrint className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Koda</h1>
        </div>

        <div className="glass-card-elevated rounded-2xl p-8">
          <h2 className="text-xl font-display font-bold text-foreground text-center mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isSignUp ? "Join the Koda pet care community" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">I am a...</label>
                  <div className="space-y-2">
                    {roles.map((r) => (
                      <button
                        type="button"
                        key={r.value}
                        onClick={() => setSelectedRole(r.value)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 active:scale-[0.98]",
                          selectedRole === r.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/50 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          selectedRole === r.value ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        )}>
                          <r.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{r.label}</p>
                          <p className="text-xs text-muted-foreground">{r.desc}</p>
                        </div>
                        {selectedRole === r.value && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-scale-in" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-50"
            >
              {submitting ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline underline-offset-2"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
