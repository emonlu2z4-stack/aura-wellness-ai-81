import { Plus, Flame, Camera, Loader2, X, ChevronRight, Sparkles, Trash2, Brain, RefreshCw, Utensils, Clock, Users, ChefHat, Lightbulb } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { Confetti } from "@/components/Confetti";
import { CircularProgress } from "@/components/CircularProgress";
import { StreakBanner } from "@/components/StreakBanner";
import { WaterTracker } from "@/components/WaterTracker";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTodayMeals, useAddMeal, useDeleteMeal } from "@/hooks/useMeals";
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
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      className="glass-card-elevated flex flex-1 flex-col items-center gap-3 p-5 min-h-[120px] btn-bounce"
    >
      <CircularProgress value={current} max={target} size={52} strokeWidth={5} color={color}>
        <span className="text-lg">{emoji}</span>
      </CircularProgress>
      <div className="text-center">
        <p className="font-display text-base font-bold tracking-tight text-foreground">{left}<span className="text-xs font-normal text-muted-foreground ml-0.5">{unit}</span></p>
        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">{label} left</p>
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
    if (!user) { toast.error("Please sign in to upload photos."); return; }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setAnalyzing(true);

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("photos").upload(fileName, file);
      if (uploadError) throw new Error("Failed to upload photo. Please try again.");

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;
      setPhotoUrl(publicUrl);

      const { data, error } = await supabase.functions.invoke("analyze-meal", { body: { imageUrl: publicUrl } });
      if (error) throw new Error("AI analysis failed. Please enter values manually.");

      if (data) {
        setForm({
          name: data.name || "", calories: String(data.calories || ""), protein: String(data.protein || ""),
          carbs: String(data.carbs || ""), fats: String(data.fats || ""), fiber: String(data.fiber || ""),
          sugar: String(data.sugar || ""), sodium: String(data.sodium || ""),
        });
        toast.success("AI estimated nutrition from your photo! 🎉");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to analyze photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  const clearPhoto = () => { setPhotoUrl(null); setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; };

  const handleSubmit = async () => {
    try {
      await addMeal.mutateAsync({
        name: form.name || "Meal", calories: Number(form.calories) || 0, protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0, fats: Number(form.fats) || 0, fiber: Number(form.fiber) || undefined,
        sugar: Number(form.sugar) || undefined, sodium: Number(form.sodium) || undefined, photo_url: photoUrl || undefined,
      });
      toast.success("Meal added! 🎉");
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "", sugar: "", sodium: "" });
      clearPhoto();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add meal.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) clearPhoto(); }}>
      <DialogTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.05 }}
          className="fixed bottom-24 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-lg shadow-primary/30"
        >
          <Plus className="h-7 w-7 text-primary-foreground" />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Log a Meal 🍽️</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoSelect} />
          {photoPreview ? (
            <div className="relative overflow-hidden rounded-xl border-2 border-border">
              <img src={photoPreview} alt="Food preview" className="w-full h-40 object-cover" />
              <AnimatePresence>
                {analyzing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/30">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    </motion.div>
                    <p className="text-sm font-bold text-foreground">Analyzing your meal… 🔍</p>
                    <p className="text-xs text-muted-foreground">Estimating calories & macros</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!analyzing && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={clearPhoto} className="absolute top-2 right-2 rounded-full bg-card/90 p-1.5 shadow-sm border border-border">
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-primary/30 py-6 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all btn-bounce">
              <Camera className="h-8 w-8" />
              <span className="text-sm font-bold">Take or upload a food photo 📸</span>
              <span className="text-xs">AI will estimate calories & macros</span>
            </button>
          )}

          {analyzing ? (
            <div className="space-y-3">
              <div><div className="h-4 w-10 rounded bg-muted/50 mb-1.5" /><div className="h-10 w-full rounded-md bg-muted/40 animate-pulse" /></div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i}><div className="h-3.5 w-16 rounded bg-muted/50 mb-1.5" /><div className="h-10 w-full rounded-md bg-muted/40 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} /></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div><Label>Name</Label><Input placeholder="e.g. Chicken Salad" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Calories</Label><Input type="number" placeholder="0" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} /></div>
                <div><Label>Protein (g)</Label><Input type="number" placeholder="0" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} /></div>
                <div><Label>Carbs (g)</Label><Input type="number" placeholder="0" value={form.carbs} onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} /></div>
                <div><Label>Fats (g)</Label><Input type="number" placeholder="0" value={form.fats} onChange={e => setForm(f => ({ ...f, fats: e.target.value }))} /></div>
                <div><Label>Fiber (g)</Label><Input type="number" placeholder="0" value={form.fiber} onChange={e => setForm(f => ({ ...f, fiber: e.target.value }))} /></div>
                <div><Label>Sugar (g)</Label><Input type="number" placeholder="0" value={form.sugar} onChange={e => setForm(f => ({ ...f, sugar: e.target.value }))} /></div>
                <div><Label>Sodium (mg)</Label><Input type="number" placeholder="0" value={form.sodium} onChange={e => setForm(f => ({ ...f, sodium: e.target.value }))} /></div>
              </div>
              <Button onClick={handleSubmit} disabled={addMeal.isPending} className="w-full gradient-primary text-primary-foreground font-bold text-base py-5 rounded-xl btn-bounce">
                {addMeal.isPending ? "Saving..." : "Add Meal ✅"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NutritionInsights({ meals, targets, userName }: { meals: any[]; targets: any; userName: string }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const fetchInsight = useCallback(async () => {
    if (meals.length === 0) return;
    setInsightLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("nutrition-insights", {
        body: { meals, targets, userName },
      });
      if (error) throw error;
      if (data?.insight) setInsight(data.insight);
      else if (data?.error) toast.error(data.error);
    } catch (e: any) {
      console.error("Insights error:", e);
      toast.error("Couldn't get nutrition insights");
    } finally {
      setInsightLoading(false);
      setHasRequested(true);
    }
  }, [meals, targets, userName]);

  useEffect(() => {
    if (meals.length > 0 && !hasRequested) {
      fetchInsight();
    }
  }, [meals.length, hasRequested, fetchInsight]);

  if (meals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card glow-green p-4 border-duo-green/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-duo-green/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-duo-green" />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground">AI Nutrition Insight</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { setHasRequested(false); setInsight(null); }}
          disabled={insightLoading}
          className="p-1.5 rounded-full hover:bg-secondary transition-colors"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${insightLoading ? "animate-spin" : ""}`} />
        </motion.button>
      </div>
      {insightLoading ? (
        <div className="flex items-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs font-semibold text-muted-foreground">Analyzing your meals…</p>
        </div>
      ) : insight ? (
        <p className="text-sm font-medium text-foreground/90 leading-relaxed">{insight}</p>
      ) : (
        <p className="text-xs text-muted-foreground">Tap refresh to get a new insight</p>
      )}
    </motion.div>
  );
}

type SuggestedMeal = { name: string; emoji: string; calories: number; protein: number; carbs: number; fats: number; description: string };
type RecipeData = { prepTime: string; cookTime: string; servings: number; ingredients: { item: string; amount: string }[]; steps: string[]; tips?: string };

function RecipeDetailDialog({ meal, open, onOpenChange }: { meal: SuggestedMeal | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && meal && !recipe) {
      setLoading(true);
      supabase.functions.invoke("recipe-details", {
        body: { mealName: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fats: meal.fats },
      }).then(({ data, error }) => {
        if (error || data?.error) { toast.error(data?.error || "Couldn't load recipe"); return; }
        setRecipe(data);
      }).catch(() => toast.error("Couldn't load recipe"))
        .finally(() => setLoading(false));
    }
  }, [open, meal]);

  // Reset when closed
  useEffect(() => { if (!open) setRecipe(null); }, [open]);

  if (!meal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-2 border-border max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <span className="text-2xl">{meal.emoji}</span> {meal.name}
          </DialogTitle>
        </DialogHeader>

        {/* Macro summary */}
        <div className="flex items-center gap-3 text-xs font-semibold py-2">
          <span className="bg-duo-orange/10 text-duo-orange px-2 py-1 rounded-full">{meal.calories} cal</span>
          <span className="bg-duo-blue/10 text-duo-blue px-2 py-1 rounded-full">P {meal.protein}g</span>
          <span className="bg-duo-yellow/10 text-duo-yellow px-2 py-1 rounded-full">C {meal.carbs}g</span>
          <span className="bg-duo-green/10 text-duo-green px-2 py-1 rounded-full">F {meal.fats}g</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Generating recipe…</p>
          </div>
        ) : recipe ? (
          <div className="space-y-4">
            {/* Time & servings */}
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Prep: {recipe.prepTime}</span>
              <span className="flex items-center gap-1"><ChefHat className="h-3.5 w-3.5" /> Cook: {recipe.cookTime}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}</span>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="font-display font-bold text-sm text-foreground mb-2">Ingredients 🛒</h4>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary mt-0.5">✓</span>
                    <span className="text-foreground/90"><span className="font-semibold">{ing.amount}</span> {ing.item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="font-display font-bold text-sm text-foreground mb-2">Steps 👨‍🍳</h4>
              <ol className="space-y-2.5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-primary-foreground">{i + 1}</span>
                    <p className="text-foreground/90 leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tip */}
            {recipe.tips && (
              <div className="rounded-xl bg-duo-yellow/10 border-2 border-duo-yellow/20 p-3 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-duo-yellow flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-foreground/80">{recipe.tips}</p>
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function MealSuggestions({ remaining, mealsEaten, onAddMeal }: {
  remaining: { calories: number; protein: number; carbs: number; fats: number };
  mealsEaten: string[];
  onAddMeal: (meal: { name: string; calories: number; protein: number; carbs: number; fats: number }) => void;
}) {
  const [suggestions, setSuggestions] = useState<SuggestedMeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<SuggestedMeal | null>(null);
  const [recipeOpen, setRecipeOpen] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("suggest-meals", {
        body: { remaining, mealsEatenToday: mealsEaten },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      setSuggestions(data?.meals ?? []);
      setShow(true);
    } catch (e: any) {
      console.error("Suggest meals error:", e);
      toast.error("Couldn't get meal suggestions");
    } finally {
      setLoading(false);
    }
  }, [remaining, mealsEaten]);

  return (
    <div className="space-y-2.5">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={fetchSuggestions}
        disabled={loading}
        className="w-full glass-card p-4 flex items-center gap-3 btn-bounce border-duo-purple/20 hover:border-duo-purple/40 transition-colors"
      >
        <div className="h-10 w-10 rounded-full bg-duo-purple/20 flex items-center justify-center flex-shrink-0">
          {loading ? <Loader2 className="h-5 w-5 animate-spin text-duo-purple" /> : <Utensils className="h-5 w-5 text-duo-purple" />}
        </div>
        <div className="text-left flex-1">
          <p className="font-display font-bold text-sm text-foreground">
            {loading ? "Finding meals for you…" : show ? "Get new suggestions" : "What should I eat next? 🤔"}
          </p>
          <p className="text-xs text-muted-foreground font-semibold">
            AI suggests meals based on your remaining macros
          </p>
        </div>
      </motion.button>

      <AnimatePresence>
        {show && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {suggestions.map((meal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => { setSelectedMeal(meal); setRecipeOpen(true); }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meal.emoji}</span>
                    <div>
                      <p className="font-bold text-sm text-foreground">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] font-semibold">
                    <span className="text-duo-orange">{meal.calories} cal</span>
                    <span className="text-duo-blue">P {meal.protein}g</span>
                    <span className="text-duo-yellow">C {meal.carbs}g</span>
                    <span className="text-duo-green">F {meal.fats}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground">Tap for recipe</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); onAddMeal({ name: meal.name, calories: meal.calories, protein: meal.protein, carbs: meal.carbs, fats: meal.fats }); }}
                      className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors btn-bounce"
                    >
                      + Log
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <RecipeDetailDialog meal={selectedMeal} open={recipeOpen} onOpenChange={setRecipeOpen} />
    </div>
  );
}

export default function Index() {
  const { user, loading } = useAuth();
  const { profile } = useProfile();
  const { data: meals = [] } = useTodayMeals();
  const deleteMeal = useDeleteMeal();
  const addMeal = useAddMeal();
  const [slide, setSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevCaloriesRef = useRef(0);

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + Number(m.calories), protein: acc.protein + Number(m.protein),
      carbs: acc.carbs + Number(m.carbs), fats: acc.fats + Number(m.fats),
      fiber: acc.fiber + Number(m.fiber ?? 0), sugar: acc.sugar + Number(m.sugar ?? 0), sodium: acc.sodium + Number(m.sodium ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 }
  );

  const targets = {
    calories: profile?.calorie_target ?? 2000, protein: profile?.protein_target ?? 150,
    carbs: profile?.carbs_target ?? 250, fats: profile?.fats_target ?? 65,
    fiber: profile?.fiber_target ?? 30, sugar: profile?.sugar_target ?? 50, sodium: profile?.sodium_target ?? 2300,
  };

  const caloriePct = Math.round((totals.calories / targets.calories) * 100);

  // Trigger confetti when calorie goal is reached
  useEffect(() => {
    if (prevCaloriesRef.current < targets.calories && totals.calories >= targets.calories && totals.calories > 0) {
      setShowConfetti(true);
    }
    prevCaloriesRef.current = totals.calories;
  }, [totals.calories, targets.calories]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const caloriesLeft = Math.max(targets.calories - totals.calories, 0);
  const greeting = new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening";
  const greetEmoji = new Date().getHours() < 12 ? "☀️" : new Date().getHours() < 18 ? "🌤️" : "🌙";

  return (
    <div className="min-h-screen bg-background pb-28">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      {/* Fun background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-duo-green/10 blur-[100px]" />
        <div className="absolute top-1/3 -left-32 h-64 w-64 rounded-full bg-duo-blue/10 blur-[80px]" />
        <div className="absolute bottom-40 right-0 h-48 w-48 rounded-full bg-duo-orange/8 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-5 px-5 py-4">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between pt-3">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">{greetEmoji} Good {greeting}</p>
            <h1 className="font-display text-2xl font-bold mt-0.5 text-foreground">{profile?.name || "Wellness Coach"}</h1>
          </div>
          <motion.div whileTap={{ scale: 0.9 }} className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-primary/20">
            <span className="text-sm font-bold text-primary-foreground">{(profile?.name?.[0] || "W").toUpperCase()}</span>
          </motion.div>
        </motion.div>

        {/* Streak */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StreakBanner streak={3} />
        </motion.div>

        {/* AI Coach bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="glass-card p-4 border-duo-blue/20 flex items-start gap-3"
        >
          <div className="h-10 w-10 rounded-full gradient-fun flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {meals.length === 0
                ? `Good ${greeting} ${profile?.name?.split(' ')[0] || ''}! Haven't eaten yet? Let me suggest a meal! 🍳`
                : caloriePct >= 80
                ? `Great job today! You're at ${caloriePct}% of your goal! 🎉`
                : `Keep going ${profile?.name?.split(' ')[0] || ''}! ${caloriesLeft} cal left today 💪`}
            </p>
          </div>
        </motion.div>

        {/* Calorie Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-elevated glow-hero p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, hsl(88, 68%, 40%) ${Math.min(caloriePct, 100)}%, hsl(220, 14%, 90%) ${Math.min(caloriePct, 100)}%)` }} />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Calories Remaining</p>
              <p className="font-display text-5xl font-bold tracking-tight text-foreground">{caloriesLeft.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold text-duo-green">{totals.calories.toLocaleString()} eaten</span>
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="text-xs font-bold text-muted-foreground">{targets.calories.toLocaleString()} goal</span>
              </div>
            </div>
            <div className="relative">
              <CircularProgress value={totals.calories} max={targets.calories} size={110} strokeWidth={10} color="hsl(88, 68%, 40%)">
                <div className="flex flex-col items-center">
                  <Flame className="h-5 w-5 text-duo-orange" />
                  <span className="text-[10px] font-bold text-muted-foreground mt-0.5">{caloriePct}%</span>
                </div>
              </CircularProgress>
            </div>
          </div>
        </motion.div>

        {/* Macro cards */}
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
                <MacroCard emoji="🥩" label="Protein" current={totals.protein} target={targets.protein} color="hsl(199, 89%, 52%)" />
                <MacroCard emoji="🍞" label="Carbs" current={totals.carbs} target={targets.carbs} color="hsl(33, 100%, 50%)" />
                <MacroCard emoji="🥑" label="Fats" current={totals.fats} target={targets.fats} color="hsl(88, 68%, 40%)" />
              </motion.div>
            )}
            {slide === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }} className="flex gap-2.5">
                <MacroCard emoji="🌾" label="Fiber" current={totals.fiber} target={targets.fiber} color="hsl(88, 68%, 40%)" />
                <MacroCard emoji="🍬" label="Sugar" current={totals.sugar} target={targets.sugar} color="hsl(330, 85%, 60%)" />
                <MacroCard emoji="🧂" label="Sodium" current={totals.sodium} target={targets.sodium} color="hsl(199, 89%, 52%)" unit="mg" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-5 flex justify-center gap-2.5">
            {[0, 1].map(i => (
              <button key={i} onClick={() => setSlide(i)}
                className={`h-2.5 rounded-full transition-all duration-300 min-w-[12px] ${slide === i ? "w-8 bg-primary" : "w-2.5 bg-border"}`} />
            ))}
          </div>
        </motion.div>

        {/* AI Nutrition Insights */}
        <NutritionInsights meals={meals} targets={targets} userName={profile?.name?.split(' ')[0] || ''} />

        {/* AI Meal Suggestions */}
        <MealSuggestions
          remaining={{
            calories: Math.max(targets.calories - totals.calories, 0),
            protein: Math.max(targets.protein - totals.protein, 0),
            carbs: Math.max(targets.carbs - totals.carbs, 0),
            fats: Math.max(targets.fats - totals.fats, 0),
          }}
          mealsEaten={meals.map(m => m.name)}
          onAddMeal={async (meal) => {
            try {
              await addMeal.mutateAsync(meal);
              toast.success(`${meal.name} logged! 🎉`);
            } catch { toast.error("Failed to log meal"); }
          }}
        />

        {/* Water Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <WaterTracker />
        </motion.div>

        {/* Today's Meals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-foreground">Today's Meals</h2>
            {meals.length > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {meals.length} logged ✅
              </span>
            )}
          </div>
          {meals.length === 0 ? (
            <div className="glass-card-elevated flex flex-col items-center gap-3 py-10 text-center">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">
                🍽️
              </motion.div>
              <div>
                <p className="text-sm font-bold text-foreground">No meals yet today</p>
                <p className="text-xs text-muted-foreground mt-0.5">Tap <span className="text-primary font-bold">+</span> to log your first meal!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {meals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ delay: 0.05 * idx }}
                  className="meal-item flex items-center gap-4 p-4 min-h-[72px] cursor-pointer btn-bounce"
                >
                  {meal.photo_url ? (
                    <img src={meal.photo_url} alt={meal.name} className="h-12 w-12 rounded-xl object-cover flex-shrink-0 border-2 border-border" />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-foreground">{meal.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-duo-orange">{Number(meal.calories)} cal</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-[11px] font-semibold text-muted-foreground">P {Number(meal.protein)}g · C {Number(meal.carbs)}g · F {Number(meal.fats)}g</span>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this meal?")) {
                        deleteMeal.mutate(meal.id, {
                          onSuccess: () => toast.success("Meal deleted 🗑️"),
                          onError: () => toast.error("Failed to delete meal"),
                        });
                      }
                    }}
                    className="p-2 rounded-full hover:bg-destructive/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </motion.button>
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
