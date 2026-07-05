import * as ImagePicker from 'expo-image-picker';
import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES } from '../../constants/config';

export function toAsset(picked) {
  const name = picked.fileName || picked.uri.split('/').pop() || 'cat.jpg';
  const type =
    picked.mimeType ||
    (name.endsWith('.png') ? 'image/png' : name.endsWith('.gif') ? 'image/gif' : 'image/jpeg');
  return { uri: picked.uri, name, type, size: picked.fileSize };
}

export function validateAsset(asset) {
  if (!asset) return 'Please choose an image to upload.';
  if (!ACCEPTED_MIME_TYPES.includes(asset.type)) {
    return 'Only JPG, PNG or GIF images are supported.';
  }
  if (asset.size && asset.size > MAX_UPLOAD_BYTES) {
    return 'Please choose an image under 20 MB.';
  }
  return null;
}

export async function pickAsset() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('We need photo library access to pick an image.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });
  if (result.canceled) return null;

  return toAsset(result.assets[0]);
}
