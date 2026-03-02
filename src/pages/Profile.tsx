import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Target, Scale, History, Share2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SETTINGS = [
  { icon: User, label: "Personal details", path: "/settings/personal" },
  { icon: Target, label: "Macronutrients", path: "/settings/macros" },
  { icon: Scale, label: "Goal & weight", path: "/settings/goal" },
  { icon: History, label: "Weight history", path: "/settings/weight-history" },
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
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-md space-y-4 p-4">
        <h1 className="pt-2 font-display text-2xl font-bold">Profile</h1>

        <div className="glass-card glow-violet flex items-center gap-4 p-4">
          <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              {(profile?.name?.[0] || "W").toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-display text-xl font-bold">{profile?.name || "Wellness User"}</p>
            {profile?.age && <p className="text-sm text-muted-foreground">{profile.age} years old</p>}
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            const text = "Join me on AI Wellness Coach — your premium AI-powered health companion! Download now at " + window.location.origin;
            if (navigator.share) {
              try { await navigator.share({ title: "AI Wellness Coach", text }); }
              catch { navigator.clipboard.writeText(text); toast.success("Invite link copied to clipboard!"); }
            } else { navigator.clipboard.writeText(text); toast.success("Invite link copied to clipboard!"); }
          }}
          className="glass-card p-4 gradient-primary w-full text-left"
        >
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-primary-foreground" />
            <div>
              <p className="font-display font-semibold text-primary-foreground">Invite Friends</p>
              <p className="text-xs text-primary-foreground/80">Share the wellness journey</p>
            </div>
          </div>
        </button>

        <div className="glass-card divide-y divide-border/50">
          {SETTINGS.map(({ icon: Icon, label, path }) => (
            <button key={label} onClick={() => navigate(path)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/50">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={handleSignOut} className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
