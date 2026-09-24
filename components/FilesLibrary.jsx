'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBytes, formatDate, kindLabel } from '@/lib/site';

/** Library with kokonut-style sliding tab indicator + layout-animated rows. */
const TABS = [['all', 'All'], ['notes', 'Notes'], ['pdf', 'PDF'], ['ppt', 'PPT']];

export default function FilesLibrary({ files }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const [items, setItems] = useState(files || []);
  const [pending, setPending] = useState(null); // file row awaiting delete confirm
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items || []).filter((f) =>
      (tab === 'all' || f.kind === tab) &&
      (!needle || (f.name || '').toLowerCase().includes(needle)));
  }, [items, tab, q]);

  function askDelete(f) {
    setPending(f);
    setUsername('');
    setPassword('');
    setAuthError('');
  }

  async function confirmDelete() {
    if (!pending || busy) return;
    setBusy(true);
    setAuthError('');
    try {
      const res = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pending.id, username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAuthError(data.error || 'Delete failed.');
        return;
      }
      setItems((prev) => prev.filter((f) => f.id !== pending.id));
      setPending(null);
    } catch {
      setAuthError('Network error — try again.');
    } finally {
      setBusy(false);
    }
  }

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
                      <button
                        onClick={() => askDelete(f)}
                        className="u-btn"
                        style={{
                          padding: '8px 16px', fontSize: 14, marginLeft: 8, cursor: 'pointer',
                          background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
      <AnimatePresence>
        {pending && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 60, display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.45)', padding: 16
            }}
            onClick={() => !busy && setPending(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 380 }}
            >
              <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>Delete this file?</h3>
              <p className="muted" style={{ margin: '0 0 16px', fontSize: 14 }}>
                {(pending && pending.name) || ''} will be removed for everyone. Enter the teacher login (same as app upload).
              </p>
              <input
                value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"
                autoComplete="username"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 11, border: '1px solid var(--line)', fontSize: 14, marginBottom: 10, outline: 'none' }}
              />
              <input
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"
                autoComplete="current-password" onKeyDown={(e) => { if (e.key === 'Enter') confirmDelete(); }}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 11, border: '1px solid var(--line)', fontSize: 14, outline: 'none' }}
              />
              {authError && <p style={{ color: '#dc2626', fontSize: 13, margin: '10px 0 0' }}>{authError}</p>}
              <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => !busy && setPending(null)}
                  className="u-btn" style={{ background: 'transparent', border: '1px solid var(--line)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete} disabled={busy}
                  className="u-btn" style={{ background: '#dc2626', color: '#fff', border: 'none', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}
                >
                  {busy ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
