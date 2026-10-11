import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase env vars missing — file uploads will be unavailable.');
}

export const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export const AVATAR_BUCKET = 'avatars';

/**
 * Upload a base64-encoded image to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadAvatar(base64DataUrl, userId) {
    if (!supabase) throw new Error('Supabase is not configured');

    // Strip the data URL prefix and detect mime type
    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error('Invalid image data');

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1] || 'webp';
    const buffer = Buffer.from(base64Data, 'base64');

    const filePath = `${userId}/avatar.${extension}`;

    const { error } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true,  // overwrite previous avatar
        });

    if (error) throw error;

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);
    // Append cache-buster so browser reloads the new image
    return `${data.publicUrl}?t=${Date.now()}`;
}
