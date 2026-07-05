import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { castVote, listVotes } from '../api/votes';
import { scoresFromVotes } from '../utils/score';
import { queryKeys } from '../utils/queryKeys';
import { hasApiKey } from '../../constants/config';

export function useVotes() {
  const query = useQuery({
    queryKey: queryKeys.votes,
    queryFn: listVotes,
    enabled: hasApiKey,
  });

  const scores = useMemo(() => scoresFromVotes(query.data ?? []), [query.data]);

  return { ...query, scores };
}

export function useCastVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, value }) => castVote(imageId, value),

    onMutate: async ({ imageId, value }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.votes });
      const previous = queryClient.getQueryData(queryKeys.votes);

      queryClient.setQueryData(queryKeys.votes, (old = []) => [
        ...old.filter((vote) => vote.image_id !== imageId),
        {
          id: `optimistic-${imageId}`,
          image_id: imageId,
          value,
          created_at: new Date().toISOString(),
        },
      ]);

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.votes, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });
}
