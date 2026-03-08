import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "hsl(88, 68%, 40%)",   // duo-green
  "hsl(199, 89%, 52%)",  // duo-blue
  "hsl(33, 100%, 50%)",  // duo-orange
  "hsl(45, 100%, 55%)",  // duo-yellow
  "hsl(330, 85%, 60%)",  // duo-pink
  "hsl(272, 100%, 75%)", // duo-purple
  "hsl(180, 70%, 50%)",  // duo-cyan
];

const SHAPES = ["circle", "square", "triangle"] as const;

interface Particle {
  id: number;
  x: number;
  color: string;
  shape: typeof SHAPES[number];
  size: number;
  delay: number;
  rotation: number;
  xDrift: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 0.4,
    rotation: Math.random() * 360,
    xDrift: (Math.random() - 0.5) * 120,
  }));
}

function Shape({ shape, size, color }: { shape: string; size: number; color: string }) {
  if (shape === "circle") return <div style={{ width: size, height: size, borderRadius: "50%", background: color }} />;
  if (shape === "triangle")
    return (
      <div
        style={{
          width: 0, height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }}
      />
    );
  return <div style={{ width: size, height: size, background: color, borderRadius: 2 }} />;
}

export function Confetti({ active, onComplete }: { active: boolean; onComplete?: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles(40));
      const t = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(t);
    } else {
      setParticles([]);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{
                y: "110vh",
                x: `calc(${p.x}vw + ${p.xDrift}px)`,
                opacity: [1, 1, 0],
                rotate: p.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
              }}
              transition={{
                duration: 1.8 + Math.random() * 0.8,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute top-0"
            >
              <Shape shape={p.shape} size={p.size} color={p.color} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
