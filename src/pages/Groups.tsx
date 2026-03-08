import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Users, Plus, UserPlus, Copy, LogOut, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMyGroups, useCreateGroup, useJoinGroup, useLeaveGroup } from "@/hooks/useGroups";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

function CreateGroupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createGroup = useCreateGroup();

  const handleCreate = async () => {
    if (!name.trim()) { toast.error("Please enter a group name"); return; }
    try {
      const group = await createGroup.mutateAsync({ name: name.trim(), description: description.trim() });
      toast.success(`Group "${group.name}" created! 🎉`);
      setName(""); setDescription(""); setOpen(false);
    } catch (err: any) { toast.error(err.message || "Failed to create group"); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary text-primary-foreground font-bold rounded-full btn-bounce"><Plus className="h-4 w-4" /> Create Group</Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm">
        <DialogHeader><DialogTitle className="font-display">Create a Group 👥</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Group Name</Label><Input placeholder="e.g. Fitness Squad 💪" value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Description (optional)</Label><Input placeholder="What's this group about?" value={description} onChange={e => setDescription(e.target.value)} /></div>
          <Button onClick={handleCreate} disabled={createGroup.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
            {createGroup.isPending ? "Creating..." : "Create Group ✅"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JoinGroupDialog() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const joinGroup = useJoinGroup();

  const handleJoin = async () => {
    if (!code.trim()) { toast.error("Please enter an invite code"); return; }
    try {
      const group = await joinGroup.mutateAsync(code.trim());
      toast.success(`Joined "${group.name}"! 🎉`);
      setCode(""); setOpen(false);
    } catch (err: any) { toast.error(err.message || "Failed to join group"); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 font-bold rounded-full border-2 btn-bounce"><UserPlus className="h-4 w-4" /> Join</Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-2 border-border max-w-sm">
        <DialogHeader><DialogTitle className="font-display">Join a Group 🤝</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Invite Code</Label><Input placeholder="Enter 8-character code" value={code} onChange={e => setCode(e.target.value)} maxLength={8} className="font-mono tracking-widest text-center text-lg" /></div>
          <p className="text-xs text-muted-foreground text-center font-semibold">Ask a friend to share their group's invite code</p>
          <Button onClick={handleJoin} disabled={joinGroup.isPending} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl btn-bounce">
            {joinGroup.isPending ? "Joining..." : "Join Group ✅"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GroupCard({ group, onLeave }: { group: any; onLeave: (id: string) => void }) {
  const [showCode, setShowCode] = useState(false);
  const copyInviteCode = () => { navigator.clipboard.writeText(group.invite_code); toast.success("Invite code copied! 📋"); };
  const shareInvite = async () => {
    const text = `Join my wellness group "${group.name}" on AI Wellness Coach! 🔥 Use invite code: ${group.invite_code}`;
    if (navigator.share) { try { await navigator.share({ title: "Join my group", text }); } catch { copyInviteCode(); } } else { copyInviteCode(); }
  };

  const colors = ["bg-duo-green", "bg-duo-blue", "bg-duo-purple", "bg-duo-orange", "bg-duo-pink"];
  const colorClass = colors[group.name.length % colors.length];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-elevated p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`h-12 w-12 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <Users className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold truncate text-foreground">{group.name}</p>
          {group.description && <p className="text-xs font-semibold text-muted-foreground truncate">{group.description}</p>}
          <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 mt-0.5">
            {group.myRole === "admin" ? "👑 Admin" : "👤 Member"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setShowCode(!showCode)} className="flex-1 text-left text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          Invite code: {showCode ? <span className="font-mono tracking-widest text-foreground">{group.invite_code}</span> : <span className="text-muted-foreground/50">tap to reveal</span>}
        </button>
        <button onClick={copyInviteCode} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors btn-bounce"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        <button onClick={shareInvite} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors btn-bounce"><Share2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
        <button onClick={() => onLeave(group.id)} className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors btn-bounce"><LogOut className="h-3.5 w-3.5 text-destructive" /></button>
      </div>
    </motion.div>
  );
}

export default function Groups() {
  const { user } = useAuth();
  const { data: groups = [], isLoading } = useMyGroups();
  const leaveGroup = useLeaveGroup();

  const handleLeave = async (groupId: string) => {
    try { await leaveGroup.mutateAsync(groupId); toast.success("Left the group"); }
    catch (err: any) { toast.error(err.message || "Failed to leave group"); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-duo-purple/10 blur-[80px]" />
        <div className="absolute bottom-40 -left-32 h-48 w-48 rounded-full bg-duo-green/10 blur-[60px]" />
      </div>
      <div className="relative mx-auto max-w-md space-y-5 p-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pt-3 font-display text-2xl font-bold text-foreground">
          Groups 👥
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-3">
          <CreateGroupDialog />
          <JoinGroupDialog />
        </motion.div>
        {isLoading ? (
          <div className="glass-card flex items-center justify-center py-12">
            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-sm font-bold text-muted-foreground">
              Loading groups... 🔄
            </motion.p>
          </div>
        ) : groups.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card-elevated flex flex-col items-center gap-3 py-10 text-center">
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">
              👥
            </motion.div>
            <div>
              <p className="font-display font-bold text-foreground">No groups yet</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">Create a group or join one with an invite code</p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">{groups.map((group) => <GroupCard key={group.id} group={group} onLeave={handleLeave} />)}</div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
