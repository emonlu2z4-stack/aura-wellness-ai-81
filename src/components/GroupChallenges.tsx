import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Plus, UserCheck, UserPlus, ChevronDown, ChevronUp,
  Trophy, CheckCircle2, Crown, Medal, Award, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  useGroupChallenges,
  useCreateChallenge,
  useJoinChallenge,
  useLeaveChallenge,
  useCheckin,
  useLeaderboard,
  CHALLENGE_PRESETS,
  type LeaderboardEntry,
} from "@/hooks/useChallenges";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

function CreateChallengeDialog({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("🏆");
  const [days, setDays] = useState(7);
  const createChallenge = useCreateChallenge();

  const pickPreset = (preset: (typeof CHALLENGE_PRESETS)[number]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setEmoji(preset.emoji);
    setDays(preset.duration_days);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Enter a challenge title");
      return;
    }
    try {
      await createChallenge.mutateAsync({
        group_id: groupId,
        title: title.trim(),
        description: description.trim(),
        emoji,
        duration_days: days,
      });
      toast.success("Challenge started! 🔥");
      setTitle("");
      setDescription("");
      setEmoji("🏆");
      setDays(7);
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create challenge");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors btn-bounce">
          <Plus className="h-3.5 w-3.5" /> New Challenge
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Start a Challenge 🔥</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Quick Pick
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {CHALLENGE_PRESETS.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => pickPreset(preset)}
                  className={`text-left p-2.5 rounded-xl border-2 transition-all text-xs font-semibold ${
                    title === preset.title
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-base">{preset.emoji}</span>
                  <p className="mt-0.5 leading-tight">{preset.title}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Challenge name" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What's the challenge?" />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label>Duration (days)</Label>
                <Input type="number" min={1} max={90} value={days} onChange={(e) => setDays(Number(e.target.value))} />
              </div>
              <div className="w-20">
                <Label>Emoji</Label>
                <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="text-center text-lg" maxLength={2} />
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreate}
            disabled={createChallenge.isPending}
            className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce"
          >
            {createChallenge.isPending ? "Creating..." : "Start Challenge 🚀"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const rankIcons = [
  <Crown className="h-4 w-4 text-yellow-500" />,
  <Medal className="h-4 w-4 text-gray-400" />,
  <Award className="h-4 w-4 text-amber-600" />,
];

function LeaderboardDialog({ challengeId, title, emoji }: { challengeId: string; title: string; emoji: string }) {
  const [open, setOpen] = useState(false);
  const { data: entries = [], isLoading } = useLeaderboard(open ? challengeId : undefined);
  const { user } = useAuth();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors btn-bounce">
          <BarChart3 className="h-3 w-3" /> Leaderboard
        </button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-base">
            {emoji} {title}
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-semibold">Streak Leaderboard 🏆</p>
        </DialogHeader>
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <p className="text-xs text-muted-foreground text-center py-6">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No check-ins yet — be the first! ✅
            </p>
          ) : (
            entries.map((entry: LeaderboardEntry, i: number) => {
              const isMe = entry.user_id === user?.id;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                    isMe
                      ? "bg-primary/10 border-2 border-primary/30"
                      : "bg-secondary/40 border-2 border-transparent"
                  }`}
                >
                  <div className="w-6 flex-shrink-0 flex justify-center">
                    {i < 3 ? (
                      rankIcons[i]
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${isMe ? "text-primary" : "text-foreground"}`}>
                      {entry.name} {isMe && "(You)"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      {entry.totalCheckins} total check-in{entry.totalCheckins !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1">
                      <Flame className={`h-3.5 w-3.5 ${entry.currentStreak > 0 ? "text-orange-500" : "text-muted-foreground/40"}`} />
                      <span className={`text-sm font-bold ${entry.currentStreak > 0 ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {entry.currentStreak}
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-foreground font-semibold">day streak</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChallengeCard({
  challenge,
  groupId,
}: {
  challenge: any;
  groupId: string;
}) {
  const joinChallenge = useJoinChallenge();
  const leaveChallenge = useLeaveChallenge();
  const { checkedInToday, checkin } = useCheckin(challenge.hasJoined && challenge.isActive ? challenge.id : undefined);

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / 86400000)
  );

  const handleToggle = async () => {
    try {
      if (challenge.hasJoined) {
        await leaveChallenge.mutateAsync({ challengeId: challenge.id, groupId });
        toast.success("Left the challenge");
      } else {
        await joinChallenge.mutateAsync({ challengeId: challenge.id, groupId });
        toast.success("Joined the challenge! 💪");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const handleCheckin = async () => {
    try {
      await checkin.mutateAsync();
      toast.success("Checked in! 🔥 Keep it up!");
    } catch (err: any) {
      toast.error(err.message || "Failed to check in");
    }
  };

  const isPending = joinChallenge.isPending || leaveChallenge.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-3 rounded-xl border-2 transition-colors ${
        challenge.isActive
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/30 opacity-70"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0 mt-0.5">{challenge.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-foreground truncate">{challenge.title}</p>
            {!challenge.isActive && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
                Ended
              </span>
            )}
          </div>
          {challenge.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{challenge.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> {challenge.participantCount} joined
            </span>
            {challenge.isActive && (
              <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                <Flame className="h-3 w-3" /> {daysLeft}d left
              </span>
            )}
            <LeaderboardDialog challengeId={challenge.id} title={challenge.title} emoji={challenge.emoji} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {challenge.isActive && (
            <button
              onClick={handleToggle}
              disabled={isPending}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all btn-bounce ${
                challenge.hasJoined
                  ? "bg-primary/15 text-primary border-2 border-primary/30"
                  : "gradient-primary text-primary-foreground"
              }`}
            >
              {challenge.hasJoined ? (
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" /> Joined
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <UserPlus className="h-3 w-3" /> Join
                </span>
              )}
            </button>
          )}
          {challenge.hasJoined && challenge.isActive && (
            <button
              onClick={handleCheckin}
              disabled={checkedInToday || checkin.isPending}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all btn-bounce ${
                checkedInToday
                  ? "bg-duo-green/15 text-duo-green border-2 border-duo-green/30"
                  : "bg-foreground text-background hover:bg-foreground/90"
              }`}
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {checkedInToday ? "Done ✓" : "Check in"}
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function GroupChallenges({ groupId }: { groupId: string }) {
  const [expanded, setExpanded] = useState(false);
  const { data: challenges = [], isLoading } = useGroupChallenges(groupId);

  return (
    <div className="space-y-2 pt-1">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <Trophy className="h-3.5 w-3.5" />
          Challenges ({challenges.length})
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
        <CreateChallengeDialog groupId={groupId} />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {isLoading ? (
              <p className="text-xs text-muted-foreground text-center py-3">Loading...</p>
            ) : challenges.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">
                No challenges yet — start one! 🔥
              </p>
            ) : (
              challenges.map((c: any) => (
                <ChallengeCard key={c.id} challenge={c} groupId={groupId} />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
