import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useWeightLogs } from "@/hooks/useWeightLogs";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

type SettingsView = "personal" | "macros" | "goal" | "weight-history";

export default function ProfileSettings({ view }: { view: SettingsView }) {
  const { profile, updateProfile } = useProfile();
  const { data: weightLogs = [] } = useWeightLogs(3650);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: profile?.name ?? "", age: profile?.age?.toString() ?? "",
    height_cm: profile?.height_cm?.toString() ?? "", weight_kg: profile?.weight_kg?.toString() ?? "",
    goal_weight_kg: profile?.goal_weight_kg?.toString() ?? "", activity_level: profile?.activity_level ?? "moderate",
    calorie_target: profile?.calorie_target?.toString() ?? "2000", protein_target: profile?.protein_target?.toString() ?? "150",
    carbs_target: profile?.carbs_target?.toString() ?? "250", fats_target: profile?.fats_target?.toString() ?? "65",
    fiber_target: profile?.fiber_target?.toString() ?? "30", sugar_target: profile?.sugar_target?.toString() ?? "50",
    sodium_target: profile?.sodium_target?.toString() ?? "2300",
  });

  useState(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "", age: profile.age?.toString() ?? "",
        height_cm: profile.height_cm?.toString() ?? "", weight_kg: profile.weight_kg?.toString() ?? "",
        goal_weight_kg: profile.goal_weight_kg?.toString() ?? "", activity_level: profile.activity_level ?? "moderate",
        calorie_target: profile.calorie_target?.toString() ?? "2000", protein_target: profile.protein_target?.toString() ?? "150",
        carbs_target: profile.carbs_target?.toString() ?? "250", fats_target: profile.fats_target?.toString() ?? "65",
        fiber_target: profile.fiber_target?.toString() ?? "30", sugar_target: profile.sugar_target?.toString() ?? "50",
        sodium_target: profile.sodium_target?.toString() ?? "2300",
      });
    }
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const save = async (updates: Record<string, unknown>) => {
    try {
      await updateProfile.mutateAsync(updates);
      toast({ title: "Saved ✅", description: "Your settings have been updated." });
      navigate("/profile");
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  };

  const titles: Record<string, string> = {
    personal: "Personal Details 👤",
    macros: "Macronutrients 🎯",
    goal: "Goal & Weight ⚖️",
    "weight-history": "Weight History 📋",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-duo-blue/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-4 p-4">
        <div className="flex items-center gap-3 pt-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary border-2 border-border transition-colors hover:bg-secondary/80 btn-bounce">
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <h1 className="font-display text-xl font-bold text-foreground">{titles[view]}</h1>
        </div>

        {view === "personal" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-4 p-5">
            <div><Label>Name</Label><Input value={form.name} onChange={set("name")} placeholder="Your name" /></div>
            <div><Label>Age</Label><Input type="number" value={form.age} onChange={set("age")} placeholder="25" /></div>
            <div><Label>Height (cm)</Label><Input type="number" value={form.height_cm} onChange={set("height_cm")} placeholder="175" /></div>
            <div>
              <Label>Activity Level</Label>
              <select value={form.activity_level} onChange={set("activity_level")}
                className="flex h-10 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="sedentary">🪑 Sedentary</option>
                <option value="light">🚶 Lightly Active</option>
                <option value="moderate">🏃 Moderately Active</option>
                <option value="active">💪 Very Active</option>
                <option value="extra_active">🏋️ Extra Active</option>
              </select>
            </div>
            <Button onClick={() => save({ name: form.name.trim() || "User", age: form.age ? parseInt(form.age) : null, height_cm: form.height_cm ? parseFloat(form.height_cm) : null, activity_level: form.activity_level })}
              disabled={updateProfile.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
              {updateProfile.isPending ? "Saving..." : "Save Changes ✅"}
            </Button>
          </motion.div>
        )}

        {view === "macros" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-4 p-5">
            <p className="text-sm font-semibold text-muted-foreground">Set your daily macro targets</p>
            <div><Label>Calories (kcal) 🔥</Label><Input type="number" value={form.calorie_target} onChange={set("calorie_target")} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Protein 🥩</Label><Input type="number" value={form.protein_target} onChange={set("protein_target")} /></div>
              <div><Label>Carbs 🍞</Label><Input type="number" value={form.carbs_target} onChange={set("carbs_target")} /></div>
              <div><Label>Fats 🥑</Label><Input type="number" value={form.fats_target} onChange={set("fats_target")} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Fiber 🌾</Label><Input type="number" value={form.fiber_target} onChange={set("fiber_target")} /></div>
              <div><Label>Sugar 🍬</Label><Input type="number" value={form.sugar_target} onChange={set("sugar_target")} /></div>
              <div><Label>Sodium 🧂</Label><Input type="number" value={form.sodium_target} onChange={set("sodium_target")} /></div>
            </div>
            <Button onClick={() => save({ calorie_target: parseInt(form.calorie_target) || 2000, protein_target: parseInt(form.protein_target) || 150, carbs_target: parseInt(form.carbs_target) || 250, fats_target: parseInt(form.fats_target) || 65, fiber_target: parseInt(form.fiber_target) || 30, sugar_target: parseInt(form.sugar_target) || 50, sodium_target: parseInt(form.sodium_target) || 2300 })}
              disabled={updateProfile.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
              {updateProfile.isPending ? "Saving..." : "Save Targets ✅"}
            </Button>
          </motion.div>
        )}

        {view === "goal" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-4 p-5">
            <div><Label>Current Weight (kg)</Label><Input type="number" value={form.weight_kg} onChange={set("weight_kg")} placeholder="75" /></div>
            <div><Label>Goal Weight (kg) 🎯</Label><Input type="number" value={form.goal_weight_kg} onChange={set("goal_weight_kg")} placeholder="70" /></div>
            <Button onClick={() => save({ weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null, goal_weight_kg: form.goal_weight_kg ? parseFloat(form.goal_weight_kg) : null })}
              disabled={updateProfile.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
              {updateProfile.isPending ? "Saving..." : "Save Goal ✅"}
            </Button>
          </motion.div>
        )}

        {view === "weight-history" && (
          <div className="space-y-2">
            {weightLogs.length === 0 ? (
              <div className="glass-card flex flex-col items-center gap-2 py-8 text-center">
                <p className="text-3xl">📊</p>
                <p className="text-sm font-bold text-muted-foreground">No weight entries yet</p>
                <p className="text-xs font-semibold text-muted-foreground">Log your weight on the Progress page</p>
              </div>
            ) : (
              weightLogs.slice().reverse().map((log, i) => (
                <motion.div key={log.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card flex items-center justify-between p-4">
                  <span className="text-sm font-semibold text-muted-foreground">{new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className="font-display font-bold text-foreground">{Number(log.weight_kg)} kg</span>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
