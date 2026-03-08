import { Home, TrendingUp, Users, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Progress", path: "/progress" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[56px] min-h-[48px] justify-center px-4 py-2 text-xs rounded-xl transition-colors active:scale-95 active:bg-secondary/50",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6", active && "drop-shadow-[0_0_8px_hsl(0,0%,85%)]")} />
              <span className="font-medium text-[11px]">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
