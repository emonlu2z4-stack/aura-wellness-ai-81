import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { Confetti } from "@/components/Confetti";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const GOAL = 8;

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function useWaterIntake() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["water-intake", user?.id, getToday()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_intake")
        .select("*")
        .eq("date", getToday())
        .maybeSingle();
      if (error) throw error;
      return data?.glasses ?? 0;
    },
    enabled: !!user,
    staleTime: 0,
  });
}

function useUpdateWater() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newGlasses: number) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("water_intake")
        .upsert(
          { user_id: user.id, date: getToday(), glasses: newGlasses, updated_at: new Date().toISOString() },
          { onConflict: "user_id,date" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-intake"] });
    },
  });
}

export function WaterTracker() {
  const { data: dbGlasses = 0, isLoading } = useWaterIntake();
  const updateWater = useUpdateWater();
  const [glasses, setGlasses] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevGlassesRef = useRef(0);
  const initializedRef = useRef(false);

  // Sync from DB on load
  useEffect(() => {
    if (!isLoading && !initializedRef.current) {
      setGlasses(dbGlasses);
      prevGlassesRef.current = dbGlasses;
      initializedRef.current = true;
    }
  }, [dbGlasses, isLoading]);

  const pct = Math.min((glasses / GOAL) * 100, 100);

  useEffect(() => {
    if (prevGlassesRef.current < GOAL && glasses >= GOAL) {
      setShowConfetti(true);
    }
    prevGlassesRef.current = glasses;
  }, [glasses]);

  const persistGlasses = useCallback((newGlasses: number) => {
    setGlasses(newGlasses);
    updateWater.mutate(newGlasses);
  }, [updateWater]);

  const add = () => {
    if (glasses >= GOAL) return;
    const next = glasses + 1;
    persistGlasses(next);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const remove = () => {
    if (glasses <= 0) return;
    persistGlasses(glasses - 1);
  };

  return (
    <div className="glass-card-elevated p-4 relative">
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="h-4 w-4 text-duo-blue" />
        <h3 className="font-display text-sm font-bold text-foreground">Water Intake</h3>
        <span className="ml-auto text-xs font-bold text-muted-foreground">
          {glasses}/{GOAL} glasses 💧
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Glass SVG */}
        <motion.button
          onClick={add}
          whileTap={{ scale: 0.9 }}
          className="relative flex-shrink-0 cursor-pointer"
          aria-label="Add one glass of water"
        >
          <svg width="56" height="76" viewBox="0 0 56 76" fill="none">
            <path
              d="M8 8 L4 68 C4 72 8 76 14 76 L42 76 C48 76 52 72 52 68 L48 8 Z"
              className="stroke-duo-blue/30"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <clipPath id="glass-clip">
                <path d="M8 8 L4 68 C4 72 8 76 14 76 L42 76 C48 76 52 72 52 68 L48 8 Z" />
              </clipPath>
            </defs>
            <motion.rect
              x="0"
              width="56"
              clipPath="url(#glass-clip)"
              className="fill-duo-blue/25"
              initial={false}
              animate={{ y: 76 - (pct / 100) * 68, height: (pct / 100) * 68 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
            <motion.g clipPath="url(#glass-clip)" initial={false} animate={{ y: 76 - (pct / 100) * 68 }}>
              <motion.path
                d="M0 4 Q7 0 14 4 Q21 8 28 4 Q35 0 42 4 Q49 8 56 4 L56 12 L0 12 Z"
                className="fill-duo-blue/40"
                animate={{ x: [0, -14, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
            <rect x="6" y="4" width="44" height="4" rx="2" className="fill-duo-blue/20" />
          </svg>

          <AnimatePresence>
            {justAdded && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="h-8 w-8 rounded-full bg-duo-blue/30" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Progress bar + buttons */}
        <div className="flex-1 space-y-3">
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, hsl(var(--duo-cyan)), hsl(var(--duo-blue)))`,
              }}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground">
              {(glasses * 250)}ml / {GOAL * 250}ml
            </p>
            {glasses >= GOAL && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs font-bold text-duo-green"
              >
                Goal reached! 🎉
              </motion.span>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={remove}
              disabled={glasses <= 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-foreground text-xs font-bold btn-bounce disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-3 w-3" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={add}
              disabled={glasses >= GOAL}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-duo-blue/15 text-duo-blue text-xs font-bold btn-bounce disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-3 w-3" />
              <span>250ml</span>
              💧
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
