import { api } from './client';
import { getSubId } from '../utils/subId';

export async function listFavourites() {
  const subId = await getSubId();
  const { data } = await api.get('/favourites', {
    params: { sub_id: subId, limit: 100 },
  });
  return data;
}

export async function addFavourite(imageId) {
  const subId = await getSubId();
  const { data } = await api.post('/favourites', {
    image_id: imageId,
    sub_id: subId,
  });
  return data;
}

export async function removeFavourite(favouriteId) {
  const { data } = await api.delete(`/favourites/${favouriteId}`);
  return data;
}
