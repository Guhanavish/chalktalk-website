import Link from 'next/link';
import HeroFX, { SplitChars } from '@/components/HeroFX';
import Reveal from '@/components/Reveal';
import FeatureCards from '@/components/FeatureCards';
import { DownloadCard } from '@/components/DownloadCard';
import { getLatestRelease, listSharedFiles } from '@/lib/supabase';
import { formatBytes } from '@/lib/site';

export const revalidate = 300;

export default async function Home() {
  const [release, files] = await Promise.all([getLatestRelease(), listSharedFiles(200)]);
  const kinds = ['notes', 'pdf', 'ppt'].map((k) => ({
    k, n: files.filter((f) => f.kind === k).length
  }));

  return (
    <HeroFX>
      <div className="wrap">
        {/* HERO */}
        <section style={{ textAlign: 'center', padding: '72px 0 40px', position: 'relative', overflow: 'clip' }}>
          <span className="hx-blob" style={{ position: 'absolute', width: 280, height: 280, left: '-60px', top: 0, borderRadius: '50%', background: 'radial-gradient(circle, #dbe7ff, transparent 70%)' }} />
          <span className="hx-blob" style={{ position: 'absolute', width: 300, height: 300, right: '-70px', top: 60, borderRadius: '50%', background: 'radial-gradient(circle, #fdf0c2, transparent 70%)' }} />
          <div className="hx-rise"><span className="badge">Made for smart classrooms</span></div>
          <h1 className="hx-rise" style={{ fontSize: 'clamp(38px, 6vw, 64px)', lineHeight: 1.08, margin: '18px 0 10px', color: 'var(--navy)' }}>
            <SplitChars text="Teach on an" /> <br />
            <span className="shimmer"><SplitChars text="infinite board." /></span>
          </h1>
          <p className="hx-rise muted" style={{ fontSize: 19, maxWidth: 640, margin: '0 auto 26px', lineHeight: 1.6 }}>
            ChalkTalk turns any touch panel or old laptop into a classroom board —
            write on slides, PDFs and PowerPoints, then share everything with students.
          </p>
          <div className="hx-rise" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/download" className="u-btn primary sheen">⬇ Get the app</Link>
            <Link href="/download" className="u-btn">Browse class files</Link>
          </div>
          <div className="hx-rise" style={{ display: 'flex', gap: 26, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
            {[
              [release ? `v${release.version}` : 'v1.1.0', 'latest app'],
              [`${files.length}`, 'shared files'],
              ...kinds.map(({ k, n }) => [`${n}`, k.toUpperCase()])
            ].map(([v, l]) => (
              <span key={l} style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 26, fontWeight: 800, color: 'var(--navy)' }}>{v}</span>
                <span className="muted small">{l}</span>
              </span>
            ))}
          </div>
        </section>

        {/* APP SHOT (stylised board mock) */}
        <section className="hx-rise" style={{ margin: '10px 0 60px' }}>
          <div className="u-card glow-border" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: '#fff', borderBottom: '1px solid var(--line)', padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f5b301' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e4e7eb' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#e4e7eb' }} />
              <strong className="small" style={{ marginLeft: 8 }}>Class 10 — Photosynthesis.kbf</strong>
            </div>
            <svg viewBox="0 0 900 380" style={{ display: 'block', width: '100%', height: 'auto', background: '#fff' }}>
              <g stroke="#1e3a5f" strokeWidth="7" strokeLinecap="round" fill="none">
                <path d="M120 300 C 200 180, 260 260, 340 150 S 470 220, 560 130" />
              </g>
              <g stroke="#f5b301" strokeWidth="16" strokeLinecap="round" opacity="0.55" fill="none">
                <path d="M600 260 L 780 260" />
              </g>
              <g fontFamily="Segoe UI, Arial" fontSize="30" fill="#1e3a5f" fontWeight="700">
                <text x="600" y="200">Light + H₂O</text>
                <text x="600" y="235">→ Glucose</text>
              </g>
              <g stroke="#059669" strokeWidth="6" fill="none">
                <rect x="90" y="60" width="120" height="70" rx="10" />
                <circle cx="740" cy="100" r="26" />
              </g>
            </svg>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" style={{ marginBottom: 60 }}>
          <Reveal><h2 style={{ fontSize: 30, margin: '0 0 6px', color: 'var(--navy)' }}>Everything a classroom needs</h2></Reveal>
          <Reveal delay={0.08}><p className="muted" style={{ margin: '0 0 22px' }}>No training needed — teachers open it and teach.</p></Reveal>
          <FeatureCards />
        </section>

        {/* DOWNLOAD BAND */}
        <section style={{ marginBottom: 60 }}>
          <Reveal><DownloadCard release={release} /></Reveal>
        </section>

        {/* SETUP */}
        <section id="setup" style={{ marginBottom: 40 }}>
          <Reveal><h2 style={{ fontSize: 30, margin: '0 0 6px', color: 'var(--navy)' }}>Get running in minutes</h2></Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 18 }}>
            {[
              ['1. Download', 'Grab the zip. It contains only the app .exe — extract and double-click. No install, no admin.'],
              ['2. Teach', 'Open a PDF or PPT, write with the pen, zoom the infinite canvas, save .kbf notes.'],
              ['3. Share', 'In the app orb → File → Web: send notes, PDF or PPT here for students to download.']
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="u-card spot" style={{ padding: 20, height: '100%' }}>
                  <strong style={{ color: 'var(--navy)' }}>{t}</strong>
                  <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.6 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </HeroFX>
  );
}
