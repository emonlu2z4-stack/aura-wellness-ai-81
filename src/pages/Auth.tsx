import { Flame, Loader2, Sparkles } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Auth() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Fun background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-duo-green/15 blur-[80px]" />
        <div className="absolute top-1/3 -left-20 h-48 w-48 rounded-full bg-duo-blue/15 blur-[70px]" />
        <div className="absolute bottom-20 right-10 h-40 w-40 rounded-full bg-duo-orange/15 blur-[60px]" />
        <div className="absolute bottom-40 left-1/3 h-32 w-32 rounded-full bg-duo-purple/10 blur-[50px]" />
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo & Mascot area */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="h-20 w-20 rounded-3xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Flame className="h-10 w-10 text-primary-foreground" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-duo-orange flex items-center justify-center shadow-md"
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="font-display text-3xl font-bold text-foreground">AI Wellness Coach</h1>
            <p className="mt-2 text-base font-semibold text-muted-foreground">Your health. Your pace. Your way. 🌟</p>
          </motion.div>
        </motion.div>

        {/* Feature preview chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {["📸 Photo Tracking", "🔥 Streaks", "📊 Progress", "👥 Groups"].map((f, i) => (
            <motion.span
              key={f}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300 }}
              className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground"
            >
              {f}
            </motion.span>
          ))}
        </motion.div>

        {/* Sign in card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card-elevated space-y-5 p-6"
        >
          <div className="text-center">
            <h2 className="font-display text-xl font-bold">Let's Go! 🚀</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to start your wellness journey</p>
          </div>

          <Button
            variant="outline"
            className="w-full gap-3 font-bold py-6 text-base rounded-xl border-2 btn-bounce hover:bg-secondary/50"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) toast.error(error.message || "Sign in failed. Please try again.");
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground/60"
        >
          Free forever · No credit card needed
        </motion.p>
      </div>
    </div>
  );
}
