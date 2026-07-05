export const API_BASE = 'https://api.thecatapi.com/v1';

export const API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY ?? '';

export const hasApiKey = API_KEY.trim().length > 0;

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
