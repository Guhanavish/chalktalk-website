'use client';

import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

/** Hero entrance: anime.js timeline — split headline stagger + floating shapes loop. */
export default function HeroFX({ children }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const chars = el.querySelectorAll('.hx-char');
    const cards = el.querySelectorAll('.hx-rise');
    const blobs = el.querySelectorAll('.hx-blob');
    const tl = createTimeline({ defaults: { ease: 'outExpo' } });
    tl.add(chars, { opacity: [0, 1], y: [26, 0], delay: stagger(28), duration: 650 });
    tl.add(cards, { opacity: [0, 1], y: [30, 0], delay: stagger(110), duration: 700 }, '-=400');
    const floaters = blobs.length
      ? animate(blobs, {
          y: [-14, 14], duration: 3200, ease: 'inOutSine',
          loop: true, alternate: true, delay: stagger(400)
        })
      : null;
    return () => {
      try { tl.cancel(); } catch {}
      try { floaters && floaters.cancel(); } catch {}
    };
  }, []);

  return <div ref={root}>{children}</div>;
}

/** Split a string into per-char spans for the stagger above. */
export function SplitChars({ text, className = '' }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} className="hx-char" aria-hidden="true" style={{ display: 'inline-block', opacity: 0 }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}
