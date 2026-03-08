import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  color: string;
}

function getBadgeGradient(color: string, unlocked: boolean) {
  if (!unlocked) return "bg-secondary";
  const map: Record<string, string> = {
    green: "bg-gradient-to-br from-duo-green/20 to-duo-green/5 border-duo-green/30",
    blue: "bg-gradient-to-br from-duo-blue/20 to-duo-blue/5 border-duo-blue/30",
    orange: "bg-gradient-to-br from-duo-orange/20 to-duo-orange/5 border-duo-orange/30",
    purple: "bg-gradient-to-br from-duo-purple/20 to-duo-purple/5 border-duo-purple/30",
    pink: "bg-gradient-to-br from-duo-pink/20 to-duo-pink/5 border-duo-pink/30",
    yellow: "bg-gradient-to-br from-duo-yellow/20 to-duo-yellow/5 border-duo-yellow/30",
    cyan: "bg-gradient-to-br from-duo-cyan/20 to-duo-cyan/5 border-duo-cyan/30",
    red: "bg-gradient-to-br from-duo-red/20 to-duo-red/5 border-duo-red/30",
  };
  return map[color] || map.green;
}

export function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={achievement.unlocked ? { scale: 1.05, rotate: [0, -2, 2, 0] } : {}}
      whileTap={achievement.unlocked ? { scale: 0.95 } : {}}
      className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-all ${
        achievement.unlocked
          ? `${getBadgeGradient(achievement.color, true)} shadow-sm`
          : "bg-secondary/50 border-border opacity-50"
      }`}
    >
      <div className="relative">
        <span className={`text-3xl ${achievement.unlocked ? "" : "grayscale opacity-40"}`}>
          {achievement.emoji}
        </span>
        {!achievement.unlocked && (
          <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-muted p-0.5">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
      <div>
        <p className={`text-[11px] font-bold leading-tight ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
          {achievement.title}
        </p>
        <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{achievement.description}</p>
      </div>
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-duo-green text-[10px] shadow-sm"
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}

export function AchievementsSection({ achievements }: { achievements: Achievement[] }) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-foreground">Achievements 🏆</h3>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {unlocked}/{achievements.length} unlocked
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--duo-green)), hsl(var(--duo-cyan)))" }}
          initial={{ width: 0 }}
          animate={{ width: `${(unlocked / achievements.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {achievements.map((a, i) => (
          <AchievementBadge key={a.id} achievement={a} index={i} />
        ))}
      </div>
    </div>
  );
}
