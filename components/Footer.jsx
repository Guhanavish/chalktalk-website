import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', marginTop: 72, background: '#fff' }}>
      <div className="wrap" style={{ padding: '28px 20px', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <strong style={{ color: 'var(--navy)' }}>ChalkTalk</strong>
        <span className="muted small">Smart classroom board for schools.</span>
        <span style={{ flex: 1 }} />
        <Link href="/download" className="muted small" style={{ textDecoration: 'none' }}>Download</Link>
        <Link href="/download" className="muted small" style={{ textDecoration: 'none' }}>Files library</Link>
      </div>
    </footer>
  );
}
