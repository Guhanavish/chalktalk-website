import { getLatestRelease } from '@/lib/supabase';

/** Backup version endpoint for the app updater (primary path is Supabase direct).
 *  Always answers JSON fast — never hangs, never throws HTML. */
export async function GET() {
  try {
    const rel = await getLatestRelease();
    if (!rel) {
      return Response.json({ error: 'no-releases' }, { status: 503 });
    }
    return Response.json(
      { version: rel.version, notes: rel.notes, zip_url: rel.zip_url, sha256: rel.sha256, size_bytes: rel.size_bytes },
      { headers: { 'Cache-Control': 'public, max-age=300' } }
    );
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503 });
  }
}
