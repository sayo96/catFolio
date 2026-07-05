import { api } from './client';
import { getSubId } from '../utils/subId';

export const VOTE_UP = 1;
export const VOTE_DOWN = -1;

export async function listVotes() {
  const subId = await getSubId();
  const { data } = await api.get('/votes', {
    params: { sub_id: subId, limit: 100 },
  });
  return data;
}

export async function castVote(imageId, value) {
  const subId = await getSubId();
  const { data } = await api.post('/votes', {
    image_id: imageId,
    value,
    sub_id: subId,
  });
  return data;
}
