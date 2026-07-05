import { api } from './client';
import { getSubId } from '../utils/subId';

export async function listUploadedImages() {
  const { data } = await api.get('/images/', {
    params: { limit: 100, page: 0, order: 'DESC' },
  });
  return data;
}

export async function uploadImage(asset) {
  const subId = await getSubId();

  const form = new FormData();
  form.append('file', {
    uri: asset.uri,
    name: asset.name,
    type: asset.type,
  });
  form.append('sub_id', subId);

  const { data } = await api.post('/images/upload', form, { adapter: 'xhr' });
  return data;
}

export async function deleteImage(imageId) {
  const { data } = await api.delete(`/images/${imageId}`);
  return data;
}
