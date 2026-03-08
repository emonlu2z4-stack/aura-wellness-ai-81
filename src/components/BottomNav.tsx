import { Home, TrendingUp, Users, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const tabs = [
  { icon: Home, label: "Home", path: "/", color: "text-duo-green" },
  { icon: TrendingUp, label: "Progress", path: "/progress", color: "text-duo-blue" },
  { icon: Users, label: "Groups", path: "/groups", color: "text-duo-purple" },
  { icon: User, label: "Profile", path: "/profile", color: "text-duo-orange" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-card safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ icon: Icon, label, path, color }) => {
          const active = location.pathname === path;
          return (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              whileTap={{ scale: 0.85 }}
              className={cn(
                "flex flex-col items-center gap-0.5 min-w-[56px] min-h-[48px] justify-center px-4 py-2 text-xs rounded-xl transition-colors",
                active ? color : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", active && "stroke-[2.5px]")} />
                {active && (
                  <motion.div
                    layoutId="nav-dot"
                    className={cn("absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full", 
                      color === "text-duo-green" ? "bg-duo-green" :
                      color === "text-duo-blue" ? "bg-duo-blue" :
                      color === "text-duo-purple" ? "bg-duo-purple" :
                      "bg-duo-orange"
                    )}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </div>
              <span className={cn("font-bold text-[11px]", active && "font-extrabold")}>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
