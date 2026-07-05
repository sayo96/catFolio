import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteImage, listUploadedImages, uploadImage } from '../api/images';
import { queryKeys } from '../utils/queryKeys';
import { hasApiKey } from '../../constants/config';

export function useImages() {
  return useQuery({
    queryKey: queryKeys.images,
    queryFn: listUploadedImages,
    enabled: hasApiKey,
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteImage,
    onMutate: async (imageId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.images });
      const previous = queryClient.getQueryData(queryKeys.images);
      queryClient.setQueryData(queryKeys.images, (old = []) =>
        old.filter((image) => image.id !== imageId),
      );
      return { previous };
    },
    onError: (_error, _imageId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.images, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images });
    },
  });
}
