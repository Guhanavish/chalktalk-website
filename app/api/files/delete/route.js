import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

/* Delete a library file. Same gate as the app's upload:
 * sha256("username:password") must equal the shared WEB_AUTH_HASH.
 * Deletion itself uses the service key (server only, bypasses RLS). */
const WEB_AUTH_HASH =
  '73abc298d155f9cbe2af4811d9e975a859de7ec8104da476cd490f4644248597';

function authed(username, password) {
  if (!username || !password) return false;
  const sum = crypto
    .createHash('sha256')
    .update(`${String(username).trim()}:${String(password)}`)
    .digest();
  const want = Buffer.from(WEB_AUTH_HASH, 'hex');
  return sum.length === want.length && crypto.timingSafeEqual(sum, want);
}

export async function POST(req) {
  try {
    const { id, username, password } = await req.json();
    if (!authed(username, password)) {
      return Response.json({ error: 'Wrong username or password.' }, { status: 401 });
    }
    if (!id) {
      return Response.json({ error: 'Missing file id.' }, { status: 400 });
    }
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      return Response.json({ error: 'Delete is not configured on the server yet.' }, { status: 503 });
    }
    const sb = createClient(url, key);
    const { data: row, error: readErr } = await sb
      .from('shared_files')
      .select('id,storage_path')
      .eq('id', id)
      .single();
    if (readErr || !row) {
      return Response.json({ error: 'File not found.' }, { status: 404 });
    }
    if (row.storage_path) {
      const { error: storErr } = await sb.storage.from('chalktalk').remove([row.storage_path]);
      if (storErr) {
        return Response.json({ error: 'Could not delete the file data.' }, { status: 500 });
      }
    }
    const { error: delErr } = await sb.from('shared_files').delete().eq('id', id);
    if (delErr) {
      return Response.json({ error: 'Could not delete the listing.' }, { status: 500 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Delete failed.' }, { status: 500 });
  }
}
