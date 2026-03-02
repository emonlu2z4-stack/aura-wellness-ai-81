import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="glass-card glow-violet flex items-center gap-3 px-4 py-3">
        <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl">
          <Flame className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Day Streak</p>
          <p className="font-display text-xl font-bold">{streak}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card glow-violet p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Flame className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Day Streak</p>
          <p className="font-display text-3xl font-bold">{streak}</p>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {DAYS.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground">{d}</span>
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                i === today && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                activeDays[i]
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {activeDays[i] ? "✓" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
