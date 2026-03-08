import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { Confetti } from "@/components/Confetti";

const GOAL = 8;
const STORAGE_KEY = "water-tracker";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function loadGlasses(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const { date, glasses } = JSON.parse(raw);
    return date === getToday() ? glasses : 0;
  } catch {
    return 0;
  }
}

export function WaterTracker() {
  const [glasses, setGlasses] = useState(loadGlasses);
  const [justAdded, setJustAdded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevGlassesRef = useRef(glasses);
  const pct = Math.min((glasses / GOAL) * 100, 100);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getToday(), glasses }));
  }, [glasses]);

  const add = () => {
    if (glasses >= GOAL) return;
    setGlasses((g) => g + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);
  };

  const remove = () => {
    if (glasses <= 0) return;
    setGlasses((g) => g - 1);
  };

  return (
    <div className="glass-card-elevated p-4">
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
            {/* Glass outline */}
            <path
              d="M8 8 L4 68 C4 72 8 76 14 76 L42 76 C48 76 52 72 52 68 L48 8 Z"
              className="stroke-duo-blue/30"
              strokeWidth="2"
              fill="none"
            />
            {/* Glass fill area with clip */}
            <defs>
              <clipPath id="glass-clip">
                <path d="M8 8 L4 68 C4 72 8 76 14 76 L42 76 C48 76 52 72 52 68 L48 8 Z" />
              </clipPath>
            </defs>
            {/* Fill */}
            <motion.rect
              x="0"
              width="56"
              clipPath="url(#glass-clip)"
              className="fill-duo-blue/25"
              initial={false}
              animate={{ y: 76 - (pct / 100) * 68, height: (pct / 100) * 68 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            />
            {/* Wave overlay */}
            <motion.g clipPath="url(#glass-clip)" initial={false} animate={{ y: 76 - (pct / 100) * 68 }}>
              <motion.path
                d="M0 4 Q7 0 14 4 Q21 8 28 4 Q35 0 42 4 Q49 8 56 4 L56 12 L0 12 Z"
                className="fill-duo-blue/40"
                animate={{ x: [0, -14, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
            {/* Rim */}
            <rect x="6" y="4" width="44" height="4" rx="2" className="fill-duo-blue/20" />
          </svg>

          {/* Splash effect */}
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
          {/* Progress bar */}
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

          {/* Amount display */}
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

          {/* Quick-add buttons */}
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
