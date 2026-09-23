'use client';

import { motion } from 'motion/react';

/**
 * Library stats in the Bklit visual language (bklit.com): theme vars,
 * rounded bars, grow enter animation with stagger, grid + value labels.
 * (Hand-built on SVG so the static site never depends on a chart runtime.)
 */
export default function StatCharts({ files }) {
  const kinds = [
    { name: 'Notes', key: 'notes', fill: 'var(--chart-1)' },
    { name: 'PDF', key: 'pdf', fill: 'var(--chart-2)' },
    { name: 'PowerPoint', key: 'ppt', fill: 'var(--chart-3)' }
  ].map((k) => ({ ...k, value: (files || []).filter((f) => f.kind === k.key).length }));
  const max = Math.max(1, ...kinds.map((k) => k.value));
  const totalBytes = (files || []).reduce((n, f) => n + (f.size_bytes || 0), 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
      <div className="u-card" style={{ padding: 22 }}>
        <h4 style={{ margin: '0 0 4px' }}>Library by type</h4>
        <p className="muted small" style={{ margin: '0 0 14px' }}>{(files || []).length} files shared from the app</p>
        <svg viewBox="0 0 320 190" style={{ width: '100%', height: 'auto' }} role="img" aria-label="Files by type">
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1="34" x2="314" y1={20 + g * 44} y2={20 + g * 44}
              stroke="var(--chart-grid)" strokeWidth="1" />
          ))}
          {kinds.map((k, i) => {
            const h = Math.max(k.value ? 14 : 3, (150 * k.value) / max);
            const x = 52 + i * 92, y = 168 - h;
            return (
              <g key={k.key}>
                <motion.rect
                  x={x} width={56} rx={9}
                  initial={{ y: 168, height: 0 }}
                  whileInView={{ y, height: h }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease: [0.85, 0, 0.15, 1] }}
                  fill={k.fill}
                />
                <text x={x + 28} y={184} textAnchor="middle" fontSize="12" fill="var(--chart-foreground-muted)">{k.name}</text>
                <text x={x + 28} y={y - 8} textAnchor="middle" fontSize="14" fontWeight="800" fill="var(--chart-foreground)">{k.value}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="u-card" style={{ padding: 22 }}>
        <h4 style={{ margin: '0 0 4px' }}>Storage used</h4>
        <p className="muted small" style={{ margin: '0 0 14px' }}>Supabase bucket usage</p>
        <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--navy)' }}>
          {(totalBytes / 1048576).toFixed(1)}<span style={{ fontSize: 18, color: 'var(--faint)' }}> MB</span>
        </div>
        <div style={{ height: 12, borderRadius: 7, background: '#eef2f7', marginTop: 14, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, Math.max(3, (totalBytes / (1024 * 1024 * 1024)) * 100))}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.85, 0, 0.15, 1] }}
            style={{ height: '100%', borderRadius: 7, background: 'var(--chart-1)' }}
          />
        </div>
        <p className="muted small" style={{ margin: '10px 0 0' }}>of the free 1 GB Supabase storage</p>
      </div>
    </div>
  );
}
