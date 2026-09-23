import { createClient } from '@supabase/supabase-js';

let client = null;

/** Build-safe Supabase client: null when env is missing (pages degrade gracefully). */
export function supa() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

export function publicFileUrl(storagePath) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
  if (!url || !storagePath) return null;
  return `${url}/storage/v1/object/public/chalktalk/${storagePath}`;
}

export async function getLatestRelease() {
  try {
    const sb = supa();
    if (!sb) return null;
    const { data, error } = await sb
      .from('releases')
      .select('version,notes,zip_url,sha256,size_bytes,created_at')
      .order('created_at', { ascending: false })
      .limit(1);
    if (error || !data || !data.length) return null;
    return data[0];
  } catch {
    return null;
  }
}

export async function listSharedFiles(limit = 100) {
  try {
    const sb = supa();
    if (!sb) return [];
    const { data, error } = await sb
      .from('shared_files')
      .select('id,name,kind,size_bytes,storage_path,created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((r) => ({ ...r, url: publicFileUrl(r.storage_path) }));
  } catch {
    return [];
  }
}
