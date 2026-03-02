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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2 pb-safe">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_hsl(252,87%,64%)]")} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
