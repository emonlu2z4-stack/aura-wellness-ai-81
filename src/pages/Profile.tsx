import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Target, Scale, History, Share2, LogOut, Crown, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SETTINGS = [
  { icon: User, label: "Personal details", path: "/settings/personal", emoji: "👤" },
  { icon: Target, label: "Macronutrients", path: "/settings/macros", emoji: "🎯" },
  { icon: Scale, label: "Goal & weight", path: "/settings/goal", emoji: "⚖️" },
  { icon: History, label: "Weight history", path: "/settings/weight-history", emoji: "📋" },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-duo-orange/10 blur-[80px]" />
        <div className="absolute bottom-40 left-10 h-48 w-48 rounded-full bg-duo-purple/10 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-4 p-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-2 font-display text-2xl font-bold text-foreground">
          Profile 👤
        </motion.h1>

        {/* User card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card flex items-center gap-4 p-5">
          <motion.div whileTap={{ scale: 0.9 }} className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-primary/20">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              {(profile?.name?.[0] || "W").toUpperCase()}
            </span>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-display text-xl font-bold text-foreground">{profile?.name || "Wellness User"}</p>
            </div>
            {profile?.age && <p className="text-sm font-semibold text-muted-foreground">{profile.age} years old</p>}
            <p className="text-xs font-semibold text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>

        {/* Free tier badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="glass-card p-4 border-duo-yellow/30 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-duo-yellow/20 flex items-center justify-center">
            <Crown className="h-5 w-5 text-duo-yellow" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-foreground text-sm">Free Plan</p>
            <p className="text-xs text-muted-foreground font-semibold">Core features forever free! 🎉</p>
          </div>
        </motion.div>

        {/* Share / Invite */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={async () => {
            const text = "Join me on AI Wellness Coach — your AI-powered health companion! 🔥 Download now at " + window.location.origin;
            if (navigator.share) {
              try { await navigator.share({ title: "AI Wellness Coach", text }); }
              catch { navigator.clipboard.writeText(text); toast.success("Invite link copied! 📋"); }
            } else { navigator.clipboard.writeText(text); toast.success("Invite link copied! 📋"); }
          }}
          className="glass-card p-4 gradient-fun w-full text-left btn-bounce"
        >
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-white" />
            <div>
              <p className="font-display font-bold text-white">Invite Friends 🎁</p>
              <p className="text-xs text-white/80 font-semibold">Share the wellness journey</p>
            </div>
          </div>
        </motion.button>

        {/* Settings list */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card divide-y-2 divide-border/50 overflow-hidden">
          {SETTINGS.map(({ icon: Icon, label, path, emoji }, i) => (
            <motion.button
              key={label}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/50 btn-bounce"
            >
              <span className="text-lg">{emoji}</span>
              <span className="flex-1 text-sm font-bold text-foreground">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </motion.button>
          ))}
        </motion.div>

        <Button variant="outline" onClick={handleSignOut}
          className="w-full gap-2 text-destructive border-2 border-destructive/30 hover:bg-destructive/10 font-bold rounded-xl btn-bounce">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
