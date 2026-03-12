import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  Comment,
  EmojiType,
  LeaderboardEntry,
  PickupLine,
} from "../backend";
import { useActor } from "./useActor";

export function usePickupLines() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupLine[]>({
    queryKey: ["pickupLines"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getAllPickupLines();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: true, // Continue polling even when tab is not focused
    staleTime: 0, // Always consider data stale to ensure fresh data
    placeholderData: (previousData) => previousData, // Keep previous data during refetch to prevent flicker
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
}

export function useApprovedPickupLines() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupLine[]>({
    queryKey: ["approvedPickupLines"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getApprovedPickupLines();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    placeholderData: (previousData) => previousData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

export function useLineWithGuide(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<{ pickupLine: PickupLine; howToUse: string } | null>({
    queryKey: ["lineWithGuide", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getLineWithGuide(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitPickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      instagramUrl,
      username,
      category,
    }: {
      text: string;
      instagramUrl: string | null;
      username: string | null;
      category: Category;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitPickupLine(text, instagramUrl, username, category);
    },
    onSuccess: () => {
      // Immediately refetch the pickup lines instead of just invalidating
      queryClient.refetchQueries({ queryKey: ["pickupLines"] });
    },
  });
}

export function useReportPickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.reportPickupLine(id);
    },
    onSuccess: () => {
      // Immediately refetch the pickup lines instead of just invalidating
      queryClient.refetchQueries({ queryKey: ["pickupLines"] });
    },
  });
}

export function usePendingPickupLines() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupLine[]>({
    queryKey: ["pendingPickupLines"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getPendingPickupLines();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    placeholderData: (previousData) => previousData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}

export function useApprovePickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.approvePickupLine(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["pickupLines"] });
      queryClient.refetchQueries({ queryKey: ["pendingPickupLines"] });
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
    },
  });
}

export function useRejectPickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.rejectPickupLine(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["pickupLines"] });
      queryClient.refetchQueries({ queryKey: ["pendingPickupLines"] });
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
    },
  });
}

export function useLikePickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.likePickupLine(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
      queryClient.refetchQueries({ queryKey: ["rizzOfTheDay"] });
    },
  });
}

export function useDownvotePickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.downvotePickupLine(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
    },
  });
}

export function useRecordCopy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.recordCopy(id);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
    },
  });
}

export function useAddEmojiReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, emoji }: { id: bigint; emoji: EmojiType }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addEmojiReaction(id, emoji);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["approvedPickupLines"] });
    },
  });
}

export function useRizzOfTheDay() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupLine | null>({
    queryKey: ["rizzOfTheDay"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRizzOfTheDay();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
    staleTime: 15000,
  });
}

export function useComments(lineId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ["comments", lineId?.toString()],
    queryFn: async () => {
      if (!actor || lineId === null) return [];
      return actor.getComments(lineId);
    },
    enabled: !!actor && !isFetching && lineId !== null,
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

export function useSubmitComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lineId,
      text,
      username,
    }: { lineId: bigint; text: string; username: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitComment(lineId, text, username);
    },
    onSuccess: (_data, variables) => {
      queryClient.refetchQueries({
        queryKey: ["comments", variables.lineId.toString()],
      });
    },
  });
}
