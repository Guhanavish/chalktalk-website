'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

/** Kokonut-style morphing nav pill + motion micro-interactions. */
export default function SiteNav() {
  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'sticky', top: 12, zIndex: 50 }}
    >
      <div className="wrap">
        <nav
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(14px)',
            border: '1px solid var(--line)', borderRadius: 18, padding: '8px 10px',
            boxShadow: '0 8px 28px rgba(15,23,42,0.08)'
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="ChalkTalk logo" width={32} height={32} style={{ borderRadius: 9 }} />
            <strong style={{ fontSize: 18, color: 'var(--navy)' }}>ChalkTalk</strong>
          </Link>
          {[
            ['Features', '/#features'],
            ['Files', '/download'],
            ['Setup', '/#setup']
          ].map(([label, href]) => (
            <motion.span key={href} className="navlink" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href={href}
                style={{
                  padding: '9px 15px', borderRadius: 11, textDecoration: 'none',
                  color: 'var(--muted)', fontWeight: 700, fontSize: 15
                }}
              >
                {label}
              </Link>
            </motion.span>
          ))}
          <span style={{ flex: 1 }} />
          <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
            <Link href="/download" className="u-btn primary sheen" style={{ padding: '10px 20px', fontSize: 15 }}>
              Download app
            </Link>
          </motion.span>
        </nav>
      </div>
    </motion.header>
  );
}
