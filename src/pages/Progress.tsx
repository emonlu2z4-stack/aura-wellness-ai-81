import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { StreakBanner } from "@/components/StreakBanner";
import { useProfile } from "@/hooks/useProfile";
import { useWeightLogs, useAddWeightLog } from "@/hooks/useWeightLogs";
import { useWeeklyMeals } from "@/hooks/useMeals";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Camera, Upload } from "lucide-react";
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
  const categoryColor = bmi < 18.5 ? "text-neon-cyan" : bmi < 25 ? "text-neon-green" : bmi < 30 ? "text-neon-orange" : "text-destructive";
  const pct = Math.min(((bmi - 15) / 25) * 100, 100);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold">BMI</h3>
        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-secondary", categoryColor)}>{category}</span>
      </div>
      <p className="font-display text-3xl font-bold mb-2">{bmi.toFixed(1)}</p>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "linear-gradient(90deg, hsl(187,92%,50%), hsl(142,71%,45%), hsl(25,95%,53%), hsl(0,72%,51%))" }}>
        <div className="h-full w-1 bg-foreground rounded-full relative" style={{ marginLeft: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
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
        <Button size="sm" variant="outline" className="text-xs">Log Weight</Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Log Weight</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Weight (kg)</Label>
            <Input type="number" placeholder="75" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} disabled={addWeight.isPending} className="w-full gradient-primary text-primary-foreground">
            {addWeight.isPending ? "Saving..." : "Save"}
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

  const chartData = weightLogs.map(l => ({
    date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: Number(l.weight_kg),
  }));

  const weeklyTotals = weeklyMeals.reduce(
    (acc, m) => ({
      protein: acc.protein + Number(m.protein),
      carbs: acc.carbs + Number(m.carbs),
      fats: acc.fats + Number(m.fats),
      calories: acc.calories + Number(m.calories),
    }),
    { protein: 0, carbs: 0, fats: 0, calories: 0 }
  );

  const macroBarData = [
    { name: "Protein", value: weeklyTotals.protein, fill: "hsl(210, 100%, 56%)" },
    { name: "Carbs", value: weeklyTotals.carbs, fill: "hsl(25, 95%, 53%)" },
    { name: "Fats", value: weeklyTotals.fats, fill: "hsl(142, 71%, 45%)" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-40 -left-40 h-60 w-60 rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-4 p-4">
        <h1 className="pt-2 font-display text-2xl font-bold">Progress</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card glow-blue p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold">My Weight</h3>
            <LogWeightDialog />
          </div>
          <div className="flex items-end gap-6 mb-3">
            <div>
              <p className="font-display text-3xl font-bold">{currentWeight || "—"}<span className="text-sm text-muted-foreground ml-1">kg</span></p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold text-muted-foreground">{goalWeight}<span className="text-sm ml-1">kg</span></p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </div>
          <Progress value={progressPct} className="h-2" />
          <p className="mt-1 text-xs text-muted-foreground">{progressPct.toFixed(0)}% to goal</p>
        </motion.div>

        <StreakBanner streak={3} compact />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {TIME_FILTERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setTimeFilter(i)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                i === timeFilter ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-3 font-display font-semibold">Goal Progress</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 20%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 12%)", border: "1px solid hsl(240, 6%, 24%)", borderRadius: "12px", color: "hsl(0, 0%, 95%)" }} />
                <Line type="monotone" dataKey="weight" stroke="hsl(252, 87%, 64%)" strokeWidth={2} dot={{ fill: "hsl(252, 87%, 64%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">Log your weight to see trends</p>
          )}
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-3 font-display font-semibold">Progress Photos</h3>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Camera className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Track your visual progress</p>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Upload a Photo
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {WEEK_FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setWeekFilter(i)}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                i === weekFilter ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="glass-card p-4">
          <h3 className="mb-1 font-display font-semibold">Total Calories</h3>
          <p className="mb-3 font-display text-2xl font-bold">{weeklyTotals.calories}<span className="text-sm text-muted-foreground ml-1">kcal</span></p>
          {macroBarData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={macroBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 20%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(240, 5%, 55%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(240, 5%, 55%)" }} />
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 12%)", border: "1px solid hsl(240, 6%, 24%)", borderRadius: "12px", color: "hsl(0, 0%, 95%)" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No meals logged this week</p>
          )}
        </div>

        <BMICard weight={currentWeight} height={profile?.height_cm ? Number(profile.height_cm) : 0} />
      </div>

      <BottomNav />
    </div>
  );
}
