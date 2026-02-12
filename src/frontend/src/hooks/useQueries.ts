import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PickupLine } from '../backend';

export function usePickupLines() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupLine[]>({
    queryKey: ['pickupLines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPickupLines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, instagramUrl }: { text: string; instagramUrl: string | null }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitPickupLine(text, instagramUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupLines'] });
    },
  });
}

export function useReportPickupLine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.reportPickupLine(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupLines'] });
    },
  });
}
