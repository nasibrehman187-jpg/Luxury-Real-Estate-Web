import { createClient } from './client';

export const ALLOWED_PUBLIC_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'];
export const ALLOWED_PRIVATE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface UploadResult {
  path: string;
  url: string | null;
  error: string | null;
}

/**
 * Upload asset to Supabase Storage with server/client-side validation.
 */
export async function uploadMediaAsset(
  bucket: 'developments-media' | 'properties-media' | 'testimonials' | 'brochures' | 'floorplans',
  file: File,
  customPath?: string
): Promise<UploadResult> {
  const isPrivateBucket = bucket === 'brochures' || bucket === 'floorplans';
  const allowedTypes = isPrivateBucket ? ALLOWED_PRIVATE_TYPES : ALLOWED_PUBLIC_TYPES;

  if (!allowedTypes.includes(file.type)) {
    return { path: '', url: null, error: `Invalid file type (${file.type}). Allowed: ${allowedTypes.join(', ')}` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { path: '', url: null, error: `File size exceeds 25 MB limit.` };
  }

  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const filePath = customPath || `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (error) {
    return { path: '', url: null, error: error.message };
  }

  if (isPrivateBucket) {
    // For private buckets, get temporary signed URL
    const signedRes = await getSignedUrl(bucket, data.path, 3600);
    return { path: data.path, url: signedRes.url, error: signedRes.error };
  } else {
    // For public buckets, get public URL
    const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { path: data.path, url: pubData.publicUrl, error: null };
  }
}

/**
 * Generate a signed URL for private bucket access (e.g. brochures, floor plans).
 */
export async function getSignedUrl(
  bucket: 'brochures' | 'floorplans',
  path: string,
  expiresInSeconds = 3600
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);

    if (error) {
      return { url: null, error: error.message };
    }

    return { url: data.signedUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Failed to create signed URL' };
  }
}
