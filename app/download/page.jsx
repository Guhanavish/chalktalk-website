import Reveal from '@/components/Reveal';
import { DownloadCard } from '@/components/DownloadCard';
import FilesLibrary from '@/components/FilesLibrary';
import StatCharts from '@/components/StatCharts';
import { getLatestRelease, listSharedFiles } from '@/lib/supabase';

export const revalidate = 120;
export const metadata = { title: 'Download — ChalkTalk' };

export default async function DownloadPage() {
  const [release, files] = await Promise.all([getLatestRelease(), listSharedFiles(200)]);
  return (
    <div className="wrap" style={{ paddingTop: 36, paddingBottom: 20 }}>
      <Reveal>
        <span className="badge">For Windows PCs & smart panels</span>
        <h1 style={{ fontSize: 38, margin: '12px 0 6px', color: 'var(--navy)' }}>Download ChalkTalk</h1>
        <p className="muted" style={{ margin: '0 0 24px', fontSize: 17 }}>
          One zip, one app file inside. Students grab class files below — sent straight from the board.
        </p>
      </Reveal>
      <Reveal delay={0.08}><DownloadCard release={release} /></Reveal>
      <div style={{ height: 28 }} />
      <Reveal>
        <h2 style={{ fontSize: 24, margin: '0 0 6px', color: 'var(--navy)' }}>Class files library</h2>
        <p className="muted" style={{ margin: '0 0 16px' }}>Notes, PDFs and slides teachers sent from the app.</p>
      </Reveal>
      <Reveal delay={0.06}><FilesLibrary files={files} /></Reveal>
      <div style={{ height: 28 }} />
      <Reveal>
        <h2 style={{ fontSize: 24, margin: '0 0 16px', color: 'var(--navy)' }}>Library stats</h2>
      </Reveal>
      <Reveal delay={0.06}><StatCharts files={files} /></Reveal>
    </div>
  );
}
