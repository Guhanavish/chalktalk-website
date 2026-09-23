'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { formatBytes, formatDate } from '@/lib/site';

/** Big download card with motion press/hover physics. */
export function DownloadCard({ release }) {
  const [busy, setBusy] = useState(false);
  if (!release) {
    return (
      <div className="u-card" style={{ padding: 28 }}>
        <h3 style={{ margin: '0 0 8px' }}>Windows app</h3>
        <div className="notice">No release published yet. Publish one from Supabase (see SETUP.md) and it appears here automatically.</div>
      </div>
    );
  }
  const mb = release.size_bytes ? formatBytes(release.size_bytes) : '';
  return (
    <div className="u-card glow-border" style={{ padding: 28 }}>
      <span className="badge">Windows 64-bit · single .exe in a zip</span>
      <h3 style={{ margin: '12px 0 6px', fontSize: 24 }}>ChalkTalk {release.version}</h3>
      <p className="muted" style={{ margin: '0 0 6px' }}>
        {[mb, release.sha256 ? `SHA ✓ ${String(release.sha256).slice(0, 12)}…` : null,
          release.created_at ? formatDate(release.created_at) : null].filter(Boolean).join('  ·  ')}
      </p>
      {release.notes ? <p style={{ margin: '0 0 18px' }}>{release.notes}</p> : null}
      <motion.a
        href={release.zip_url}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => { setBusy(true); setTimeout(() => setBusy(false), 4000); }}
        className="u-btn primary sheen"
        style={{ textDecoration: 'none', fontSize: 17 }}
      >
        {busy ? 'Downloading…' : '⬇ Download ChalkTalk'}
      </motion.a>
      <p className="muted small" style={{ margin: '12px 0 0' }}>
        Zip contains only the app .exe — extract and double-click. No install, no admin.
      </p>
    </div>
  );
}
