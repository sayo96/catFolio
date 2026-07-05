import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavourite, listFavourites, removeFavourite } from '../api/favourites';
import { queryKeys } from '../utils/queryKeys';
import { hasApiKey } from '../../constants/config';

export function useFavourites() {
  const query = useQuery({
    queryKey: queryKeys.favourites,
    queryFn: listFavourites,
    enabled: hasApiKey,
  });

  const byImage = useMemo(() => {
    const map = new Map();
    for (const fav of query.data ?? []) {
      map.set(fav.image_id, fav.id);
    }
    return map;
  }, [query.data]);

  return { ...query, byImage };
}

const isOptimisticId = (id) => typeof id === 'string' && id.startsWith('optimistic-');

export function useToggleFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, favouriteId }) => {
      if (isOptimisticId(favouriteId)) return Promise.resolve({ message: 'SUCCESS' });
      return favouriteId ? removeFavourite(favouriteId) : addFavourite(imageId);
    },

    onMutate: async ({ imageId, favouriteId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favourites });
      const previous = queryClient.getQueryData(queryKeys.favourites);

      queryClient.setQueryData(queryKeys.favourites, (old = []) =>
        favouriteId
          ? old.filter((fav) => fav.id !== favouriteId)
          : [...old, { id: `optimistic-${imageId}`, image_id: imageId }],
      );

      return { previous };
    },

    onSuccess: (data, { imageId, favouriteId }) => {
      if (!favouriteId && data?.id) {
        queryClient.setQueryData(queryKeys.favourites, (old = []) =>
          old.map((fav) => (fav.id === `optimistic-${imageId}` ? { ...fav, id: data.id } : fav)),
        );
      }
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.favourites, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favourites });
    },
  });
}
