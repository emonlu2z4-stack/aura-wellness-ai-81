import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

interface StreakBannerProps {
  streak: number;
  activeDays?: boolean[];
  compact?: boolean;
}

export function StreakBanner({ streak, activeDays = [true, true, true, false, false, false, false], compact = false }: StreakBannerProps) {
  const today = new Date().getDay();

  if (compact) {
    return (
      <div className="glass-card flex items-center gap-3 px-4 py-3 border-duo-orange/30">
        <div className="gradient-streak flex h-10 w-10 items-center justify-center rounded-xl shadow-md shadow-duo-orange/20">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day Streak</p>
          <p className="font-display text-xl font-bold text-duo-orange">{streak}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 border-duo-orange/20">
      <div className="mb-3 flex items-center gap-3">
        <motion.div
          className="gradient-streak flex h-12 w-12 items-center justify-center rounded-xl shadow-md shadow-duo-orange/20"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Flame className="h-6 w-6 text-white" />
        </motion.div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Day Streak</p>
          <p className="font-display text-3xl font-bold text-duo-orange">{streak} 🔥</p>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {DAYS.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground">{d}</span>
            <motion.div
              initial={activeDays[i] ? { scale: 0 } : {}}
              animate={activeDays[i] ? { scale: 1 } : {}}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300 }}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                i === today && "ring-2 ring-duo-orange ring-offset-2 ring-offset-background",
                activeDays[i]
                  ? "gradient-streak text-white shadow-sm shadow-duo-orange/20"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {activeDays[i] ? "✓" : ""}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
