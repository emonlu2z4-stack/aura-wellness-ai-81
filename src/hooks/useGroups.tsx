import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useMyGroups() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-groups", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: memberships, error: memErr } = await supabase
        .from("group_members")
        .select("group_id, role")
        .eq("user_id", user.id);
      if (memErr) throw memErr;
      if (!memberships?.length) return [];

      const groupIds = memberships.map((m) => m.group_id);
      const { data: groups, error: grpErr } = await supabase
        .from("groups")
        .select("*")
        .in("id", groupIds);
      if (grpErr) throw grpErr;

      return (groups ?? []).map((g) => ({
        ...g,
        myRole: memberships.find((m) => m.group_id === g.id)?.role ?? "member",
      }));
    },
    enabled: !!user,
  });
}

export function useCreateGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: group, error: grpErr } = await supabase
        .from("groups")
        .insert({ name, description: description || "", created_by: user.id })
        .select()
        .single();
      if (grpErr) throw grpErr;

      const { error: memErr } = await supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: user.id, role: "admin" });
      if (memErr) throw memErr;

      return group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-groups"] }),
  });
}

export function useJoinGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error("Not authenticated");
      const { data: group, error: grpErr } = await supabase
        .from("groups")
        .select("id, name")
        .eq("invite_code", inviteCode.trim().toLowerCase())
        .single();
      if (grpErr || !group) throw new Error("Invalid invite code. Please check and try again.");

      const { error: memErr } = await supabase
        .from("group_members")
        .insert({ group_id: group.id, user_id: user.id, role: "member" });
      if (memErr) {
        if (memErr.code === "23505") throw new Error("You're already a member of this group!");
        throw memErr;
      }

      return group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-groups"] }),
  });
}

export function useLeaveGroup() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-groups"] }),
  });
}
