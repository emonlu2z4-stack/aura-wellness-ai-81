import { Plus, Flame, Camera, Loader2, X, ChevronRight } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import { CircularProgress } from "@/components/CircularProgress";
import { StreakBanner } from "@/components/StreakBanner";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTodayMeals, useAddMeal } from "@/hooks/useMeals";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function MacroCard({ emoji, label, current, target, color, unit = "g" }: {
  emoji: string; label: string; current: number; target: number; color: string; unit?: string;
}) {
  const left = Math.max(target - current, 0);
  const pct = Math.min(current / target, 1);
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="glass-card-elevated flex flex-1 flex-col items-center gap-3 p-5 min-h-[120px]"
    >
      <CircularProgress value={current} max={target} size={52} strokeWidth={4.5} color={color}>
        <span className="text-base">{emoji}</span>
      </CircularProgress>
      <div className="text-center">
        <p className="font-display text-base font-bold tracking-tight">{left}<span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span></p>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">{label} left</p>
      </div>
    </motion.div>
  );
}

function AddMealDialog() {
  const addMeal = useAddMeal();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "", sugar: "", sodium: "" });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Please sign in to upload photos.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setAnalyzing(true);

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(fileName, file);
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload photo. Please try again.");
      }

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      setPhotoUrl(publicUrl);

      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: { imageUrl: publicUrl },
      });

      if (error) {
        console.error("AI analysis error:", error);
        throw new Error("AI analysis failed. Please enter values manually.");
      }

      if (data) {
        setForm({
          name: data.name || "",
          calories: String(data.calories || ""),
          protein: String(data.protein || ""),
          carbs: String(data.carbs || ""),
          fats: String(data.fats || ""),
          fiber: String(data.fiber || ""),
          sugar: String(data.sugar || ""),
          sodium: String(data.sodium || ""),
        });
        toast.success("AI estimated nutrition from your photo!");
      }
    } catch (err: any) {
      console.error("Photo analysis failed:", err);
      toast.error(err?.message || "Failed to analyze photo. Please enter values manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearPhoto = () => {
    setPhotoUrl(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    try {
      await addMeal.mutateAsync({
        name: form.name || "Meal",
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fats: Number(form.fats) || 0,
        fiber: Number(form.fiber) || undefined,
        sugar: Number(form.sugar) || undefined,
        sodium: Number(form.sodium) || undefined,
        photo_url: photoUrl || undefined,
      });
      toast.success("Meal added!");
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "", sugar: "", sodium: "" });
      clearPhoto();
      setOpen(false);
    } catch (err: any) {
      console.error("Add meal error:", err);
      toast.error(err?.message || "Failed to add meal. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) clearPhoto(); }}>
      <DialogTrigger asChild>
        <button className="fixed bottom-24 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-lg shadow-primary/30 transition-transform active:scale-95">
          <Plus className="h-7 w-7 text-primary-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Log a Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoSelect}
          />
          {photoPreview ? (
            <div className="relative overflow-hidden rounded-lg">
              <img src={photoPreview} alt="Food preview" className="w-full h-40 object-cover" />
              <AnimatePresence>
                {analyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm"
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                      initial={{ top: 0 }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="relative flex h-16 w-16 items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/40"
                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </motion.div>
                    <div className="text-center">
                      <motion.p
                        className="text-sm font-semibold text-foreground"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Analyzing your meal…
                      </motion.p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Estimating calories & macros</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {!analyzing && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={clearPhoto}
                  className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm p-1.5 shadow-sm"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border py-6 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Camera className="h-8 w-8" />
              <span className="text-sm font-medium">Take or upload a food photo</span>
              <span className="text-xs">AI will estimate calories & macros</span>
            </button>
          )}

          {analyzing ? (
            <div className="space-y-3 animate-fade-in">
              <div>
                <div className="h-4 w-10 rounded bg-muted/50 mb-1.5" />
                <div className="h-10 w-full rounded-md bg-muted/40 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-3.5 w-16 rounded bg-muted/50 mb-1.5" />
                    <div className="h-10 w-full rounded-md bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  </div>
                ))}
              </div>
              <div className="h-10 w-full rounded-md bg-muted/30 animate-pulse" />
            </div>
          ) : (
            <>
              <div>
                <Label>Name</Label>
                <Input placeholder="e.g. Chicken Salad" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Calories</Label>
                  <Input type="number" placeholder="0" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  <Input type="number" placeholder="0" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} />
                </div>
                <div>
                  <Label>Carbs (g)</Label>
                  <Input type="number" placeholder="0" value={form.carbs} onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} />
                </div>
                <div>
                  <Label>Fats (g)</Label>
                  <Input type="number" placeholder="0" value={form.fats} onChange={e => setForm(f => ({ ...f, fats: e.target.value }))} />
                </div>
                <div>
                  <Label>Fiber (g)</Label>
                  <Input type="number" placeholder="0" value={form.fiber} onChange={e => setForm(f => ({ ...f, fiber: e.target.value }))} />
                </div>
                <div>
                  <Label>Sugar (g)</Label>
                  <Input type="number" placeholder="0" value={form.sugar} onChange={e => setForm(f => ({ ...f, sugar: e.target.value }))} />
                </div>
                <div>
                  <Label>Sodium (mg)</Label>
                  <Input type="number" placeholder="0" value={form.sodium} onChange={e => setForm(f => ({ ...f, sodium: e.target.value }))} />
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={addMeal.isPending} className="w-full gradient-primary text-primary-foreground font-semibold">
                {addMeal.isPending ? "Saving..." : "Add Meal"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Index() {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const { data: meals = [] } = useTodayMeals();
  const [slide, setSlide] = useState(0);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + Number(m.calories),
      protein: acc.protein + Number(m.protein),
      carbs: acc.carbs + Number(m.carbs),
      fats: acc.fats + Number(m.fats),
      fiber: acc.fiber + Number(m.fiber ?? 0),
      sugar: acc.sugar + Number(m.sugar ?? 0),
      sodium: acc.sodium + Number(m.sodium ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const targets = {
    calories: profile?.calorie_target ?? 2000,
    protein: profile?.protein_target ?? 150,
    carbs: profile?.carbs_target ?? 250,
    fats: profile?.fats_target ?? 65,
    fiber: profile?.fiber_target ?? 30,
    sugar: profile?.sugar_target ?? 50,
    sodium: profile?.sodium_target ?? 2300,
  };

  const caloriesLeft = Math.max(targets.calories - totals.calories, 0);
  const caloriePct = Math.round((totals.calories / targets.calories) * 100);
  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-72 w-72 rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute bottom-20 right-0 h-60 w-60 rounded-full bg-neon-pink/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-6 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pt-3"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60">Good {greeting}</p>
            <h1 className="font-display text-2xl font-bold mt-0.5">{profile?.name || "Wellness Coach"}</h1>
          </div>
          <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-sm font-bold text-primary-foreground">{(profile?.name?.[0] || "W").toUpperCase()}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StreakBanner streak={3} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-elevated glow-hero gradient-hero p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-muted-foreground/60">Calories Remaining</p>
              <p className="font-display text-5xl font-bold tracking-tight">{caloriesLeft.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">{totals.calories.toLocaleString()} eaten</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-xs text-muted-foreground">{targets.calories.toLocaleString()} goal</span>
              </div>
            </div>
            <div className="relative">
              <CircularProgress value={totals.calories} max={targets.calories} size={110} strokeWidth={9} color="hsl(210, 100%, 56%)">
                <div className="flex flex-col items-center">
                  <Flame className="h-5 w-5 text-neon-orange" />
                  <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">{caloriePct}%</span>
                </div>
              </CircularProgress>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -50 && slide < 1) setSlide(1);
            else if (info.offset.x > 50 && slide > 0) setSlide(0);
          }}
        >
          <AnimatePresence mode="wait" custom={slide}>
            {slide === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="flex gap-2.5">
                <MacroCard emoji="🥩" label="Protein" current={totals.protein} target={targets.protein} color="hsl(210, 100%, 56%)" />
                <MacroCard emoji="🍞" label="Carbs" current={totals.carbs} target={targets.carbs} color="hsl(25, 95%, 53%)" />
                <MacroCard emoji="🥑" label="Fats" current={totals.fats} target={targets.fats} color="hsl(142, 71%, 45%)" />
              </motion.div>
            )}
            {slide === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="flex gap-2.5">
                <MacroCard emoji="🌾" label="Fiber" current={totals.fiber} target={targets.fiber} color="hsl(142, 71%, 45%)" />
                <MacroCard emoji="🍬" label="Sugar" current={totals.sugar} target={targets.sugar} color="hsl(330, 81%, 60%)" />
                <MacroCard emoji="🧂" label="Sodium" current={totals.sodium} target={targets.sodium} color="hsl(187, 92%, 50%)" unit="mg" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-5 flex justify-center gap-2.5">
            {[0, 1].map(i => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 min-w-[12px] ${slide === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20"}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">Today's Meals</h2>
            {meals.length > 0 && (
              <span className="text-xs text-muted-foreground/60 bg-secondary/50 px-2.5 py-1 rounded-full">
                {meals.length} logged
              </span>
            )}
          </div>
          {meals.length === 0 ? (
            <div className="glass-card-elevated flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80">
                <Plus className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">No meals yet today</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">Tap + to log your first meal</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {meals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="meal-item flex items-center gap-4 p-4 min-h-[72px]"
                >
                  {meal.photo_url ? (
                    <img src={meal.photo_url} alt={meal.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0 ring-1 ring-border/30" />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-secondary/60 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{meal.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-semibold text-neon-orange">{Number(meal.calories)} cal</span>
                      <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/30" />
                      <span className="text-[11px] text-muted-foreground">P {Number(meal.protein)}g · C {Number(meal.carbs)}g · F {Number(meal.fats)}g</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AddMealDialog />
      <BottomNav />
    </div>
  );
}
