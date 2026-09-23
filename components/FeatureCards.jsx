'use client';

import Reveal from './Reveal';

/** Spotlight hover cards (react-bits spirit) + Lucide-style inline icons. */
const ICONS = {
  pen: <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" />,
  layers: <g><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></g>,
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .4-8.98 6 6 0 0 0-11.7 1.62A4 4 0 0 0 7 19h10.5z" />,
  refresh: <g><path d="M21 12a9 9 0 1 1-2.6-6.4" /><path d="M21 3v6h-6" /></g>,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />,
  shield: <path d="M12 2 4 5.5V11c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5.5z" />
};

const FEATURES = [
  ['pen', 'Zero-lag ink', 'Ball, brush and calligraphy pens plus a highlighter, drawn straight to the canvas with no waiting.'],
  ['layers', 'Infinite zoomable canvas', 'Blank slides grow as you teach. Pinch, wheel or button zoom from 15% to 800%, drag anywhere.'],
  ['cloud', 'Send to web', 'One tap sends notes, PDF or PPT to this website library for students to download.'],
  ['refresh', 'Auto-update', 'New versions replace themselves automatically with checksum verification.'],
  ['bolt', 'Runs on old PCs', 'Single 69 MB file, tuned for 4 GB RAM school laptops. No install, no admin.'],
  ['shield', 'Private notes format', 'Lessons save as .kbf files only ChalkTalk can open. PDF/PPT stay standard.']
];

function onSpot(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function FeatureCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
      {FEATURES.map(([icon, title, text], i) => (
        <Reveal key={title} delay={Math.min(i * 0.06, 0.3)}>
          <div className="u-card spot" onMouseMove={onSpot} style={{ padding: 22, height: '100%' }}>
            <span style={{
              display: 'inline-flex', width: 46, height: 46, borderRadius: 13,
              background: '#e9eff9', color: 'var(--navy)',
              alignItems: 'center', justifyContent: 'center', marginBottom: 12
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                {ICONS[icon]}
              </svg>
            </span>
            <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{title}</h3>
            <p className="muted" style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
