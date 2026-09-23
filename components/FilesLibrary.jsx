'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes, formatDate, kindLabel } from '@/lib/site';

/** Library with kokonut-style sliding tab indicator + layout-animated rows. */
const TABS = [['all', 'All'], ['notes', 'Notes'], ['pdf', 'PDF'], ['ppt', 'PPT']];

export default function FilesLibrary({ files }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (files || []).filter((f) =>
      (tab === 'all' || f.kind === tab) &&
      (!needle || (f.name || '').toLowerCase().includes(needle)));
  }, [files, tab, q]);

  return (
    <div className="u-card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 6 }}>
        {TABS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              position: 'relative', padding: '9px 16px', borderRadius: 11, cursor: 'pointer',
              border: '1px solid transparent', background: 'transparent',
              color: tab === key ? '#fff' : 'var(--muted)', fontWeight: 800, fontSize: 14
            }}
          >
            {tab === key && (
              <motion.span
                layoutId="lib-tab"
                style={{ position: 'absolute', inset: 0, borderRadius: 11, background: 'var(--navy)' }}
                transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
              />
            )}
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…"
          style={{
            padding: '10px 14px', borderRadius: 11, border: '1px solid var(--line)',
            fontSize: 14, minWidth: 180, outline: 'none'
          }}
        />
      </div>
      {!rows.length ? (
        <p className="muted" style={{ padding: '18px 4px' }}>
          No files here yet. In the app, open the orb → File → <b>Web</b> and send notes, PDF or PPT.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="files">
            <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Sent</th><th></th></tr></thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((f) => (
                  <motion.tr
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <td style={{ fontWeight: 700 }}>{f.name}</td>
                    <td><span className={`kind ${f.kind || ''}`}>{kindLabel(f.kind)}</span></td>
                    <td className="muted">{formatBytes(f.size_bytes)}</td>
                    <td className="muted">{formatDate(f.created_at)}</td>
                    <td>
                      {f.url ? (
                        <motion.a
                          href={f.url} download={f.name}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}
                          className="u-btn" style={{ padding: '8px 16px', fontSize: 14, textDecoration: 'none' }}
                        >
                          Download
                        </motion.a>
                      ) : <span className="muted small">unavailable</span>}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
