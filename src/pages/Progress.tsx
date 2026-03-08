import { useState, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StreakBanner } from "@/components/StreakBanner";
import { AchievementsSection, type Achievement } from "@/components/Achievements";
import { PhotoComparisonSection } from "@/components/PhotoComparisonSlider";
import { useProfile } from "@/hooks/useProfile";
import { useWeightLogs, useAddWeightLog } from "@/hooks/useWeightLogs";
import { useWeeklyMeals } from "@/hooks/useMeals";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIME_FILTERS = [
  { label: "90 Days", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
  { label: "All time", days: 3650 },
];

const WEEK_FILTERS = ["This Week", "Last Week", "2 wks ago", "3 wks ago"];

function BMICard({ weight, height }: { weight: number; height: number }) {
  if (!weight || !height) return null;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  const categoryEmoji = bmi < 18.5 ? "⚠️" : bmi < 25 ? "✅" : bmi < 30 ? "⚠️" : "🔴";
  const categoryColor = bmi < 18.5 ? "text-duo-blue" : bmi < 25 ? "text-duo-green" : bmi < 30 ? "text-duo-orange" : "text-destructive";
  const pct = Math.min(((bmi - 15) / 25) * 100, 100);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-foreground">BMI</h3>
        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full bg-secondary", categoryColor)}>{categoryEmoji} {category}</span>
      </div>
      <p className="font-display text-3xl font-bold mb-2 text-foreground">{bmi.toFixed(1)}</p>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, hsl(199,89%,52%), hsl(88,68%,40%), hsl(33,100%,50%), hsl(0,84%,60%))" }}>
        <div className="h-full w-1.5 bg-foreground rounded-full relative" style={{ marginLeft: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-muted-foreground mt-1">
        <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
      </div>
    </div>
  );
}

function LogWeightDialog() {
  const addWeight = useAddWeightLog();
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");

  const handleSubmit = async () => {
    if (!weight) return;
    await addWeight.mutateAsync(Number(weight));
    setWeight("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs font-bold gradient-primary text-primary-foreground rounded-full btn-bounce">⚖️ Log Weight</Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Log Weight ⚖️</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div><Label>Weight (kg)</Label><Input type="number" placeholder="75" value={weight} onChange={e => setWeight(e.target.value)} /></div>
          <Button onClick={handleSubmit} disabled={addWeight.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
            {addWeight.isPending ? "Saving..." : "Save ✅"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProgressPage() {
  const { profile } = useProfile();
  const [timeFilter, setTimeFilter] = useState(0);
  const [weekFilter, setWeekFilter] = useState(0);
  const { data: weightLogs = [] } = useWeightLogs(TIME_FILTERS[timeFilter].days);
  const { data: weeklyMeals = [] } = useWeeklyMeals(weekFilter);

  const currentWeight = profile?.weight_kg ? Number(profile.weight_kg) : (weightLogs.length > 0 ? Number(weightLogs[weightLogs.length - 1].weight_kg) : 0);
  const goalWeight = profile?.goal_weight_kg ? Number(profile.goal_weight_kg) : 70;
  const startWeight = weightLogs.length > 0 ? Number(weightLogs[0].weight_kg) : currentWeight;
  const totalToLose = Math.abs(startWeight - goalWeight);
  const lost = Math.abs(startWeight - currentWeight);
  const progressPct = totalToLose > 0 ? Math.min((lost / totalToLose) * 100, 100) : 0;

  const proteinTarget = profile?.protein_target ?? 150;
  const mealsLogged = weeklyMeals.length;
  const proteinGoalDays = weeklyMeals.filter(m => Number(m.protein) >= proteinTarget / 3).length; // rough per-meal check
  const hasWeightLogs = weightLogs.length > 0;

  const achievements: Achievement[] = useMemo(() => [
    { id: "first-meal", emoji: "🍽️", title: "First Bite", description: "Log your first meal", unlocked: mealsLogged > 0, color: "green" },
    { id: "first-week", emoji: "📅", title: "First Week", description: "Log meals for 7 days", unlocked: mealsLogged >= 7, color: "blue" },
    { id: "protein-3x", emoji: "💪", title: "Protein Pro", description: "Hit protein goal 3 times", unlocked: proteinGoalDays >= 3, color: "orange" },
    { id: "streak-3", emoji: "🔥", title: "On Fire!", description: "3-day streak", unlocked: true, color: "red" },
    { id: "streak-7", emoji: "⚡", title: "7-Day Streak", description: "Log meals 7 days straight", unlocked: mealsLogged >= 7, color: "yellow" },
    { id: "weight-log", emoji: "⚖️", title: "Scale Master", description: "Log your first weight", unlocked: hasWeightLogs, color: "cyan" },
    { id: "meals-20", emoji: "🌟", title: "Dedicated", description: "Log 20 meals", unlocked: mealsLogged >= 20, color: "purple" },
    { id: "streak-30", emoji: "👑", title: "Monthly King", description: "30-day streak", unlocked: false, color: "pink" },
    { id: "goal-reach", emoji: "🏆", title: "Goal Crusher", description: "Reach your weight goal", unlocked: progressPct >= 100, color: "green" },
  ], [mealsLogged, proteinGoalDays, hasWeightLogs, progressPct]);

  const chartData = weightLogs.map(l => ({
    date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: Number(l.weight_kg),
  }));

  const weeklyTotals = weeklyMeals.reduce(
    (acc, m) => ({ protein: acc.protein + Number(m.protein), carbs: acc.carbs + Number(m.carbs), fats: acc.fats + Number(m.fats), calories: acc.calories + Number(m.calories) }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );

  const macroBarData = [
    { name: "Protein", value: weeklyTotals.protein, fill: "hsl(199, 89%, 52%)" },
    { name: "Carbs", value: weeklyTotals.carbs, fill: "hsl(33, 100%, 50%)" },
    { name: "Fats", value: weeklyTotals.fats, fill: "hsl(88, 68%, 40%)" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-duo-blue/10 blur-[80px]" />
        <div className="absolute bottom-40 -left-32 h-48 w-48 rounded-full bg-duo-green/10 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-4 p-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 font-display text-2xl font-bold text-foreground">
          Progress 📈
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-blue p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-bold text-foreground">My Weight ⚖️</h3>
            <LogWeightDialog />
          </div>
          <div className="flex items-end gap-6 mb-3">
            <div>
              <p className="font-display text-3xl font-bold text-foreground">{currentWeight || "—"}<span className="text-sm text-muted-foreground ml-1">kg</span></p>
              <p className="text-xs font-bold text-muted-foreground">Current</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-muted-foreground">{goalWeight}<span className="text-sm ml-1">kg</span></p>
              <p className="text-xs font-bold text-muted-foreground">Goal 🎯</p>
            </div>
          </div>
          <Progress value={progressPct} className="h-3 rounded-full" />
          <p className="mt-1.5 text-xs font-bold text-primary">{progressPct.toFixed(0)}% to goal {progressPct >= 50 ? "🔥" : "💪"}</p>
        </motion.div>

        <StreakBanner streak={3} compact />

        {/* Time filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TIME_FILTERS.map((f, i) => (
            <button key={f.label} onClick={() => setTimeFilter(i)}
              className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition-all btn-bounce border-2",
                i === timeFilter ? "gradient-primary text-primary-foreground border-primary/20 shadow-sm shadow-primary/20" : "bg-card text-muted-foreground border-border hover:border-primary/30"
              )}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-3 font-display font-bold text-foreground">Goal Progress 🎯</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "2px solid hsl(220, 14%, 88%)", borderRadius: "12px", color: "hsl(220, 20%, 15%)", fontWeight: 600 }} />
                <Line type="monotone" dataKey="weight" stroke="hsl(199, 89%, 52%)" strokeWidth={3} dot={{ fill: "hsl(199, 89%, 52%)", r: 4, strokeWidth: 2, stroke: "white" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm font-bold text-muted-foreground">Log your weight to see trends</p>
            </div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <PhotoComparisonSection />
        </motion.div>

        {/* Week filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {WEEK_FILTERS.map((f, i) => (
            <button key={f} onClick={() => setWeekFilter(i)}
              className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition-all btn-bounce border-2",
                i === weekFilter ? "gradient-primary text-primary-foreground border-primary/20 shadow-sm shadow-primary/20" : "bg-card text-muted-foreground border-border hover:border-primary/30"
              )}>
              {f}
            </button>
          ))}
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-1 font-display font-bold text-foreground">Total Calories 🔥</h3>
          <p className="mb-3 font-display text-2xl font-bold text-foreground">{weeklyTotals.calories}<span className="text-sm text-muted-foreground ml-1">kcal</span></p>
          {macroBarData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={macroBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)", fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(220, 10%, 50%)" }} />
                <Tooltip contentStyle={{ background: "hsl(0, 0%, 100%)", border: "2px solid hsl(220, 14%, 88%)", borderRadius: "12px", color: "hsl(220, 20%, 15%)", fontWeight: 600 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">🍽️</p>
              <p className="text-sm font-bold text-muted-foreground">No meals logged this week</p>
            </div>
          )}
        </div>

        <BMICard weight={currentWeight} height={profile?.height_cm ? Number(profile.height_cm) : 0} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <AchievementsSection achievements={achievements} />
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
